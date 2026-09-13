'use strict';

import fs from 'fs';
import path from 'path';
import { io } from 'socket.io-client';
import Stored, { Mirror } from 'canvas-stored';
import { MIRROR_IGNORE_DEFAULTS } from 'canvas-stored/src/sync/keys.js';
import { DEFAULT_SYNC_EXCLUSIONS, WORKSPACE_INTERNAL_EXCLUSIONS } from '@augmentd-labs/canvas-protocol';

const STATUS_THROTTLE_MS = 5000;
const STATUS_HEARTBEAT_MS = 60000;

/**
 * One mirrored workspace folder run by the daemon: a canvas-stored instance
 * whose `local` backend is the folder (chokidar-watched), a `canvas:hub`
 * backend speaking the sync protocol to the hub, `trash`/`conflicts` side
 * folders, and the Mirror engine reconciling between them. All state lives in
 * `<folder>/.workspace/` (mirror.json, db/stored, cache, tmp, trash,
 * conflicts) — the folder is self-describing and movable.
 *
 * `direction` (bi | pull | push, canvas-stored Mirror) comes from the mirror
 * entry. Every status report carries the (docId, version) pairs agreed since
 * the last report (`applied`); the first report after start sends the whole
 * ledger as `full` so a hub that lost its replica table rebuilds it.
 */
export class MirrorRuntime {
    #mirror;
    #hub;
    #identity;
    #logger;
    #stored = null;
    #engine = null;
    #socket = null;
    #reporter = null;
    #lastReport = 0;
    #reportTimer = null;
    #pendingApplied = [];
    #needFull = true;

    constructor({ mirror, hub, identity, logger }) {
        this.#mirror = mirror;
        this.#hub = hub;
        this.#identity = identity;
        this.#logger = logger;
    }

    get id() { return this.#mirror.id; }
    get folder() { return this.#mirror.mountpoint; }

    async start() {
        const folder = this.folder;
        const internal = path.join(folder, '.workspace');
        for (const d of ['db/stored', 'cache', 'tmp', 'trash', 'conflicts']) fs.mkdirSync(path.join(internal, d), { recursive: true });
        fs.writeFileSync(path.join(internal, 'mirror.json'), JSON.stringify({
            version: 1, mirrorId: this.#mirror.id, hub: { id: this.#hub.id, url: this.#hub.url },
            workspaceId: this.#mirror.workspaceId, workspaceName: this.#mirror.workspaceName, backend: 'workspace:home',
            deviceId: this.#identity.deviceId, client: 'daemon', createdAt: new Date().toISOString(),
            pins: this.#mirror.pins || [], ignore: this.#mirror.ignore || [], conflicts: this.#mirror.conflicts, deletes: this.#mirror.deletes,
            direction: this.#mirror.direction || 'bi',
        }, null, 2));

        const hubExclusions = await this.#fetchHubExclusions();
        this.#stored = new Stored({ root: path.join(internal, 'db', 'stored'), cache: { path: path.join(internal, 'cache') }, checksums: ['sha256'] });
        this.#stored.on('error', (err) => this.#logger.warn({ mirror: this.id, err: err?.message }, 'stored error'));
        this.#stored.addBackend('local', {
            driver: 'file', root: folder, watch: true, tempDir: '.workspace/tmp', followSymlinks: false, stabilityThreshold: 2000,
            ignored: [...new Set([...WORKSPACE_INTERNAL_EXCLUSIONS, ...DEFAULT_SYNC_EXCLUSIONS, ...hubExclusions, ...MIRROR_IGNORE_DEFAULTS, ...(this.#mirror.ignore || [])])],
        });
        this.#stored.addBackend('trash', { driver: 'file', root: path.join(internal, 'trash'), watch: false });
        this.#stored.addBackend('conflicts', { driver: 'file', root: path.join(internal, 'conflicts'), watch: false });
        this.#stored.addBackend('canvas:hub', {
            driver: 'canvas', url: this.#hub.url, apiBase: this.#hub.apiBase, token: this.#hub.token,
            workspaceId: this.#mirror.workspaceId || this.#mirror.workspaceName, backend: 'workspace:home',
            deviceId: this.#identity.deviceId, deviceName: this.#identity.deviceName, prefixes: this.#mirror.pins || [], pollInterval: 30000,
        });
        this.#engine = new Mirror(this.#stored, {
            id: this.#mirror.id, local: 'local', remote: 'canvas:hub', trash: 'trash', conflicts: 'conflicts',
            prefixes: this.#mirror.pins || [], ignore: this.#mirror.ignore || [],
            deletes: this.#mirror.deletes || 'propagate', conflictMode: this.#mirror.conflicts || 'prompt',
            direction: this.#mirror.direction || 'bi',
            deviceId: this.#identity.deviceId, deviceName: this.#identity.deviceName,
        });
        this.#needFull = true;
        this.#pendingApplied = [];
        this.#engine.on('status', () => this.#scheduleReport());
        this.#engine.on('conflict', (c) => this.#logger.info({ mirror: this.id, key: c?.key }, 'conflict recorded'));
        await this.#engine.start();
        await this.#connectSocket();
        this.#reporter = setInterval(() => this.#report().catch(() => {}), STATUS_HEARTBEAT_MS);
        this.#reporter.unref?.();
        this.#logger.info({ mirror: this.id, folder }, 'mirror started');
    }

    async stop() {
        clearInterval(this.#reporter);
        clearTimeout(this.#reportTimer);
        this.#socket?.close();
        this.#socket = null;
        await this.#engine?.stop().catch(() => {});
        await this.#stored?.stop().catch(() => {});
        this.#engine = null;
        this.#stored = null;
    }

    status() {
        const s = typeof this.#engine?.status === 'function' ? this.#engine.status() : {};
        return { id: this.id, workspace: this.#mirror.workspaceName, hub: this.#hub.id, folder: this.folder, pins: this.#mirror.pins || [], conflictsMode: this.#mirror.conflicts, direction: this.#mirror.direction || 'bi', ...s };
    }

    nudge() { this.#engine?.nudge?.(); }
    async resync() { return this.#engine?.reconcileAll?.(); }

    async #fetchHubExclusions() {
        try {
            const res = await fetch(`${this.#hub.url}${this.#hub.apiBase}/workspaces/${encodeURIComponent(this.#mirror.workspaceName)}/backends/file/workspace%3Ahome`, {
                headers: { authorization: `Bearer ${this.#hub.token}` },
            });
            const json = await res.json();
            const list = json?.payload?.effectiveExclusions;
            return Array.isArray(list) ? list.filter((p) => typeof p === 'string') : [];
        } catch { return []; }
    }

    // The relay matches subscriptions on the workspace uuid (and name, once
    // the hub stamps it); resolve the uuid so nudges reach us either way.
    async #resolveWorkspaceId() {
        if (this.#mirror.workspaceId && /^[0-9a-f-]{36}$/i.test(this.#mirror.workspaceId)) return this.#mirror.workspaceId;
        try {
            const res = await fetch(`${this.#hub.url}${this.#hub.apiBase}/workspaces/${encodeURIComponent(this.#mirror.workspaceName)}`, { headers: { authorization: `Bearer ${this.#hub.token}` } });
            const json = await res.json();
            return json?.payload?.workspace?.id || json?.payload?.id || this.#mirror.workspaceId || this.#mirror.workspaceName;
        } catch { return this.#mirror.workspaceId || this.#mirror.workspaceName; }
    }

    async #connectSocket() {
        try {
            const wsId = await this.#resolveWorkspaceId();
            const socket = io(this.#hub.url, { auth: { token: this.#hub.token }, transports: ['websocket'], reconnection: true, reconnectionDelay: 1000, reconnectionDelayMax: 30000 });
            this.#socket = socket;
            socket.on('connect', () => { socket.emit('subscribe', { channel: `workspace:${wsId}` }); this.resync().catch(() => {}); });
            socket.on('backend.changed', (e) => { if (!e?.backend || e.backend === 'workspace:home') this.nudge(); });
            socket.on('sync.conflict.resolved', () => this.nudge());
            socket.on('connect_error', (err) => this.#logger.debug?.({ mirror: this.id, err: err?.message }, 'socket connect error'));
        } catch (err) {
            this.#logger.warn({ mirror: this.id, err: err?.message }, 'socket setup failed');
        }
    }

    #scheduleReport() {
        const due = STATUS_THROTTLE_MS - (Date.now() - this.#lastReport);
        if (due <= 0) { this.#report().catch(() => {}); return; }
        if (this.#reportTimer) return;
        this.#reportTimer = setTimeout(() => { this.#reportTimer = null; this.#report().catch(() => {}); }, due);
        this.#reportTimer.unref?.();
    }

    async #report() {
        if (!this.#engine) return;
        this.#lastReport = Date.now();
        const s = this.status();
        const ws = encodeURIComponent(this.#mirror.workspaceName);
        // Protection evidence: what this replica holds. A failed report keeps
        // the delta for the next one; a full snapshot supersedes any delta.
        const engine = this.#engine;
        const full = this.#needFull;
        const delta = typeof engine.takeApplied === 'function' ? engine.takeApplied() : [];
        this.#pendingApplied = full ? [] : mergePairs(this.#pendingApplied, delta);
        const applied = full ? (typeof engine.appliedSnapshot === 'function' ? engine.appliedSnapshot() : []) : this.#pendingApplied;
        try {
            const res = await fetch(`${this.#hub.url}${this.#hub.apiBase}/workspaces/${ws}/mirrors/${encodeURIComponent(this.#identity.deviceId)}/status`, {
                method: 'POST',
                headers: { authorization: `Bearer ${this.#hub.token}`, 'content-type': 'application/json' },
                body: JSON.stringify({
                    backend: 'workspace:home', client: 'daemon', path: this.folder, prefixes: this.#mirror.pins || [],
                    cursor: Number(s.cursor) || 0, pending: Number(s.pending) || 0, failed: Number(s.failed) || 0,
                    conflicts: Number(s.conflicts) || 0, reverted: Number(s.reverted) || 0, skipped: Number(s.skipped) || 0, state: String(s.state || 'idle'),
                    direction: s.direction || 'bi',
                    lastSync: s.lastSyncAt ? new Date(s.lastSyncAt).toISOString() : undefined, lastError: s.lastError || null, version: 'canvas-edge/2',
                    ...(applied.length || full ? { applied, full } : {}),
                }),
            });
            if (res.ok) { this.#pendingApplied = []; if (full) this.#needFull = false; }
            else if (!full) { /* keep the delta */ }
        } catch {
            // offline: the delta (or the need for a full snapshot) survives until the next report
            if (!full) engine.restoreApplied?.(delta);
        }
    }
}

// Newer version per docId wins; order is irrelevant to the hub.
function mergePairs(a, b) {
    const best = new Map(a);
    for (const [docId, version] of b) if (!(best.get(docId) > version)) best.set(docId, version);
    return [...best.entries()];
}



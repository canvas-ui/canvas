'use strict';

import { execFile, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/**
 * A `fuse` unit: one canvas-fuse mirror mount supervised by this daemon
 * (docs/durable-workspaces.md, step 5). canvas-fuse stays a plain executable —
 * the on-demand namespace, content cache, pins and LRU are its own; this class
 * only spawns `canvas-fuse mount … --mirror` attached, restarts it with backoff
 * when it dies, reads `canvas-fuse status --json` for its state and unmounts
 * on stop. One process per workspace under a common root (`<root>/<folder>`),
 * several workspaces = several units in mirrors.json (`client: 'fuse',
 * managed: 'edge'`). Credentials never touch the command line: the mount
 * resolves `--remote <id>` from ~/.canvas/config/remotes.json, like the CLI.
 */

const DEFAULT_RESTART_DELAYS_MS = [5_000, 10_000, 20_000, 40_000, 60_000];
const STATUS_TTL_MS = 5_000;

export function fuseBinary(env = process.env) {
    const candidates = [env.CANVAS_FUSE_BIN, path.join(os.homedir(), '.cargo', 'bin', 'canvas-fuse')].filter(Boolean);
    for (const c of candidates) if (existsSync(c)) return c;
    return 'canvas-fuse';   // PATH lookup at spawn time
}

/** Command line for one mirror entry (attached: no `-d`, the daemon owns the lifecycle). */
export function fuseMountArgs(mirror) {
    if (!mirror?.root) throw new Error(`fuse unit ${mirror?.id || '?'}: mirror.root is required`);
    if (!mirror?.remote) throw new Error(`fuse unit ${mirror?.id || '?'}: mirror.remote is required`);
    const args = ['mount', '-w', mirror.folderName || mirror.workspaceName, mirror.root, '--remote', mirror.remote, '--mirror'];
    for (const pin of mirror.pins || []) args.push('--pin', pin);
    for (const glob of mirror.ignore || []) args.push('--ignore', glob);
    if (mirror.conflicts) args.push('--conflicts', mirror.conflicts);
    if (mirror.deletes) args.push('--deletes', mirror.deletes);
    if (mirror.cacheBudgetMb) args.push('--cache-budget-mb', String(mirror.cacheBudgetMb));
    return args;
}

export class FuseRuntime {
    #mirror;
    #logger;
    #bin;
    #child = null;
    #stopping = false;
    #restartTimer = null;
    #restarts = 0;
    #attempt = 0;
    #startedAt = null;
    #lastExit = null;
    #restartDelays;
    #statusCache = null;

    constructor({ mirror, logger, binary = null, restartDelaysMs = DEFAULT_RESTART_DELAYS_MS }) {
        this.#mirror = mirror;
        this.#logger = logger;
        this.#bin = binary || fuseBinary();
        this.#restartDelays = restartDelaysMs;
    }

    get id() { return this.#mirror.id; }
    get unit() { return 'fuse'; }
    get folder() { return this.#mirror.mountpoint || path.join(this.#mirror.root, this.#mirror.folderName || this.#mirror.workspaceName); }
    get running() { return !!this.#child && this.#child.exitCode == null && !this.#child.killed; }
    get pid() { return this.running ? this.#child.pid : null; }

    async start() {
        this.#stopping = false;
        await this.#spawn();
        this.#logger.info({ unit: this.id, mountpoint: this.folder, bin: this.#bin }, 'fuse unit started');
    }

    async #spawn() {
        const args = fuseMountArgs(this.#mirror);
        const child = spawn(this.#bin, args, { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env } });
        this.#child = child;
        this.#startedAt = Date.now();
        const log = (level) => (chunk) => { for (const line of String(chunk).split('\n')) if (line.trim()) this.#logger[level]?.({ unit: this.id }, line.trim()); };
        child.stdout?.on('data', log('debug'));
        child.stderr?.on('data', log('debug'));
        await new Promise((resolve, reject) => {
            child.once('spawn', resolve);
            child.once('error', (err) => reject(Object.assign(new Error(err.code === 'ENOENT' ? `canvas-fuse binary not found (${this.#bin}); install it or set CANVAS_FUSE_BIN` : err.message), { code: err.code })));
        });
        child.on('exit', (code, signal) => {
            if (this.#child !== child) return;
            this.#child = null;
            this.#lastExit = { code, signal, at: Date.now() };
            this.#statusCache = null;
            if (this.#stopping) return;
            // A mount that stayed up a while starts the backoff over.
            if (Date.now() - this.#startedAt > 60_000) this.#attempt = 0;
            const delay = this.#restartDelays[Math.min(this.#attempt, this.#restartDelays.length - 1)];
            this.#attempt += 1;
            this.#restarts += 1;
            this.#logger.warn({ unit: this.id, code, signal, restartInMs: delay }, 'fuse mount exited — restarting');
            this.#restartTimer = setTimeout(() => {
                this.#restartTimer = null;
                this.#spawn().catch((err) => this.#logger.error({ unit: this.id, err: err?.message }, 'fuse restart failed'));
            }, delay);
            this.#restartTimer.unref?.();
        });
    }

    /** Graceful: SIGINT (canvas-fuse unmounts on it), then SIGTERM, then a best-effort `unmount`. */
    async stop({ timeoutMs = 10_000 } = {}) {
        this.#stopping = true;
        if (this.#restartTimer) { clearTimeout(this.#restartTimer); this.#restartTimer = null; }
        const child = this.#child;
        if (child && child.exitCode == null) {
            const exited = new Promise((resolve) => child.once('exit', resolve));
            child.kill('SIGINT');
            const timer = new Promise((resolve) => setTimeout(resolve, timeoutMs));
            if (await Promise.race([exited.then(() => true), timer.then(() => false)]) === false) {
                child.kill('SIGTERM');
                await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 3_000))]);
            }
        }
        this.#child = null;
        await this.#run(['unmount', this.folder], { timeout: 15_000 }).catch(() => null);
        this.#logger.info({ unit: this.id, mountpoint: this.folder }, 'fuse unit stopped');
    }

    async #run(args, { timeout = 30_000 } = {}) {
        const { stdout } = await execFileAsync(this.#bin, args, { timeout, maxBuffer: 4 * 1024 * 1024 });
        return String(stdout || '');
    }

    /** The mount's own account (`canvas-fuse status --json` row for this mountpoint), cached briefly. */
    async mountStatus() {
        if (this.#statusCache && Date.now() - this.#statusCache.at < STATUS_TTL_MS) return this.#statusCache.row;
        let row = null;
        try {
            const parsed = JSON.parse(await this.#run(['status', '--json'], { timeout: 15_000 }) || '[]');
            const rows = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.mounts) ? parsed.mounts : []);
            const target = path.resolve(this.folder);
            row = rows.find((r) => path.resolve(r?.mountpoint || '') === target) || null;
        } catch { row = null; }
        this.#statusCache = { at: Date.now(), row };
        return row;
    }

    /** Sync snapshot; `status()` is what the control API and the CLI show. */
    status() {
        const row = this.#statusCache?.row || null;
        return {
            id: this.id,
            unit: 'fuse',
            workspace: this.#mirror.workspaceName,
            hub: this.#mirror.remote,
            folder: this.folder,
            pins: this.#mirror.pins || [],
            conflictsMode: this.#mirror.conflicts,
            direction: 'bi',
            pid: this.pid,
            running: this.running,
            restarts: this.#restarts,
            startedAt: this.#startedAt,
            lastExit: this.#lastExit,
            mount: row ? (row.status || (row.mounted ? 'ok' : 'down')) : (this.running ? 'starting' : 'down'),
            ...(row?.mirror && typeof row.mirror === 'object' ? row.mirror : {}),
        };
    }

    async refresh() { await this.mountStatus(); return this.status(); }
    nudge() { this.#run(['sync', 'now', this.folder]).catch(() => null); }
    async resync() { await this.#run(['sync', 'now', this.folder]).catch(() => null); return this.status(); }
}

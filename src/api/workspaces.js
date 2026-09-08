'use strict';

import { routes } from '@augmentd-labs/canvas-protocol';

const ws = routes.workspaces;

/** @param {import('../client.js').CanvasApiClient} c */
export function makeWorkspacesApi(c) {
    return {
        list: () => c.get(ws.collection()),
        get: (id) => c.get(ws.byId(id)),
        create: (data) => c.post(ws.collection(), data),
        update: (id, data) => c.put(ws.byId(id), data),
        delete: (id) => c.delete(ws.byId(id)),
        start: (id) => c.post(ws.start(id)),
        stop: (id) => c.post(ws.stop(id)),
        status: (id) => c.get(ws.status(id)),
        stats: (id) => c.get(ws.stats(id)),
        tree: (id) => c.get(ws.tree(id)),
        trees: (id) => c.get(ws.trees(id)),
        // Remove a path from a tree. `purge` only takes effect inside the
        // backends tree (deletes the ingested docs under the path); `destroy`
        // (implies purge) additionally deletes the mirrored resources ON the
        // backend (rw backends only). Elsewhere/by default the documents are
        // kept and only the folder is dropped.
        removeTreePath: (id, treeName, path, { recursive = false, purge = false, destroy = false } = {}) =>
            c.delete(ws.treePath(id, treeName, path), {
                params: { recursive, ...(purge ? { purge: true } : {}), ...(destroy ? { destroy: true } : {}) }
            }),
        documents: (id, params) => c.get(ws.documents(id), { params }),
        insertDocuments: (id, body) => c.post(ws.documents(id), body),
        // Upload raw bytes (Buffer, Blob or a readable stream) into the
        // workspace blob store; returns { url: 'stored://workspace:data/<key>',
        // key, checksum, size }. Streams stay streams client-side too.
        uploadBlob: (id, data) =>
            c.request('POST', ws.blobs(id), {
                data,
                headers: { 'Content-Type': 'application/octet-stream' }
            }),
        dotfiles: {
            list: (id, params) => c.get(ws.dotfiles(id), { params }),
            create: (id, dotfiles, opts = {}) =>
                c.post(ws.dotfiles(id), {
                    dotfiles: Array.isArray(dotfiles) ? dotfiles : [dotfiles],
                    ...opts
                }),
            update: (id, docs, opts = {}) => c.put(ws.dotfiles(id), { documents: docs, ...opts }),
            delete: (id, docIds) => c.delete(ws.dotfiles(id), { data: docIds }),
            status: (id) => c.get(ws.dotfilesStatus(id)),
            init: (id) => c.post(ws.dotfilesInit(id))
        },
        // Unified backend/connector API (/:id/backends). Storage drivers:
        // 'file' (local folder; 'fs' is accepted as an alias server-side),
        // 'cacache', 's3'; message connectors: 'imap'.
        backends: {
            list: (id, driver = null) => c.get(ws.backends(id, driver)),
            get: (id, driver, address) => c.get(ws.backend(id, driver, address)),
            add: (id, driver, body) => c.post(ws.backends(id, driver), body),
            update: (id, driver, address, body) => c.patch(ws.backend(id, driver, address), body),
            remove: (id, driver, address) => c.delete(ws.backend(id, driver, address)),
            sync: (id, driver, address) => c.post(ws.backendSync(id, driver, address)),
            usage: (id, driver, address) => c.get(ws.backendUsage(id, driver, address)),
            documents: (id, driver, address, params = {}) => c.get(ws.backendDocuments(id, driver, address), { params }),
            // Keyed objects + change feed (device-mirror protocol, see
            // canvas-server docs/sync-protocol.md). `putObject` streams raw
            // bytes; preconditions travel as headers (If-Match, If-None-Match,
            // X-Canvas-Sha256, X-Canvas-Mtime, X-Canvas-Origin, X-Canvas-Conflict-Of).
            objects: (id, driver, address, params = {}) => c.get(ws.backendObjects(id, driver, address), { params }),
            changes: (id, driver, address, params = {}) => c.get(ws.backendChanges(id, driver, address), { params }),
            putObject: (id, driver, address, key, data, { headers = {}, params } = {}) =>
                c.request('PUT', ws.backendObject(id, driver, address, key), {
                    data,
                    ...(params ? { params } : {}),
                    headers: { 'Content-Type': 'application/octet-stream', ...headers }
                }),
            deleteObject: (id, driver, address, key, { ifMatch, origin } = {}) =>
                c.delete(ws.backendObject(id, driver, address, key), {
                    headers: {
                        ...(ifMatch ? { 'If-Match': ifMatch } : {}),
                        ...(origin ? { 'X-Canvas-Origin': origin } : {})
                    }
                }),
            renameObject: (id, driver, address, body) => c.post(ws.backendObjectRename(id, driver, address), body)
        },
        // Device mirrors + the sync conflict inbox.
        sync: {
            mirrors: (id) => c.get(ws.mirrors(id)),
            reportMirror: (id, deviceId, body) => c.post(ws.mirrorStatus(id, deviceId), body),
            forgetMirror: (id, deviceId) => c.delete(ws.mirror(id, deviceId)),
            conflicts: (id) => c.get(ws.syncConflicts(id)),
            resolveConflict: (id, docId, keep) => c.post(ws.syncConflictResolve(id, docId), { keep })
        },
        hooks: {
            list: (id) => c.get(ws.hooks(id)),
            get: (id, hookPath) => c.get(ws.hook(id, hookPath)),
            set: (id, hookPath, content) => c.put(ws.hook(id, hookPath), { content }),
            delete: (id, hookPath) => c.delete(ws.hook(id, hookPath)),
            runs: (id, params = {}) => c.get(ws.hookRuns(id), { params }),
            explain: (id, body) => c.post(ws.hooksExplain(id), body),
            backfill: (id, body) => c.post(ws.hooksBackfill(id), body),
            replay: (id, runId) => c.post(ws.hookReplay(id, runId))
        }
    };
}

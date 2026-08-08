'use strict';

import { routes } from '@canvas-os/protocol';

const ctx = routes.contexts;

/** @param {import('../client.js').CanvasApiClient} c */
export function makeContextsApi(c) {
    return {
        list: () => c.get(ctx.collection()),
        get: (id) => c.get(ctx.byId(id)),
        create: (data) => c.post(ctx.collection(), data),
        update: (id, data) => c.put(ctx.byId(id), data),
        delete: (id) => c.delete(ctx.byId(id)),
        tree: (id) => c.get(ctx.tree(id)),
        documents: (id, params) => c.get(ctx.documents(id), { params }),
        insertDocuments: (id, body) => c.post(ctx.documents(id), body),
        // Upload raw bytes into the context's backing workspace blob store;
        // returns { url: 'stored://workspace:data/<key>', key, checksum, size,
        // metadata }.
        uploadBlob: (id, data) =>
            c.request('POST', ctx.blobs(id), {
                data,
                headers: { 'Content-Type': 'application/octet-stream' }
            }),
        dotfiles: (id) => c.get(ctx.dotfiles(id))
    };
}

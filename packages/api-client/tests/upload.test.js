'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFile, rm } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { CanvasApiClient } from '@augmentd-labs/canvas-api-client';
import { startServer } from './_helpers.js';

function uploadServer() {
    return startServer((req, res, body) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                status: 'success',
                statusCode: 200,
                message: 'ok',
                payload: {
                    size: body.length,
                    sha256: createHash('sha256').update(body).digest('hex'),
                    contentType: req.headers['content-type']
                },
                count: null,
                totalCount: null
            })
        );
    });
}

test('uploadBlob with Buffer: octet-stream, bytes intact', async () => {
    const srv = await uploadServer();
    try {
        const api = new CanvasApiClient({ baseUrl: srv.baseUrl, token: 't' });
        const data = randomBytes(64 * 1024);
        const out = await api.workspaces.uploadBlob('w1', data);
        assert.equal(out.size, data.length);
        assert.equal(out.sha256, createHash('sha256').update(data).digest('hex'));
        assert.equal(out.contentType, 'application/octet-stream');
        assert.equal(srv.requests[0].url, '/rest/v2/workspaces/w1/blobs');
    } finally {
        await srv.close();
    }
});

test('uploadBlob with a Node Readable (fs stream): streams via duplex half, bytes intact', async () => {
    const srv = await uploadServer();
    const tmp = join(tmpdir(), `canvas-upload-test-${process.pid}.bin`);
    const data = randomBytes(256 * 1024);
    await writeFile(tmp, data);
    try {
        const api = new CanvasApiClient({ baseUrl: srv.baseUrl, token: 't' });
        const out = await api.contexts.uploadBlob('c1', createReadStream(tmp));
        assert.equal(out.size, data.length);
        assert.equal(out.sha256, createHash('sha256').update(data).digest('hex'));
        assert.equal(out.contentType, 'application/octet-stream');
    } finally {
        await srv.close();
        await rm(tmp, { force: true });
    }
});

test('uploadBlob with a Blob', async () => {
    const srv = await uploadServer();
    try {
        const api = new CanvasApiClient({ baseUrl: srv.baseUrl, token: 't' });
        const bytes = randomBytes(1024);
        const out = await api.workspaces.uploadBlob('w1', new Blob([bytes]));
        assert.equal(out.size, bytes.length);
        assert.equal(out.sha256, createHash('sha256').update(bytes).digest('hex'));
    } finally {
        await srv.close();
    }
});

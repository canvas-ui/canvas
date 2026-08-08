'use strict';

import { createServer } from 'node:http';

/**
 * Minimal capture server for client tests. `handler(req, res, body)` decides
 * the response; every request is recorded on `server.requests`.
 */
export async function startServer(handler) {
    const requests = [];
    const server = createServer((req, res) => {
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', () => {
            const body = Buffer.concat(chunks);
            requests.push({ method: req.method, url: req.url, headers: req.headers, body });
            handler(req, res, body);
        });
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    return {
        baseUrl: `http://127.0.0.1:${port}`,
        requests,
        close: () => new Promise((resolve) => server.close(resolve))
    };
}

export function sendEnvelope(res, { status = 'success', statusCode = 200, message = 'ok', payload = null, count = null, totalCount = null, code } = {}) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status, statusCode, message, payload, count, totalCount, ...(code ? { code } : {}) }));
}

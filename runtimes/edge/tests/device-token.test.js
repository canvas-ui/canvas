'use strict';

import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';

const home = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-devtoken-'));
process.env.CANVAS_EDGE_HOME = home;
process.env.CANVAS_DEVICE_ID = 'nas-test';
const env = await import('../src/env.js');

const calls = [];
const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
        calls.push({ url: req.url, auth: req.headers.authorization, body: JSON.parse(body || '{}') });
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ status: 'success', payload: { deviceId: JSON.parse(body).deviceId, token: 'canvas-device-xyz' } }));
    });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}`;

after(() => { server.close(); fs.rmSync(home, { recursive: true, force: true }); delete process.env.CANVAS_DEVICE_ID; });

test('an env-seeded remote registers once as a device and keeps the device token', async () => {
    env.ensureEnvConfig({ CANVAS_HUB_URL: url, CANVAS_HUB_TOKEN: 'canvas-user', CANVAS_WORKSPACE: 'augmentd' });
    assert.equal(env.hubFor('hub').deviceId, null);
    const hub = await env.ensureDeviceToken('hub');
    assert.equal(hub.deviceId, 'nas-test');
    assert.equal(hub.token, 'canvas-device-xyz');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, '/rest/v2/auth/devices/register');
    assert.equal(calls[0].auth, 'Bearer canvas-user');
    assert.equal(calls[0].body.deviceId, 'nas-test');
    assert.equal(calls[0].body.type, 'edge');
    // Second start: no re-registration, env re-seed keeps the device block.
    await env.ensureDeviceToken('hub');
    env.ensureEnvConfig({ CANVAS_HUB_URL: url, CANVAS_HUB_TOKEN: 'canvas-user', CANVAS_WORKSPACE: 'augmentd' });
    assert.equal(calls.length, 1);
    assert.equal(env.hubFor('hub').token, 'canvas-device-xyz');
});

test('a CLI-managed remote (no source:env) is left alone', async () => {
    const remotes = JSON.parse(fs.readFileSync(env.EDGE_PATHS.remotes, 'utf8'));
    remotes.cli = { url, auth: { token: 'canvas-user' } };
    fs.writeFileSync(env.EDGE_PATHS.remotes, JSON.stringify(remotes));
    const hub = await env.ensureDeviceToken('cli');
    assert.equal(hub.deviceId, null);
    assert.equal(calls.length, 1);
});

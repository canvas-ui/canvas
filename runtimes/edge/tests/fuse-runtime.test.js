'use strict';

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { FuseRuntime, fuseMountArgs } from '../src/fuse-runtime.js';

// A stand-in canvas-fuse: `mount` stays up until SIGINT/SIGTERM, `status --json`
// reports the mount, `unmount`/`sync` succeed. Records every invocation.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-fuse-'));
const calls = path.join(dir, 'calls.log');
const fake = path.join(dir, 'fake-fuse');
fs.writeFileSync(fake, `#!/usr/bin/env bash
echo "$@" >> "${calls}"
case "$1" in
  mount) trap 'exit 0' INT TERM; while true; do sleep 0.2; done ;;
  status) echo '[{"mountpoint":"${path.join(dir, 'root', 'Universe')}","status":"ok","alive":true,"mounted":true,"mirror":{"state":"online","pending":2}}]' ;;
  *) exit 0 ;;
esac
`);
fs.chmodSync(fake, 0o755);
const mirror = { id: 'admin@dev/universe', remote: 'admin@dev', workspaceName: 'universe', folderName: 'Universe', root: path.join(dir, 'root'), pins: ['Docs/**'], conflicts: 'rename', client: 'fuse', managed: 'edge' };
const logs = [];
const logger = { info: (o, m) => logs.push(['info', m, o]), warn: (o, m) => logs.push(['warn', m, o]), error: (o, m) => logs.push(['error', m, o]), debug: () => {} };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const waitFor = async (fn, ms = 5000) => { const until = Date.now() + ms; while (Date.now() < until) { if (await fn()) return true; await sleep(25); } return fn(); };

before(() => fs.mkdirSync(mirror.root, { recursive: true }));
after(() => fs.rmSync(dir, { recursive: true, force: true }));

test('mount args: attached, --remote (no credentials), --mirror, pins/conflicts', () => {
    assert.deepEqual(fuseMountArgs(mirror), ['mount', '-w', 'Universe', mirror.root, '--remote', 'admin@dev', '--mirror', '--pin', 'Docs/**', '--conflicts', 'rename']);
    assert.throws(() => fuseMountArgs({ id: 'x', remote: 'r' }), /root/);
});

test('start → running child; status merges the mount\'s own report; crash → restart with backoff; stop → SIGINT + unmount, no restart', async () => {
    const rt = new FuseRuntime({ mirror, logger, binary: fake, restartDelaysMs: [100, 100] });
    await rt.start();
    assert.equal(rt.running, true);
    const pid1 = rt.pid;
    assert.ok(pid1 > 0);
    const st = await rt.refresh();
    assert.equal(st.unit, 'fuse');
    assert.equal(st.mount, 'ok');
    assert.equal(st.state, 'online');
    assert.equal(st.pending, 2);
    assert.equal(st.folder, path.join(mirror.root, 'Universe'));

    // Kill the mount from outside: the unit brings it back.
    process.kill(pid1, 'SIGKILL');
    await waitFor(() => rt.running && rt.pid !== pid1);
    // The restarted stub must have logged its invocation before we stop it.
    await waitFor(() => fs.readFileSync(calls, 'utf8').split('\n').filter((l) => l.startsWith('mount ')).length === 2);
    assert.equal(rt.status().restarts, 1);
    assert.equal(rt.status().lastExit.signal, 'SIGKILL');
    assert.ok(logs.some(([l, m]) => l === 'warn' && /restarting/.test(m)));

    const pid2 = rt.pid;
    await rt.stop();
    assert.equal(rt.running, false);
    await sleep(300);
    assert.equal(rt.running, false, 'no restart after stop');
    assert.throws(() => process.kill(pid2, 0), 'child is gone');
    const seen = fs.readFileSync(calls, 'utf8').trim().split('\n');
    assert.equal(seen.filter((l) => l.startsWith('mount ')).length, 2);
    assert.ok(seen.some((l) => l === `unmount ${path.join(mirror.root, 'Universe')}`));
});

test('a missing binary fails start() with a clear message', async () => {
    const rt = new FuseRuntime({ mirror, logger, binary: path.join(dir, 'nope') });
    await assert.rejects(() => rt.start(), /canvas-fuse binary not found/);
});

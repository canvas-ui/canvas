'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routes } from '@augmentd-labs/canvas-protocol';

// Parity contract: these strings must match what the pre-monorepo cli
// (src/core/transport/rest.js) sent. Encode driver/address/treeName;
// hook paths, tree paths and schema ids stay raw.

test('auth routes', () => {
    assert.equal(routes.auth.login(), '/auth/login');
    assert.equal(routes.auth.token('tok_1'), '/auth/tokens/tok_1');
    assert.equal(routes.auth.tokenRefresh(), '/auth/token/refresh');
    assert.equal(routes.auth.deviceRegister(), '/auth/devices/register');
});

test('extension-consumer routes: raw-id interpolation, pre-encode when needed', () => {
    assert.equal(routes.workspaces.documentsRemove('ws1'), '/workspaces/ws1/documents/remove');
    assert.equal(routes.workspaces.treeByName('ws1', 'context'), '/workspaces/ws1/trees/context');
    // callers that historically encoded ids keep doing so before the builder
    assert.equal(routes.workspaces.treeByName(encodeURIComponent('my ws'), 'context'), '/workspaces/my%20ws/trees/context');
    assert.equal(routes.contexts.treePaths('c1'), '/contexts/c1/tree/paths');
    assert.equal(routes.contexts.document('c1', 42), '/contexts/c1/documents/42');
    assert.equal(routes.contexts.documentsRemove('c1'), '/contexts/c1/documents/remove');
});

test('workspace collection/lifecycle routes', () => {
    assert.equal(routes.workspaces.collection(), '/workspaces');
    assert.equal(routes.workspaces.byId('ws1'), '/workspaces/ws1');
    assert.equal(routes.workspaces.start('ws1'), '/workspaces/ws1/start');
    assert.equal(routes.workspaces.documents('ws1'), '/workspaces/ws1/documents');
    assert.equal(routes.workspaces.blobs('ws1'), '/workspaces/ws1/blobs');
});

test('treePath: treeName encoded, path raw with normalized leading slash', () => {
    assert.equal(
        routes.workspaces.treePath('ws1', 'my tree', '/a/b c/d'),
        '/workspaces/ws1/trees/my%20tree/path/a/b c/d'
    );
    // missing leading slash gets one; empty path becomes '/'
    assert.equal(routes.workspaces.treePath('ws1', 't', 'a/b'), '/workspaces/ws1/trees/t/path/a/b');
    assert.equal(routes.workspaces.treePath('ws1', 't', ''), '/workspaces/ws1/trees/t/path/');
});

test('backends: driver and address encoded', () => {
    assert.equal(routes.workspaces.backends('ws1'), '/workspaces/ws1/backends');
    assert.equal(routes.workspaces.backends('ws1', 's3'), '/workspaces/ws1/backends/s3');
    assert.equal(
        routes.workspaces.backend('ws1', 'file', '/mnt/data dir'),
        '/workspaces/ws1/backends/file/%2Fmnt%2Fdata%20dir'
    );
    assert.equal(
        routes.workspaces.backendSync('ws1', 's3', 'bucket/prefix'),
        '/workspaces/ws1/backends/s3/bucket%2Fprefix/sync'
    );
});

test('hooks: hookPath stays raw (hierarchical, server splat-routed)', () => {
    assert.equal(routes.workspaces.hook('ws1', 'on-insert/run.js'), '/workspaces/ws1/hooks/on-insert/run.js');
    assert.equal(routes.workspaces.hookRuns('ws1'), '/workspaces/ws1/hooks/runs');
    assert.equal(routes.workspaces.hookReplay('ws1', 'r42'), '/workspaces/ws1/hooks/runs/r42/replay');
});

test('contexts, agents, roles', () => {
    assert.equal(routes.contexts.byId('c1'), '/contexts/c1');
    assert.equal(routes.contexts.blobs('c1'), '/contexts/c1/blobs');
    assert.equal(routes.contexts.url('c1'), '/contexts/c1/url');
    assert.equal(routes.agents.prompt('a1'), '/agents/a1/prompt');
    assert.equal(routes.roles.byId('r1'), '/roles/r1');
});

test('schemas: hierarchical ids stay raw; .json variant', () => {
    assert.equal(routes.schemas.collection(), '/schemas');
    assert.equal(routes.schemas.descriptor('data/schema/message/email'), '/schemas/data/schema/message/email');
    assert.equal(routes.schemas.json('data/schema/note'), '/schemas/data/schema/note.json');
});

test('ping', () => {
    assert.equal(routes.ping(), '/ping');
});

import { test as syncTest } from 'node:test';
import syncAssert from 'node:assert/strict';
import { routes as syncRoutes } from '../src/index.js';

syncTest('sync protocol routes: object keys keep slashes, encode segments', () => {
    const ws = syncRoutes.workspaces;
    syncAssert.equal(ws.backendObjects('u', 'file', 'workspace:home'), '/workspaces/u/backends/file/workspace%3Ahome/objects');
    syncAssert.equal(ws.backendObject('u', 'file', 'workspace:home', '/UI/a b#1.png'), '/workspaces/u/backends/file/workspace%3Ahome/objects/UI/a%20b%231.png');
    syncAssert.equal(ws.backendObjectRename('u', 'file', 'workspace:home'), '/workspaces/u/backends/file/workspace%3Ahome/objects/rename');
    syncAssert.equal(ws.backendChanges('u', 'file', 'workspace:home'), '/workspaces/u/backends/file/workspace%3Ahome/changes');
    syncAssert.equal(ws.mirrorStatus('u', 'dev 1'), '/workspaces/u/mirrors/dev%201/status');
    syncAssert.equal(ws.syncConflictResolve('u', 100007), '/workspaces/u/sync/conflicts/100007/resolve');
});

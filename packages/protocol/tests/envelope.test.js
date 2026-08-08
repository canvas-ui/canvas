'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    STATUS_SUCCESS,
    STATUS_ERROR,
    isEnvelope,
    WORKSPACE_NOT_ACTIVE,
    WORKSPACE_NOT_ACTIVE_MESSAGE,
    isWorkspaceNotActive
} from '@canvas-os/protocol';

test('status constants match the wire values', () => {
    assert.equal(STATUS_SUCCESS, 'success');
    assert.equal(STATUS_ERROR, 'error');
});

test('isEnvelope truth table', () => {
    // Real envelope, as ResponseObject.getResponse() serializes it
    assert.equal(
        isEnvelope({ status: 'success', statusCode: 200, message: 'ok', payload: [], count: 0, totalCount: 0 }),
        true
    );
    assert.equal(isEnvelope({ status: 'error', payload: null }), true);
    // payload present but no status: NOT an envelope (deliberate tightening
    // vs the historical cli check — documented in envelope.js)
    assert.equal(isEnvelope({ payload: 42 }), false);
    // status present but no payload
    assert.equal(isEnvelope({ status: 'success' }), false);
    // non-objects and arrays
    assert.equal(isEnvelope(null), false);
    assert.equal(isEnvelope(undefined), false);
    assert.equal(isEnvelope('payload'), false);
    assert.equal(isEnvelope(42), false);
    assert.equal(isEnvelope([{ status: 'success', payload: 1 }]), false);
});

test('WORKSPACE_NOT_ACTIVE constants are the exact server strings', () => {
    assert.equal(WORKSPACE_NOT_ACTIVE, 'WORKSPACE_NOT_ACTIVE');
    assert.equal(WORKSPACE_NOT_ACTIVE_MESSAGE, 'Workspace is not active. Start the workspace first.');
});

test('isWorkspaceNotActive: coded envelope', () => {
    assert.equal(
        isWorkspaceNotActive({ status: 'error', statusCode: 409, message: WORKSPACE_NOT_ACTIVE_MESSAGE, code: WORKSPACE_NOT_ACTIVE }),
        true
    );
    // code alone is enough
    assert.equal(isWorkspaceNotActive({ code: 'WORKSPACE_NOT_ACTIVE' }), true);
});

test('isWorkspaceNotActive: legacy message forms (servers predating `code`)', () => {
    assert.equal(isWorkspaceNotActive({ message: 'Workspace is not active. Start the workspace first.' }), true);
    assert.equal(isWorkspaceNotActive({ message: 'workspace not active' }), true);
});

test('isWorkspaceNotActive: negatives', () => {
    // Same rule as the server: agent lifecycle errors must not match
    assert.equal(isWorkspaceNotActive({ message: 'Agent is not active' }), false);
    assert.equal(isWorkspaceNotActive({ message: 'Request failed' }), false);
    assert.equal(isWorkspaceNotActive({ code: 'SOME_OTHER_CODE' }), false);
    assert.equal(isWorkspaceNotActive(null), false);
    assert.equal(isWorkspaceNotActive(undefined), false);
    assert.equal(isWorkspaceNotActive({}), false);
});

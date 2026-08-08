'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unwrap, CanvasError } from '@canvas/api-client';
import { WORKSPACE_NOT_ACTIVE, WORKSPACE_NOT_ACTIVE_MESSAGE, isWorkspaceNotActive } from '@canvas/protocol';

test('success envelope returns payload', () => {
    const payload = { a: 1 };
    assert.equal(unwrap({ status: 'success', statusCode: 200, message: 'ok', payload, count: null, totalCount: null }), payload);
});

test('error envelope throws CanvasError with string code + numeric statusCode', () => {
    let err;
    try {
        unwrap({
            status: 'error',
            statusCode: 409,
            message: WORKSPACE_NOT_ACTIVE_MESSAGE,
            payload: null,
            count: null,
            totalCount: null,
            code: WORKSPACE_NOT_ACTIVE
        });
        assert.fail('should throw');
    } catch (e) {
        err = e;
    }
    assert.ok(err instanceof CanvasError);
    assert.equal(err.code, 'WORKSPACE_NOT_ACTIVE');
    assert.equal(typeof err.code, 'string');
    assert.equal(err.statusCode, 409);
    assert.equal(err.status, 409);
    assert.equal(isWorkspaceNotActive(err), true);
});

test('error envelope without code defaults to CANVAS_ERROR', () => {
    let err;
    try {
        unwrap({ status: 'error', statusCode: 500, message: 'boom', payload: null });
        assert.fail('should throw');
    } catch (e) {
        err = e;
    }
    assert.ok(err instanceof CanvasError);
    assert.equal(err.code, 'CANVAS_ERROR');
    assert.equal(err.statusCode, 500);
});

test('non-envelope bodies pass through', () => {
    assert.equal(unwrap('text'), 'text');
    assert.equal(unwrap(null), null);
    assert.deepEqual(unwrap([1, 2]), [1, 2]);
    // payload key alone is not an envelope (needs status too)
    assert.deepEqual(unwrap({ payload: 1 }), { payload: 1 });
});

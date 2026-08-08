'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CanvasError, AuthError, NotFoundError, isNetworkError } from '@canvas/api-client';

test('instanceof chains hold (cli error handling depends on them)', () => {
    const auth = new AuthError('no');
    assert.ok(auth instanceof AuthError);
    assert.ok(auth instanceof CanvasError);
    assert.ok(auth instanceof Error);
    assert.equal(auth.code, 'AUTH');
    assert.equal(auth.status, 401);
    assert.equal(auth.statusCode, 401);

    const nf = new NotFoundError('gone');
    assert.ok(nf instanceof CanvasError);
    assert.equal(nf.status, 404);
});

test('CanvasError field mapping: code string, statusCode/status aliases', () => {
    const e = new CanvasError('m', { code: 'X', statusCode: 409 });
    assert.equal(e.code, 'X');
    assert.equal(e.statusCode, 409);
    assert.equal(e.status, 409);
    const e2 = new CanvasError('m', { status: 400 });
    assert.equal(e2.statusCode, 400);
    assert.equal(e2.code, 'CANVAS_ERROR');
});

test('isNetworkError: node/undici codes anywhere in the cause chain', () => {
    const inner = Object.assign(new Error('connect ECONNREFUSED 127.0.0.1:8001'), { code: 'ECONNREFUSED' });
    const wrapped = new CanvasError('fetch failed', { cause: inner });
    assert.equal(isNetworkError(wrapped), true);
    assert.equal(isNetworkError(inner), true);

    const dns = Object.assign(new Error('getaddrinfo ENOTFOUND nope.invalid'), { code: 'ENOTFOUND' });
    assert.equal(isNetworkError(new CanvasError('x', { cause: dns })), true);
});

test('isNetworkError: AggregateError members (happy-eyeballs) are walked', () => {
    const agg = new AggregateError(
        [Object.assign(new Error('v4 refused'), { code: 'ECONNREFUSED' })],
        'all attempts failed'
    );
    const fetchFailed = new TypeError('fetch failed');
    fetchFailed.cause = agg;
    assert.equal(isNetworkError(new CanvasError('fetch failed', { cause: fetchFailed })), true);
});

test('isNetworkError: Bun fetch code table', () => {
    for (const code of ['ConnectionRefused', 'ConnectionClosed', 'FailedToOpenSocket', 'DNSException', 'Timeout']) {
        const e = Object.assign(new Error(code), { code });
        assert.equal(isNetworkError(new CanvasError('x', { cause: e })), true, code);
    }
});

test('isNetworkError: negatives', () => {
    assert.equal(isNetworkError(new CanvasError('Request failed', { code: 'CANVAS_ERROR', statusCode: 500 })), false);
    assert.equal(isNetworkError(new Error('plain')), false);
    assert.equal(isNetworkError(null), false);
    assert.equal(isNetworkError(undefined), false);
    // envelope-level 409 is not a network problem
    assert.equal(isNetworkError(new CanvasError('ws', { code: 'WORKSPACE_NOT_ACTIVE', statusCode: 409 })), false);
});

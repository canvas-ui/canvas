'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeJwtPayload, getJwtExpiryMs } from '@augmentd-labs/canvas-protocol';

function makeJwt(payload) {
    const b64url = (obj) =>
        Buffer.from(JSON.stringify(obj)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.signature`;
}

test('decodeJwtPayload: valid JWT round-trips the payload', () => {
    const payload = { sub: 'u1', exp: 1893456000, iat: 1893369600 };
    assert.deepEqual(decodeJwtPayload(makeJwt(payload)), payload);
});

test('decodeJwtPayload: base64url characters survive decoding', () => {
    const payload = { name: 'ž?>~', n: [1, 2, 3] };
    assert.deepEqual(decodeJwtPayload(makeJwt(payload)), payload);
});

test('decodeJwtPayload: opaque canvas-* tokens and junk return null', () => {
    assert.equal(decodeJwtPayload('canvas-abc123def456'), null);
    assert.equal(decodeJwtPayload('a.b'), null);
    assert.equal(decodeJwtPayload('not.a.jwt'), null);
    assert.equal(decodeJwtPayload(null), null);
    assert.equal(decodeJwtPayload(undefined), null);
    assert.equal(decodeJwtPayload(42), null);
});

test('getJwtExpiryMs: exp in seconds → ms epoch; missing exp → null', () => {
    assert.equal(getJwtExpiryMs(makeJwt({ exp: 1893456000 })), 1893456000000);
    assert.equal(getJwtExpiryMs(makeJwt({ sub: 'u1' })), null);
    assert.equal(getJwtExpiryMs('canvas-opaque-token'), null);
});

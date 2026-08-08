'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTabDoc } from '@augmentd-labs/canvas-schemas';

test('parity: url + title emits exactly the historical cli shape', () => {
    assert.deepEqual(buildTabDoc('https://example.com', { title: 'Example' }), {
        schema: 'data/schema/tab',
        schemaVersion: '2.0',
        data: { url: 'https://example.com', title: 'Example' }
    });
});

test('parity: url only', () => {
    assert.deepEqual(buildTabDoc('https://example.com'), {
        schema: 'data/schema/tab',
        schemaVersion: '2.0',
        data: { url: 'https://example.com' }
    });
});

test('superset: pinned=false is still emitted (extension semantics)', () => {
    assert.deepEqual(buildTabDoc('https://x', { title: 'X', pinned: false, favIconUrl: 'https://x/i.png', timestamp: '2026-08-08T00:00:00.000Z' }), {
        schema: 'data/schema/tab',
        schemaVersion: '2.0',
        data: {
            url: 'https://x',
            title: 'X',
            pinned: false,
            favIconUrl: 'https://x/i.png',
            timestamp: '2026-08-08T00:00:00.000Z'
        }
    });
});

test('superset: metadata only when non-empty', () => {
    assert.deepEqual(buildTabDoc('https://x', { metadata: {} }).metadata, undefined);
    assert.deepEqual(buildTabDoc('https://x', { metadata: { contentType: 'application/json' } }).metadata, {
        contentType: 'application/json'
    });
});

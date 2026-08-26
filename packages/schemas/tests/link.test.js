'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLinkDoc } from '@augmentd-labs/canvas-schemas';

test('minimal: any URI scheme, not just http', () => {
    assert.deepEqual(buildLinkDoc('git+ssh://git@github.com/me/dotfiles'), {
        schema: 'data/schema/link',
        schemaVersion: '3.0',
        data: { uri: 'git+ssh://git@github.com/me/dotfiles' }
    });
});

test('a uri without a scheme is rejected here rather than by the server', () => {
    assert.throws(() => buildLinkDoc('example.com'), /missing scheme/);
    assert.throws(() => buildLinkDoc(''), /requires a uri/);
    assert.throws(() => buildLinkDoc(undefined), /requires a uri/);
});

test('tags are emitted twice on purpose: schema field and filterable feature', () => {
    const doc = buildLinkDoc('https://example.com', { tags: ['ref', 'ref', ' '] });
    assert.deepEqual(doc.data.tags, ['ref']);
    assert.deepEqual(doc.metadata, { features: ['tag/ref'] });
});

test('optional fields only appear when provided', () => {
    const doc = buildLinkDoc('https://x.dev', {
        label: 'X', description: 'd', type: 'repo', category: 'work',
        properties: { stars: 3 }, lastAccessedAt: '2026-08-26T00:00:00.000Z'
    });
    assert.deepEqual(doc.data, {
        uri: 'https://x.dev', label: 'X', description: 'd', type: 'repo',
        category: 'work', properties: { stars: 3 },
        lastAccessedAt: '2026-08-26T00:00:00.000Z'
    });
    assert.equal('metadata' in doc, false);
    assert.equal('properties' in buildLinkDoc('https://x.dev', { properties: {} }).data, false);
});

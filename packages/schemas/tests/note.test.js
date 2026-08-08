'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildNoteDoc } from '@augmentd-labs/canvas-schemas';

// Parity fixtures: literal outputs of the pre-monorepo cli builder
// (canvas-cli src/modules/workspace/lib/docbuilders.js).

test('parity: content + title emits exactly the historical cli shape', () => {
    assert.deepEqual(buildNoteDoc('hello world', { title: 'Greeting' }), {
        schema: 'data/schema/note',
        schemaVersion: '2.0',
        data: { content: 'hello world', title: 'Greeting' }
    });
});

test('parity: content only — no title key, no metadata key, no comment key', () => {
    assert.deepEqual(buildNoteDoc('just content'), {
        schema: 'data/schema/note',
        schemaVersion: '2.0',
        data: { content: 'just content' }
    });
    // undefined title (cli passes flags.title verbatim) behaves as absent
    assert.deepEqual(buildNoteDoc('x', { title: undefined }), {
        schema: 'data/schema/note',
        schemaVersion: '2.0',
        data: { content: 'x' }
    });
});

test('superset: comment is top-level, tags land in metadata.features', () => {
    assert.deepEqual(buildNoteDoc('body', { title: 'T', comment: 'ctx', tags: ['a', 'b'] }), {
        schema: 'data/schema/note',
        schemaVersion: '2.0',
        comment: 'ctx',
        data: { content: 'body', title: 'T' },
        metadata: { features: ['tag/a', 'tag/b'] }
    });
});

test('superset: geo and extra metadata merge; empty tag list emits no features', () => {
    assert.deepEqual(buildNoteDoc('body', { geo: { lat: 1, lon: 2 }, metadata: { source: 'test' }, tags: [] }), {
        schema: 'data/schema/note',
        schemaVersion: '2.0',
        data: { content: 'body' },
        metadata: { geo: { lat: 1, lon: 2 }, source: 'test' }
    });
});

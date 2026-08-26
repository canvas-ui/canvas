'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildTaskDoc } from '@augmentd-labs/canvas-schemas';

test('minimal: title only — no invented status, no metadata key', () => {
    assert.deepEqual(buildTaskDoc('Water the plants'), {
        schema: 'data/schema/task',
        schemaVersion: '3.0',
        data: { title: 'Water the plants' }
    });
});

test('status and the legacy completed flag are passed through, not derived', () => {
    // synapsd's Task normalizes the pair on parse; a builder that guessed here
    // would fight the engine.
    assert.deepEqual(buildTaskDoc('T', { status: 'in-progress' }).data,
        { title: 'T', status: 'in-progress' });
    assert.deepEqual(buildTaskDoc('T', { completed: false }).data,
        { title: 'T', completed: false });
});

test('dueDate accepts a Date or an ISO string and emits ISO', () => {
    const iso = '2026-09-01T10:00:00.000Z';
    assert.equal(buildTaskDoc('T', { dueDate: new Date(iso) }).data.dueDate, iso);
    assert.equal(buildTaskDoc('T', { dueDate: iso }).data.dueDate, iso);
    assert.throws(() => buildTaskDoc('T', { dueDate: 'tomorrow' }), /Invalid dueDate/);
});

test('priority is the RFC 5545 1-9 scale and is validated locally', () => {
    assert.equal(buildTaskDoc('T', { priority: 1 }).data.priority, 1);
    assert.throws(() => buildTaskDoc('T', { priority: 0 }), /Invalid priority/);
    assert.throws(() => buildTaskDoc('T', { priority: 10 }), /Invalid priority/);
    assert.throws(() => buildTaskDoc('T', { priority: 2.5 }), /Invalid priority/);
});

test('tags land in metadata.features; comment is top-level', () => {
    assert.deepEqual(buildTaskDoc('T', { tags: ['home', 'home'], comment: 'why' }), {
        schema: 'data/schema/task',
        schemaVersion: '3.0',
        comment: 'why',
        data: { title: 'T' },
        metadata: { features: ['tag/home'] }
    });
});

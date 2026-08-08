'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tagsToFeatures, featuresToTags, clientAppFeature } from '@canvas-os/schemas';

test('tagsToFeatures: array input, trim, drop empties, dedupe, prefix', () => {
    assert.deepEqual(tagsToFeatures(['work', ' work ', '', 'home', 'work']), ['tag/work', 'tag/home']);
});

test('tagsToFeatures: single string input (cli flag form)', () => {
    assert.deepEqual(tagsToFeatures('todo'), ['tag/todo']);
});

test('tagsToFeatures: empty-ish inputs', () => {
    assert.deepEqual(tagsToFeatures(null), []);
    assert.deepEqual(tagsToFeatures(undefined), []);
    assert.deepEqual(tagsToFeatures([]), []);
    assert.deepEqual(tagsToFeatures(['', '   ']), []);
});

test('featuresToTags is the inverse over tag/ entries only', () => {
    assert.deepEqual(featuresToTags(['tag/work', 'client/app/chrome', 'tag/home']), ['work', 'home']);
    assert.deepEqual(featuresToTags(undefined), []);
});

test('clientAppFeature', () => {
    assert.equal(clientAppFeature('canvas-cli'), 'client/app/canvas-cli');
});

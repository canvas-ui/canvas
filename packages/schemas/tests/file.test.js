'use strict';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFileDoc } from '@canvas/schemas';

const wire = (doc) => JSON.parse(JSON.stringify(doc));

test('parity: full fixture — checksum order, file:// URL, metadata shape', () => {
    const mtime = new Date('2026-08-01T12:00:00.000Z');
    const doc = buildFileDoc('/home/u/photos/cat.jpg', {
        deviceId: 'dev123',
        sha256: 'abc',
        md5: 'def',
        size: 1024,
        mimeType: 'image/jpeg',
        mtime,
        fs: { mode: 33188 },
        xattrs: { 'user.tag': 'pets' }
    });
    assert.deepEqual(wire(doc), {
        schema: 'data/schema/file',
        schemaVersion: '3.0',
        checksumArray: ['sha256/abc', 'md5/def'],
        locations: [{ url: 'file://dev123/home/u/photos/cat.jpg' }],
        metadata: {
            contentType: 'image/jpeg',
            size: 1024,
            filename: 'cat.jpg',
            mtime: '2026-08-01T12:00:00.000Z',
            fs: { mode: 33188 },
            xattrs: { 'user.tag': 'pets' }
        },
        data: {}
    });
});

test('parity: no mtime / empty fs / empty xattrs — keys absent on the wire', () => {
    const doc = buildFileDoc('/x/y', {
        deviceId: 'd',
        sha256: 's',
        md5: 'm',
        size: 1,
        mimeType: 'text/plain',
        fs: {},
        xattrs: {}
    });
    assert.deepEqual(wire(doc), {
        schema: 'data/schema/file',
        schemaVersion: '3.0',
        checksumArray: ['sha256/s', 'md5/m'],
        locations: [{ url: 'file://d/x/y' }],
        metadata: { contentType: 'text/plain', size: 1, filename: 'y' },
        data: {}
    });
});

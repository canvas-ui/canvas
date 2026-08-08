'use strict';

import { SCHEMA_NOTE, NOTE_SCHEMA_VERSION } from '../ids.js';
import { tagsToFeatures } from '../features.js';

/**
 * Build a Note document.
 *
 * Wire-parity: with only `title` set this emits exactly what the historical
 * cli builder emitted ({schema, schemaVersion, data:{content, title?}} and
 * nothing else). `comment` is a top-level BaseDocument field (user-authored
 * context outside the note body, FTS-indexed). `metadata` is only emitted
 * when tags/geo/metadata produce something. Inputs are not trimmed.
 *
 * @param {string} content
 * @param {Object} [options]
 * @param {string} [options.title]
 * @param {string} [options.comment]
 * @param {string|string[]} [options.tags]
 * @param {Object} [options.geo]
 * @param {Object} [options.metadata] extra metadata entries, merged last
 * @returns {Object}
 */
export function buildNoteDoc(content, { title, comment, tags, geo, metadata } = {}) {
    const doc = {
        schema: SCHEMA_NOTE,
        schemaVersion: NOTE_SCHEMA_VERSION,
        data: { content }
    };
    if (title) doc.data.title = title;
    if (comment) doc.comment = comment;

    const features = tagsToFeatures(tags);
    const meta = {
        ...(features.length ? { features } : {}),
        ...(geo ? { geo } : {}),
        ...(metadata || {})
    };
    if (Object.keys(meta).length) doc.metadata = meta;
    return doc;
}

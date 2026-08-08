'use strict';

import { SCHEMA_TAB, TAB_SCHEMA_VERSION } from '../ids.js';

/**
 * Build a Tab document.
 *
 * Wire-parity: with only `title` set this emits exactly what the historical
 * cli builder emitted. `pinned` is emitted whenever passed (including false —
 * extension semantics); `favIconUrl`/`timestamp` when truthy; `metadata` only
 * when provided and non-empty.
 *
 * @param {string} url
 * @param {Object} [options]
 * @param {string} [options.title]
 * @param {string} [options.favIconUrl]
 * @param {boolean} [options.pinned]
 * @param {string} [options.timestamp] ISO timestamp
 * @param {Object} [options.metadata]
 * @returns {Object}
 */
export function buildTabDoc(url, { title, favIconUrl, pinned, timestamp, metadata } = {}) {
    const doc = {
        schema: SCHEMA_TAB,
        schemaVersion: TAB_SCHEMA_VERSION,
        data: { url }
    };
    if (title) doc.data.title = title;
    if (pinned !== undefined) doc.data.pinned = pinned;
    if (favIconUrl) doc.data.favIconUrl = favIconUrl;
    if (timestamp) doc.data.timestamp = timestamp;
    if (metadata && Object.keys(metadata).length) doc.metadata = metadata;
    return doc;
}

'use strict';

import { SCHEMA_LINK, LINK_SCHEMA_VERSION } from '../ids.js';
import { buildMetadata } from './_meta.js';

// synapsd's Link rejects a uri without a scheme (URI_SCHEME_REGEX), so catch
// it here rather than spending a round trip on a 400.
const URI_SCHEME_REGEX = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

/**
 * Build a Link document.
 *
 * A link is the schema-agnostic "pointer to something addressable" — any URI
 * scheme, not just http(s) (that is what `tab` is for). Mirrors synapsd's
 * `data/schema/link` v3.0, which normalizes the uri and derives `scheme`
 * server-side; this builder passes the uri through as authored.
 *
 * Links DO declare `data.tags`, so tags are emitted twice on purpose: in
 * `data.tags` because the schema models them, and as `tag/*` metadata features
 * because that is what the bitmap index and every filter query read.
 *
 * @param {string} uri
 * @param {Object} [options]
 * @param {string} [options.label]
 * @param {string} [options.description]
 * @param {string} [options.type] caller's own subtype, e.g. 'repo', 'doc'
 * @param {string} [options.category]
 * @param {Object} [options.properties] free-form key/value payload
 * @param {string|Date} [options.lastAccessedAt]
 * @param {string} [options.comment]
 * @param {string|string[]} [options.tags]
 * @param {Object} [options.geo]
 * @param {Object} [options.metadata]
 * @returns {Object}
 */
export function buildLinkDoc(uri, {
    label, description, type, category, properties, lastAccessedAt,
    comment, tags, geo, metadata
} = {}) {
    const value = String(uri ?? '').trim();
    if (!value) throw new Error('Link requires a uri');
    if (!URI_SCHEME_REGEX.test(value)) {
        throw new Error(`Invalid uri: ${uri} (missing scheme, e.g. https:// or git+ssh://)`);
    }

    const doc = {
        schema: SCHEMA_LINK,
        schemaVersion: LINK_SCHEMA_VERSION,
        data: { uri: value }
    };
    if (label) doc.data.label = label;
    if (description) doc.data.description = description;
    if (type) doc.data.type = type;
    if (category) doc.data.category = category;
    if (properties && Object.keys(properties).length) doc.data.properties = properties;
    if (lastAccessedAt) {
        const d = lastAccessedAt instanceof Date ? lastAccessedAt : new Date(lastAccessedAt);
        if (Number.isNaN(d.getTime())) throw new Error(`Invalid lastAccessedAt: ${lastAccessedAt}`);
        doc.data.lastAccessedAt = d.toISOString();
    }
    const tagList = normalizeTags(tags);
    if (tagList.length) doc.data.tags = tagList;
    if (comment) doc.comment = comment;

    const meta = buildMetadata({ tags, geo, metadata });
    if (meta) doc.metadata = meta;
    return doc;
}

function normalizeTags(tags) {
    const list = Array.isArray(tags) ? tags : tags ? [tags] : [];
    const out = [];
    for (const raw of list) {
        const t = String(raw ?? '').trim();
        if (t && !out.includes(t)) out.push(t);
    }
    return out;
}

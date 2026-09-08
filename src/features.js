'use strict';

/**
 * Tags live on documents as `metadata.features` entries with a `tag/` prefix.
 * The server normalizes keys further (lowercase, spaces → _), so trimming and
 * prefixing is all that happens client-side. Union of the historical cli and
 * web implementations: accepts a single string or an array, trims, drops
 * empties, dedupes.
 *
 * @param {string|string[]|null|undefined} tags
 * @returns {string[]} deduped `tag/<value>` strings
 */
export function tagsToFeatures(tags) {
    const list = Array.isArray(tags) ? tags : tags ? [tags] : [];
    const seen = new Set();
    for (const raw of list) {
        const t = String(raw ?? '').trim();
        if (!t) continue;
        seen.add(`tag/${t}`);
    }
    return Array.from(seen);
}

/**
 * Inverse: plain tag values from a document's `metadata.features`.
 * @param {string[]|null|undefined} features
 * @returns {string[]}
 */
export function featuresToTags(features) {
    return (features || []).filter((f) => typeof f === 'string' && f.startsWith('tag/')).map((f) => f.slice(4));
}

/**
 * Client-identity feature, e.g. clientAppFeature('canvas-cli') →
 * 'client/app/canvas-cli' (same family the extension emits for browsers).
 * @param {string} name
 * @returns {string}
 */
export function clientAppFeature(name) {
    return `client/app/${name}`;
}

'use strict';

import { tagsToFeatures } from '../features.js';

/**
 * The metadata block every builder assembles the same way: `tag/*` features,
 * an optional geo fix, then caller-supplied entries merged last so they win.
 * Returns undefined when nothing would be emitted, so builders can stay
 * "optional fields only appear when provided".
 *
 * Tags live in `metadata.features` here, not the v3 top-level `features`:
 * synapsd reads both, but the web's edit forms still read
 * `doc.metadata?.features` (apps/web/src/components/toolbox/add/*), so a
 * document built with top-level features would show up untagged there.
 *
 * @param {Object} [o]
 * @param {string|string[]} [o.tags]
 * @param {Object} [o.geo]
 * @param {Object} [o.metadata] extra metadata entries, merged last
 * @returns {Object|undefined}
 */
export function buildMetadata({ tags, geo, metadata } = {}) {
    const features = tagsToFeatures(tags);
    const meta = {
        ...(features.length ? { features } : {}),
        ...(geo ? { geo } : {}),
        ...(metadata || {})
    };
    return Object.keys(meta).length ? meta : undefined;
}

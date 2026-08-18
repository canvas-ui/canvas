import { wallpapers } from './manifest.js';

export { wallpapers };

/**
 * Where apps are expected to serve the copied `files/` and `thumbs/`
 * directories from. `scripts/copy.js` defaults to `<public>/wallpapers`.
 */
export const BASE_PATH = '/wallpapers';

/** @returns {import('../types/index.js').Wallpaper | undefined} */
export function getWallpaper(id) {
    return wallpapers.find((wallpaper) => wallpaper.id === id);
}

/**
 * URL of a wallpaper's best rendition, optionally narrowed to the formats the
 * caller can render (e.g. the result of a canvas/`Image` feature test). Falls
 * back to the last source, which is always a universally supported format.
 *
 * @param {import('../types/index.js').Wallpaper | string} wallpaper
 * @param {{ base?: string, types?: string[] }} [options]
 */
export function wallpaperUrl(wallpaper, options = {}) {
    const entry = typeof wallpaper === 'string' ? getWallpaper(wallpaper) : wallpaper;
    if (!entry) return null;
    const { base = BASE_PATH, types } = options;
    const source = (types ? entry.sources.find((s) => types.includes(s.type)) : entry.sources[0])
        ?? entry.sources[entry.sources.length - 1];
    return `${base.replace(/\/$/, '')}/${source.src}`;
}

/** URL of the small picker thumbnail. */
export function wallpaperThumbUrl(wallpaper, base = BASE_PATH) {
    const entry = typeof wallpaper === 'string' ? getWallpaper(wallpaper) : wallpaper;
    return entry ? `${base.replace(/\/$/, '')}/${entry.thumb}` : null;
}

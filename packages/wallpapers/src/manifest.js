// The wallpapers this package ships. Source of truth for both the build-time
// copy step and the in-app picker — add and remove entries with
// `node scripts/wallpaper.js`, which keeps files/ and thumbs/ in step.
//
// `sources` is ordered best-first: a consumer picks the first format it can
// render. Paths are relative to wherever the package's `files/` directory was
// copied to (see BASE_PATH / resolveWallpaper below).

/** @type {import('../types/index.js').Wallpaper[]} */
export const wallpapers = [
    {
        id: 'canvas_1',
        title: 'Canvas Deep',
        scheme: 'dark',
        background: '#032940',
        accent: '#f2f2f2',
        sources: [
            { type: 'image/svg+xml', src: 'files/canvas_1.svg' },
            { type: 'image/avif', src: 'files/canvas_1.avif' },
            { type: 'image/webp', src: 'files/canvas_1.webp' },
        ],
        thumb: 'thumbs/canvas_1.webp',
        author: 'Canvas',
        license: 'LicenseRef-Canvas-Brand',
    },
    {
        id: 'canvas_3',
        title: 'Canvas Mono Dark',
        scheme: 'dark',
        background: '#000000',
        accent: '#ffffff',
        sources: [
            { type: 'image/svg+xml', src: 'files/canvas_3.svg' },
            { type: 'image/avif', src: 'files/canvas_3.avif' },
            { type: 'image/webp', src: 'files/canvas_3.webp' },
        ],
        thumb: 'thumbs/canvas_3.webp',
        author: 'Canvas',
        license: 'LicenseRef-Canvas-Brand',
    },
    {
        id: 'w1',
        title: 'Frost',
        scheme: 'dark',
        background: '#164a6f',
        accent: '#9ad9f0',
        sources: [
            { type: 'image/avif', src: 'files/w1.avif' },
            { type: 'image/webp', src: 'files/w1.webp' },
            { type: 'image/jpeg', src: 'files/w1.jpg' },
        ],
        thumb: 'thumbs/w1.webp',
        author: 'Peter Cui Bide',
        source: 'https://petercui.deviantart.com',
        license: 'LicenseRef-Attribution-Only',
    },
];

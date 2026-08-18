# @augmentd-labs/canvas-wallpapers

Wallpapers shipped out of the box with the Canvas UIs, plus the manifest that
describes them. Kept as its own package so `apps/web`, `apps/desktop` and any
later surface share one copy of the artwork, and so the artwork can carry its
own licensing terms separate from the AGPL code around it — see `NOTICE`.

## Contents

```
files/      full-size renditions (svg / avif / webp / jpg)
thumbs/     480px picker thumbnails (webp)
src/        the manifest and small URL helpers — no runtime dependencies
scripts/    derive.sh (regenerate renditions), copy.mjs (install into an app)
```

## Using it from an app

Add the dependency and copy the assets into the app's static directory before
dev/build:

```jsonc
// apps/<app>/package.json
"dependencies": { "@augmentd-labs/canvas-wallpapers": "workspace:*" },
"scripts": {
  "predev":   "canvas-wallpapers-copy public/wallpapers",
  "prebuild": "canvas-wallpapers-copy public/wallpapers"
}
```

`public/wallpapers/` is a copy, so it belongs in `.gitignore`.

Then read the catalogue from the manifest:

```js
import { wallpapers, wallpaperUrl, wallpaperThumbUrl } from '@augmentd-labs/canvas-wallpapers'

wallpaperUrl('canvas_1')        // '/wallpapers/files/canvas_1.svg'
wallpaperThumbUrl('canvas_1')   // '/wallpapers/thumbs/canvas_1.webp'
```

`wallpaperUrl` returns the first (best) rendition by default. Pass
`{ types: [...] }` to narrow it to the formats the client can decode; the last
source of every wallpaper is a universally supported format, so there is always
a usable fallback.

Each entry also carries `scheme` (`light` / `dark`), `background` (the dominant
colour, usable as an instant placeholder behind the image) and `accent` — the
`frost` theme in particular expects to sit on a wallpaper rather than a flat
desk colour.

## Adding a wallpaper

1. Drop the source into `files/` — a `.svg` if the artwork is vector, otherwise
   a high-resolution `.jpg`. Both are the checked-in originals; every other
   rendition is derived.
2. Run `scripts/derive.sh` (needs `rsvg-convert` and ImageMagick 7 with AVIF and
   WebP support). It writes the 2560px AVIF/WebP renditions and the thumbnail.
3. Add the entry to `src/manifest.js`, including a real `author` and `license`.

Keep the set small — these files ship in every build.

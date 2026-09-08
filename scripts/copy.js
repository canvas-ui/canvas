#!/usr/bin/env node
// Copies this package's wallpaper files into an app's static asset directory,
// so the app serves them at `<base>/files/...` and `<base>/thumbs/...`.
//
//   canvas-wallpapers-copy apps/web/public/wallpapers
//
// Apps wire it into a `predev`/`prebuild` script; the destination is expected
// to be gitignored, since it is a copy of what lives here.

import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dest = resolve(process.cwd(), process.argv[2] ?? 'public/wallpapers');

await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
for (const dir of ['files', 'thumbs']) {
    await cp(resolve(pkgRoot, dir), resolve(dest, dir), { recursive: true });
}
console.log(`wallpapers → ${dest}`);

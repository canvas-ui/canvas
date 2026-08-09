#!/usr/bin/env node
// Packs the prebuilt web UI as a dependency-free tarball for canvas-server.
//
// The published artifact is dist/ plus a minimal manifest: vite already
// bundled every runtime dependency, and the workspace deps in apps/web's
// real package.json (@augmentd-labs/*) are unpublished — shipping them would
// 404 any npm install of the tarball. Usage:
//
//   pnpm --filter canvas-web run build
//   node scripts/pack-web-artifact.mjs [out-dir]
//
// Prints the tarball path on stdout.

import { cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const webDir = join(root, 'apps', 'web');
const outDir = resolve(process.argv[2] || join(root, 'artifacts'));

const src = JSON.parse(readFileSync(join(webDir, 'package.json'), 'utf8'));
const dist = join(webDir, 'dist');
if (!readdirSync(dist).includes('index.html')) {
    throw new Error(`No built dist at ${dist} — run the web build first`);
}

mkdirSync(outDir, { recursive: true });
const stage = mkdtempSync(join(tmpdir(), 'canvas-web-pack-'));
try {
    cpSync(dist, join(stage, 'dist'), { recursive: true });
    for (const f of ['LICENSE', 'NOTICE', 'README.md']) {
        try {
            cpSync(join(webDir, f), join(stage, f));
        } catch {
            /* optional */
        }
    }
    writeFileSync(
        join(stage, 'package.json'),
        JSON.stringify(
            {
                name: src.name,
                version: src.version,
                description: `${src.description || 'Canvas web UI'} (prebuilt dist artifact)`,
                license: src.license,
                repository: src.repository,
                files: ['dist']
            },
            null,
            2
        ) + '\n'
    );
    execFileSync('npm', ['pack', '--pack-destination', outDir], { cwd: stage, stdio: ['ignore', 'ignore', 'inherit'] });
    console.log(join(outDir, `${src.name}-${src.version}.tgz`));
} finally {
    rmSync(stage, { recursive: true, force: true });
}

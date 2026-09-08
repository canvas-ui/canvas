#!/usr/bin/env node
// Add or remove a wallpaper, keeping files/, thumbs/ and src/manifest.js in
// step. Interactive: it asks for everything an entry needs, including the
// attribution the artwork's licence depends on.
//
//   node scripts/wallpaper.js add ~/Pictures/aurora.jpg
//   node scripts/wallpaper.js remove aurora
//
// `add` accepts an .svg (kept as the vector source) or any raster ImageMagick
// can read (converted to .jpg, since those are the two source kinds
// derive.sh knows how to render from). Pass --yes to skip confirmations.

import { execFileSync } from 'node:child_process';
import { copyFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, dirname, extname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = resolve(PKG, 'src/manifest.js');

const SCHEMES = ['light', 'dark'];
const LICENCES = [
    { id: 'LicenseRef-Canvas-Brand', hint: 'our own artwork, ships as part of Canvas' },
    { id: 'CC0-1.0', hint: 'public domain, no attribution required' },
    { id: 'CC-BY-4.0', hint: 'free to use with credit' },
    { id: 'CC-BY-SA-4.0', hint: 'free to use with credit, share-alike' },
    { id: 'LicenseRef-Attribution-Only', hint: 'credited, but no redistribution permission on file' },
];

// ── manifest read/write ──────────────────────────────────────────────────────
// The manifest is JS rather than JSON so it can carry the comments explaining
// itself. We read it by importing it, and write it back from data through one
// serializer, so formatting stays stable no matter who edited what.

const HEADER = `// The wallpapers this package ships. Source of truth for both the build-time
// copy step and the in-app picker — add and remove entries with
// \`node scripts/wallpaper.js\`, which keeps files/ and thumbs/ in step.
//
// \`sources\` is ordered best-first: a consumer picks the first format it can
// render. Paths are relative to wherever the package's \`files/\` directory was
// copied to (see BASE_PATH / resolveWallpaper below).

/** @type {import('../types/index.js').Wallpaper[]} */
export const wallpapers = [
`;

async function readManifest() {
    const module = await import(`${pathToFileURL(MANIFEST).href}?t=${process.hrtime.bigint()}`);
    return module.wallpapers;
}

function quote(value) {
    return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`;
}

function serializeEntry(entry) {
    const lines = [
        '    {',
        `        id: ${quote(entry.id)},`,
        `        title: ${quote(entry.title)},`,
        `        scheme: ${quote(entry.scheme)},`,
        `        background: ${quote(entry.background)},`,
        `        accent: ${quote(entry.accent)},`,
        '        sources: [',
        ...entry.sources.map((s) => `            { type: ${quote(s.type)}, src: ${quote(s.src)} },`),
        '        ],',
        `        thumb: ${quote(entry.thumb)},`,
        `        author: ${quote(entry.author)},`,
    ];
    if (entry.source) { lines.push(`        source: ${quote(entry.source)},`); }
    lines.push(`        license: ${quote(entry.license)},`, '    },');
    return lines.join('\n');
}

async function writeManifest(entries) {
    await writeFile(MANIFEST, `${HEADER}${entries.map(serializeEntry).join('\n')}\n];\n`);
}

// ── helpers ──────────────────────────────────────────────────────────────────

function derive() {
    execFileSync(resolve(PKG, 'scripts/derive.sh'), { stdio: 'inherit' });
}

/** Average colour of an image, as the default for `background`. */
function averageColor(file) {
    try {
        const hex = execFileSync('magick', [file, '-resize', '1x1!', '-format', '%[hex:p{0,0}]', 'info:'], {
            encoding: 'utf8',
        }).trim();
        return `#${hex.slice(0, 6).toLowerCase()}`;
    } catch {
        return '';
    }
}

function fail(message) {
    console.error(`✗ ${message}`);
    process.exit(1);
}

// ── commands ─────────────────────────────────────────────────────────────────

async function add(sourceFile, ask, assumeYes) {
    if (!sourceFile) { fail('usage: wallpaper.js add <image file>'); }
    const from = resolve(process.cwd(), sourceFile);
    if (!existsSync(from)) { fail(`no such file: ${from}`); }

    const entries = await readManifest();
    const isVector = extname(from).toLowerCase() === '.svg';

    const suggestedId = basename(from, extname(from)).toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const id = await ask('id (filename and manifest key)', suggestedId);
    if (!/^[a-z0-9_-]+$/.test(id)) { fail('id may only contain a-z, 0-9, _ and -'); }
    if (entries.some((entry) => entry.id === id)) { fail(`a wallpaper with id "${id}" already exists`); }

    const title = await ask('title (shown in the picker)', id);
    const scheme = await ask(`scheme — which UI scheme it suits (${SCHEMES.join('/')})`, 'dark');
    if (!SCHEMES.includes(scheme)) { fail(`scheme must be one of: ${SCHEMES.join(', ')}`); }

    const background = await ask('background — dominant colour, shown while the image loads', averageColor(from));
    const accent = await ask('accent — the artwork\'s foreground colour', scheme === 'dark' ? '#ffffff' : '#000000');

    console.log('\nAttribution. Get this right — it is what the licence below rests on.');
    const author = await ask('author (use "Canvas" for our own artwork)', 'Canvas');
    const source = await ask('source URL (blank for our own artwork)', '');

    console.log(`\nLicence:\n${LICENCES.map((l) => `  ${l.id} — ${l.hint}`).join('\n')}`);
    const license = await ask('license', author === 'Canvas' ? 'LicenseRef-Canvas-Brand' : 'CC-BY-4.0');
    if (!LICENCES.some((l) => l.id === license)) {
        console.log(`  note: "${license}" is not one of the known ids — document it in NOTICE.`);
    }
    if (license === 'LicenseRef-Attribution-Only' && !assumeYes) {
        const ok = await ask('That licence means no redistribution permission is on file. Bundle anyway? (y/N)', 'n');
        if (!ok.toLowerCase().startsWith('y')) { fail('aborted'); }
    }

    // derive.sh renders from an .svg or a .jpg, so anything else becomes a jpg.
    if (isVector) {
        await copyFile(from, resolve(PKG, `files/${id}.svg`));
    } else if (extname(from).toLowerCase() === '.jpg' || extname(from).toLowerCase() === '.jpeg') {
        await copyFile(from, resolve(PKG, `files/${id}.jpg`));
    } else {
        execFileSync('magick', [from, '-quality', '92', resolve(PKG, `files/${id}.jpg`)], { stdio: 'inherit' });
    }

    derive();

    const sources = isVector
        ? [
            { type: 'image/svg+xml', src: `files/${id}.svg` },
            { type: 'image/avif', src: `files/${id}.avif` },
            { type: 'image/webp', src: `files/${id}.webp` },
        ]
        : [
            { type: 'image/avif', src: `files/${id}.avif` },
            { type: 'image/webp', src: `files/${id}.webp` },
            { type: 'image/jpeg', src: `files/${id}.jpg` },
        ];

    const entry = { id, title, scheme, background, accent, sources, thumb: `thumbs/${id}.webp`, author, license };
    if (source) { entry.source = source; }
    await writeManifest([...entries, entry]);

    console.log(`\n✓ added ${id}`);
    if (author !== 'Canvas') {
        console.log(`  Record the terms for ${quote(license)} in NOTICE — the picker credits ${author} automatically.`);
    }
}

async function remove(id, ask, assumeYes) {
    if (!id) { fail('usage: wallpaper.js remove <id>'); }

    const entries = await readManifest();
    const entry = entries.find((candidate) => candidate.id === id);
    if (!entry) { fail(`no wallpaper with id "${id}" (have: ${entries.map((e) => e.id).join(', ')})`); }

    if (!assumeYes) {
        const ok = await ask(`Remove "${entry.title}" (${id}) and its files? (y/N)`, 'n');
        if (!ok.toLowerCase().startsWith('y')) { fail('aborted'); }
    }

    for (const ext of ['svg', 'jpg', 'avif', 'webp']) {
        await rm(resolve(PKG, `files/${id}.${ext}`), { force: true });
    }
    await rm(resolve(PKG, `thumbs/${id}.webp`), { force: true });
    await writeManifest(entries.filter((candidate) => candidate.id !== id));

    console.log(`✓ removed ${id}`);
    console.log(`  Anyone who had it selected falls back to the theme's desk color; drop its NOTICE entry if it had one.`);
}

// ── entry point ──────────────────────────────────────────────────────────────

const argv = process.argv.slice(2).filter((arg) => arg !== '--yes');
const assumeYes = process.argv.includes('--yes');
const [command, argument] = argv;

if (!assumeYes && !stdin.isTTY) {
    fail('nothing to prompt with: run this from a terminal, or pass --yes to take every default');
}

const rl = createInterface({ input: stdin, output: stdout });
let closed = false;
rl.on('close', () => { closed = true; });

const ask = async (question, fallback) => {
    if (assumeYes || closed) { return fallback; }
    const answer = (await rl.question(fallback ? `${question} [${fallback}]: ` : `${question}: `)).trim();
    return answer || fallback;
};

try {
    if (command === 'add') { await add(argument, ask, assumeYes); }
    else if (command === 'remove') { await remove(argument, ask, assumeYes); }
    else {
        console.log('usage: wallpaper.js add <image file> | remove <id>   [--yes]');
        process.exitCode = 1;
    }
} catch (error) {
    // Ctrl+D at a prompt is a deliberate "never mind", not a crash.
    if (error?.code === 'ABORT_ERR') { fail('aborted'); }
    throw error;
} finally {
    rl.close();
}

// NOTICE is deliberately left to a human: it carries prose terms, not fields.
if (!existsSync(resolve(PKG, 'NOTICE'))) { console.warn('! NOTICE is missing'); }

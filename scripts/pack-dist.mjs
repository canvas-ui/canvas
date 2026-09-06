#!/usr/bin/env node
// Stages a shared component as a self-contained npm package — the `*-dist`
// artifacts other repos fetch straight from git:
//
//   "canvas-web":                     "github:canvas-ui/canvas#web-dist"
//   "@augmentd-labs/canvas-edge":     "github:canvas-ui/canvas#edge-dist"
//   "@augmentd-labs/canvas-protocol": "github:canvas-ui/canvas#protocol-dist"
//
// Rule: a dist artifact has REGISTRY dependencies only. Workspace deps
// (`workspace:*`) and git deps (`github:…`) are copied into the artifact's own
// node_modules and listed as bundleDependencies, and their registry deps are
// merged into the artifact's. Consumers with npm's allow-git=root would refuse
// a transitive git dep; bundling sidesteps that and pins what was built.
//
// Usage:
//   node scripts/pack-dist.mjs <target|all> [--out artifacts] [--pack]
//
// Targets: web protocol schemas wallpapers api-client edge (see TARGETS).
// Output: <out>/dist/<target>/  — a directory ready to `git init` + push as
// the `<target>-dist` branch (scripts/update-releases.sh) or to `npm pack`
// (--pack writes <out>/<name>-<version>.tgz for the GitHub Release).
// Builds are the caller's job (web needs `pnpm --filter canvas-web run build`).

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// name (branch prefix) → source. `built: true` = ship the build output only.
export const TARGETS = {
    web: { dir: 'apps/web', built: true, name: 'canvas-web', include: ['dist'], check: 'dist/index.html' },
    protocol: { dir: 'packages/protocol' },
    schemas: { dir: 'packages/schemas' },
    wallpapers: { dir: 'packages/wallpapers' },
    'api-client': { dir: 'packages/api-client' },
    edge: { dir: 'runtimes/edge' },
};

const META_FILES = ['package.json', 'LICENSE', 'LICENSE.md', 'NOTICE', 'README.md'];
const isWorkspace = (spec) => /^workspace:/.test(spec);
const isGit = (spec) => /^(github:|git\+|git:|https?:\/\/.*\.git|[\w-]+\/[\w.-]+#)/.test(spec) || /^[\w-]+\/[\w.-]+$/.test(spec);

function readPkg(dir) {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
}

function gitRev() {
    try { return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(); }
    catch { return 'unknown'; }
}

/** Where a dependency of `fromDir` is installed (pnpm symlinks → real dir). */
function installedDir(fromDir, name) {
    const p = join(fromDir, 'node_modules', name);
    if (!existsSync(p)) throw new Error(`${name} is not installed under ${fromDir} — run pnpm install`);
    return realpathSync(p);
}

/** Copy a package's publishable files (its `files` + metadata) into `dest`. */
function copyPackageFiles(srcDir, pkg, dest, extra = []) {
    mkdirSync(dest, { recursive: true });
    const wanted = new Set([...(pkg.files || ['src']), ...extra]);
    for (const entry of wanted) {
        const from = join(srcDir, entry);
        if (!existsSync(from)) continue;
        // Skip nested node_modules by path RELATIVE to the package: the source
        // itself may live under a pnpm store path that contains node_modules.
        cpSync(from, join(dest, entry), { recursive: true, filter: (p) => !/(^|\/)node_modules(\/|$)/.test(p.slice(srcDir.length)) });
    }
    for (const f of META_FILES) {
        if (f === 'package.json') continue;
        if (existsSync(join(srcDir, f))) cpSync(join(srcDir, f), join(dest, f));
    }
}

/**
 * Bundle one non-registry dependency into `stageDir/node_modules/<name>`.
 * Returns its registry dependencies (to merge upward). Nested non-registry
 * deps are refused: keep the graph one level deep and obvious.
 */
function bundleDep(stageDir, name, spec, fromDir) {
    const src = isWorkspace(spec) ? workspaceDir(name) : installedDir(fromDir, name);
    const pkg = readPkg(src);
    const dest = join(stageDir, 'node_modules', name);
    copyPackageFiles(src, pkg, dest);
    const manifest = { ...pkg };
    delete manifest.scripts; delete manifest.devDependencies; delete manifest.publishConfig;
    writeFileSync(join(dest, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
    const deps = {};
    for (const [n, s] of Object.entries(pkg.dependencies || {})) {
        if (isWorkspace(s) || isGit(s)) throw new Error(`${name} depends on ${n}@${s}: nested non-registry deps are not supported by pack-dist`);
        deps[n] = s;
    }
    // A git dep's optional deps (e.g. lmdb's platform binaries) travel too.
    return { deps, optional: pkg.optionalDependencies || {}, version: pkg.version };
}

function workspaceDir(name) {
    for (const group of ['packages', 'runtimes', 'apps']) {
        for (const d of readdirSync(join(root, group))) {
            const p = join(root, group, d, 'package.json');
            if (existsSync(p) && readPkg(join(root, group, d)).name === name) return join(root, group, d);
        }
    }
    throw new Error(`workspace package ${name} not found`);
}

export function stage(targetName, { out = join(root, 'artifacts') } = {}) {
    const t = TARGETS[targetName];
    if (!t) throw new Error(`unknown target '${targetName}' (${Object.keys(TARGETS).join(', ')})`);
    const srcDir = join(root, t.dir);
    const pkg = readPkg(srcDir);
    const stageDir = join(out, 'dist', targetName);
    rmSync(stageDir, { recursive: true, force: true });
    mkdirSync(stageDir, { recursive: true });
    const rev = gitRev();

    if (t.built) {
        if (t.check && !existsSync(join(srcDir, t.check))) throw new Error(`No build at ${join(srcDir, t.check)} — build ${t.dir} first`);
        for (const entry of t.include) cpSync(join(srcDir, entry), join(stageDir, entry), { recursive: true });
        for (const f of META_FILES) if (f !== 'package.json' && existsSync(join(srcDir, f))) cpSync(join(srcDir, f), join(stageDir, f));
        const manifest = {
            name: t.name || pkg.name,
            version: pkg.version,
            description: `${pkg.description || t.name} (prebuilt dist artifact)`,
            license: pkg.license,
            repository: pkg.repository,
            files: t.include,
            canvasRev: rev,
            canvasSource: t.dir,
        };
        writeFileSync(join(stageDir, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
        return { stageDir, name: manifest.name, version: manifest.version };
    }

    copyPackageFiles(srcDir, pkg, stageDir);
    const dependencies = {};
    const optionalDependencies = { ...(pkg.optionalDependencies || {}) };
    const bundled = [];
    for (const [name, spec] of Object.entries(pkg.dependencies || {})) {
        if (!isWorkspace(spec) && !isGit(spec)) { dependencies[name] = spec; continue; }
        const { deps, optional, version } = bundleDep(stageDir, name, spec, srcDir);
        bundled.push(name);
        // A bundled dep must ALSO be a declared dependency (its concrete version),
        // or Arborist treats the bundled copy as extraneous and npm pack drops it.
        dependencies[name] = version;
        for (const [n, s] of Object.entries(deps)) {
            if (dependencies[n] && dependencies[n] !== s) console.warn(`[pack-dist] ${targetName}: ${n} wanted as ${dependencies[n]} and ${s} (via ${name}); keeping ${dependencies[n]}`);
            dependencies[n] ??= s;
        }
        Object.assign(optionalDependencies, optional);
    }
    const manifest = { ...pkg };
    delete manifest.scripts; delete manifest.devDependencies; delete manifest.publishConfig;
    manifest.dependencies = dependencies;
    if (Object.keys(optionalDependencies).length) manifest.optionalDependencies = optionalDependencies;
    if (bundled.length) manifest.bundleDependencies = bundled;
    manifest.description = `${pkg.description || pkg.name} (dist artifact)`;
    manifest.canvasRev = rev;
    manifest.canvasSource = t.dir;
    writeFileSync(join(stageDir, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
    return { stageDir, name: manifest.name, version: manifest.version, bundled };
}

export function pack(stageDir, out) {
    mkdirSync(out, { recursive: true });
    const before = new Set(readdirSync(out));
    execFileSync('npm', ['pack', '--pack-destination', out], { cwd: stageDir, stdio: ['ignore', 'ignore', 'inherit'] });
    return readdirSync(out).filter((f) => f.endsWith('.tgz') && !before.has(f)).map((f) => join(out, f));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    const which = args.find((a) => !a.startsWith('--')) || 'all';
    const outIdx = args.indexOf('--out');
    const out = outIdx >= 0 ? resolve(args[outIdx + 1]) : join(root, 'artifacts');
    const doPack = args.includes('--pack');
    const names = which === 'all' ? Object.keys(TARGETS) : which.split(',');
    for (const n of names) {
        const res = stage(n, { out });
        const extra = res.bundled?.length ? ` (bundled: ${res.bundled.join(', ')})` : '';
        console.log(`${n}: ${res.name}@${res.version} → ${res.stageDir}${extra}`);
        if (doPack) for (const f of pack(res.stageDir, out)) console.log(`  packed ${f}`);
    }
}

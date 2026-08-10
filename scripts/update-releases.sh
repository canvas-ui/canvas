#!/usr/bin/env bash
# update-releases.sh — the ONE command that publishes the web UI.
#
#   npm run release:web                  build + publish web-dist branch
#   npm run release:web -- --bump patch  bump apps/web version first (commit + push main)
#   npm run release:web -- --tag         also tag web-v<version> (triggers the
#                                        release.yml tarball build on GitHub)
#   npm run release:web -- --no-push     do everything locally, print the push
#                                        commands instead of running them
#
# What it does, in order, verifying every step:
#   1. Preconditions: on main, clean tree, level with origin/main, pnpm works.
#   2. Optional --bump: patch/minor/major on apps/web/package.json, committed.
#   3. Build apps/web (frozen lockfile, filtered install).
#   4. Publish { package.json, dist/ } as a single commit on the `web-dist`
#      branch (force-push — the branch is a build artifact, not history).
#      canvas-server consumes it as "canvas-web": "github:canvas-ui/canvas#web-dist"
#      and re-resolves it on every deployment update.
#   5. Optional --tag: web-v<version> tag for the pinned tarball release.
#
# Design constraints: non-interactive, deterministic, one loud line per step,
# every failure names its cause and exits non-zero — safe to hand to a cron
# job or a small supervising model.
set -euo pipefail

BUMP=""
TAG=false
PUSH=true
ALLOW_DIRTY=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --bump) BUMP="${2:-}"; shift 2 ;;
        --tag) TAG=true; shift ;;
        --no-push) PUSH=false; shift ;;
        --allow-dirty) ALLOW_DIRTY=true; shift ;;
        -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) echo "ERROR: unknown argument '$1' (see --help)"; exit 2 ;;
    esac
done

say()  { echo "[release:web $(date '+%H:%M:%S')] $1"; }
die()  { echo "[release:web] ERROR: $1" >&2; exit 1; }

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || die "not inside a git repository"
cd "$ROOT"
[[ -f apps/web/package.json ]] || die "apps/web/package.json not found — run from the canvas monorepo"

# ── 1. Preconditions ─────────────────────────────────────────────────────────
branch=$(git branch --show-current)
[[ "$branch" == "main" ]] || die "on branch '$branch' — releases publish from main only"

if ! $ALLOW_DIRTY && ! git diff-index --quiet HEAD --; then
    die "working tree has uncommitted changes — commit them or pass --allow-dirty"
fi

say "Fetching origin/main..."
git fetch origin main --quiet || die "git fetch failed — no network?"
local_sha=$(git rev-parse main)
remote_sha=$(git rev-parse origin/main)
if [[ "$local_sha" != "$remote_sha" ]]; then
    if git merge-base --is-ancestor origin/main main; then
        say "main is ahead of origin/main — its commits will ride along on the push"
    else
        die "main is behind/diverged from origin/main — pull/rebase first"
    fi
fi

command -v corepack >/dev/null || die "corepack not found (ships with node >= 16.9)"
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# ── 2. Optional version bump ─────────────────────────────────────────────────
if [[ -n "$BUMP" ]]; then
    case "$BUMP" in patch|minor|major) ;; *) die "--bump must be patch, minor or major (got '$BUMP')" ;; esac
    ( cd apps/web && npm version "$BUMP" --no-git-tag-version >/dev/null ) || die "version bump failed"
    ver=$(node -p "require('./apps/web/package.json').version")
    git add apps/web/package.json
    git commit --quiet -m "apps/web $ver" || die "bump commit failed"
    say "Bumped apps/web to $ver (committed)"
fi

ver=$(node -p "require('./apps/web/package.json').version")
rev=$(git rev-parse --short HEAD)

# ── 3. Build ─────────────────────────────────────────────────────────────────
say "Installing (filtered, frozen lockfile)..."
corepack pnpm install --filter canvas-web... --frozen-lockfile >/dev/null || die "pnpm install failed"
say "Building apps/web $ver..."
corepack pnpm --filter canvas-web run build >/dev/null || die "web build failed"
[[ -f apps/web/dist/index.html ]] || die "build produced no dist/index.html"

# ── 4. Publish the web-dist branch ───────────────────────────────────────────
stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT
cp -r apps/web/dist "$stage/dist"
node -e "
const p = require('./apps/web/package.json');
require('fs').writeFileSync(process.argv[1] + '/package.json', JSON.stringify({
  name: 'canvas-web',
  version: p.version,
  description: 'Prebuilt Canvas web UI — published by scripts/update-releases.sh (web-dist branch)',
  license: p.license,
  files: ['dist'],
  canvasRev: '$rev',
}, null, 2) + '\n');
" "$stage" || die "failed to write the web-dist package.json"

origin_url=$(git remote get-url origin)
(
    cd "$stage"
    git init --quiet -b web-dist
    git add -A
    git -c user.name="release:web" -c user.email="release@canvas" \
        commit --quiet -m "canvas-web $ver (main@$rev)"
) || die "failed to assemble the web-dist commit"
dist_sha=$(git -C "$stage" rev-parse HEAD)

# ── 5. Push (or print what would be pushed) ──────────────────────────────────
if $PUSH; then
    if [[ -n "$BUMP" ]] || [[ "$local_sha" != "$remote_sha" ]]; then
        say "Pushing main..."
        git push origin main || die "push of main failed"
    fi
    say "Force-pushing web-dist ($dist_sha)..."
    git -C "$stage" push --force "$origin_url" web-dist || die "push of web-dist failed"
    pushed=$(git ls-remote "$origin_url" refs/heads/web-dist | cut -f1)
    [[ "$pushed" == "$dist_sha" ]] || die "verification failed: remote web-dist is '$pushed', expected '$dist_sha'"
    say "Verified: origin/web-dist == $dist_sha"
    if $TAG; then
        git tag "web-v$ver" || die "tag web-v$ver already exists — bump first (--bump patch)"
        git push origin "web-v$ver" || die "tag push failed"
        say "Tagged web-v$ver (release.yml builds the pinned tarball)"
    fi
else
    say "--no-push: run these when ready:"
    echo "    git push origin main"
    echo "    git -C $stage push --force $origin_url web-dist   # (stage is deleted on exit — re-run without --no-push instead)"
    $TAG && echo "    git tag web-v$ver && git push origin web-v$ver"
fi

say "Done: canvas-web $ver (main@$rev) → web-dist. Deployments pick it up on their next update; local canvas-server dev: npm install canvas-web@github:canvas-ui/canvas#web-dist --no-save"

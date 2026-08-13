#!/usr/bin/env bash
# update-releases.sh — ONE command to release any app in this monorepo.
#
#   npm run release:web                       build + publish the web-dist branch
#   npm run release:extension                 tag extension-v<ver> → CI builds both zips
#   npm run release:cli                       tag cli-v<ver> → CI builds + publishes
#   npm run release:desktop                   tag desktop-v<ver> → CI builds (multi-OS)
#   npm run release:all                       all of the above; already-released
#                                             versions are skipped, web always republishes
#
#   any of the above -- --bump patch|minor|major   bump the app version first (committed)
#   web only        -- --tag                       ALSO tag web-v<ver> (pinned tarball via CI)
#   any             -- --no-push                   stop before pushing, print what would run
#   any             -- --allow-dirty               skip the clean-tree check (hacking only)
#
# Per-app release modes (why they differ):
#   web        local build → force-push { package.json, dist/ } to the `web-dist`
#              branch. canvas-server consumes it as
#              "canvas-web": "github:canvas-ui/canvas#web-dist" and re-resolves
#              on every deployment update — a push here updates every instance.
#   extension  tag extension-v<ver> + push — release.yml builds both zips on a
#              clean runner and attaches them. (It used to build locally and
#              upload from the maintainer's machine; CI builds it now, so the
#              artifact that reaches the browser stores is reproducible.)
#   cli        tag cli-v<ver> + push — release.yml builds and publishes.
#   desktop    tag desktop-v<ver> + push — release.yml builds (needs CI's
#              multi-OS runners; deliberately NOT built locally).
#
# Design constraints: non-interactive, deterministic, one loud line per step,
# every failure names its cause and exits non-zero — safe to hand to a cron
# job or a small supervising model.
set -euo pipefail

say() { echo "[release $(date '+%H:%M:%S')] $1"; }
die() { echo "[release] ERROR: $1" >&2; exit 1; }

APP="${1:-}"
[[ -n "$APP" && "$APP" != -* ]] || die "first argument must be the app: web | extension | cli | desktop (see --help)"
shift

BUMP=""
TAG=false
PUSH=true
ALLOW_DIRTY=false
SKIP_EXISTING=false
while [[ $# -gt 0 ]]; do
    case "$1" in
        --bump) BUMP="${2:-}"; shift 2 ;;
        --tag) TAG=true; shift ;;
        --no-push) PUSH=false; shift ;;
        --allow-dirty) ALLOW_DIRTY=true; shift ;;
        --skip-existing) SKIP_EXISTING=true; shift ;;
        -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) die "unknown argument '$1' (see --help)" ;;
    esac
done

# ── `all`: every app in sequence ─────────────────────────────────────────────
# web republishes unconditionally (the branch is idempotent); tagged apps skip
# when their current version is already released — so `release:all` after a
# few webui commits updates the web and touches nothing else.
if [[ "$APP" == "all" ]]; then
    # The clean-tree check runs ONCE here: earlier apps' builds may regenerate
    # files (theme fallbacks etc.), which must not fail the apps after them.
    if ! $ALLOW_DIRTY && ! git diff-index --quiet HEAD --; then
        die "working tree has uncommitted changes — commit them or pass --allow-dirty"
    fi
    rc=0
    for app in web extension cli desktop; do
        say "── $app ─────────────────────────────"
        bash "$0" "$app" --skip-existing --allow-dirty \
            $($PUSH || echo --no-push) \
            ${BUMP:+--bump "$BUMP"} || rc=1
    done
    [[ $rc -eq 0 ]] && say "release:all complete" || die "release:all finished with failures (see above)"
    exit $rc
fi

# ── App recipes ──────────────────────────────────────────────────────────────
case "$APP" in
    web)       APP_DIR="apps/web";               MODE="branch"; TAG_PREFIX="web-v" ;;
    extension) APP_DIR="apps/browser-extension"; MODE="ci-tag"; TAG_PREFIX="extension-v" ;;
    cli)       APP_DIR="apps/cli";               MODE="ci-tag"; TAG_PREFIX="cli-v" ;;
    desktop)   APP_DIR="apps/desktop";           MODE="ci-tag"; TAG_PREFIX="desktop-v" ;;
    *) die "unknown app '$APP' — valid: web, extension, cli, desktop" ;;
esac

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || die "not inside a git repository"
cd "$ROOT"
[[ -f "$APP_DIR/package.json" ]] || die "$APP_DIR/package.json not found — run from the canvas monorepo"

# ── Preconditions (shared) ───────────────────────────────────────────────────
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
        if [[ "${GITHUB_ACTIONS:-}" == "true" ]]; then
            say "origin/main moved past this run — superseded by a newer push, exiting cleanly"
            exit 0
        fi
        die "main is behind/diverged from origin/main — pull/rebase first"
    fi
fi

command -v corepack >/dev/null || die "corepack not found (ships with node >= 16.9)"
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# ── Optional version bump ────────────────────────────────────────────────────
if [[ -n "$BUMP" ]]; then
    case "$BUMP" in patch|minor|major) ;; *) die "--bump must be patch, minor or major (got '$BUMP')" ;; esac
    ( cd "$APP_DIR" && npm version "$BUMP" --no-git-tag-version >/dev/null ) || die "version bump failed"
    ver=$(node -p "require('./$APP_DIR/package.json').version")
    git add "$APP_DIR/package.json"
    # The extension carries the version in two more places, and release.yml
    # asserts all three agree — bump them together or the tag fails CI.
    if [[ "$APP" == "extension" ]]; then
        for f in manifest-chromium.json manifest-firefox.json; do
            node -e "
const fs = require('fs'), p = '$APP_DIR/$f';
const m = JSON.parse(fs.readFileSync(p, 'utf8'));
m.version = '$ver';
fs.writeFileSync(p, JSON.stringify(m, null, 2) + '\n');
" || die "failed to bump $f"
            git add "$APP_DIR/$f"
        done
        say "Synced $ver into both extension manifests"
    fi
    git commit --quiet -m "$APP_DIR $ver" || die "bump commit failed"
    say "Bumped $APP_DIR to $ver (committed)"
fi

ver=$(node -p "require('./$APP_DIR/package.json').version")
rev=$(git rev-parse --short HEAD)
tag="$TAG_PREFIX$ver"

push_main_if_needed() {
    if [[ -n "$BUMP" ]] || [[ "$local_sha" != "$remote_sha" ]]; then
        say "Pushing main..."
        git push origin main || die "push of main failed"
    fi
}

# ── Mode: ci-tag (cli, desktop, extension) — CI builds, we only tag ──────────
if [[ "$MODE" == "ci-tag" ]]; then
    if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
        $SKIP_EXISTING && { say "$APP $ver already released ($tag exists) — skipping"; exit 0; }
        die "tag $tag already exists — bump first (--bump patch)"
    fi
    if ! $PUSH; then
        say "--no-push: would push main (if needed) and tag $tag; CI (release.yml) builds from the tag"
        exit 0
    fi
    push_main_if_needed
    git tag "$tag" || die "tagging $tag failed"
    git push origin "$tag" || die "tag push failed"
    if [[ "${GITHUB_ACTIONS:-}" == "true" ]] && command -v gh >/dev/null; then
        # A tag pushed with the workflow GITHUB_TOKEN does NOT trigger other
        # workflows (GitHub's recursion guard) — start release.yml explicitly.
        gh workflow run release.yml --ref "$tag" \
            && say "Dispatched release.yml for $tag" \
            || say "WARN: could not dispatch release.yml for $tag — run it manually"
    fi
    say "Done: $tag pushed — release.yml is building. Watch: gh run list --workflow=release.yml --limit 1"
    exit 0
fi

# ── Mode: branch (web) — build locally, publish the web-dist branch ──────────
say "Installing (filtered, frozen lockfile)..."
corepack pnpm install --filter canvas-web... --frozen-lockfile >/dev/null || die "pnpm install failed"
say "Building apps/web $ver..."
corepack pnpm --filter canvas-web run build >/dev/null || die "web build failed"
[[ -f "$APP_DIR/dist/index.html" ]] || die "build produced no dist/index.html"

stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT
cp -r "$APP_DIR/dist" "$stage/dist"
node -e "
const p = require('./$APP_DIR/package.json');
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
# In CI the checkout's auth lives in ITS git config; the staged repo has none.
if [[ -n "${GITHUB_TOKEN:-}" && "$origin_url" == https://github.com/* ]]; then
    origin_url="https://x-access-token:${GITHUB_TOKEN}@github.com/${origin_url#https://github.com/}"
fi
(
    cd "$stage"
    git init --quiet -b web-dist
    git add -A
    git -c user.name="release:web" -c user.email="release@canvas" \
        commit --quiet -m "canvas-web $ver (main@$rev)"
) || die "failed to assemble the web-dist commit"
dist_sha=$(git -C "$stage" rev-parse HEAD)

if $PUSH; then
    push_main_if_needed
    say "Force-pushing web-dist ($dist_sha)..."
    git -C "$stage" push --force "$origin_url" web-dist || die "push of web-dist failed"
    pushed=$(git ls-remote "$origin_url" refs/heads/web-dist | cut -f1)
    [[ "$pushed" == "$dist_sha" ]] || die "verification failed: remote web-dist is '$pushed', expected '$dist_sha'"
    say "Verified: origin/web-dist == $dist_sha"
    if $TAG; then
        git rev-parse -q --verify "refs/tags/$tag" >/dev/null && die "tag $tag already exists — bump first (--bump patch)"
        git tag "$tag" && git push origin "$tag" || die "tag push failed"
        say "Tagged $tag (release.yml builds the pinned tarball)"
    fi
else
    say "--no-push: web-dist commit assembled ($dist_sha); re-run without --no-push to publish"
fi

say "Done: canvas-web $ver (main@$rev) → web-dist. Deployments pick it up on their next update; local canvas-server dev: npm install canvas-web@github:canvas-ui/canvas#web-dist --no-save"

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
#   any             -- --if-needed                 skip if nothing shipped since last release;
#                                                  patch-bump tagged apps whose code moved
#   any             -- --no-push                   stop before pushing, print what would run
#   any             -- --dry-run                   print the plan, change nothing
#   any             -- --allow-dirty               skip the clean-tree check (hacking only)
#
# Per-app release modes (why they differ):
#   web        local build → force-push { package.json, dist/ } to the `web-dist`
#              branch. canvas-server consumes it as
#              "canvas-web": "github:canvas-ui/canvas#web-dist" and re-resolves
#              on every `npm update canvas-web`.
#   extension  tag extension-v<ver> + push — release.yml builds both zips.
#   cli        tag cli-v<ver> + push — release.yml builds and publishes.
#   desktop    tag desktop-v<ver> + push — release.yml builds (needs CI's
#              multi-OS runners; deliberately NOT built locally).
#
# CI never bumps a version and never writes to main. This script is the writer;
# release.yml is the builder, triggered by the tags this pushes.
#
# Design constraints: non-interactive, deterministic, one loud line per step,
# every failure names its cause and exits non-zero.
set -euo pipefail

say() { echo "[release $(date '+%H:%M:%S')] $1"; }
die() { echo "[release] ERROR: $1" >&2; exit 1; }

# A build (pnpm install, vite) rewrites tracked files with identical content,
# leaving git's stat cache stale — `git diff-index` then reports a clean tree as
# dirty. Refresh first so the check compares content, not mtimes.
tree_is_dirty() {
    git update-index -q --refresh >/dev/null 2>&1 || true
    ! git diff-index --quiet HEAD --
}

APP="${1:-}"
[[ -n "$APP" && "$APP" != -* ]] || die "first argument must be the app: web | extension | cli | desktop (see --help)"
shift

BUMP=""
IF_NEEDED=false
TAG=false
PUSH=true
DRY_RUN=false
ALLOW_DIRTY=false
SKIP_EXISTING=false
while [[ $# -gt 0 ]]; do
    case "$1" in
        --bump) BUMP="${2:-}"; shift 2 ;;
        --tag) TAG=true; shift ;;
        --no-push) PUSH=false; shift ;;
        --dry-run) DRY_RUN=true; shift ;;
        --allow-dirty) ALLOW_DIRTY=true; shift ;;
        --skip-existing) SKIP_EXISTING=true; shift ;;
        --if-needed|--autobump) IF_NEEDED=true; shift ;;
        -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) die "unknown argument '$1' (see --help)" ;;
    esac
done

# ── `all`: every app in sequence ─────────────────────────────────────────────
# Tagged apps skip when their current version is already released. Without
# --if-needed, web always republishes (the branch is idempotent). With
# --if-needed, web skips too unless something shippable moved.
if [[ "$APP" == "all" ]]; then
    # The clean-tree check runs ONCE here: earlier apps' builds may regenerate
    # files (theme fallbacks etc.), which must not fail the apps after them.
    if ! $DRY_RUN && ! $ALLOW_DIRTY && tree_is_dirty; then
        die "working tree has uncommitted changes — commit them or pass --allow-dirty"
    fi
    rc=0
    for app in web extension cli desktop; do
        say "── $app ─────────────────────────────"
        bash "$0" "$app" --skip-existing --allow-dirty \
            $($PUSH || echo --no-push) \
            $($DRY_RUN && echo --dry-run) \
            $($IF_NEEDED && echo --if-needed) \
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

if ! $DRY_RUN && ! $ALLOW_DIRTY && tree_is_dirty; then
    die "working tree has uncommitted changes — commit them or pass --allow-dirty"
fi

say "Fetching origin/main and tags..."
git fetch origin main --quiet || die "git fetch failed — no network?"
git fetch origin --tags --quiet || true
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

# ── Commit identity ──────────────────────────────────────────────────────────
# Fall back to the Actions bot only when the environment has no identity — a
# local run keeps yours. Needed because a version bump is a real commit.
if ! git config user.email >/dev/null 2>&1; then
    export GIT_AUTHOR_NAME="github-actions[bot]"
    export GIT_AUTHOR_EMAIL="41898282+github-actions[bot]@users.noreply.github.com"
    export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
    export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"
    say "no git identity configured — committing as $GIT_AUTHOR_NAME"
fi

# Every path whose changes should count as "this app changed": the app dir plus
# the directories of the workspace:* packages it depends on, transitively.
watch_paths() {
    node -e '
const fs = require("fs"), path = require("path");
const appDir = process.argv[1];
const roots = ["packages", "integrations", "apps"];
const byName = new Map();
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const d of fs.readdirSync(root)) {
    const p = path.join(root, d, "package.json");
    if (!fs.existsSync(p)) continue;
    try { byName.set(JSON.parse(fs.readFileSync(p, "utf8")).name, path.join(root, d)); } catch {}
  }
}
const out = new Set([appDir]);
const queue = [appDir];
while (queue.length) {
  const dir = queue.shift();
  let pkg;
  try { pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8")); } catch { continue; }
  for (const [name, spec] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
    if (!String(spec).startsWith("workspace:")) continue;
    const d = byName.get(name);
    if (d && !out.has(d)) { out.add(d); queue.push(d); }
  }
}
console.log([...out].join(" "));
' "$1"
}

# Non-docs commits under the app's watch paths since $1 (a tag or a commit).
# Markdown never ships in a binary, so a README edit must not cut a release —
# 2.1.11 was published by a docs commit before this exclusion existed.
commits_since() {
    local since=$1
    local paths
    paths=$(watch_paths "$APP_DIR") || die "could not resolve watch paths for $APP_DIR"
    # shellcheck disable=SC2086
    git log --oneline "$since..HEAD" -- $paths ':(exclude)*.md' | wc -l
}

# ── --if-needed: skip or patch-bump from "did anything shippable move?" ──────
if $IF_NEEDED && [[ -z "$BUMP" ]]; then
    cur=$(node -p "require('./$APP_DIR/package.json').version")
    if [[ "$MODE" == "branch" ]]; then
        git fetch origin web-dist --quiet || true
        published=$(git show origin/web-dist:package.json 2>/dev/null \
            | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{process.stdout.write(JSON.parse(d).canvasRev||'')}catch{}})")
        if [[ -n "$published" ]] && git rev-parse --verify "${published}^{commit}" >/dev/null 2>&1; then
            n=$(commits_since "$published")
            if [[ "$n" -eq 0 ]]; then
                say "--if-needed: web-dist already has $published and nothing shippable moved — skipping"
                exit 0
            fi
            say "--if-needed: $n non-docs commit(s) since web-dist@$published — republishing"
        else
            say "--if-needed: no readable canvasRev on origin/web-dist — publishing"
        fi
    else
        cur_tag="$TAG_PREFIX$cur"
        if ! git rev-parse -q --verify "refs/tags/$cur_tag" >/dev/null; then
            say "--if-needed: $cur_tag is not released yet — releasing $cur as-is"
        else
            n=$(commits_since "$cur_tag")
            if [[ "$n" -gt 0 ]]; then
                BUMP="patch"
                say "--if-needed: $n non-docs commit(s) since $cur_tag → patch bump"
            else
                say "--if-needed: nothing shippable moved since $cur_tag — skipping"
                exit 0
            fi
        fi
    fi
fi

if $DRY_RUN; then
    cur=$(node -p "require('./$APP_DIR/package.json').version")
    if [[ -n "$BUMP" ]]; then
        say "--dry-run: would bump $BUMP from $cur and release $APP"
    else
        say "--dry-run: would release $APP $cur"
    fi
    exit 0
fi

# ── Optional version bump ────────────────────────────────────────────────────
if [[ -n "$BUMP" ]]; then
    case "$BUMP" in patch|minor|major) ;; *) die "--bump must be patch, minor or major (got '$BUMP')" ;; esac
    ( cd "$APP_DIR" && npm version "$BUMP" --no-git-tag-version >/dev/null ) || die "version bump failed"
    ver=$(node -p "require('./$APP_DIR/package.json').version")
    git add "$APP_DIR/package.json"
    # Sidecar files that release.yml asserts against the tag. A JSON round-trip
    # would reformat (blank-line grouping); rewrite the version string in place.
    rewrite_json_version() {
        local file=$1
        FILE=$file VER=$ver node -e '
const fs = require("fs");
const p = process.env.FILE, v = process.env.VER;
const src = fs.readFileSync(p, "utf8");
const out = src.replace(/("version"\s*:\s*")[^"]+(")/, `$1${v}$2`);
if (out === src) { console.error("no version field rewritten in " + p); process.exit(1); }
if (JSON.parse(out).version !== v) { console.error("version rewrite failed in " + p); process.exit(1); }
fs.writeFileSync(p, out);
' || die "failed to bump $file"
        git add "$file"
    }
    if [[ "$APP" == "extension" ]]; then
        rewrite_json_version "$APP_DIR/manifest-chromium.json"
        rewrite_json_version "$APP_DIR/manifest-firefox.json"
        say "Synced $ver into both extension manifests"
    fi
    if [[ "$APP" == "desktop" ]]; then
        rewrite_json_version "$APP_DIR/src-tauri/tauri.conf.json"
        # Cargo.toml [package] version, first match only — later [[package]]
        # deps in the lockfile are a different file.
        sed -i "0,/^version = \".*\"/{s/^version = \".*\"/version = \"$ver\"/}" \
            "$APP_DIR/src-tauri/Cargo.toml" || die "failed to bump Cargo.toml"
        git add "$APP_DIR/src-tauri/Cargo.toml"
        if command -v cargo >/dev/null; then
            ( cd "$APP_DIR/src-tauri" && cargo update -p canvas-desktop --precise "$ver" ) \
                || die "cargo update failed — Cargo.lock would not match $ver"
            git add "$APP_DIR/src-tauri/Cargo.lock"
        else
            die "cargo not on PATH — desktop bump needs it to refresh Cargo.lock"
        fi
        say "Synced $ver into tauri.conf.json and Cargo.toml"
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
    # release.yml re-asserts these, but it does so AFTER the tag is pushed —
    # which is how extension-v3.1.1 came to exist with no release behind it
    # (package.json was bumped by hand, both manifests left a version behind).
    # Fail here instead, while the tag is still just an idea.
    if [[ "$APP" == "extension" ]]; then
        for f in manifest-chromium.json manifest-firefox.json; do
            mv=$(node -p "require('./$APP_DIR/$f').version")
            [[ "$mv" == "$ver" ]] || die "$f is $mv but package.json is $ver — re-run with --bump to sync all three, or fix $f by hand; tagging now would fail CI after the tag is public"
        done
    fi
    if [[ "$APP" == "desktop" ]]; then
        tv=$(node -p "require('./$APP_DIR/src-tauri/tauri.conf.json').version")
        [[ "$tv" == "$ver" ]] || die "tauri.conf.json is $tv but package.json is $ver — re-run with --bump to sync; tagging now would fail CI after the tag is public"
    fi
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

<p align="center">
  <img src="https://raw.githubusercontent.com/canvas-ai/.github/main/banners/canvas-banner_1200x480.jpg" alt="Canvas" width="100%" />
</p>

# Canvas common

Shared packages of Canvas UI(OS) — published to npm under `@augmentd-labs` —
plus the `canvas-edge` device runtime. Every client lives in its own
repository with its own release pipeline:

| repo | what |
|---|---|
| [canvas-server](https://github.com/canvas-ui/canvas-server) | the server |
| [canvas-web](https://github.com/canvas-ui/canvas-web) | web UI (`@augmentd-labs/canvas-web`) |
| [canvas-cli](https://github.com/canvas-ui/canvas-cli) | `canvas` CLI + lazily installed CLI packages + canvas-shell |
| [canvas-desktop](https://github.com/canvas-ui/canvas-desktop) | desktop app (moving out of `apps/desktop`) |
| [canvas-browser-extension](https://github.com/canvas-ui/canvas-browser-extension) | browser extension (moving out of `apps/browser-extension`) |

## Project screenshots

- https://demo.cnvs.ai/pub/c/aks6zaf8


## Demo instance

- https://demo.cnvs.ai/
- demo@canvas.local

## Layout

```
apps/                    (interim — moving to their own repos)
  desktop                Tauri desktop app
  browser-extension      Chromium + Firefox extension (esbuild)
packages/
  protocol               wire contract: envelope, error codes, routes, events, sync constants
  schemas                document schema ids, versions, builders
  api-client             ergonomic REST client over protocol
  wallpapers             bundled wallpapers + picker metadata
runtimes/
  edge                   device runtime: folder mirrors (canvas-stored) + edge tunnel client
integrations/
  kde                    desktop share bridge: Dolphin "Send to Canvas" + selected-text capture
```

- [`runtimes/edge`](runtimes/edge/README.md) — `canvas-edge` daemon (`canvas remote mirror edge install`)

## Shared packages on npm

The libraries are published to npm under `@augmentd-labs` by `npm-publish.yml`
(`scripts/publish-npm.mjs`) whenever a package's version is new — release =
bump the version, push main. Workspace deps become `^version` deps; edge
bundles its git dep (canvas-stored). npm trusted publishing (GitHub OIDC), so
no token lives anywhere, and every version carries provenance.

| package | source |
|---|---|
| `@augmentd-labs/canvas-protocol` | `packages/protocol` |
| `@augmentd-labs/canvas-schemas` | `packages/schemas` |
| `@augmentd-labs/canvas-api-client` | `packages/api-client` |
| `@augmentd-labs/canvas-wallpapers` | `packages/wallpapers` |
| `@augmentd-labs/canvas-edge` | `runtimes/edge` |

The web UI lives in [canvas-web](https://github.com/canvas-ui/canvas-web) and
is published as `@augmentd-labs/canvas-web`.

### The old `*-dist` branches

Before the npm switch (2026-10) consumers installed `github:canvas-ui/canvas#<name>-dist`
branches. They are frozen — no longer updated, kept so older lockfiles still
install. `ci.yml` stages every npm package on each PR and smoke-tests the edge
tarball; `housekeeping.yml` keeps the last 5 runs per workflow and the last 5
releases per app.

## Development

```bash
pnpm install
pnpm test          # package test suites (node --test)
pnpm run lint      # root eslint over packages/ + per-app lint
pnpm run build     # per-package dev builds
```

pnpm is deliberate: its strict `node_modules` makes an undeclared dependency an
install-time error, which is the property that keeps `packages/*` independently
installable. Do not add dependencies that only work because something else
hoisted them.

## Desktop integration

Canvas is backend-first: pipe your data sources in, mount context-aware apps
(or a context as a filesystem), and let a context switch update everything
bound to it. Until the Tauri desktop app covers this natively, small bridges
in `integrations/` hook the OS into the same REST pipeline the web UI uses:

- **`integrations/kde/`** — "Send to Canvas" in Dolphin's context menu (KIO
  service menu), plus `canvas-share --selection` for filing any highlighted
  text (a note, or a link when it's a bare URL) via a global shortcut or
  Klipper action. Stdlib-python + a `.desktop` file; `./install.sh`, then set
  the API token in `~/.config/canvas/share.conf`. See its README for why the
  KDE *Share* submenu (Purpose) needs a compiled plugin — that, a
  Nautilus/GNOME equivalent, and PWA `share_target` (already live for
  Android/ChromeOS installs of the web UI) are the surrounding pieces.

## Licensing

Everything in this repository is available under the
**AGPL-3.0-or-later** — see [LICENSE](LICENSE) and [NOTICE](NOTICE) — but the
two halves differ beyond that:

- **`apps/*` are AGPL-only, for everyone, permanently.** No commercial
  licence is offered for the client applications, to anyone, and none is
  planned: the Canvas clients stay free software in all cases. Contributions
  need only a DCO sign-off (`git commit -s`).
- **`packages/*` are part of the dual-licensed Canvas engine** (AGPL-3.0-or-later
  or a commercial licence), alongside `canvas-server`, `canvas-synapsd`,
  `canvas-stored`, `canvas-inferd` and `canvas-agentd`. Contributions are
  asked for under the one-time Canvas [CLA](https://github.com/canvas-ui/canvas-server/blob/main/CLA.md).

See [CONTRIBUTING.md](CONTRIBUTING.md) here and the server's
[COMMERCIAL.md](https://github.com/canvas-ui/canvas-server/blob/main/COMMERCIAL.md)
for the commercial side.

## Package naming & distribution

Packages use the `@augmentd-labs/canvas-*` scope — the product brands as Canvas OS; the
GitHub org login is unrelated plumbing and npm scopes are independent of it.
The `augmentd-labs` npm org is claimed; nothing here publishes yet.

Distribution plan: workspace links inside the monorepo (forever), `file:`
links to sibling checkouts during the transition, **GitHub Release tarballs**
(`pnpm pack` per package, attached to a tag) once canvas-server's CI/Docker
needs fetchable artifacts, and public npmjs when third-party adoption starts. GitHub Packages is deliberately not used: it
requires an auth token even for public installs and chains the scope to the
org name.

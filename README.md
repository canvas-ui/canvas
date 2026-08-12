# Canvas

Monorepo for the Canvas open layer: client apps and the shared packages they
are built on. The server ([canvas-server](https://github.com/canvas-ui/canvas-server))
stays in its own repository and consumes the shared packages; the master
migration plan lives there in `TODO.monorepo-migration.md`.

## Layout

```
apps/
  cli                    Canvas CLI (bun-compiled binaries)
  desktop                Tauri desktop app (frontend builds in CI; Rust bundle needs the Tauri toolchain)
  browser-extension      Chromium + Firefox extension (esbuild)
  shell                  bash client — not an npm package, pnpm skips it
  web                    web UI (vite/react; prebuilt artifact consumed by canvas-server)
packages/
  protocol               wire contract: envelope, error codes, routes, events
  schemas                document schema ids, versions, builders
  api-client             ergonomic REST client over protocol
```

## Development

```bash
pnpm install
pnpm test          # package test suites (node --test)
pnpm run lint      # root eslint over packages/ + per-app lint
pnpm run build     # per-package dev builds (apps/cli → bun compile)
```

pnpm is deliberate: its strict `node_modules` makes an undeclared dependency an
install-time error, which is the property that keeps `packages/*` independently
installable. Do not add dependencies that only work because something else
hoisted them.

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

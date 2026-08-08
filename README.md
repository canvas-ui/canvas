# Canvas

Monorepo for the Canvas open layer: client apps and the shared packages they
are built on. The server ([canvas-server](https://github.com/canvas-ui/canvas-server))
stays in its own repository and consumes the shared packages; the master
migration plan lives there in `TODO.monorepo-migration.md`.

## Layout

```
apps/
  cli                    Canvas CLI (bun-compiled binaries)
  web                    (arrives in Phase 3)
  desktop                (arrives in Phase 3, Tauri)
  browser-extension      (arrives in Phase 3)
  shell                  (arrives in Phase 3)
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

## Licensing (interim)

**There is intentionally no repository-wide LICENSE file yet.** This repo is
mid-migration:

- `apps/*` retain the LICENSE files of the repositories they were folded from
  (currently AGPL-3.0-or-later).
- `packages/*` are `AGPL-3.0-or-later` per their manifest `license` fields
  (authored from AGPL sources).
- No rights are granted beyond what each directory states.

The open layer is planned to move to Apache-2.0 in a later, announced phase of
the migration; until that happens the per-directory terms above are the whole
story.

## Package naming

Packages use the `@canvas/*` scope. The scope is not yet claimed on npmjs
(claim attempt pending); nothing here publishes yet, and the recorded fallback
is a mechanical rename to `@canvas-ui/*` before the first publish (GitHub
Packages would require the org scope anyway).

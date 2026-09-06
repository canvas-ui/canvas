# @augmentd-labs/canvas-edge

The device-side Canvas runtime. One Node process, two jobs:

- **mirror** — keep real folders in sync with hub workspaces (canvas-stored's
  `Mirror` engine, state under `<folder>/.workspace/`). Configured by the CLI's
  `~/.canvas/config/mirrors.json` (`canvas mirror init`), driven over a local
  control socket (`~/.canvas/run/edge.sock`, a localhost port on Windows).
- **tunnel** — `EdgeClient` dials out to a canvas-server, announces what this
  runtime hosts and replays proxied requests into a local fastify app, so a
  remote workspace or agent behaves as if it were server-local. The hub side
  (`EdgeRegistry`) lives in canvas-server.

No canvas-server imports: the same package backs `ws`, canvas-agentd and the
desktop sidecar. This is the seed of the generic standalone runtime
(`mirror | workspace | agent` units behind one lifecycle).

```
canvas-edge --foreground        # run attached (pm2 / systemd); logs to stdout
canvas-edge                     # detached, logs to ~/.canvas/var/log/canvas-edge.log
```

## Install

Not on npm yet. The pipeline publishes a self-contained artifact branch,
`edge-dist`. The CLI fetches it into its own prefix:

```
canvas mirror edge install      # → ~/.canvas/edge/node_modules/@augmentd-labs/canvas-edge
canvas mirror edge update       # latest edge-dist + restart the daemon
```

(`npm install --ignore-scripts github:canvas-ui/canvas#edge-dist` in any
project does the same; avoid `npm -g` — global installs of git packages with
bundled deps came out incomplete on npm 11.) `canvas mirror init` offers the
install when the binary is missing. The
artifact bundles its workspace/git dependencies (canvas-protocol,
canvas-stored) and keeps only registry dependencies external — see
`scripts/pack-dist.mjs`.

Protocol: canvas-server `docs/canvas-edge-protocol.md` (tunnel) and
`docs/sync-protocol.md` (file plane).

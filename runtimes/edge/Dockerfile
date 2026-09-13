# canvas-edge — a workspace mirror in a container (docs/durable-workspaces.md,
# step 4). Installs the self-contained `edge-dist` artifact; no build step, no
# git. Unprivileged, outbound-only: the daemon dials the hub, nothing listens
# on the network (the control socket lives on the /config volume).
#
#   docker build -t canvas-edge -f runtimes/edge/Dockerfile .
#   docker build --build-arg EDGE_PACKAGE=<tarball url or path> …
#
# Volumes
#   /config   remotes.json, mirrors.json, device.json, run/edge.sock, var/log
#   /state    per-mirror ledger, queue, cache, trash, conflicts (CANVAS_EDGE_STATE_ROOT)
#   /data     the mirrored folder (CANVAS_MIRROR_PATH) — bind-mount the real one
#
# Environment (one mirror; see runtimes/edge/src/env.js ensureEnvConfig)
#   CANVAS_HUB_URL, CANVAS_HUB_TOKEN, CANVAS_WORKSPACE            required
#   CANVAS_DIRECTION=bi|pull|push  CANVAS_DEVICE_ID  CANVAS_DEVICE_NAME  optional
FROM node:22-bookworm-slim

ARG EDGE_PACKAGE=https://codeload.github.com/canvas-ui/canvas/tar.gz/edge-dist
ENV NODE_ENV=production \
    CANVAS_EDGE_HOME=/config \
    CANVAS_DEVICE_FILE=/config/device.json \
    CANVAS_EDGE_STATE_ROOT=/state \
    CANVAS_MIRROR_PATH=/data \
    LOG_LEVEL=info

WORKDIR /opt/canvas-edge
RUN npm install --omit=dev --ignore-scripts --no-audit --no-fund --no-package-lock "$EDGE_PACKAGE" \
    && npm cache clean --force \
    && mkdir -p /config /state /data \
    && chown -R node:node /opt/canvas-edge /config /state /data

USER node
VOLUME ["/config", "/state", "/data"]

HEALTHCHECK --interval=60s --timeout=10s --start-period=30s --retries=3 \
    CMD ["node", "/opt/canvas-edge/node_modules/@augmentd-labs/canvas-edge/bin/healthcheck.mjs"]

ENTRYPOINT ["node", "/opt/canvas-edge/node_modules/@augmentd-labs/canvas-edge/bin/canvas-edge", "--foreground"]

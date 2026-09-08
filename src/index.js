'use strict';

/**
 * @augmentd-labs/canvas-edge — the device-side Canvas runtime.
 *
 * Two jobs today, one process (`bin/canvas-edge`):
 *   mirror  — keep real folders in sync with hub workspaces (canvas-stored's
 *             Mirror engine; state under <folder>/.workspace/)
 *   tunnel  — EdgeClient dials out to a canvas-server, announces what this
 *             runtime hosts and replays proxied requests into a local fastify
 *             app, so a remote workspace/agent behaves as if server-local
 *
 * Zero canvas-server imports on purpose: the same package backs `ws`,
 * canvas-agentd and the desktop sidecar. The hub side of the tunnel
 * (EdgeRegistry) lives in canvas-server. Protocol: canvas-server
 * docs/canvas-edge-protocol.md; sync wire contract: docs/sync-protocol.md.
 */

export { default as EdgeClient } from './EdgeClient.js';
export { connectRemotes, buildAnnounce } from './runtime.js';
export { readWorkspaceConfig, listRemotes, saveRemote, removeRemote } from './remote-config.js';
export { EDGE_HOME, EDGE_PATHS, deviceIdentity, hubFor, daemonMirrors } from './env.js';
export { MirrorRuntime } from './mirror-runtime.js';
export { startControl } from './control.js';
export { main } from './daemon.js';

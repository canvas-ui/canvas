'use strict';

/**
 * Canonical "this workspace exists but is stopped" condition — HTTP 409.
 *
 * Clients act on this one: a query against a sleeping workspace may start it
 * and replay itself. Match on `code`; the message is stable but for humans.
 * Mirrors canvas-server/src/transports/ResponseObject.js.
 */
export const WORKSPACE_NOT_ACTIVE = 'WORKSPACE_NOT_ACTIVE';
export const WORKSPACE_NOT_ACTIVE_MESSAGE = 'Workspace is not active. Start the workspace first.';

/**
 * Matches the message form of the condition for servers/paths that predate the
 * `code` field. Deliberately narrow: `Agent is not active` must NOT match
 * (same rule as the server's ResponseObject.isWorkspaceNotActiveError).
 */
const WORKSPACE_NOT_ACTIVE_RE = /workspace (is )?not active/i;

/**
 * True when an envelope or an error represents the workspace-not-active
 * condition. Accepts anything with `code` and/or `message` properties.
 *
 * @param {{code?: string, message?: string}|null|undefined} x
 * @returns {boolean}
 */
export function isWorkspaceNotActive(x) {
    if (!x || typeof x !== 'object') return false;
    if (x.code === WORKSPACE_NOT_ACTIVE) return true;
    return WORKSPACE_NOT_ACTIVE_RE.test(x.message || '');
}

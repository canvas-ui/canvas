'use strict';

/** REST API base path; clients join `baseUrl + API_BASE + route`. */
export const API_BASE = '/rest/v2';

/** Default whole-request timeout shared by the existing clients. */
export const DEFAULT_TIMEOUT_MS = 30000;

/**
 * Optional client identification header. Convention: the web UI sends its
 * hostname, the browser extension sends 'canvas-extension'.
 */
export const HEADER_APP_NAME = 'X-App-Name';

/**
 * Prefix of long-lived API and device tokens. Anything else presented as a
 * Bearer credential is treated as a JWT. Both travel the same way (see
 * bearerHeader); the server decides which strategy verifies them.
 */
export const API_TOKEN_PREFIX = 'canvas-';

/**
 * @param {string} token JWT or `canvas-*` API/device token
 * @returns {{Authorization: string}}
 */
export function bearerHeader(token) {
    return { Authorization: `Bearer ${token}` };
}

'use strict';

/**
 * Error thrown for failed requests and error envelopes.
 *
 * `code` is a machine STRING — the envelope `code` field when the server sent
 * one (e.g. 'WORKSPACE_NOT_ACTIVE'), 'CANVAS_ERROR' otherwise. `statusCode`
 * is the numeric HTTP/envelope status; `status` is kept as an alias because
 * the pre-monorepo cli error carried the number there.
 */
export class CanvasError extends Error {
    constructor(message, { code, statusCode, status, cause } = {}) {
        super(message);
        this.name = 'CanvasError';
        this.code = code || 'CANVAS_ERROR';
        this.statusCode = statusCode ?? status;
        this.status = status ?? statusCode;
        if (cause) this.cause = cause;
    }
}

export class AuthError extends CanvasError {
    constructor(message) {
        super(message, { code: 'AUTH', status: 401 });
        this.name = 'AuthError';
    }
}

export class NotFoundError extends CanvasError {
    constructor(message) {
        super(message, { code: 'NOT_FOUND', status: 404 });
        this.name = 'NotFoundError';
    }
}

/**
 * Connection-level failure codes. Two tables because the same client code
 * runs under node (undici codes) and inside bun-compiled binaries (Bun's
 * fetch throws its own code strings — node-style ECONNREFUSED never appears
 * there).
 */
const NODE_NETWORK_CODES = new Set([
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    'ECONNRESET',
    'EAI_AGAIN',
    'EPIPE',
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_SOCKET'
]);

const BUN_NETWORK_CODES = new Set([
    'ConnectionRefused',
    'ConnectionClosed',
    'FailedToOpenSocket',
    'DNSException',
    'Timeout'
]);

function collectCodes(err, out = new Set(), depth = 0) {
    if (!err || typeof err !== 'object' || depth > 6) return out;
    if (typeof err.code === 'string') out.add(err.code);
    // AggregateError from happy-eyeballs (multiple connect attempts)
    if (Array.isArray(err.errors)) {
        for (const e of err.errors) collectCodes(e, out, depth + 1);
    }
    if (err.cause) collectCodes(err.cause, out, depth + 1);
    return out;
}

/**
 * True when an error (however wrapped) represents a connection-level failure
 * — refused, unreachable, reset, DNS. Walks `cause` chains and
 * AggregateError members.
 *
 * @param {*} err
 * @returns {boolean}
 */
export function isNetworkError(err) {
    for (const code of collectCodes(err)) {
        if (NODE_NETWORK_CODES.has(code) || BUN_NETWORK_CODES.has(code)) return true;
    }
    return false;
}

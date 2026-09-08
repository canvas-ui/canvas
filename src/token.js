'use strict';

/**
 * Bearer-token helpers. Two token families travel the same Authorization
 * header: JWTs (expire) and opaque `canvas-*` API/device tokens (never
 * expire). Pure functions, no crypto — decoding only, never verification.
 */

/**
 * Decode a JWT payload without verifying the signature.
 * Returns the parsed payload object, or null if the value is not a JWT
 * (e.g. opaque `canvas-` API/device tokens).
 *
 * @param {string} token
 * @returns {Object|null}
 */
export function decodeJwtPayload(token) {
    if (typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        // atob yields a latin1 byte string; JWT payloads are UTF-8 JSON, so
        // decode the bytes properly (the historical extension helper mangled
        // non-ASCII here).
        const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
        return JSON.parse(new TextDecoder('utf-8').decode(bytes));
    } catch {
        return null;
    }
}

/**
 * Expiry of a JWT as a millisecond epoch timestamp, or null if the token is
 * not a JWT or carries no `exp` claim (opaque tokens never expire).
 *
 * @param {string} token
 * @returns {number|null}
 */
export function getJwtExpiryMs(token) {
    const payload = decodeJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') return null;
    return payload.exp * 1000;
}

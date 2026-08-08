'use strict';

/**
 * The Canvas response envelope, as produced by the server's
 * ResponseObject.getResponse() (canvas-server/src/transports/ResponseObject.js).
 *
 * @typedef {Object} ResponseEnvelope
 * @property {'success'|'error'} status
 * @property {number} statusCode
 * @property {string|null} message
 * @property {*} payload
 * @property {number|null} count
 * @property {number|null} totalCount
 * @property {*} [debug]    Optional diagnostic payload; only present when set.
 * @property {Object} [lines]  Optional per-line match counts (compound search).
 * @property {string} [code]   Optional machine-readable error code (e.g. WORKSPACE_NOT_ACTIVE).
 */

export const STATUS_SUCCESS = 'success';
export const STATUS_ERROR = 'error';

/**
 * True when a parsed body looks like the Canvas envelope.
 *
 * Requires both `status` and `payload` as own properties. Every real server
 * response carries both (ResponseObject serializes them unconditionally); this
 * is deliberately stricter than the historical cli check (`payload` alone) so
 * that payloads which merely contain a `payload` key are not mistaken for
 * envelopes.
 *
 * @param {*} x
 * @returns {x is ResponseEnvelope}
 */
export function isEnvelope(x) {
    return (
        !!x &&
        typeof x === 'object' &&
        !Array.isArray(x) &&
        Object.prototype.hasOwnProperty.call(x, 'status') &&
        Object.prototype.hasOwnProperty.call(x, 'payload')
    );
}

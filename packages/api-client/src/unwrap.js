'use strict';

import { isEnvelope, STATUS_ERROR } from '@augmentd-labs/canvas-protocol';
import { CanvasError } from './errors.js';

/**
 * Unwrap a parsed response body. Envelopes return their payload; error
 * envelopes throw a CanvasError carrying the machine `code` (string) and the
 * envelope `statusCode`. Non-envelope bodies pass through untouched.
 *
 * @param {*} body
 * @returns {*} the envelope payload, or the body itself
 * @throws {CanvasError}
 */
export function unwrap(body) {
    if (!isEnvelope(body)) return body;
    if (body.status === STATUS_ERROR) {
        throw new CanvasError(body.message || 'Request failed', {
            code: body.code,
            statusCode: body.statusCode,
            status: body.statusCode
        });
    }
    return body.payload;
}

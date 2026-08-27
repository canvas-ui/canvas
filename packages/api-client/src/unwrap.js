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
        // Routes report the cause as the payload (`.error('Failed to create
        // context', err.message)`), so throwing the message alone turned every
        // one of them into the same unhelpful sentence.
        const message = body.message || 'Request failed';
        const detail = typeof body.payload === 'string' ? body.payload.trim() : '';
        throw new CanvasError(detail && !message.includes(detail) ? `${message}: ${detail}` : message, {
            code: body.code,
            statusCode: body.statusCode,
            status: body.statusCode
        });
    }
    return body.payload;
}

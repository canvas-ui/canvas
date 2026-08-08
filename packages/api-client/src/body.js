'use strict';

/**
 * Wrap an async-iterable (e.g. a Node Readable) as a web ReadableStream
 * without importing node:stream, so this module stays bundler-safe for
 * browser consumers.
 */
function asyncIterableToStream(iterable) {
    const it = iterable[Symbol.asyncIterator]();
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await it.next();
            if (done) {
                controller.close();
                return;
            }
            controller.enqueue(typeof value === 'string' ? new TextEncoder().encode(value) : value);
        },
        cancel(reason) {
            return it.return ? it.return(reason).then(() => undefined) : undefined;
        }
    });
}

const isNodeReadableLike = (x) =>
    !!x && typeof x === 'object' && typeof x.pipe === 'function' && typeof x[Symbol.asyncIterator] === 'function';

/**
 * Map caller-supplied data to a fetch body.
 *
 * @param {*} data
 * @returns {{ body?: *, duplex?: 'half', isJson?: boolean }}
 *   `duplex: 'half'` is required by undici for stream bodies; `isJson` marks
 *   bodies this function serialized (the client defaults Content-Type for
 *   those only).
 */
export function toFetchBody(data) {
    if (data === undefined || data === null) return {};
    if (typeof data === 'string') return { body: data };
    if (typeof Blob !== 'undefined' && data instanceof Blob) return { body: data };
    if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) return { body: data };
    if (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams) return { body: data };
    if (typeof ReadableStream !== 'undefined' && data instanceof ReadableStream) {
        return { body: data, duplex: 'half' };
    }
    if (isNodeReadableLike(data)) {
        return { body: asyncIterableToStream(data), duplex: 'half' };
    }
    return { body: JSON.stringify(data), isJson: true };
}

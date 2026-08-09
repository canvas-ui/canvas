'use strict';

import { SCHEMA_FILE, FILE_SCHEMA_VERSION } from '../ids.js';

// Local basename so this module stays importable from browser bundles
// (esbuild/vite with platform=browser reject node:path; the package root
// re-exports this builder). Handles / and \ separators and trailing slashes,
// matching node's path.basename for the inputs the builders see.
function basename(p) {
    const s = String(p).replace(/[\\/]+$/, '');
    const parts = s.split(/[\\/]/);
    return parts[parts.length - 1] || '';
}

/**
 * Build a File document for in-place indexing (the cli `add`/ingest flow):
 * bytes stay on the device, the location is a `file://<deviceId>/<path>` URL.
 * Verbatim port of the cli builder — wire-identical output.
 *
 * (Web's post-upload variant — `stored://` blob URL, sha256-only — is a
 * different flow and lands here with the web migration.)
 *
 * @param {string} absPath absolute path on the device
 * @param {Object} opts
 * @param {string} opts.deviceId
 * @param {string} opts.sha256
 * @param {string} opts.md5
 * @param {number} opts.size
 * @param {string} opts.mimeType
 * @param {Date} [opts.mtime]
 * @param {Object} [opts.fs] stat metadata, emitted only when non-empty
 * @param {Object} [opts.xattrs] extended attributes, emitted only when non-empty
 * @returns {Object}
 */
export function buildFileDoc(absPath, { deviceId, sha256, md5, size, mimeType, mtime, fs, xattrs }) {
    // file://<deviceId>/<absolute-path-without-leading-slash>
    const fileUrl = `file://${deviceId}/${absPath.replace(/^\//, '')}`;
    return {
        schema: SCHEMA_FILE,
        schemaVersion: FILE_SCHEMA_VERSION,
        checksumArray: [`sha256/${sha256}`, `md5/${md5}`],
        locations: [{ url: fileUrl }],
        metadata: {
            contentType: mimeType,
            size,
            filename: basename(absPath),
            mtime: mtime ? mtime.toISOString() : undefined,
            ...(fs && Object.keys(fs).length ? { fs } : {}),
            ...(xattrs && Object.keys(xattrs).length ? { xattrs } : {})
        },
        data: {}
    };
}

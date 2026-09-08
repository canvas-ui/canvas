'use strict';

import { SCHEMA_DOTFILE, SCHEMA_DOTFILE_FILE, SCHEMA_DOTFILE_FOLDER, DOTFILE_SCHEMA_VERSION } from '../ids.js';
import { buildMetadata } from './_meta.js';

/** The workspace's own dotfile repository — the default when none is named. */
export const WORKSPACE_DOTFILES_REPO = 'workspace:dotfiles';

/**
 * A dotfile identity URI from a repo-relative entry path.
 *   dotfileUrl('shell/bashrc')                  → 'workspace:dotfiles#shell/bashrc'
 *   dotfileUrl('shell/bashrc', {repo: 'git+ssh://git@host/me/dotfiles'})
 *                                               → 'git+ssh://…/dotfiles#shell/bashrc'
 * Full normalization (NFC, scheme casing, traversal rejection) happens
 * server-side in synapsd's `normalizeDotfileUrl`; this only assembles the two
 * halves so callers never hand-concatenate them.
 *
 * @param {string} entryPath
 * @param {Object} [o]
 * @param {string} [o.repo]
 * @returns {string}
 */
export function dotfileUrl(entryPath, { repo = WORKSPACE_DOTFILES_REPO } = {}) {
    const entry = String(entryPath ?? '').trim().replace(/^\/+/, '').replace(/\/+$/, '');
    if (!entry) throw new Error('Dotfile requires an entry path');
    return `${repo}#${entry}`;
}

/**
 * Build a Dotfile document.
 *
 * Mirrors synapsd's `data/schema/dotfile` v3.0: identity is `data.url`
 * (which entry in WHICH repo), and `data.links` maps deviceId → local path, so
 * one repo entry can live at a different path on every device. A bare
 * repo-relative path is accepted for `url` and resolved against the workspace
 * repo — the server accepts both spellings and normalizes.
 *
 * `type` is part of the SCHEMA ID (`…/file`, `…/folder`), not of `data` — the
 * engine rejects the bare `data/schema/dotfile`. Assert the base id as a
 * feature when inserting, which is what makes `dotfile list` find it.
 *
 * Like links, dotfiles declare `data.tags`, so tags are emitted there as well
 * as in metadata features.
 *
 * @param {string} url entry path ('shell/bashrc') or full identity URI
 * @param {Object} [options]
 * @param {'file'|'folder'} [options.type] defaults to 'file'
 * @param {Object<string,string>} [options.links] deviceId → local path
 * @param {string} [options.description]
 * @param {number} [options.priority]
 * @param {string} [options.comment]
 * @param {string|string[]} [options.tags]
 * @param {Object} [options.metadata]
 * @returns {Object}
 */
export function buildDotfileDoc(url, {
    type, links, description, priority, comment, tags, metadata
} = {}) {
    const value = String(url ?? '').trim();
    if (!value) throw new Error('Dotfile requires a url');

    if (type !== undefined && type !== 'file' && type !== 'folder') {
        throw new Error(`Invalid dotfile type: ${type} (expected 'file' or 'folder')`);
    }
    const doc = {
        schema: type === 'folder' ? SCHEMA_DOTFILE_FOLDER : SCHEMA_DOTFILE_FILE,
        schemaVersion: DOTFILE_SCHEMA_VERSION,
        // A value with no scheme and no '#' is a repo-relative entry path.
        data: { url: /^[a-z][a-z0-9+.-]*:/i.test(value) || value.includes('#') ? value : dotfileUrl(value) }
    };
    if (links && Object.keys(links).length) doc.data.links = links;
    if (description) doc.data.description = description;
    if (priority !== undefined) {
        const n = Number(priority);
        if (!Number.isInteger(n)) throw new Error(`Invalid priority: ${priority} (expected an integer)`);
        doc.data.priority = n;
    }
    const tagList = Array.isArray(tags) ? tags : tags ? [tags] : [];
    const clean = [];
    for (const raw of tagList) {
        const t = String(raw ?? '').trim();
        if (t && !clean.includes(t)) clean.push(t);
    }
    if (clean.length) doc.data.tags = clean;
    if (comment) doc.comment = comment;

    const meta = buildMetadata({ tags, metadata });
    if (meta) doc.metadata = meta;
    return doc;
}

/**
 * The feature to assert when inserting a dotfile document, so it is queryable
 * as a dotfile regardless of its leaf type.
 * @type {string}
 */
export const DOTFILE_FEATURE = SCHEMA_DOTFILE;

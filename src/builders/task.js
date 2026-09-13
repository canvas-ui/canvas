'use strict';

import { SCHEMA_TASK, TASK_SCHEMA_VERSION } from '../ids.js';
import { buildMetadata } from './_meta.js';

/**
 * Build a Task ("todo") document.
 *
 * Mirrors synapsd's `data/schema/task` v3.0: status follows VTODO (RFC 5545)
 * — pending | in-progress | completed | cancelled — with the legacy `completed`
 * boolean kept in sync by the engine. This builder deliberately does NOT
 * default the status or stamp `completedAt`: the engine normalizes on parse
 * (Task.#normalizeStatus), and a builder that invented timestamps would make
 * its own output non-deterministic.
 *
 * Tasks have no `data.tags` field, so tags land in metadata features like
 * notes do.
 *
 * @param {string} title
 * @param {Object} [options]
 * @param {string} [options.description]
 * @param {'pending'|'in-progress'|'completed'|'cancelled'} [options.status]
 * @param {boolean} [options.completed] legacy flag; prefer `status`
 * @param {string|Date} [options.completedAt]
 * @param {string|Date} [options.dueDate]
 * @param {number} [options.priority] RFC 5545 scale, 1 (highest) … 9 (lowest)
 * @param {string} [options.comment]
 * @param {string|string[]} [options.tags]
 * @param {Object} [options.geo]
 * @param {Object} [options.metadata]
 * @returns {Object}
 */
export function buildTaskDoc(title, {
    description, status, completed, completedAt, dueDate, priority,
    comment, tags, geo, metadata
} = {}) {
    const doc = {
        schema: SCHEMA_TASK,
        schemaVersion: TASK_SCHEMA_VERSION,
        data: { title }
    };
    if (description) doc.data.description = description;
    if (status) doc.data.status = status;
    if (completed !== undefined) doc.data.completed = completed;
    if (completedAt) doc.data.completedAt = isoOrThrow(completedAt, 'completedAt');
    if (dueDate) doc.data.dueDate = isoOrThrow(dueDate, 'dueDate');
    if (priority !== undefined) doc.data.priority = priorityOrThrow(priority);
    if (comment) doc.comment = comment;

    const meta = buildMetadata({ tags, geo, metadata });
    if (meta) doc.metadata = meta;
    return doc;
}

// Accept a Date or an ISO string, emit ISO. The schema is
// z.string().datetime(), so "tomorrow" or "2026-08-27" would be a server-side
// 400 — cheaper and clearer to say so here.
function isoOrThrow(value, field) {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) throw new Error(`Invalid ${field}: ${value}`);
    return d.toISOString();
}

function priorityOrThrow(value) {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1 || n > 9) {
        throw new Error(`Invalid priority: ${value} (expected an integer 1-9, 1 = highest)`);
    }
    return n;
}

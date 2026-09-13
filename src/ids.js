'use strict';

/** Document schema ids as served by /rest/v2/schemas. */
export const SCHEMA_NOTE = 'data/schema/note';
export const SCHEMA_TAB = 'data/schema/tab';
export const SCHEMA_FILE = 'data/schema/file';
export const SCHEMA_TASK = 'data/schema/task';
export const SCHEMA_LINK = 'data/schema/link';
/**
 * Dotfiles are the one schema whose CONCRETE ids carry a leaf type:
 * synapsd's Dotfile constructor rejects anything that is not
 * `data/schema/dotfile/{file|folder}`. The base id below is still what gets
 * asserted as a feature and queried against (canvas-server's dotfiles route
 * does exactly this split), so both forms are needed.
 */
export const SCHEMA_DOTFILE = 'data/schema/dotfile';
export const SCHEMA_DOTFILE_FILE = 'data/schema/dotfile/file';
export const SCHEMA_DOTFILE_FOLDER = 'data/schema/dotfile/folder';
export const SCHEMA_EMAIL = 'data/schema/message/email';
export const SCHEMA_IDENTITY = 'data/schema/identity';

/**
 * schemaVersion constants for the documents the builders emit. Versions for
 * other schemas are added when a builder (i.e. a consumer) needs them.
 */
export const NOTE_SCHEMA_VERSION = '2.0';
export const TAB_SCHEMA_VERSION = '2.0';
export const FILE_SCHEMA_VERSION = '3.0';
export const TASK_SCHEMA_VERSION = '3.0';
export const LINK_SCHEMA_VERSION = '3.0';
export const DOTFILE_SCHEMA_VERSION = '3.0';

/**
 * Note/tab still say 2.0 because their builders are pinned to the historical
 * cli wire output (see the parity tests). It is inert: synapsd's schema classes
 * overwrite `schemaVersion` with their own on parse, so every stored note is a
 * 3.0 note regardless. Bumping them is a one-line change plus fixture edits,
 * kept out of this commit to keep the parity contract honest.
 */

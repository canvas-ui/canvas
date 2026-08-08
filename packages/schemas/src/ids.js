'use strict';

/** Document schema ids as served by /rest/v2/schemas. */
export const SCHEMA_NOTE = 'data/schema/note';
export const SCHEMA_TAB = 'data/schema/tab';
export const SCHEMA_FILE = 'data/schema/file';
export const SCHEMA_TASK = 'data/schema/task';
export const SCHEMA_LINK = 'data/schema/link';
export const SCHEMA_DOTFILE = 'data/schema/dotfile';
export const SCHEMA_EMAIL = 'data/schema/message/email';

/**
 * schemaVersion constants for the documents the builders emit. Versions for
 * other schemas are added when a builder (i.e. a consumer) needs them.
 */
export const NOTE_SCHEMA_VERSION = '2.0';
export const TAB_SCHEMA_VERSION = '2.0';
export const FILE_SCHEMA_VERSION = '3.0';

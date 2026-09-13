export declare const SCHEMA_NOTE: 'data/schema/note';
export declare const SCHEMA_TAB: 'data/schema/tab';
export declare const SCHEMA_FILE: 'data/schema/file';
export declare const SCHEMA_TASK: 'data/schema/task';
export declare const SCHEMA_LINK: 'data/schema/link';
export declare const SCHEMA_DOTFILE: 'data/schema/dotfile';
export declare const SCHEMA_DOTFILE_FILE: 'data/schema/dotfile/file';
export declare const SCHEMA_DOTFILE_FOLDER: 'data/schema/dotfile/folder';
export declare const SCHEMA_EMAIL: 'data/schema/message/email';
export declare const SCHEMA_IDENTITY: 'data/schema/identity';

export declare const NOTE_SCHEMA_VERSION: '2.0';
export declare const TAB_SCHEMA_VERSION: '2.0';
export declare const FILE_SCHEMA_VERSION: '3.0';
export declare const TASK_SCHEMA_VERSION: '3.0';
export declare const LINK_SCHEMA_VERSION: '3.0';
export declare const DOTFILE_SCHEMA_VERSION: '3.0';

export declare function tagsToFeatures(tags: string | string[] | null | undefined): string[];
export declare function featuresToTags(features: string[] | null | undefined): string[];
export declare function clientAppFeature(name: string): string;

export interface NoteDocOptions {
    title?: string;
    comment?: string;
    tags?: string | string[];
    geo?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}
export declare function buildNoteDoc(content: string, options?: NoteDocOptions): Record<string, unknown>;

export interface TabDocOptions {
    title?: string;
    favIconUrl?: string;
    pinned?: boolean;
    timestamp?: string;
    metadata?: Record<string, unknown>;
}
export declare function buildTabDoc(url: string, options?: TabDocOptions): Record<string, unknown>;

export interface FileDocOptions {
    deviceId: string;
    sha256: string;
    md5: string;
    size: number;
    mimeType: string;
    mtime?: Date;
    fs?: Record<string, unknown>;
    xattrs?: Record<string, string>;
}
export declare function buildFileDoc(absPath: string, opts: FileDocOptions): Record<string, unknown>;

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export interface TaskDocOptions {
    description?: string;
    status?: TaskStatus;
    /** Legacy flag kept in sync with `status` by the engine; prefer `status`. */
    completed?: boolean;
    completedAt?: string | Date;
    dueDate?: string | Date;
    /** RFC 5545 scale: 1 (highest) … 9 (lowest). */
    priority?: number;
    comment?: string;
    tags?: string | string[];
    geo?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}
export declare function buildTaskDoc(title: string, options?: TaskDocOptions): Record<string, unknown>;

export interface LinkDocOptions {
    label?: string;
    description?: string;
    type?: string;
    category?: string;
    properties?: Record<string, unknown>;
    lastAccessedAt?: string | Date;
    comment?: string;
    tags?: string | string[];
    geo?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}
export declare function buildLinkDoc(uri: string, options?: LinkDocOptions): Record<string, unknown>;

export declare const WORKSPACE_DOTFILES_REPO: 'workspace:dotfiles';
/** Feature to assert on insert so both dotfile leaf types stay queryable. */
export declare const DOTFILE_FEATURE: 'data/schema/dotfile';
export declare function dotfileUrl(entryPath: string, options?: { repo?: string }): string;
export interface DotfileDocOptions {
    /** Becomes the schema leaf (`data/schema/dotfile/file`); defaults to 'file'. */
    type?: 'file' | 'folder';
    /** deviceId → local path (may contain `$HOME`). */
    links?: Record<string, string>;
    description?: string;
    priority?: number;
    comment?: string;
    tags?: string | string[];
    metadata?: Record<string, unknown>;
}
export declare function buildDotfileDoc(url: string, options?: DotfileDocOptions): Record<string, unknown>;

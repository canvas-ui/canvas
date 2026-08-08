export declare const SCHEMA_NOTE: 'data/schema/note';
export declare const SCHEMA_TAB: 'data/schema/tab';
export declare const SCHEMA_FILE: 'data/schema/file';
export declare const SCHEMA_TASK: 'data/schema/task';
export declare const SCHEMA_LINK: 'data/schema/link';
export declare const SCHEMA_DOTFILE: 'data/schema/dotfile';
export declare const SCHEMA_EMAIL: 'data/schema/message/email';

export declare const NOTE_SCHEMA_VERSION: '2.0';
export declare const TAB_SCHEMA_VERSION: '2.0';
export declare const FILE_SCHEMA_VERSION: '3.0';

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

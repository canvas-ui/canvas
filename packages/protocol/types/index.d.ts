/** Canvas wire contract types. Enforcement peer: canvas-server/src/transports/ResponseObject.js */

export interface ResponseEnvelope<T = unknown> {
    status: 'success' | 'error';
    statusCode: number;
    message: string | null;
    payload: T;
    count: number | null;
    totalCount: number | null;
    debug?: unknown;
    lines?: Record<string, number>;
    code?: string;
}

export declare const STATUS_SUCCESS: 'success';
export declare const STATUS_ERROR: 'error';
export declare function isEnvelope(x: unknown): x is ResponseEnvelope;

export declare const WORKSPACE_NOT_ACTIVE: 'WORKSPACE_NOT_ACTIVE';
export declare const WORKSPACE_NOT_ACTIVE_MESSAGE: string;
export declare function isWorkspaceNotActive(x: { code?: string; message?: string } | null | undefined): boolean;

export declare const API_BASE: '/rest/v2';
export declare const DEFAULT_TIMEOUT_MS: number;
export declare const HEADER_APP_NAME: 'X-App-Name';
export declare const API_TOKEN_PREFIX: 'canvas-';
export declare function bearerHeader(token: string): { Authorization: string };

export declare function decodeJwtPayload(token: string | null | undefined): Record<string, unknown> | null;
export declare function getJwtExpiryMs(token: string | null | undefined): number | null;

export declare namespace routes {
    const auth: {
        login(): string;
        logout(): string;
        me(): string;
        status(): string;
        tokens(): string;
        token(id: string): string;
        tokenRefresh(): string;
        devices(): string;
        device(id: string): string;
        deviceRegister(): string;
    };
    const workspaces: {
        collection(): string;
        byId(id: string): string;
        start(id: string): string;
        stop(id: string): string;
        status(id: string): string;
        stats(id: string): string;
        tree(id: string): string;
        trees(id: string): string;
        treePath(id: string, treeName: string, path: string): string;
        documents(id: string): string;
        documentsRemove(id: string): string;
        treeByName(id: string, treeNameOrId: string): string;
        blobs(id: string): string;
        dotfiles(id: string): string;
        dotfilesStatus(id: string): string;
        dotfilesInit(id: string): string;
        backends(id: string, driver?: string | null): string;
        backend(id: string, driver: string, address: string): string;
        backendSync(id: string, driver: string, address: string): string;
        backendUsage(id: string, driver: string, address: string): string;
        backendDocuments(id: string, driver: string, address: string): string;
        hooks(id: string): string;
        hook(id: string, hookPath: string): string;
        hookRuns(id: string): string;
        hookReplay(id: string, runId: string): string;
        hooksExplain(id: string): string;
        hooksBackfill(id: string): string;
    };
    const contexts: {
        collection(): string;
        byId(id: string): string;
        tree(id: string): string;
        treePaths(id: string): string;
        documents(id: string): string;
        document(id: string, docId: string | number): string;
        documentsRemove(id: string): string;
        blobs(id: string): string;
        dotfiles(id: string): string;
        url(id: string): string;
    };
    const agents: {
        collection(): string;
        byId(id: string): string;
        status(id: string): string;
        prompt(id: string): string;
    };
    const roles: {
        collection(): string;
        byId(id: string): string;
    };
    const schemas: {
        collection(): string;
        descriptor(id: string): string;
        json(id: string): string;
    };
    function ping(): string;
}

export declare namespace events {
    const EMIT_SUBSCRIBE: 'subscribe';
    const EMIT_UNSUBSCRIBE: 'unsubscribe';
    const EMIT_AGENT_SUBSCRIBE: 'agent:subscribe';
    const EMIT_AGENT_UNSUBSCRIBE: 'agent:unsubscribe';
    const EMIT_AGENT_CHAT_STREAM: 'agent:chat:stream';
    function workspaceChannel(workspaceId: string): string;
    function contextChannel(contextId: string): string;
    const WORKSPACE_STATUS_CHANGED: string;
    const WORKSPACE_CREATED: string;
    const WORKSPACE_UPDATED: string;
    const WORKSPACE_DELETED: string;
    const WORKSPACE_DOCUMENTS_INSERTED: string;
    const WORKSPACE_DOCUMENTS_UPDATED: string;
    const WORKSPACE_DOCUMENTS_REMOVED: string;
    const WORKSPACE_DOCUMENTS_DELETED: string;
    const WORKSPACE_DOCUMENTS_PURGED: string;
    const WORKSPACE_TREE_PATH_INSERTED: string;
    const WORKSPACE_TREE_PATH_REMOVED: string;
    const WORKSPACE_TREE_PATH_MOVED: string;
    const WORKSPACE_TREE_PATH_COPIED: string;
    const CONTEXT_URL_SET: string;
    const CONTEXT_UPDATED: string;
    const CONTEXT_LOCKED: string;
    const CONTEXT_UNLOCKED: string;
    const CONTEXT_ACL_UPDATED: string;
    const CONTEXT_ACL_REVOKED: string;
    const CONTEXT_DOCUMENT_INSERTED: string;
    const CONTEXT_DOCUMENT_REMOVED: string;
    const CONTEXT_DOCUMENT_REMOVED_BATCH: string;
    const CONTEXT_DOCUMENT_DELETED_BATCH: string;
    const CONTEXT_TREE_PATH_INSERTED: string;
    const CONTEXT_TREE_PATH_REMOVED: string;
    const CONTEXT_TREE_PATH_MOVED: string;
    const CONTEXT_TREE_PATH_COPIED: string;
    const AGENT_SUBSCRIBED: string;
    const AGENT_UNSUBSCRIBED: string;
    const AGENT_CHAT_START: string;
    const AGENT_CHAT_CHUNK: string;
    const AGENT_CHAT_COMPLETE: string;
    const AGENT_CHAT_ERROR: string;
    const AGENT_STATUS_CHANGED: string;
    const AGENT_CREATED: string;
    const AGENT_UPDATED: string;
    const AGENT_DELETED: string;
    const CHUNK_TYPE_TEXT: 'chunk';
    const CHUNK_TYPE_THINKING: 'thinking';
    const CHUNK_TYPE_TOOL_START: 'tool_start';
    const CHUNK_TYPE_TOOL_END: 'tool_end';
    const EMIT_SESSION_OPEN: 'session.open';
    const EMIT_SESSION_SET: 'session.set';
    const EMIT_SESSION_PATCH: 'session.patch';
    const EMIT_SESSION_REMOVE: 'session.remove';
    const EMIT_SESSION_IDS: 'session.ids';
    const EMIT_SESSION_MATERIALIZE: 'session.materialize';
    const EMIT_SESSION_CLOSE: 'session.close';
    const SESSION_DELTA: 'session.delta';
}

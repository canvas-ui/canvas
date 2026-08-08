'use strict';

/**
 * Socket.IO event names, verbatim from the server (reference:
 * canvas-server/docs/API.md, WebSocket API). Names only — this package does
 * not depend on socket.io. Connection convention used by the existing
 * clients: io(serverUrl, { auth: { token }, transports: ['websocket'] }).
 */

// Client → server
export const EMIT_SUBSCRIBE = 'subscribe';
export const EMIT_UNSUBSCRIBE = 'unsubscribe';
export const EMIT_AGENT_SUBSCRIBE = 'agent:subscribe';
export const EMIT_AGENT_UNSUBSCRIBE = 'agent:unsubscribe';
export const EMIT_AGENT_CHAT_STREAM = 'agent:chat:stream';

/** Channel name for workspace-scoped events. */
export const workspaceChannel = (workspaceId) => `workspace:${workspaceId}`;
/** Channel name for context-scoped events. */
export const contextChannel = (contextId) => `context:${contextId}`;

// Workspace events
export const WORKSPACE_STATUS_CHANGED = 'workspace.status.changed';
export const WORKSPACE_CREATED = 'workspace.created';
export const WORKSPACE_UPDATED = 'workspace.updated';
export const WORKSPACE_DELETED = 'workspace.deleted';
export const WORKSPACE_DOCUMENTS_INSERTED = 'workspace.documents.inserted';
export const WORKSPACE_DOCUMENTS_UPDATED = 'workspace.documents.updated';
export const WORKSPACE_DOCUMENTS_REMOVED = 'workspace.documents.removed';
export const WORKSPACE_DOCUMENTS_DELETED = 'workspace.documents.deleted';
export const WORKSPACE_DOCUMENTS_PURGED = 'workspace.documents.purged';
export const WORKSPACE_TREE_PATH_INSERTED = 'workspace.tree.path.inserted';
export const WORKSPACE_TREE_PATH_REMOVED = 'workspace.tree.path.removed';
export const WORKSPACE_TREE_PATH_MOVED = 'workspace.tree.path.moved';
export const WORKSPACE_TREE_PATH_COPIED = 'workspace.tree.path.copied';

// Context events
export const CONTEXT_URL_SET = 'context.url.set';
export const CONTEXT_UPDATED = 'context.updated';
export const CONTEXT_LOCKED = 'context.locked';
export const CONTEXT_UNLOCKED = 'context.unlocked';
export const CONTEXT_ACL_UPDATED = 'context.acl.updated';
export const CONTEXT_ACL_REVOKED = 'context.acl.revoked';
export const CONTEXT_DOCUMENT_INSERTED = 'document.inserted';
export const CONTEXT_DOCUMENT_REMOVED = 'document.removed';
export const CONTEXT_DOCUMENT_REMOVED_BATCH = 'document.removed.batch';
export const CONTEXT_DOCUMENT_DELETED_BATCH = 'document.deleted.batch';
export const CONTEXT_TREE_PATH_INSERTED = 'context.tree.path.inserted';
export const CONTEXT_TREE_PATH_REMOVED = 'context.tree.path.removed';
export const CONTEXT_TREE_PATH_MOVED = 'context.tree.path.moved';
export const CONTEXT_TREE_PATH_COPIED = 'context.tree.path.copied';

// Agent events
export const AGENT_SUBSCRIBED = 'agent:subscribed';
export const AGENT_UNSUBSCRIBED = 'agent:unsubscribed';
export const AGENT_CHAT_START = 'agent:chat:start';
export const AGENT_CHAT_CHUNK = 'agent:chat:chunk';
export const AGENT_CHAT_COMPLETE = 'agent:chat:complete';
export const AGENT_CHAT_ERROR = 'agent:chat:error';
export const AGENT_STATUS_CHANGED = 'agent.status.changed';
export const AGENT_CREATED = 'agent.created';
export const AGENT_UPDATED = 'agent.updated';
export const AGENT_DELETED = 'agent.deleted';

/** agent:chat:chunk `type` values. */
export const CHUNK_TYPE_TEXT = 'chunk';
export const CHUNK_TYPE_THINKING = 'thinking';
export const CHUNK_TYPE_TOOL_START = 'tool_start';
export const CHUNK_TYPE_TOOL_END = 'tool_end';

'use strict';

/**
 * Route builders for the surfaces shipped consumers call. Paths are relative
 * to API_BASE ('/rest/v2').
 *
 * Encoding parity: encode exactly what the existing clients encode (driver,
 * address, tree names); hierarchical paths (hook paths, tree paths, schema
 * ids) pass through raw because the server routes them via splats. Plain ids
 * are interpolated as-is (ULIDs/slugs, never contain reserved characters).
 */

/** Object keys are relative paths: encode each segment, keep the slashes. */
function objectKeySegment(key) {
    return String(key || '').replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
}

/** Normalize a tree path to a single leading slash, kept raw otherwise. */
function treePathSegment(path) {
    const p = String(path || '/');
    return p.startsWith('/') ? p : `/${p}`;
}

export const auth = {
    login: () => '/auth/login',
    logout: () => '/auth/logout',
    me: () => '/auth/me',
    status: () => '/auth/status',
    tokens: () => '/auth/tokens',
    token: (id) => `/auth/tokens/${id}`,
    tokenRefresh: () => '/auth/token/refresh',
    devices: () => '/auth/devices',
    device: (id) => `/auth/devices/${id}`,
    deviceRegister: () => '/auth/devices/register'
};

export const workspaces = {
    collection: () => '/workspaces',
    byId: (id) => `/workspaces/${id}`,
    start: (id) => `/workspaces/${id}/start`,
    stop: (id) => `/workspaces/${id}/stop`,
    status: (id) => `/workspaces/${id}/status`,
    stats: (id) => `/workspaces/${id}/stats`,
    tree: (id) => `/workspaces/${id}/tree`,
    trees: (id) => `/workspaces/${id}/trees`,
    treePath: (id, treeName, path) => `/workspaces/${id}/trees/${encodeURIComponent(treeName)}/path${treePathSegment(path)}`,
    documents: (id) => `/workspaces/${id}/documents`,
    /** Soft-remove (documents stay in the DB, drop from the context). */
    documentsRemove: (id) => `/workspaces/${id}/documents/remove`,
    /** GET one tree by name/id. Ids interpolate raw — pre-encode if needed. */
    treeByName: (id, treeNameOrId) => `/workspaces/${id}/trees/${treeNameOrId}`,
    blobs: (id) => `/workspaces/${id}/blobs`,
    dotfiles: (id) => `/workspaces/${id}/dotfiles`,
    dotfilesStatus: (id) => `/workspaces/${id}/dotfiles/status`,
    dotfilesInit: (id) => `/workspaces/${id}/dotfiles/init`,
    backends: (id, driver = null) => `/workspaces/${id}/backends${driver ? `/${encodeURIComponent(driver)}` : ''}`,
    backend: (id, driver, address) => `/workspaces/${id}/backends/${encodeURIComponent(driver)}/${encodeURIComponent(address)}`,
    backendSync: (id, driver, address) => `${workspaces.backend(id, driver, address)}/sync`,
    backendUsage: (id, driver, address) => `${workspaces.backend(id, driver, address)}/usage`,
    backendDocuments: (id, driver, address) => `${workspaces.backend(id, driver, address)}/documents`,
    // Keyed objects + change feed on a path-addressed storage backend — the
    // device-mirror protocol (canvas-server docs/sync-protocol.md).
    backendObjects: (id, driver, address) => `${workspaces.backend(id, driver, address)}/objects`,
    backendObject: (id, driver, address, key) => `${workspaces.backend(id, driver, address)}/objects/${objectKeySegment(key)}`,
    backendObjectRename: (id, driver, address) => `${workspaces.backend(id, driver, address)}/objects/rename`,
    backendChanges: (id, driver, address) => `${workspaces.backend(id, driver, address)}/changes`,
    mirrors: (id) => `/workspaces/${id}/mirrors`,
    mirror: (id, deviceId) => `/workspaces/${id}/mirrors/${encodeURIComponent(deviceId)}`,
    mirrorStatus: (id, deviceId) => `${workspaces.mirror(id, deviceId)}/status`,
    syncConflicts: (id) => `/workspaces/${id}/sync/conflicts`,
    syncConflictResolve: (id, docId) => `/workspaces/${id}/sync/conflicts/${docId}/resolve`,
    hooks: (id) => `/workspaces/${id}/hooks`,
    hook: (id, hookPath) => `/workspaces/${id}/hooks/${hookPath}`,
    hookRuns: (id) => `/workspaces/${id}/hooks/runs`,
    hookReplay: (id, runId) => `/workspaces/${id}/hooks/runs/${runId}/replay`,
    hooksExplain: (id) => `/workspaces/${id}/hooks/explain`,
    hooksBackfill: (id) => `/workspaces/${id}/hooks/backfill`
};

export const contexts = {
    collection: () => '/contexts',
    byId: (id) => `/contexts/${id}`,
    tree: (id) => `/contexts/${id}/tree`,
    treePaths: (id) => `/contexts/${id}/tree/paths`,
    documents: (id) => `/contexts/${id}/documents`,
    document: (id, docId) => `/contexts/${id}/documents/${docId}`,
    /** Soft-remove (documents stay in the DB, drop from the context). */
    documentsRemove: (id) => `/contexts/${id}/documents/remove`,
    blobs: (id) => `/contexts/${id}/blobs`,
    dotfiles: (id) => `/contexts/${id}/dotfiles`,
    url: (id) => `/contexts/${id}/url`
};

export const agents = {
    collection: () => '/agents',
    byId: (id) => `/agents/${id}`,
    status: (id) => `/agents/${id}/status`,
    prompt: (id) => `/agents/${id}/prompt`
};

export const roles = {
    collection: () => '/roles',
    byId: (id) => `/roles/${id}`
};

export const schemas = {
    collection: () => '/schemas',
    /** @param {string} id hierarchical schema id, e.g. 'data/schema/note' — raw */
    descriptor: (id) => `/schemas/${id}`,
    /** Derived JSON Schema variant of the same id. */
    json: (id) => `/schemas/${id}.json`
};

export const ping = () => '/ping';

'use strict';

import { routes } from '@canvas-os/protocol';

/** @param {import('../client.js').CanvasApiClient} c */
export function makeRolesApi(c) {
    return {
        list: () => c.get(routes.roles.collection()),
        get: (id) => c.get(routes.roles.byId(id))
    };
}

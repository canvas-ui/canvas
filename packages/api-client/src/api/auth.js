'use strict';

import { routes } from '@canvas/protocol';

/** @param {import('../client.js').CanvasApiClient} c */
export function makeAuthApi(c) {
    return {
        login: (creds) => c.post(routes.auth.login(), { strategy: 'auto', ...creds }),
        logout: () => c.post(routes.auth.logout()),
        me: () => c.get(routes.auth.me()),
        status: () => c.get(routes.auth.status()),
        tokens: {
            list: () => c.get(routes.auth.tokens()),
            create: (data) => c.post(routes.auth.tokens(), data),
            delete: (id) => c.delete(routes.auth.token(id)),
            update: (id, data) => c.put(routes.auth.token(id), data)
        },
        devices: {
            register: (data) => c.post(routes.auth.deviceRegister(), data),
            list: () => c.get(routes.auth.devices()),
            update: (id, data) => c.patch(routes.auth.device(id), data)
        }
    };
}

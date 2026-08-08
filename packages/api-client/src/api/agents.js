'use strict';

import { routes } from '@canvas-os/protocol';

/** @param {import('../client.js').CanvasApiClient} c */
export function makeAgentsApi(c) {
    return {
        list: () => c.get(routes.agents.collection()),
        get: (id) => c.get(routes.agents.byId(id)),
        status: (id) => c.get(routes.agents.status(id)),
        prompt: (id, data) => c.post(routes.agents.prompt(id), data)
    };
}

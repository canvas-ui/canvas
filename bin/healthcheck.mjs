#!/usr/bin/env node
// Container health: the control socket answers /status. Exit 0 when it does.
import http from 'node:http';
import { EDGE_PATHS } from '../src/env.js';

const opts = EDGE_PATHS.socket ? { socketPath: EDGE_PATHS.socket, path: '/status' } : { host: '127.0.0.1', port: EDGE_PATHS.port, path: '/status' };
const req = http.get(opts, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });
req.on('error', () => process.exit(1));
req.setTimeout(5000, () => { req.destroy(); process.exit(1); });

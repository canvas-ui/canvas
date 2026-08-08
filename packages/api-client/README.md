# @canvas-os/api-client

Fetch-based Canvas REST client built on `@canvas-os/protocol`. Consolidates the
REST access every client was reimplementing; scope grows client-by-client
(the cli's surface came first).

```js
import { CanvasApiClient } from '@canvas-os/api-client';

const api = new CanvasApiClient({
    baseUrl: 'https://canvas.example.com:8001',
    getToken: () => tokenStore.current(), // called per request
    userAgent: 'canvas-cli'
});

const workspaces = await api.workspaces.list(); // unwrapped payload
```

## Behavior notes

- **Envelope handling is centralized**: success envelopes resolve to their
  `payload`; error envelopes throw `CanvasError` with the machine `code`
  string (e.g. `WORKSPACE_NOT_ACTIVE`) and numeric `statusCode` — regardless
  of the HTTP status they rode in on.
- **Policy stays with the caller.** No auto-redirect on 401, no workspace
  autostart; the client surfaces typed errors and callers decide
  (`isWorkspaceNotActive` from `@canvas-os/protocol`, `isNetworkError` from
  here).
- **`isNetworkError`** matches both undici/node codes (`ECONNREFUSED`, …) and
  Bun's fetch codes (`ConnectionRefused`, …) — the same code runs under node
  and inside bun-compiled binaries.
- **Bodies**: plain objects/arrays are JSON-encoded (Content-Type set for you);
  `Buffer`/`Blob`/`Uint8Array`/strings pass through; web `ReadableStream` and
  Node `Readable` upload as streams (`duplex: 'half'`). No body-size caps.
- **Timeouts** use `AbortSignal.timeout` (default 30 s, same as the historical
  clients); per-request `timeout: 0` disables.
- Query serialization is axios-parity: `null`/`undefined` skipped, arrays as
  repeated keys, booleans stringified (`recursive=false` reaches the wire).

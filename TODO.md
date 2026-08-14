# TODO

## Target topology (monorepo + server + services)

```
canvas                  AGPL-only     monorepo (public — decided Slice 1)
  apps/
    web                               ← canvas-web
    cli                               ← canvas-cli (bun for build/compile)
    desktop                           ← canvas-desktop (tauri)
    browser-extension                 ← canvas-browser-extensions
    shell                             ← canvas-shell
  packages/
    protocol                          ← wire contracts + transport adapters, new
    api-client                        ← ergonomic client over protocol, new
    schemas                           ← extracted, new
    plugin-api                        ← integration/adapter interfaces, new
    messaging                         ← src/services/messaging
    voice                             ← src/services/voice

canvas-stored           AGPL+comm     standalone, ad-hoc reuse
canvas-fuse             AGPL-only     standalone (Rust — no npm workspace fit)
canvas-synapsd          AGPL+comm     standalone, ad-hoc reuse
canvas-server           AGPL+comm     src/{core,transports,utils} · agentd · edge
```

Only open cross-repository work belongs here. Implemented behavior belongs in
the owning package's README.

## Inferd

Current embedding behavior and service boundaries are documented in
`../canvas-inferd/README.md`.

### General inference

- [ ] Replace the embedding-only provider contract with explicit capabilities:
      `embed`, `describe`, `transcribe`, and experimental `extract`.
- [ ] Route one input to a capability chain. An image may produce an image
      vector, description, text vector, and anchor observations in one pass.
- [ ] Define a streaming API with bounded input queues, cancellation, cadence,
      backpressure, and typed incremental outputs.

### Generated content

- [ ] Write generated text to `metadata.summary` with
      `{ model, generatedAt, sourceChecksum }` provenance.
- [ ] Key derivation work by source checksum. `updatedAt` would create a
      caption-write-recaption loop.
- [ ] Add audio transcription and decide whether existing voice STT becomes an
      inferd provider or remains a Canvas Server adapter.
- [ ] Implement the `text` summarize modality. Config already validates it
      (`config.js` SUMMARIZE_MODALITIES) but only `describeImage` exists, so
      long-body documents (mail, GitHub issues) get vectors and no summary.
### Live feeds

- [ ] Move the current browser frame loop behind a server-side stream consumer
      without changing the QuerySession delta contract.
- [ ] Settle whether feed orchestration is part of inferd or a small sensord
      service. Model execution and projection stay in inferd either way.
- [ ] Generalize feeds beyond camera input: audio, journal output, mail, chat,
      and agent-produced observations.
- [ ] Implement smoothing, scene/change detection, and time decay in the stream
      producer. SynapsD receives replacement ID or anchor cues and stays
      clock-free.
- [ ] Decide whether batching frames improves measured throughput before adding
      another endpoint.

### Semantic anchors

Anchor research items (baseline, codebook training, anchor-vs-kNN evaluation,
Gemma per-layer experiments) moved to `../canvas-inferd/TODO.md`; the S2/Hilbert
storage-encoding caveat moved to `../canvas-synapsd/TODO.md`. Cross-repo parts
stay here:

- [ ] Design excitatory and inhibitory cue fusion. Exact veto already exists as
      bitmap exclusion; soft suppression needs normalized rank-space semantics.

### Inferd versus agentd

- [ ] Keep model execution, reusable derivation, projection, and stream decay in
      inferd.
- [ ] Keep goals, thread spawning, parent/child context, inhibition policy, and
      retrieval-session ownership in agentd.
- [ ] Define the smallest data contract between them: observations, anchors,
      summaries, provenance, and confidence. Do not expose runtime tensors
      unless an experiment proves they are needed.

## GitHub issues connector

Same shape as IMAP mail: poll, persist the body locally, let the off-thread
embed/summarize workers pick documents up from `document.inserted`. No
real-time inference during ingestion. Reference implementation to mirror is
`canvas-server/src/core/workspace/services/imap/`.

- [ ] Register `data/schema/task/github/issue` in SynapsD as a task subtype, so
      issues fall out of existing `data/schema/task` queries and the todo lens
      without a second code path. `vectorEmbeddingFields: title + body`.
- [ ] Use identity-only `checksumFields` (repository + number, or the API URL),
      NOT a raw-payload hash. Issues mutate; hashing content would fork a new
      document on every state change or comment instead of taking the
      `existing.update()` dedup path.
- [ ] Add `services/github/`: per-repo polling backend (REST `since` + ETag or
      GraphQL), config in `config/stored.json` under `driver: 'github'`, raw
      issue JSON through the existing `persistBlob` seam.
- [ ] File issues under a backends-tree `/github/<owner>/<repo>/issues` subtree
      with `context: null`, provenance location `github://owner/repo/issues/N`.
- [ ] Store comments as an array in `data` plus the raw blob. Do not build an
      email-style `inReplyTo` graph — GitHub already flattens the thread and
      inferd chunking handles long bodies.
- [ ] Wire the `github` driver through the `Workspace.js` backend facade (~15
      `driver === 'imap'` switch sites), the services status route, and
      `WorkspaceStoredIndex` location describe/destroy.
- [ ] Web: issue renderer (the renderer registry is exact-match on schema),
      `schema-meta.ts` entry, and a config panel modelled on
      `imap-mailboxes-panel.tsx`.
- [ ] Decide whether issue state (open/closed) maps onto task
      `status: pending/completed` or stays a separate field. Mapping it makes
      the todo checkbox write back to GitHub, which needs a write path first.

## Integration leftovers

- [ ] Extend session-driven lists to layer and unfiled views where useful.
- [ ] Add reconnect/resume only together with a bounded grace TTL.
- [ ] Decide live-session sorting and pagination UX. Stable insertion order is
      currently deliberate.

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

## GitHub issues connector — residue

SHIPPED 2026-08 as a driver in the generic connectors service
(`canvas-server/src/core/workspace/services/connectors/`, docs in
`canvas-server/docs/connectors.md`) — not the imap-style standalone service
this section originally sketched. Landed: identity-only checksums
(sha256 of the `gh://owner/repo/issues/N` provenance URL), backends-tree
`/github/…` mirror, Workspace backend-facade wiring, web config panel
(ConnectorsSection incl. edit + deletion-sync tickbox), `schema-meta.ts`
entry + todo renderer, and bidirectional state mapping
(open/closed ↔ pending/completed/cancelled, write-back behind
`readOnly: false` + PAT). Still open:

- [ ] Register `data/schema/task/github/issue` in SynapsD as a task subtype
      (issues currently ingest as plain `data/schema/task`); hierarchical
      schema matching in hooks/rules (2026-08-17) already anticipates
      sub-schema ids. `vectorEmbeddingFields: title + body`.
- [ ] Store issue comments as an array in `data` (driver only carries
      `commentCount` today). No email-style `inReplyTo` graph — GitHub
      already flattens the thread and inferd chunking handles long bodies.

## Connector deletion-sync — remaining drivers

Source→Canvas deletion-sync shipped 2026-08-17 (server 2.5.36) for github:
opt-in `pruneRemoved: true` per backend; after a clean container sync the
service compares a FULL source traversal (`driver.listIdentities(container)`
→ every current provenance URL) against the mirror and hands source-deleted
docs to `WorkspaceStoredIndex.reconcileRemovedLocations` (orphan-not-delete:
locations dropped, mirror paths unticked, `data/no-location` + `orphanedAt`,
purged later by retention GC). The service side is fully generic — each
remaining driver only needs `listIdentities` (throw on ANY API error: a
partial listing must never masquerade as complete). Contract + guard rails:
`canvas-server/docs/connectors.md` "Deletion / destroy".

- [ ] caldav `listIdentities`: identity is `caldav://<address>/<calendar>/<uid>`
      with the UID inside the ICS — needs a no-time-range calendar-query
      REPORT retrieving UIDs (partial retrieval `<c:calendar-data>` with only
      the UID prop where supported; fall back to full calendar-data).
      Server-compat nuance (GroupOffice/Nextcloud/Radicale/SOGo) — test
      against a real server. Recurring events: one UID per series.
- [ ] gcal: consider `showDeleted=true` on the events list instead of a full
      traversal — the sync-token delta already carries `status: 'cancelled'`
      tombstones, which could prune inline during `fetchChanges` (cheaper and
      race-free); `listIdentities` then only backfills pre-existing deletes.
- [ ] slack: full-history traversal is rate-limit-expensive
      (`conversations.history` full walk per channel); check whether message
      tombstones (`subtype: message_deleted` in deltas) are visible to bot
      tokens before committing to the listing approach.
- [ ] teams: Graph delta queries carry `@removed` tombstones — same inline
      option as gcal; full listing via `/messages` pagination otherwise.

## IMAP inbound deletion-sync

Outbound EXPUNGE exists (Canvas → server delete). Inbound — user deletes mail
in their mail client, Canvas mirrors it — does not; the poll loop only
fetches new UIDs above `lastUid`. Wanted (2026-08-17): opt-in per account,
same UI shape as connectors' "Remove items deleted at the source" tickbox.

- [ ] Reconcile per folder: `UID SEARCH ALL` (or ESEARCH) against the
      folder's indexed UIDs; missing UIDs → drop that `imap://` location via
      `WorkspaceStoredIndex.reconcileRemovedLocations` (never hard-delete —
      same orphan semantics as the connector prune). Only after a SUCCESSFUL
      full search on an authenticated session; skip on any error.
- [ ] Careful with UIDVALIDITY changes: a changed validity invalidates every
      stored UID for the folder — treat as "cannot traverse", never as
      "everything was deleted".
- [ ] UI: per-account tickbox in `imap-mailboxes-panel.tsx` (accounts are in
      `apps/web` ≥ 2.7.16; panel already collapses per account).
- [ ] Reference: connector prune implementation in
      `canvas-server/src/core/workspace/services/connectors/index.js`
      (`#pruneContainer` — guard rails to mirror).

## Integration leftovers

- [ ] Extend session-driven lists to layer and unfiled views where useful.
- [ ] Add reconnect/resume only together with a bounded grace TTL.
- [ ] Decide live-session sorting and pagination UX. Stable insertion order is
      currently deliberate.

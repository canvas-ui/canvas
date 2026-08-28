# TODO

## Next UI

### Main objectives!

Dates back to my early `iolinux` linux distribution endeavors with a ro-root and movable containerized user-runtimes dynamically installing your sw on-demand when needed(aot).

- Contextualize your work! Working on a specific task? De-clutter your UI and only see data(notes, files, messages, browser tabs etc) related to the task
- Share and collaborate on top of your Data, Context, Canvases aaand whole Workspaces with others
- Cross device, every screen or even simple single-purpose compatibile HW should extend the UI
  - Filter with swipe gestures on your phone running the toolbox UI and send results of your data analysis to your TV side-by-side with your favorite podcast
- Simple navigation (up/down/left/right + rotation + click + doble-click + optional gestures depending on HW - your smart ring should be able to control the UI seamlessly)
- Every task starts with a single clean canvas and one globally available button next to it triggering voice mode by default
- Objective/outcome focused UI, no OS crap bleading-in, pure content contextualized to whatever task you are working on
- No controll clutter, no multilevel Menu > Amend image > Graphical crap > Some other crap sub-category > Layer tool that you need so spend years learning, a single toolbox with a contextualized set of tools and a global always available section - both as fallback to voice
- Roaming profiles are the default - login to your workstation then your laptop then any other device, authenticate and continue where you leff - start your work in voice-mode while driving, finish on your workstation+monitor setup, review on tablet while sipping coffee
- Fine grained storage policies, backup your accounting data to S3 and local NAS, your photos to google drive and glacier, your podcasts to locally or to your local NAS
- Intelligent data categorization - define a tree structure and tell your agents to sort specific data automatically when you dump them - have 1000 browser tabs you finally want to get stored? Sync them to /to-sort, run a hook to sort them into existing tree categories and optionally write summaries of each one(or download a local copy)

- Canvases are organized into virtual threads centered around a given task(in context mode)
- Switching between tasks has to be as moving from a well-maintained desk with a task-tuned toolbox and a bunch of canvases on to another well-maintained desks
- Canvases can be organized vertically or horizontally or tabbed
- Switching to a task(anchor)  via the the menu left moves the whole virtual "plane" up or down - displaing task-specific canvases
- Screens or canvases that are opened on other devices will have a small indicator on the top righr corner
- Layout and every single canvas can be LLM controlled, "show me the latest emails for the DC migration project please" folowed by "add the task list to the right" followed by "send this to my team" 

### UI Hierarchy

  - Screen/Viewport
    - Real viewport/computer screen that shows the UI, any screen that connects to the UI should have the option to be named by the user (a default screen is created and autoconnected, rename spins of a named screen)
    - Elements can be sent to a nemed screen or displayed on a named screen as 100% of the available viewport with margins
  - Main "Context" menu (M0/M1/M2)
    - Controlls whether we are in Explorer mode or whether the current screen is bound to a context
    - L2 menu are pinned items shown as tiles with internal details(number of documents, messages etc), 
      hidden by default, available as the left-most elements when swiped/navigated to the left
    - L1 Full tree view, navigate the currently selected workspace trees freely or to change the context url, shows when navigating "left" from L2
    - L0 Main menu that shows when navigating "left" from L1, Current M0
    - Clicking on a pinned tile/item or on a tree node opens a default canvas
    - Shift+clicking 

A tree node can be tought-of as a "task container" - it containes everything related to a given task
Canvases and widgets help to split that view into individual streams/threads 

  - Set of canvases
    - Different behaviour in Explorer and Context mode
      - Explorer mode:
        - Double-click on tree node
        - 
        - 
        - 
        - 
      - Context mode:
        - 
        - 
        - 
        - 

	- Opening a 
    - Canvas is a A2UI/MCP-UI/MCP-APP AI driven dynamic "canvas" with the following layout features
      - Canvas can take the full viewport(with a sane margin)
      - New canvases can appear to the right 
  - Contextualized Toolbox with globally-available elements


- UI Workflows
  - 



## Prose
Great, btw, finally raining here, great as well, I love coding when it rains. Couple of cosmetics to
  keep the cosmetic treatment tempo - Toolbox should also be closable by Esc, same for M1/M2 - sorry
  should have tested that before. One more UI tweak, since we are slowly becoming something I tried to
  build 15y ago - a true desktop overlay - lets add Settings > Appearance > Wallpaper and allow users to
  set a global UI background wallapper (defaults to the current color) - with some basic settings
  "Fill, Scale and Crop, Centered". Another thing - we should be able to add a full content page App 
  (Notes, Todos) as a tab and now the most complex of the pack - we should allow displaying those tabs 
  side-by-side. Now, there are many grid layout engines that are battle-tested that we could reuse - 
  a-la vscode - but before we do any of the layout changes, let me first highlight where we are heading:
  The target *default* UI is simple, you have your toolbox icon on the right bottom which can be moved
  to your phone or any web-capable device and used from there, on the left you have a nice but hidden by
  default list of pinned layers representing "task containers" - a gestre/keyboard shortcut or swipe 
  can list all tasks of your selected workspace you want to work on today or in general. Selecting a 
  layer will bring up all open canvases related to your work that user can navigate with swipe gestures
  on top of his toolbox left-right or top-bottom(canvases in the desktop app may be webviews - a browser
  canvas may be tabbed or stacked on top vertically, swipe up-down will switch through the pages, 
  left-right between lets say your emails, tasks, notes etc. Switching to a different task would load a
  new vertical line of canvases. Switching of workspaces would be one more swipe left from Pinned to 
  Tree to Workspaces. A user willbe able to open a new canvas - doubleclick - tick on the toolbox and 
  voice-mode tell his canvas-ui agent - show me todays emails and open a pinned canvas to the right with
  that podcast from yesterday. So, while this run is not a full-fledge UI revamp - we have our "/next"
  ui skeleton for that - we are essentially building a tiling window manager in browser (nothing new,
  people did that with jquery years ago) hence should pick components that would not gight the stated 
  goal. UI should bring you all information you need for a task in a human-readable way, nothing else, 
  context switches should be as if you'd walk from a perfectly maintained work table with all tools 
  related to task on that table - to a new worktable related to a new tasks with everything prepared


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
locations dropped, mirror paths unticked, empty locations + `orphanedAt` (engine ticks `feature/orphaned`),
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

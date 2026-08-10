# TODO

## Session support (transport + delta-driven UI)

Moved here from `canvas-synapsd/TODO.md` 2026-08-10 — the engine container is DONE (see the
stub there); everything remaining is canvas-server transport + webui work, which is why this
plan lives in the monorepo now.

**CONTAINER LANDED (pre-2026-08):** `src/session/QuerySession.js` via `db.openSession(specs, opts)`
implements everything the checklist below asked for, plus more: modes `frozen|live`, emit
`delta|ids|page`, `add/remove/patch/clear`, **`set(label, spec)` replace-mode upsert** (for
streaming producers — patch() concats arrays by design), the **`ids` spec bucket** (literal
id-set operand: no collection keys, never coarse, zero invalidation cost), `count/ids/
materialize`, precise `membership.changed` key-touch invalidation with coarse re-resolve for
temporal/geo/rel operands, debounced recompute, `serialize()/rehydrate()`. Tests:
`tests/query-session.test.js`. The checklist below is retained for the record.

### LANDED 2026-08-10: session transport + delta-driven UI (round 1)

The plan below is DONE for round 1. What shipped:

- **canvas-server 2.4.0** — `Workspace.openSession(specs, opts)` + `normalizeSessionSpec()`
  (cue specs get the same canvas-querySpec folding / ctx:dir: path normalization as
  `list()`; text queries and paging opts are stripped — a cue is structural, `resolveCandidates`
  has no text stage). The workspace TRACKS its sessions and closes them in `stop()`.
  `Workspace.buildMatch({text, imageBytes, similarTo})` builds the typed match descriptor for
  the ranking stage (embedding an ephemeral frame via inferd, or reusing a stored vector).
  `transports/websocket/channels/session.js`: per-socket registry, `session.open/set/patch/
  remove/ids/materialize/close` RPC over socket.io acks (`{status, payload}`), `session.delta` push,
  8 sessions + 32 cues per connection, share-token sockets clamped to their bound workspace,
  close-on-disconnect. Tests: `tests/core/workspace/query-session.test.js`,
  `tests/transports/websocket/session-channel.test.js`.
- **protocol 0.2.0** — session event names + ack/delta shapes documented in `src/events.js`.
- **canvas-web 2.4.0** — `socketService.request()` (promise ack, fails fast when the socket is
  down), `services/session.ts`, `hooks/useQuerySession.ts` (Map<id,doc> + insertion-stable id
  order, hydrates ONLY `added` via `GET /documents?ids=`, drops `removed`), and the workspace
  page wired: while the Lens feed runs, the session drives the list and the per-tick refetch is
  suppressed entirely. Sessions are an optimization — if `session.open` fails the page keeps its
  stateless path, so an older server still works.

**The two stages of a session read** (the thing to keep straight when canvas-inferd lands):

1. **Cues = the candidate set.** Bitmap algebra: paths (`/home/house-build`), features, filters
   (incl. `geo:near` from a GPS fix), and literal id-sets (a camera frame's kNN survivors, fed
   via `set()` per frame). Cached per cue, hard-ANDed, precisely invalidated — this is what
   deltas describe, and `count()` answers "is there anything" with zero document loads.
2. **`match` = the ranking**, over the already-narrow candidate set: free text ("broken door"),
   an image, or BOTH — the image rides as a vector leg on synapsd's typed match descriptor and
   RRF-fuses with the full text pipeline (FTS + dense + text→image kNN), so a summarized note
   surfaces next to the photos the frame matched. `session.materialize { match }` →
   `QuerySession.materialize` → `db.rank(combined, match, opts)`.

Relevance is a SCORE, not a membership predicate: it has no bitmap key, so it cannot be
invalidated and must not live in a cue. Keeping it at the read means the text pipeline runs once
per read instead of once per camera frame. To NARROW by relevance rather than order by it,
materialize and feed the ids back as a cue — `rankAndPin()` in the hook does exactly that, using
the same id-set seam the lens uses. Cue specs carrying `query`/`search`/`q` are REJECTED with a
message pointing at materialize (silently dropping a user's search term is worse).

**Verified, not assumed** (`tests/core/workspace/query-session.test.js`, real Lance FTS): a
document's user-authored `comment` AND its generated `metadata.summary` are folded into FTS
text unconditionally by `Document.generateFtsData` — even for schemas that declare no
`ftsSearchFields` (photos, files). So commenting "broken door" on a photo makes it lexically
resurfacable, a comment-only edit re-indexes (checksums untouched — no dedup fork), and the
comment also embeds as its own text-space chunk. `mode:'fts'` narrows strictly within the cue
scope; `'hybrid'` also admits semantic neighbours. The gardening documents sitting in front of
that door are excluded by the text stage, not by the cues.

**Live text is `rank()`, not a pinned cue.** With a match set, every delta re-ranks against the
NEW candidate set, so the text keeps applying as the camera moves. Pinning search results as an
id-set cue (`rankAndPin`) is a SNAPSHOT — correct for conversational drill-down where the
candidate set stands still, WRONG under a live feed (documents that would match the text in the
new candidate set stay excluded by the stale pin). Documented on the hook interface.

**Image relevance floor: relative by default (synapsd 3.3.0, 2026-08-10).** `imageFloorMode`
`relative` (default) keeps hits within `imageRelativeMargin` (0.035) of THIS query's best hit,
with `imageMaxDistance` retained as a ceiling; `absolute` is the pre-3.3 behaviour. Driven by
measurement, not theory: on CLIP ViT-B/32 the 200 nearest photos to "winter" spanned ~0.02 in
cosine distance (typical step Δ0.0001), and a cutoff calibrated for SigLIP (~0.945) sat above
everything.

Read that continuum correctly (user, from the actual photos): the dataset holds a LOT of winter
photos, so the smooth tail is CORPUS DENSITY, not the model failing to discriminate. Where a
query genuinely has hundreds of true matches there is no semantic gap to find, and no floor is
the right instrument — the visible "gaps" are artifacts of model + query + how we cut the
results. A floor only earns its keep where matches are sparse and the tail really is noise.
Caveats recorded with it:
- an additive margin anchors adaptively but does NOT scale adaptively — it still assumes a
  distance unit. A genuinely scale-free rule would key off the observed distribution (largest
  significant gap, or a fraction of the spread). Not built: gap-detection can flicker
  frame-to-frame in a live feed, which matters for the lens.
- a tight window is hostile to MULTI-CONCEPT matches, which is the actual use case: a photo of
  a snowy window sits further from "winter" than a plain snowfield does, so the margin has to
  span pure→mixed, not just the jitter between near matches. Pinned by
  `tests/image-floor-mode.test.js` › "the margin governs whether multi-concept photos survive".
- the debug panel's "biggest gap" marker tends to fire at position 2 when the tail is smooth —
  it flags the TOP hit being an outlier rather than the match/noise edge. Read it as a hint, not
  a recommendation.
- DETAIL IN THE QUERY BEATS TUNING. "nice winter view from a window" outperforms "view" +
  "window" — expected, since CLIP-family models are trained on captions, so a full descriptive
  phrase is closer to the training distribution than a bare noun. Practical consequence: spend
  effort on query composition (and, later, on making those cues explicit per-index) rather than
  on squeezing a floor. A detailed prompt is already a multi-cue fusion — just done implicitly,
  inside the model, where we cannot inspect or weight it.

**Direction for the next phase (user, 2026-08-10): multi-index low-dim per modality, not one
big space.** Project input into small per-modality low-fidelity embeddings, resurface semantic
anchors as the stream runs, and combine multiple cues with top-down control for ranking. The
evidence above supports it: one 512-dim space can rank but cannot decide, because every
threshold question collapses into an isotropic blob. Narrow per-cue indices give decisions that
CAN be thresholded (and, discretized S2-style, become plain bitmaps — set membership, no
distances, which is exactly what this engine is fast at). The seams already fit: cue operands
are bitmaps whose SOURCE is pluggable (see "anchor/quantizer operand sources" below), and
membership (cues) is already separated from ordering (`match`/`rank`, which takes weighted
vector legs — that is the "top-down control" hook). What would still need building: weighted /
soft-overlap cues (option (b) below), since hard-AND cannot express a decayed or partial cue.

And the fusion policy is the hard part, not the projections. The user's framing: inhibitory
networks are a required design artifact in biological systems for a reason — combining cues
needs SUPPRESSION and competition, not just weighted addition. Concretely that argues for
rank-space fusion with normalization (RRF is already this shape) plus explicit inhibitory
cues — a cue that vetoes or damps others rather than only contributing positively — over
summing raw per-index scores, which are not comparable across indices anyway (the same
non-comparability that broke the absolute floor, one level up).

Start from what already exists rather than from theory: inhibition is ALREADY the boring
bitmap layer. The `noneOf` / `!` sigil (`+bitmapA +bitmapB !bitmapC`) and path exclusion
(`/foo/bar` minus `!/foo/bar/baz`, `paths.not` in `#resolveParsed`) are lateral inhibition
that happens to be exact, because bitmap membership is binary. The semantic layer needs the
same operator over SOFT membership — an inhibitor that damps rather than vetoes, since
"not quite winter" has no clean complement. That is the same missing piece as weighted cues,
approached from the other side: build one and you get both.

**Decay: (a) DECIDED 2026-08-10 — inferd owns it, the db stays dumb.** Exponential decay from
"now" plus preserved anchors is a per-cue WEIGHT model, but `QuerySession`'s combinator is
hard-AND only (`'and'` is the only accepted value): a cue is in or out, and a decayed cue has no
way to contribute partially. So inferd owns decay entirely and re-emits cues whose id-sets it has
already weighted and thresholded — works today, costs one re-resolve per emission. The
soft-overlap combinator (rank by how many cues a doc hits — a cheap bitmap sum, parked in
"Session container" above) stays the later option (b) for making anchors cheap to keep alive;
being pure bitmap math with no clock, it belongs INSIDE synapsd when it lands.

**Boundary rule for synapsd vs inferd** (settled while deciding the above). The seam is already
a DATA contract, not a plugin API: `rank()` accepts caller-supplied vector legs but never
produces them, `getUnembeddedDocIds()` is a pull-queue for an external embedder to drain, and
`metadata.summary` is a slot for deriver/captioner output whose author synapsd does not know.
The test to apply to any proposed extension: **needs a clock or a network call → outside**
(embedding, captioning, stream decay); **pure algebra over data at rest → inside** (soft
combinator, band-bitmaps, `suggest()`); **would add a hard dependency → outside**
(`onnxruntime-node` is inferd's, cf. the embedd extraction landmine). Note `QuerySession` is
the one thing in synapsd holding timers — it lives in `src/session/`, outside the core index,
and should stay there.

The house-build walkthrough, end to end. You are already at `work://architecture/project-foo`,
so the path cue pre-filters to that project's notes and captioned photos. Standing at the door:
GPS adds a `geo:near` cue; the camera adds a `{ids: <frame kNN>}` cue replaced per frame — the
candidate set now moves with the camera, one delta per change, only new documents fetched. The
area is dense (gardening documents right in front of that door), so you type "broken door":
`rank({ text: 'broken door' })` — or fused with the frame,
`rank({ text: 'broken door', image: <frame> })` — narrows what SURVIVED the cues, hitting the
comment you left on the photo. Every later delta re-ranks, so it stays live. When canvas-inferd
takes over the frame loop it patches the SAME cues server-side and the client contract does not
change; when the S2-like projected-representation space replaces the vector legs, it swaps in at
the operand level (a cue's bitmap can come from band-bitmaps instead of a kNN — the container
does not change).

Deliberately deferred (round 1 non-goals unless noted):

- [ ] **Grace TTL / reconnect-with-state.** Sessions are connection-scoped; a reconnect opens a
      fresh one. `serialize()` makes parking cheap, but a parked session needs a resume
      handshake the client does not have — holding operands for a socket that may never return
      is a pure leak. Add both together or neither.
- [ ] **A cue over a tree path that does not exist yet never gets a delta.** Verified against
      synapsd: `#buildContextSelectorBitmap` skips a path with no layer (`if
      (!tree.getLayerForPath(...)) continue`), so it records NO collection key and nothing can
      dirty it — documents later filed there push nothing. Right fix is in synapsd: treat a
      requested-but-absent path as COARSE (no stable key set → re-resolve on write), same rule
      temporal/geo operands already follow. Mitigated client-side for now: the webui issues a
      cheap `session.ids` resync (bitmap read, no doc loads) on workspace document events.
- [x] **Search box wired to `rank()`** (2026-08-10). While the Lens feed runs, a single search
      query becomes the session's match instead of a refetch; every later delta re-ranks against
      the new candidate set, so the text keeps applying as the camera moves. A STACKED query
      (`?q=car&q=red`) still falls back to the stateless path — that is chained AND-narrowing
      across separate searches and a session ranks by one match. The Lens feed itself still
      embeds frames client-side via `POST /documents/search/image` (idsOnly) and pushes the
      survivors as a cue; that loop is what canvas-inferd takes over.

- [ ] **BLOCKED ON A SYNAPSD PUSH: scoped-FTS fix.** `canvas-synapsd` 3.2.1 (local sibling, not
      pushed) fixes `LanceIndex.ftsQuery` bounding its BM25 fetch by the CANDIDATE-SET SIZE.
      Filtering is a post-filter, so a scope of N documents fetched the globally top-N rows and
      kept only those that happened to be candidates: the tighter the scope the more likely the
      search returned NOTHING. Broke far more than sessions — any `?ids=…&q=…`, any narrow path
      + search. One-line fix + `tests/fts-scoped-search.test.js` (fails without it; whole
      synapsd suite green, 386 tests). To land: push synapsd, then `npm run deps:bump` in
      canvas-server. The regression gate `tests/transports/websocket/session-channel.test.js
      › ranking re-evaluates against a MOVING candidate set` SKIPS itself below 3.2.1 and
      self-activates once the pin advances.
- [ ] The session path covers the plain document list only. Layer views and backend "unfiled
      only" keep the stateless refetch (which already keeps previous results + stable keys, so
      it does not blink either).
- [ ] Session-driven ordering is insertion-stable by design (a live feed must not reshuffle the
      grid every frame), so `sortBy`/pagination do not apply while the feed drives the list.

### Original plan (retained for the record)

**The problem observed:** Lens live-mode (camera feed / shared content) in the webui refetches
and re-renders the whole document list per tick — the UI "blinks". Root cause: sessions are
IN-PROCESS ONLY. The web toolbox writes filter state → the page re-runs a stateless
`GET /documents` → full list swap. Nothing surfaces QuerySession's `{added, removed, count}`
deltas to a client, so every consumer above synapsd is stuck in snapshot-refetch mode.

**Division of labor (synapsd is nearly done here — this is mostly canvas-server + webui):**

1. **canvas-server: session RPC over the existing socket.io transport** (channels today are
   event fan-out only; no search RPC exists).
   - `session.open { workspace, specs[], opts {mode, emit, debounceMs} } -> { sessionId, ids }`
   - `session.set / session.patch / session.remove { sessionId, label, spec }` — thin passthrough
     to the QuerySession methods (set() is the streaming verb: lens ids, sliding windows).
   - `session.close { sessionId }`; server ALSO closes on socket disconnect after a grace TTL —
     `serialize()` makes park/rehydrate cheap if reconnect-with-state is wanted later (PWA).
   - Server → client: `session.delta { sessionId, added[], removed[], count }` (emit:'delta').
   - Auth/scoping: session bound to (user, workspace) at open; reuse socket auth. A registry
     (sessionId → QuerySession) lives in canvas-server (synapsd stays a library); enforce a
     per-connection session cap.
   - Materialization stays PULL: deltas carry ids only; the client hydrates added ids via the
     existing `GET /documents?ids=…` (the Slice B½ ids param) — only NEW docs are ever fetched.
2. **webui: a `useQuerySession` hook + incremental list.**
   - Hook: open on mount / close on unmount, maintain `Map<id, doc>` + ordered id list; on delta
     fetch ONLY `added` ids, drop `removed`; stable keys → React reconciles instead of remounting;
     no loading-state flash (keep-previous-while-updating).
   - Lens live mode becomes: frame → `search/image (idsOnly)` (unchanged) → `session.set('lens',
     { ids })` over WS → delta → incremental render. The toolbox `filters.lens.ids` refetch path
     stays as the fallback when no socket is available.
   - Later (sensord): the frame loop moves server-side and patches the SAME session — the client
     contract (deltas in, cue ops out) does not change. This transport IS the sensord consumer
     surface, so design the message shapes with that in mind.
3. **Independent quick mitigation (webui-only, can ship immediately):** even without sessions,
   the Lens refetch path should keep previous results while fetching + render with stable keys +
   only replace state when the id set actually changed (set-equality check) — kills the blink,
   not the redundant fetch.
4. **synapsd (small, optional):**
   - [ ] session-wide `andNot(internal/gc/deleted)` in `#combine()` (parked from Slice B½: an
         id-set cue has no keys, so deletes never dirty it). Same blind spot as the
         absent-path case above; the webui `session.ids` resync covers both for now.
   - [ ] `materialize()` already exists for emit:'page' consumers; nothing else blocking.

**Non-goals for round 1:** multi-workspace sessions, session sharing between users,
server-side lens frame processing (that's sensord), soft/weighted combinators.

**Conversational drill-down (REPL / the expansion UI you sketched).**  
In a user-session query:  
"car" → add "red" → add "near the market" → drop "red." *Why a session:* per-spec operand cache - each cue is resolved to a bitmap once, every refinement is just a re-AND, and removing a cue is free. Stateless re-resolves the whole conjunction on every keystroke; a 5-step refinement costs 5 resolves instead of 1+2+3+4+5.

**Agent working memory across turns (canvas-agentd).**  
Turn 1 commits `ctx:/work/dc-migration`, turn 3 adds `t:crud:updated:thisWeek`, turn 5 patches in a person. The session *is* the accumulated retrieval context you hand the LLM each turn - the agent mutates it in place instead of reconstructing the full spec every turn. *Bonus:* because the spec list is the only authoritative state, `serialize()` gives you durable agent working memory that survives a process restart for a few hundred bytes.

**A read-only stream that converges (camera at `/work`, `journalctl -u apache2 -f`).** Each frame or log line becomes a fading spec; the session holds the decaying accumulation of the last few seconds and emits related docs continuously. Continuity over a stream is intrinsically stateful - you're maintaining a running result, debounced and decayed, not answering one-shot questions. A burst of related apache errors *converges* on the right runbook instead of flickering one doc per line.

**A standing live view (invalidation).** Leave "everything about project-foo" open while ingestion runs; new foo docs appear the moment they land, no re-query, no polling. "Did the dc-migration reply arrive yet" flips empty→non-empty on ingest. *Why a session:* event-driven invalidation makes the open result a live view; stateless `query()` is a snapshot frozen at call time.

**Cheap probing, expensive only at commit.** Across a whole exploration the session answers `count()`, "is there anything," and "which cue narrows most" from the combined bitmap with zero document loads, and materializes actual docs exactly once, at "show me." *Why a session:* lazy materialization at *session* granularity - your 90%-without-the-doc goal at the interaction level. "Do we have new emails for foo" is a `count()`, never a fetch.

**Lens toggling and what-if branching.** Hold named specs as lenses - wikipedia / personal / work - and toggle one off without restating the rest, or fork the spec list to compare two refinements' overlap counts before committing. *Why a session:* cached operands plus an authoritative, forkable spec list make add/remove/branch nearly free.

And the honest counterweight: **a one-shot lookup - "find acme's latest invoice" - should stay a stateless `query()`.** There's no continuity to amortize, so the session is pure overhead. The abstraction earns its complexity only when there's continuity in the access pattern: iterative refinement, a stream, a standing live view, multi-turn agent context, or repeated cheap probing of one candidate set. If a use-case has none of those, it's a query, not a session.

A session pays off exactly when *the candidate set outlives a single question* 

Not on the table yet, but landing shortly: the focus shift to canvas-agentd needs durable per-turn retrieval context, which is exactly a session. Build the `resolveCandidates`/`rank` seam now so the session is a thin layer on top, not a rewrite.

### Session modes

The dividing line is whether real-time streaming is supported out of the box. Two cuts, same container:

- **Frozen-in-time (v1, default, easiest).** Relative timeframes resolve to absolute bounds at `add()` time and stay put; operands are pure cached bitmaps; invalidation is optional. This is agent working memory: `thisWeek` means the week the cue was added, and the session is a stable snapshot you keep handing the LLM.
- **Live / streaming (v2).** Operands re-resolve against the snapshot at query-run time; relative timeframes slide; this is where the invalidation path below earns its keep. Target optimizations beyond the raw API (dirty-key subscriptions, debounce, decay) so a stream converges instead of re-resolving the whole conjunction per event.

### Session container
- [ ] Keyed, ordered map `label -> querySpec` - the spec list is the ONLY authoritative state.
- [ ] Per-spec cached operand bitmap (from `resolveCandidates`) + a `dirty` flag.
- [ ] Combined result bitmap, recomputed lazily from operands.
      Default combinator: intersection across specs.
      (Optional flag: soft overlap - rank docs by how many specs they hit, a cheap bitmap sum. Ship hard-AND first.)

### Mutation (hydrate / drain / refine)
- [ ] `add(spec, label?) -> label`   (resolve operand, mark combined dirty)
- [ ] `remove(label)`                (drop operand, recombine)
- [ ] `patch(label, partialSpec)`    (re-resolve just that operand)
- [ ] `clear()`

### Read (lazy materialization)
- [ ] `count()` / `ids()` - from the combined bitmap, no doc load.
- [ ] `materialize(match?, {limit,offset,mode}) -> docs` - `rank` the combined survivors, then fetch docs.
      Ranking match is a materialize-time arg (default: most-recently-added spec's match).

### Invalidation (thin, live — streaming mode only)
- [ ] Each operand records the bitmap keys it touched (the `keys` from `resolveCandidates`).
- [ ] Precise invalidation only covers path/feature operands (stable keys). Temporal (BSI range), glob, and regexp operands have no stable key set: mark them coarse and re-resolve on read.
- [ ] Subscribe to existing write events; a write hitting a dependent key dirties that operand; recompute on next read.
      (v1 shortcut acceptable: dirty the whole session on any write + a manual `refresh()`.)

### Lifecycle (falls out of the authoritative-spec-list rule)
- [ ] `serialize()` -> spec list + labels + combinator (+ ttl). Tiny.
- [ ] `rehydrate(serialized)` -> rebuild operands lazily on first read.
- [ ] TTL governs residency, not identity: idle -> drop operands + unsubscribe, keep specs; rebuild on touch.

### Deliberately NOT in this cut (they slot onto the above unchanged)
- co-occurrence `suggest()` (reads combined bitmap + synapses)
- decay / streaming driver (a per-spec weight + a quantize→spec feeder)
- zoom aggregates / centroids on nodes
- anchor/quantizer operand sources (a spec's operand can later come from band-bitmaps instead of paths/features - the container doesn't change)

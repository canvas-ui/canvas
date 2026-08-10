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

### NEXT: session transport + delta-driven UI (planned 2026-08-10, separate session)

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
         id-set cue has no keys, so deletes never dirty it).
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

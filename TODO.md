# TODO

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
- [ ] Add priority scheduling: interactive queries and live streams before
      background derivation, then bulk reconciliation.
- [ ] Support parallel workers where the selected runtime can actually run in
      parallel. Keep the server-wide resource cap and per-workspace isolation.
- [ ] Define a streaming API with bounded input queues, cancellation, cadence,
      backpressure, and typed incremental outputs.
- [ ] Keep providers swappable and model output model/version namespaced.

### Generated content

- [ ] Implement `describe`, starting with Qwen-VL images.
- [ ] Write generated text to `metadata.summary` with
      `{ model, generatedAt, sourceChecksum }` provenance.
- [ ] Key derivation work by source checksum. `updatedAt` would create a
      caption-write-recaption loop.
- [ ] Add audio transcription and decide whether existing voice STT becomes an
      inferd provider or remains a Canvas Server adapter.
- [ ] Benchmark a cheap SigLIP/CLIP text bridge against caption-then-embed before
      making captions mandatory for cross-modal retrieval.

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

- [ ] Establish the baseline with existing contrastively trained CLIP/SigLIP
      vectors before touching Gemma hidden states.
- [ ] Train a versioned per-model codebook and emit small anchor observations.
- [ ] Evaluate anchor retrieval against exact vector kNN on the same corpus.
      Measure recall, stability across frames, rebuild cost, and model changes.
- [ ] Experiment with Gemma 4 per-layer representations: layer selection,
      modality/token pooling, normalization, and whether a shared codebook
      preserves cross-modal alignment.
- [ ] Treat S2/Hilbert as a storage encoding candidate, not evidence that a
      high-dimensional semantic manifold became two-dimensional without loss.
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

## Integration leftovers

- [ ] Finish the persisted wire rename from `embedd` to `inferd`: workspace
      config, environment variables, config filename, cache path, and old route
      aliases.
- [ ] Add `ids` filtering to context document routes.
- [ ] Extend session-driven lists to layer and unfiled views where useful.
- [ ] Add reconnect/resume only together with a bounded grace TTL.
- [ ] Decide live-session sorting and pagination UX. Stable insertion order is
      currently deliberate.
- [ ] Make the web client consume published JSON Schemas and delete copied enums.

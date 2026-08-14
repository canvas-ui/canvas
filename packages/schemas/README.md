# @augmentd-labs/canvas-schemas

Canvas document schema ids, `schemaVersion` constants, the `tag/` feature
vocabulary and the document builders every client was hand-rolling.

Authored from the client copies (cli `docbuilders.js`/`ingest.js`, web
`toolbox/add/*`), deliberately **not** extracted from synapsd: synapsd is the
canonical server-side registry and may itself consume this package one day —
the licence boundary only works in that direction.

## Parity contract

For the inputs the pre-monorepo cli produced, `buildNoteDoc`, `buildTabDoc`
and `buildFileDoc` emit **wire-identical** documents (tests pin this with
literal fixtures). Optional fields are only emitted when provided, so callers
that never pass them see no change. Inputs are not trimmed here; callers that
trimmed before keep trimming.

## Known divergences, still client-side (on purpose)

- ~~Browser extension tab documents add a top-level `featureArray`.~~
  **Resolved 2026-08-14 (extension v3.1.0):** the extension now builds tab
  documents with `buildTabDoc` and asserts tags via doc-level `features`, so
  tags are stored on the row *and* ticked. The old top-level `featureArray`
  was inert — synapsd's `Document` reads only `features` (v3) or legacy
  `metadata.features` — which is why removing a tag never unticked it: the
  array was mirrored into the request-body `features` (indexed, not stored),
  leaving nothing for the next write to diff against. Verified end-to-end
  against canvas-server 2.5.13: dropping `tag/x` from the array now unticks
  `tag/x` and leaves `client/app/*` ticked. The fixed
  `metadata.contentType/contentEncoding` is still extension-supplied, passed
  through `buildTabDoc`'s `metadata` option.
- Web's post-upload File document (`stored://` blob URL, sha256-only,
  `buildFileDocument(blob, file, …)`) is a different flow from the cli's
  index-in-place `buildFileDoc` (`file://<deviceId>/…`, sha256+md5). The
  upload variant lands here together with the web migration.

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

- Browser extension tab documents add a top-level `featureArray` and fixed
  `metadata.contentType/contentEncoding`; that stays in the extension until it
  migrates onto this package. **Verified server-side (2026-08-09):** the
  doc-level `featureArray` is inert — synapsd's `Document` reads only
  `features` (v3) or legacy `metadata.features`; the extension works because
  its call sites mirror the same array into the request-body `features`,
  which is indexed but not stored on the row. Recorded follow-up: move the
  extension to doc-level `features` so tags are stored *and* ticked (that is
  also what makes tag-removal unticking work), then adopt `buildTabDoc` here.
- Web's post-upload File document (`stored://` blob URL, sha256-only,
  `buildFileDocument(blob, file, …)`) is a different flow from the cli's
  index-in-place `buildFileDoc` (`file://<deviceId>/…`, sha256+md5). The
  upload variant lands here together with the web migration.

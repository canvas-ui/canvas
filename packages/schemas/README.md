# @canvas-os/schemas

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
  migrates onto this package.
- Web's post-upload File document (`stored://` blob URL, sha256-only,
  `buildFileDocument(blob, file, …)`) is a different flow from the cli's
  index-in-place `buildFileDoc` (`file://<deviceId>/…`, sha256+md5). The
  upload variant lands here together with the web migration.

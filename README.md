# @augmentd-labs/canvas-schemas

Canvas document schema ids, `schemaVersion` constants, the `tag/` feature
vocabulary and the document builders every client was hand-rolling.

Authored from the client copies (cli `docbuilders.js`/`ingest.js`, web
`toolbox/add/*`), deliberately **not** extracted from synapsd: synapsd is the
canonical server-side registry and may itself consume this package one day —
the licence boundary only works in that direction.

## Builders

| builder | schema | required input | notes |
| --- | --- | --- | --- |
| `buildNoteDoc` | `data/schema/note` | content | title defaults server-side (`YYYYMMDD`) |
| `buildTabDoc` | `data/schema/tab` | url | `pinned` emitted even when `false` (extension semantics) |
| `buildFileDoc` | `data/schema/file` | absPath + checksums | index-in-place: `file://<deviceId>/…` |
| `buildTaskDoc` | `data/schema/task` | title | VTODO status, `dueDate`, 1–9 priority |
| `buildLinkDoc` | `data/schema/link` | uri (any scheme) | rejects a scheme-less uri locally |
| `buildDotfileDoc` | `data/schema/dotfile/{file,folder}` | entry path or identity URI | type is the schema leaf; per-device `links` map; `dotfileUrl()` assembles the URI |

Tags always become `tag/*` entries in `metadata.features`, because that is what
the bitmap index and every filter query read. `link` and `dotfile` additionally
declare `data.tags` in their schemas, so those two emit both — the schema field
for readers, the feature for queries.

Email and identity documents are not built here: nothing in the clients creates
them (they arrive through connectors and the web identity UI), so they have ids
and no builder.

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
- `NOTE_SCHEMA_VERSION` / `TAB_SCHEMA_VERSION` still say `2.0` while synapsd's
  Note and Tab are at `3.0`. Inert — the engine overwrites `schemaVersion` on
  parse — but it is the parity contract above that keeps them pinned. The newer
  builders (task, link, dotfile) emit the synapsd version.
- Tags go to `metadata.features` (v2 placement) rather than the v3 top-level
  `features`. synapsd reads both, but the web edit forms still read
  `doc.metadata?.features`, so moving the builders first would make
  CLI-created documents look untagged in the UI. Both move together or not
  at all.
- Web's post-upload File document (`stored://` blob URL, sha256-only,
  `buildFileDocument(blob, file, …)`) is a different flow from the cli's
  index-in-place `buildFileDoc` (`file://<deviceId>/…`, sha256+md5). The
  upload variant lands here together with the web migration.

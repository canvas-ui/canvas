# Canvas strip review

Reviewed against `TODO.md` → `(legacy) UI revamp`, September 10, 2026.

The prototype has a useful row/column state model, but the existing page and
floating-card components still own layout that should belong to the strip.
The desktop port should separate canvas content from its host chrome.

## Corrected in web 2.10.8

- Document canvases had both a strip header and a B5 header, each with their
  own expansion and close controls. Documents now supply one header, while
  the strip owns expansion and the outer surface.
- B5's 560px width and rounded bordered surface sat inside the strip's ISO
  card. Document content now fills the outer card, including when expanded.
- Strip headers used a 3px divider while document/menu headers used 1px.
  They now share a 48px overall height and 1px divider.
- A document's Save/Link picker could extend beyond the clipped canvas.
  It now uses the document body in strip mode; closing it restores content.
- Scroll targets mixed offset coordinates from transformed rows and menu
  columns, so focus could leave canvases offscreen. Targets now use viewport
  rectangles in a shared coordinate space.
- Opening M1 did not focus it. Selecting a workspace tree path did not focus
  the main canvas. Both now explicitly set the destination focus.
- Opening from the main canvas appended after all existing entries rather
  than inserting immediately to its right.
- Card minimum width could exceed a narrow viewport; mobile width now uses
  the measured strip viewport. Reduced-motion users skip the scroll tween.

## Remaining requirements and risks

1. M0 is outside the scroller and absent from keyboard column navigation.
   It remains a fixed desktop rail and a mobile overlay.
2. Native swipe scrolling does not synchronize the focused column. The next
   keyboard action can therefore start from a previously focused canvas.
3. Shift+tree selection opens another horizontal entry, not a tab in the
   current column. Rows have no per-column tab model yet.
4. Inactive rows retain entry descriptors but unmount page components.
   Unsaved editor state and live terminal sessions need a stronger lifecycle
   contract before this model hosts desktop webviews.
5. Routed pages still have their own headings and actions inside the strip
   header. A shared host/header contract is needed for these pages too;
   blindly hiding their headers would also hide useful controls.
6. Save/Link stays inside its source card for this cleanup. A picker as an
   independently focusable adjacent canvas remains a separate layout task.
7. Closing a focused secondary canvas jumps to the main canvas, rather than
   its nearest surviving neighbor. Resizing the viewport does not explicitly
   refocus the active column after its dimensions change.

These remaining items should be settled in the web experiment before porting
its interaction behavior to Tauri. Keep card geometry, focus/navigation,
content lifecycle, and content actions separate in that implementation.

## Validation

TypeScript project build, focused ESLint checks, and `git diff --check` pass.
Headless Chrome at 1280×800 verified three in-memory document cards: one
header per document, content matching frame width, 48px header geometry,
keyboard focus and offscreen return without closing cards, and full-width
expansion/restoration. No fixture documents were saved to the backend.
This does not constitute an end-to-end swipe, relationship-editing, or
same-column tab test; those gaps remain listed above.

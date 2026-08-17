# Canvas × KDE desktop integration

Send files, links and selected text into Canvas from a plain KDE desktop —
no PWA involved. This is the interim bridge until a native context-aware
desktop exists.

**Why not the PWA Share menu?** KDE's Share submenu (pastebin, gdrive, …)
is the [Purpose](https://api.kde.org/frameworks/purpose/html/) framework —
Chromium-installed PWAs do not register there on Linux; a PWA
`share_target` only wires into Chrome's own share surfaces (Android /
ChromeOS). A proper Purpose plugin (a real "Canvas" row inside Share) is a
small C++/QML project — feasible later; the pieces here get 90% of the value
with two files.

## Install

```bash
./install.sh
$EDITOR ~/.config/canvas/share.conf   # set CANVAS_TOKEN (Settings > API tokens)
```

Restart Dolphin (or `kbuildsycoca6`). `~/.local/bin` must be on PATH.

## What you get

- **Dolphin context menu → "Send to Canvas"** — any file(s); uploaded into
  the workspace blob store and filed as file documents at
  `CANVAS_WORKSPACE:CANVAS_PATH` (same pipeline as the webui Add panel:
  `POST /blobs` + `POST /documents`). Desktop notification on success/failure.
- **`canvas-share --selection`** — grabs the current PRIMARY selection
  (highlighted text; wl-clipboard or xclip) and files it as a note — or as a
  link when the selection is a bare URL. Bind it to a global shortcut:
  System Settings → Shortcuts → Add Command → `canvas-share --selection`
  (e.g. Meta+Shift+C), and "share a selected text snippet" works in every
  app on the desktop.
- **Klipper action** (optional): Klipper → Configure → Actions → add a
  regexp `.*` action running `canvas-share --text %s` for a clipboard-based
  flow instead.
- **`canvas-share FILE… / --text "…" / --text -`** — scriptable CLI for
  anything else (cron outputs, screenshots via Spectacle's post-capture
  command, etc.).

## Config (`~/.config/canvas/share.conf`)

| key | default | meaning |
|---|---|---|
| `CANVAS_URL` | — | server base, e.g. `https://canvas.corp.lan` (no `/rest/v2`) |
| `CANVAS_TOKEN` | — | API token |
| `CANVAS_WORKSPACE` | `universe` | target workspace |
| `CANVAS_PATH` | `/` | context-tree path new items land on |
| `CANVAS_TREE` | `context` | tree name |

## Later

- Purpose plugin for a real Share-submenu entry.
- GNOME/Nautilus script equivalent (`~/.local/share/nautilus/scripts`).
- The tauri desktop app subsumes all of this eventually.

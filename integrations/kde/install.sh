#!/usr/bin/env bash
# Install the Canvas KDE desktop integration for the current user:
#  - `canvas-share` into ~/.local/bin (must be on PATH for the service menu)
#  - the Dolphin service menu into ~/.local/share/kio/servicemenus/
# Then seeds ~/.config/canvas/share.conf if missing.
set -euo pipefail
cd "$(dirname "$0")"

BIN="$HOME/.local/bin"
MENU="$HOME/.local/share/kio/servicemenus"
CONF="$HOME/.config/canvas/share.conf"

mkdir -p "$BIN" "$MENU" "$(dirname "$CONF")"
install -m 755 canvas-share "$BIN/canvas-share"
install -m 644 canvas-share.desktop "$MENU/canvas-share.desktop"
# Dolphin requires the executable bit on service menus since KDE Frameworks 5.85.
chmod +x "$MENU/canvas-share.desktop"

if [[ ! -f "$CONF" ]]; then
  cat > "$CONF" <<'EOF'
# Canvas desktop share — see integrations/kde/README.md
CANVAS_URL=http://127.0.0.1:8001
CANVAS_TOKEN=
CANVAS_WORKSPACE=universe
CANVAS_PATH=/inbox
CANVAS_TREE=context
EOF
  echo "Seeded $CONF — set CANVAS_TOKEN before first use."
fi

echo "Installed. Restart Dolphin (or run: kbuildsycoca6) to pick up the menu."

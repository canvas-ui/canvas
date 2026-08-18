#!/usr/bin/env bash
# Regenerates the AVIF/WebP renditions and picker thumbnails in this package
# from the checked-in sources (the .svg files, plus w1.jpg which has no vector
# original). Run it after adding or replacing a wallpaper source:
#
#   packages/wallpapers/scripts/derive.sh
#
# Requires rsvg-convert (librsvg) and ImageMagick 7 built with AVIF + WebP.
set -euo pipefail

cd "$(dirname "$0")/.."

WIDTH=2560   # widest rendition we ship; covers 1440p and downscales cleanly
THUMB=480    # picker tile, 2x a ~240px card

for svg in files/*.svg; do
  id=$(basename "$svg" .svg)
  echo "· $id (vector)"
  rsvg-convert -w "$WIDTH" "$svg" -o "/tmp/$id.png"
  magick "/tmp/$id.png" -quality 60 "files/$id.avif"
  magick "/tmp/$id.png" -quality 80 "files/$id.webp"
  magick "/tmp/$id.png" -resize "${THUMB}x" -quality 75 "thumbs/$id.webp"
  rm -f "/tmp/$id.png"
done

for jpg in files/*.jpg; do
  id=$(basename "$jpg" .jpg)
  echo "· $id (raster)"
  magick "$jpg" -resize "${WIDTH}x>" -quality 55 "files/$id.avif"
  magick "$jpg" -resize "${WIDTH}x>" -quality 80 "files/$id.webp"
  magick "$jpg" -resize "${THUMB}x" -quality 75 "thumbs/$id.webp"
done

echo "done — remember to update manifest.js if you added a wallpaper"

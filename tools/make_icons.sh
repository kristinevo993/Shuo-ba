#!/bin/bash
# Chụp tools/icon.html thành ảnh icon 512px bằng Chrome (chạy ngầm), rồi thu nhỏ bằng sips (có sẵn trên Mac).
# Cách chạy, từ thư mục shuo-ba:  bash tools/make_icons.sh
cd "$(dirname "$0")/.." || exit 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p icons
PROFILE="$(mktemp -d)"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$PROFILE" \
  --window-size=512,512 --screenshot="icons/icon-512.png" "file://$PWD/tools/icon.html" 2>/dev/null
rm -rf "$PROFILE"
sips -z 192 192 icons/icon-512.png --out icons/icon-192.png >/dev/null
sips -z 180 180 icons/icon-512.png --out icons/apple-touch-icon.png >/dev/null
ls -l icons

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
HTML="${ROOT_DIR}/assets/cv.html"
OUT="${ROOT_DIR}/assets/cv.pdf"

if [[ ! -f "$HTML" ]]; then
  echo "cv.html not found. Generating from assets/cv.md..." >&2
  "${ROOT_DIR}/scripts/generate_cv.py"
fi

echo "Looking for Chrome/Chromium..."
CHROME_BIN=""

try_bin() { command -v "$1" >/dev/null 2>&1 && CHROME_BIN="$1"; }

# Common names on macOS/Linux
try_bin "google-chrome"
[[ -z "$CHROME_BIN" ]] && try_bin "chromium"
[[ -z "$CHROME_BIN" ]] && try_bin "chromium-browser"

# macOS app bundle
if [[ -z "$CHROME_BIN" && -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]]; then
  CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
fi

if [[ -z "$CHROME_BIN" ]]; then
  echo "Error: Chrome/Chromium not found. Install Google Chrome or Chromium and re-run." >&2
  echo "Alternatively: open assets/cv.html in your browser and use Print -> Save as PDF." >&2
  exit 1
fi

echo "Using: $CHROME_BIN"
FILE_URL="file://${HTML}"
"$CHROME_BIN" \
  --headless=new \
  --disable-gpu \
  --print-to-pdf="${OUT}" \
  --print-to-pdf-no-header \
  "$FILE_URL"

echo "Wrote ${OUT}"


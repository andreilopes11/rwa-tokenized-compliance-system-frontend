#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME_DIR="$ROOT_DIR/.local-runtime"
ANVIL_PID_FILE="$RUNTIME_DIR/anvil.pid"

if [ ! -f "$ANVIL_PID_FILE" ]; then
  printf '[stop-local] No managed Anvil process found.\n'
  exit 0
fi

ANVIL_PID="$(cat "$ANVIL_PID_FILE")"

if kill -0 "$ANVIL_PID" >/dev/null 2>&1; then
  kill "$ANVIL_PID" >/dev/null 2>&1 || true
  printf '[stop-local] Stopped Anvil process %s.\n' "$ANVIL_PID"
else
  printf '[stop-local] PID file existed but process %s was not running.\n' "$ANVIL_PID"
fi

rm -f "$ANVIL_PID_FILE"

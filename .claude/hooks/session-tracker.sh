#!/usr/bin/env bash
# P0: Session Tracker — logs session start/end/compact events
# Pure bash — no node dependency.

set -euo pipefail

INPUT=$(cat 2>/dev/null || echo '{}')
EVENT_TYPE="${1:-session-event}"

DIR="$HOME/.claude/session-logs"
mkdir -p "$DIR"

BRANCH=$(git branch --show-current 2>/dev/null || echo 'detached')

# Extract fields from JSON without node/jq
SESSION_ID=$(echo "$INPUT" | grep -o '"session_id"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"session_id"[[:space:]]*:[[:space:]]*"//;s/"$//')
MATCHER=$(echo "$INPUT" | grep -o '"matcher"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"matcher"[[:space:]]*:[[:space:]]*"//;s/"$//')

TS=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

printf '{"ts":"%s","event":"%s","session":"%s","matcher":"%s","cwd":"%s","branch":"%s"}\n' \
  "$TS" "$EVENT_TYPE" "${SESSION_ID:-no-session}" "${MATCHER:-normal}" "$(pwd)" "$BRANCH" >> "$DIR/sessions.jsonl" 2>/dev/null

exit 0

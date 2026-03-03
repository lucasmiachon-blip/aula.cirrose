#!/usr/bin/env bash
# Hook 3 — PostToolUse + PostToolUseFailure: Log build results to NOTES.md
# Filters: npm run build* or build-html.ps1 commands only.

INPUT=$(cat)

# Extract fields
CMD=$(echo "$INPUT" | python -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('command', ''))
except:
    print('')
" 2>/dev/null)

EVENT=$(echo "$INPUT" | python -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('hook_event_name', ''))
except:
    print('')
" 2>/dev/null)

CWD=$(echo "$INPUT" | python -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('cwd', '.'))
except:
    print('.')
" 2>/dev/null)

# Filter: only build commands
if [[ "$CMD" != *"npm run build"* ]] && \
   [[ "$CMD" != *"build:cirrose"* ]] && \
   [[ "$CMD" != *"build-html.ps1"* ]]; then
    exit 0
fi

NOTES="$CWD/aulas/cirrose/NOTES.md"
DATE=$(date '+%Y-%m-%d %H:%M')

# Create NOTES.md if it doesn't exist
if [ ! -f "$NOTES" ]; then
    printf "# NOTES — Cirrose\n\n" > "$NOTES"
fi

if [[ "$EVENT" == "PostToolUseFailure" ]]; then
    ERROR=$(echo "$INPUT" | python -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('error', 'exit code != 0'))
except:
    print('unknown error')
" 2>/dev/null)
    printf "\n[%s] [BUILD] FAIL — %s | cmd: %s\n" "$DATE" "$ERROR" "$CMD" >> "$NOTES"
else
    printf "\n[%s] [BUILD] OK — %s\n" "$DATE" "$CMD" >> "$NOTES"
fi

exit 0

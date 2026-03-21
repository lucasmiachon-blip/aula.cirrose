#!/usr/bin/env bash
# Hook 3 — PostToolUse + PostToolUseFailure: Log build FAILURES to NOTES.md
# OK builds are skipped (reduces NOTES noise). Single node call for JSON parsing.

INPUT=$(cat 2>/dev/null || echo '{}')

# Single node call extracts all fields (4→1 spawn)
PARSED=$(node -e "
const d=JSON.parse(process.argv[1] || '{}');
const ti=d.tool_input||{};
console.log(ti.command||'');
console.log(d.hook_event_name||'');
console.log(d.cwd||'.');
console.log(d.error||'exit code != 0');
" "$INPUT" 2>/dev/null) || exit 0

CMD=$(echo "$PARSED" | sed -n '1p')
EVENT=$(echo "$PARSED" | sed -n '2p')
CWD=$(echo "$PARSED" | sed -n '3p')
ERROR=$(echo "$PARSED" | sed -n '4p')

# Filter: only build commands
if [[ "$CMD" != *"npm run build"* ]] && \
   [[ "$CMD" != *"build:"* ]] && \
   [[ "$CMD" != *"build-html.ps1"* ]]; then
    exit 0
fi

# Auto-detect aula from git branch
BRANCH=$(git branch --show-current 2>/dev/null)
AULA=""
case "$BRANCH" in
  *cirrose*)     AULA="cirrose" ;;
  *metanalise*)  AULA="metanalise" ;;
  *grade*)       AULA="grade" ;;
  *osteo*)       AULA="osteoporose" ;;
  *)             AULA="unknown" ;;
esac

# Skip if aula unknown or dir missing
if [ "$AULA" = "unknown" ] || [ ! -d "${CWD:-.}/aulas/$AULA" ]; then
    exit 0
fi

NOTES="${CWD:-.}/aulas/$AULA/NOTES.md"
DATE=$(date '+%Y-%m-%d %H:%M')

# Create NOTES.md if it doesn't exist
if [ ! -f "$NOTES" ]; then
    printf "# NOTES — %s\n\n" "$AULA" > "$NOTES"
fi

# Only log failures — OK builds are noise
if [[ "$EVENT" == "PostToolUseFailure" ]]; then
    printf "\n[%s] [BUILD] FAIL — %s | cmd: %s\n" "$DATE" "$ERROR" "$CMD" >> "$NOTES"
fi

exit 0

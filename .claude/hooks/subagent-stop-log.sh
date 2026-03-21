#!/usr/bin/env bash
# Hook 4 — SubagentStop: Append 1-line summary to NOTES.md for every subagent that completes.
# Single node call for JSON parsing (4→1 spawn).

INPUT=$(cat 2>/dev/null || echo '{}')

# Single node call extracts all fields
PARSED=$(node -e "
const d=JSON.parse(process.argv[1] || '{}');
console.log(d.agent_type||'unknown');
console.log((d.agent_id||'?').slice(0,8));
console.log((d.last_assistant_message||'').slice(0,300).replace(/\\n/g,' '));
console.log(d.cwd||'.');
" "$INPUT" 2>/dev/null) || exit 0

AGENT_TYPE=$(echo "$PARSED" | sed -n '1p')
AGENT_ID=$(echo "$PARSED" | sed -n '2p')
LAST_MSG=$(echo "$PARSED" | sed -n '3p')
CWD_VAL=$(echo "$PARSED" | sed -n '4p')

DATE=$(date '+%Y-%m-%d %H:%M')
BRANCH=$(git branch --show-current 2>/dev/null)
AULA=""
case "$BRANCH" in
  *cirrose*)     AULA="cirrose" ;;
  *metanalise*)  AULA="metanalise" ;;
  *grade*)       AULA="grade" ;;
  *osteo*)       AULA="osteoporose" ;;
  *)             AULA="unknown" ;;
esac

# Skip if no valid aula
if [ "$AULA" = "unknown" ] || [ ! -d "${CWD_VAL:-.}/aulas/$AULA" ]; then
    exit 0
fi

NOTES="${CWD_VAL:-.}/aulas/$AULA/NOTES.md"

# Infer status from last message content
LOWER_MSG=$(echo "$LAST_MSG" | tr '[:upper:]' '[:lower:]')
STATUS="PARTIAL"
if echo "$LOWER_MSG" | grep -qE "fail|erro|error|cannot|unable|not found|exception"; then
    STATUS="FAIL"
elif echo "$LOWER_MSG" | grep -qE "complet|done|finish|ok\b|pass|succes|conclu"; then
    STATUS="PASS"
fi

# Create NOTES.md if it doesn't exist
if [ ! -f "$NOTES" ]; then
    printf "# NOTES — %s\n\n" "$AULA" > "$NOTES"
fi

printf "\n[%s] [%s:%s] — concluído. Status: %s\n" "$DATE" "$AGENT_TYPE" "$AGENT_ID" "$STATUS" >> "$NOTES"

exit 0

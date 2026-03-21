#!/usr/bin/env bash
# Safety Gate: Block edits to shared/ unless on main branch
# Pure bash — no node dependency.

set -euo pipefail

INPUT=$(cat 2>/dev/null || echo '{}')

# Extract file_path from JSON without node/jq
FILE=$(echo "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"file_path"[[:space:]]*:[[:space:]]*"//;s/"$//')

# Only care about shared/ files
if ! echo "$FILE" | grep -qi '/shared/'; then
  exit 0
fi

# Allow on main branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  echo '{"systemMessage": "AVISO: Editando shared/ em main. Certifique que e intencional."}'
  exit 0
fi

echo "BLOCKED: shared/ is READ-ONLY in branch '$BRANCH'. Edits to shared/ must happen on main." >&2
exit 2

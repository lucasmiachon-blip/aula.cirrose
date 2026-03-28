#!/usr/bin/env bash
# SessionStart: Lightweight init for every session (not just compact)
# Risk: none (read-only, non-blocking)

set -euo pipefail

echo "=== SESSION INIT ==="
echo "Branch: $(git branch --show-current 2>/dev/null || echo detached)"
DIRTY_COUNT=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
echo "Dirty files: $DIRTY_COUNT"
echo "Hooks: $(ls .claude/hooks/*.sh 2>/dev/null | wc -l | tr -d ' ') active"
echo "Routing: /evidence (quick) | /medical-researcher (deep) | /review (audit) | /new-slide (create)"

# MCP env check (most common failure = missing API key)
MISSING=""
for var in NCBI_API_KEY PERPLEXITY_API_KEY NOTION_TOKEN; do
  if [ -z "${!var:-}" ]; then
    MISSING="$MISSING $var"
  fi
done
if [ -n "$MISSING" ]; then
  echo "WARN: MCP env missing:$MISSING"
fi

echo "=== END INIT ==="

exit 0

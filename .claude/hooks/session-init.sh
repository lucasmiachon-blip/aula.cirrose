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
echo "=== END INIT ==="

exit 0

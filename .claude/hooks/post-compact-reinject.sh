#!/usr/bin/env bash
# Post-compact context reinject — ensures critical state survives compaction
# Runs on SessionStart (matcher: compact)
# Risk: none (read-only, non-blocking)

set -euo pipefail

echo "=== POST-COMPACT: Critical context reinject ==="
echo ""

# Current branch and recent commits
echo "--- Git State ---"
git branch --show-current 2>/dev/null || echo "(detached)"
git log --oneline -5 2>/dev/null || echo "(no commits)"
echo ""

# Find and show active HANDOFF (most recently modified)
echo "--- Active HANDOFF (first 55 lines) ---"
HANDOFF=""
LATEST_TS=0
for f in aulas/*/HANDOFF.md; do
  if [ -f "$f" ]; then
    TS=$(stat -c '%Y' "$f" 2>/dev/null || stat -f '%m' "$f" 2>/dev/null || echo 0)
    if [ "$TS" -gt "$LATEST_TS" ] 2>/dev/null; then
      LATEST_TS="$TS"
      HANDOFF="$f"
    fi
  fi
done

if [ -n "$HANDOFF" ]; then
  head -55 "$HANDOFF"
else
  echo "(no HANDOFF.md found)"
fi

echo ""
echo "--- Active Slide Context ---"
NEXTSESS=""
for f in aulas/*/NEXT-SESSION.md; do
  [ -f "$f" ] && NEXTSESS="$f" && break
done
if [ -n "$NEXTSESS" ]; then
  head -5 "$NEXTSESS"
  echo "  (full context: $NEXTSESS)"
else
  echo "(no NEXT-SESSION.md — no slide in active QA)"
fi

echo ""
echo "--- Recent Lessons (last 15 lines) ---"
tail -15 docs/lessons.md 2>/dev/null || echo "(no lessons.md)"

echo ""
echo "--- Dirty State ---"
DIRTY=$(git status --short 2>/dev/null | head -10)
if [ -n "$DIRTY" ]; then
  echo "$DIRTY"
else
  echo "(clean)"
fi

echo ""
echo "--- Active Hooks ---"
ls .claude/hooks/*.sh 2>/dev/null | while read f; do basename "$f"; done

echo ""
echo "--- Routing ---"
echo "/evidence (quick) | /medical-researcher (deep) | /review (audit) | /new-slide (create)"

echo ""
echo "=== END POST-COMPACT ==="

exit 0

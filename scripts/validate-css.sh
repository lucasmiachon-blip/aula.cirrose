#!/usr/bin/env bash
# validate-css.sh — Detect CSS cascade conflicts
# Usage: bash scripts/validate-css.sh [aula] (default: cirrose)
#
# Checks:
# 1. Duplicate bare selectors across CSS files (same specificity, different files)
# 2. !important usage outside .no-js / .stage-bad / @media print
# 3. Import order in index.template.html matches expected cascade

set -euo pipefail

AULA="${1:-cirrose}"
DIR="aulas/$AULA"
FAIL=0
WARN=0

echo "=== CSS Cascade Validator — $AULA ==="
echo ""

# --- Check 1: Import order in template ---
echo "--- [1] Import order in index.template.html ---"
TEMPLATE="$DIR/index.template.html"
if [ -f "$TEMPLATE" ]; then
  # Extract CSS import lines (preserve order)
  IMPORTS=$(grep -n "import '.*\.css'" "$TEMPLATE" | sed "s/.*import '\(.*\)'.*/\1/")
  EXPECTED_ORDER="./cirrose.css"

  if [ "$IMPORTS" = "$EXPECTED_ORDER" ]; then
    echo "  PASS: single-file (cirrose.css)"
  else
    echo "  FAIL: Import order is wrong!"
    echo "  Expected: cirrose.css only"
    echo "  Got:"
    echo "$IMPORTS" | sed 's/^/    /'
    FAIL=$((FAIL + 1))
  fi
else
  echo "  SKIP: $TEMPLATE not found"
fi
echo ""

# --- Check 2: Shared bare selectors across CSS files ---
echo "--- [2] Shared bare selectors (potential cascade conflicts) ---"

CSS_FILES=()
for f in "$DIR/cirrose.css" "$DIR/$AULA.css"; do
  [ -f "$f" ] && CSS_FILES+=("$f")
done

if [ ${#CSS_FILES[@]} -ge 2 ]; then
  # Extract bare class selectors from each CSS file
  # Format: filename<TAB>selector
  for file in "${CSS_FILES[@]}"; do
    grep -oE '^\.[a-zA-Z][a-zA-Z0-9_-]*' "$file" | sort -u | while read -r sel; do
      printf "%s\t%s\n" "$(basename "$file")" "$sel"
    done
  done | awk -F'\t' '{
    file = $1; sel = $2
    if (sel != "") {
      if (seen[sel] && seen[sel] != file) {
        printf "  WARN: \"%s\" defined in %s AND %s\n", sel, seen[sel], file
        warn++
      }
      seen[sel] = file
    }
  }
  END { if (warn == 0) print "  PASS: No bare selector conflicts found" }'
else
  echo "  SKIP: Less than 2 CSS files found"
fi
echo ""

# --- Check 3: !important outside allowed contexts ---
echo "--- [3] !important audit ---"
IMPORTANT_ISSUES=0

for file in "${CSS_FILES[@]}"; do
  # Find !important lines, exclude .no-js / .stage-bad / @media print blocks
  # Simple heuristic: check if the selector line contains .no-js or .stage-bad
  grep -n '!important' "$file" 2>/dev/null | grep -v '^\s*/\*\|^\s*\*\|^\s*//' | while IFS= read -r line; do
    linenum=$(echo "$line" | cut -d: -f1)
    # Check surrounding context (20 lines before for @media blocks)
    context=$(sed -n "$((linenum > 20 ? linenum - 20 : 1)),${linenum}p" "$file")
    if echo "$context" | grep -qE '\.no-js|\.stage-bad|@media\s+print|@media.*prefers-reduced-motion|\.high-contrast|\.qa-mode|\?qa=1'; then
      : # allowed context
    else
      echo "  WARN: $(basename "$file"):$linenum — !important outside allowed context"
      echo "    $line"
    fi
  done
done
echo ""

# --- Check 4: Inline style with opacity/display/visibility in slide HTML ---
echo "--- [4] Inline style audit (slides) ---"
SLIDES_DIR="$DIR/slides"
if [ -d "$SLIDES_DIR" ]; then
  INLINE_COUNT=$(grep -rl 'style="[^"]*\(opacity\|display\|visibility\)' "$SLIDES_DIR"/*.html 2>/dev/null | wc -l || echo 0)
  echo "  INFO: $INLINE_COUNT slide files have inline opacity/display/visibility"
  if [ "$INLINE_COUNT" -gt 0 ]; then
    grep -l 'style="[^"]*\(opacity\|display\|visibility\)' "$SLIDES_DIR"/*.html 2>/dev/null | while read -r f; do
      count=$(grep -c 'style="[^"]*\(opacity\|display\|visibility\)' "$f" || echo 0)
      echo "    $(basename "$f"): $count inline style(s) — expected for GSAP"
    done
  fi
else
  echo "  SKIP: $SLIDES_DIR not found"
fi
echo ""

# --- Summary ---
echo "=== Summary ==="
echo "  FAIL: $FAIL"
echo "  WARN: $WARN"
if [ "$FAIL" -gt 0 ]; then
  echo "  STATUS: FAIL"
  exit 1
else
  echo "  STATUS: PASS (warnings may need review)"
  exit 0
fi

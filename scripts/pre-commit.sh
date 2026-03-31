#!/usr/bin/env bash
# Pre-commit: (1) guard Classe C on main, (2) guard shared/ on WTs,
#             (3) slide-count regression gate, (4) slide integrity,
#             (5) guard Classe A/B on WTs, then lint on change.
# Called by .git/hooks/pre-commit. Versionado no repo.
set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

# ── Guard 3: Slide-count regression gate ──
# After merges, verify slide count didn't decrease. Catches silent rollbacks.
# Each aula declares expected count in _manifest.js (grep for 'id:' entries).
if [ "$BRANCH" != "main" ]; then
  AULA=""
  case "$BRANCH" in
    *cirrose*) AULA="cirrose" ;;
  esac

  if [ -n "$AULA" ]; then
    MANIFEST="aulas/$AULA/slides/_manifest.js"
    if [ -f "$MANIFEST" ]; then
      EXPECTED=$(grep -c "id:" "$MANIFEST" 2>/dev/null || echo "0")
      SLIDE_DIR="aulas/$AULA/slides"
      ACTUAL=$(find "$SLIDE_DIR" -name '*.html' -not -name '_*' 2>/dev/null | wc -l | tr -d ' ')

      if [ "$ACTUAL" -lt "$EXPECTED" ]; then
        echo ""
        echo "╔══════════════════════════════════════════════════════════╗"
        echo "║  ALERTA: Possível rollback de slides!                   ║"
        echo "║  Slides em disco ($ACTUAL) < manifest ($EXPECTED).      ║"
        echo "║  Verifique se um merge não sobrescreveu slides.         ║"
        echo "╚══════════════════════════════════════════════════════════╝"
        echo ""
        echo "  Aula: $AULA"
        echo "  Manifest espera: $EXPECTED slides"
        echo "  Em disco: $ACTUAL slides"
        echo ""
        echo "  Se intencional: ALLOW_SLIDE_LOSS=1 git commit"
        if [ -z "$ALLOW_SLIDE_LOSS" ]; then
          exit 1
        fi
      fi
    fi
  fi
fi

# ── Guard 4: Slide integrity — build must run after content changes ──
# If slide HTMLs changed but .slide-integrity didn't, the build was skipped.
# This catches cases where a merge changed slides but nobody ran build:cirrose.
if [ "$BRANCH" != "main" ]; then
  SLIDES_STAGED=$(git diff --cached --name-only | grep -E 'aulas/.*/slides/.*\.html$' || true)
  INTEGRITY_STAGED=$(git diff --cached --name-only | grep -E '\.slide-integrity$' || true)

  if [ -n "$SLIDES_STAGED" ] && [ -z "$INTEGRITY_STAGED" ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  AVISO: Slides mudaram mas build nao rodou!             ║"
    echo "║  Rode 'npm run build:cirrose' para atualizar            ║"
    echo "║  o fingerprint .slide-integrity.                        ║"
    echo "║  Bypass: ALLOW_NO_BUILD=1 git commit                   ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "Slides alterados sem rebuild:"
    echo "$SLIDES_STAGED" | sed 's/^/  → /'
    echo ""
    if [ -z "$ALLOW_NO_BUILD" ]; then
      exit 1
    fi
  fi
fi

# ── Guard 6: Ghost content canary ──
# Blocks commits containing known obsolete content patterns.
# Patterns declared in aulas/*/.ghost-canary (extensible).
# Bypass: ALLOW_GHOST_ROLLBACK=1 git commit (DANGEROUS — name is intentional)
if [ -z "$ALLOW_GHOST_ROLLBACK" ]; then
  GHOST_FAIL=""
  for CANARY_FILE in aulas/*/.ghost-canary; do
    [ -f "$CANARY_FILE" ] || continue
    AULA_DIR=$(dirname "$CANARY_FILE")
    while IFS= read -r line; do
      # Skip comments and empty lines
      case "$line" in \#*|"") continue ;; esac
      GHOST_FILE=$(echo "$line" | cut -d'|' -f1)
      GHOST_PATTERN=$(echo "$line" | cut -d'|' -f2-)
      STAGED_PATH="$AULA_DIR/slides/$GHOST_FILE"
      # Only check if this file is staged
      if git diff --cached --name-only | grep -qF "$STAGED_PATH"; then
        if git show ":$STAGED_PATH" 2>/dev/null | grep -qE "$GHOST_PATTERN"; then
          GHOST_FAIL="${GHOST_FAIL}  → ${STAGED_PATH} matches '${GHOST_PATTERN}'\n"
        fi
      fi
    done < "$CANARY_FILE"
  done

  if [ -n "$GHOST_FAIL" ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║  BLOQUEADO: Conteúdo fantasma detectado!                ║"
    echo "║  Slide staged contém padrão obsoleto listado em         ║"
    echo "║  .ghost-canary. Isso indica rollback acidental.         ║"
    echo "║  Bypass: ALLOW_GHOST_ROLLBACK=1 git commit (PERIGOSO)  ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    echo "Matches:"
    printf "$GHOST_FAIL"
    echo ""
    exit 1
  fi
fi

# ── Lints ──
SLIDES_CHANGED=$(git diff --cached --name-only | grep -E 'aulas/.*/slides/.*\.html$' || true)
CASE_OR_MANIFEST=$(git diff --cached --name-only | grep -E '(CASE\.md|_manifest\.js)$' || true)

if [ -n "$SLIDES_CHANGED" ]; then
  echo "→ lint:slides (slides modificados detectados)..."
  npm run lint:slides
fi

if [ -n "$CASE_OR_MANIFEST" ]; then
  echo "→ lint:case-sync (CASE.md ou _manifest.js modificados)..."
  npm run lint:case-sync
fi

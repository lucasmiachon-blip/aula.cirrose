#!/usr/bin/env bash
# guard-product-files.sh — BLOCK (exit 2) edits to product files, forcing human confirmation.
# PreToolUse: Write|Edit|StrReplace
# Motivation: ERRO-053 (QA pipeline bypassed), ERRO-049 (approved elements removed)

set -u

# SPRINT_MODE=1 downgrades BLOCK to WARN (deadline sprints)
# Restore strict mode after deadline: unset SPRINT_MODE
SPRINT_MODE="${SPRINT_MODE:-0}"

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

# Fallback: some tools use "path" instead of "file_path"
if [ -z "$FILE_PATH" ]; then
  FILE_PATH=$(echo "$INPUT" | sed -n 's/.*"path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
fi

# No path found — allow (not a file operation we care about)
if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Normalize backslashes to forward slashes (Windows paths)
FILE_PATH=$(echo "$FILE_PATH" | tr '\\' '/' | sed 's|//|/|g')

# Product file patterns
if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/slides/[^/]+\.html$'; then
  if [ "$SPRINT_MODE" = "1" ]; then
    echo "AVISO: editando arquivo de produto $FILE_PATH (sprint mode)" >&2
    exit 0
  fi
  echo "BLOQUEADO: arquivo de produto $FILE_PATH" >&2
  exit 2
fi

if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/(cirrose|archetypes)\.css$'; then
  if [ "$SPRINT_MODE" = "1" ]; then
    echo "AVISO: editando arquivo de produto $FILE_PATH (sprint mode)" >&2
    exit 0
  fi
  echo "BLOQUEADO: arquivo de produto $FILE_PATH" >&2
  exit 2
fi

if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/shared/css/base\.css$'; then
  if [ "$SPRINT_MODE" = "1" ]; then
    echo "AVISO: editando arquivo de produto $FILE_PATH (sprint mode)" >&2
    exit 0
  fi
  echo "BLOQUEADO: arquivo de produto $FILE_PATH" >&2
  exit 2
fi

if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/shared/js/[^/]+\.js$'; then
  if [ "$SPRINT_MODE" = "1" ]; then
    echo "AVISO: editando arquivo de produto $FILE_PATH (sprint mode)" >&2
    exit 0
  fi
  echo "BLOQUEADO: arquivo de produto $FILE_PATH" >&2
  exit 2
fi

if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/slide-registry\.js$'; then
  if [ "$SPRINT_MODE" = "1" ]; then
    echo "AVISO: editando arquivo de produto $FILE_PATH (sprint mode)" >&2
    exit 0
  fi
  echo "BLOQUEADO: arquivo de produto $FILE_PATH" >&2
  exit 2
fi

if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/index\.html$'; then
  if [ "$SPRINT_MODE" = "1" ]; then
    echo "AVISO: editando arquivo de produto $FILE_PATH (sprint mode)" >&2
    exit 0
  fi
  echo "BLOQUEADO: arquivo de produto $FILE_PATH" >&2
  exit 2
fi

# Not a product file — allow silently
exit 0
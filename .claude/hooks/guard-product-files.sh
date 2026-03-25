#!/usr/bin/env bash
# guard-product-files.sh — BLOCK (exit 2) edits to product files, forcing human confirmation.
# PreToolUse: Write|Edit|StrReplace
# Motivation: ERRO-053 (QA pipeline bypassed), ERRO-049 (approved elements removed)

set -u

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
FILE_PATH=$(echo "$FILE_PATH" | tr '\\' '/')

# Product file patterns
if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/slides/[^/]+\.html$'; then
  echo "⚠ Arquivo de produto: $FILE_PATH. Confirme antes de editar." >&2
  exit 2
fi

if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/(cirrose|archetypes)\.css$'; then
  echo "⚠ Arquivo de produto: $FILE_PATH. Confirme antes de editar." >&2
  exit 2
fi

if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/shared/css/base\.css$'; then
  echo "⚠ Arquivo de produto: $FILE_PATH. Confirme antes de editar." >&2
  exit 2
fi

if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/shared/js/[^/]+\.js$'; then
  echo "⚠ Arquivo de produto: $FILE_PATH. Confirme antes de editar." >&2
  exit 2
fi

if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/slide-registry\.js$'; then
  echo "⚠ Arquivo de produto: $FILE_PATH. Confirme antes de editar." >&2
  exit 2
fi

if echo "$FILE_PATH" | grep -qE '(^|/)aulas/cirrose/index\.html$'; then
  echo "⚠ Arquivo de produto: $FILE_PATH. Confirme antes de editar." >&2
  exit 2
fi

# Not a product file — allow silently
exit 0

#!/usr/bin/env bash
# Instala git pre-commit hook local.
# Rodar uma vez após clonar o repo: bash scripts/install-hooks.sh

set -e

HOOK=".git/hooks/pre-commit"

cat > "$HOOK" << 'EOF'
#!/usr/bin/env bash
# Pre-commit: bloqueia commit se lint falhar.
set -e

SLIDES_CHANGED=$(git diff --cached --name-only | grep -E 'aulas/.*/slides/.*\.html$' || true)
CASE_OR_MANIFEST=$(git diff --cached --name-only | grep -E '(CASE\.md|_manifest\.js)$' || true)

# lint:slides — se slides HTML mudaram
if [ -n "$SLIDES_CHANGED" ]; then
  echo "→ lint:slides (slides modificados detectados)..."
  npm run lint:slides
fi

# lint:case-sync — se CASE.md ou _manifest.js mudaram
if [ -n "$CASE_OR_MANIFEST" ]; then
  echo "→ lint:case-sync (CASE.md ou _manifest.js modificados)..."
  npm run lint:case-sync
fi
EOF

chmod +x "$HOOK"
echo "✓ pre-commit hook instalado em $HOOK"

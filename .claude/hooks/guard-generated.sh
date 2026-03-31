#!/usr/bin/env bash
# PreToolUse: Block writes to generated index.html files
# index.html is built by npm run build:{aula} from _manifest.js + template.
# Direct edits are overwritten on next build = lost work.
# Exit 2 = BLOCK (not just warn).

INPUT=$(cat 2>/dev/null || echo '{}')

FILE_PATH=$(echo "$INPUT" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')||'{}'); console.log(((d.tool_input||{}).file_path||'').replace(/\\\\/g,'/'));" 2>/dev/null)

# Only block aulas/*/index.html (generated files)
if [[ "$FILE_PATH" == *"aulas/"*"/index.html" ]]; then
    printf '{"error": "BLOQUEADO: index.html e gerado por npm run build:{aula}. Editar slides/*.html ou index.template.html, depois rodar build."}\n'
    exit 2
fi

exit 0

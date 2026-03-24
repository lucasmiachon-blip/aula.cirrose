---
name: export
version: 1.0.0
context: fork
description: Exporta slides para PDF e screenshots usando DeckTape. Use quando o usuário pedir "exportar", "gerar PDF", "export slides", "screenshots do deck". Requer servidor rodando.
disable-model-invocation: true
argument-hint: "[lecture]"
allowed-tools: Bash(npm *), Bash(npx *), Bash(kill *), Bash(sleep *)
---

# Export Slides

Exporta `$ARGUMENTS` para PDF + screenshots. Exemplo: `/export cirrose`

## WARN: deck.js

DeckTape `reveal` plugin NAO funciona com deck.js. Usar:
- DeckTape com `--slides` manual (flag `generic` plugin), ou
- Playwright screenshot loop (preferido — ver `qa-batch-screenshot.mjs` como referencia)

## Passos (deck.js)

1. Build: `npm run build:$ARGUMENTS`
2. Preview server: `npx serve . -l 4173 &` → `sleep 2`
3. Playwright screenshot loop:
   ```bash
   node aulas/$ARGUMENTS/scripts/qa-batch-screenshot.mjs
   ```
4. Para PDF: combinar screenshots com ImageMagick ou ferramenta equivalente
5. Matar servidor: `kill $(lsof -t -i:4173)`

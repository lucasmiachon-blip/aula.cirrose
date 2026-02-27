# Protocolo ZIP Limpo — Aulas Magnas

> Alinhado a Aulas_core. ZIP otimizado para leitura por IA (Gemini, Claude.ai, ChatGPT).

## Por que ZIP Limpo?

Quando você envia um .zip para uma IA, a plataforma descompacta e tenta ler os arquivos como texto. Se o ZIP contiver:
- **node_modules/** (milhares de arquivos) → timeout
- **Imagens binárias** (.png, .jpg em assets) → travam o leitor
- **Fontes** (.woff2, .woff) → caracteres ilegíveis
- **PDF + ZIP** na mesma mensagem → sobrecarga

O **ZIP limpo** inclui apenas código e screenshots PNG (resultado visual), excluindo binários pesados.

## Uso

```powershell
npm run zip:ia                    # Todas as aulas (cirrose, grade, metanalise)
.\scripts\build-zip-limpo-ia.ps1 cirrose   # Só Cirrose
.\scripts\build-zip-limpo-ia.ps1 grade     # Só GRADE
.\scripts\build-zip-limpo-ia.ps1 all       # Todas (default)
```

## Output

- **Todos:** `exports/aulas-magnas-ia-YYYYMMDD.zip`
- **Uma aula:** `exports/aulas-magnas-cirrose-ia-YYYYMMDD.zip`

## Conteúdo

| Inclui | Exclui |
|--------|--------|
| aulas/{aula}/*.html, *.css, slides/ | node_modules/ |
| shared/css, shared/js | dist/ |
| screenshots PNG (exports/screenshots ou qa-screenshots) | *.woff2, *.woff |
| HANDOFF.md, CLAUDE.md, docs | assets (imagens de conteúdo) |
| | *.pdf, *.pptx |

## Screenshots

- **Fonte 1:** `exports/screenshots/{aula}/` (gerado por `npm run export:screenshots`)
- **Fonte 2 (cirrose):** `qa-screenshots/stage-c/` (gerado por QA scripts)

## Referência

- **Aulas_core:** `scripts/build-zip-limpo-ia.ps1`, `scripts/build-zip-grade.ps1`
- **CHANGELOG Aulas_core:** 2026-02-26 — ZIP limpo IA + exports centralizados

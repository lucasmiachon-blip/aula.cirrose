# HANDOFF — Projeto Aulas Magnas (atualizado 2026-02-27)

## Estado geral

| Aula | Slides HTML | QA Visual | Status |
|------|-------------|-----------|--------|
| **Cirrose** | 28/28 (20 core + 8 APP) | ✅ 24/fev — 28/28 OK | HTML completo, speaker notes PT pendente |
| **Meta-análise** | 0/16 | — | Blueprint v2 no Notion, sem HTML |
| **GRADE** | 5/58 (Batch 1) | — | Migração Aulas_core em curso |

## GRADE — Último estado (2026-02-26)

- **Arquivos:** `aulas/grade/slides/*.html` (5 arquivos modulares, ordem S01 S02 S05 S06 S03)
- **Build:** `npm run build:grade` → gera `index.html` a partir de `_manifest.js` + template
- **Manifest:** `slides/_manifest.js` (source of truth)
- **CSS:** `grade.css` + `archetypes.css` (copiado de cirrose)
- **Ver:** `aulas/grade/HANDOFF.md`

## Cirrose — Último estado

- **Arquivos:** `aulas/cirrose/slides/*.html` (28 arquivos modulares)
- **Build:** `npm run build:cirrose` → gera `index.html` a partir de `_manifest.js` + template
- **Manifest:** `slides/_manifest.js` (source of truth para ordem e panel states)
- **Wiring:** `slide-registry.js` (custom anims, panel, click-reveal, meld)
- **Sections:** 28 (20 core + 8 APP)
- **QA Visual:** 28/28 screenshots OK (24/fev). Média 2.7/5.0 — redesign slide-a-slide pendente.
- **CSS:** `cirrose.css` + `archetypes.css` (consolidado FASE 2)
- **Refatoração:** FASE 0-4 concluídas (27/fev). Ver `aulas/cirrose/HANDOFF.md` para detalhes.

## MCPs acadêmicos (2026-02-26)

| MCP | Custo | Variável .env |
|-----|-------|---------------|
| semantic-scholar | Grátis (opcional key) | `SEMANTIC_SCHOLAR_API_KEY` |
| arxiv | Grátis | — |
| google-scholar | Grátis (experimental) | — |
| perplexity | Pago | `PERPLEXITY_API_KEY` |
| Scite | Pago (Premium) | OAuth na 1ª conexão |

Ver `docs/MCP-ENV-VARS.md` para variáveis necessárias.

## ZIP Limpo (protocolo IA)

- **Script:** `scripts/build-zip-limpo-ia.ps1` — alinhado a Aulas_core
- **Uso:** `npm run zip:ia` ou `.\scripts\build-zip-limpo-ia.ps1 [cirrose|grade|metanalise|all]`
- **Output:** `exports/aulas-magnas-ia-YYYYMMDD.zip`
- **Inclui:** código + screenshots PNG. **Exclui:** node_modules, dist, fontes, imagens pesadas

## Pendências globais

1. Speaker notes: converter EN → PT em todos os 28 slides
2. References DB: 15 refs pendentes de popular no Notion
3. Slides DB: sincronizar pipeline status (muitos ainda em `draft` ou `html-ready` — deveriam ser `qa-passed`)
4. Ghost text em transições: avaliar `transition: none` ou workaround
5. Meta-análise: iniciar implementação HTML
6. GRADE: 53 slides restantes (Batch 2+)

## Notion

`docs/SYNC-NOTION-REPO.md`

---
*Atualizado 27/02/2026 — refatoração FASE 0-4. Deletados: CONFLITOS-CIRROSE-BATCHES.md, PLANO-CIRROSE-BATCHES.md (obsoletos).*

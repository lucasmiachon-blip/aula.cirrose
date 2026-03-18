# HANDOFF — Claude.ai (colar no Project Knowledge)

> Cirrose · enxuto · Atualizado: 2026-03-17

---

## Estado atual

- **Slides:** 44 buildados (44/44 CONTENT ou acima, zero DRAFT)
- **Build:** `npm run build:cirrose` OK
- **Lint:** `npm run lint:slides` + case-sync + narrative-sync = PASS
- **Erros:** 35/35 corrigidos, 0 pendentes
- **Branch:** `feat/cirrose-mvp` (WT em `C:\Dev\Projetos\wt-cirrose`)
- **Main:** NAO absorver no momento. Ultimo merge: bfb3268 (2026-03-17). Push quando seguro.
- **QA:** 1 DONE (s-a1-classify), 3 LINT-PASS, 40 CONTENT. Proximo: s-title QA.

---

## Caminho critico

1. **P0:** QA visual slide a slide — WT-OPERATING.md secao 4 (5-stage com Gemini multimodal)
2. **P1:** QA deck-level (cross-slide Gemini) apos ato completo
3. **Backlog:** h2 assertivo fib4, [TBD SOURCE] x4 em notes, PDF export

---

## Paths

| Doc | Path |
|-----|------|
| **Prompt operacional** | `aulas/cirrose/WT-OPERATING.md` (ler no inicio de TODA sessao) |
| Pendencias projeto | `aulas/cirrose/HANDOFF.md` |
| Changelog | `aulas/cirrose/CHANGELOG.md` |
| Erros + regras | `aulas/cirrose/ERROR-LOG.md` |
| Audit visual | `aulas/cirrose/AUDIT-VISUAL.md` |
| QA tooling (ref) | `aulas/cirrose/QA-WORKFLOW.md` — **deprecated:** processo QA atual em `WT-OPERATING.md` secao 4 |
| Dados paciente | `aulas/cirrose/references/CASE.md` |
| Trials/PMIDs | `aulas/cirrose/references/evidence-db.md` |
| Arco narrativo | `aulas/cirrose/references/narrative.md` |
| Ordem slides | `aulas/cirrose/slides/_manifest.js` |

---

## Comandos

`npm run dev` · `npm run build:cirrose` · `npm run lint:slides` · `npm run done:cirrose:strict`

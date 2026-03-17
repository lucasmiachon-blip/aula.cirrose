# HANDOFF — Claude.ai (colar no Project Knowledge)

> Cirrose · enxuto · Atualizado: 2026-03-17

---

## Estado atual

- **Slides:** 44 buildados (10 Act 1 + 16 Act 2 + 7 Act 3 + 3 CP + 2 pre/close + 8 appendix)
- **Build:** `npm run build:cirrose` OK
- **Lint:** `npm run lint:slides` + case-sync + narrative-sync = PASS
- **Erros:** 35/35 corrigidos, 0 pendentes
- **Branch:** `feat/cirrose-mvp` (WT em `C:\Dev\Projetos\wt-cirrose`)
- **Main:** NAO absorver no momento. Ultimo merge: bfb3268 (2026-03-17). Push quando seguro.

---

## Caminho critico

1. **P0:** QA Act 1 Fase 2 — per-slide audit (11 slides com screenshot, fix loop ate PASS)
2. **P1:** Fase 3 dynamic gate + Fase 4 deck-level Gemini
3. **Backlog:** QA visual Gemini, h2 assertivo fib4 (Lucas decide), PDF export

---

## Paths

| Doc | Path |
|-----|------|
| Pendencias projeto | `aulas/cirrose/HANDOFF.md` |
| Changelog | `aulas/cirrose/CHANGELOG.md` |
| Erros + regras | `aulas/cirrose/ERROR-LOG.md` |
| Audit visual | `aulas/cirrose/AUDIT-VISUAL.md` |
| Dados paciente | `aulas/cirrose/references/CASE.md` |
| Trials/PMIDs | `aulas/cirrose/references/evidence-db.md` |
| Arco narrativo | `aulas/cirrose/references/narrative.md` |
| Ordem slides | `aulas/cirrose/slides/_manifest.js` |
| Hook | `slides/01-hook.html`, `slide-registry.js`, `cirrose.css` |
| Init | `index.template.html` (wireAll antes anim.connect) |

---

## Comandos

`npm run dev` · `npm run build:cirrose` · `npm run lint:slides` · `npm run done:cirrose:strict`

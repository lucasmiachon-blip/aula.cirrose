# HANDOFF — Claude.ai (colar no Project Knowledge)

> Cirrose · enxuto · Atualizado: 2026-03-14

---

## Estado atual

- **Slides:** 44 buildados (10 Act 1 + 16 Act 2 + 7 Act 3 + 3 CP + 2 pre/close + 8 appendix)
- **Build:** `npm run build:cirrose` OK
- **Lint:** `npm run lint:slides` + case-sync + narrative-sync = PASS
- **Erros:** 33/33 corrigidos, 0 pendentes
- **Branch:** `feat/cirrose-mvp` (WT em `C:\Dev\Projetos\wt-cirrose`)
- **Main sync:** b771579 (2026-03-14), 0 commits behind

---

## Caminho critico

1. **P0:** Conteudo + interacoes + CSS slide a slide (Act 1 done, Act 2/3 pendente)
2. **P1:** Preencher 4 skeletons Act 3 (s-a3-01, s-a3-03, s-a3-04, s-a3-07)
3. **Backlog:** QA visual Gemini, h2 assertivos (Lucas decide no browser), PDF export

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

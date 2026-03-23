# HANDOFF — Claude.ai (colar no Project Knowledge)

> Cirrose · enxuto · Atualizado: 2026-03-22

---

## Estado atual

- **Slides:** 44 buildados (44/44 CONTENT ou acima, zero DRAFT)
- **Build:** `npm run build:cirrose` OK
- **Lint:** `npm run lint:slides` + case-sync + narrative-sync = PASS
- **Erros:** 45 registrados, 44 corrigidos, 1 processo (E42)
- **Branch:** `feat/cirrose-mvp` (standalone em `C:\Dev\Projetos\wt-cirrose`)
- **Standalone:** shared/ internalizado em `aulas/cirrose/shared/` (2026-03-22). Sem worktree protocol, sem Class A/B/C.
- **QA Pipeline:** 3 DONE (s-title, s-hook, s-a1-01), 1 QA (s-a1-classify Gate 4 R1), 40 CONTENT

---

## QA Pipeline detalhado

| Slide | Estado | Notas |
|-------|--------|-------|
| s-title | DONE | QA 5-stage PASS. Gemini 9/10. |
| s-hook | DONE | v17. QA 5-stage PASS. Gemini R3 applied. |
| s-a1-01 | QA (R11) | Ghost Rows + scanner line + case-panel hide. Pendente: QA.2 screenshots + QA.3 Gemini. |
| s-a1-classify | LINT-PASS | Precisa QA 5-stage completo. |
| 40 restantes | CONTENT | Conteudo completo, aguardando QA pipeline. |

### s-a1-01 evolucao de formato (painel direito)

- R0-R4: Paper card + Flip badge (KILLED)
- R5-R7: Em-dash stacked list (usuario nao gostou)
- R8-R10: Pill tags (usuario aprovou formato)
- R11: Ghost Rows (Gemini Option D) — status-dot + row-text + teal wash on match

Layout: CSS Grid 6fr:4fr. Bloomberg hero (Instrument Serif 140-220px). Reactive metrics on countUp >= 70. SplitText headline. Scanner line diagnostic sweep.

---

## Caminho critico

1. **P0:** Visual check s-a1-01 Ghost Rows → QA.2 screenshots → QA.3 Gemini R11
2. **P1:** s-a1-classify QA 5-stage pipeline
3. **P2:** Restantes Act 1 (s-a1-vote → s-cp1) slide a slide
4. **Backlog:** h2 assertivo fib4, [TBD SOURCE] x4 em notes, PDF export

---

## Prompt Gemini QA.3

- **Script:** `aulas/cirrose/scripts/gemini-qa3.mjs`
- **Modelo:** gemini-3.1-pro-preview (SEMPRE)
- **Template:** `docs/prompts/gemini-slide-editor.md` v6.1
- **E42:** Script le HTML/CSS/JS dinamicamente dos arquivos fonte. NUNCA hardcodar codigo no prompt.
- **Uso:** `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-01 --round 11`
- **Custo medio:** ~$0.03-0.08 por round (input ~5k tokens + video/PNGs)

---

## Paths

| Doc | Path |
|-----|------|
| **Prompt operacional** | `aulas/cirrose/WT-OPERATING.md` (ler no inicio de TODA sessao) |
| Pendencias projeto | `aulas/cirrose/HANDOFF.md` |
| Changelog | `aulas/cirrose/CHANGELOG.md` |
| Erros + regras | `aulas/cirrose/ERROR-LOG.md` |
| Audit visual | `aulas/cirrose/AUDIT-VISUAL.md` |
| Dados paciente | `aulas/cirrose/references/CASE.md` |
| Trials/PMIDs | `aulas/cirrose/references/evidence-db.md` |
| Arco narrativo | `aulas/cirrose/references/narrative.md` |
| Ordem slides | `aulas/cirrose/slides/_manifest.js` |
| Design tokens | `.claude/rules/design-system.md` |
| CSS errors | `.claude/rules/css-errors.md` |
| Lessons | `tasks/lessons.md` |

---

## Comandos

`npm run dev` · `npm run build:cirrose` · `npm run lint:slides` · `npm run done:cirrose:strict`

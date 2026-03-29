# CLAUDE.md — Aula Cirrose

> Fonte de verdade operacional. Repo single-aula (split de monorepo 2026-03-24).
> Regras detalhadas: @.claude/rules/*.md

## Commands

```bash
npm run dev               # Vite hot reload (port 3000)
npm run build             # Producao
npm run build:cirrose     # Concatena slides → aulas/cirrose/index.html via aulas/cirrose/slides/_manifest.js
npm run preview           # Servir localmente (palco)
npm run lint:slides       # Assertion-evidence linter
npm run lint:case-sync    # aulas/cirrose/references/CASE.md ↔ aulas/cirrose/slides/_manifest.js sync
npm run lint:narrative-sync # aulas/cirrose/references/narrative.md ↔ aulas/cirrose/slides/_manifest.js sync
```

## Stack

deck.js (`aulas/cirrose/shared/js/deck.js`, custom nav) · GSAP 3.14 · Vite 6.x · Vanilla HTML/CSS/JS · OKLCH · Zero CDN · Offline-first.

## Project

**Cirrose Hepática — Classificar · Intervir · Reverter**
43 slides · 1280×720 (Plan C) / 1920×1080 (Plan A) · Público: hepatologistas seniores (Brasil) · PT-BR, termos técnicos EN.

### Arquivos de trabalho

> Paths relativos à raiz do repo.

| Arquivo | Papel |
|---------|-------|
| `aulas/cirrose/slides/*.html` | **DEFAULT — editar estes** (44 arquivos, 1 por slide) |
| `aulas/cirrose/slides/_manifest.js` | Source of truth: ordem, archetypes, panelStates |
| `aulas/cirrose/slide-registry.js` | Wiring centralizado (custom anims, panel, click-reveal, meld) |
| `aulas/cirrose/index.template.html` | Template com `%%SLIDES%%` placeholder |
| `aulas/cirrose/index.html` | **Gerado** — `npm run build:cirrose` |
| `aulas/cirrose/cirrose.css` | Estilos específicos desta aula |
| `aulas/cirrose/archetypes.css` | Layout archetypes |
| `aulas/cirrose/shared/css/base.css` | Tokens OKLCH, tipografia, stages |
| `aulas/cirrose/shared/js/engine.js` | GSAP dispatcher + deck init |
| `aulas/cirrose/shared/js/deck.js` | Navegação vanilla |
| `aulas/cirrose/shared/js/case-panel.js` | Case panel lateral |
| `aulas/cirrose/shared/js/click-reveal.js` | Progressive disclosure por ArrowRight |

### Fluxo de edição

1. Editar `aulas/cirrose/slides/NN-nome.html`
2. `npm run build:cirrose` (gera `aulas/cirrose/index.html` via `aulas/cirrose/slides/_manifest.js` + template)
3. `npm run dev` → abrir `aulas/cirrose/index.html`

## Reference Hierarchy

| # | Arquivo | Autoridade |
|---|---------|-----------|
| 1 | `aulas/cirrose/references/CASE.md` | Dados do paciente — NUNCA duplicar |
| 2 | `aulas/cirrose/references/evidence-db.md` | Trials, PMIDs, NNTs |
| 3 | `aulas/cirrose/references/narrative.md` | Arco narrativo, pacing |
| 4 | `aulas/cirrose/slides/_manifest.js` | Ordem dos slides — NÃO reordenar sem aprovação |

Conflito: # menor vence. Notion é mirror, não source of truth.

## Hard Constraints

1. **Assertion-Evidence.** `<h2>` = afirmação clínica verificável. NUNCA rótulo genérico.
2. **ZERO `<ul>`/`<ol>` em slides.** Listas só em notes e apêndice.
3. **Todo `<section>` TEM `<aside class="notes">`** com timing e fontes. NUNCA deletar notes.
4. **var() obrigatório.** NUNCA cor literal em CSS. Exceção: `data-background-color` (HEX).
5. **Cor clínica ≠ UI.** `--safe/--warning/--danger` = clínico. `--ui-accent` = chrome.
6. **Daltonismo:** ícone obrigatório junto a cor semântica.
7. **`data-animate` declarativo.** NUNCA gsap inline. CSS fallback: `.no-js` → `opacity:1`.
8. **Zero CDN. Offline-first.**
9. **`aulas/cirrose/index.html` é gerado.** Editar `aulas/cirrose/slides/*.html` + build. Hook bloqueia Write direto.
10. **Corpo do slide <= 30 palavras.** Speaker notes em português.
11. **OKLCH padrão.** HSL proibido. Fallback HEX para WCAG.
12. **Tabelas Tufte:** sem bordas verticais, números à direita, classe `.tufte`.
13. **NUNCA inventar dados clínicos.** Sem fonte Tier 1 → `[TBD]`.
14. **CSS cascata:** `aulas/cirrose/shared/css/base.css` → `aulas/cirrose/archetypes.css` → `aulas/cirrose/cirrose.css`. NUNCA `!important` salvo 4 pré-existentes.
15. **`aulas/cirrose/shared/js/deck.js`, NÃO Reveal.js (removido do projeto).** Reordenação: `aulas/cirrose/slides/_manifest.js` + build.
16. **Branch:** `feat/cirrose-mvp`. Commits: prefixo semântico (`fix:`, `feat:`, `refactor:`, `docs:`).

## Slide Identity

> Regra completa: @.claude/rules/slide-rules.md §7

9 superfícies sincronizadas: `aulas/cirrose/slides/_manifest.js` · `<section id>` · `aulas/cirrose/slide-registry.js` · `aulas/cirrose/cirrose.css` · `aulas/cirrose/references/narrative.md` · `aulas/cirrose/references/evidence-db.md` · `aulas/cirrose/AUDIT-VISUAL.md` · `aulas/cirrose/HANDOFF.md` · `aulas/cirrose/index.html` (gerado).

- Drift da rodada → **FAIL**. Corrigir ANTES de prosseguir.
- RENAME/SPLIT/DELETE → checklist atômico das 9 superfícies. NUNCA sem aprovação.

## Workflow

### Sessão

1. **Start:** `git log --oneline -5 && git status` → ler `aulas/cirrose/HANDOFF.md` → perguntar ao usuário.
2. **Slide a slide.** Um slide por vez no QA pipeline.
3. Plan mode para tarefas >=3 steps. Subagents para pesquisa.
4. Verificar antes de declarar done: `npm run lint:slides`.
5. Handoff: código → visual = Gemini. Visual → clínico = Opus.
6. **End:** atualizar `aulas/cirrose/HANDOFF.md`. Commit + push.

### Aprendizado com erros

Erro → `aulas/cirrose/ERROR-LOG.md` → se 3x recorrente → regra em `.claude/rules/`.
Regras são reativas (52 erros reais). NUNCA criar regra por problema que aconteceu 1x.

### Guardrails

| Guard | Função | Tipo |
|-------|--------|------|
| Pre-commit | Slide-count, slide-integrity, ghost canary, lints | exit 1 |
| evidence-db hooks | Protege dados clínicos | warn |
| guard-generated | Bloqueia Write em `aulas/cirrose/index.html` | exit 2 |
| guard-product-files | Bloqueia edição slides/CSS/JS sem humano | exit 2 |

Complexidade só entra se paga o custo no mesmo dia. NUNCA abstração preventiva.

## Auditoria Visual — QA Pipeline

Pipeline completo: `aulas/cirrose/WT-OPERATING.md` §4 (máquina de estados + 6 sub-stages).
Scorecards: `aulas/cirrose/AUDIT-VISUAL.md` (14 dimensões, min 9/10).

### Sequência obrigatória (4 passos, NUNCA pular)

**Passo 1 — Screenshots + vídeo** (`qa-batch-screenshot.mjs`):
Captura PNGs S0/S2 + webm via Playwright headless. NUNCA capturar manualmente.
```bash
node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide {id} --video
```
Output: `qa-screenshots/{id}/` → PNGs + `animation-1280x720.webm` + `metrics.json`.
Re-rodar se houve mudança de HTML/CSS/JS desde última captura.

**Passo 2 — Gate 0** (binário, PASS/FAIL): 6 MUST + 3 SHOULD checks em PNGs S0/S2.
Input: PNGs do passo 1. Output: `gate0.json`. MUST FAIL bloqueia Gate 2/4.
Critérios: `docs/prompts/gemini-gate0-inspector.md`.
```bash
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --inspect                    # Gate 0
# [checkpoint Lucas — aprovar Gate 0]
```

**Passo 3 — Gate 2** (Opus Visual Audit, $0): Claude analisa PNG S2 + raw code com MCP tools.
3 camadas: A) sharp pick_color + a11y contrast, B) code analysis (E52, dead CSS, failsafes), C) visual multimodal.
MUST FAIL bloqueia Gate 4. Protocolo: `docs/prompts/gate2-opus-visual.md`.
```
# Executado conversacionalmente (MCP sharp + a11y + Read), sem script
# Output: qa-screenshots/{id}/gate2-report.md
# [checkpoint Lucas — aprovar Gate 2]
```

**Passo 4 — Gate 4** (editorial, criativo): Gemini avalia hierarquia, flow, legibilidade.
Input: raw HTML + raw CSS + raw JS + PNGs S0/S2 + video .webm (tudo do passo 1).
Gemini NUNCA edita arquivos — só produz sugestões. Spec completa: `aulas/cirrose/WT-OPERATING.md` §4 QA.3.
```bash
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --editorial --round N        # Gate 4 (requer Gate 0 + Gate 2 PASS)
```

Score < 7 → registrar problema, aguardar decisão de Lucas.

### Regras QA

- **NUNCA** capturar screenshots via Playwright MCP manual — usar `qa-batch-screenshot.mjs`.
- **NUNCA** rodar Gate 0/4 sem PNGs+webm atualizados (pós última edição).
- **NUNCA** pular passos ou inventar workarounds sem aprovação de Lucas.

## Context Window

/clear entre tasks. /compact em ~70%. Até 3 tasks por sessão.

```bash
grep -A2 "s-a2-03" aulas/cirrose/references/evidence-db.md         # dados 1 slide
sed -n '/## 2\. `archetype-metrics`/,/^## /p' aulas/cirrose/references/archetypes.md
sed -n '/### ATO 2/,/^### /p' aulas/cirrose/references/narrative.md
```

## Routing: Skills vs Agents

| Necessidade | Usar | Por que |
|-------------|------|---------|
| PMID rapido, 1 trial | `/evidence` | Light, forked, fast |
| Pesquisa profunda, multi-MCP | `/medical-researcher` | Fan-out, depth rubric, memory |
| Audit slides (read-only) | `/review` | 4-agent parallel |
| Fix slides ate perfeicao | `qa-engineer` agent | 14-dim loop, write access |
| Debris no repo | `/repo-janitor` | Read-only audit |
| Audit docs/token economy | `/docs-audit` | Links, redundancia, verbosidade |
| Criar slide novo | `/new-slide` | Template + 9 superficies |
| NotebookLM | `/nlm-skill` | CLI/MCP guide |

## Rules (loaded on demand)

- **Slide rules** (edição, identidade, CSS, motion): @.claude/rules/slide-rules.md
- **Design reference** (tokens, princípios, dados médicos): @.claude/rules/design-reference.md
- **QA pipeline** (máquina de estados, Gate 0/4, scorecards): `aulas/cirrose/WT-OPERATING.md` (ler manualmente em sessões QA)
- Doc graph: `docs/XREF.md` (consultar sob demanda)

## Worktree

Usar quando precisar trabalhar em dois slides simultaneamente ou fixar slide DONE enquanto drafta outro.

```
EnterWorktree(name: "fix-fib4")   → trabalho isolado
ExitWorktree(action: "keep")      → preserva branch worktree-fix-fib4
ExitWorktree(action: "remove")    → descarta (se ja merged)
```

Caveat: `npm install` necessario no primeiro uso de worktree nova (node_modules nao e copiado).

## Memory Hygiene

- **Session end:** Se Lucas deu feedback de coaching, salvar como memory com `Why:` + `How to apply:`.
- **Memory vs CLAUDE.md:** Coaching/persona = memory. Routing rules = CLAUDE.md ou .claude/rules/.
- **Prune:** `project_*` memories -> deletar quando task completa e HANDOFF.md reflete.
- **No duplication:** Antes de salvar, grep CLAUDE.md + .claude/rules/ por overlap.
- **Absolute dates.** Nunca "ontem" ou "28/mar" -- sempre "2026-03-28".

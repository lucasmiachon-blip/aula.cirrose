# CLAUDE.md — Aula Cirrose

> Fonte de verdade operacional. Repo single-aula (split de monorepo 2026-03-24).
> Regras detalhadas: @.claude/rules/*.md

## Commands

```bash
npm run dev               # Vite hot reload (port 3000)
npm run build             # Producao
npm run build:cirrose     # Concatena slides → index.html via _manifest.js
npm run preview           # Servir localmente (palco)
npm run lint:slides       # Assertion-evidence linter
npm run lint:case-sync    # CASE.md ↔ _manifest.js sync
npm run lint:narrative-sync # narrative.md ↔ _manifest.js sync
```

## Stack

deck.js (custom nav) · GSAP 3.14 · Vite 6.x · Vanilla HTML/CSS/JS · OKLCH · Zero CDN · Offline-first.

## Project

**Cirrose Hepática — Classificar · Intervir · Reverter**
44 slides · 1280×720 (Plan C) / 1920×1080 (Plan A) · Público: hepatologistas seniores (Brasil) · PT-BR, termos técnicos EN.

### Arquivos de trabalho

> Paths relativos a `aulas/cirrose/`.

| Arquivo | Papel |
|---------|-------|
| `slides/*.html` | **DEFAULT — editar estes** (44 arquivos, 1 por slide) |
| `slides/_manifest.js` | Source of truth: ordem, archetypes, panelStates |
| `slide-registry.js` | Wiring centralizado (custom anims, panel, click-reveal, meld) |
| `index.template.html` | Template com `%%SLIDES%%` placeholder |
| `index.html` | **Gerado** — `npm run build:cirrose` |
| `cirrose.css` | Estilos específicos desta aula |
| `archetypes.css` | Layout archetypes |
| `shared/css/base.css` | Tokens OKLCH, tipografia, stages |
| `shared/js/engine.js` | GSAP dispatcher + deck init |
| `shared/js/deck.js` | Navegação vanilla |
| `shared/js/case-panel.js` | Case panel lateral |
| `shared/js/click-reveal.js` | Progressive disclosure por ArrowRight |

### Fluxo de edição

1. Editar `slides/NN-nome.html`
2. `npm run build:cirrose` (gera `index.html` via `_manifest.js` + template)
3. `npm run dev` → abrir `/aulas/cirrose/index.html`

## Reference Hierarchy

| # | Arquivo | Autoridade |
|---|---------|-----------|
| 1 | `references/CASE.md` | Dados do paciente — NUNCA duplicar |
| 2 | `references/evidence-db.md` | Trials, PMIDs, NNTs |
| 3 | `references/narrative.md` | Arco narrativo, pacing |
| 4 | `slides/_manifest.js` | Ordem dos slides — NÃO reordenar sem aprovação |

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
9. **index.html é gerado.** Editar slides/*.html + build. Hook bloqueia Write direto.
10. **Corpo do slide <= 30 palavras.** Speaker notes em português.
11. **OKLCH padrão.** HSL proibido. Fallback HEX para WCAG.
12. **Tabelas Tufte:** sem bordas verticais, números à direita, classe `.tufte`.
13. **NUNCA inventar dados clínicos.** Sem fonte Tier 1 → `[TBD]`.
14. **CSS cascata:** `base.css` → `archetypes.css` → `cirrose.css`. NUNCA `!important` salvo 4 pré-existentes.
15. **deck.js, NÃO Reveal.js.** Reordenação: `_manifest.js` + build.
16. **Branch:** `feat/cirrose-mvp`. Commits: prefixo semântico (`fix:`, `feat:`, `refactor:`, `docs:`).

## Slide Identity

> Regra completa: @.claude/rules/slide-identity.md

9 superfícies sincronizadas: `_manifest.js` · `<section id>` · `slide-registry.js` · `cirrose.css` · `narrative.md` · `evidence-db.md` · `AUDIT-VISUAL.md` · `HANDOFF.md` · `index.html` (gerado).

- Drift da rodada → **FAIL**. Corrigir ANTES de prosseguir.
- RENAME/SPLIT/DELETE → checklist atômico das 9 superfícies. NUNCA sem aprovação.

## Workflow

### Sessão

1. **Start:** `git log --oneline -5 && git status` → ler HANDOFF.md → perguntar ao usuário.
2. **Slide a slide.** Um slide por vez no QA pipeline.
3. Plan mode para tarefas >=3 steps. Subagents para pesquisa.
4. Verificar antes de declarar done: `npm run lint:slides`.
5. Handoff: código → visual = Gemini. Visual → clínico = Opus.
6. **End:** atualizar HANDOFF.md. Commit + push.

### Aprendizado com erros

Erro → ERROR-LOG.md → se 3x recorrente → regra em `.claude/rules/`.
Regras são reativas (52 erros reais). NUNCA criar regra por problema que aconteceu 1x.

### Guardrails

| Guard | Função | Tipo |
|-------|--------|------|
| Pre-commit | Slide-count, slide-integrity, ghost canary, lints | exit 1 |
| evidence-db hooks | Protege dados clínicos | warn |
| guard-generated | Bloqueia Write em index.html | exit 2 |
| guard-product-files | Bloqueia edição slides/CSS/JS sem humano | exit 2 |

Complexidade só entra se paga o custo no mesmo dia. NUNCA abstração preventiva.

## Auditoria Visual — Gemini CLI

Gemini NUNCA edita arquivos. Só produz JSON de sugestões.

```bash
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --inspect        # Gate 0
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --full --round N  # Gate 0+4
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --editorial --round N  # Gate 4
```

Score < 7 → registrar problema, aguardar decisão de Lucas.

## Context Window

/clear entre tasks. /compact em ~70%. Até 3 tasks por sessão.

```bash
grep -A2 "s-a2-03" aulas/cirrose/references/evidence-db.md         # dados 1 slide
sed -n '/## 2\. `archetype-metrics`/,/^## /p' aulas/cirrose/references/archetypes.md
sed -n '/### ATO 2/,/^### /p' aulas/cirrose/references/narrative.md
```

## Rules (loaded on demand)

- Anti-drift: @.claude/rules/anti-drift.md
- CSS errors: @.claude/rules/css-errors.md
- Design tokens: @.claude/rules/design-system.md
- Design principles: @.claude/rules/design-principles.md
- Medical data: @.claude/rules/medical-data.md
- Deck.js patterns: @.claude/rules/deck-patterns.md
- Slide editing: @.claude/rules/slide-editing.md
- **Slide identity (9 superfícies):** @.claude/rules/slide-identity.md
- Motion QA: @.claude/rules/motion-qa.md
- Doc graph: @docs/XREF.md

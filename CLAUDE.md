# CLAUDE.md — Aulas Magnas

> Fonte de verdade operacional (root). Cada projeto tem seu proprio CLAUDE.md.
> Regras detalhadas: @.claude/rules/*.md · Docs: @docs/README.md

## Commands

```bash
npm run dev               # Vite hot reload (port 3000)
npm run build             # Producao
npm run build:cirrose     # Concatena slides → index.html via _manifest.js
npm run build:grade       # Idem para GRADE
npm run build:osteoporose # Idem para Osteoporose
npm run preview           # Servir localmente (palco)
npm run lint:slides       # Assertion-evidence linter
npm run lint:case-sync    # CASE.md ↔ _manifest.js sync
npm run lint:narrative-sync # narrative.md ↔ _manifest.js sync
```

## Stack

deck.js (custom navigation) · GSAP 3.14 · Vite 6.x · Vanilla HTML/CSS/JS · OKLCH · Zero CDN · Offline-first.

> **Reveal.js:** legacy — grade/osteoporose (frozen, fallback em Aulas_core). Cirrose e metanalise usam `deck.js`.

## Projects

| Pasta | Status | CLAUDE.md |
|-------|--------|-----------|
| `aulas/cirrose/` | 44 slides, QA visual em andamento (batch 1 parcial) · **ATIVO** | `aulas/cirrose/CLAUDE.md` |
| `aulas/metanalise/` | Escopo definido, 0 slides HTML, build pendente · **PLANEJAMENTO** | `aulas/metanalise/CLAUDE.md` |
| `aulas/grade/` | 58/58 migrados · FROZEN (Reveal.js legacy) | `aulas/grade/CLAUDE.md` |
| `aulas/osteoporose/` | 70/70 migrados · FROZEN (Reveal.js legacy) | `aulas/osteoporose/CLAUDE.md` |

Publico: medicos (Brasil). Publico varia por aula — ver CLAUDE.md de cada projeto. PT-BR, termos tecnicos EN.

## Shared Infrastructure

shared/ agora vive dentro de `aulas/cirrose/shared/` (internalizado 2026-03-22).

```
aulas/cirrose/shared/css/base.css    → Tokens OKLCH, tipografia, stages
aulas/cirrose/shared/js/engine.js    → data-animate dispatcher + modes
aulas/cirrose/shared/js/deck.js      → Navegacao vanilla
aulas/cirrose/shared/js/case-panel.js → Panel lateral (cirrose)
```

## Conventions

- Slides: `NN-slug.html` (ex: `00-title.html`)
- Commits: `[AULA] batch N — desc`
- Plan C = default (light, 1280x720, GSAP ativo)

## Hard Constraints

1. **Assertion-Evidence.** `<h2>` = afirmacao clinica verificavel. NUNCA rotulo generico.
2. **ZERO `<ul>`/`<ol>` em slides.** Listas so em notes e apendice.
3. **Todo `<section>` TEM `<aside class="notes">`** com timing e fontes. NUNCA deletar notes.
4. **var() obrigatorio.** NUNCA cor literal em CSS. Excecao: `data-background-color` (HEX).
5. **Cor clinica ≠ UI.** `--safe/--warning/--danger` = clinico. `--ui-accent` = chrome.
6. **Daltonismo:** icone obrigatorio junto a cor semantica.
7. **`data-animate` declarativo.** NUNCA gsap inline.
8. **Zero CDN. Offline-first.**
9. **NUNCA reescrever `index.html` inteiro** sem aprovacao.
10. **Corpo do slide <= 30 palavras.**
11. **Speaker notes em portugues.**
12. **GSAP failsafe:** `[data-animate]` → `opacity:0` em CSS. `.no-js` forca `opacity:1`.
13. **Tabelas Tufte:** sem bordas verticais, numeros a direita, classe `.tufte`.
14. **OKLCH padrao.** HSL proibido. Fallback HEX para WCAG.
15. **NUNCA inventar dados clinicos.** Sem fonte Tier 1 → `[TBD]`.

## Workflow

1. **Anti-drift:** Ler HANDOFF do projeto → caminho critico → propor ao usuario.
2. Plan mode para tarefas >=3 steps.
3. Subagents para pesquisa — manter contexto principal limpo.
4. Verificar antes de declarar done: `npm run lint:slides`.
5. Handoff: codigo → visual = Gemini. Visual → clinico = Opus.
6. Apos correcao do usuario → atualizar `tasks/lessons.md`.
7. Sessao termina → atualizar HANDOFF.md do projeto ativo.

## Auditoria Visual — Gemini CLI

REGRA: Gemini NUNCA edita arquivos. Só produz JSON de sugestões.
Só Claude Code lê o JSON e decide o que implementar.

```bash
# Gate 0 (inspeção defeitos, default)
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --inspect

# Gate 0 → Gate 4 (inspeção + editorial)
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --full --round N

# Gate 4 only (editorial)
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --editorial --round N
```

Output: `qa-screenshots/{slide-id}/gate0.json` (Gate 0) e `gemini-qa3-rN.md` (Gate 4)
Threshold: score < 7 → registrar problema, aguardar decisão de Lucas

## Operational Records

Cada projeto tem seus proprios registros (HANDOFF, CHANGELOG, ERROR-LOG, NOTES).
Cross-project: `tasks/lessons.md` (padroes de auto-correcao).

## Session Start

```bash
git log --oneline -5 && git status
cat aulas/{PROJETO_ATIVO}/HANDOFF.md
cat tasks/lessons.md 2>/dev/null || echo "No lessons yet"
```

## Context Management

- /clear entre tasks. /compact em ~70%.
- Ate 3 tasks por sessao. Commitar entre tasks.

## Detailed Rules (loaded on demand)

- Anti-drift: @.claude/rules/anti-drift.md
- CSS errors: @.claude/rules/css-errors.md
- Design tokens: @.claude/rules/design-system.md
- Design principles: @.claude/rules/design-principles.md
- Medical data: @.claude/rules/medical-data.md
- Deck.js patterns (cirrose, metanalise): @.claude/rules/deck-patterns.md
- Reveal.js legacy (grade, osteoporose): @.claude/rules/reveal-legacy.md
- Slide editing: @.claude/rules/slide-editing.md
- **Slide identity (9 superficies):** @.claude/rules/slide-identity.md
- Motion QA: @.claude/rules/motion-qa.md
- Doc graph: @docs/XREF.md

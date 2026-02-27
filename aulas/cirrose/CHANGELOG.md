# CHANGELOG — Cirrose Masterclass

> Histórico de batches. Append-only (novos no topo). Estado → HANDOFF.md

---

## 2026-02-27 — Fixes AUDIT (I1–I5)

- s-a1-01: headline encurtada (continuum 1% a 57%/ano)
- s-hook: case-data .data-item gap + align-items baseline
- Headline max-width: 65ch → 85ch (archetypes.css)
- Case panel: 230px → 140px (AUDIT I1)
- _manifest.js: headline s-a1-01 atualizada

---

## 2026-02-27 — Redesign s-title (capa)

- Brasão USP, hierarquia visual, identidade autor
- data-background-color navy fixo em todos os stages
- CSS em cirrose.css (não archetypes — slide único)

---

## 2026-02-27 — Notion sync + MD refactor

- **Notion:** Posições alinhadas com `_manifest.js`. CIRR-04-01 → CIRR-A1-01. CIRR-A2-04-OLD pos 99.
- **MDs:** IDs Notion consolidados em `docs/SYNC-NOTION-REPO.md` (única referência). 9 arquivos atualizados.
- **Blueprint:** Ordem v4 (TITLE → HOOK → A1-01...)
- **HANDOFF:** Enxuto.

---

## 2026-02-27 — Limpeza MDs + fix package.json

- **Deletados:** `docs/CONFLITOS-CIRROSE-BATCHES.md`, `docs/PLANO-CIRROSE-BATCHES.md` (obsoletos)
- **cirrose-scope.md:** Marcado SUPERSEDED → ver blueprint-cirrose.md
- **package.json:** `qa:screenshots:cirrose` apontava para `qa-screenshots-cirrose.js` (inexistente) → corrigido para `qa-screenshots-stage-c.js`

---

## 2026-02-27 — Refatoração Arquitetural (FASE 0–4)

- **Branch:** `refactor/floating-panel`
- **Agente:** Cursor (Opus 4.6)
- **Alterações:**
  - **FASE 0:** `slides/_manifest.js` — source of truth (28 slides, panelStates, archetypes)
  - **FASE 1:** `index.stage-c.html` → 28 arquivos em `slides/`, `index.template.html`, `scripts/build-html.ps1`, `scripts/split-slides.js`
  - **FASE 2:** `cirrose.css` consolidado — removidas regras redundantes (`.section-tag`, `max-width: 32ch`)
  - **FASE 3:** `slide-registry.js` — wiring centralizado (custom anims, panel, click-reveal, meld). Script block de ~120 para 19 linhas.
  - **FASE 4:** MDs atualizados (CLAUDE.md, slide-refactor.md, docs/HANDOFF.md, AUDIT-VISUAL.md, blueprint). Scripts melhorados (UTF-8, manifest-driven, id-based mapping, null guard).
- **Ciclo de melhoria:**
  - `build-html.ps1`: lê ordem de `_manifest.js` (não mais hardcoded), `-Encoding UTF8`, file-existence check
  - `split-slides.js`: mapeia sections por `id` (não mais por index)
  - `slide-registry.js`: null guard em `getCurrentSlide()`
- **Build:** `npm run build` OK. `npm run build:cirrose` adicionado.
- **Deletados:** `DIAGNOSTIC-OUTPUT.md`, `FASE-0-OUTPUT.md`..`FASE-3-OUTPUT.md` (consolidados aqui)

---

## 2026-02-26 — QA Screenshots + window.Reveal fix

- **Branch:** `refactor/floating-panel`
- **Agente:** Claude Code (Opus 4.6)
- **Alterações:**
  - `index.stage-c.html`: Added `window.Reveal = Reveal;` after `initAula()`
  - Root cause: `initAula()` returns deck event object, NOT the Reveal API
  - ESM scope doesn't expose `Reveal` to `window` — QA script needs `window.Reveal.isReady()`
- **QA:** 28 screenshots captured OK. Zero console errors.

---

## 2026-02-26 — P3: CasePanel/ClickReveal/registerCustom → slide IDs

- **Commit:** c441540
- **Agente:** Claude Code (Opus 4.6)
- **Fonte:** Plano aprovado `valiant-twirling-sunrise.md`
- **Alterações:**
  - `case-panel.js`: `connect(slidesContainer)`, `registerState(slideId, state)`, `onSlideChanged(slideEl)` — tudo keyed por string ID
  - `engine.js`: `registerCustom(slideId, fn)` — string ID em vez de index numérico
  - `index.stage-c.html`: 5× registerState, ClickReveal Map, revealer lookup — todos migrados para slide ID
- **Impacto:** 3 arquivos, 60 inserções, 40 deleções
- **QA:** 28 slides OK, zero erros, CasePanel funcional

---

## 2026-02-26 — Floating panel refactor + HOOK card fix

- **Commit:** 982dd01
- **Branch:** `refactor/floating-panel`
- **Alterações:** Grid → overlay. HOOK card light theme.

---

## 2026-02-26 — P2: Hero typography + Graceful degradation

- **Commit:** 822cf38
- **Agente:** Claude Code (Opus 4.6)
- **Alterações:**
  - `archetypes.css` + `cirrose.css`: `.metric-value` → Instrument Serif, weight 400, `text-primary`, `letter-spacing: -0.02em`, `tabular-nums lining-nums`
  - `engine.js`: `initNoJs()` movido para DEPOIS de `await initReveal()` — graceful degradation
- **Impacto:** 3 arquivos, 15 inserções, 8 deleções

---

## 2026-02-26 — JS bugfix: hash navigation fallback

- **Commit:** 59c10e7 (→ 7a49c9f)
- **Agente:** Claude Code (Opus 4.6)
- **Alterações:**
  - `engine.js`: Fallback timer 800ms no `slidechanged` para hash jumps
  - Guard `animatedSlide` previne dupla execução
  - `ready` handler: seta `animatedSlide = Reveal.getCurrentSlide()`
- **Validação:** Hash jump, navegação sequencial, HOOK countUp, stagger tables, case panel transitions — todos OK
- **Impacto:** Apenas `engine.js`. Zero CSS/HTML.

---

## 2026-02-25 — P1: Fill ratio + Source tags

- **Commit:** 92328c7
- **Branch:** `p1/fill-ratio`
- **Agente:** Claude Code (Opus 4.6)
- **Alterações:**
  - `cirrose.css`: 9 containers `max-width` → `min(Npx, 100%)`
  - Albumin-cards: `repeat(4,1fr)` → `repeat(auto-fit, minmax(min(180px,100%), 1fr))`
  - Source-tags: `.source-tag` posicionada `absolute bottom-right` em 10 slides
  - `archetypes.css`: `.archetype-figure .slide-figure` → `min(600px, 100%)`, border-radius, box-shadow
- **Impacto:** 2 CSS files. Zero HTML changes. Zero JS.

---

## 2026-02-25 — P0: Stage-C Stability

- **Commit:** ba474f8
- **Agente:** Claude Code (Opus 4.6)
- **Alterações:**
  - QA script, QA mode (`?qa=1`), panel safe area padding

---

## 2026-02-24 — QA Batch 0 (pós-implementação inicial)

- **Agente:** Claude Code (Opus 4.6)
- **Bugfixes:**
  1. `deck.on()` → `Reveal.on()` (TypeError)
  2. `Reveal.on('ready')` → sync init (evento já disparou)
  3. `Reveal.addKeyBinding` → `document.addEventListener('keydown', ..., true)`
  4. CSS: metric-value font-size clamp ajustado (card 3 overflow)
  5. CSS: metric-card padding/min-width/max-width + overflow:hidden
  6. CSS: nova `.metric-unit` classe
  7. HTML s-a2-01: Card 3 split value/unit
- **QA visual:** s-a1-01, s-a2-01, s-a1-03, s-cp1, case panel transitions, ArrowRight reveals, build — todos PASS

---

## 2026-02-24 — Triagem de auditorias externas

- **AUDIT-CONSOLIDADA** (Claude.ai Opus): 28 slides × 8 dim. Ghost text + stagger = artefatos screenshot. Panel clip = real.
- **ERRATA-FIX-SENIOR**: Diagnóstico correto. Custom properties sem `!important`. Aceito.
- **Gemini Custom Gem**: `!important` spray rejeitado. Glassmorphism rejeitado. `min()` aceito.
- **Resultado:** 4 `!important` pré-existentes. Zero adicionados.

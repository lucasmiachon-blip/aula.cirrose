# CHANGELOG — Cirrose Masterclass

> Histórico de batches. Append-only (novos no topo). Estado → HANDOFF.md

---

## 2026-02-28 — Preview: fix beat 0/beat 1 (DOM local)

### Solução final
- **Subitens beat 0 e beat 1 mostram estados distintos** — customAnim perde ready no preview; fix: aplicar beat estático via DOM local após init (classes + labs visibility), sem depender do dispatcher.
- **ERRO-017** corrigido.

### Arquivos alterados
- `preview.html` — bloco pós-connect: setBeat + labs visibility para s-hook quando `?beat=` presente

---

## 2026-02-28 — Consolidação docs + s-hook v5

### Documentação
- **ERROR-LOG:** Reescrito de forma compreensiva — ERRO-001 a ERRO-016 com severidade, root cause, regra derivada e status (corrigido/pendente). Tabela resumo por severidade. Seção final "Raw code" com trechos de slide-registry.js, cirrose.css, index.template.html, 01-hook.html.
- **HANDOFF projeto:** `HANDOFF.md` — só pendências.
- **HANDOFF Claude.ai:** `HANDOFF-CLAUDE-AI.md` — paths + pendências (colar no Project Knowledge).

### s-hook v5 — mudanças de conteúdo e UX
- **"Seu" removido:** "Seu Antônio" → "Antônio" (formal, congresso).
- **"Caminhoneiro":** Simplificado (sem "de longa distância").
- **Sem título/header:** Removido hook-header com título e progress 1✓·2✓·3; conteúdo centralizado.
- **2 beats:** Beat 0 = Antônio + história (centro). Beat 1 = Labs + "Sem queixas." + "Qual a próxima conduta?" abaixo dos números.
- **Pergunta:** "Qual é o próximo passo?" → "Qual a próxima conduta?".

### s-hook v5 — animações e interação
- **Reversível:** retreatBeat() implementado; ArrowLeft/ArrowUp voltam ao beat anterior (engine.js intercept).
- **ArrowDown removido** da interceptação do hook (evita "texto desce").
- **Sombra pré-stagger corrigida:** Beat 1 content (labs, lead, question) com `opacity: 0; visibility: hidden` em CSS até GSAP animar; resetBeat1Content() no retreat para consistência ao voltar.
- **Transição Antônio:** Lógica simples no retreat (sem killTweensOf/gsap.set agressivos); overwrite: 'auto' no fromTo.
- **Interação sumindo (ERRO-016):** wireAll() passou a rodar ANTES de anim.connect() em index.template.html — customAnimations precisam estar registrados antes do dispatcher conectar; caso contrário __hookAdvance nunca era definido e clique/setas não funcionavam.

### Arquivos alterados
- `slides/01-hook.html` — 2 beats, sem header, texto atualizado
- `slide-registry.js` — advanceBeat, retreatBeat, resetBeat1Content, runLabsStagger (stagger imediato, visibility no fromTo)
- `cirrose.css` — s-hook v5: beat 1 opacity/visibility, sem hook-header
- `index.template.html` — wireAll antes anim.connect
- `slides/_manifest.js` — clickReveals: 1, headline "Caso Antônio · Qual a próxima conduta?"
- `scripts/qa-screenshots-stage-c.js` — TOTAL_BEATS = 2, delay 1,5s

---

## 2026-02-28 — Re-análise PNG + HANDOFF Claude.ai

- **DIAGNOSTIC-HOOK-28fev.md:** Re-análise pós-fix — texto descentralizado, melhorias confirmadas, problemas persistentes
- **HANDOFF-CLAUDE-AI.md:** Handoff para Claude.ai — fase, raw changes, ERROR-LOG, próximos passos
- **ERROR-LOG:** ERRO-013 (texto descentralizado)
- **AUDIT-VISUAL.md:** `aulas/cirrose/AUDIT-VISUAL.md` (28 slides, s-hook = Slide 4)

---

## 2026-02-28 — Diagnóstico s-hook + fix contraste

- **DIAGNOSTIC-HOOK-28fev.md:** Análise UI/UX/tipografia/slideologia baseada em PNGs
- **Fix contraste:** #s-hook override para stage-c — cores literais (#f0f2f5, #b8c4d4, #9ca8b8) para vencer var(--text-on-dark) remapeado
- **Lab refs:** font-size 0.85rem, cor #a0acc0
- **ERROR-LOG:** ERRO-009 (contraste beat 1), ERRO-010 (anim sem retorno), ERRO-011 (texto desce), ERRO-012 (QA timing)
- **Plano de mudanças:** 4 fases (contraste → retorno → ArrowDown → polish)

---

## 2026-02-28 — s-hook v3 (Monolítico)

- 5 beats → 2 beats (caso+labs → pergunta)
- Removido: cold open, framework, emoji
- Navy bg forçado: `#s-hook { background: #162032 !important }` + `data-background-color="#162032"`
- Labs em linha única: `grid-template-columns: repeat(5, 1fr)`, `hook-lab--flag` para FIB-4/PLQ
- slide-registry: advanceBeat com 1 click, revealAll removido
- qa-screenshots: TOTAL_BEATS = 2
- ERROR-LOG.md criado: path `aulas/cirrose/ERROR-LOG.md`, workflow por sessão

---

## 2026-02-27 — Transições: pointer + ArrowRight/ArrowDown

- Hook e ClickReveal: clique no slide OU teclas ArrowRight, ArrowDown, Space, PageDown
- engine.js: tryHookAdvance + listener de click em .slides
- slide-registry.js: tryRevealNext + ArrowDown + listener de click

---

## 2026-02-27 — QA screenshots: transições capturadas corretamente

- Script usa `__hookAdvance()` em vez de ArrowRight (que avançava slide)
- 5 PNGs do hook refletem as 5 transições reais
- HANDOFF-QA-ANIMATIONS.md e README atualizados

---

## 2026-02-27 — QA screenshots: 3 pastas (stage-a, stage-b, stage-c)

- Só 3 pastas: `stage-a`, `stage-b`, `stage-c` em `aulas/cirrose/qa-screenshots/`
- Deletado: `animations/`, `hook-beats/`, `stage-c-floating/`
- Batch atual stage-c: 5 PNGs do hook (`02-s-hook-beat-00.png` … `02-s-hook-beat-04.png`)
- Script unificado: `qa-screenshots-stage-c.js` (só hook neste batch)
- build-zip-limpo-ia.ps1: `stage-c` em `aulas/cirrose/qa-screenshots/`

---

## 2026-02-27 — s-hook Redesign (Cold Open Cinematográfico)

- 5 beats: cold open → Seu Antônio → labs → pergunta → framework
- Beats substituem (não acumulam), 4 cliques
- Beat system em slide-registry, keydown interception em engine.js
- CSS hook-stage, hook-beat, hook-card, hook-labs, hook-thesis

---

## 2026-02-27 — Brasão USP v2 (PNG transparente)

- brasao-usp-white.png (white on transparent) para navy
- Stage-c/bad: filter invert(1) para versão escura
- Sem filter no default — PNG limpo, sem caixa

---

## 2026-02-27 — Fix brasão s-title (canto sup. direito)

- Brasão absoluto top-right, monocromático branco (navy) / preto sutil (stage-c)
- Removido .title-logo wrapper
- Print: var(--bg-navy) em vez de HEX

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

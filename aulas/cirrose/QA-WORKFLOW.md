# QA Workflow — Cirrose

> Operacional. Descreve o pipeline completo de QA visual, slide a slide, ato a ato.
> Threshold: todas 14 dimensoes >= 9 para PASS. Archetype-adjusted para title/hook/checkpoint.
> Ferramentas: Playwright, Claude Vision, Gemini MCP, a11y-contrast MCP.
> Criado: 2026-03-16. Autor: Lucas + Opus 4.6.

---

## Visao Geral

```
Fase 1          Fase 2 (por slide)           Fase 3           Fase 4
Batch        ┌─────────────────────┐
Screenshots  │ Screenshot + Metrics │
     │       │         ↓            │       Dynamic        Deck-Level
     │       │ Constraint Check     │       Gate           Audit
     ├──────→│         ↓            │──────→(animacoes)───→(Gemini
     │       │ Claude Vision 7-dim  │       por slide      cross-slide)
     │       │         ↓            │
     │       │ Score 14-dim         │
     │       │         ↓            │
     │       │ dim < 9? ──YES──→ Fix│
     │       │    │                 │
     │       │   NO                 │
     │       │    ↓                 │
     │       │  PASS → commit       │
     │       └─────────────────────┘
```

**Ordem:** Act 1 (10 slides) → Act 2 (17 slides) → Act 3 (11 slides) → Appendix (8 slides)
**Regra:** Ato N+1 so comeca quando TODOS slides do Ato N tem PASS.

---

## Fase 1 — Batch Screenshots

**Objetivo:** Capturar estado final de todos os slides de um ato em uma unica execucao.

### Script

```bash
# Rodar no terminal com dev server ativo (npm run dev)
node aulas/cirrose/scripts/qa-batch-screenshot.mjs --act A1
```

O script deve:
1. Navegar para cada slide do ato (ArrowRight — deck.js nao suporta hash nav)
2. Esperar animacoes completarem (2.5s padrao, customizavel por slide)
3. Para slides com click-reveals: capturar cada estado (S0, S1, S2...)
4. Capturar screenshot 1280x720 @2x (deviceScaleFactor: 2)
5. Medir bounding boxes via `page.evaluate()` e salvar como JSON
6. Salvar em `qa-screenshots/{slide-id}/` com nomes `S0.png`, `S1.png`, `metrics.json`

### Output esperado

```
qa-screenshots/
  s-a1-01/
    S0.png          ← estado final (auto-only, sem click-reveals)
    metrics.json    ← bounding boxes de todos elementos
  s-a1-damico/
    S0.png          ← pre-click
    S1.png          ← apos click 1
    S2.png          ← apos click 2
    metrics.json
  ...
```

### Metrics JSON schema

```json
{
  "slideId": "s-a1-01",
  "viewport": { "width": 1280, "height": 720 },
  "elements": {
    "section-tag": { "top": 40, "bottom": 68, "left": 411, "right": 685, "width": 274, "height": 28, "centerX": 548 },
    "slide-headline": { "top": 203, "bottom": 238, ... },
    "...": "..."
  },
  "computed": {
    "fillRatio": 0.65,
    "h2Lines": 1,
    "bodyWordCount": 22,
    "hasSourceTag": true,
    "hasPanelOverlap": false
  }
}
```

---

## Fase 2 — Per-Slide QA Loop

### Gate 1: Constraint Check (automatizado)

Verificacoes que podem ser feitas sem screenshot (lint + HTML source):

| Check | Ferramenta | Dim afetada | Threshold |
|-------|-----------|-------------|-----------|
| h2 = assercao clinica (nao rotulo) | grep + manual | M, N | Obrigatorio (exceto archetype title/hook) |
| Zero `<ul>/<ol>` no corpo do slide | grep | M, L | Obrigatorio |
| `<aside class="notes">` com timing | grep | N | Obrigatorio |
| `<section>` sem style display (E07) | grep | S | Obrigatorio |
| Cores via var() — zero HEX hardcoded | grep cirrose.css | C | Obrigatorio (exceto fallbacks) |
| Dados com PMID verificado ou [TBD] | grep notes | D | Obrigatorio |
| Headline match manifest↔HTML | lint:narrative-sync | N, K | Obrigatorio |
| Body word count <= 30 | page.evaluate | L, M | Obrigatorio |

**Se qualquer check falhar → fix ANTES de prosseguir para Gate 2.**

### Gate 2: Static Visual Audit (screenshot)

**Input:** Screenshot PNG + metrics JSON da Fase 1.

**Passo 1 — Layout Metrics (automatizado):**

Do metrics.json, extrair:
- Fill ratio (area dos elementos / area do slide-inner)
- Gaps entre elementos consecutivos
- Alinhamento horizontal (todos centerX iguais?)
- Relacao card/footer widths
- Panel overlap (conteudo atras do case panel?)

**Passo 2 — Claude Vision (7 dimensoes visuais):**

Enviar screenshot para analise com prompt padronizado:

```
Analise este screenshot de slide medico para congresso de gastroenterologia.
Avalie 7 dimensoes (1-5 cada):

1. VISUAL HIERARCHY (Von Restorff) — 1 hero element 2-3x maior
2. SPACING & ALIGNMENT (Gestalt) — gaps consistentes, baseline grid
3. TYPOGRAPHY (Assertion-Evidence) — h2 = assertion, 3+ tamanhos distintos
4. COLOR & CONTRAST (WCAG projetor) — minimo 7:1 texto primario
5. FILL RATIO — 65-90% dependendo do tipo
6. COGNITIVE LOAD (Cowan 4+1) — max 4 grupos, max 30 palavras corpo
7. COMPOSITION (F/Z pattern) — fluxo de leitura claro

Contexto: bg claro, resolucao 1280x720, projetor de boa qualidade.
Responda em JSON: { "dim": score, "issues": ["..."] }
```

**Passo 3 — a11y-contrast MCP:**

Verificar pares de cores criticos do slide:
- Texto primario vs bg → threshold >=7:1
- Texto muted/footer vs bg → threshold >=6:1
- Hero number vs bg → threshold >=4.5:1 (large text AA)
- Card border vs bg → threshold >=3:1

**Passo 4 — Score 14 dimensoes:**

Converter resultados dos 3 passos em scorecard de 14 dimensoes (escala 1-10):

| Origem | Dimensoes |
|--------|-----------|
| Gate 1 (lint) | D, M (parcial), N (parcial) |
| Gate 2 metrics | E, K (parcial) |
| Gate 2 Claude Vision | H, T, E (refina), C, V, S |
| Gate 2 a11y-contrast | C (refina), A |
| Manual (agente) | M (refina), I, L, P, N (refina) |

### Gate 3: Fix Loop

Se qualquer dimensao < 9 (ou < threshold archetype-adjusted):

1. Identificar dimensoes abaixo do threshold
2. Propor fix cirurgico (CSS, HTML, ou JS)
3. **Pedir aprovacao do usuario** para mudancas em HTML de slide
4. Aplicar fix
5. `npm run build:cirrose`
6. Re-screenshot do slide especifico
7. Re-score dimensoes afetadas
8. Repetir ate PASS

**Regra:** Max 3 iteracoes por slide. Se nao convergir, registrar em NOTES.md e mover para proximo slide.

### Gate 4: Docs Update

Apos PASS (ou max iteracoes):
1. Atualizar scorecard em AUDIT-VISUAL.md
2. Atualizar status em HANDOFF.md
3. Registrar fix em CHANGELOG.md (se houve mudanca)
4. Commit: `fix(cirrose): s-{id} QA pass — {resumo dos fixes}`

---

## Fase 3 — Dynamic Gate (Animacoes)

**Quando:** Apos todos slides de um ato passarem Fase 2.

### Por slide com animacao (customAnim != null):

**3a. Timing Assertions (automatizado via Playwright):**

```js
// Verificar que animacao completou
await page.waitForTimeout(2500); // max animation duration
const opacity = await page.$eval('.element', el => getComputedStyle(el).opacity);
assert(opacity === '1', 'animacao nao completou');
```

Specs por tipo:
| Tipo | Duration | Easing |
|------|----------|--------|
| fadeUp | 300-600ms | power2.out |
| countUp | 800-1200ms | — |
| stagger (total) | <=1500ms | power2.out |
| drawPath | 600-1000ms | power2.out |

**3b. Click-Reveal Sequence (slides com clickReveals > 0):**

1. Estado inicial (S0) → screenshot
2. ArrowRight → estado S1 → screenshot
3. Repetir ate SN
4. Verificar que CADA estado revela conteudo coerente
5. Retreat: ArrowLeft de volta a S0 → verificar que reseta

**3c. Video Recording (Playwright):**

```js
// Gravar navegacao do slide como .webm
const ctx = await browser.newContext({ recordVideo: { dir: 'qa-videos/', size: { width: 1280, height: 720 } } });
```

Salvar em `qa-videos/{slide-id}.webm` para Gate 4 Gemini.

---

## Fase 4 — Deck-Level Audit (Gemini)

**Quando:** Apos TODOS slides de um ato passarem Fases 2+3.

### 4a. Static Cross-Slide (Gemini screenshot)

Enviar grid de thumbnails (4 por linha) de todos slides do ato → Gemini MCP:

```
Prompt: "Analise esta sequencia de slides de um congresso medico.
Avalie:
1. Consistencia visual cross-slide (mesmos tokens, tipografia, spacing)
2. Alternancia bg dark/light (ritmo Duarte)
3. Monotonia visual — slides consecutivos identicos?
4. Densidade cognitiva — distribuicao do conteudo pesado vs leve
5. Hierarquia de ato — abertura→desenvolvimento→climax→checkpoint"
```

### 4b. Dynamic Cross-Slide (Gemini video)

Gravar video de navegacao do ato inteiro (slide a slide, com animacoes):

```js
// Navegar todos slides do ato, 3s por slide
for (const slide of actSlides) {
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(3000);
}
```

Enviar .webm ao Gemini MCP com prompt de motion QA.

### 4c. Fixes deck-level

Gemini retorna sugestoes em formato JSON spec:
```json
{
  "slide": "s-a1-damico",
  "issue": "bg identico ao slide anterior — monotonia",
  "suggestion": "alternar para bg-navy",
  "severity": "medium"
}
```

Agente Opus filtra sugestoes validas → aplica → re-audit slides afetados (volta para Fase 2).

---

## Status Tracker

### Act 1 (10 slides)

| # | Slide | Fase 1 | Fase 2 | Fase 3 | Status |
|---|-------|--------|--------|--------|--------|
| 1 | s-title | --- | PASS (archetype) | N/A (sem anim) | DONE |
| 2 | s-hook | --- | PASS (archetype) | pendente | parcial |
| 3 | s-a1-01 | capturado | em andamento | pendente | ativo |
| 4 | s-a1-classify | capturado | PASS (14 dims ≥9) | pendente | Fase 2 DONE |
| 5 | s-a1-vote | pendente | pendente | pendente | — |
| 6 | s-a1-damico | pendente (stale) | pendente | pendente | — |
| 7 | s-a1-baveno | pendente | pendente | pendente | — |
| 8 | s-a1-fib4 | pendente | pendente | pendente | — |
| 9 | s-a1-rule5 | pendente | pendente | pendente | — |
| 10 | s-a1-meld | pendente | pendente | pendente | — |
| 11 | s-cp1 | pendente (stale) | pendente | pendente | — |

### Act 2 (17 slides) — BLOQUEADO (Act 1 pendente)
### Act 3 (11 slides) — BLOQUEADO (Act 2 pendente)
### Appendix (8 slides) — BLOQUEADO (Act 3 pendente)

---

## Execution Log

> Registro explicito de cada gate executado por slide. Modelo para futuras sessoes.

### s-a1-classify — 2026-03-17

**Gate 1: Constraint Check**
| Check | Ferramenta | Resultado |
|-------|-----------|-----------|
| h2 = assercao | Read HTML | PASS — "O estadiamento esta fortemente associado ao prognostico" |
| Zero ul/ol | Grep HTML | PASS — 0 matches |
| aside.notes com timing | Read HTML | PASS — 3 segmentos [0:00-0:30], [0:30-1:00], [1:00-1:15] |
| Sem display no section (E07) | Grep style= | PASS — apenas opacity:0 em source-tag |
| PMIDs com [DATA] | Read notes | PASS — 3 PMIDs (16298014, 37916970, 30910320) |
| .no-js/.stage-bad failsafes | Grep cirrose.css | PASS — cards + further-decomp + predesci cobertos |
| Headline match manifest | lint:narrative-sync | PASS |

**Gate 2 passo 1: Layout Metrics**
- Metodo: visual (screenshot 1280x720 via Playwright)
- Fill ratio: ~82% (visual estimate — metrics JSON nao extraido)
- Panel overlap: nenhum
- PENDENCIA: metrics JSON formal nao extraido. Usar `page.evaluate()` nos proximos slides.

**Gate 2 passo 2: Claude Vision 7-dim**
- Metodo: analise visual direta do screenshot (Read PNG)
- PENDENCIA: prompt padronizado do QA-WORKFLOW nao usado formalmente. Integrar nos proximos slides.

**Gate 2 passo 3: Contraste (a11y)**
- Metodo: Playwright in-browser (canvas toRGB + WCAG luminance calc)
- 13 pares testados:

| Par | Ratio | Min | Resultado |
|-----|-------|-----|-----------|
| Card outcome (1%/ano) — text-muted on bg-card | 9.36:1 | 6:1 | PASS |
| Card assertion — text-primary on bg-card | 19.10:1 | 6:1 | PASS |
| PREDESCI label — text-muted on safe-light | 8.00:1 | 6:1 | PASS |
| PREDESCI outcome — text-secondary on safe-light | 12.84:1 | 6:1 | PASS |
| HR 0.51 hero (large) — safe on bg-surface | 7.50:1 | 4.5:1 | PASS |
| CI annotation — text-secondary on bg-surface | 14.62:1 | 6:1 | PASS |
| Further source — text-muted on warning-light | 7.83:1 | 6:1 | PASS |
| Further text — text-primary on warning-light | 12.55:1 | 6:1 | PASS |
| Headline (large) — text-primary on bg-surface | 18.59:1 | 4.5:1 | PASS |
| Section tag — text-secondary on bg-surface | 14.62:1 | 6:1 | PASS |
| Safe icon (✓) — safe on bg-card | 7.71:1 | 4.5:1 | PASS |
| Warning icon (⚠) — warning on bg-card | 3.77:1 | 4.5:1 | **FAIL** |
| Danger icon (✕) — danger on bg-card | 6.22:1 | 4.5:1 | PASS |

**Gate 2 passo 4: Score 14 dims**

| Dim | Score | Evidencia |
|-----|-------|-----------|
| H | 9 | Section tag → headline → patient → PREDESCI → cards → further decomp |
| T | 9 | Mono numeros, body texto, caption sources |
| E | 9 | Fill 82%, gaps consistentes, sem clipping |
| C | 9 | 13/13 PASS apos fix warning icon (7.03:1) |
| V | 9 | Cards color-coded + callouts. Sem decoracao gratuita |
| K | 9 | Consistente com design system |
| S | 9 | OKLCH tokens, sem AI markers |
| M | 10 | Assercao + 3 cards safe→warning→danger = historia completa |
| I | 9 | Stagger auto + click-reveal source |
| D | 10 | 3 PMIDs verificados via PubMed WebFetch. HR com IC95% |
| A | 9 | Icons reforçam cor. Warning icon 7.03:1 apos fix |
| L | 9 | 3 cards (Cowan 4±1). 2 conceitos claros |
| P | 9 | Decisao clinica direta. Caso ancora |
| N | 9 | Setup role. safe→danger + further decomp = tensao crescente |

**Gate 3: Fix Loop**
- 1 fix aplicado: `.classify-card--warning .classify-card-icon: --warning → --warning-on-light` (E15)
- Re-verificacao: 3.77:1 → 7.03:1 PASS
- Iteracoes: 1/3

**Gate 4: Docs + Commit + Sync**
- AUDIT-VISUAL.md: scorecard atualizado (14 dims ≥9)
- HANDOFF.md: s-a1-classify marcado DONE
- CHANGELOG.md: entry QA polish adicionada
- Commit: `6607898` — `fix(cirrose): s-a1-classify QA polish — warning icon contrast E15`
- Push: OK
- Notion: CIRR-A1-CLASSIFY — Visual QA → pass, Headline PT atualizado, Dado Verificado → Yes
- PMIDs: 3/3 verificados via PubMed (WebFetch)

**Gemini 2.5 Flash (per-slide):**

| Dim | Score |
|-----|-------|
| visual_hierarchy | 4/5 |
| spacing | 4/5 |
| typography | 4/5 |
| contrast | 5/5 |
| fill_ratio | 4/5 |
| cognitive_load | 4/5 |
| composition | 4/5 |
| Issues | Patient data denso; PREDESCI label pequeno |

**Hyperbolic/Qwen VL-72B (per-slide):**

| Dim | Score |
|-----|-------|
| visual_hierarchy | 4/5 |
| spacing | 3/5 |
| typography | 4/5 |
| contrast | 5/5 |
| fill_ratio | 3/5 |
| cognitive_load | 4/5 |
| composition | 4/5 |
| Issues | Sidebar (case panel = overlay externo, desconsiderar) |

---

## Sessao Tipo (estimativa)

Uma sessao tipica cobre 3-4 slides:

```
[0:00]  Build + dev server
[0:05]  Batch screenshots do ato (Fase 1)
[0:10]  Slide 1 — Gate 1 + Gate 2 + Score
[0:25]  Slide 1 — Fix (se necessario)
[0:35]  Slide 1 — Re-audit → PASS
[0:40]  Slide 2 — Gate 1 + Gate 2 + Score
[0:55]  Slide 2 — Fix → PASS
[1:05]  Slide 3 — Gate 1 + Gate 2 + Score → PASS (sem fix)
[1:10]  Commit batch + HANDOFF + CHANGELOG
[1:15]  Fase 3 (dynamic) para slides com anim
[1:30]  Fim
```

**Regra dos 3 commits:** A cada 3 slides PASS, commitar.
**Regra anti-drift:** Se > 30min sem PASS em nenhum slide, pausar e reavaliar.

---

## Tooling

| Ferramenta | Disponivel | Modelo/Via | Uso |
|-----------|-----------|------------|-----|
| Playwright (via npx) | SIM | — | Screenshots, navegacao, contraste in-browser, video |
| Claude Vision (nativo) | SIM | Opus 4.6 | Audit visual 7-dim de screenshots |
| Gemini API (per-slide) | SIM (Tier 1) | `gemini-2.5-flash` | Visual audit 7-dim por slide |
| Gemini API (Fase 4 final) | SIM (Tier 1) | `gemini-3.1-pro-preview` + `3.1-flash-lite-preview` | Deck-level cross-slide + video |
| Hyperbolic API | SIM | `Qwen/Qwen2.5-VL-72B-Instruct` | Visual review complementar |
| lint:slides | SIM | — | Constraint check automatizado |
| Notion MCP (claude.ai) | SIM | — | Sync status slides |
| PubMed (WebFetch) | SIM | — | Validar PMIDs |

### Acesso a API keys em sessao Claude Code

Keys estao no Windows User env vars. Se sessao nao herdar (snapshot do inicio):
```bash
export GEMINI_API_KEY="$(powershell -Command "[System.Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'User')")"
export HYPERBOLIC_API_KEY="$(powershell -Command "[System.Environment]::GetEnvironmentVariable('HYPERBOLIC_API_KEY', 'User')")"
```

### Modelos Gemini disponiveis (Tier 1, marco/2026)

| Modelo | Contexto | Uso recomendado |
|--------|----------|-----------------|
| gemini-2.5-flash | 1M input | Per-slide visual audit (rapido, barato) |
| gemini-2.5-pro | 1M input | Analise profunda se 2.5-flash insuficiente |
| gemini-3-flash-preview | 1M input | Alternativa rapida ao 2.5 |
| gemini-3.1-pro-preview | 1M input | Fase 4: deck-level (melhor visual reasoning) |
| gemini-3.1-flash-lite-preview | 1M input | Fase 4: segundo reviewer barato |

### chrome-devtools MCP (novo — 2026-03-16)

Permite inspecionar o browser sem abrir DevTools manualmente:
- **Console:** capturar erros JS durante animacoes (substitui G6 manual)
- **Computed styles:** verificar valores CSS resolvidos (contraste real, font-size computado)
- **Performance:** profiling de GSAP timelines pesadas (util para slides com muitos countUp)

Integrar em:
- **Gate 1 (Constraint Check):** capturar console errors automaticamente
- **Gate 2 (Static Visual):** verificar computed contrast ratio vs threshold
- **Fase 3 (Dynamic):** profiling de animacoes > 16ms frame time

### Pendencia: HYPERBOLIC_API_KEY

A key existe no Windows user env (`sk_live_bMvci27S...`) mas nao e herdada pelo bash do Claude Code.
Fix: adicionar ao `.env` do projeto ou exportar manualmente no terminal.

---

## Referencia

- AUDIT-VISUAL.md — rubrica 14 dimensoes + scorecards
- HANDOFF.md — estado e caminho critico
- .claude/rules/motion-qa.md — heuristics de animacao
- .claude/rules/design-principles.md — 27 principios (Duarte, Tufte, Sweller, Knowles)
- memory/reference_visual_audit_tools.md — stack de audit visual MCPs

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
| 4 | s-a1-classify | pendente | pendente | pendente | — |
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

| Ferramenta | Disponivel | Uso |
|-----------|-----------|-----|
| Playwright (via npx) | SIM | Screenshots, navegacao, metrics, video |
| Claude Vision (nativo) | SIM | Audit visual 7 dimensoes de screenshots |
| lint:slides | SIM | Constraint check automatizado |
| Gemini MCP (@fre4x/gemini) | SIM (GEMINI_API_KEY OK) | Fase 4: deck-level static+dynamic |
| a11y-contrast MCP | SIM (sem key) | Fase 2: verificacao contraste WCAG |
| frontend-review MCP (Hyperbolic) | PARCIAL (key em env Windows, nao em bash) | Before/after visual diff |
| chrome-devtools MCP | SIM (sem key) | Console errors, computed styles, performance profiling |

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

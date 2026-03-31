# AUDIT-VISUAL Archive — Scorecards Detalhados

> Scorecards detalhados arquivados de `AUDIT-VISUAL.md` em 2026-03-29.
> Consultar sob demanda. Slides ativos (DONE* recente, QA) permanecem em `AUDIT-VISUAL.md`.

---

## Pre-Act 1

### s-title (00-title.html) — DONE (QA 5-stage PASS)

**Headline:** Cirrose Hepática (h1, não h2 — archetype title)

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 8    | h1 56px (#deck specificity fix), pilares + identity subordinados |
| T   | 7    | System font fallback (Vite base path issue, deferido). Clamp sizing funcional |
| E   | 5 ★ | Fill ~25-30%. Intencional por archetype |
| C   | 9    | Pillar dots fix: var(--ui-accent) = 9.98:1 AAA |
| V   | 5 ★ | Texto + brasao. Intencional por archetype |
| K   | 8    | Archetype title consistente |
| S   | 7    | Limpo. OKLCH tokens |
| M   | 5 ★ | h1 = rotulo de topico. Intencional por archetype |
| I   | 9    | Estatico |
| D   | 9    | Sem dados clinicos necessarios |
| A   | 9    | AAA verificado. aria-hidden em dots |
| L   | 9    | 17 palavras. Zero extraneous |
| P   | 6 ★ | Sem decisao clinica. Intencional |
| N   | 7    | Ancora identidade visual. tensionLevel=0 |

★ = intencional por archetype (nao forcar nota 9)
Fixes: ERRO-036 (h1 specificity), ERRO-037 (pillar dots). Gemini 3.1 Pro PASS 9/10.

### s-hook (01-hook.html)

**Headline:** Caso Antônio · Qual sua conduta?

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 8    | Nome serif h1 domina. Labs grid 3x2. Punchline bold = payoff |
| T   | 8    | 4 camadas: serif h1 → sans body → mono h3 → serif bold |
| E   | 8    | space-evenly. Fill ~68% S0, ~80% S1. Zero overflow 1920 |
| C   | 8    | Tokens escopados a #s-hook. Shadow visivel |
| V   | 8    | 6 lab cards como evidencia visual |
| K   | 8    | Cards uniformes (intencional) |
| S   | 8    | GSAP stagger labs + click-reveal punchline |
| M   | 8    | "Sem queixas." bold = assertion implicita. "Qual sua conduta?" = CTA |
| I   | 8    | 1 clickReveal. Advance+retreat OK |
| D   | 8    | Dados conferem com CASE.md |
| A   | 8    | Ref text weight 500. Shadow + border |
| L   | 8    | 2 conceitos (paciente + pergunta). 6 labs natural |
| P   | 8    | Caso clinico. Prompt de decisao |
| N   | 8    | Inciting incident. tensionLevel=3. narrativeCritical=true |

Obs: Hook sem h2 formal (design choice). Failsafes .no-js/.stage-bad. Grid 3x2 80%.

---

## Act 1

### s-a1-01 (02-a1-continuum.html)

**Headline:** Por que rastrear?

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 7    | Hero "83%" proeminente (clamp 64-96px). Pathway adiciona estrutura |
| T   | 8    | Numero hero grande. h2 1 linha |
| E   | 7    | Fill ~65% pos-fix |
| C   | 8    | var() tokens. Icones daltonismo |
| V   | 8    | Hero stat "83%" + pathway 3-step |
| K   | 8    | archetype-hero-stat reutilizado |
| S   | 8    | Source-tag opacity:0 para GSAP. OKLCH |
| M   | 8    | h2 setup retorico; hero 83% carrega assercao |
| I   | 8    | Auto-GSAP sequence: SplitText → countUp → metrics → guideline → ghost rows |
| D   | 9    | 3 PMIDs verificados. [DATA] tags. Zero [TBD] |
| A   | 8    | Icones warning/check com cor |
| L   | 7    | 2 conceitos. 106 palavras total (com hidden). Denso |
| P   | 8    | Relevancia screening explicita. Pathway acionavel |
| N   | 8    | Setup role. tensionLevel=2 |

Gate 0 PASS (9/9). Gate 4 R1 6.75/10. Gate 4 R7 8.5/10 DONE.

### s-a1-classify (02c-a1-classify.html)

**Headline:** Estadiamento × Prognóstico

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 9    | Section tag → headline → 3 cards → further decomp |
| T   | 9    | h2 42px Instrument Serif 400. Mono hero, body DM Sans |
| E   | 9    | Fill ~80%. Cards gap:16px pad:16px 24px |
| C   | 9    | 13/13 pares PASS (>=4.5:1). Badge-fatal editorial |
| V   | 9    | 3 cards color-coded + further decomp grid |
| K   | 9    | archetype-hero-stat. Padrao cards+grid consistente |
| S   | 9    | Source-tag, stagger, OKLCH. ScrambleText removido |
| M   | 10   | h2 assercao. 3 cards provam com mortalidade. safe→warning→danger |
| I   | 9    | 1 clickReveal. Stagger auto. Retreat OK |
| D   | 10   | D'Amico 2006 + 2024 no source-tag |
| A   | 9    | Icones ✓⚠✕. Warning 7.03:1. Todos >=6:1 |
| L   | 9    | 3 cards (Cowan). PREDESCI movido p/ baveno |
| P   | 9    | Estadiamento → prognostico = decisao clinica |
| N   | 9    | Setup. tensionLevel=2. Precede baveno |

Gate 0 PASS (R5). Gate 4 R7 7.3/10 DONE.

### s-a1-baveno (03-a1-baveno.html)

**Headline:** Doença hepática avançada é espectro, não diagnóstico binário

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 8    | Paradigm shift (old→new). PREDESCI lockup (HR hero) |
| T   | 8    | PREDESCI hero 86px. HR · p=0,041 |
| E   | 8    | Grid 3-col: 0,51 centrado. Fill ~65% S0 → ~85% S2 |
| C   | 7    | Espectro --safe/--danger. Verificar contraste |
| V   | 8    | SplitText dissolve + gradient bar + PREDESCI card |
| K   | 8    | archetype-hero-stat |
| S   | 8    | SplitText dissolve. autoComplete guard |
| M   | 8    | h2 assercao. ~21 palavras corpo |
| I   | 7    | 1 clickReveal. autoComplete bloqueia click durante dissolve |
| D   | 9    | PMIDs + p=0,041 verificado PubMed. HR 0,51 IC 0,26-0,97 |
| A   | 7    | aria-hidden em paradigm-old/bar |
| L   | 8    | 2 conceitos separados por click |
| P   | 8    | PREDESCI = "intervir muda desfecho" |
| N   | 8    | tensionLevel=1 (pausa narrativa intencional) |

Gate 0 PASS. Gate 4 R5 DONE.

### s-a1-cpt (02b-a1-damico.html) — CONTENT

**Headline:** De Child-Pugh a D'Amico: prognóstico virou preditivo

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 7    | 3 eras competem mas spacing controlado |
| T   | 7    | Era badges, CTP classes, c-stat value. Denso |
| E   | 7    | Fill ~90% pos-fix |
| C   | 8    | ctp-class--a/b/c + pathway-stage semantico. 5 PMIDs |
| V   | 8    | CTP pills + MELD c-stat + D'Amico pathway |
| K   | 7    | archetype-flow. Era track unico |
| S   | 8    | Source-tag. CountUp c-stat |
| M   | 8    | h2 com arco evolutivo. ~105 palavras |
| I   | 8    | 2 clickReveals. State machine |
| D   | 9    | 5 PMIDs verificados. Zero [TBD] |
| A   | 7    | Conteudo denso pode prejudicar legibilidade |
| L   | 7    | 3 conceitos em 1 slide. Split futuro no backlog |
| P   | 7    | 3 eras = pesado. Conexao com decisao indireta |
| N   | 8    | Setup. tensionLevel=2 |

### s-a1-rule5 (03d-a1-rule5.html) — CONTENT

**Headline:** A cada 5 kPa, muda o estágio e a conduta

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 8    | 5 zones dominam canvas. Antonio pin focal |
| T   | 8    | Zone ranges, labels, directives dimensionados |
| E   | 8    | Fill 72-83%. 5 zones stacked |
| C   | 8    | 5-tier semantico. Icones daltonismo |
| V   | 9    | **Melhor visual do Act 1.** Antonio pin personalizado |
| K   | 8    | archetype-flow. Zone pattern unico |
| S   | 8    | ScaleY zones. Pin bounce. GSAP |
| M   | 8    | h2 assercao. Visual prova o claim |
| I   | 8    | 2 clickReveals. Zone scaleY. Pin drop |
| D   | 9    | 2 PMIDs. Zone thresholds de Baveno VII |
| A   | 8    | 5 icones distintos. Labels descritivos |
| L   | 8    | 1 conceito. 5 zones = chunks |
| P   | 9    | Slide mais acionavel: kPa → estagio → conduta |
| N   | 8    | Setup. tensionLevel=2 |

### s-a1-meld (04-a1-meld.html) — CONTENT

**Headline:** MELD-Na estratifica urgência: cada faixa muda a conduta

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 8    | 4 bandas semaforo dominam. h2 1 linha |
| T   | 8    | MELD ranges, mortalidade %. CSS dots |
| E   | 8    | Fill 74-85%. Bandas stacked |
| C   | 8    | meld-band--green/yellow/orange/red. var() |
| V   | 8    | Semaforo 4-bandas = visual dominante |
| K   | 8    | archetype-hero-stat. Internamente consistente |
| S   | 8    | Band stagger. Width transition. OKLCH |
| M   | 8    | h2 assercao clinica |
| I   | 8    | 2 clickReveals. Band stagger |
| D   | 8    | 3 fontes (Kamath, Kim, UNOS). Source-tag autor+ano |
| A   | 8    | CSS dots. Acoes com icones |
| L   | 8    | 1 conceito. 4 bandas = chunks |
| P   | 8    | Semaforo = arvore de decisao |
| N   | 8    | Setup. tensionLevel=2 |

### s-cp1 (07-cp1.html) — CONTENT

**Headline:** LSM 21 kPa, plaquetas 112k. Como você estadia?

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 7    | Case data + poll buttons. Sem hero visual |
| T   | 8    | .poll-question consistente |
| E   | 8    | Fill 85%. Layout checkpoint 2-colunas |
| C   | 8    | data-severity="caution". var() |
| V   | 7    | Case card + poll. Sem chart |
| K   | 8    | archetype-checkpoint consistente |
| S   | 7    | Sem GSAP. JS inline poll |
| M   | 8    | h2 usa dados clinicos no headline |
| I   | 8    | Poll buttons click → correct/wrong + feedback |
| D   | 9    | PREDESCI PMID no feedback. CASE.md match |
| A   | 8    | Botoes nativos. aria-labels |
| L   | 8    | 1 conceito. 3 choices chunked |
| P   | 9    | Decisao clinica direta. Core adult learning |
| N   | 9    | Checkpoint role. narrativeCritical=true |

---

## Rodada 3 Consolidada (10/mar/2026)

Agente: Claude Code (Opus 4.6) · Metodo: Playwright Chromium headless 1280x720 · 27 screenshots

### Fixes aplicados

**Rodada 2 (09/mar):** stage-c hook contraste, baveno gap, meld threshold opacity, rule5 compactness, damico h2 + rule5 h2 reescritos, rule5 conteudo → notes.
**Rodada 3 (10/mar):** _manifest.js 2 headlines sync, narrative.md 2 headlines sync, 5 HTML slides 11 countUp fallbacks.
**Rodada 4:** ERRO-030 emoji→CSS dots, ERRO-031 var()→HEX, D'Amico orphaned padding.
**Rodada 5:** ERRO-032 D'Amico chromatic, ERRO-033 interaction bugs (stopPropagation, retreat DOM, leave+return).

### Problemas remanescentes

| # | Problema | Slide(s) | Status |
|---|---------|----------|--------|
| R2 | h2 2 linhas | s-a1-cpt | Lucas decide |
| R4 | Fill 0% beat 0 | s-hook | Design decision |
| R6 | beat 1 clipar 720p | s-hook | CSS audit pendente |

---

## Act 2 + CP2 — Browser QA (09/mar/2026)

**Status: PASS condicional** · 46 screenshots · 16 slides cobertos

P1 pendencias: h2 longo s-a2-01, monotonia visual (6/7 flow-cascade), [TBD] em notes s-a2-04 e s-a2-09.
Destaques: s-a2-07 (carvedilol 4 states), s-a2-11 (HRS 3 perguntas), s-a2-04 (bar chart).

## Act 3 + Close — QA PENDENTE

9 slides. 4/7 skeletons. QA apos preenchimento.

## Appendix — QA PENDENTE

8 slides. Baixa prioridade (nao projetado em congresso).

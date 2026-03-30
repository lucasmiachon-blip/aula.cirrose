# AUDIT-VISUAL — Cirrose (por Atos)

> Auditoria visual organizada por Atos narrativos.
> Deck: 44 slides (2 pre + 8 Act 1 + 15 Act 2 + 7 Act 3 + 3 CP + 1 close + 8 app)
> Rubrica: **14 dimensoes**, scoring 1-10 (min 9 para PASS).
> Metodo: Playwright screenshot 1280x720 por estado (S0..SN) + constraint check + checklist.
> Referencia: AASLD/EASL Postgraduate Course slides + Duarte Sparkline + Sweller CLT + Knowles.
> Atualizado: 2026-03-29 — rubrica 14 dimensoes (H/T/E/C/V/K/S/M/I/D/A/L/P/N).
> Scorecards detalhados de slides pre-Act1 e CONTENT: `AUDIT-VISUAL-ARCHIVE.md`.

---

## Rubrica de Scoring (14 dimensoes, 1-10)

> PASS = todas 14 dimensoes >= 9. WARN = qualquer entre 7-8. FAIL = qualquer < 7.

### Dimensoes visuais

| Dim | Nome | 1-3 (Critico) | 4-6 (Aceitavel) | 7-8 (Bom) | 9-10 (Referencia AASLD) |
|-----|------|---------------|-----------------|-----------|------------------------|
| **H** | Hierarquia Visual | Headline compete com corpo; nada domina | Headline > corpo, mas hero fraco | Hero 1,5-2x, F-pattern reconhecivel | Hero 2-3x, Von Restorff claro, F/Z-pattern |
| **T** | Tipografia | Font generica, tamanhos uniformes | Scale correto, sem refinamento | Instrument Serif + DM Sans, escala OK | Escala clamp fluida, kerning, tabular-nums hero |
| **E** | Espaco & Layout | Cramped ou >40% vazio; desalinhado | Preenchimento 50-65%, alinhamento OK | Fill 65-80%, grid consistente | Fill ratio ideal por archetype, whitespace intencional |
| **C** | Cor & Contraste | Cores decorativas; <4.5:1; HEX hardcoded | Semantica OK, >=4.5:1, maioria var() | OKLCH tokens, safe/warning/danger, >=4.5:1, zero HEX | OKLCH completo, >=7:1 body, icones daltonismo |
| **V** | Visuais & Figuras | So texto; tabela Excel | Alguma evidencia visual | Dados = visual (bar, card, timeline) | Tufte; visual dominante; hero metric integrado |
| **K** | Consistencia | Cada slide = layout diferente | Mesmo tipo ~ mesmo layout | Archetypes reutilizados, spacing similar | Archetypes identicos, spacing pixel-perfect |
| **S** | Sofisticacao | Parece Word; bordas pesadas | Clean mas generico | Source-tag presente, OKLCH, transitions | Micro-interacoes, GSAP polish, stage-bad failsafe |
| **M** | Comunicacao | Headline = rotulo; bullets; >50 palavras | Assertion OK mas corpo confuso ou >30 palavras | Assertion-evidence; corpo <=30 palavras | Assertion-evidence perfeito; visual prova o claim |

### Dimensoes tecnico-pedagogicas

| Dim | Nome | 1-3 (Critico) | 4-6 (Aceitavel) | 7-8 (Bom) | 9-10 (Referencia) |
|-----|------|---------------|-----------------|-----------|-------------------|
| **I** | Interacoes | JS quebrado; click avanca slide; sem retreat | advance funciona; retreat parcial; sem Plan B | advance+retreat OK; Plan B (.stage-bad) funciona | Todos estados testados; stopPropagation; leave/return reseta; Plan B perfeito |
| **D** | Dados clinicos | Dado inventado; PMID errado; [TBD] em source-tag | Dados corretos mas sem PMID; IC95% ausente | PMID verificado; NNT com IC95%; [TBD] so em notes | Tier-1 fonte; NNT+IC95%+timeframe; [DATA] tag em notes; zero [TBD] projetado |
| **A** | Acessibilidade | <3:1 contraste; sem navegacao teclado | >=4.5:1 body; teclado parcial | >=4.5:1 body, >=3:1 hero; foco visivel | >=7:1 body; icones ✓/⚠/✕ com cor; tab order correto; aria-labels |
| **L** | Carga cognitiva (Sweller) | >3 conceitos/slide; extraneous load alto | 2-3 conceitos; algum ruido | 1-2 conceitos; germane load dominante | 1 conceito central; extraneous eliminado; chunking visual claro |
| **P** | Aprendiz adulto (Knowles) | Conteudo desconectado da pratica; >9 chunks | Relevancia clinica implicita; 7-9 chunks | Relevancia explicita; <=7 chunks; schema activation | "E dai?" obvio; <=5 chunks; decisao clinica acionavel; caso ancora |
| **N** | Arco narrativo (Duarte) | Headline = rotulo generico; sem tensao | Assertion presente mas tensao plana | Assertion clinica; tensao coerente com narrative.md | Sparkline visivel; callbacks ao hook; tensao precisa; narrativeCritical respeitado |

---

## Issues Sistemicos (referencia global)

- **SYS-1: Case panel clipping** — Conteudo clipado/truncado pelo case panel. Fix: panel responsivo. (dim: E, H)
- **SYS-2: Fill ratio <60%** — Espaco vazio >40%. Fix: padding/max-width archetypes. (dim: E)
- **SYS-3: Hero typography undersized** — Numero/dado hero em `--text-h1` em vez de `--text-hero`. (dim: H, T)

## Protocolo de auditoria (3 gates)

### Gate 0 — Inspeção de Defeitos (Gemini, binario, $0.002)

Defeitos visuais mecanicos (clipping, overflow, overlap, invisible, missing_media, animation_state, alignment, spacing, readability). PASS/FAIL. MUST FAIL bloqueia Gate 2 e Gate 4.

```bash
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --inspect
```

Prompt: `docs/prompts/gemini-gate0-inspector.md`. Output: `qa-screenshots/{id}/gate0.json`.

### Gate 2 — Opus Visual Audit (Claude, $0)

Claude Opus analisa PNG S2 + raw code usando MCP tools (sharp, a11y). 3 camadas:

| Layer | Ferramenta | Mede |
|-------|-----------|------|
| A — Instrumental | sharp pick_color + a11y check_color_contrast | Cores reais, contraste WCAG |
| B — Code | Read + Grep | E52, dead CSS, failsafes, token compliance |
| C — Visual | Read multimodal (PNG) | Hierarquia, whitespace, tipografia, cor semantica |

MUST FAIL bloqueia Gate 4. Protocolo completo: `@repo/docs/prompts/gate2-opus-visual.md`.
Output: `qa-screenshots/{id}/gate2-report.md`.

### Gate 4 — Editorial (Gemini, $0.03-0.08)

Raw HTML + Raw CSS + Raw JS + PNGs S0/S2 + video .webm → Gemini avalia hierarquia, flow, legibilidade, daltonismo, densidade. Gemini so sugere — Opus executa fix.
Prompt: `docs/prompts/gemini-gate4-editorial.md`. Spec completa: `WT-OPERATING.md` §4 QA.3.

---

## Act 1 — QA Status

**Status:** 7 DONE* (s-title, s-hook, s-a1-01, s-a1-classify, s-a1-baveno, s-a1-fib4*, s-a1-elasto*), 4 CONTENT (s-a1-damico, s-a1-rule5, s-a1-meld, s-cp1).
*s-a1-fib4 DONE* = cor_contraste 7/10, aceito por prazo.
Lints: lint:slides PASS · lint:case-sync PASS · lint:narrative-sync PASS

### s-a1-fib4 (03b-a1-fib4calc.html) — DONE* R9 8.8/10

**Headline:** Modelos Preditivos: FIB-4
**Design:** Progressive Spectrum (redesign 29/mar). Barra horizontal persistente, 3 segmentos (safe/gray/danger). Cada beat adiciona sem apagar.

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 9    | Bar segments dominam canvas. Von Restorff na assimetria safe/danger. |
| T   | 9    | DM Sans 500 tabular-nums (de-bold R9). Letter-spacing 0.04em. |
| E   | 8    | Fill ~60%. min-width:0 trava flex 3:4:3. Source-tag cascade blindada. |
| C   | 7    | **Ponto fraco.** Safe pastel 25%, gray neutro, danger puro. Aceito por prazo. |
| V   | 9    | Barra = visual dominante. Danger unico segmento saturado. Flags ancorados (border-bottom navy). |
| K   | 8    | Layout unico, spacing/radius consistente com design system. |
| S   | 9    | ScaleX grow instructional. Stagger flags. OKLCH completo. |
| M   | 8    | h2 = rotulo (decisao do autor). S2 final = 41 palavras (aceito por Lucas). |
| I   | 9    | advance/retreat robusto. Leave/return reseta. Failsafe no-js/stage-bad. |
| D   | 9    | 13 refs tier-1 em evidence-db. [DATA] tags em notes. |
| A   | 10   | Icones ✓/⚠/✕ junto a cor semantica. Grid flags acessivel. |
| L   | 9    | 1 conceito (FIB-4 como triagem). 3 beats = chunking natural. |
| P   | 9    | Pitfalls = pratica diaria. Sidebar calc ao vivo. "E dai?" claro. |
| N   | 8    | Setup role. tensionLevel=2. Gateway → elastografia. |

Obs: (1) Redesign completo 29/mar. (2) H2 rotulo por decisao do autor. (3) Gate 2 STALE (layout antigo). (4) 41 palavras S2 aceito por Lucas. (5) *cor_contraste 7/10 aceito por prazo.

### s-a1-elasto (03c-a1-elasto.html) — DONE* R4 8.5

**Headline:** Fibroscan, MRE e outros métodos não invasivos
**Design:** 3 beats progressivos (confounders → MASLD hero → MRE escape). Custom CSS + registry state machine.

| Dim | Nota | Evidencia |
|-----|------|-----------|
| H   | 9    | R3: confounders subordinados (bg-card, shadow sutil), MASLD hero Von Restorff (bg-elevated, shadow forte, border 2px, valores text-h2), MRE rodape (border-top, sem radius). |
| T   | 10   | R3-R4: Instrument Serif titulo, DM Sans body. Scale clamp completa. tabular-nums nos dados. |
| E   | 8    | R3-R4: macro-whitespace (MASLD space-md, MRE space-md). Source-tag max-width 85% centered + padding-bottom. Fill ratio ~85% S2. |
| C   | 10   | R4: bg-surface→bg-card→bg-elevated escada de profundidade. Confounders com shadow sutil, MASLD com shadow forte. Cores semanticas danger/warning/safe corretas. |
| V   | 7    | Dados = cards tipograficos. MASLD 90→63% hero numerico. Sem grafico/visual dominante. |
| K   | 8    | Layout custom unico. Spacing/radius/tokens consistentes com design system. |
| S   | 8    | Failsafes .no-js + .stage-bad completos (incl. source-tag, masldValues, arrow). GSAP timeline+scale+fromTo. |
| M   | 7    | h2 = rotulo (decisao autor). S2 = 83 palavras (aceito, 3 beats progressivos via click-reveal). |
| I   | 10   | advance/retreat simétricos. Leave/return reseta. stopPropagation. Plan B funcional. |
| D   | 9    | 12 PMIDs verificados. 4 citacoes em source-tag. [DATA] tags em notes. ICC card: PMID 37908293. |
| A   | 9    | Gate 2: 13/13 AA PASS. Icones em todos confounders. aria-hidden OK. |
| L   | 9    | R3-R4: 3 grupos Gestalt claros (Proximidade via macro-whitespace). Cowan respeitado (4 confounders stagger + 2 clicks). |
| P   | 8    | Confounders = pratica diaria. MASLD gap = "e dai?" clinico. ANTICIPATE-NASH = conduta. |
| N   | 8    | payoff role. MASLD gap = tensao central. Callback FIB-4 anterior. |

**Media:** 8.6/10
**Status:** DONE* — Gate 0 PASS, Gate 2 PASS R2, Gate 4 R4 8.5/10.
Pipeline: R1 6.6→fix hierarquia+anim→R2 6.8 (CSS truncado corrigido)→R3 9.1 (macro-whitespace)→R4 8.5 (contraste cards). Lucas aprovou. ICC card atualizado: "↑ com PVC → falso F3–F4".
Obs: (1) Word count 83 aceito (3 beats). (2) composicao 8 (fill ratio alto, aceito). (3) Bug fix gemini-qa3: CSS section extraction regex.

---

## Tabela consolidada (todos os slides)

| # | ID | Status | Notas |
|---|-----|--------|-------|
| 1 | s-title | DONE | QA 5-stage PASS 18/mar |
| 2 | s-hook | DONE | v17 QA 5-stage PASS |
| 3 | s-a1-01 | DONE | Gate 0 PASS. Gate 4 R7 8.5/10 |
| 4 | s-a1-classify | DONE | Gate 0 PASS. Gate 4 R7 7.3/10 |
| 5 | s-a1-baveno | DONE | Gate 0 PASS. Gate 4 R5 |
| 6 | s-a1-damico | CONTENT | 3 eras, ~105 palavras. L=7, split futuro no backlog |
| 7 | s-a1-fib4 | DONE* R9 8.8 | cor_contraste 7/10 aceito. Gate 2 STALE |
| 8 | s-a1-elasto | DONE* R4 8.5 | Gate 4: R1 6.6→R2 6.8→R3 9.1→R4 8.5. Aprovado. |
| 9 | s-a1-rule5 | CONTENT | Melhor visual do Act 1 (V=9). 5 zones + Antonio |
| 10 | s-a1-meld | CONTENT | Semaforo 4-bandas. CSS dots |
| 11 | s-cp1 | CONTENT | Checkpoint poll. N=9 |
| 12-26 | Act 2 (s-a2-01 → s-cp2) | CONTENT | Browser QA PASS (09/mar). Pendente: gate pipeline |
| 27-34 | Act 3 + Close | CONTENT | QA NAO INICIADO. 4/7 skeletons |
| 35-44 | Appendix | CONTENT | QA NAO INICIADO. Baixa prioridade |

Scorecards detalhados dos slides DONE (s-title, s-hook, s-a1-01, s-a1-classify, s-a1-baveno) e CONTENT (s-a1-damico, s-a1-rule5, s-a1-meld, s-cp1): `AUDIT-VISUAL-ARCHIVE.md`.

---

## Fix Backlog Sistemico (referencia global)

### Tier 1: Sistemico CSS (1 fix → N slides)

| # | Fix | Slides afetados | Esforco | Impacto |
|---|-----|-----------------|---------|---------|
| S1 | Case panel responsivo | ~22 | Medio | Critico |
| S2 | Content max-width: ajustar para panel ativo | ~20 | Baixo | Critico |
| S3 | Fill ratio: reduzir padding, expandir headline | ~25 | Baixo | Alto |
| S4 | Hero elements: `.hero-metric` com `--text-hero` | ~15 | Medio | Alto |
| S5 | Horizontal overflow: max-width responsivo ao panel | ~10 | Medio | Alto |

### Tier 2: Redesign (novo layout/componente)

| # | Fix | Slides | Esforco |
|---|-----|--------|---------|
| R1 | Appendix archetype compacto sem case panel | 8 | Alto |
| R2 | Hero number component: countUp + metric + CI + source-tag | Multiplos | Alto |
| R3 | Comparison layout 2-panel responsivo | 4 | Medio |

---

## Historico de sessoes QA

| Data | Escopo | Resultado |
|------|--------|-----------|
| 25/fev/2026 | 28 slides (deck antigo) — scoring visual completo | Media 2.7/5.0, 0 PASS |
| 09/mar/2026 | Pre-Act + Act 1 + CP1 (11 slides) — checklist + fixes | 3 fixes, PASS |
| 09/mar/2026 | Act 1 + Act 2 + CP2 (27 slides) — browser QA Playwright | 46 screenshots, PASS |
| 10/mar/2026 | Act 1 Rodada 3 — hardening + re-QA consolidado | 13 fixes, **PASS COM RISCOS** |
| 10/mar/2026 | Act 1 Rodada 5 — D'Amico chromatic + vote elevation | R3+ERRO-022 fechados |
| 22-27/mar | s-a1-01, classify, baveno — Gate 0+4 pipeline | 3 slides DONE |
| 29/mar | s-a1-fib4 R1→R9 — progressive spectrum | **DONE*** R9 8.8/10 |
| 30/mar | s-a1-elasto — Gate 0+2+4 R1→R4 + hierarquia/contraste/spacing fix + ICC card update | DONE* R4 8.5 |

---

## Referencias

- `shared/css/base.css` — Design system tokens OKLCH
- `.claude/rules/design-reference.md` — Tokens OKLCH (§1), tipografia (§2), principios (§4)
- `.claude/rules/slide-rules.md` — CSS errors (§8), motion QA (§9)
- AASLD Postgraduate Course 2024 — Referencia visual externa

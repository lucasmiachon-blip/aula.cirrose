# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.
> **Paths:** relativos a `aulas/cirrose/`, exceto `@repo/` = raiz do repo.

---

## Estado — 2026-03-29T21:00-03:00

**Slides:** 44 buildados · 6 DONE* · 0 QA · 1 DRAFT · 37 CONTENT · **Build/Lint/Scaling/CSS cascade:** ✅
**Branch:** `feat/cirrose-mvp` · Sprint ate 31/mar.
**Guardrails:** pre-commit (3 guards + lint) + evidence-db + guard-generated. ~~guard-product-files~~ removido.
**QA pipeline:** `WT-OPERATING.md` §4. **4 passos:** Screenshots → Gate 0 → **Gate 2 (Opus, $0)** → Gate 4 (Gemini).
**QA scripts:** TODOS VALIDADOS end-to-end (sessao 29/mar tarde). `qa-batch-screenshot.mjs` (C1-C7) + `gemini-qa3.mjs` (Gate 0 Flash + Gate 4 Pro).
**Modelos Gemini:** Gate 0 = `gemini-3-flash-preview` ($0 free tier). Gate 4 = `gemini-3.1-pro-preview` ($2/$12 per 1M). Flag `--model` para override. Pricing atualizada em ambos scripts.
**Env:** GEMINI_API_KEY OK. PERPLEXITY_API_KEY ausente.
**Pendente infra:** reorg `scripts/` em subdirs (alto risco, adiado pos-31/mar). `#slide-id-label` em deck.js (remover antes de producao).
**Scripts hardening:** ZERO-tier DONE. MINIMAL/HIGH pendentes — ref: `@repo/docs/HARDENING-SCRIPTS.md`.

### Sessao 29/mar (noite 5) — s-a1-elasto DRAFT

**O que foi feito:**

1. **Novo slide s-a1-elasto** (03c-a1-elasto.html) — Elastografia: apreciação crítica do laudo. Posição: entre fib4 e damico no manifest.
2. **Pesquisa profunda** — 3 medical-researcher agents × 3 MCPs (PubMed/BioMCP, Scite, Consensus) + Gemini Deep Research cross-validation. 12 PMIDs verificados. 6/6 claims convergentes. 1 correção: XL probe = 2,5 MHz.
3. **Conteúdo:** Beat 0 (auto): 4 confounders com magnitude (ALT +3×, pós-prandial +21%, ICC, colestase). Beat 1 (click): MASLD gap PPV 90→63% + ANTICIPATE-NASH. Beat 2 (click): MRE escape (AUROC F4 = TE, funciona ascite/obeso).
4. **9 superfícies tocadas:** HTML, CSS, manifest, registry, panelState, narrative, evidence-db, AUDIT-VISUAL, HANDOFF.
5. **H2 definido:** "Fibroscan, MRE e outros métodos não invasivos". Sincronizado em 4 superfícies.
6. **Sem archetypes** — CSS custom scoped por #s-a1-elasto.

**Pendente:** QA pipeline (screenshots → Gate 0 → Gate 2 → Gate 4). Beat futuro (estado da arte) em backlog.

### Sessao 29/mar (noite 4) — s-a1-fib4 micropolish DONE*

**O que foi feito:**

1. **Micropolish R7→R9** — Subtracao de cor e peso tipografico. Bar safe/gray desaturados (safe 25% tint, gray→`--divider` neutro). Flags revertidos a `--bg-elevated` + `border-bottom: 3px solid var(--border-navy)` (ancoragem projetor). Segment font-weight 700→500. Flag-title 700→500. Flag-detail `--text-muted`. Letter-spacing 0.02→0.04em. `min-width:0` em seg/annot (flex 3:4:3 defense). Cascade source-tag blindada (`#deck.has-panel #s-a1-fib4 .source-tag`).
2. **Gate 4 R8: 6.0/10** — Primeira tentativa (warning-light nos flags + pasteis na barra) PIOROU. Gemini confirmou: "contraste anarquico", 7+ zonas focais.
3. **Gate 4 R9: 8.8/10** — Subtracao funcionou. gestalt_cognition 4→10, tipografia 4→9. cor_contraste=7 (ponto fraco aceito).
4. **DONE*** — Marcado com asterisco: hierarquia visual OK mas nao excelente (cor_contraste 7/10). Aceito por pressao de prazo (sprint 31/mar).

**Gate 4 historico s-a1-fib4:**
- R1: 6.0 → R2: 5.5 → R3: 4.9 → R4: 5.6 → R5: 7.3 → R6: 8.8 → R7: 8.5 → R8: 6.0 → **R9: 8.8/10 DONE***

### Sessao 29/mar (noite 3) — s-a1-fib4 progressive spectrum redesign

**O que foi feito:**

1. **Redesign completo s-a1-fib4** — Layout antigo (grid-stacking, 3 estados que se substituiam como slide-dentro-de-slide) removido. Novo: **escala progressiva** — barra horizontal FIB-4 persistente com 3 segmentos (safe <1.30, gray 1.30-2.67, danger >=2.67). Cada beat ADICIONA informacao sem apagar o anterior. Motivacao: animacoes anteriores eram decorativas (fade-replace), nao instrutivas.
2. **Animacao instrutiva** — Beat 0 (auto): safe cresce da esquerda (scaleX), danger da direita, assimetria visual (safe solido, danger puro). Beat 1 (click): zona cinza preenche o centro (scaleX do centro), anotacao 30-60%. Beat 2 (click): 3 pitfall flags stagger-in abaixo da escala + source tag. Codificacao espacial: esquerda=exclusao forte, meio=zona cinza, direita=confirmacao fraca.
3. **Gate 4 R7: 8.5/10** — Gemini Pro avaliou com contexto de redesign. Animation score 9/10 ("didatica", "fisicamente instrucional"). 4 propostas implementadas: P1 MUST (danger `color-mix` removido → `var(--danger)` puro), P2 MUST (flags flex→grid `repeat(3,1fr)` — E26), P3 SHOULD (flags `bg-elevated` + `box-shadow`), P4 RADICAL (letter-spacing -0.01→0.02em).
4. **Arquivos alterados:** `slides/03b-a1-fib4calc.html` (HTML reescrito), `cirrose.css` (CSS substituido — ~170 linhas old → ~130 linhas new), `slide-registry.js` (animacao reescrita — grid-stack fade → progressive scaleX/stagger).

**Gate 4 historico s-a1-fib4:**
- R1: 6.0 → R2: 5.5 → R3: 4.9 → R4: 5.6 → R5: 7.3 → R6: 8.8 → **R7: 8.5/10** (redesign completo, score nao comparavel a R6)

**Pendente s-a1-fib4:**
- 41 palavras no estado final (max 30) — Lucas avaliou presencialmente, decidiu manter. Micropolish pendente.
- Recapturar screenshots pos-P1/P2/P3/P4 para verificacao visual.
- Gate 2 re-run (PASS anterior foi no layout antigo, invalido).

### Sessao 29/mar (tarde) — Scripts validados + s-a1-fib4 R4→R5

**O que foi feito:**

1. **QA scripts validados end-to-end** — `qa-batch-screenshot.mjs` (screenshots S0/S2 + video + checks C1-C7 + metrics.json + batch-manifest.json) e `gemini-qa3.mjs` (Gate 0 com Flash + Gate 4 com Pro) testados com dev server rodando. ZERO bugs. Pipeline desbloqueado para producao.
2. **Estrategia multi-modelo implementada** — Gate 0 usa `gemini-3-flash-preview` (free tier, $0), Gate 4 usa `gemini-3.1-pro-preview` (top-tier). Logica: CLI `--model` > env `GEMINI_MODEL` > default por mode. PRICING table atualizada nos 2 scripts (gemini-qa3.mjs + content-research.mjs) com modelos 3.x e precos corretos (2.5-flash era $0.15→$0.30).
3. **`--force-gate4` flag** — Override de Gate 0 FAIL para falsos positivos conhecidos (ANIMATION_STATE em state machines).
4. **s-a1-fib4 Gate 4 R4 (5.6/10)** — Implementados P1-P4: GSAP anti-ghosting (motion 2→7), E52 vw fix (96px fixo), dead CSS .classify-* removido (12 seletores), surfaces color-mix 8% (menos "encardidas"), card min-height 340px + padding rebalanceado.
5. **s-a1-fib4 Gate 4 R5 (7.3/10)** — Implementados R5-P1: `box-sizing: border-box` no .fib4-stages (corrige overflow que causava sobreposicao com case panel), deep failsafe `.no-js .fib4-stages *`.
6. **Animacao refinada** — Exit 0.3→0.2s, delay 0.3→0.2s (anti-ghosting preservado: delay >= exit), y-offset -10→-4px, stagger 0.1→0.08s. Total S0→S1: ~0.7s (era ~1s).

**Pendente s-a1-fib4:**
- Recapturar video pos-animacao refinada (capturado mas nao avaliado por Gemini ainda)
- Decisao sobre R5-P2 RADICAL (pitfall cards → dividers verticais "Bloomberg")
- Decisao sobre R5-P3 SHOULD (warning color escurecido via color-mix com navy)
- Gate 2 (Opus Visual Audit) nunca executado — protocolo em `@repo/docs/prompts/gate2-opus-visual.md`
- Score target: >=7 para aprovacao. R5=7.3 com propostas pendentes.

**Gate 4 historico s-a1-fib4:**
- R1: 6.0 → R2: 5.5 → R3: 4.9 → R4: 5.6 → **R5: 7.3** (pos P1-P4 + box-sizing)

### Sessao 29/mar (noite 2) — Conteudo andragogia + Gate 4 R6 8.8/10

**O que foi feito:**

1. **Conteudo s-a1-fib4 redesenhado para andragogia (Knowles)** — Hero numbers trocados de estatisticas (VPN >90%, VPP ~35%) para cutoffs clinicos (< 1,30, >= 2,67) que o medico usa no consultorio. Labels agora mostram acao clinica + evidencia. Pitfalls mais acionaveis ("infla o score", "mascara fibrose"). Zona cinza agora mostra range 1,30-2,67 + proximo passo (elastografia).
2. **Gate 4 R6: 8.8/10** (era 7.3 R5). Gemini Pro avaliou PNGs + video + raw code atualizados. Screenshots antigos deletados antes da recaptura.
3. **P1 MUST implementado** — Fisica de palco: advance() delay 0.2→0.25s (anti-ghosting). retreat() reescrito com esvaziamento estrito (exit 0.2s → delay 0.25s → re-enter com stagger invertido). Elimina overlap de texto no retrocesso.
4. **P2 SHOULD implementado** — Contraste projetor-safe: color-mix cards S0 de 8%→12% (bg) e 20%→35% (borda). Garante delimitacao Safe/Danger em projetor fraco.
5. **P3 RADICAL implementado** — Micro-tipografia: operadores < e >= em span `.fib4-operator` com DM Sans 0.85em + opacity 0.7. Balanceia operadores matematicos contra numeros tabulares em serifa.
6. **Speaker notes atualizadas** — Referenciam cutoffs na fala, zona cinza com range + proximo passo.

**Gate 4 historico s-a1-fib4:**
- R1: 6.0 → R2: 5.5 → R3: 4.9 → R4: 5.6 → R5: 7.3 → **R6: 8.8/10**

7. **Botao calculadora** — "Seu Antônio" → "Antônio" nos botoes FIB-4 e MELD-Na (`case-panel.js:177,245`). Lucas quer nome simples, sem "Seu".

**Pendente s-a1-fib4:** Recapturar screenshots pos-P1/P2/P3 para verificacao visual. Gate 2 re-run opcional (PASS anterior, mudancas CSS/JS podem impactar contraste).

### Sessao 29/mar (noite) — Gate 2 executado + fixes

**O que foi feito:**

1. **Gate 2 — primeira execucao** — Protocolo Opus Visual Audit rodado em s-a1-fib4. 3 layers completas: A) sharp pick_color (6 pontos grid + adaptativos) + a11y contrast (5 pares) + axe-core HTML (0 violations), B) code analysis (E52 PASS, dead CSS 0/26, failsafes PASS, metrics PASS), C) visual multimodal (hierarquia, whitespace, tipografia, cor semantica, completude S0/S2). Resultado: CONDITIONAL PASS → PASS apos fixes.
2. **Daltonism icons** — Adicionados ✓ VPN (safe), ✕ VPP (danger), ⚠ zona indeterminada (warning) nos labels do slide. Design-reference "Reforco icone obrigatorio".
3. **Shadow token fix** — `oklch(0% 0 0 / 0.06)` → `var(--shadow-soft)` em cirrose.css:2589. Token existia em base.css desde criacao mas nunca usado neste slide. Sistemico: ~20 instancias restantes.
4. **ERROR-LOG** — +ERRO-063 (shadow hardcoded global), +ERRO-064 (daltonism icons).
5. **Gate 2 report** — `qa-screenshots/s-a1-fib4/gate2-report.md`.

**SHOULD warnings Gate 2 (nao bloqueiam):**
- Section-tag contraste 4.50:1 (borderline AA)
- Source-tag contraste 4.50:1 (antialiased)
- Hero warning 3.35:1 (passa AA large, marginal)

**Pendente s-a1-fib4:** R5-P2 (pitfall dividers) e R5-P3 (warning color) pendentes decisao. Recapturar screenshots + Gate 4 R6 apos decisao. Considerar conteudo (ver abaixo).

### Sessao 30/mar (cont.) — Gate 2 protocol design

**O que foi feito:**

1. **Gate 2 — Opus Visual Audit criado** — gate intermediaria entre Gate 0 e Gate 4. Claude Opus analisa PNG S2 + raw code usando MCP tools (sharp pick_color, a11y check_color_contrast). 3 camadas: A) instrumental (cores reais, contraste WCAG), B) code analysis (E52, dead CSS, failsafes, token compliance), C) visual multimodal. MUST failures bloqueiam Gate 4. Custo: $0.
2. **Protocolo documentado** — `docs/prompts/gate2-opus-visual.md` com grid padrao de amostragem (5 pontos de metrics.json x2), pontos adaptativos, severidades, output format.
3. **Pipeline docs atualizados** — WT-OPERATING.md QA.2 reescrito, CLAUDE.md sequencia 3→4 passos, AUDIT-VISUAL.md protocolo reorganizado (3 gates).

**Pendente:** Rodar Gate 2 no s-a1-fib4 (primeira execucao do protocolo). Depois Gate 4 R4 com prompt v3.0.

### Sessao 30/mar (madrugada) — fib4 archetype removal + Gate 4 prompt v3.0

**O que foi feito:**

1. **s-a1-fib4 archetype removido** — `archetype-hero-stat` removido do HTML. Layout via `#s-a1-fib4 .slide-inner { justify-content: flex-start; gap: var(--space-sm); }` em cirrose.css. Section-tag e h2 agora left-aligned (consistente com baveno/classify DONE).
2. **gemini-qa3.mjs CSS extraction fix** — `extractSlideCSS()` agora faz 2-pass: (1) section-based (busca comment marker com slideId, captura ate proximo section boundary), (2) fallback por #slideId. Fib4: 271 linhas enviadas (vs 105 antes). Todas classes `.fib4-*` + failsafes agora visiveis ao Gemini.
3. **Gate 4 prompt v3.0** — secao 0 (recibo) exige prova de visualizacao do video com timestamps concretos, analise PNG por elemento, raw code por arquivo. Scorecard exige criterios mensuráveis por dimensao (nao apenas nota subjetiva). Propostas sem cap (antes max 5), cada uma cita fonte (video/PNG/raw) e criterio do scorecard.
4. **guard-product-files hook removido** — bloqueava edicao de slides no Windows.

**Gate 4 historico completo (s-a1-fib4):**
- R1: 6.0 → R2: 5.5 → R3: 4.9 → R4: 5.6 → **R5: 7.3/10**
- R4 fixes: GSAP anti-ghosting, E52 vw→96px, dead CSS, surfaces color-mix, card rebalance
- R5 fixes: box-sizing:border-box, deep failsafe, animacao refinada (exit 0.2s)

**Pendente s-a1-fib4:** R5-P2 (pitfall dividers) e R5-P3 (warning color) pendentes decisao Lucas. Gate 2 nunca executado.

### Sessao 29/mar (noite) — doc hardening + scripts QA

**O que foi feito (commits `22256f9` + `7c5ea81`):**

1. **evidence-db "Dados Clinicos" table rebuild** — 6 IDs stale do pre-rewrite Ato 2 (08/mar) corrigidos (s-a2-01→07, s-a2-02→15, s-a2-03→app-alb, s-a2-04→05, s-a2-05→11, s-a2-06→08). 8 rows novos adicionados (s-a1-damico, s-a2-01/02/03/06/09/10/12). Nota de exclusao para slides sem clinical assertions (s-title, s-hook, s-cp1/2/3, s-close). Verificado contra _manifest.js: 37 slides com row, 6 excluidos.
2. **AUDIT-VISUAL.md** — timestamp corrigido (2026-03-17→29), status atualizado (5 DONE, 1 QA, 4 CONTENT), contagens "11 slides"→"10 slides" em 4 locais (pos vote-merge).
3. **WT-OPERATING.md** — head -40→55 no ritual start-of-session, 5→6 stages, Gate 4 v2.0 note, NEXT-SESSION.md adicionado ao ritual de rehydration.
4. **XREF.md** — evidence-db.md, narrative.md, CASE.md adicionados a tabela de referencias e canonicos por assunto.
5. **qa-batch-screenshot.mjs** — 7 checks automatizados (C1 wordCount>30, C2 fillRatio, C3 h2Present, C4 h2Lines, C5 consoleErrors, C6 panelOverlap, C7 sourceTag) + `batch-manifest.json` com resultado agregado. Checks inline no console + PASS/FAIL/WARN.
6. **gemini-qa3.mjs Gate 0** — `gate0-summary.json` (slideId, must_pass, blocksGate4) para pipeline.
7. **gemini-qa3.mjs Gate 4** — extrai bloco ```json da resposta Gemini, parseia, salva `gate4-scorecard-rN.json`. Score usa JSON parseado (media 11 dims) com fallback regex. Parse failure → warning + raw salvo.

**O que NAO foi testado (testar amanha antes de produzir slides):**
- `qa-batch-screenshot.mjs` com checks ativos (precisa dev server rodando)
- `gemini-qa3.mjs` Gate 4 scorecard parsing contra resposta real do Gemini
- O regex do JSON fence (`` ```json\s*\n([\s\S]*?)``` ``) — pode falhar se Gemini formatar diferente

**Meta 30/mar: ZERO infra, so producao de slides.** s-a1-fib4 QA pipeline (recaptura → Gate 0 → Gate 4). Depois s-a1-damico. Testar scripts como subproduto do QA, nao como tarefa separada.

### Issues sistêmicos (não fixáveis antes do deadline 31/mar)
- **Source-tag line breaking**: texto longo quebra em viewport 1280x720. Afeta todos os slides. Sem fix viável.
- **Gate 0 ANIMATION_STATE false positive**: Gate 0 assume click-reveals aditivos, mas state machines SUBSTITUEM conteúdo → ANIMATION_STATE falha sempre em state machines. Override `must_pass: true` em gate0.json é workaround aceito.
- **Gemini avaliação qualidade**: Prompt Gate 4 v3.0 (2026-03-30): prova de video com timestamps, criterios mensuráveis no scorecard, propostas sem cap com fonte+criterio. CSS extraction fix (2-pass section-based). Testar R4 na proxima sessao.

---

## Slides

> Estados: BACKLOG → DRAFT → CONTENT → SYNCED → LINT-PASS → QA → DONE (definicao: WT-OPERATING.md §2)

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 1 | s-title | DONE | QA 5-stage PASS 18/mar. |
| 2 | s-hook | DONE | v17 (19/mar). QA 5-stage PASS. |
| 3 | s-a1-01 | DONE | Gate 0 PASS. Gate 4 R7 score 8.5/10. Source-tag centering DEFERRED. Aprovado 27/mar. |
| 4 | s-a1-classify | DONE | Gate 0 PASS. Gate 4 R7 score 7.3/10. P1 grid 2-col align-start, P2 expo easing fluido. Aprovado 27/mar. |
| 5 | s-a1-baveno | DONE | Gate 0 PASS. Gate 4 R5. Grid 3-col fix, font fix (DM Sans), p=0,041 + PMIDs. Aprovado 27/mar. |
| 6 | s-a1-fib4 | QA | **R7 8.5/10 (redesign completo).** Progressive spectrum (persistent bar + additive beats). P1-P4 R7 implementados. Gate 2 STALE (layout antigo). Micropolish pendente. |
| 7-9 | s-a1-damico → s-cp1 | CONTENT | Act 1 restante. |
| 10-25 | s-a2-01 → s-cp2 | CONTENT | Act 2 completo. |
| 26-34 | s-a3-01 → s-close | CONTENT | Act 3 + fechamento. |
| 35-42 | s-app-01 → s-app-etio | CONTENT | Appendix. |

**Resumo:** 5 DONE · 1 QA · 37 CONTENT (43 total)
**Proximo:** s-a1-fib4 micropolish (R7 8.5/10, palavras e polish visual). Depois: s-a1-damico. Ver [NEXT-SESSION.md](NEXT-SESSION.md).
**Script robustez:** ZERO-tier DONE + scripts validados end-to-end (2026-03-29). MINIMAL/HIGH pendentes — ref: `@repo/docs/HARDENING-SCRIPTS.md`.

### [TBD SOURCE] em notes (nao bloqueia QA visual)

- s-a2-04: PPI meta-analise OR ~2.17 PBE
- s-a2-09: sarcopenia prevalencia meta-analise
- s-a3-04: taxa recompensacao alcool "1/3 em 5a"
- s-app-04: PMID Turco 2024 IPD

---

## Caminho critico

1. ~~s-a1-classify~~ — DONE 27/mar (R7 7.3/10)
2. ~~s-a1-baveno~~ — DONE 27/mar (R5)
3. **s-a1-fib4 → s-cp1** — sequencia manifest, slide a slide
4. **Act 2 → Act 3** — apos Act 1 DONE

---

## Backlog

- engine.js `?qa=1` nao forca estado final de custom anims — workaround: Playwright evaluate
- PDF export quebrado (DeckTape) — nao bloqueia congresso
- Playwright MCP nao navega deck.js (E56) — usar script Node standalone
- **GARGALO hooks exit 2:** `exit 2` nao bloqueia tool no Windows. Reproduzido 25/mar. Investigar bug Claude Code Windows
- P4: mapear dois sistemas E-code (slide-rules.md §8 E01-E52 vs ERROR-LOG ERRO-NNN) — sem mapeamento

---

## Decisoes travadas (NAO reabrir)

### Act 2
- Cascata clinica do MESMO paciente (nao lista de topicos)
- 15 slides + CP2 na ordem de narrative.md
- NSBB pos-HDA = profilaxia SECUNDARIA (PREDESCI NNT 9 = callback Act 1)
- HRS-AKI lidera headline (CONFIRM NNT 7, NNH 12)
- MELDs intermediarios: construcoes narrativas → narrative.md + _manifest.js. NAO em CASE.md.

### Act 3
- Cenario HIPOTETICO, nao continuacao direta. CP2 fecha o caso real.

---

## Fora de escopo (batch posterior)

1. Renomear D'Amico para "Child, MELD e D'Amico"
2. Sequencia "Testes nao invasivos"
3. Sequencia "Scores e nuances"
4. Slide elastografia
5. Rule of 5 redesign
6. MELD / MELD-Na / MELD 3.0 redesign
7. Checkpoint "qual o proximo passo?"
8. Slide final Ato 1: "Trajetorias"

---

## Referencias

| O que | Onde |
|-------|------|
| Dados do paciente | `references/CASE.md` (#1) |
| Trials e PMIDs | `references/evidence-db.md` (#2) |
| Arco narrativo | `references/narrative.md` (#3) |
| Ordem dos slides | `slides/_manifest.js` (#4) |
| Regras operacionais | `@repo/CLAUDE.md` |
| Hardening scripts | `@repo/docs/HARDENING-SCRIPTS.md` |
| QA pipeline | `WT-OPERATING.md` |
| Design tokens | `@repo/.claude/rules/design-reference.md` §1 |
| Erros e prevencao | `ERROR-LOG.md` + `@repo/.claude/rules/slide-rules.md` §8 |
| Contexto slide ativo | `NEXT-SESSION.md` (ler so se trabalhar neste slide) |
| Licoes unicas | `@repo/docs/lessons.md` (so o que NAO esta em rules) |

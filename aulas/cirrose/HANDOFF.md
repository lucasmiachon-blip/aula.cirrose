# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.
> **Paths:** relativos a `aulas/cirrose/`, exceto `@repo/` = raiz do repo.

---

## Estado — 2026-03-29

**Slides:** 43 buildados · 5 DONE · 1 QA · 37 CONTENT · **Build/Lint/Scaling/CSS cascade:** ✅
**Branch:** `feat/cirrose-mvp` · Sprint ate 31/mar.
**Guardrails:** pre-commit (3 guards + lint) + evidence-db + guard-generated + guard-product-files. Docs: `.claude/hooks/README.md`.
**QA pipeline:** `WT-OPERATING.md` §4. Scripts: `qa-batch-screenshot.mjs` + `gemini-qa3.mjs`.
**Env:** GEMINI_API_KEY OK. PERPLEXITY_API_KEY ausente.
**Pendente infra:** reorg `scripts/` em subdirs (alto risco, adiado pos-31/mar). `#slide-id-label` em deck.js (remover antes de producao).
**Scripts hardening:** ZERO-tier (`377e56b`) + lifecycle patch 28/mar: try/finally browser, video saveAs (3 scripts Playwright). MINIMAL/HIGH tiers pendentes — ref: `@repo/docs/HARDENING-SCRIPTS.md`.

### Issues sistêmicos (não fixáveis antes do deadline 31/mar)
- **Source-tag line breaking**: texto longo quebra em viewport 1280x720. Afeta todos os slides. Sem fix viável.
- **Gate 0 ANIMATION_STATE false positive**: Gate 0 assume click-reveals aditivos, mas state machines SUBSTITUEM conteúdo → ANIMATION_STATE falha sempre em state machines. Override `must_pass: true` em gate0.json é workaround aceito.
- **Gemini avaliação qualidade**: Gemini não lê CSS enviado com atenção (propõe coisas já implementadas, não detecta dead CSS, não pega JS null bugs). Prompt precisa instrução "confirme que seletor EXISTE no material antes de propor".

---

## Slides

> Estados: BACKLOG → DRAFT → CONTENT → SYNCED → LINT-PASS → QA → DONE

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 1 | s-title | DONE | QA 5-stage PASS 18/mar. |
| 2 | s-hook | DONE | v17 (19/mar). QA 5-stage PASS. |
| 3 | s-a1-01 | DONE | Gate 0 PASS. Gate 4 R7 score 8.5/10. Source-tag centering DEFERRED. Aprovado 27/mar. |
| 4 | s-a1-classify | DONE | Gate 0 PASS. Gate 4 R7 score 7.3/10. P1 grid 2-col align-start, P2 expo easing fluido. Aprovado 27/mar. |
| 5 | s-a1-baveno | DONE | Gate 0 PASS. Gate 4 R5. Grid 3-col fix, font fix (DM Sans), p=0,041 + PMIDs. Aprovado 27/mar. |
| 6 | s-a1-fib4 | QA | **REESCRITO 29/mar.** Conteúdo novo: VPN/VPP → pitfalls → gray zone. P2/P3/P4 visuais implementados. Screenshots STALE. Próximo: recaptura + Gate 0 + Gate 4. Ver §Próxima sessão. |
| 7-9 | s-a1-damico → s-cp1 | CONTENT | Act 1 restante. |
| 10-25 | s-a2-01 → s-cp2 | CONTENT | Act 2 completo. |
| 26-34 | s-a3-01 → s-close | CONTENT | Act 3 + fechamento. |
| 35-42 | s-app-01 → s-app-etio | CONTENT | Appendix. |

**Resumo:** 5 DONE · 1 QA · 37 CONTENT (43 total)
**Proximo:** s-a1-fib4 recaptura screenshots + Gate 0 + Gate 4 R1 (conteúdo novo). Depois: s-a1-damico.
**Research tooling:** `content-research.mjs` prompt v2 (patient anchor dinamico, genealogia obrigatoria, divergencia guidelines). Templates: `docs/prompts/mcp-research-queries.md`.
**Script robustez (28/mar):** Todos scripts Gemini/Playwright tem: retry 429/5xx, --help, throw em vez de process.exit, console error capture em metrics.json. Gate 0 usa responseMimeType JSON (sem fence-strip). Playwright scripts: browser try/finally + video().saveAs() (sem renameSync race).

### [TBD SOURCE] em notes (nao bloqueia QA visual)

- s-a2-04: PPI meta-analise OR ~2.17 PBE
- s-a2-09: sarcopenia prevalencia meta-analise
- s-a3-04: taxa recompensacao alcool "1/3 em 5a"
- s-app-04: PMID Turco 2024 IPD

---

## Proxima sessao — s-a1-fib4 QA pipeline (conteúdo novo)

### Contexto: o slide foi REESCRITO em 29/mar

O conteúdo antigo (formula, cutoffs, hero 5.91, checkpoint/mandate) foi removido.
O conteúdo novo foca em nuances de especialista sobre limitações do FIB-4.

**H2:** `Modelos Preditivos: FIB-4` (título original do Lucas — NÃO é assertion-evidence, mas é decisão do autor. Não alterar.)

### Estado atual dos arquivos (commit `b3b1f26`)

| Arquivo | Estado | Detalhes |
|---------|--------|----------|
| `slides/03b-a1-fib4calc.html` | ✅ Atualizado | 3 states: S0=VPN/VPP assimetria, S1=3 pitfalls (idade/álcool/MASLD), S2=gray zone 30-60%. Sem formula, sem hero, sem checkpoint. |
| `slides/_manifest.js` | ✅ Atualizado | headline='Modelos Preditivos: FIB-4', clickReveals=2 |
| `slide-registry.js` | ✅ Atualizado | State machine 3 estados, caveat null fix, cross-fade overlap (P4) |
| `cirrose.css` | ✅ Atualizado | P2 hero gray zone (clamp 72-110px), P3 tinted cards (safe-light/danger-light), dead CSS removido |
| `references/narrative.md` | ✅ Atualizado | headline + descrição sincronizados |
| `references/evidence-db.md` | ✅ OK | 13 refs tier-1 para s-a1-fib4 (EASL NITs, Lindvig, McPherson, Sterling, Baveno VII, etc.) |
| `AUDIT-VISUAL.md` | ⚠️ STALE | Scorecard refere conteúdo antigo. Precisa re-audit completo pós-QA pipeline. |
| `qa-screenshots/` | ⚠️ STALE | PNGs S0/S2 e video são de ANTES das mudanças P2/P3/P4. Recapturar OBRIGATÓRIO. |
| `gate0.json` | ⚠️ STALE | Baseado em screenshots antigos. Re-run obrigatório. |
| `cirrose.css` seletores | Nenhum `#s-a1-fib4` | Todos seletores são por classe (.fib4-*), sem ID-anchor |

### CSS classes ativas no slide

| Classe | Uso | Arquivo |
|--------|-----|---------|
| `.fib4-stages` | Grid stacking container (place-items:center, surface card) | cirrose.css ~L2569 |
| `.fib4-stage` | grid-area: 1/1, opacity: 0 (GSAP controla) | cirrose.css ~L2583 |
| `.fib4-asymmetry` | S0 wrapper | cirrose.css ~L2594 |
| `.fib4-stat-row` | Grid 2-col para VPN/VPP | cirrose.css ~L2597 |
| `.fib4-stat` | Card individual (padding, radius) | cirrose.css ~L2603 |
| `.fib4-stat--safe` | Fundo tinted safe-light | cirrose.css ~L2613 |
| `.fib4-stat--danger` | Fundo tinted danger-light | cirrose.css ~L2616 |
| `.fib4-stat-number` | Número grande (font-display, text-h1) | cirrose.css ~L2619 |
| `.fib4-stat-label` | Label VPN/VPP (text-small, secondary) | cirrose.css ~L2627 |
| `.fib4-pitfalls` | S1 wrapper | cirrose.css ~L2634 |
| `.fib4-pitfall-row` | Grid 3-col para 3 armadilhas | cirrose.css ~L2637 |
| `.fib4-pitfall` | Card armadilha (bg-card, border) | cirrose.css ~L2643 |
| `.fib4-pitfall-title` | Título armadilha (font-body 700) | cirrose.css ~L2653 |
| `.fib4-pitfall-detail` | Detalhe armadilha (text-small, secondary) | cirrose.css ~L2659 |
| `.fib4-grayzone` | S2 wrapper | cirrose.css ~L2666 |
| `.fib4-grayzone-content` | Flex column center | cirrose.css ~L2669 |
| `.fib4-grayzone-stat` | **HERO** 30-60% (clamp 72-110px, warning-on-light, serif) | cirrose.css ~L2675 |
| `.fib4-grayzone-label` | "zona indeterminada" (text-h3, uppercase) | cirrose.css ~L2683 |

### GSAP state machine (slide-registry.js ~L473)

```
S0 (auto):  asymmetry visible, cards stagger in (0.35s, stagger 0.2s, delay 0.3s)
S1 (click): asymmetry cross-fade out (0.5s, y:-15), pitfalls cross-fade in (0.5s, delay 0.1s), pitfall cards stagger (0.35s, stagger 0.15s)
S2 (click): pitfalls cross-fade out (0.4s, y:-15), grayzone cross-fade in (0.6s, delay 0.1s), source-tag fade (0.4s, delay 0.5s)
Retreat:    reverso instantâneo (gsap.set autoAlpha:1, y:0)
```

### Histórico de reviews Gemini (naming confuso — ver nota)

| Arquivo | Conteúdo avaliado | Score | Contexto |
|---------|-------------------|-------|----------|
| `gemini-qa3-r2.md` | ANTIGO (formula, cutoffs, hero) | 6.0/10 | Gate 4 R2 do conteúdo original. Histórico. |
| `gemini-qa3-r1.md` | NOVO (VPN, pitfalls, grayzone) | 4.0/10 | Gate 4 R1 do conteúdo reescrito. P2/P3/P4 implementados DESTE review. |

**Nota naming:** R1 e R2 são de VERSÕES DIFERENTES do conteúdo. Na próxima sessão, resetar contagem: chamar de R1 do conteúdo novo (v2). Os reviews anteriores são históricos.

### Tarefa próxima sessão (3 passos obrigatórios)

1. **Recapturar screenshots:** `node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide s-a1-fib4 --video`
2. **Gate 0:** `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-fib4 --inspect` → override ANIMATION_STATE se false positive (systemic)
3. **Gate 4 R1 (v2):** `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-fib4 --editorial --round 1 --ref-slide s-a1-baveno`

Após Gate 4: implementar propostas aprovadas por Lucas → recapturar → re-run até score ≥7.

### Melhorias pipeline de pesquisa (aplicáveis a próximos slides)
- `content-research.mjs` prompt v2: patient anchor dinâmico (CASE.md), genealogia obrigatória, divergência guidelines, narrative metadata explicada
- Protocolo Claude-side: MCPs (PubMed, Consensus, SCite, Scholar Gateway) → output estruturado → comparison table → merge evidence-db

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
| Licoes unicas | `@repo/docs/lessons.md` (so o que NAO esta em rules) |

# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.
> **Paths:** relativos a `aulas/cirrose/`, exceto `@repo/` = raiz do repo.

---

## Estado — 2026-03-28

**Slides:** 43 buildados · 5 DONE · 1 SYNCED · 37 CONTENT · **Build/Lint/Scaling/CSS cascade:** ✅
**Branch:** `feat/cirrose-mvp` · Sprint ate 31/mar.
**Guardrails:** pre-commit (3 guards + lint) + evidence-db + guard-generated + guard-product-files. Docs: `.claude/hooks/README.md`.
**QA pipeline:** `WT-OPERATING.md` §4. Scripts: `qa-batch-screenshot.mjs` + `gemini-qa3.mjs`.
**Env:** GEMINI_API_KEY OK. PERPLEXITY_API_KEY ausente.
**Pendente infra:** reorg `scripts/` em subdirs (alto risco, adiado pos-31/mar). `#slide-id-label` em deck.js (remover antes de producao).
**Scripts hardening:** ZERO-tier (`377e56b`) + lifecycle patch 28/mar: try/finally browser, video saveAs (3 scripts Playwright). MINIMAL/HIGH tiers pendentes — ref: `@repo/docs/HARDENING-SCRIPTS.md`.

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
| 6 | s-a1-fib4 | SYNCED | Rewrite 28/mar: 4 states, VPN/VPP, hero 5.91, checkpoint conduta. |
| 7-9 | s-a1-damico → s-cp1 | CONTENT | Act 1 restante. |
| 10-25 | s-a2-01 → s-cp2 | CONTENT | Act 2 completo. |
| 26-34 | s-a3-01 → s-close | CONTENT | Act 3 + fechamento. |
| 35-42 | s-app-01 → s-app-etio | CONTENT | Appendix. |

**Resumo:** 5 DONE · 1 SYNCED · 37 CONTENT (43 total)
**Proximo:** s-a1-fib4 → QA pipeline (screenshot → Gate 0 → Gate 4). Depois: s-a1-damico.
**Research tooling:** `content-research.mjs` prompt v2 (patient anchor dinamico, genealogia obrigatoria, divergencia guidelines). Templates: `docs/prompts/mcp-research-queries.md`.
**Script robustez (28/mar):** Todos scripts Gemini/Playwright tem: retry 429/5xx, --help, throw em vez de process.exit, console error capture em metrics.json. Gate 0 usa responseMimeType JSON (sem fence-strip). Playwright scripts: browser try/finally + video().saveAs() (sem renameSync race).

### [TBD SOURCE] em notes (nao bloqueia QA visual)

- s-a2-04: PPI meta-analise OR ~2.17 PBE
- s-a2-09: sarcopenia prevalencia meta-analise
- s-a3-04: taxa recompensacao alcool "1/3 em 5a"
- s-app-04: PMID Turco 2024 IPD

---

## Proxima sessao — s-a1-fib4 QA

**Estado:** SYNCED (rewrite 28/mar). 4 states, HTML+CSS+Registry+Manifest OK. Build+lint PASS.
**Tarefa:** QA pipeline (screenshot → Gate 0 → Gate 4).

### O que mudou (28/mar)
- **H2:** "Modelos Preditivos: FIB-4" (Lucas override de assertion-evidence)
- **4 states:** S0 formula+cutoffs (auto) → S1 VPN/VPP assimetria (click) → S2 hero 5.91 countUp (click) → S3 checkpoint "Qual proxima conduta?" + "Elastografia obrigatoria" (click)
- **Labs no sidebar apenas:** Valores do paciente no card lateral + calculadora. Slide body = conceitos + resultado + decisao.
- **Stages layout:** Absolute stacking (`.fib4-stages > .fib4-stage`) — conteudo transiciona sem acumular.
- **FIB-9 e FIB-3:** Ficaram em evidence-db + content-research.md. PMIDs nao verificados.

### Melhorias no pipeline de pesquisa (aplicaveis a proximos slides)
- `content-research.mjs` prompt v2: patient anchor dinamico (CASE.md), genealogia obrigatoria, divergencia guidelines, narrative metadata explicada
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

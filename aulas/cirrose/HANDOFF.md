# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.
> **Paths:** relativos a `aulas/cirrose/`, exceto `@repo/` = raiz do repo.

---

## Estado — 2026-03-30T00:30-03:00

**Slides:** 43 buildados · 5 DONE · 1 QA · 37 CONTENT · **Build/Lint/Scaling/CSS cascade:** ✅
**Branch:** `feat/cirrose-mvp` · Sprint ate 31/mar.
**Guardrails:** pre-commit (3 guards + lint) + evidence-db + guard-generated. ~~guard-product-files~~ removido.
**QA pipeline:** `WT-OPERATING.md` §4. Scripts: `qa-batch-screenshot.mjs` + `gemini-qa3.mjs`.
**Env:** GEMINI_API_KEY OK. PERPLEXITY_API_KEY ausente.
**Pendente infra:** reorg `scripts/` em subdirs (alto risco, adiado pos-31/mar). `#slide-id-label` em deck.js (remover antes de producao).
**Scripts hardening:** ZERO-tier DONE. MINIMAL/HIGH pendentes — ref: `@repo/docs/HARDENING-SCRIPTS.md`.

### Sessao 30/mar (madrugada) — fib4 archetype removal + Gate 4 prompt v3.0

**O que foi feito:**

1. **s-a1-fib4 archetype removido** — `archetype-hero-stat` removido do HTML. Layout via `#s-a1-fib4 .slide-inner { justify-content: flex-start; gap: var(--space-sm); }` em cirrose.css. Section-tag e h2 agora left-aligned (consistente com baveno/classify DONE).
2. **gemini-qa3.mjs CSS extraction fix** — `extractSlideCSS()` agora faz 2-pass: (1) section-based (busca comment marker com slideId, captura ate proximo section boundary), (2) fallback por #slideId. Fib4: 271 linhas enviadas (vs 105 antes). Todas classes `.fib4-*` + failsafes agora visiveis ao Gemini.
3. **Gate 4 prompt v3.0** — secao 0 (recibo) exige prova de visualizacao do video com timestamps concretos, analise PNG por elemento, raw code por arquivo. Scorecard exige criterios mensuráveis por dimensao (nao apenas nota subjetiva). Propostas sem cap (antes max 5), cada uma cita fonte (video/PNG/raw) e criterio do scorecard.
4. **guard-product-files hook removido** — bloqueava edicao de slides no Windows.

**Gate 4 R1-R3 historico (s-a1-fib4):**
- R1 (com archetype, CSS parcial): 6.0/10
- R2 (sem archetype, CSS parcial 105 linhas): 5.5/10
- R3 (sem archetype, CSS completo 271 linhas): 4.9/10
- Proximo: R4 com prompt v3.0 (criterios mensuráveis + prova de video)

**Pendente s-a1-fib4:** Implementar propostas aprovadas de R3/R4 (cross-fade timing, E52 vw, dead CSS failsafes, visibility no-js). Depois recapturar + re-run.

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
| 6 | s-a1-fib4 | QA | Archetype removido 30/mar. Gate 0 PASS. Gate 4 R3 4.9/10 (CSS fix). Prompt v3.0 pendente R4. |
| 7-9 | s-a1-damico → s-cp1 | CONTENT | Act 1 restante. |
| 10-25 | s-a2-01 → s-cp2 | CONTENT | Act 2 completo. |
| 26-34 | s-a3-01 → s-close | CONTENT | Act 3 + fechamento. |
| 35-42 | s-app-01 → s-app-etio | CONTENT | Appendix. |

**Resumo:** 5 DONE · 1 QA · 37 CONTENT (43 total)
**Proximo:** s-a1-fib4 (ver [NEXT-SESSION.md](NEXT-SESSION.md)). Depois: s-a1-damico.
**Script robustez:** ZERO-tier DONE (377e56b). MINIMAL/HIGH pendentes — ref: `@repo/docs/HARDENING-SCRIPTS.md`.

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

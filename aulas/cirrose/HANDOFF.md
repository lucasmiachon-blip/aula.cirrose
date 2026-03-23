# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.

---

## Estado — 2026-03-22

**Slides:** 44 buildados · **Build:** ✅ · **Lint:** ✅ · **Scaling:** ✅
**Standalone:** shared/ em `./shared/` (internalizado 22/mar). Sprint mode ate 31/mar.
**Guardrails:** pre-commit (3 guards + lint) + evidence-db hooks + guard-generated (index.html) + audit trail.
**QA:** `WT-OPERATING.md` (maquina de estados + Gemini pipeline). Gate 0 + Gate 4 via `scripts/gemini-qa3.mjs`.
**Gemini:** `gemini-3.1-pro-preview` SEMPRE. REST API. `--inspect` (Gate 0) · `--full` (Gate 0+4) · `--editorial` (Gate 4).
**Env:** GEMINI_API_KEY OK. PERPLEXITY_API_KEY ausente. SCITE OAuth pendente.

---

## Slides

> Estados: BACKLOG → DRAFT → CONTENT → SYNCED → LINT-PASS → QA → DONE

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 1 | s-title | DONE | QA 5-stage PASS 18/mar. |
| 2 | s-hook | DONE | v17 (19/mar). QA 5-stage PASS. |
| 3 | s-a1-01 | DONE | R12 (22/mar). Fechado por validacao visual Lucas. |
| 4 | s-a1-classify | QA | Gate 4 R1: 4.8/10. P2 parcial aplicado. Source-tag fora viewport. 4 propostas Gemini pendentes. `qa-rounds/s-a1-classify.md`. |
| 5-11 | s-a1-vote → s-cp1 | CONTENT | Act 1 restante. |
| 12-27 | s-a2-01 → s-cp2 | CONTENT | Act 2 completo. |
| 28-36 | s-a3-01 → s-close | CONTENT | Act 3 + fechamento. |
| 37-44 | s-app-01 → s-app-etio | CONTENT | Appendix. |

**Resumo:** 3 DONE · 1 QA · 40 CONTENT

### [TBD SOURCE] em notes (nao bloqueia QA visual)

- s-a2-04: PPI meta-analise OR ~2.17 PBE
- s-a2-09: sarcopenia prevalencia meta-analise
- s-a3-04: taxa recompensacao alcool "1/3 em 5a"
- s-app-04: PMID Turco 2024 IPD

---

## Caminho critico

1. **s-a1-classify** — fechar: source-tag overflow, decidir propostas Gemini, Gate 4 R2
2. **s-a1-vote → s-cp1** — sequencia manifest, slide a slide no QA pipeline
3. **Act 2 → Act 3** — apos Act 1 DONE

---

## Backlog

- engine.js `?qa=1` nao forca estado final de custom animations (workaround: Playwright evaluate)
- h2 assertivo fib4: Lucas decide no browser
- PDF export quebrado (DeckTape)
- Nomes de arquivo enganosos (ver slide-identity.md §9)
- 3 dead CSS selectors (`.etiology-table`, `.framework-box`, `.predict-bars`)

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

## Migracao de IDs (referencia)

| Arquivo | ID antigo | ID novo |
|---------|-----------|---------|
| 08-a2-carvedilol.html | s-a2-01 | s-a2-07 |
| 09-a2-tips.html | s-a2-02 | s-a2-15 |
| 10-a2-albumina.html | s-a2-03 | s-app-alb |
| 05-a1-infeccao.html | s-a2-infec | s-a2-04 |
| 11-a2-pbe.html | s-a2-04 | s-a2-05 |
| 12-a2-hrs.html | s-a2-05 | s-a2-11 |
| 13-a2-he.html | s-a2-06 | s-a2-08 |
| 24-app-ccc.html | s-app-05 | s-a2-13 |
| 25-app-pulm.html | s-app-06 | s-a2-14 |
| 15-a3-recompensacao.html | s-a3-01 | s-a3-02 |
| 16-a3-svr.html | s-a3-02 | s-a3-05 |
| 17-a3-vigilancia.html | s-a3-03 | s-a3-06 |

---

## Referencias

| O que | Onde |
|-------|------|
| Dados do paciente | `references/CASE.md` (#1) |
| Trials e PMIDs | `references/evidence-db.md` (#2) |
| Arco narrativo | `references/narrative.md` (#3) |
| Ordem dos slides | `slides/_manifest.js` (#4) |
| Regras operacionais | `CLAUDE.md` (cirrose) |
| QA pipeline | `WT-OPERATING.md` |
| Design tokens | `.claude/rules/design-system.md` |
| Erros e prevencao | `ERROR-LOG.md` + `.claude/rules/css-errors.md` |
| Licoes unicas | `tasks/lessons.md` (so o que NAO esta em rules) |

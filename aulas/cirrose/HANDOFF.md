# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.
> **Paths:** relativos a `aulas/cirrose/`, exceto `@repo/` = raiz do repo.

---

## Estado — 2026-03-30T22:30-03:00

**Ultima sessao:** s-a1-elasto QA completo → DONE* R4 8.5/10. Pipeline: R1 6.6→fix hierarquia/anim→R2 6.8 (bug CSS extraction corrigido)→R3 9.1 (macro-whitespace P1-P5)→R4 8.5 (contraste cards bg-card+shadow). ICC card atualizado: "↑ com PVC → falso F3–F4". Bug fix: gemini-qa3.mjs CSS section boundary regex (= ASCII adicionado + lookahead ±1 linha).
**Infra:** Porta Vite 3000→4100 (strictPort). `npm run kill:dev` adicionado. 6 scripts atualizados.
**Slides:** 44 buildados · 7 DONE* · 0 QA · 37 CONTENT · **Build/Lint/Scaling/CSS cascade:** ✅
**Branch:** `feat/cirrose-mvp` · Sprint ate 31/mar.
**Guardrails:** pre-commit (3 guards + lint) + evidence-db + guard-generated. ~~guard-product-files~~ removido.
**QA pipeline:** `WT-OPERATING.md` §4. **4 passos:** Screenshots → Gate 0 (Flash, $0) → Gate 2 (Opus, $0) → Gate 4 (Pro, ~$0.03).
**QA scripts:** Validados end-to-end (29/mar). Porta default 4100.
**Modelos Gemini:** Gate 0 = `gemini-3-flash-preview` ($0). Gate 4 = `gemini-3.1-pro-preview` ($2/$12 per 1M).
**Env:** GEMINI_API_KEY OK. PERPLEXITY_API_KEY ausente.

---

## Slides

> Estados: BACKLOG → DRAFT → CONTENT → SYNCED → LINT-PASS → QA → DONE (definicao: WT-OPERATING.md §2)

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 1 | s-title | DONE | QA 5-stage PASS 18/mar. |
| 2 | s-hook | DONE | v17 (19/mar). QA 5-stage PASS. |
| 3 | s-a1-01 | DONE | Gate 0 PASS. Gate 4 R7 8.5/10. Aprovado 27/mar. |
| 4 | s-a1-classify | DONE | Gate 0 PASS. Gate 4 R7 7.3/10. Aprovado 27/mar. |
| 5 | s-a1-baveno | DONE | Gate 0 PASS. Gate 4 R5. Aprovado 27/mar. |
| 6 | s-a1-fib4 | DONE* | R9 8.8/10. Progressive spectrum. cor_contraste 7/10 aceito. Gate 2 STALE (layout antigo). |
| 7 | s-a1-elasto | DONE* | R4 8.5/10. Pipeline R1→R4 completo. ICC card atualizado. |
| 8-10 | s-a1-damico → s-cp1 | CONTENT | Act 1 restante. |
| 11-25 | s-a2-01 → s-cp2 | CONTENT | Act 2 completo. |
| 26-34 | s-a3-01 → s-close | CONTENT | Act 3 + fechamento. |
| 35-44 | s-app-01 → s-app-etio | CONTENT | Appendix. |

**Resumo:** 7 DONE* · 0 QA · 37 CONTENT (44 total)
**Proximo:** s-a1-damico (Act 1 restante).

### [TBD SOURCE] em notes (nao bloqueia QA visual)

- s-a2-04: PPI meta-analise OR ~2.17 PBE
- s-a2-09: sarcopenia prevalencia meta-analise
- s-a3-04: taxa recompensacao alcool "1/3 em 5a"
- s-app-04: PMID Turco 2024 IPD

---

## Caminho critico

1. ~~s-a1-classify~~ — DONE 27/mar
2. ~~s-a1-baveno~~ — DONE 27/mar
3. ~~s-a1-elasto~~ — DONE* 30/mar R4 8.5
4. **s-a1-damico → s-cp1** — sequencia manifest, slide a slide
5. **Act 2 → Act 3** — apos Act 1 DONE

---

## Issues sistemicos (nao fixaveis antes do deadline 31/mar)

- **Source-tag line breaking**: texto longo quebra em 1280x720. Sem fix viavel.
- **Gate 0 ANIMATION_STATE false positive**: state machines substituem conteudo → override aceito.
- **engine.js `?qa=1`**: nao forca estado final de custom anims. Workaround: Playwright evaluate.
- **exit 2 hooks Windows**: nao bloqueia tool. Bug Claude Code. Investigar.

---

## Backlog

- PDF export (DeckTape) — nao bloqueia congresso
- Playwright MCP nao navega deck.js (E56) — script Node standalone
- P4: mapear E-codes (slide-rules.md §8 vs ERROR-LOG)
- Reorg `scripts/` em subdirs (alto risco, adiado pos-31/mar)
- `#slide-id-label` em deck.js (remover antes de producao)
- Scripts hardening MINIMAL/HIGH — ref: `@repo/docs/HARDENING-SCRIPTS.md`

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
4. Rule of 5 redesign
5. MELD / MELD-Na / MELD 3.0 redesign
6. Checkpoint "qual o proximo passo?"
7. Slide final Ato 1: "Trajetorias"

---

## Referencias

| O que | Onde |
|-------|------|
| Dados do paciente | `references/CASE.md` (#1) |
| Trials e PMIDs | `references/evidence-db.md` (#2) |
| Arco narrativo | `references/narrative.md` (#3) |
| Ordem dos slides | `slides/_manifest.js` (#4) |
| Regras operacionais | `@repo/CLAUDE.md` |
| QA pipeline | `WT-OPERATING.md` |
| Scorecards | `AUDIT-VISUAL.md` (archive: `AUDIT-VISUAL-ARCHIVE.md`) |
| Design tokens | `@repo/.claude/rules/design-reference.md` §1 |
| Erros e prevencao | `ERROR-LOG.md` + `@repo/.claude/rules/slide-rules.md` §8 |
| Contexto slide ativo | `NEXT-SESSION.md` |

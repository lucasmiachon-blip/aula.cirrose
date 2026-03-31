# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.
> **Paths:** relativos a `aulas/cirrose/`, exceto `@repo/` = raiz do repo.

---

## Estado — 2026-03-31T23:30-03:00

**Ultima sessao:** Pipeline paralela planejada + P3 (Gate 4 prompt E67 v2.1) implementado. Research s-a1-meld lancado em background.
**Venue:** Samsung UN55F6400, 55", Full HD 1920x1080 nativo, 16:9. Distancia ~6m. `--text-caption` clamp(11px) no limite a 6m. Source-tags ponto critico de legibilidade.
**Infra:** Porta Vite 4100 (strictPort). deck.js/engine.js com fix de timing global.
**Slides:** 44 buildados · 8 DONE* · 1 QA (s-a1-cpt) · 35 CONTENT · **Build/Lint/Scaling/CSS cascade:** ✅
**Branch:** `feat/cirrose-mvp` · Commit `636e78f`.
**Guardrails:** pre-commit (3 guards + lint) + evidence-db + guard-generated. ~~guard-product-files~~ removido.
**QA pipeline:** `WT-OPERATING.md` §4. **4 passos:** Screenshots → Gate 0 (Flash, $0) → Gate 2 (Opus, $0) → Gate 4 (Pro, ~$0.03). **Gate 4 prompt v2.1 (E67 fix):** secoes §1B (inventario cor semantica) + §1C (motion timestamp log) obrigatorias. Gemini DEVE preencher tabela de cores por estado ANTES de pontuar.
**QA scripts (v2 — 2026-03-30):** extractSlideCSS multi-section, extractArchetypeCSS filtrado, auto --ref-slide.
**Research scripts (v3):** content-research.mjs com SOURCE PRIORITY, Tier-1 list, PMID verification. Claude MCP protocol documentado (SCite→PubMed→Consensus→Gemini).
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
| 6 | s-a1-fib4 | DONE* | R9 8.8/10. CSS anti-flash adicionado (30/mar). |
| 7 | s-a1-elasto | DONE* | R4 8.5/10. CSS anti-flash adicionado (30/mar). |
| 8 | s-a1-rule5 | DONE* | R4 8.7/10. H2 "Rule of Five". 1 click holofote ≥25 + sidebar 26 kPa + caveats. 3 refs tier-1. Source-tag PMIDs adicionados (31/mar). |
| 9 | s-a1-cpt | QA | Gate 4 R6 7.7/10. Fixes R4-R6: grid stack (no absolute), color semantic (danger→warning/neutral S0, Von Restorff S1 only), anti-flash E66, dead CSS -160L, source-tag PMIDs, H2 encurtado. **PENDENTE:** cores S0 ainda insatisfatorias (Lucas), Gate 4 prompt cego a motion+cor (E67). |
| 10 | s-a1-meld | CONTENT | Act 1 restante. |
| 11 | s-cp1 | CONTENT | **ATENCAO:** H2 e lsm desatualizados (21→26 kPa). narrativeCritical=true. |
| 12-25 | s-a2-01 → s-cp2 | CONTENT | Act 2 completo. |
| 26-34 | s-a3-01 → s-close | CONTENT | Act 3 + fechamento. |
| 35-44 | s-app-01 → s-app-etio | CONTENT | Appendix. |

**Resumo:** 8 DONE* · 1 QA · 0 DRAFT · 35 CONTENT (44 total)

### Proxima sessao — checklist de prontidao

| Preparado? | Item | Notas |
|------------|------|-------|
| ✅ | Gate 4 prompt v2.1 (E67 fix) | §1B inventario cor + §1C motion log |
| ✅ | Pipeline paralela planejada | Plano: `.claude/plans/valiant-crafting-abelson.md` |
| ⏳ | Research s-a1-meld | Subagent lancado, resultado pendente |
| ❌ | Screenshots s-a1-cpt frescos | Recapturar ANTES de Gate 4 R7 |
| ❌ | Gate 4 R7 s-a1-cpt | Rodar com prompt v2.1 apos screenshots |

**Fluxo na proxima sessao:**
1. `npm run dev` (port 4100)
2. `node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide s-a1-cpt --video`
3. Gate 0 re-check: `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-cpt --inspect`
4. Gate 2 conversacional (sharp + a11y)
5. Gate 4 R7: `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-cpt --editorial --round 7`
6. Em paralelo: `/medical-researcher` para s-cp1 (proximo slide)

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
4. ~~s-a1-rule5~~ — DONE* 30/mar R4 8.7
5. **s-a1-cpt** — QA R6 7.7/10. Gate 4 prompt v2.1 pronto (E67). Proximo: screenshots → Gate 4 R7
6. **s-cp1** — cascata LSM 26 kPa (narrativeCritical). Aprovar com Lucas.
7. **s-a1-meld** — sequencia manifest, slide a slide
7. **Act 2 → Act 3** — apos Act 1 DONE

---

## Cascata LSM 26 kPa (pendente)

CASE.md atualizado (source of truth). Manifest panelStates sincronizado. Faltam:
- `slides/07-cp1.html` H2: "LSM 21 kPa" → "LSM 26 kPa" + logica clinica (CSPH confirmado, nao provavel)
- `references/narrative.md` linha 66: "LSM 21 kPa" para cp1
- **narrativeCritical=true** — requer aprovacao Lucas antes de editar.

---

## Infra fixes desta sessao (30/mar)

### deck.js — transitionend filter
**Problema:** `transitionend` de filhos (CSS transitions em .rule-zone, .elasto-card etc) fazia bubble ate a `<section>`, disparando `slide:entered` antes do slide estar visivel.
**Fix:** `if (evt.target !== currentSlide) return;` no listener.

### engine.js — animate on slide:changed
**Problema:** `animate()` rodava em `slide:entered` (400ms apos slide comecar fade-in). Elementos apareciam no estado CSS default (visivel) antes de GSAP esconde-los — flash de poucos ms.
**Fix:** `animate()` agora roda em `slide:changed` (imediato). `gsap.set()` esconde elementos ANTES do primeiro frame do fade-in. Delays das animacoes (0.3-0.4s) alinham com a transicao CSS de 400ms. Cleanup do slide anterior atrasado 450ms com protecao contra re-entrada.

### CSS anti-flash
`.fib4-spectrum` e `.elasto-confounders` receberam `opacity: 0` no CSS base. GSAP revela ao iniciar. Failsafes `.no-js`/`.stage-bad` preservados.

---

## Issues sistemicos

- **Source-tag line breaking**: texto longo quebra em 1280x720. Sem fix viavel.
- ~~**Gate 0 ANIMATION_STATE false positive**~~: corrigido no prompt (C1, commit `3e03eb6`). State machines agora exempted.
- **engine.js `?qa=1`**: nao forca estado final de custom anims. Workaround: Playwright evaluate.
- **exit 2 hooks Windows**: nao bloqueia tool. Bug Claude Code. Investigar.
- **C1 bodyWordCount**: slides com zones (rule5 50w, fib4 41w) excedem 30w. Inerente a escala — aceito.
- **C6 noPanelOverlap**: mede bounding box do container, nao conteudo visivel. False positive aceito.

---

## Backlog

- PDF export (DeckTape) — nao bloqueia congresso
- Playwright MCP nao navega deck.js (E56) — script Node standalone
- P4: mapear E-codes (slide-rules.md §8 vs ERROR-LOG)
- Reorg `scripts/` em subdirs (alto risco, adiado pos-31/mar)
- `#slide-id-label` em deck.js (remover antes de producao)
- Scripts hardening MINIMAL/HIGH — ref: `@repo/docs/HARDENING-SCRIPTS.md`
- Dead CSS cleanup: ~20 instancias `oklch(0% 0 0` restantes (ERRO-063)

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

1. ~~Renomear D'Amico para "Child, MELD e D'Amico"~~ (feito: s-a1-cpt, 30/mar)
2. Criar 1-2 slides MELD separados (conteudo antigo em _archive/02b-a1-damico-backup.html)
3. Sequencia "Testes nao invasivos"
3. Sequencia "Scores e nuances"
4. MELD / MELD-Na / MELD 3.0 redesign
5. Checkpoint "qual o proximo passo?"
6. Slide final Ato 1: "Trajetorias"

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

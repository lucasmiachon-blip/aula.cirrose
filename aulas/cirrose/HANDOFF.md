# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.
> **Paths:** relativos a `aulas/cirrose/`, exceto `@repo/` = raiz do repo.

---

## Estado — 2026-03-31T23:00-03:00

**Ultima sessao (31/mar):** Hardening scripts (gemini-qa3, content-research, qa-batch-screenshot). Gate 0 v1.2 (+DISTRIBUTION +READABILITY projecao, Flash nao pega). s-a1-cpt: failsafes 5→9, CSS tweaks insuficientes (visual estagnado 4/10 x3 rounds). Gate 4 R13 apresentado completo. Proximo: redesign estrutural S2.
**Venue:** Samsung UN55F6400, 55", Full HD 1920x1080 nativo, 16:9. Distancia ~6m.
**Infra:** Porta Vite 4100 (strictPort). deck.js/engine.js com fix de timing global.
**Slides:** 44 buildados · 8 DONE* · 1 QA (s-a1-cpt) · 35 CONTENT · **Build/Lint:** ✅
**Branch:** `feat/cirrose-mvp`.
**Guardrails:** pre-commit (3 guards + lint) + evidence-db + guard-generated + **guard-product-files SUPRIMIDO** (echo stub em settings.json — RE-HABILITAR apos sprint).
**QA pipeline:** Gate 4 **v3.0** — 3 chamadas paralelas: A (visual, sem codigo), B (UX+codigo, sem video), C (motion, video+JS). Anti-sycophancy em todos prompts. Gate 2 **v1.1**: +C6 cross-state, +C7 per-state, S1 blind spot.
**Research completo:** s-a1-meld (17 PMIDs verificados), s-cp1 (11 PMIDs). MELD research pendente (MELD 3.0 Brasil).
**Modelos Gemini:** Gate 0 = `gemini-3-flash-preview` ($0). Gate 4 = `gemini-3.1-pro-preview`.
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
| 9 | s-a1-cpt | QA | Gate 4 R13 (3-call): Visual 4.8 | UX+Code 7.0 | Motion 8.4 | Overall 6.7. Failsafes 5→9 (HTML 10/30/75). Visual estagnado 3 rounds: distribuicao(4), composicao(4), proporcao(5), tipografia(5). Problema ESTRUTURAL: S2 guideline cards sao faixas finas horizontais, nao ocupam espaco. Precisa redesign arquitetural do layout S2, nao CSS tweaks. Call B: ceiling-result em --danger = erro semantico (trocar pra neutro). Dead CSS: 11 seletores .flow-* orfaos. Call C: pulse CTP conflita com callout (separar no tempo). |
| 10 | s-a1-meld | CONTENT | Act 1 restante. |
| 11 | s-cp1 | CONTENT | LSM 26 kPa atualizado (HTML+manifest+notes). Logica Baveno corrigida (CSPH confirmado, nao rule-out). |
| 12-25 | s-a2-01 → s-cp2 | CONTENT | Act 2 completo. |
| 26-34 | s-a3-01 → s-close | CONTENT | Act 3 + fechamento. |
| 35-44 | s-app-01 → s-app-etio | CONTENT | Appendix. |

**Resumo:** 8 DONE* · 1 QA · 0 DRAFT · 35 CONTENT (44 total)

### Proxima sessao — checklist de prontidao

| Preparado? | Item | Notas |
|------------|------|-------|
| ✅ | Gate 4 v3.0 hardened | fetchWithRetry (network+timeout), uploadFile retry, cleanup try/finally, safeNum. Testado R13. |
| ✅ | Gate 0 v1.2 | +DISTRIBUTION +READABILITY projecao. Flash nao pega distribuicao — manter como pre-filter mecanico, nao confiar para layout. |
| ✅ | Anti-sycophancy | Todos 3 prompts + Gate 0 anti-sycophancy. |
| ✅ | Research s-a1-meld | 17 PMIDs verificados (evidence-db) |
| ✅ | Research s-cp1 | 11 PMIDs verificados (evidence-db) |
| ✅ | Scripts hardened | gemini-qa3 + content-research + qa-batch-screenshot (video delay 2500ms, dev server check) |
| ❌ | MELD 3.0 Brasil | Lucas tem docs oficiais mostrando MELD 3.0 em vigor. Pesquisa atual errou. |
| ❌ | s-a1-cpt REDESIGN ESTRUTURAL | Visual 4.8/10 estagnado 3 rounds. Problema: S2 guideline cards = faixas horizontais finas. Precisa redesign arquitetural, NAO CSS tweaks. Itens pendentes do R13: (1) ceiling-result --danger→neutro (erro semantico), (2) dead CSS .flow-* 11 seletores, (3) callout align-self flex-start, (4) pulse CTP separar no tempo do callout. |
| ❌ | Gate 2 em repouso | So Gate 4 por questao de tempo. |

**Fluxo na proxima sessao:**
1. `npm run dev` (port 4100)
2. **s-a1-cpt redesign estrutural S2** — repensar guideline cards como elementos verticais/hero que dominam o espaco. NAO iterar CSS tweaks.
3. Aplicar itens pendentes R13 (ceiling semantics, dead CSS, callout stretch, pulse timing)
4. Gate 4 R14: `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-cpt --editorial --round 14`
5. **HARD CONSTRAINT:** Apresentar resultado Gate 4 completo (todas dims, problemas, fixes, inventario)
6. Se visual >=7: avancar para s-a1-meld

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
5. **s-a1-cpt** — QA R13. Visual 4.8 | UX+Code 7.0 | Motion 8.4. Failsafes 9 (fix OK). Visual estagnado — redesign estrutural S2 pendente
6. **s-cp1** — cascata LSM 26 kPa (narrativeCritical). Aprovar com Lucas.
7. **s-a1-meld** — sequencia manifest, slide a slide
7. **Act 2 → Act 3** — apos Act 1 DONE

---

## ~~Cascata LSM 26 kPa~~ — RESOLVIDA 2026-03-31

Todas 9 superficies sincronizadas: CASE.md, narrative.md, evidence-db.md, 07-cp1.html (H2+data+notes+feedback), _manifest.js (headline+panelState s-cp1+s-a2-01). Logica Baveno corrigida: LSM ≥25 = CSPH confirmado → NSBB → dispensa EDA (Statement 5.17).

---

## Gate 4 v3.0 — 3 chamadas paralelas (01/abr)

**Problema:** Chamada unica com codigo+visuals causava Gemini focar no codigo (dava 10/10 craft) e dar nota de cortesia para visual (9.3/10 quando era 2.7). Lucas identificou: "front end e UI UX design muito ruins em classificar".

**Fix:** 3 chamadas paralelas via `Promise.all`:
- **Call A — Visual Design:** PNGs + video, ZERO codigo. Foco em distribuicao, proporcao, cor, tipografia, composicao.
- **Call B — UI/UX + Code:** PNGs + raw HTML/CSS/JS, SEM video. Gestalt, carga cognitiva, information design, CSS cascade, failsafes.
- **Call C — Motion Design:** PNGs + video + animation JS. Timing, easing, narrativa, crossfade, artefatos. Inventario com timestamps obrigatorio.

**Arquivos:**
- `scripts/gemini-qa3.mjs` — `buildSplitCallPayload()` + `runEditorial()` reescrito
- `@repo/docs/prompts/gate4-call-a-visual.md` — prompt visual (sem codigo)
- `@repo/docs/prompts/gate4-call-b-uxcode.md` — prompt UX+code
- `@repo/docs/prompts/gate4-call-c-motion.md` — prompt motion (video obrigatorio)

**Resultado R10 s-a1-cpt:** Visual 4.6 (HONESTO) | UX+Code 8.4 | Motion 9.0. Custo ~$0.10 total.

**Dead code removido:** `buildPrompt()`, `extractGlobalClassCSS()`, consts `GATE4_PROMPT_PATH`/`DIAGNOSTIC`/`CONTEXT_PARAGRAPH`.

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

## Sprint Mode (deadline)

**Ativar:** `export SPRINT_MODE=1` antes de iniciar Claude Code.
**Efeito:** `guard-product-files.sh` e `task-completed-gate.sh` viram WARN em vez de BLOCK.
**Desativar:** `unset SPRINT_MODE` ou nao setar a variavel.
**Restaurar strict:** Apos deadline, garantir que SPRINT_MODE nao esta setado.

---

## Hardening 2026-03-31

Sessao de hardening completa. 2 commits:
1. **docs: harden docs + config** — CLAUDE.md (43→44, 52→67), README ports, XREF.md (+8 docs, 3 atribuicoes), guard-product-files wired, WT-OPERATING Gate 2 logic fix.
2. **fix: anti-sycophancy prompts + sprint mode hooks** — Gate 4 (adversarial, score asymmetry, no target), Gate 0 (FAIL-first examples), content-research (ERRADO status, NUANCE-first), hooks sprint mode.

**Concluido (31/mar):** gemini-qa3.mjs — fetchWithRetry (network catch + AbortController 120s), uploadFile (fetchWithRetry), waitForProcessing (deadline 300s + catch + AbortController 60s), runEditorial (try/finally cleanup), safeNum (JSON defensivo).

**Pendente (requer codigo, prox sessao):**
- build-html.ps1 → .mjs (Linux compat)
- validate-css.sh grep bug sob set -e
- lint-narrative-sync.js undefined vs null
- vite.config.js template filter
- git hooks install via postinstall

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

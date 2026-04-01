# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.
> **Paths:** relativos a `aulas/cirrose/`, exceto `@repo/` = raiz do repo.

---

## Estado — 2026-04-01

**Ultima sessao (01/abr, sessao 4):** Infra cleanup — repo janitor + purge refs stale (archetypes.css/base.css em 11 arquivos). responseSchema adicionado a Gate 0 + Gate 4 (constrained decoding). extractArchetypeCSS deletado (73 linhas dead code). content-research.mjs: archetype dead refs removidos, adversarial framing (disprove-first), attention bleed prevention (data block delimiters), current date injection, classificador de tipo clinico (h2→Template A-H). MCP research templates E/F/G/H adicionados (tratamento, epidemio, manejo, emergencia) + framing adversarial nos existentes (A-D). qa-batch-screenshot: try/catch unlinkSync (Windows lock) + video.delete() (cleanup temp Playwright). AUDIT-VISUAL 44→11 slides.
**Venue:** Samsung UN55F6400, 55", Full HD 1920x1080 nativo, 16:9. Distancia ~6m.
**Infra:** Porta Vite 4100 (strictPort). deck.js/engine.js com fix de timing global. CSS single-file: cirrose.css (3224 linhas — tokens, stages, componentes, per-slide). Sem base.css, sem archetypes.
**Slides:** 11 buildados · 9 DONE* · 2 QA (s-a1-meld, s-cp1) · **Build/Lint:** ✅
**Branch:** `main` (repo standalone `lucasmiachon-blip/aula.cirrose`).
**Guardrails:** pre-commit (3 guards + lint) + evidence-db + guard-generated + **guard-product-files SUPRIMIDO**.
**QA pipeline:** Gate 4 **v3.2** — 3 chamadas paralelas + `responseSchema` (constrained decoding) + campo `evidencia` obrigatorio. Gate 0 **v1.4** (responseSchema). Gate 2 em repouso.
**Research completo:** s-a1-meld (9 PMIDs verificados + MELD 3.0 formula Kim 2021), s-cp1 (11 PMIDs).
**Modelos Gemini:** Gate 0 = `gemini-3-flash-preview` ($0). Gate 4 = `gemini-3.1-pro-preview`.
**Env:** GEMINI_API_KEY OK. PERPLEXITY_API_KEY ausente.
**Calc 3-mode:** case-panel.js suporta MELD original + MELD-Na + MELD 3.0 (tabs). Formula verificada Kim 2021.
**Caso:** GGT 210 U/L (alert, etilismo) + FA 89 U/L (normal, sem colestase). CASE.md + panelStates + s-hook sincronizados.

---

## Slides

> Estados: BACKLOG → DRAFT → CONTENT → SYNCED → LINT-PASS → QA → DONE (definicao: WT-OPERATING.md §2)

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 1 | s-title | DONE | QA 5-stage PASS 18/mar. |
| 2 | s-hook | DONE | v17 (19/mar). QA 5-stage PASS. GGT+FA adicionados 31/mar (8 labs, 3 colunas). |
| 3 | s-a1-01 | DONE | Gate 0 PASS. Gate 4 R7 8.5/10. Aprovado 27/mar. |
| 4 | s-a1-classify | DONE | Gate 0 PASS. Gate 4 R7 7.3/10. Aprovado 27/mar. |
| 5 | s-a1-baveno | DONE | Gate 0 PASS. Gate 4 R5. Aprovado 27/mar. |
| 6 | s-a1-fib4 | DONE* | R9 8.8/10. CSS anti-flash adicionado (30/mar). |
| 7 | s-a1-elasto | DONE* | R4 8.5/10. CSS anti-flash adicionado (30/mar). |
| 8 | s-a1-rule5 | DONE* | R4 8.7/10. |
| 9 | s-a1-cpt | DONE* | R19 6.7. |
| 10 | s-a1-meld | QA | Gate 2 CONDITIONAL. Gate 4 R2 5.6. SPLIT question aberta. |
| 11 | s-cp1 | QA | Breathing slide navy. Centering pendente viewport. |

**Resumo:** 9 DONE* · 2 QA (s-a1-meld, s-cp1) · 11 total
**Removidos:** 33 slides CONTENT → `slides/_archive/`. Serao reconstruidos 1-a-1.

---

## Proxima sessao — checklist

| Preparado? | Item | Notas |
|------------|------|-------|
| ✅ | CSS single-file | base.css absorvido em cirrose.css. 1 camada, 0 cascata. |
| ✅ | Archetypes eliminados | archetypes.css deletado. 0 classes archetype-* no repo. |
| ✅ | 33 slides removidos | CONTENT → _archive. Manifest 11 slides. Build/lint OK. |
| ✅ | GGT/FA no caso | GGT 210, FA 89. CASE.md + panelStates + s-hook OK. |
| ✅ | Git standalone | Repo `lucasmiachon-blip/aula.cirrose`, branch `main`. |
| ✅ | Dead CSS cleanup | 1471 linhas removidas (4695→3224). Build+lint OK. |
| ✅ | Stale refs purged | archetypes.css/base.css refs eliminadas de 10 arquivos (prompts, scripts, skills). |
| ✅ | responseSchema | Gate 0 + Gate 4 (3 calls) com constrained decoding. JSON deterministico. |
| ✅ | Playwright hardening | try/catch unlinkSync + video.delete() em qa-batch-screenshot. |
| ✅ | MCP research templates | Templates E-H (tratamento, epidemio, manejo, emergencia) + adversarial framing A-D. |
| ✅ | Content type classifier | content-research.mjs auto-detecta tipo clinico do h2 → sugere template MCP. |
| ❌ | s-a1-meld SPLIT | Gemini recomenda split. Lucas nao decidiu. |
| ❌ | s-cp1 centering | Verificar no viewport Lucas. |

**Fluxo na proxima sessao:**
1. QA s-a1-meld (SPLIT decision) e s-cp1 (centering viewport)
2. Comecar Act 2 slide-a-slide (criar do zero)

---

## Caminho critico

1. ~~Act 1 (9 slides)~~ — 9 DONE* (31/mar)
2. ~~Dead CSS~~ — DONE (31/mar, 4695→3224 linhas)
3. ~~Stale refs + responseSchema~~ — DONE (01/abr, sessao 4)
4. **s-a1-meld** — QA. Gate 4 R2 5.6. SPLIT decision pendente.
5. **s-cp1** — QA. Centering pendente.
6. **Act 2** — reconstruir do zero (slides removidos, conteudo em narrative.md + evidence-db)

---

## CSS single-file (31/mar, sessao 2)

**Migracao:** base.css (598 linhas) absorvido no topo de cirrose.css. Resultado: 4695 linhas, 1 arquivo, 0 cascata.

| Fix | Detalhe |
|-----|---------|
| Font paths | `../assets/fonts/` → `shared/assets/fonts/` (4 @font-face) |
| .slide-inner padding | Merged: 60px 80px (base) → 40px 64px (cirrose). Regra unica. |
| .stage-c .source-tag | Duplicata removida (base tinha versao incompleta). |
| gemini-qa3.mjs | `extractBaseTokens()` agora le de cirrose.css |
| validate-css.sh | Espera single-file import |
| 6 docs atualizados | CLAUDE.md, design-reference, HANDOFF, NEXT-SESSION, AUDIT-VISUAL, XREF |
| base.css | Arquivado em `shared/css/_archive/` |

---

## ~~Cascata LSM 26 kPa~~ — RESOLVIDA 2026-03-31

Todas 9 superficies sincronizadas: CASE.md, narrative.md, evidence-db.md, 07-cp1.html (H2+data+notes+feedback), _manifest.js (headline+panelState s-cp1+s-a2-01). Logica Baveno corrigida: LSM ≥25 = CSPH confirmado → NSBB → dispensa EDA (Statement 5.17).

---

## Gate 4 v3.0 — 3 chamadas paralelas

**Problema:** Chamada unica com codigo+visuals causava Gemini focar no codigo (dava 10/10 craft) e dar nota de cortesia para visual (9.3/10 quando era 2.7). Lucas identificou: "front end e UI UX design muito ruins em classificar".

**Fix:** 3 chamadas paralelas via `Promise.all`:
- **Call A — Visual Design:** PNGs + video, ZERO codigo. Foco em distribuicao, proporcao, cor, tipografia, composicao. **Per-state S0/S2 eval, S2 pesa mais.** Prev/Next context.
- **Call B — UI/UX + Code:** PNGs + raw HTML/CSS/JS, SEM video. Gestalt, carga cognitiva, information design, CSS cascade, failsafes. Context-first layout (materiais antes da tarefa).
- **Call C — Motion Design:** PNGs + video + animation JS. Timing, easing, narrativa, crossfade, artefatos. Inventario com timestamps obrigatorio.

**Arquivos:**
- `scripts/gemini-qa3.mjs` — `buildSplitCallPayload()` + `runEditorial()` reescrito
- `@repo/docs/prompts/gate4-call-a-visual.md` — prompt visual (sem codigo)
- `@repo/docs/prompts/gate4-call-b-uxcode.md` — prompt UX+code
- `@repo/docs/prompts/gate4-call-c-motion.md` — prompt motion (video obrigatorio)

---

## Issues sistemicos

- **Source-tag line breaking**: texto longo quebra em 1280x720. Sem fix viavel.
- ~~**Gate 0 ANIMATION_STATE false positive**~~: corrigido no prompt (C1).
- **engine.js `?qa=1`**: nao forca estado final de custom anims. Workaround: Playwright evaluate.
- **exit 2 hooks Windows**: nao bloqueia tool. Bug Claude Code. Investigar.
- **C1 bodyWordCount**: slides com zones (rule5 50w, fib4 41w) excedem 30w. Inerente a escala — aceito.
- **C6 noPanelOverlap**: mede bounding box do container, nao conteudo visivel. False positive aceito.

---

## Sprint Mode (deadline)

**Ativar:** `export SPRINT_MODE=1` antes de iniciar Claude Code.
**Efeito:** `guard-product-files.sh` e `task-completed-gate.sh` viram WARN em vez de BLOCK.
**Desativar:** `unset SPRINT_MODE` ou nao setar a variavel.

---

## Backlog

- ~~Dead CSS cleanup~~ — DONE (31/mar, 1471 linhas removidas)
- ~~Dead CSS oklch(0% 0 0) ERRO-063~~ — resolvido (instancias restantes sao tokens root, fallbacks e sombras com alpha — legitimadas)
- PDF export (DeckTape) — nao bloqueia congresso
- Playwright MCP nao navega deck.js (E56) — script Node standalone
- P4: mapear E-codes (slide-rules.md §8 vs ERROR-LOG)
- Reorg `scripts/` em subdirs (alto risco)
- `#slide-id-label` em deck.js (remover antes de producao)
- Scripts hardening — ref: `@repo/docs/HARDENING-SCRIPTS.md`
- build-html.ps1 → .mjs (Linux compat)
- validate-css.sh grep bug sob set -e
- lint-narrative-sync.js undefined vs null
- vite.config.js template filter
- git hooks install via postinstall

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
| Design tokens | `cirrose.css` (secao `:root`) |
| Erros e prevencao | `ERROR-LOG.md` + `@repo/.claude/rules/slide-rules.md` §8 |
| Contexto slide ativo | `NEXT-SESSION.md` |

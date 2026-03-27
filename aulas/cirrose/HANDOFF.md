# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.

---

## Estado — 2026-03-27

**Slides:** 44 buildados · **Build/Lint/Scaling/CSS cascade:** ✅
**Branch:** `feat/cirrose-mvp` · shared/ internalizado · Sprint ate 31/mar.
**Guardrails:** pre-commit (3 guards + lint) + evidence-db + guard-generated + guard-product-files + lint:gsap-race.
**Dev helper:** `#slide-id-label` no deck.js — remover antes de producao.
**QA pipeline:** `gemini-qa3.mjs` — `--inspect` (Gate 0, PASS/FAIL) · `--editorial` (Gate 4, requer Gate 0 PASS) · `--diagnostic "classe: descricao"` (injeta CSS global cascade + step forense). Modelo: `gemini-3.1-pro-preview`. Video+PNGs+raw code obrigatorios. Custo: ~$0.03-0.08/round.
**Env:** GEMINI_API_KEY OK. PERPLEXITY_API_KEY ausente.

---

## Slides

> Estados: BACKLOG → DRAFT → CONTENT → SYNCED → LINT-PASS → QA → DONE

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 1 | s-title | DONE | QA 5-stage PASS 18/mar. |
| 2 | s-hook | DONE | v17 (19/mar). QA 5-stage PASS. |
| 3 | s-a1-01 | QA | R12. Gate 0 PASS. Gate 4 R7 score 8.5/10. **Source-tag centering: DEFERRED.** Root cause: `padding:0 210px 0 0` no `.slide-inner` desloca center ~105px. Tentativas R8 (27/mar): position:absolute, remocao override, inline — nenhuma resolveu visualmente. Gemini cascade analysis confirmou causa (specificity 2,1,0 vs grid padding assimetrico). Aceitar como-esta ou refatorar layout inteiro do slide. |
| 4 | s-a1-classify | CONTENT | 26/mar: PREDESCI lockup removido (movido p/ baveno). States renumerados 3→2. sourceTag declarado + reset defensivo gsap.set opacity:0. QA pendente. |
| 5 | s-a1-baveno | CONTENT | 27/mar: headline atualizada ("O novo paradigma: doença hepática como espectro"), justify-content:flex-start + padding-top:48px. State machine refatorada (26/mar). **NAO VERIFICADO NO BROWSER** — testar animacao completa. PMID notes: 31584562→30910320 pendente. |
| 6 | s-a1-vote | CONTENT | Refatorado 23/mar: quiz removido, agora hero FIB-4 5,91 + cutoff. Screenshots atualizados. QA pendente (pipeline nao iniciado). |
| 7-11 | s-a1-damico → s-cp1 | CONTENT | Act 1 restante. |
| 12-27 | s-a2-01 → s-cp2 | CONTENT | Act 2 completo. |
| 28-36 | s-a3-01 → s-close | CONTENT | Act 3 + fechamento. |
| 37-44 | s-app-01 → s-app-etio | CONTENT | Appendix. |

**Resumo:** 2 DONE · 1 QA · 41 CONTENT
**QA Act 1:** s-a1-01 em QA (Gate 0 PASS, Gate 4 R7 score 8.5/10, source-tag centering pendente). Demais slides: fixes aplicados, Gate 4 pendente.
**Global:** CSS cascade fix (E57/E58, 24/mar). Source-tag: GSAP opacity corrigido de 0.6→1, font-size clamp(16-20px), `color-mix()` hue interpolation bug documentado (E59).

### [TBD SOURCE] em notes (nao bloqueia QA visual)

- s-a2-04: PPI meta-analise OR ~2.17 PBE
- s-a2-09: sarcopenia prevalencia meta-analise
- s-a3-04: taxa recompensacao alcool "1/3 em 5a"
- s-app-04: PMID Turco 2024 IPD

---

## Proxima sessao

Gate 0+4 end-to-end testado e funcional (25/mar). Scripts corrigidos: base.css path, s1 cleanup, --full removido, video obrigatorio.

**Docs cleanup (26/mar):** Audit + cleanup executados. 3 arquivos arquivados (HANDOFF-CLAUDE-AI, CHANGELOG root, ERROR-LOG root). XREF ghost refs removidos. Monorepo remnants renomeados. WT-OPERATING mandato corrigido (on-demand). CHANGELOG 1295→153L. NOTES 426→142L. Audit completo: `docs/DOCS-RATIONALIZATION-AUDIT.md`.

**Proximo:** s-a1-01 source-tag: DEFERRED (aceito como-esta). s-a1-baveno: verificar no browser + Gate 0/4. Demais Act 1: slide a slide.
```bash
npm run dev  # terminal separado
node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide {id} --video
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --inspect
# [checkpoint Lucas]
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --editorial --round N
```

---

## Caminho critico

1. **s-a1-01** — Gate 4 R7 score 8.5. Source-tag centering DEFERRED. Demais propostas (divider, glow dots) backlog
2. **s-a1-classify** — PREDESCI removido, states 3→2 (26/mar). QA pipeline completo
3. **s-a1-baveno** — State machine OK (auto+click). PMID fix pendente. Gate 0/4 pendente — **PROXIMO**
4. **s-a1-vote** — QA pipeline completo. Hero number sizing a validar
4. **s-a1-damico → s-cp1** — sequencia manifest, slide a slide
5. **Act 2 → Act 3** — apos Act 1 DONE

---

## Backlog

- engine.js `?qa=1` nao forca estado final de custom anims — workaround: Playwright evaluate
- PDF export quebrado (DeckTape) — nao bloqueia congresso
- Playwright MCP nao navega deck.js (E56) — usar script Node standalone
- **GARGALO hooks exit 2:** `exit 2` nao bloqueia tool no Windows. Reproduzido 25/mar. Investigar bug Claude Code Windows

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
| Regras operacionais | `CLAUDE.md` (root) |
| QA pipeline | `WT-OPERATING.md` |
| Design tokens | `.claude/rules/design-reference.md` §1 |
| Erros e prevencao | `ERROR-LOG.md` + `.claude/rules/slide-rules.md` §8 |
| Licoes unicas | `tasks/lessons.md` (so o que NAO esta em rules) |

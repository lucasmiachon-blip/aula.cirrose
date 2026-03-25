# HANDOFF — Cirrose

> Pendencias ativas. Historico → CHANGELOG.md. Erros → ERROR-LOG.md.

---

## Estado — 2026-03-25

**Slides:** 44 buildados · **Build:** ✅ · **Lint:** ✅ · **Scaling:** ✅ · **CSS cascade:** ✅ (validate-css.sh)
**Repo:** `aula.cirrose` (separado de Aulas 24/mar). Branch: `feat/cirrose-mvp`.
**Standalone:** shared/ em `./shared/` (internalizado 22/mar). Sprint mode ate 31/mar.
**Guardrails:** pre-commit (3 guards + lint) + evidence-db hooks + guard-generated (index.html) + guard-product-files (human-in-the-loop) + lint:gsap-race (CSS/GSAP race detector v1).
**Hooks fix (24-25/mar):** 3 bugs Windows corrigidos — (1) `set -euo pipefail` crashava guard-product-files (removido -e/-o, mantido -u); (2) node arg passando JSON >8KB crashava no Windows (trocado por stdin pipe); (3) `readFileSync('/dev/stdin')` crashava silenciosamente no Git Bash Windows (`/dev/stdin` nao existe → `ENOENT C:\dev\stdin`). Fix: `readFileSync(0)` (fd 0 = stdin, cross-platform). Backslash→forward slash normalization adicionada em todos os hooks com path matching.
**CSS cascade fix (24/mar):** Import order corrigido `base → archetypes → cirrose` (E57). `.stage-bad .source-tag` unificado (E58). `scripts/validate-css.sh` criado.
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
| 3 | s-a1-01 | CONTENT | R12 (22/mar). Gate 0 PASS. Fixes E54/E55 + border-left (23/mar). Screenshot recapturado 25/mar (S0-1280x720.png). Diagnostic QA: 9 superficies synced, lint clean, AUDIT-VISUAL corrigido. Gate 4 Gemini pendente. |
| 4 | s-a1-baveno | CONTENT | Refatorado 23/mar: removido pathway, adicionado PREDESCI callout. Screenshots atualizados. QA pendente (pipeline nao iniciado). |
| 5 | s-a1-classify | CONTENT | Refatorado 23/mar: header PREDESCI verde (#2d5016), source-tag visivel. Screenshots atualizados. QA pendente (pipeline nao iniciado). |
| 6 | s-a1-vote | CONTENT | Refatorado 23/mar: quiz removido, agora hero FIB-4 5,91 + cutoff. Screenshots atualizados. QA pendente (pipeline nao iniciado). |
| 7-11 | s-a1-damico → s-cp1 | CONTENT | Act 1 restante. |
| 12-27 | s-a2-01 → s-cp2 | CONTENT | Act 2 completo. |
| 28-36 | s-a3-01 → s-close | CONTENT | Act 3 + fechamento. |
| 37-44 | s-app-01 → s-app-etio | CONTENT | Appendix. |

**Resumo:** 2 DONE · 42 CONTENT
**QA Act 1:** s-a1-01 Gate 0 PASS, fixes E54/E55 aplicados, screenshot recapturado 25/mar, AUDIT-VISUAL corrigido, Gate 4 Gemini pendente. 3 slides refatorados (baveno/classify/vote) pipeline nao iniciado.
**Global:** CSS cascade fix (E57/E58, 24/mar). Source-tag vs case-panel fix (E55). Playwright MCP workaround (E56).
**Source-tag investigacao (25/mar):** Base `.source-tag` tem defaults errados (center, 10px, nowrap) + 5 overrides competindo. Fix testado (right-aligned, clamp 14-16px, justify-self stretch) — aplicado e revertido para revisao manual. Diagnostico: `archetype-hero-stat` tem `justify-items: center` que constrange largura do source-tag.

### [TBD SOURCE] em notes (nao bloqueia QA visual)

- s-a2-04: PPI meta-analise OR ~2.17 PBE
- s-a2-09: sarcopenia prevalencia meta-analise
- s-a3-04: taxa recompensacao alcool "1/3 em 5a"
- s-app-04: PMID Turco 2024 IPD

---

## Caminho critico

1. **s-a1-baveno** — QA pipeline completo (Gate 1→4), slide-a-slide
2. **s-a1-classify** — QA pipeline completo. PREDESCI card cortado no bottom (detectado em screenshot 23/mar)
3. **s-a1-vote** — QA pipeline completo. Hero number sizing a validar
4. **s-a1-damico → s-cp1** — sequencia manifest, slide a slide
5. **Act 2 → Act 3** — apos Act 1 DONE

---

## Backlog

- engine.js `?qa=1` nao forca estado final de custom animations (workaround: Playwright evaluate). Custom anims sao state machines — forcar "ultimo estado" requer saber qual estado e o final.
- ~~h2 assertivo fib4: Lucas decide no browser~~ → refatorado para hero-stat "Aplicando ao Antonio" (23/mar)
- PDF export quebrado (DeckTape) — nao bloqueia congresso (projecao ao vivo)
- Nomes de arquivo enganosos (ver slide-rules.md §7) — cosmetic, ID no manifest importa
- ~~3 dead CSS selectors~~ → `.framework-box` e `.predict-bars` removidos (23/mar). `.etiology-table` viva (05-a1-infeccao.html)
- Fontes woff2: Vite base condicional aplicado (23/mar). Testar `npm run dev` para confirmar @font-face resolve
- qa-batch-screenshot.mjs so captura 1 estado (S0). Antes capturava S0/S1-mid/S2-final em 2 resolucoes — investigar pos-congresso
- Playwright MCP nao navega deck.js (E56). Usar script Node standalone para screenshots de slides especificos
- **GARGALO hooks exit 2:** `guard-generated.sh` parseia path corretamente e faz match, mas `exit 2` NAO bloqueia a tool no Windows. Hook roda, detecta `aulas/*/index.html`, imprime JSON error, faz exit 2 — Claude Code ignora e executa a edicao. Reproduzido 25/mar. `guard-product-files.sh` (sed-based) possivelmente mesmo problema. Investigar se e bug Claude Code Windows ou formato de output errado

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

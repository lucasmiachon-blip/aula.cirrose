# HANDOFF — Cirrose (projeto)

> Só pendências ativas. Histórico → CHANGELOG.md. Erros → ERROR-LOG.md. Claude.ai → HANDOFF-CLAUDE-AI.md

---

## Estado atual — 2026-03-17 (QA pipeline ativo)

**Slides:** 44 buildados · **Build:** ✅ · **Lint:** ✅
**Scaling:** ✅ JS `scaleDeck()` confirmado.
**Integridade:** ✅ `.slide-integrity` SHA-256 + Guard 4 pre-commit.
**ERROR-LOG:** 35/35 corrigidos, 0 pendentes.
**QA Workflow:** `WT-OPERATING.md` — maquina de estados + QA loop 5-stage com Gemini.
**QA Script:** `scripts/qa-batch-screenshot.mjs` — captura automatizada por ato.
**Visual Audit MCPs:** gemini, a11y-contrast, frontend-review, chrome-devtools configurados em `.mcp.json`.
**Ultimo merge main:** `bfb3268` (2026-03-17) — governance hardening (624ebec), evolve patches (2f9e909), GSAP 3.14.2, rules split deck-patterns/reveal-legacy. Zero Classe C.

---

## Estado dos Slides (maquina de estados — WT-OPERATING.md)

> Estados: BACKLOG → DRAFT → CONTENT → SYNCED → LINT-PASS → QA → DONE
> Verificar 1 a 1 antes de registrar. Nao assumir.

### Pre-Act + Act 1

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 1 | s-title | LINT-PASS | HTML completo, sem [TBD]. Nunca passou QA formal. |
| 2 | s-hook | LINT-PASS | v8 polish. Archetype-adjusted (14 dims >= 8). Sem aprovacao humana QA. |
| 3 | s-a1-01 | LINT-PASS | v3 polish "Por que rastrear?". Sem QA formal. Ghost canary protege. |
| 4 | s-a1-classify | DONE | QA PASS 17/mar. 14 dims >= 9. Warning icon fix (E15). |
| 5 | s-a1-vote | CONTENT | HTML completo, poll archetype. Sem sync check. |
| 6 | s-a1-damico | CONTENT | HTML completo, flow archetype. CSS compactado (fill fix). |
| 7 | s-a1-baveno | CONTENT | HTML completo. |
| 8 | s-a1-fib4 | CONTENT | HTML completo. h2 mnemonico (Lucas decide). |
| 9 | s-a1-rule5 | CONTENT | HTML completo, flow archetype. |
| 10 | s-a1-meld | CONTENT | HTML completo. MELD-Na calc interativo. |
| 11 | s-cp1 | CONTENT | Checkpoint. narrativeCritical. Inline style fix. |

### Act 2

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 12 | s-a2-01 | DRAFT | Esqueleto HTML. |
| 13 | s-a2-02 | DRAFT | Esqueleto HTML. |
| 14 | s-a2-03 | DRAFT | Esqueleto HTML. |
| 15 | s-a2-04 | DRAFT | Esqueleto HTML (migrado de Act 1). |
| 16 | s-a2-05 | DRAFT | Esqueleto HTML. |
| 17 | s-a2-06 | DRAFT | Esqueleto HTML. |
| 18 | s-a2-07 | DRAFT | Esqueleto HTML. |
| 19 | s-a2-08 | DRAFT | Esqueleto HTML. |
| 20 | s-a2-09 | DRAFT | Esqueleto HTML. |
| 21 | s-a2-10 | DRAFT | Esqueleto HTML. |
| 22 | s-a2-11 | DRAFT | Esqueleto HTML. |
| 23 | s-a2-12 | DRAFT | Esqueleto HTML. |
| 24 | s-a2-13 | DRAFT | Esqueleto HTML (migrado de appendix). |
| 25 | s-a2-14 | DRAFT | Esqueleto HTML (migrado de appendix). |
| 26 | s-a2-15 | DRAFT | Esqueleto HTML. |
| 27 | s-cp2 | DRAFT | Checkpoint. narrativeCritical. |

### Act 3

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 28 | s-a3-01 | DRAFT | Esqueleto HTML. |
| 29 | s-a3-02 | DRAFT | Esqueleto HTML. |
| 30 | s-a3-03 | DRAFT | Esqueleto HTML. |
| 31 | s-a3-04 | DRAFT | Esqueleto HTML. |
| 32 | s-a3-05 | DRAFT | Esqueleto HTML. |
| 33 | s-a3-06 | DRAFT | Esqueleto HTML. |
| 34 | s-a3-07 | DRAFT | Esqueleto HTML. |
| 35 | s-cp3 | DRAFT | Checkpoint. narrativeCritical. |
| 36 | s-close | DRAFT | Recap. narrativeCritical. |

### Appendix

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 37 | s-app-01 | DRAFT | ACLF. |
| 38 | s-app-02 | DRAFT | Early TIPS. |
| 39 | s-app-03 | DRAFT | ABCW. |
| 40 | s-app-04 | DRAFT | NSBB. |
| 41 | s-app-alb | DRAFT | Albumina. |
| 42 | s-app-07 | DRAFT | Estatina. |
| 43 | s-app-08 | DRAFT | CIRROXABAN. |
| 44 | s-app-etio | DRAFT | Etiologias. |

---

## CAMINHO CRÍTICO

### P0 ATUAL: Fix gargalos QA Loop 1 (E, M, L) slide a slide

Foco em produto: corrigir gargalos identificados no QA Loop 1 baseline (E, M, L) slide a slide.
**Plano detalhado:** Cursor plan `qa_bloco_1_execucao` (arquivo externo ao repo)

**Fixes aplicados (15/mar sessão Cursor):**
1. ~~**s-a1-damico**~~ ✅ — era-source removidos, tags trimmed, CSS compactado (fill 196%→~90%)
2. ~~**s-a1-01**~~ ✅ — padding reduzido, hero ampliado, pathway steps maiores (fill 52%→~65%)
3. ~~**s-hook**~~ ✅ — failsafes .no-js/.stage-bad adicionados (labs + punchline + question)
4. ~~**s-cp1**~~ ✅ — inline style → .poll-question, aria-labels nos buttons

**Fixes aplicados (15/mar sessão Claude Code):**
5. ~~**s-title**~~ ✅ — navy bg via CSS, re-scope tokens, brasão filter:none, divider removido. Scroll sistêmico resolvido (base.css: notes hidden + overflow hidden). Ver ERRO-034.

**Fixes aplicados (16/mar sessão Claude Code — s-a1-01 polish v3):**
6. ~~**s-a1-01**~~ ✅ — h2 provocativo "Por que rastrear?", hero context removido, guideline-rec card com bold nos 3 critérios, source-tag footer restaurado, auto-margin vertical distribution. Claude Vision 3.9/5.

**Fixes aplicados (17/mar sessão Claude Code — s-a1-classify redesign):**
7. ~~**s-a1-classify**~~ ✅ — Redesign + QA polish PASS. Warning icon --warning→--warning-on-light (E15, 3.77→7.03:1). Gate 1+2+3 PASS, 14 dims ≥9. Build ✅ · Lint ✅ · Contraste ✅.

**Próximos passos:**
8. Per-slide audit Act 1 (Fase 2): constraint check + Claude Vision + score 14 dims
8. Fix loop ate PASS (todas dims >= 9)
9. Dynamic gate (Fase 3): animacoes + click-reveals
10. Deck-level Gemini (Fase 4): cross-slide consistency

**s-hook (DONE — QA visual PASS archetype-adjusted, 16/mar):**
- v8 polish (16/mar): grid 3×2 responsivo (`max-width: min(960px, 80%)`), `space-evenly` vertical, lab values `--text-h3`, punchline `font-weight: 700`, shadow `0 2px 8px`, panel 180px, ref text weight 500, `--bg-card` + `--border` para ancorar cards
- Testado 1920×1080: zero overflow, punchline+question com margem confortável
- Pergunta: "Qual sua conduta?" (narrativeCritical aprovado)
- Case panel: neutral (labs no corpo + panel lateral)
- Failsafes `.no-js`/`.stage-bad` para labs + punchline + question
- Build ✅ · Lint ✅ · AUDIT-VISUAL.md atualizado (14 dims ≥ 8)

### Backlog

- QA visual Gemini (estático por state + dinâmico): screenshots state-by-state, vídeo de reveals, monotonia visual Act 2
- h2 assertivo fib4: Lucas decide no browser (mnemônico mantido por decisão)
- Headlines reescritos neste batch: s-a1-01 (verboso→83%), s-a1-damico (verboso→Child-Pugh), s-a1-meld (metáfora→urgência)
- ~~2 HEX hardcoded em cirrose.css~~ ✅ Resolvido — restam apenas fallbacks `var(..., #hex)` válidos
- **[MAIN P03]** Bash write-guard hook: fechar bypass sed/echo em shared/ e evidence-db → novo `.claude/hooks/guard-bash-write.sh` + `settings.json` (medium risk)
- **[MAIN P04]** Remover `python *` da allow list em `settings.json` (low risk)
- PDF export quebrado (DeckTape)
- Nomes de arquivo semanticamente enganosos (05-a1-infeccao → s-a2-04, 24-app-ccc → s-a2-13, etc.)
- [TBD SOURCE]: sarcopenia prevalência, covert HE, centros TIPS Brasil, ESPEN 2019 PMID, QTc threshold

---

## FORA DE ESCOPO AGORA

Headings explicitamente adiados para batch posterior ao QA baseline do Act 1:

1. Renomear D'Amico para "Child, MELD e D'Amico: os modelos prognóstico"
2. Sequência "Testes não invasivos — mudança de paradigma"
3. Sequência "Scores e nuances"
4. Slide explicativo de elastografia
5. The Rule of 5 (redesign/expansão)
6. MELD / MELD-Na / MELD 3.0 (redesign/expansão)
7. Checkpoint "qual o próximo passo?"
8. Slide final do Ato 1: "Trajetórias — Cirrose e suas descompensações"

Acts 2 e 3: bloqueados até Act 1 atingir PASS (todas 14 dimensões >= 9).

---

## Decisões TRAVADAS — Ato 2

### Estrutura (NÃO reabrir)
- Cascata clínica do MESMO paciente (não lista de tópicos)
- 15 slides + CP2 (16 total) na ordem definida em narrative.md
- 5 interações: PBE (A2-05), HDA/TIPS (A2-06), BB/NSBB toggle (A2-07), TX (A2-10), ICA checklist (A2-12)
- Albumina distribuída (LVP + PBE + ACLF challenge), consolidada no apêndice
- NSBB pós-HDA = profilaxia SECUNDÁRIA (PREDESCI NNT 9 = callback Act 1, não hero)
- HRS-AKI lidera headline (CONFIRM NNT 7, NNH 12). ACLF = contexto de severidade
- Nutrição = slide próprio (INCONTESTÁVEL)

### MELDs intermediários
Canônicos (CASE.md): ~10, 28, 12. Os valores 12/14/17/18/24 são CONSTRUÇÕES NARRATIVAS.
Moram em: narrative.md + _manifest.js panelStates. NÃO em CASE.md.

### Ato 3
Cenário HIPOTÉTICO, não continuação direta. CP2 fecha o caso real.

---

## Migração de IDs (referência)

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

## Referências cruzadas (para próximo agente)

| O quê | Onde |
|-------|------|
| Dados do paciente | `references/CASE.md` (#1 autoridade) |
| Trials e PMIDs | `references/evidence-db.md` (#2 autoridade) |
| Arco narrativo + pacing | `references/narrative.md` (#3 autoridade) |
| Ordem dos slides | `slides/_manifest.js` (#4 autoridade) |
| Blueprint Act 2 detalhado | `RAW_ACT2_V2.md` |
| Blueprint Act 3 detalhado | `RAW_ACT3_V1.md` |
| Contrato Act 3 | `ACT3-CONTRACT-V1.md` |
| Regras operacionais | `CLAUDE.md` (cirrose) |
| Design tokens | `.claude/rules/design-system.md` |
| Erros e prevenção | `ERROR-LOG.md` |
| Lições aprendidas | `tasks/lessons.md` |
| PMIDs Tier-1 verificados | `.claude/rules/medical-data.md` |

---

## MCPs — não usar a princípio

- **attention-insight** (sharp fallback ou API paga)
- **frontend-review** (Hyperbolic) — before/after visual diff

Stack QA ativo: playwright, lighthouse, a11y, ui-ux-pro, design-comparison, floto, clinicaltrials, perplexity.

---

## Enforcement (implementado)

- lint:case-sync, lint:narrative-sync, lint:slides — todos passam
- Decision Record protocol para slides narrativeCritical
- 5 slides narrative-critical: s-hook, s-cp1, s-cp2, s-cp3, s-close

---

## Offline

`npm run build:cirrose`, `npm run lint:slides`, `npm run preview` — funcionam offline.

---

## Onde paramos (2026-03-17)

- **Main:** NAO absorver no momento. Ultimo merge: bfb3268.
- **Push:** Quando seguro — rodar `npm run done:cirrose` (ou `:strict`). Gate 2 (screenshots) pode WARN em iteracao.
- **Working tree:** LIMPA (fib4calc descartado via `git restore`).
- **Build+Lint:** PASS (44 slides).
- **Fantasma s-a1-01:** Main tem versão "burden" OBSOLETA. WT tem versão "rastreio" CANÔNICA. Ver NOTES.md [17/03]. NUNCA copiar de main.
- **WT-OPERATING.md:** CRIADO — maquina de estados + QA loop 5-stage com Gemini. Substituiu QA-WORKFLOW.md como processo operacional.
- **QA Act 1:** s-a1-classify = DONE (unico). 10 slides restantes em CONTENT ou LINT-PASS. Workflow: WT-OPERATING.md secao 4.
- **Proximo slide:** s-title (LINT-PASS → QA). Apresentar QA.0 ao Lucas.
- **MCP fix (17/mar):** `scripts/mcp-switch.js` agora resolve `${PROJECT_DIR}` e aplica `cmd /c` wrapper para Windows. `.mcp.json` regenerado via `npm run mcp:dev`.

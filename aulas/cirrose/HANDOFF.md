# HANDOFF — Cirrose (projeto)

> Só pendências ativas. Histórico → CHANGELOG.md. Erros → ERROR-LOG.md. Claude.ai → HANDOFF-CLAUDE-AI.md

---

## Estado atual — 2026-03-18 (QA pipeline ativo)

**Slides:** 44 buildados · **Build:** ✅ · **Lint:** ✅
**Scaling:** ✅ JS `scaleDeck()` confirmado.
**Integridade:** ✅ `.slide-integrity` SHA-256 + Guard 4 pre-commit.
**ERROR-LOG:** 40 registrados, 39 corrigidos, 1 processo (E42).
**QA Workflow:** `WT-OPERATING.md` — maquina de estados + QA loop 5-stage com Gemini 3.1 Pro.
**QA Script:** `aulas/cirrose/scripts/qa-batch-screenshot.mjs` — captura automatizada por ato.
**Profile ativo (.mcp.json):** 8 MCPs base (filesystem, playwright, eslint, lighthouse, a11y, notion, fetch, sharp). Visual audit MCPs (a11y-contrast, design-comparison, floto, chrome-devtools) via profile `qa`. Gemini via API REST direta (nao MCP local).
**Gemini modelo:** `gemini-3.1-pro-preview` (SEMPRE). API REST direta.
**Ultimo merge main:** `d7f91b9` (2026-03-18) — 4 commits: skills (medical-researcher, slide-punch, sync-evidence) + docs. Zero Classe C.

---

## Estado dos Slides (maquina de estados — WT-OPERATING.md)

> Estados: BACKLOG → DRAFT → CONTENT → SYNCED → LINT-PASS → QA → DONE
> Verificar 1 a 1 antes de registrar. Nao assumir.

### Pre-Act + Act 1

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 1 | s-title | DONE | QA 5-stage PASS 18/mar. Gemini 3.1 Pro 9/10. ERRO-036 (h1 specificity) + ERRO-037 (pillar dots). Font fallback deferido. |
| 2 | s-hook | QA | v10 (19/mar). Labs tipograficos (cards removidos), punchline 88-128px com bloom, dim overlay 35%, clinical-stutter DOM-order, reprodutivel (kill+reset). QA.0-QA.2 PASS. QA.3 round 1+2 Gemini aplicados. Pendente: QA.3 round 3 (prompt v2). |
| 3 | s-a1-01 | LINT-PASS | v3 polish "Por que rastrear?". Ghost canary protege. Sem QA formal. |
| 4 | s-a1-classify | LINT-PASS | QA prematuro (sem pipeline 5-stage). Revertido DONE → LINT-PASS 18/mar. Precisa QA.0-QA.4 completo. |
| 5 | s-a1-vote | CONTENT | Poll archetype. Conteudo completo, notes com timing. |
| 6 | s-a1-damico | CONTENT | Flow archetype. CSS compactado (fill fix 15/mar). |
| 7 | s-a1-baveno | CONTENT | Hero-stat. Conteudo completo, PMIDs em notes. |
| 8 | s-a1-fib4 | CONTENT | Hero-stat + calc interativo. h2 mnemonico (Lucas decide). |
| 9 | s-a1-rule5 | CONTENT | Flow archetype. Conteudo completo. |
| 10 | s-a1-meld | CONTENT | Hero-stat + MELD-Na calc. Conteudo completo. |
| 11 | s-cp1 | CONTENT | Checkpoint. narrativeCritical. Inline style fix 15/mar. |

### Act 2

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 12 | s-a2-01 | CONTENT | Gatilhos descompensacao. Conteudo completo, PMIDs em notes. |
| 13 | s-a2-02 | CONTENT | Ascite dx. Conteudo completo. |
| 14 | s-a2-03 | CONTENT | Ascite manejo. Conteudo completo. |
| 15 | s-a2-04 | CONTENT | Infeccao. [TBD SOURCE] em notes (PPI/PBE meta-analise). |
| 16 | s-a2-05 | CONTENT | PBE. Conteudo completo, NNT + PMID. |
| 17 | s-a2-06 | CONTENT | HDA varicosa. Conteudo completo. |
| 18 | s-a2-07 | CONTENT | NSBBs/carvedilol. 3 click-reveals. Conteudo completo. |
| 19 | s-a2-08 | CONTENT | Encefalopatia. Conteudo completo. |
| 20 | s-a2-09 | CONTENT | Nutricao/sarcopenia. [TBD SOURCE] em notes (prevalencia meta). |
| 21 | s-a2-10 | CONTENT | Transplante. Conteudo completo. |
| 22 | s-a2-11 | CONTENT | HRS-AKI. Conteudo completo, CONFIRM trial. |
| 23 | s-a2-12 | CONTENT | Ascite refrataria. Conteudo completo. |
| 24 | s-a2-13 | CONTENT | Cardiomiopatia cirrotica. Conteudo completo. |
| 25 | s-a2-14 | CONTENT | SHP vs HPP. Conteudo completo. |
| 26 | s-a2-15 | CONTENT | Early TIPS. Conteudo completo. |
| 27 | s-cp2 | CONTENT | Checkpoint. narrativeCritical. Conteudo completo. |

### Act 3

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 28 | s-a3-01 | CONTENT | Bridge/cura etiologica. HR 0,46/0,35. Conteudo completo. |
| 29 | s-a3-02 | CONTENT | Recompensacao Baveno VII. Conteudo completo. |
| 30 | s-a3-03 | CONTENT | Criterio expandido 37,6%. Conteudo completo. |
| 31 | s-a3-04 | CONTENT | Etiologia e recompensacao. [TBD SOURCE] em notes (alcool 1/3 em 5a). |
| 32 | s-a3-05 | CONTENT | SVR/CSPH 53%. Conteudo completo. |
| 33 | s-a3-06 | CONTENT | Vigilancia 6 meses. Conteudo completo. |
| 34 | s-a3-07 | CONTENT | Fechamento ato 3. Conteudo completo. |
| 35 | s-cp3 | CONTENT | Checkpoint. narrativeCritical. Interativo. |
| 36 | s-close | CONTENT | Recap. narrativeCritical. "5 numeros, 3 decisoes." |

### Appendix

| # | Slide | Estado | Notas |
|---|-------|--------|-------|
| 37 | s-app-01 | CONTENT | ACLF grau 3, mortalidade. Conteudo completo. |
| 38 | s-app-02 | CONTENT | Early TIPS NNT 4. Conteudo completo. |
| 39 | s-app-03 | CONTENT | ABCW etiologias raras. Conteudo completo. |
| 40 | s-app-04 | CONTENT | NSBB Turco 2024 IPD. [PMID pendente] em notes. |
| 41 | s-app-alb | CONTENT | Albumina 3 indicacoes. Conteudo completo. |
| 42 | s-app-07 | CONTENT | Estatina LIVERHOPE. Conteudo completo. |
| 43 | s-app-08 | CONTENT | CIRROXABAN p=0,058. Conteudo completo. |
| 44 | s-app-etio | CONTENT | 10 etiologias. Conteudo completo. |

### Resumo estados

| Estado | Qtd | Slides |
|--------|-----|--------|
| DONE | 1 | s-title |
| QA | 1 | s-hook (QA.0-QA.2 PASS, pendente QA.3) |
| LINT-PASS | 2 | s-a1-01, s-a1-classify |
| CONTENT | 40 | Todos os demais |
| DRAFT | 0 | — |

### [TBD SOURCE] em notes (nao projetado — nao bloqueia QA visual)

- s-a2-04: PPI meta-analise OR ~2.17 PBE
- s-a2-09: sarcopenia prevalencia meta-analise
- s-a3-04: taxa recompensacao alcool "1/3 em 5a"
- s-app-04: PMID Turco 2024 IPD (publicado, PMID registry lag)

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

**s-hook (LINT-PASS — archetype-adjusted 14 dims >= 8, sem aprovacao humana QA, 16/mar):**
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
| Blueprint Act 2 detalhado | `RAW_ACT2_V2.md` (referencia historica — decisoes travadas acima) |
| Blueprint Act 3 detalhado | `RAW_ACT3_V1.md` (referencia historica) |
| Contrato Act 3 | `ACT3-CONTRACT-V1.md` (referencia historica) |
| Regras operacionais | `CLAUDE.md` (cirrose) |
| Design tokens | `.claude/rules/design-system.md` |
| Erros e prevenção | `ERROR-LOG.md` |
| Lições aprendidas | `tasks/lessons.md` |
| PMIDs Tier-1 verificados | `.claude/rules/medical-data.md` |

---

## MCPs — não usar a princípio

- **attention-insight** (sharp fallback ou API paga)
- **frontend-review** (Hyperbolic) — before/after visual diff

Stack QA no profile ativo (.mcp.json): playwright, lighthouse, a11y, eslint. Adicional via profile `qa`: design-comparison, floto, a11y-contrast, chrome-devtools. Adicional via profile `full`: ui-ux-pro, clinicaltrials, perplexity, + MCPs de pesquisa.

---

## Enforcement (implementado)

- lint:case-sync, lint:narrative-sync, lint:slides — todos passam
- Decision Record protocol para slides narrativeCritical
- 5 slides narrative-critical: s-hook, s-cp1, s-cp2, s-cp3, s-close

---

## Offline

`npm run build:cirrose`, `npm run lint:slides`, `npm run preview` — funcionam offline.

---

## Onde paramos (2026-03-19, sessao 4)

- **Sessao 4:** s-hook QA.3 — 2 rounds Gemini 3.1 Pro + fixes aplicados (v9 → v10).
- **Fixes aplicados:** G1-G14 (cards removidos, labs tipograficos, stagger DOM-order, cor alerta subida, punchline 88-128px com bloom, dim overlay 35%, question 32-48px weight 600, centro optico, JS reprodutivel com kill+reset).
- **Prompt Gemini reescrito:** Template v2 em `docs/prompts/gemini-slide-editor.md` — foco UI/UX profissional, hierarquias visuais, menos prescritivo.
- **Build+Lint:** PASS (44 slides).
- **QA pipeline:** s-title DONE. s-hook = QA (QA.0-QA.2 PASS, QA.3 rounds 1+2 done, pendente round 3 com prompt v2).
- **Proximo:** s-hook QA.3 round 3 (fresh eyes com prompt v2) → QA.4 → docs → DONE.

---

## Pendencias main-scope (audit 17/mar) — ✅ RESOLVIDO

> 42 issues detectados por auditoria completa (7 agentes, 2 rodadas).
> Corrigidos em main: commits 5c1976b (C1-C5), df12f1f (H1-H7), e7c0801 (M1-M10).
> Absorvidos nesta WT via merge e7c0801.

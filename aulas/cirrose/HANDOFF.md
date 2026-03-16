# HANDOFF — Cirrose (projeto)

> Só pendências ativas. Histórico → CHANGELOG.md. Erros → ERROR-LOG.md. Claude.ai → HANDOFF-CLAUDE-AI.md

---

## Estado atual — 2026-03-16 (pós scaling fix + integrity fingerprint)

**Slides:** 44 buildados · **Build:** ✅ · **Lint:** ✅
**Scaling:** ✅ JS `scaleDeck()` confirmado — `transform:scale()` responde a resize/fullscreen em qualquer resolução (1024x768, 1366x768, 1920x1080, 1920x1200 testados via Playwright).
**Pathway:** ✅ `s-a1-01` corrigido — `.screening-pathway flex-wrap:nowrap`, 3 cards em linha única.
**Overflow aparente:** ✅ Diagnosticado — artefatos GSAP (`opacity:0`). Conteúdo visível cabe em 720px.
**Integridade:** ✅ `.slide-integrity` SHA-256 por slide + Guard 4 pre-commit (build obrigatório antes de commit).
**ERROR-LOG:** 35/35 corrigidos, 0 pendentes.
**QA Act 1 fixes:** ✅ 4 slides fixados (damico, a1-01, hook, cp1). **Screenshots:** ⚠ Stale — precisam re-screenshot + re-score.
**QA Act 2/3:** ⏳ Bloqueado por Act 1 PASS.

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

**Próximos passos:**
6. Re-screenshot Playwright (screenshots atuais estão stale)
7. Re-score 14 dims nos slides fixados (AUDIT-VISUAL.md)
8. Smoke interações no browser
9. **==> PARAR para loop ralph-qa (Claude Code) <==**

**s-hook (DONE — /review QA pendente):**
- Pergunta: "Qual sua conduta?" (narrativeCritical aprovado)
- GGT removido → 6 labs grid 3×2 (simétrico)
- Case panel: neutral (labs no corpo + panel lateral com AST, ALT, PLQ, Albumina, Bili, INR)
- ALT card: hierarquia padronizada (removido `.hook-lab--success` e tag "normal ✓")
- CSS órfão limpo: `.hook-lab--success`, `.hook-lab-tag` e derivados (7 regras)
- ~85 linhas de CSS morto removidas (v1-v4 + sistema .hook-beat órfão)
- Inline style removido (INR text-transform → classe CSS)
- Failsafes `.no-js`/`.stage-bad` para labs + punchline + question
- `padding-right` para evitar overlap com panel lateral
- Build ✅ · 3 lints ✅ · `/review` QA pendente

### Backlog

- QA visual Gemini (estático por state + dinâmico): screenshots state-by-state, vídeo de reveals, monotonia visual Act 2
- h2 assertivo fib4: Lucas decide no browser (mnemônico mantido por decisão)
- Headlines reescritos neste batch: s-a1-01 (verboso→83%), s-a1-damico (verboso→Child-Pugh), s-a1-meld (metáfora→urgência)
- ~~2 HEX hardcoded em cirrose.css~~ ✅ Resolvido — restam apenas fallbacks `var(..., #hex)` válidos
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

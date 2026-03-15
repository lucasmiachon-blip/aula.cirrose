# CHANGELOG — Cirrose Masterclass

> Histórico de batches. Append-only (novos no topo). Estado → HANDOFF.md

---

## 2026-03-14 — Regra slide-identity (9 superficies)

Branch: `feat/cirrose-mvp`

- Nova regra `.claude/rules/slide-identity.md` + `.cursor/rules/slide-identity.mdc`
- Documenta as 9 superficies de identidade de um slide (manifest, HTML, registry, CSS, narrative, evidence-db, AUDIT, HANDOFF, index)
- Protocolos CRUD: criacao, rename, split, delete — com checklists atomicos
- Anti-patterns documentados (erros reais: ERRO-024, headline drift, file rename sem manifest)
- Tabela de nomes de arquivo enganosos (debt de migracao)
- Script de verificacao automatizada pre-commit
- CLAUDE.md cirrose: secao Manifest Sync → Slide Identity (referencia regra completa)
- CLAUDE.md raiz: adicionada referencia na lista de rules

---

## 2026-03-14 — Normalização modelo QA + limpeza documental cruzada

Branch: `feat/cirrose-mvp`

### Normalização 13→14 dimensões
- Corrigida contagem do modelo QA: 13→14 (8 visuais + 6 técnico-pedagógicas)
- Arquivos: AUDIT-VISUAL.md (6x), HANDOFF.md (2x), CLAUDE.md (2x)

### Limpeza documental cruzada (auditoria SoT)
- HANDOFF.md: Act 2 count 16→15 (CP2 contado separadamente nos 3 CP, soma=44)
- HANDOFF.md: Decisões TRAVADAS "16 slides + CP2" → "15 slides + CP2 (16 total)"
- HANDOFF.md: P0 ATUAL atualizado para refletir gargalos QA baseline (E, M, L)
- HANDOFF.md: backlog h2 corrigido (classify+meld já reescritos d20deec, só fib4 pendente)
- CLAUDE.md: FASE 1 count 33→44 slides
- CLAUDE.md: segunda seção Worktree renomeada "Worktree — Escopo e Restrições"
- docs/qa-checklist.md: rubrica atualizada 8 dim × 1-5 → 14 dim × 1-10 (28→44 slides)
- Scorecards Act 1 preservados integralmente
- Zero HTML/CSS/JS alterado

---

## 2026-03-14 — QA Loop 1 baseline Act 1 + limpeza HANDOFF + permissoes Claude Code

Branch: `feat/cirrose-mvp`

### QA Loop 1 baseline (AUDIT-VISUAL.md)

- 11 slides x 14 dimensoes = 154 scores reais inseridos em nova secao "Act 1 — QA Loop 1 Baseline"
- Evidencia: Playwright `act1-reaudit.mjs` (25 screenshots, metricas por slide)
- 3 lints PASS (slides + case-sync + narrative-sync)
- Nenhum slide PASS (todas dim >= 9). Gargalos: E (fill ratio), M (comunicacao), L (carga cognitiva)
- Rubrica e historico de rodadas anteriores preservados

### Limpeza HANDOFF.md

- Removidos 5 blocos DONE (Colisao IDs, Act 2 skeletons, Browser QA, Hardening, Act 3 skeletons) — -103 linhas
- Removidos 4 itens strikethrough no backlog (ERRO-008, ERRO-030, ERRO-031, pre-commit hook)
- Adicionada secao "FORA DE ESCOPO AGORA" (8 headings adiados + bloqueio Acts 2/3)
- Estado atual atualizado para refletir QA baseline aplicado

### Permissoes Claude Code (.claude/settings.json)

- `permissions.allow` expandido de 4 para 39 padroes (git read/write, node, npm, grep, find, ls, etc.)
- `permissions.deny` inalterado (rm -rf, push --force, reset --hard, clean -f/df bloqueados)
- `settings.local.json` limpo (91 entradas redundantes → 0)
- Hooks inalterados

---

## 2026-03-14 — Act 3 skeletons preenchidos (4/4)

Branch: `main`

### Slides preenchidos

| Slide | Arquivo | Archetype | Conteúdo |
|-------|---------|-----------|----------|
| s-a3-01 | 37-a3-bridge.html | hero-stat | Bridge: HR 0,35 mortalidade + HR 0,46 decomp (Tonon 2023, PMID 37190823) |
| s-a3-03 | 38-a3-expandido.html | comparison | Estrito 7,0% vs Expandido 37,6% (Tonon 2025, PMID 40228583) |
| s-a3-04 | 39-a3-etiologia.html | etiology-compare | HBV >50% · HCV 36,6% · Álcool ~18% (PMIDs 40378989, 36038017, 37469291) |
| s-a3-07 | 40-a3-fechamento.html | flow | Síntese: Melhora → Persiste → Vigiar sempre |

### Padrão

- Zero CSS novo — reutilizou archetypes existentes (hero-stat, comparison, etiology-compare, flow)
- Speaker notes preservadas (já completas dos skeletons)
- Fonte de dados: RAW_ACT3_V1.md
- Build: 44 slides ✅ · Lints: slides + case-sync + narrative-sync ✅

---

## 2026-03-14 — Diagnóstico de aderência + rubrica AUDIT-VISUAL expandida

Branch: `feat/cirrose-mvp` · Commits: `18d00bc`, `6ed8139`

### Diagnóstico

Diagnóstico completo de aderência WT vs GitHub:
- 0 drift de código/dados
- 3 drifts cosméticos encontrados e corrigidos (CLAUDE.md hash/data, HANDOFF.md decomposição aritmética + data stale)
- Source of truth validado: CASE.md → evidence-db → narrative.md → _manifest.js → HTML (44/44 consistente)
- QA gap identificado: Loop 1 técnico feito (Playwright), QA visual detalhado nunca aplicado

### AUDIT-VISUAL.md — rubrica expandida

Rubrica expandida de 8 para 13 dimensões (merge critérios qa-engineer):
- 8 originais (H/T/E/C/V/K/S/M) migrados de escala 1-5 para 1-10
- 6 novas: **I** (Interações), **D** (Dados clínicos), **A** (Acessibilidade), **L** (Carga cognitiva Sweller), **P** (Aprendiz adulto Knowles+Miller), **N** (Arco narrativo Duarte+Alley)
- PASS = todas 13 dimensões >= 9/10
- Protocolo Loop 1 (Opus) + Loop 2 (Gemini MCP) documentado
- Scorecard template incluído

### Próximo passo

QA visual Loop 1 nos 11 slides do Act 1 (title + hook + 8 A1 + CP1) usando rubrica 13 dimensões. Não sair do Act 1 até PASS.

---

## 2026-03-15 — Stack drift cleanup (main)

Branch: `main`

### Mudanças

- Docs corrigidos: stack referenciado como `deck.js` (projetos ativos), `Reveal.js legacy` (grade/osteo)
- `preview.html` removido (cirrose) — obsoleto, substituído por `npm run dev`
- `export-screenshots.js` removido — DeckTape/Reveal-specific, não funciona com deck.js
- Script npm `export:screenshots` removido do package.json
- package.json description atualizada
- Grade/Osteoporose marcados 🧊 FROZEN nos CLAUDE.md e HANDOFF.md
- `reveal-patterns.md` + `.mdc` renomeados para "Navigation + GSAP Patterns" (dual-stack)

### Commits

- `99631c3` — docs: correct stack refs
- `76004c7` — chore: remove dead code

### Impacto

- Zero impacto funcional em cirrose (apenas docs)
- Build: 44 slides ✅

---

## 2026-03-13 — Done-gate + manifest headline sync (39) + ERRO-023 closure

Branch: `feat/cirrose-mvp` · Commits: `14a7446`, `414a988`

### Changes

| Item | Detalhe |
|------|---------|
| pre-push hook | `done:cirrose:strict` — bloqueia push se build, lint ou manifest sync falhar |
| _manifest.js | 39 headlines sincronizadas com HTML (`<h2>` → manifest) |
| ERRO-023 closure | CSS failsafe verificado para todos 6 elementos `[data-animate]` |
| cleanup | `stage-b.css` e `stage-c.css` removidos (deprecated). `.no-js` failsafes consolidados |

### QA

- Build: 44 slides ✅
- `npm run done:cirrose:strict` PASS
- ERRO-023 → ✅ Corrigido

---

## DR-001 — Ratificação: classify na posição 4 do Act 1

**Data:** 2026-03-11
**Tipo:** Decision Record

**Fato:** commit `d20deec` (audit visual Act 1) incluiu reorder bundled — `s-a1-classify` movido para posição 4 (após s-a1-01, antes de s-a1-vote). A mudança foi executada sem DR explícito.

**Ratificação:** Lucas aprova a ordem atual (2026-03-11). Classify na posição 4 é intencional.

**Racional:** PREDESCI (HR 0,51) como hero do classify precisa vir antes do vote — a audiência precisa saber *por que* classificar importa antes de ser desafiada a fazê-lo. D'Amico (pos 5) e Baveno (pos 6) são ferramental que suporta a premissa já estabelecida.

**Trade-off:** Classify antes de D'Amico inverte a ordem cronológica (D'Amico 2006 → Baveno 2022 → PREDESCI 2019). Aceito: narrativa > cronologia. A aula não é revisão histórica.

---

## 2026-03-11 — Audit visual Act 1: headlines, density, a11y, data safety

Branch: `feat/cirrose-mvp` · Commit: `d20deec`

### Fixes (5 slides)

| Slide | Fix |
|-------|-----|
| s-a1-baveno | Headline: "Baveno VII redefiniu classificação" → "Doença hepática avançada é espectro, não diagnóstico binário" |
| s-a1-classify | Headline: "Classificar muda conduta" → "Classificar antes da 1ª descompensação reduz eventos" |
| s-a1-damico | Fórmula MELD removida (4 termos → 1 tag inline). c-stat 0,87 mantido. Extraneous load reduzida |
| s-a1-rule5 | Ícones zonas: ✓ ⚠ ⚠ ✕ ✕ → ✓ ? ▲ ⚠ ⛔ (5 distintos, daltonismo-safe) |
| s-a1-meld | Threshold "MELD ≥18" (sem PMID) → "MELD elevado → acelerar encaminhamento". [LUCAS DECIDE] purgado |

### Bundled (sessões anteriores neste WT)

| Arquivo | Natureza |
|---------|----------|
| cirrose.css | Hook v8 tokens, classify/rule5/baveno styles, stage-c overrides |
| slide-registry.js | Hook v8 refactor, click-reveal simplificação |
| 01-hook.html | v8 flat layout (bio + labs grid + 1 click) |
| 02-a1-continuum.html | Hero 83% Prince 2024 + screening pathway |
| _manifest.js | Headlines sync, archetype updates |
| evidence-db.md | Prince 2024 + LiverPRO PMIDs adicionados |
| narrative.md | Tension levels + headlines sync |

### QA

- Build: 44 slides ✅
- 4 lints PASS (slides + case-sync + narrative-sync)
- Gate visual: APROVADO COM RESSALVAS
- Audit humano: pendente

---

## 2026-03-10 — CSS/Viewport Hard Gate Act 1 (rodada 4)

Branch: `main`

### Fixes (3)

| Arquivo | Fix |
|---------|-----|
| 04-a1-meld.html | Emoji 🟢🟡🟠🔴 → `.meld-band-dot` CSS circles (ERRO-030) |
| 00-title.html | `data-background-color` var() → HEX `#162032` (ERRO-031) |
| cirrose.css | `.meld-band-dot` styling (14px circles por band) + `.pathway-track` orphaned padding-top removido |

### QA

- Build: 44 slides ✅
- 3 lints PASS (slides + case-sync + narrative-sync)
- 27 screenshots Playwright Chromium 1280x720
- 0 console errors
- ERRO-030 e ERRO-031 fechados

### Docs atualizados

- ERROR-LOG.md: ERRO-030/031 → ✅ Corrigido
- AUDIT-VISUAL.md: rodada 4, R1/R7 fechados
- HANDOFF.md: ERRO-030/031 removidos de P2

---

## 2026-03-10 — Hardening pré-Gemini Act 1 + re-QA consolidado

Branch: `main` · Commits: `80c4a7c` (hardening) + doc-only (consolidação)

### Fixes (commit 80c4a7c)

| Arquivo | Fix |
|---------|-----|
| _manifest.js | 2 headlines sync (s-a1-damico, s-a1-rule5) — drift pós-commit ca76b56 |
| narrative.md | 2 headlines sync (idem) |
| 02-a1-continuum.html | 3 countUp fallbacks: hero 0→1,43 · comp 0→112 · decomp 0→10,6 |
| 02b-a1-damico.html | 5 countUp fallbacks: c-stat 0→0,87 · pathway 0→1/5/20/57 |
| 02c-a1-classify.html | 1 countUp fallback: PREDESCI HR 0→0,51 |
| 02d-a1-vote.html | 1 countUp fallback: FIB-4 0→5,91 |
| 03b-a1-fib4calc.html | 1 countUp fallback: FIB-4 0→5,91 |

### Re-QA consolidado (RODADA 3)

- 27 screenshots via `act1-reaudit.mjs` (Playwright Chromium 1280x720)
- 0 P0, 0 console errors, 11/11 slides navegados
- Build + 3 lints PASS
- Veredito: **PASS COM RISCOS** — 0 P0, 8 P1 remanescentes, 2 novos erros registrados

### Novos erros encontrados

| Erro | Slide | Descrição |
|------|-------|-----------|
| ERRO-030 | s-a1-meld | Emoji unicode (🟢🟡🟠🔴) projetado — viola ERRO-002 + daltonismo |
| ERRO-031 | s-title | data-background-color usa var() em vez de HEX literal |

### Docs

- ERROR-LOG.md: +2 erros (ERRO-030, ERRO-031)
- AUDIT-VISUAL.md: rodada 3 consolidada com resultado per-slide honesto
- HANDOFF.md: estado atualizado
- CHANGELOG.md: este registro

---

## 2026-03-09 — Act 2 P0 fix + Act 1 QA + AUDIT-VISUAL rewrite

Branch: `main`

### P0 Fixes (Act 2 — 7 novos slides)

| Slide | Fix |
|-------|-----|
| 30-a2-gatilhos.html | PREDICT PMID 32275982→32673741 (source-tag + notes) |
| 34-a2-nutricao.html | Removido `[TBD SOURCE]` da source-tag projetada |

### Act 1 QA (11 slides — DONE)

| Slide | Fix |
|-------|-----|
| 01-hook.html | FIB-4 card removido (decisao Lucas — so aparece no slide calculadora) |
| 07-cp1.html | FIB-4 corrigido 5,10→5,91 (calculo: (55x67)/(112xsqrt(31))) |
| _manifest.js | FIB-4 removido de visibleFields em s-hook e s-a1-baveno |

### Docs

- AUDIT-VISUAL.md reescrito: organizado por Atos, Act 1 QA DONE, Act 2/3/APP pendentes
- CHANGELOG.md, ERROR-LOG.md atualizados

---

## 2026-03-09 — Manifest rewrite: Act 2 (16 slides) + Act 3 (7 slides) + 11 skeletons

Branch: `main` · Commits: `c302ef1`, `2d00776`, `c17732a`

### Manifest rewrite

- 33→44 slides. Act 2: 15 slides + CP2. Act 3: 7 slides + CP3 + close. Appendix: 8.
- 11 skeletons criados (7 Act 2 + 4 Act 3) com archetype-flow, headlines, speaker notes rascunho
- 7 Act 2 skeletons preenchidos com conteudo real: gatilhos, ascite-dx, ascite-manejo, hda, nutricao, tx, refrataria
- narrative.md Act 3 expandido de 3 para 7 slides

---

## 2026-03-09 — PMID audit + RAW_ACT3_V1 + fixes

Branch: `main` · Uncommitted

### PMID Audit (5 CANDIDATEs — TODOS errados)

| # | CANDIDATE | Correto | Era na verdade |
|---|-----------|---------|----------------|
| 1 | 32275982 | **32673741** | ELF test NAFLD (Vali) |
| 10 | 38530940 | **37939273** | Herbicida pyrazole |
| 11 | 38504576 | **38108646** | Belatacept heart TX |
| 13 | 31342533 | **31342529** | Off by 4 |
| 20 | 34174336 | **34157322** | Fluoxetine neurogenesis |

Turco: journal corrigido Liver Int → CGH.

### RAW_ACT3_V1.md produzido

- 7 slides detalhados (A3-01 a A3-07) com headlines, anchor numbers, speaker notes rascunho
- 7/9 PMIDs ancora verificados. 2 unverified: 41580090 (alcool), 39220088 (TIPS)
- Tabela "melhora / persiste / vigilancia" incluida

### Fixes triviais

- CASE.md: branch restructure/act1 → main
- 03c-a1-elasto.html deletado (orphan)
- narrative.md: 4→5 interacoes (BB/NSBB toggle restaurado como A2-07)
- HANDOFF.md: 5 interacoes, estado atualizado
- s-a1-infeccao notes: [TBD] → [TBD SOURCE — escalar para Lucas]

---

## 2026-03-08 — MD audit + ACT3-CONTRACT-V1

Branch: `main` · Commits: `c1f220d`, `800ec87`

### MD Audit (14 fixes, 11 arquivos, -64 linhas)

| Tipo | Fix |
|------|-----|
| **P0 cross-check** | evidence-db.md slide IDs atualizados (s-a1-02→fib4, s-a1-03→meld, s-a1-04→a2-infec, s-a1-05→app-etio) |
| **P0 PMIDs stale** | NOTES.md: Lens 28039099→32535060, CANONIC 23562128→23474284 marcados resolvidos |
| **P0 must-read** | Tonon PMID 40228583 atualizado, comment VERIFICAR ANSWER removido |
| **P0 noise** | NOTES.md: 27 linhas agent logs removidas. ERROR-LOG: 50 linhas raw code removidas |
| **P1 links** | SETUP.md AGENTS.md→CLAUDE.md, MCP-ENV-VARS .env.example removido, archive/README ref fantasma |
| **P1 XREF** | tasks/todo.md phantom removido, SETUP.md corrigido |
| **P1 modelos** | KPIs.md Gemini 2.5→3.1 Flash-Lite, ECOSYSTEM.md Gemini 3 Pro marcado encerrado |
| **P1 HANDOFF** | Colisão IDs Act 2 documentada, orphan 03c-a1-elasto registrado |

### ACT3-CONTRACT-V1.md

- Contrato narrativo do Act 3 (Lucas + ChatGPT 5.4)
- 7 slides: bridge ascite → definição → estrito vs expandido → etiologia → risco residual → vigilância → fechamento
- 9 PMIDs âncora (37190823, 36646527, 40228583, 41580090, 40378989, 36038017, 32535060, 37199193, 39220088)
- Baveno VII estrito = canônico. Expandido = nuance rotulada.
- Proibições: TIPS ≠ recompensação, alta de vigilância HCC, headline genérica
- Prompt para Opus incluso

### Auditoria executada por 3 subagentes paralelos

1. **Docs audit** — links, redundância, verbosidade em docs/*.md
2. **Cross-check cirrose** — CASE↔evidence-db↔narrative↔manifest↔HANDOFF
3. **Notion sync** — bloqueado (MCP indisponível em Claude Code, payload repo-side pronto)

---

## 2026-03-08 — Act 2 P0 documental + narrative rewrite + reference fixes

Branch: `main`

| Item | Detalhe |
|------|---------|
| narrative.md reescrito | 16 slides + CP2, cascata clínica do mesmo paciente, 4 interações, MELD intermediários documentados como construções narrativas |
| NSBB primary vs secondary | A2-07 corrigido: PREDESCI = prevenção PRIMÁRIA (Act 1 callback), pós-HDA = profilaxia SECUNDÁRIA. Erro conceitual grave prevenido. |
| HRS-AKI lidera headline | A2-11: ACLF é contexto, não headline. HRS-AKI + CONFIRM NNT 7 NNH 12 = decisão acionável |
| CP2 = hipotético | "E se tudo der certo?" — fecha caso real, não implica continuação direta |
| CASE.md Chekhov's Guns | Carvedilol abandonado adicionado. ATTIRE distribuído (PBE+LVP vs ACLF). |
| HANDOFF.md reescrito | Decisões travadas, caminho crítico P1=HTMLs |
| medical-data.md PMIDs | ANSWER 29793859→29861076, CONFIRM 34882432→33657294 |
| evidence-db.md fixes | Tonon 2025 PMID 40228583 (era NOT INDEXED). Ioannou 31374215 clarificado (pós-HCC, não incidência). |
| Act 3 planejado | 5 slides cenário hipotético. Recompensação strict vs expanded. Research completo, RAW pendente. |

---

## 2026-03-08 — Source-of-truth enforcement + PLQ + fixes técnicos

Branch: `claude/diagnose-branch-commits-7twpK`

| Item | Detalhe |
|------|---------|
| PLQ padronizado 112k | CASE.md, narrative.md, _manifest.js, 07-cp1.html, index.html |
| Notas stale removidas | `[LUCAS DECIDE]` PLQ (CASE.md), "PLQ inconsistência" (HANDOFF.md) |
| panelState inheritance documentada | Comentários em _manifest.js explicando null = herança via findLatestState |
| ERRO-024 registrado | Regra: quem corrige bug DEVE limpar notas de warning associadas |
| lint:case-sync criado | Script + package.json + pre-commit hook |
| OKLCH literals corrigidos | `.vote-option--correct`, `@keyframes zone-highlight` → `oklch(from var(...))` |
| Rename screening→classify | `02c-a1-screening.html` → `02c-a1-classify.html` + `_manifest.js` + `evidence-db.md` |
| .no-js failsafes | `.classify-card`, `.antonio-pin` — `opacity:1 !important; transform:none` |
| ERRO-021 marcado corrigido | Nota stale — espaço no seletor já existia em cirrose.css:2220 |

---

## 2026-03-07 — Doc graph cleanup + operational records

Branch: `claude/diagnose-branch-commits-7twpK`

| Item | Detalhe |
|------|---------|
| CLAUDE.md reescrito | 397→111 linhas (Anthropic best practices, @imports) |
| AGENTS.md arquivado | `docs/archive/` (absorvido por CLAUDE.md) |
| 5 links mortos corrigidos | HANDOFF.md, SUBAGENTS-PROPOSAL.md |
| 4 orphans registrados/arquivados | — |
| Gemini Flash atualizado | → 3.1 Flash-Lite no ECOSYSTEM.md |
| XREF.md reconstruído | Todas refs verificadas |
| Operational Records | Tabela explícita em CLAUDE.md (HANDOFF/CHANGELOG/ERROR-LOG/NOTES) |
| Hierarquia de autoridade | Explícita em todos os docs |

---

## 2026-03-06 — Skills unificação + MCPs QA stack

### Skills — unificação de redundâncias (`d2b6d16`)

| Skill | Antes | Depois |
|-------|-------|--------|
| `medical-slide` | 84 linhas, duplicava assertion-evidence + tokens + checklist | 44 linhas: só workflow Notion MCP, delega para `slide-frontend-ux` |
| `visual-qa` | 7 checks básicos antigos | Redirect para `qa-engineer` agent (13 critérios) |
| `assertion-evidence` | Mantido | Validator focado (não cria, só valida) |
| `medical-data` | Mantido | Verifier de dados clínicos autônomo |

### MCPs instalados — stack QA completo (`0d75469`, `d3abf4d`, `42d6e9c`)

**Funcionando (GRÁTIS, zero config):**

| MCP | O que faz | Critérios QA |
|-----|-----------|-------------|
| `ui-ux-pro-mcp` | 170 UX guidelines, typography, colors, patterns | 2, 4, 6 |
| `clinicaltrials` | ClinicalTrials.gov v2 — NCT ID, outcomes, patient match | 9 (resolve [TBD]s) |
| `design-comparison` | Pixel diff before/after CSS — valida se fix funcionou | 4, 6 |
| `page-design-guide` | Typography, layout F/Z/Bento, animation principles | 2, 6 |
| ~~`attention-insight`~~ | **NÃO usar a princípio** — clarity/focus (sharp ou API paga) | — |
| ~~`frontend-review-mcp` (Hyperbolic)~~ | **NÃO usar a princípio** — before/after visual diff | — |

**Requer signup (free credits):**

| MCP | Custo | Como ativar |
|-----|-------|-------------|
| `floto` | 1.000 créditos grátis | [test-app.floto.ai](https://test-app.floto.ai) → `.env`: `FLOTO_API_KEY=` |

**Mapeamento ferramentas → critérios qa-engineer:**

| Critério | Ferramentas |
|---------|-------------|
| 1. Assertion-Evidence | `npm run lint:slides`, `playwright` DOM |
| 2. Tipografia | `ui-ux-pro`, `page-design-guide` |
| 3. Contraste WCAG | `a11y-mcp`, `playwright` axe-core, `lighthouse` |
| 4. Fill ratio | `playwright` screenshot 1280×720 |
| 5. Densidade | `playwright` word count DOM |
| 6. Impacto visual | `design-comparison`, `floto` |
| 7. Interações | `playwright` Space/Arrow + hook check |
| 8. CSS tokens | `grep` HEX/px literals |
| 9. Dados clínicos | `scite`, `biomcp`, `clinicaltrials` |
| 10. a11y Lighthouse | `lighthouse`, `a11y-mcp` |
| 11-13. Pedagogia | `perplexity_reason` (CLT+Mayer+Knowles+Duarte) |

---

## 2026-03-05 — Restructure Act 1: dados canônicos + 9 slides reestruturados (branch restructure/act1)

Branch: `restructure/act1` · Commits: `8058052`→`3b71873` · Build: 33 slides ✅

### Dados canônicos Antônio (commit `8058052`)
- Labs definidos uma vez: ALT 31 U/L · AST 67 · PLQ 112k · GGT 210 · Alb 3,6 · Bili 1,3 · INR 1,2 · FIB-4 5,91
- FIB-4 calculado: `(55 × 67) / (112 × √31) = 5,91` — documentado em narrative.md + evidence-db.md
- Armadilha clínica registrada: ALT normal em hepatócito burnt-out; AST/ALT = 2,16 padrão alcoólico avançado

### s-hook (`2c116b1`)
- 8-card lab grid (7 labs + FIB-4 como último card)
- FIB-4 card: borda warning, label "calculado"
- ALT card: borda success, label "normal ✓" — armadilha pedagógica
- `.hook-punchline` "Sem queixas." fadeUp após stagger, font-display, centralizado
- HEX literals substituídos por custom properties scoped `#s-hook { --hook-* }`

### s-a1-01 Burden (`0102bf0`)
- Headline: "1,43 milhão morre por ano" (GBD 2021, PMID 39927433)
- Iceberg invertido: barra comp cinza primeiro → barra decomp cresce via scaleX(0→1)
- `.burden-badge` "+18% MASH": background + border-left warning (não texto solto)

### s-a1-vote — NOVO (`563af33`)
- Slide de votação interativa: "Esse paciente tem cirrose?"
- 3 opções clicáveis (A/B/C); click em qualquer opção → reveal FIB-4 5,91 countUp
- Cards A e C escurecem; card B recebe borda success + checkmark
- Adicionado ao `_manifest.js` após s-a1-01

### s-a1-damico (`07db52a`)
- Cortado de 6 eras para 3: CTP → MELD-Na → D'Amico pathway
- PREDESCI removido daqui → migrado para s-a1-classify
- MELD 3.0 removido → mover para apêndice se necessário
- Era 0: pills A/B/C stagger. Era 1: fórmula termo a termo + c-stat countUp. Era 2: pathway scaleX

### s-a1-baveno + s-a1-elasto fundidos (`6804609`)
- `s-a1-elasto.html` deletado, removido do manifest
- Conteúdo fundido em `s-a1-baveno.html`: dissolve "Cirrose"→espectro + pathway 3-step
- Pathway: [FIB-4] → [Elastografia] (AUROC 0,90 badge) → [Rule of 5], stagger vertical

### s-a1-fib4 (`581106e`)
- H2 novo: "4 dados. 1 número. 1 decisão."
- Hero number 5,91 countUp, cor danger, font-size var(--text-display)
- 4 input cards: Idade 55 / AST 67 / PLQ 112k / ALT 31✓ (armadilha de novo)
- Archetype trocado para hero-stat; calculadora panel width 280px

### s-a1-rule5 (`2c4893b`)
- Gray zone 10-25 kPa: label explícito + borda tracejada warning
- Pin Antônio: translateY(-40px→0) + bounce
- Nuances CSPH: 2 linhas ("inflamação aguda, ICC, obesidade" / "Jejum 2h, IQR/mediana")
- Zonas entram com scaleY(0→1), transform-origin: bottom

### s-a1-meld (`d243fb2`)
- H2: "MELD-Na: o GPS da fila"
- Emojis 🟢🟡🟠🔴 nas bandas (funcionais, não decorativos)
- `.meld-threshold` "MELD ≥18" anima width 0→100% após bandas

### s-a1-classify (`55b10c7`)
- Estado 0 removido (redundante com hook)
- H2: "Classificar muda conduta"
- 3 assertion cards com dado de desfecho (compensado / 1ª descomp / 2ª descomp)
- PREDESCI HR 0,51 countUp hero centralizado aqui

---

## 2026-03-05 — Calc redesign: split layout, hero score, shared CSS

- **Layout split**: calculadoras FIB-4 e MELD-Na redesenhadas — 2 colunas (inputs 2x2 grid | hero score panel)
- **CSS consolidado**: `.meld-*` (archetypes.css ~130 linhas) + `.fib4s-*` (cirrose.css ~105 linhas) + `.meld-context/.meld-badge` (~25 linhas) → `.calc-*` shared (~100 linhas em archetypes.css). Net: -160 linhas
- **Score hero**: `--text-hero` (56-86px), font-display. Panel muda cor/bg por zona via `data-zone` attr
- **4 zonas MELD**: safe (<15) / warning (15-19) / danger (20-24) / urgent (>=25, bg-deep dark)
- **3 zonas FIB-4**: safe (<1,30) / warning (1,30-2,67) / danger (>2,67)
- **Zone chips**: referencia visual permanente no bottom (safe/warning/danger labels)
- **HTML**: removido `.meld-context` badges div de 04-a1-meld.html (info agora nos input labels)
- **Failsafe**: `.no-js` e `.stage-bad` forçam resultado neutro
- **Testado**: FIB-4 Antonio=4,89 danger | MELD Antonio=14 safe | MELD Cr 3.1→23 danger

---

## 2026-03-05 — Restructure Act 1: split mega-slide, relocate infeccao/etiologias

- **Mega-slide `s-a1-02` eliminado**: conteudo distribuido em `s-a1-baveno` (SplitText dissolve) e `s-a1-rule5` (Rule-of-5 + Antonio)
- **Novos slides**: `s-a1-fib4` (calculadora FIB-4 full-slide, classe Fib4CalcSlide seguindo MeldCalc), `s-a1-elasto` (pathway vertical FIB-4→Elasto→Rule-of-5)
- **Relocacoes**: infeccao → `s-a2-infec` (Act 2, antes de PBE); etiologias → `s-app-etio` (Appendix, data-visibility="hidden")
- **Renames**: `s-a1-03` → `s-a1-meld`; `s-a1-screening` → `s-a1-classify` (5→4 estados, tools preview removido)
- **Titulos v2** (aprovados pelo Lucas): "Baveno VII e o novo paradigma de classificacao", "FIB-4 e outras ferramentas", "Hoje biopsia e a excecao", "Rule-of-5: cada 5 kPa muda a conduta", "Classificar cedo muda desfecho — HR 0,51"
- **CSS**: +~140 linhas (.fib4s-*, .elasto-*, .paradigm-expert, failsafes); ID selectors renomeados (#s-a1-screening → #s-a1-classify)
- **JS**: slide-registry.js — s-a1-02 anim removida, adicionadas s-a1-baveno + s-a1-rule5 + s-a1-classify; FIB4_SLIDE → 's-a1-fib4'; wireAll aceita Fib4CalcSlide
- **Panel states**: novos entries para baveno, fib4, elasto, rule5, meld, classify com visibleFields progressivos
- **CP2 speaker notes**: callback MELD adicionado ("Lembram do semaforo? MELD 10 → 28")
- **Build**: 30 → 33 slides. Lint clean. Vite clean.

---

## 2026-03-05 — s-a1-02 + s-a1-03: redesign visual FIB-4 e MELD

- **s-a1-02 (Rule-of-5)**: hero-sized kPa thresholds (font-display, text-h3), ícones semânticos de acessibilidade (✓/⚠/✕) por zona, diretivas clínicas por zona ("Manter na APS", "NSBB · Rastreio HCC", etc.), min-height aumentada para 110px
- **s-a1-03 (MELD-Na)**: badges contextuais das 4 variáveis acima da calculadora, Sódio destacado (meld-badge--key), semáforo bar com ícones ✓/⚠/✕/⬛ nas zonas, classes CSS semânticas (meld-fill-safe/warning/danger/urgent) substituem inline style no bar-fill
- **Case panel progressivo**: campos FIB-4/LSM aparecem só a partir de s-a1-02, MELD a partir de s-a1-03 (antes: todos visíveis desde s-hook como spoiler cognitivo). Implementado via `visibleFields` em panelStates + filtro em `case-panel.js renderFields()`
- **PMIDs**: Sterling 2024 AASLD NILDA → PMID 38489521 (Duarte-Rojo & Sterling, Hepatology 2025); Mahmud ACG 2025 permanece [TBD]
- **Speaker notes**: staging cues melhorados em ambos os slides

## 2026-03-05 — s-a1-01: bug fix animação + dados GBD atualizados

- **Bug transição**: `burden-hero--compact` agora aplicado ANTES do `gsap.to` (antes: `onComplete` causava jump de layout column→row após a animação); removido `scale: 0.6`, y reduzido para -60
- **GBD 2021**: mortes 1,32M → **1,43M** (Tham et al. PMID 39927433, Liver Int 2025); incidência +17% → **+18%** (2010–2021); hero-label "8ª causa" → "Top 10 causas"; trend-label atualizado com "MASH lidera"
- **Fonte padrão referências**: `"Author Journal Year · Dataset · n países · PMID XXXXXXX"` — PMID ao final, sem parênteses no meio. Aplicar como padrão em todos os slides.

## 2026-03-05 — s-hook: contraste fix + FIB-4 visibility

- **Contraste**: `var(--text-on-dark/muted)` → OKLCH explícito no `#s-hook` (tokens stage-c remapeiam para escuro — variáveis não podem ser usadas em slides que forçam navy no stage-c)
- **FIB-4 visibilidade**: `#panel-fib4` oculto por padrão (`display:none`); `syncFib4Visibility()` em `slide-registry.js` mostra apenas em `s-a1-02` via `fib4-visible` class + `slidechanged` listener

## 2026-03-05 — s-hook: grid fix + cor + flagging clínico

- **Grid**: `repeat(5, 1fr)` → `repeat(7, 1fr)` + `max-width: 880px` — 7 labs em linha única (antes: 5+2, segunda linha desalinhada)
- **Cards**: `rgba(255,255,255,0.04→0.07)` bg + `0.08→0.15` border — mais visíveis no navy
- **Cores**: hex frios substituídos por OKLCH tokens (`var(--text-on-dark)`, `var(--text-on-dark-muted)`, `oklch(62% 0.022 258)`) — hierarquia clara: valores brancos, labels médio, refs dim
- **Flagging**: PLQ 112k + HbA1c 7.0 com `hook-lab--flag` — achados clínicos centrais em âmbar

---

## 2026-03-03 — Etapa 2: fix PMIDs + Case Antônio 60g/dia

- **evidence-db.md**: BAVENO VII `35431106` → `35120736` (artigo original; 35431106 era errata) — 4 ocorrências
- **CONFIRM / D'Amico**: já corretos no arquivo — nenhuma mudança
- **Case Antônio**: `40g/dia` → `60g/dia` em todos os arquivos: `slides/01-hook.html`, `index.html` (rebuild), `index.stage-c.html`, `index.stage-b.html`, `references/narrative.md`
- Commit: `798f99c`

---

## 2026-03-03 — Etapa 1: scan de evidência + NOTES.md criado

- Scan completo de 28 slides + evidence-db.md via PubMed MCP + CrossRef MCP
- 14 PMIDs validados OK; 2 erros críticos em evidence-db.md identificados (corrigidos na Etapa 2)
- BAVENO VII PMID canônico determinado: `35120736`
- 21 referências `[TBD]` catalogadas em NOTES.md
- Case Antônio divergência 40g/dia (visual) vs 60g/dia (notes cp1) — resolvido: canon = 60g/dia
- **`aulas/cirrose/NOTES.md` criado** com relatório completo auditável
- Commit: `28ac27f` (batch 10 hooks) + scan result em NOTES.md

---

## 2026-03-03 — Batch 10: runtime hooks configurados

- `.claude/hooks/check-evidence-db.sh` — PreToolUse/Write: BLOCK slides sem evidence-db lido
- `.claude/hooks/guard-evidence-db.sh` — PreToolUse/Write: WARN ao editar evidence-db.md
- `.claude/hooks/build-monitor.sh` — PostToolUse+Failure/Bash: log build em NOTES.md
- `.claude/hooks/subagent-stop-log.sh` — SubagentStop: log resumo subagent em NOTES.md
- `.claude/settings.json` atualizado com seção `hooks`
- Commit: `28ac27f`

---

## 2026-02-28 — Diagnóstico P0/P1: configs, deprecar, docs

- **vite.config:** Removido globSync; open → cirrose
- **index.stage-c.html:** Deprecated (comentário); index.html = fonte
- **s-app-04:** source-tag com [PMID pendente] explícito
- **CLAUDE/CURSOR/SYNC-NOTION:** index.html, PORT 3000, estrutura atualizada
- **REPO-DIAGNOSTIC, DIAGNOSTIC-27fev:** → docs/archive/

---

## 2026-02-28 — Preview: fix beat 0/beat 1 (DOM local)

### Solução final
- **Subitens beat 0 e beat 1 mostram estados distintos** — customAnim perde ready no preview; fix: aplicar beat estático via DOM local após init (classes + labs visibility), sem depender do dispatcher.
- **ERRO-017** corrigido.

### Arquivos alterados
- `preview.html` — bloco pós-connect: setBeat + labs visibility para s-hook quando `?beat=` presente

---

## 2026-02-28 — Consolidação docs + s-hook v5

### Documentação
- **ERROR-LOG:** Reescrito de forma compreensiva — ERRO-001 a ERRO-016 com severidade, root cause, regra derivada e status (corrigido/pendente). Tabela resumo por severidade. Seção final "Raw code" com trechos de slide-registry.js, cirrose.css, index.template.html, 01-hook.html.
- **HANDOFF projeto:** `HANDOFF.md` — só pendências.
- **HANDOFF Claude.ai:** `HANDOFF-CLAUDE-AI.md` — paths + pendências (colar no Project Knowledge).

### s-hook v5 — mudanças de conteúdo e UX
- **"Seu" removido:** "Seu Antônio" → "Antônio" (formal, congresso).
- **"Caminhoneiro":** Simplificado (sem "de longa distância").
- **Sem título/header:** Removido hook-header com título e progress 1✓·2✓·3; conteúdo centralizado.
- **2 beats:** Beat 0 = Antônio + história (centro). Beat 1 = Labs + "Sem queixas." + "Qual a próxima conduta?" abaixo dos números.
- **Pergunta:** "Qual é o próximo passo?" → "Qual a próxima conduta?".

### s-hook v5 — animações e interação
- **Reversível:** retreatBeat() implementado; ArrowLeft/ArrowUp voltam ao beat anterior (engine.js intercept).
- **ArrowDown removido** da interceptação do hook (evita "texto desce").
- **Sombra pré-stagger corrigida:** Beat 1 content (labs, lead, question) com `opacity: 0; visibility: hidden` em CSS até GSAP animar; resetBeat1Content() no retreat para consistência ao voltar.
- **Transição Antônio:** Lógica simples no retreat (sem killTweensOf/gsap.set agressivos); overwrite: 'auto' no fromTo.
- **Interação sumindo (ERRO-016):** wireAll() passou a rodar ANTES de anim.connect() em index.template.html — customAnimations precisam estar registrados antes do dispatcher conectar; caso contrário __hookAdvance nunca era definido e clique/setas não funcionavam.

### Arquivos alterados
- `slides/01-hook.html` — 2 beats, sem header, texto atualizado
- `slide-registry.js` — advanceBeat, retreatBeat, resetBeat1Content, runLabsStagger (stagger imediato, visibility no fromTo)
- `cirrose.css` — s-hook v5: beat 1 opacity/visibility, sem hook-header
- `index.template.html` — wireAll antes anim.connect
- `slides/_manifest.js` — clickReveals: 1, headline "Caso Antônio · Qual a próxima conduta?"
- `scripts/qa-screenshots-stage-c.js` — TOTAL_BEATS = 2, delay 1,5s

---

## 2026-02-28 — Re-análise PNG + HANDOFF Claude.ai

- **DIAGNOSTIC-HOOK-28fev.md:** Re-análise pós-fix — texto descentralizado, melhorias confirmadas, problemas persistentes
- **HANDOFF-CLAUDE-AI.md:** Handoff para Claude.ai — fase, raw changes, ERROR-LOG, próximos passos
- **ERROR-LOG:** ERRO-013 (texto descentralizado)
- **AUDIT-VISUAL.md:** `aulas/cirrose/AUDIT-VISUAL.md` (28 slides, s-hook = Slide 4)

---

## 2026-02-28 — Diagnóstico s-hook + fix contraste

- **DIAGNOSTIC-HOOK-28fev.md:** Análise UI/UX/tipografia/slideologia baseada em PNGs
- **Fix contraste:** #s-hook override para stage-c — cores literais (#f0f2f5, #b8c4d4, #9ca8b8) para vencer var(--text-on-dark) remapeado
- **Lab refs:** font-size 0.85rem, cor #a0acc0
- **ERROR-LOG:** ERRO-009 (contraste beat 1), ERRO-010 (anim sem retorno), ERRO-011 (texto desce), ERRO-012 (QA timing)
- **Plano de mudanças:** 4 fases (contraste → retorno → ArrowDown → polish)

---

## 2026-02-28 — s-hook v3 (Monolítico)

- 5 beats → 2 beats (caso+labs → pergunta)
- Removido: cold open, framework, emoji
- Navy bg forçado: `#s-hook { background: #162032 !important }` + `data-background-color="#162032"`
- Labs em linha única: `grid-template-columns: repeat(5, 1fr)`, `hook-lab--flag` para FIB-4/PLQ
- slide-registry: advanceBeat com 1 click, revealAll removido
- qa-screenshots: TOTAL_BEATS = 2
- ERROR-LOG.md criado: path `aulas/cirrose/ERROR-LOG.md`, workflow por sessão

---

## 2026-02-27 — Transições: pointer + ArrowRight/ArrowDown

- Hook e ClickReveal: clique no slide OU teclas ArrowRight, ArrowDown, Space, PageDown
- engine.js: tryHookAdvance + listener de click em .slides
- slide-registry.js: tryRevealNext + ArrowDown + listener de click

---

## 2026-02-27 — QA screenshots: transições capturadas corretamente

- Script usa `__hookAdvance()` em vez de ArrowRight (que avançava slide)
- 5 PNGs do hook refletem as 5 transições reais
- HANDOFF-QA-ANIMATIONS.md e README atualizados

---

## 2026-02-27 — QA screenshots: 3 pastas (stage-a, stage-b, stage-c)

- Só 3 pastas: `stage-a`, `stage-b`, `stage-c` em `aulas/cirrose/qa-screenshots/`
- Deletado: `animations/`, `hook-beats/`, `stage-c-floating/`
- Batch atual stage-c: 5 PNGs do hook (`02-s-hook-beat-00.png` … `02-s-hook-beat-04.png`)
- Script unificado: `qa-screenshots-stage-c.js` (só hook neste batch)
- build-zip-limpo-ia.ps1: `stage-c` em `aulas/cirrose/qa-screenshots/`

---

## 2026-02-27 — s-hook Redesign (Cold Open Cinematográfico)

- 5 beats: cold open → Seu Antônio → labs → pergunta → framework
- Beats substituem (não acumulam), 4 cliques
- Beat system em slide-registry, keydown interception em engine.js
- CSS hook-stage, hook-beat, hook-card, hook-labs, hook-thesis

---

## 2026-02-27 — Brasão USP v2 (PNG transparente)

- brasao-usp-white.png (white on transparent) para navy
- Stage-c/bad: filter invert(1) para versão escura
- Sem filter no default — PNG limpo, sem caixa

---

## 2026-02-27 — Fix brasão s-title (canto sup. direito)

- Brasão absoluto top-right, monocromático branco (navy) / preto sutil (stage-c)
- Removido .title-logo wrapper
- Print: var(--bg-navy) em vez de HEX

---

## 2026-02-27 — Fixes AUDIT (I1–I5)

- s-a1-01: headline encurtada (continuum 1% a 57%/ano)
- s-hook: case-data .data-item gap + align-items baseline
- Headline max-width: 65ch → 85ch (archetypes.css)
- Case panel: 230px → 140px (AUDIT I1)
- _manifest.js: headline s-a1-01 atualizada

---

## 2026-02-27 — Redesign s-title (capa)

- Brasão USP, hierarquia visual, identidade autor
- data-background-color navy fixo em todos os stages
- CSS em cirrose.css (não archetypes — slide único)

---

## 2026-02-27 — Notion sync + MD refactor

- **Notion:** Posições alinhadas com `_manifest.js`. CIRR-04-01 → CIRR-A1-01. CIRR-A2-04-OLD pos 99.
- **MDs:** IDs Notion consolidados em `docs/SYNC-NOTION-REPO.md` (única referência). 9 arquivos atualizados.
- **Blueprint:** Ordem v4 (TITLE → HOOK → A1-01...)
- **HANDOFF:** Enxuto.

---

## 2026-02-27 — Limpeza MDs + fix package.json

- **Deletados:** `docs/CONFLITOS-CIRROSE-BATCHES.md`, `docs/PLANO-CIRROSE-BATCHES.md` (obsoletos)
- **cirrose-scope.md:** Marcado SUPERSEDED → ver blueprint-cirrose.md
- **package.json:** `qa:screenshots:cirrose` apontava para `qa-screenshots-cirrose.js` (inexistente) → corrigido para `qa-screenshots-stage-c.js`

---

## 2026-02-27 — Refatoração Arquitetural (FASE 0–4)

- **Branch:** `refactor/floating-panel`
- **Agente:** Cursor (Opus 4.6)
- **Alterações:**
  - **FASE 0:** `slides/_manifest.js` — source of truth (28 slides, panelStates, archetypes)
  - **FASE 1:** `index.stage-c.html` → 28 arquivos em `slides/`, `index.template.html`, `scripts/build-html.ps1`, `scripts/split-slides.js`
  - **FASE 2:** `cirrose.css` consolidado — removidas regras redundantes (`.section-tag`, `max-width: 32ch`)
  - **FASE 3:** `slide-registry.js` — wiring centralizado (custom anims, panel, click-reveal, meld). Script block de ~120 para 19 linhas.
  - **FASE 4:** MDs atualizados (CLAUDE.md, slide-refactor.md, docs/HANDOFF.md, AUDIT-VISUAL.md, blueprint). Scripts melhorados (UTF-8, manifest-driven, id-based mapping, null guard).
- **Ciclo de melhoria:**
  - `build-html.ps1`: lê ordem de `_manifest.js` (não mais hardcoded), `-Encoding UTF8`, file-existence check
  - `split-slides.js`: mapeia sections por `id` (não mais por index)
  - `slide-registry.js`: null guard em `getCurrentSlide()`
- **Build:** `npm run build` OK. `npm run build:cirrose` adicionado.
- **Deletados:** `DIAGNOSTIC-OUTPUT.md`, `FASE-0-OUTPUT.md`..`FASE-3-OUTPUT.md` (consolidados aqui)

---

## 2026-02-26 — QA Screenshots + window.Reveal fix

- **Branch:** `refactor/floating-panel`
- **Agente:** Claude Code (Opus 4.6)
- **Alterações:**
  - `index.stage-c.html`: Added `window.Reveal = Reveal;` after `initAula()`
  - Root cause: `initAula()` returns deck event object, NOT the Reveal API
  - ESM scope doesn't expose `Reveal` to `window` — QA script needs `window.Reveal.isReady()`
- **QA:** 28 screenshots captured OK. Zero console errors.

---

## 2026-02-26 — P3: CasePanel/ClickReveal/registerCustom → slide IDs

- **Commit:** c441540
- **Agente:** Claude Code (Opus 4.6)
- **Fonte:** Plano aprovado `valiant-twirling-sunrise.md`
- **Alterações:**
  - `case-panel.js`: `connect(slidesContainer)`, `registerState(slideId, state)`, `onSlideChanged(slideEl)` — tudo keyed por string ID
  - `engine.js`: `registerCustom(slideId, fn)` — string ID em vez de index numérico
  - `index.stage-c.html`: 5× registerState, ClickReveal Map, revealer lookup — todos migrados para slide ID
- **Impacto:** 3 arquivos, 60 inserções, 40 deleções
- **QA:** 28 slides OK, zero erros, CasePanel funcional

---

## 2026-02-26 — Floating panel refactor + HOOK card fix

- **Commit:** 982dd01
- **Branch:** `refactor/floating-panel`
- **Alterações:** Grid → overlay. HOOK card light theme.

---

## 2026-02-26 — P2: Hero typography + Graceful degradation

- **Commit:** 822cf38
- **Agente:** Claude Code (Opus 4.6)
- **Alterações:**
  - `archetypes.css` + `cirrose.css`: `.metric-value` → Instrument Serif, weight 400, `text-primary`, `letter-spacing: -0.02em`, `tabular-nums lining-nums`
  - `engine.js`: `initNoJs()` movido para DEPOIS de `await initReveal()` — graceful degradation
- **Impacto:** 3 arquivos, 15 inserções, 8 deleções

---

## 2026-02-26 — JS bugfix: hash navigation fallback

- **Commit:** 59c10e7 (→ 7a49c9f)
- **Agente:** Claude Code (Opus 4.6)
- **Alterações:**
  - `engine.js`: Fallback timer 800ms no `slidechanged` para hash jumps
  - Guard `animatedSlide` previne dupla execução
  - `ready` handler: seta `animatedSlide = Reveal.getCurrentSlide()`
- **Validação:** Hash jump, navegação sequencial, HOOK countUp, stagger tables, case panel transitions — todos OK
- **Impacto:** Apenas `engine.js`. Zero CSS/HTML.

---

## 2026-02-25 — P1: Fill ratio + Source tags

- **Commit:** 92328c7
- **Branch:** `p1/fill-ratio`
- **Agente:** Claude Code (Opus 4.6)
- **Alterações:**
  - `cirrose.css`: 9 containers `max-width` → `min(Npx, 100%)`
  - Albumin-cards: `repeat(4,1fr)` → `repeat(auto-fit, minmax(min(180px,100%), 1fr))`
  - Source-tags: `.source-tag` posicionada `absolute bottom-right` em 10 slides
  - `archetypes.css`: `.archetype-figure .slide-figure` → `min(600px, 100%)`, border-radius, box-shadow
- **Impacto:** 2 CSS files. Zero HTML changes. Zero JS.

---

## 2026-02-25 — P0: Stage-C Stability

- **Commit:** ba474f8
- **Agente:** Claude Code (Opus 4.6)
- **Alterações:**
  - QA script, QA mode (`?qa=1`), panel safe area padding

---

## 2026-02-24 — QA Batch 0 (pós-implementação inicial)

- **Agente:** Claude Code (Opus 4.6)
- **Bugfixes:**
  1. `deck.on()` → `Reveal.on()` (TypeError)
  2. `Reveal.on('ready')` → sync init (evento já disparou)
  3. `Reveal.addKeyBinding` → `document.addEventListener('keydown', ..., true)`
  4. CSS: metric-value font-size clamp ajustado (card 3 overflow)
  5. CSS: metric-card padding/min-width/max-width + overflow:hidden
  6. CSS: nova `.metric-unit` classe
  7. HTML s-a2-01: Card 3 split value/unit
- **QA visual:** s-a1-01, s-a2-01, s-a1-03, s-cp1, case panel transitions, ArrowRight reveals, build — todos PASS

---

## 2026-02-24 — Triagem de auditorias externas

- **AUDIT-CONSOLIDADA** (Claude.ai Opus): 28 slides × 8 dim. Ghost text + stagger = artefatos screenshot. Panel clip = real.
- **ERRATA-FIX-SENIOR**: Diagnóstico correto. Custom properties sem `!important`. Aceito.
- **Gemini Custom Gem**: `!important` spray rejeitado. Glassmorphism rejeitado. `min()` aceito.
- **Resultado:** 4 `!important` pré-existentes. Zero adicionados.

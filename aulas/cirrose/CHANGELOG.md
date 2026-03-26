# CHANGELOG — Cirrose

> Histórico completo disponível via `git log`. Este arquivo mantém apenas o período ativo (standalone).
> Entradas pre-2026-03-22 removidas em 2026-03-26 (rationalization audit). Entradas pre-Mar/2026 removidas em 2026-03-24.

---

## 2026-03-26 — docs: rationalization audit (sessao 29)

- **Audit documental:** `docs/DOCS-RATIONALIZATION-AUDIT.md` — 30 achados (13 refs stale, 5 ghost files, 5 monorepo remnants, 4 overlaps, 3 conflitos).
- **Conflitos reais:** HANDOFF-CLAUDE-AI.md estados divergem de HANDOFF.md; WT-OPERATING.md mandato "ler INTEIRO" vs CLAUDE.md "on demand"; XREF.md ghost refs (.cursor/rules, CLAUDE.md cirrose).
- **Plano:** Batch 1 (9 arquivos cosmeticos) + Batch 2 (5 arquivos estruturais, requer aprovacao).
- **Cleanup executado:** 3 arquivos arquivados (HANDOFF-CLAUDE-AI.md, CHANGELOG root, ERROR-LOG root). XREF.md ghost refs removidos. Monorepo remnants renomeados. WT-OPERATING.md mandato corrigido para on-demand. CHANGELOG truncado (1295→153L). NOTES truncado (426→142L).

---

## 2026-03-25 — dev: slide ID label + Gate 0 prompt fix (sessao 28)

- **Slide ID label:** `deck.js` agora cria `#slide-id-label` (position:fixed, top-left, mono 11px, 55% opacity). Atualiza ao navegar via `goTo()`. Dev helper — remover antes de produção.
- **Gate 0 prompt fix:** `gemini-gate0-inspector.md` dizia "fundo escuro, texto claro" — corrigido para stage-c (creme claro) + .slide-navy (escuro). Afeta check READABILITY (#9).

## 2026-03-25 — QA visual s-a1-01: 3 fixes cirurgicos (sessao 27)

- **Ghost rows background (E59):** `background: transparent` e `var(--safe-light)` → `oklch(96% 0 0)`. Root cause: `color-mix()` hue interpolation bug (endpoint acromatico hue=0 interpola salmon em vez de teal).
- **Source-tag contraste (E60):** GSAP opacity 0.6→1, font-size 0.85rem→clamp(16px,1.1vw,20px), PMIDs removidos do texto visivel.
- **Ghost rows clipping (E61):** Removido `overflow: hidden` de `.guideline-stack` + adicionado right-padding ao `.guideline-rec`. GSAP `x:4` push excedia o container interno.
- **Arquivos:** cirrose.css (4 edits), slide-registry.js (1 edit), 02-a1-continuum.html (1 edit).

## 2026-03-25 — source-tag CSS investigation (sessao 26)

- **Source-tag diagnostico:** Base `.source-tag` (cirrose.css L36) tem defaults errados: `text-align: center`, `font-size: 10px`, `white-space: nowrap`. 5 overrides competem (stage-c, panel, #s-a1-01, no-js, base.css stage-c).
- **Fix testado:** Reescrita base (right-aligned, `clamp(14px, 0.9vw, 16px)`, `white-space: normal`), simplificacao `.stage-c .source-tag`, remocao `#s-a1-01 .source-tag` override, `justify-self: stretch`.
- **Achado:** `archetype-hero-stat` tem `justify-items: center` no `.slide-inner` que constrangia largura do source-tag — `justify-self: stretch` corrige.
- **Revertido:** Fix aplicado e revertido (`git revert`) para revisao manual antes de re-aplicar.
- **Repo cleanup (pre-sessao):** 10 skills deletadas (~1400L), 4 dead agents deletados (-1509L), XREF.md synced.

---

## 2026-03-24 — infra reduction cycle 4 (sessao 25)

- **CLAUDE.md consolidado:** 2 arquivos (root 141L + cirrose 152L) → 1 arquivo root (151L). -48%.
- **CURSOR.md deletado:** Cursor usado apenas como IDE, não como agente.
- **CHANGELOG.md truncado:** Entradas pre-Mar/2026 removidas (1553 → 1262 linhas). `git log` é o histórico completo.
- **NOTES.md limpo:** 153 linhas de auto-logs removidas (subagent-stop + build-monitor).
- **docs/ limpos:** 8 arquivos meta/processo deletados (ECOSYSTEM, KPIs, RULES, SKILLS, SUBAGENTS, SETUP, ZIP-LIMPO-PROTOCOLO, external/11-long-context-auditor). docs/README.md atualizado.
- **Total:** -1812 linhas, -10 arquivos (14 touched, 9 deleted, 5 modified).

---

## 2026-03-24 — lint:gsap-race detector (sessao 24)

- **lint-gsap-css-race.mjs:** Linter read-only detecta race conditions CSS/GSAP (ERRO-054).
  Detector A: class-state races (classList toggle + CSS property + GSAP inline).
  Detector B: direct style= assignments. v1 = warnings only (exit 0).
- **package.json:** `npm run lint:gsap-race`

---

## 2026-03-24 — guard-product-files hook (sessao 24)

- **guard-product-files.sh:** Hook PreToolUse exit 2 bloqueia Write/Edit/StrReplace em arquivos de produto (slides HTML, CSS aula, base.css, JS shared, slide-registry.js, index.html) sem confirmação humana. Fallback `"path"` além de `"file_path"`.
- **Motivação:** ERRO-053 (QA pipeline bypassed) e ERRO-049 (elementos aprovados removidos por Gemini).
- **Docs:** CLAUDE.md guardrails table, XREF.md hooks table, HANDOFF.md, CHANGELOG.md atualizados.

---

## 2026-03-23 — s-a1-01 CSS/GSAP fixes + source-tag global (sessao 23)

- **GSAP race condition fix (E54):** slide-registry.js match punch — opacity/transform/x/scale movidos para GSAP timeline. CSS .matched/.dimmed so mantem paint props (bg, border, filter).
- **Border-left guideline-rec:** Tensao arquitetonica editorial (Gemini Proposta 2). 1px solid color-mix.
- **Source-tag global fix (E55):** `#deck.has-panel .source-tag { max-width: calc(100% - 220px) }` — respeita case-panel em todos 44 slides. `grid-column: 1 / -1` defensivo para grid layouts.
- **Source-tag s-a1-01:** position:absolute, right:210px, max-width:none (fix local para grid layout).
- **Playwright MCP blocker (E56):** Navegacao deck.js nao funciona via MCP. Documentado workaround (script Node standalone).
- **Docs:** ERROR-LOG +3 (E54-E56), HANDOFF atualizado, NOTES sessao 3.

---

## 2026-03-23 — Infra polish + docs debt cleanup (sessao 22)

- **Vite base condicional:** `command === 'serve' ? '/' : './'`. Fontes resolvem no dev server.
- **Dead CSS removido:** `.framework-box` e `.predict-bars` (10 regras) de cirrose.css. `.etiology-table` preservada (viva).
- **shared/ imports:** grade/osteo/metanalise atualizados de `../../shared/` para `../cirrose/shared/`. Rebuilds OK.
- **Janitor cleanup:** `.bak`, empty dirs, orphan task files, orphan QA MDs removidos.
- **Docs debt:** XREF.md 7 fixes (guard-generated adicionado, guard-destructive archived, .claude/scripts/ removido, gate0-inspector prompt, paths canonicos corrigidos). Grade/osteo/metanalise CLAUDE.md: secoes Worktree removidas (WT protocol deletado). anti-drift.md: ECOSYSTEM split re-adiado pos-congresso. HANDOFF: assertion-evidence.mdc clearado.
- **Sessao suporte:** 0 slides avancados.

---

## 2026-03-22 — Standalone + best practices (sessoes 20-21)

- **Standalone:** shared/ internalizado em `./shared/`. Worktree protocol removido (Class A/B/C, guard-shared, guard-merge, warn-class-c, worktree-init/cleanup). 6 imports atualizados. Build OK.
- **s-a1-01 DONE (R12):** Gate 4 R2 6.7/10. P3 dimmed + P4 dots aplicados. Fechado por validacao visual Lucas.
- **CLAUDE.md best practices:** Workflow reescrito (sessao, erros, guardrails, complexidade). 151 linhas (<200 recomendado Anthropic).
- **lessons.md podado:** 481→88 linhas. 34 redundantes (ja em rules) + 5 obsoletas (worktree) removidas.
- **guard-generated.sh:** Hook PreToolUse exit 2 bloqueia Write em index.html gerado.
- **HANDOFF.md podado:** 344→120 linhas. Historico de sessoes movido para CHANGELOG.
- **Memory cleanup:** 4 feedbacks worktree deletados. Best practices salvo.
- **Docs cleanup:** XREF.md, HANDOFF-CLAUDE-AI.md, DONE-GATE.md — refs worktree removidas.

---

## 2026-03-22 — Repo map + janitor housekeeping (sessao 19)

- **Repo tree:** Arvore completa mapeada (746 arquivos). Estrutura documentada no plan file.
- **Janitor audit:** 44/44 slides no manifest, 0 orphans HTML, 0 broken MD links. 3 CSS WARNs (dead selectors: `.etiology-table`, `.framework-box`, `.predict-bars` — backlog).
- **Limpeza local:** 80 arquivos `.playwright-mcp/` deletados (32 console logs + 48 frame PNGs). 2 orphan PNGs raiz deletados (`check-current-slide.png`, `s-a1-classify-1280x720-post-fix.png`). Nao tracked — zero impacto git.
- **Dangling ref fix:** `_archive/ABSORB-PLAN-gemini-qa3.md` path corrigido em HANDOFF.md (arquivo existe na raiz, ref apontava para `aulas/cirrose/_archive/`).
- **Sessao suporte:** 0 slides avancados. Decisoes QA pendentes para s-a1-01 e s-a1-classify.

---

## 2026-03-22 — fix sistêmico vw→px + s-a1-classify pipeline prep (sessao 18)

- **ERRO-052 — vw em clamp() causa overflow com scaleDeck():**
  - deck.js `scaleDeck()` aplica `transform:scale()` mas CSS calcula com viewport real
  - 36 `clamp(min, Xvw, max)` onde vw era ativo (1280-1920 range) substituídos por px fixo @1280
  - cirrose.css (29 edits) + archetypes.css (7 edits). 4 dead code preservados. base.css intocado.
  - Slides afetados: s-title, s-hook, s-a1-01, s-a1-classify, s-a1-vote, e archetypes globais
- **gemini-qa3.mjs:** Fallback filenames adicionados para S1/S2 screenshots (`S1-1280x720.png`, `S2-1280x720.png`)
- **s-a1-classify Gate 0:** PASS 9/9 (pós-fix). Overflow PREDESCI resolvido.
- **Build:** PASS (44 slides). **Lint:** PASS.

---

## 2026-03-22 — s-a1-01 Gate 0 fix + Gate 4 R1 + pipeline hardening (sessao 17)

- **Gate 0 pipeline end-to-end:** Testado em s-a1-01. 9 iterações até PASS (6 MUST + 3 SHOULD). Custo ~$0.01/slide.
- **CSS fixes (cirrose.css — seção s-a1-01):** Hero-label margin, métricas margin-top auto→var(--space-md), metric labels white-space/font-size, hero-block justify/padding, source-tag contraste.
- **gemini-qa3.mjs:** Gate 0 payload S0+S2 only. maxOutputTokens 1024→8192, responseMimeType removido.
- **Gate 4 R1:** Score 6.75/10. 4 propostas Gemini. Custo medio ~$0.03-0.08/round.
- **Build:** PASS (44 slides). **Lint:** PASS.

---

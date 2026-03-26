# NOTES — Cirrose

> Log de decisoes entre agentes. Sessoes anteriores a [20/03] removidas em 2026-03-26 (rationalization audit). Historico completo: `git log`.

## [24/03] Sessao 1 — Diagnostico CSS + C3/C1/C2 fix + validate-css.sh

### Contexto
- Lucas rodou diagnostico completo do repo (501 arquivos, 61K linhas)
- Identificou 8 conflitos CSS reais (C1-C8) nunca detectados em sessoes anteriores
- Ratio infra:produto = 47%:53% (158 vs 179 arquivos)

### Fixes aplicados
- **C3 (E57):** Import order corrigido em `index.template.html`: `base → archetypes → cirrose` (era `base → cirrose → archetypes`). Docs (CLAUDE.md cirrose) ja diziam a ordem correta, codigo estava invertido.
- **C1 (E58):** `.stage-bad .source-tag` duplicado em cirrose.css unificado (color + opacity num bloco so).
- **C2:** Comment de archetypes.css atualizado para refletir nova posicao na cascata.

### Ferramenta criada
- `scripts/validate-css.sh` — 4 checks: import order, bare selector conflicts, !important audit, inline style audit. STATUS: PASS.

### Validacao
- `npm run build:cirrose` → 44 slides OK
- `npm run lint:slides` → PASS
- `validate-css.sh` → PASS (import order correto, 7 WARNs benignos de stage modifiers)

### Decisoes
- `.slide-headline`: archetypes.css so define `max-width: 85ch`, cirrose.css define font/color — propriedades diferentes, nao conflito real. Apos C3, cirrose vem por ultimo e vence se houver overlap futuro.
- `.source-tag`: 11 regras em 3 arquivos, cascata OK apos C3. `base.css` = tokens, `cirrose.css` = lecture-specific, `archetypes.css` = archetype-specific (specificity mais alta).
- `!important` audit: 65 total nos 3 CSS. Todos em contextos permitidos (`.no-js`, `.stage-bad`, `@media print`, `prefers-reduced-motion`).

### Repo split
- Repo renomeado/separado: `Aulas` → `aula.cirrose` (novo repo GitHub)
- `feat/cirrose-mvp` removida do Aulas, agora vive em `aula.cirrose`
- Remote local atualizado: `origin → github.com/lucasmiachon-blip/aula.cirrose.git`

### Meta-observacao (diagnostico do Lucas)
- Agente driftava lendo 156 MDs em vez de inspecionar CSS real
- `npm run lint:slides` so checa assertion-evidence, NAO checa cascata CSS
- validate-css.sh preenche esse gap

---

## [23/03] Sessao 3 — s-a1-01 fixes CSS/GSAP + source-tag global

### Fixes aplicados
- **GSAP vs CSS race condition (E54):** slide-registry.js match punch agora controla opacity/transform/x/scale via GSAP. CSS .matched/.dimmed so mantem bg/border/filter.
- **Border-left guideline-rec:** 1px solid color-mix (tensao arquitetonica Gemini Proposta 2).
- **Source-tag s-a1-01 (E55):** position:absolute, right:210px, max-width:none (respeita case-panel).
- **Source-tag global (E55):** `#deck.has-panel .source-tag { max-width: calc(100% - 220px) }` + `grid-column: 1 / -1` defensivo.

### Blocker encontrado
- **Playwright MCP nao navega deck.js (E56).** Testado: browser_press_key (ArrowRight, PageDown), hash navigation (#id, #/N), scrollIntoView, CustomEvent dispatch. Nenhum funciona. deck.js escuta keydown no document mas MCP nao entrega. Workaround: script Node standalone com click + keyboard.press em loop.

### Pendente para proxima sessao
1. Recapturar screenshots s-a1-01 (S0, S2, video) com fixes aplicados
2. Gate 4 Gemini editorial com assets atualizados
3. Seguir pipeline: s-a1-baveno

---

## [23/03] Sessao 2 — QA s-a1-01 Gate 0

### Resultado
- **Gate 0 PASS** (9/9 checks via gemini-qa3.mjs --inspect)
- S0.png capturado via qa-batch-screenshot.mjs (1280x720, estado final)
- qa-batch-screenshot.mjs so captura 1 estado (investigar pos-congresso)

### Decisoes
- **Playwright MCP:** NAO usar para screenshots neste sprint. Conflita com Chrome do usuario.
- **Screenshots:** qa-batch-screenshot.mjs (Puppeteer isolado) unico metodo.
- **Animacoes/estados intermediarios:** Lucas valida visualmente no browser.
- **deck.js:** NAO modificar no sprint. Zero infra.

---

## [23/03] Refatoracao Act 1 (baveno, classify, vote) + ERRO-053

### Mudancas aplicadas
- **Source-tag padronizado:** .stage-c .source-tag global (0.85rem, centered, max-width 90%). Overrides per-slide removidos exceto s-a1-01 (absolute positioning).
- **s-a1-baveno:** Removido pathway diagnostico (FIB-4/Elastografia/Rule of 5). Adicionado PREDESCI callout. States 3→2.
- **s-a1-classify:** Header PREDESCI verde (#2d5016) com texto branco. Source-tag visivel (removido opacity:0).
- **s-a1-vote:** Quiz removido. Refatorado para hero FIB-4 5,91 + cutoff + burnt-out. Archetype poll→hero-stat.
- **Manifest:** Act 1 reordenado (baveno movido de pos 5 para pos 2).
- **Screenshots:** Atualizados via qa-batch-screenshot.mjs para os 3 slides.

### ERRO-053 (CRITICAL)
Pipeline QA ignorado. Gemini rodado sem Gates 1-2, com PNGs stale, 3 calls paralelas (2 ECONNRESET). 8 memorias de feedback violadas. Diagnostico completo em ERROR-LOG.md. Memoria feedback_qa_never_skip_pipeline.md criada.

---

## [21/03] s-a1-classify — QA visual R3-R10 (10 rodadas Gemini)

### Decisões travadas pelo usuário
1. **Blur state 2:** "sutil" = opacity 0.5 + blur 2px. Gemini propôs remover em R9 — REJEITADO.
2. **Sidebar verde PREDESCI:** `writing-mode: vertical-lr`, bg `oklch(30% 0.10 170)`. Gemini R8 propôs remover ("UI corporativa") — REJEITADO. Usuário: "não consegue deixar com a barra lateral".
3. **Cards inset box-shadow:** `inset 4px 0 0 0 var(--safe/warning/danger)` + `border-radius: var(--radius-md)`. Gemini R8 propôs pseudo-element `::before` bar — implementado mas perdeu efeito visual. Revertido a pedido do usuário.
4. **MorphSVG ✕→L-arrow:** Aprovado ("vamos tentar todas"). Gemini R9 chamou de "gimmick" — mantido.

### Pipeline Gemini — lições
- **ERRO-048:** Rodadas R3-R5 travaram em 5.6/10 porque enviavam 1 PNG. Após enviar 4 PNGs + video, score saltou para 7.2.
- **ERRO-049:** Gemini ignora decisões do usuário se não receber contexto explícito. `--round` DEVE listar "DECISOES ANTERIORES MANTIDAS (NAO sugerir novamente)".
- **Estimativa de tokens:** ~18-22K tokens/rodada (prompt 8K + 4 imgs 5K + video 4K + output 3K). ~$0.40-0.45 para 10 rodadas.

---

## [20/03] Crash Bun + hardening pos-crash

**Evento:** Bun segfault apos 11h uptime. Processo morreu sem aviso.
**Causa:** Playwright sem browser_close() acumulou instancias Chromium (300-500MB cada) + audit-trail.sh spawnando `node -e` a cada tool call (~150ms overhead).
**Impacto:** Trabalho em andamento nao commitado perdido. Sem dados corrompidos.
**Acoes tomadas:**
1. WT-OPERATING.md: §9 (regras de sessao) + §10 (browser_close obrigatorio) — commitado `513424a`
2. ERRO-047 registrado no ERROR-LOG
3. Main absorvida (`542949b` — qa:video npm script)

## [20/03] Env vars pendentes

- **GEMINI_API_KEY:** OK (presente no env)
- **PERPLEXITY_API_KEY:** Ausente. Necessaria quando for usar Perplexity MCP (pesquisa profunda).
- **SCITE:** OAuth, nao API key. Pendente verificacao de tokens.
- **Acao:** Setar antes de sessoes que usem esses MCPs. Nao bloqueia QA pipeline (usa Gemini).

## [20/03] Pendencia infra main — npm script qa:video (RESOLVIDO)

~~`package.json` nao tem script `qa:video`.~~ Resolvido: commit `542949b` em main, absorvido nesta sessao.

# NOTES — Cirrose

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

### Problemas Playwright (referencia, NAO corrigir agora)
- Chrome do sistema conflita com sessao aberta do usuario
- deck.js ESM nao expoe navegacao via window
- Dev server Vite instavel entre chamadas (port drift)

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

### Pendente
- QA pipeline dos 3 slides NAO iniciado. Reiniciar do Gate 1 na proxima sessao.

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
- **Score flutuou:** 5.6→7.2→6.9→6.8→6.5→7.1. Cada rodada traz novas propostas que às vezes regridem outras dimensões. Usuário decidiu parar em R10 e avançar.

### Implementações técnicas
- **MorphSVGPlugin:** `danger-x-morph` path `M6,6 L18,18` → `M4,2 L4,18 Q4,22 8,22 L18,22` (L-arrow shape). `danger-x-fade` faz opacity 0 durante morph.
- **DrawSVGPlugin:** `classify-further-path` com `drawSVG: '0%'` → `'100%'`.
- **ScrambleText:** "further decompensation" com chars `░▒▓█▄▀`.
- **3D cards:** `rotationX: -12, transformPerspective: 800` no initial state. Landing effect com `back.out(1.2)`.
- **CSS Grid alignment:** `--col-icon: 28px` compartilhado entre cards e further-decomp (Gestalt continuidade).

---

## [20/03] Crash Bun + hardening pos-crash

**Evento:** Bun segfault apos 11h uptime. Processo morreu sem aviso.
**Causa:** Playwright sem browser_close() acumulou instancias Chromium (300-500MB cada) + audit-trail.sh spawnando `node -e` a cada tool call (~150ms overhead).
**Impacto:** Trabalho em andamento nao commitado perdido. Sem dados corrompidos.
**Acoes tomadas:**
1. WT-OPERATING.md: §9 (regras de sessao) + §10 (browser_close obrigatorio) — commitado `513424a`
2. ERRO-047 registrado no ERROR-LOG
3. Main absorvida (`542949b` — qa:video npm script)
**Pendencias P1 (branch main):**
- audit-trail.sh: eliminar `node -e`, substituir por bash puro (reduz ~80% overhead)
- audit-trail.sh: filtrar read-only tools (Read/Glob/Grep) para reduzir ~60% dos spawns

## [20/03] Env vars pendentes

- **GEMINI_API_KEY:** OK (presente no env)
- **PERPLEXITY_API_KEY:** Ausente. Necessaria quando for usar Perplexity MCP (pesquisa profunda).
- **SCITE:** OAuth, nao API key. Pendente verificacao de tokens.
- **Acao:** Setar antes de sessoes que usem esses MCPs. Nao bloqueia QA pipeline (usa Gemini).

## [20/03] Pendencia infra main — npm script qa:video (RESOLVIDO)

~~`package.json` nao tem script `qa:video`.~~ Resolvido: commit `542949b` em main, absorvido nesta sessao.

## [19/03] Doc hardening — backlog estrutural

Itens deferidos (nao-criticos, registrar para futuro):
- **qa-engineer.md:** extrair JS snippets para reference.md (economia ~80 linhas)
- **SKILLS.md:** remover secao Cursor skills (irrelevante para Claude Code)
- **ECOSYSTEM.md:** split em 3 docs (routing estavel + benchmarks volateis + inventario)
- **XREF.md:** atualizar apos todos os fixes acima

## [19/03] s-hook v11 — regressoes corrigidas, prompt v3

**Diagnostico:** s-hook v10 ganhou assimetria, clinical stutter e blackout (Gemini rounds 1+2), mas REGREDIU em: (1) lab cards perderam surface treatment (bg/shadow/radius removidos por over-correction), (2) overlay fraco (35% = fog, nao cinema), (3) punchline/question cores inadequadas para overlay escuro.
**Decisao:** Corrigir regressoes ANTES de enviar para Gemini round 3. Gemini deve avaliar slide em estado visual competente, nao gastar tokens em issues obvios.
**Fixes aplicados:** E43 (cards), E44 (overlay+colors). GSAP agora faz color swap (dark CSS → light inline) no advance, clearProps no retreat. Fallback no-js mantido.
**Prompt v3:** Template reescrito com eng de prompt (persona composta, escala calibracao 5 niveis, 7 lentes com beleza como #1, interacoes avancadas para sala pequena, round context). Salvo em `docs/prompts/gemini-slide-editor.md`.
**Proximo:** Capturar novos screenshots v11, preencher prompt v3 com raw code atualizado, enviar para Gemini.

## [18/03] Letterbox 16:10 vs 16:9 — teste TV pendente

**Setup Lucas:** Laptop 2560x1600 (16:10, DPR 1.5) → HDMI espelhado → TV (resolucao TBD, provavelmente 16:9).
**Slides:** desenhados para 16:9 (1280x720). No monitor 16:10, aparecem barras (letterbox) em cima e embaixo.
**Decisao:** manter design 16:9. Ignorar letterbox no monitor por enquanto. Lucas vai testar na TV em 19/03 para confirmar que preenche 100%.
**Screenshots QA:** capturados em viewport 1707x1067 (16:10 do monitor). Barras sao esperadas e nao indicam bug.
**Acao pendente:** apos teste na TV, registrar resolucao real e recapturar screenshots se necessario.

## [18/03] Fontes woff2 — instaladas mas Vite path errado

**Issue:** `npm run fonts:install` baixou 4 woff2 para `shared/assets/fonts/`. Porem Vite dev server resolve `@font-face url()` para `aulas/assets/fonts/` (404) por causa de `base: './'` no `vite.config.js`.
**Impacto:** Todos slides renderizam com fallback (Georgia/system-ui) em vez de Instrument Serif/DM Sans/JetBrains Mono. Layout pode shiftar quando fontes carregarem em producao.
**Fix:** Mudar `vite.config.js` linha 35 para `base: command === 'serve' ? '/' : './'` (condicional dev/build). Infra root-level — preferivel fazer em main.
**Decisao Lucas:** Deferir para depois do QA pipeline. Pegar junto com outros issues criticos de design.
**Onde resolver:** Sessao em main, editando `vite.config.js`.

---

## [17/03] WT-OPERATING.md criado — substitui QA-WORKFLOW.md

**Decisao:** Criar prompt operacional por WT (`WT-OPERATING.md`) com maquina de estados, QA loop 5-stage com Gemini multimodal obrigatorio, anti-drift embutido, e protocolo de sessao.

**Motivacao:** Nenhum slide tem QA fechado. Updates se perdem entre sessoes. Loops nao fecham. Drift acontece apesar de docs anti-drift existirem. Falta sistematicidade.

**Estado real verificado (auditoria 1 a 1):** TODOS 44 slides sao CONTENT (conteudo completo com notes e PMIDs). NENHUM e DRAFT/esqueleto. Classificacao inicial errada foi corrigida.

**QA-WORKFLOW.md:** Mantido como referencia de tooling (Playwright, Gemini models, API keys, execution logs s-a1-classify). Header deprecated aponta para WT-OPERATING.md.

**Pendencias cross-ref (para sessao main):**
- `docs/XREF.md` — adicionar WT-OPERATING.md como canonico QA pipeline
- `docs/README.md` — referenciar WT-OPERATING.md na secao cirrose

---

## [17/03] Fantasma s-a1-01 — versão main obsoleta

**02-a1-continuum.html** existe em duas versões completamente diferentes:

| | **main** (obsoleta) | **WT** (canônica) |
|---|---|---|
| h2 | "1,43 milhão morre por ano" | "Por que rastrear?" |
| Hero | 1.43M mortes (burden/iceberg) | 83% diagnósticos novos |
| Archetype | hero-stat (3 states) | flex simples (auto) |
| Fonte | GBD 2021 | Prince 2024 / EASL 2024 |

**Root cause:** Slide reescrito na WT (779b4a5, d20deec, cd8a69a) mas main ficou com versão "burden" (80c4a7c). Main NÃO modificou o arquivo após merge-base (2f9e909) → merge futuro WT→main = sem conflito (git mantém versão WT).

**Risco:** humano/agente copiar conteúdo de main. **Regra:** NUNCA copiar conteúdo de `main:aulas/cirrose/` para a WT.

---

## [17/03] Auditoria de processos — 76 achados (3 agentes)

Rodamos repo-janitor + rules-audit + docs-audit. Resumo:

### Fixes aplicados nesta sessao (WT)
- `tasks/lessons.md`: removida secao duplicada verbatim "Sessao 16/mar — JS scaling"
- `aulas/cirrose/qa-screenshots/README.md`: atualizado para refletir estrutura real (per-slide folders)

### Checklist para sessao em main (Classe A/B)

**P1 — Alto impacto:**
1. Split `reveal-patterns.md` → `deck-patterns.md` (ativo) + `reveal-legacy.md` (frozen) — resolve 9 achados
2. Atualizar `docs/SKILLS.md` — adicionar 11 skills Claude Code faltantes + slide-frontend-ux (Cursor)
3. Codificar 5 ERROs em rules:
   - css-errors.md: overflow-y:hidden default (ERRO-020), archetype scope (ERRO-018/032), pseudo-elements + flex (metanalise lessons), p margin in flex+gap, justify-content clipping
   - slide-editing.md: stopPropagation (ERRO-033), init ordering (ERRO-016), deck.js bg-color pattern (ERRO-034), [TBD] placement (ERRO-029)
4. Atualizar `design-system.md`: documentar Plan C / `.stage-c` como default, corrigir `Reveal.addKeyBinding` → deck.js `C` key

**P2 — Medio impacto:**
5. Adicionar `slide-identity.md`/`.mdc` a XREF.md e RULES.md
6. Fix `docs/SETUP.md` linha 165: remover ref a `assertion-evidence.mdc` (nao existe)
7. Adicionar 3 archive files a XREF.md (CHATGPT_HANDOFF_ACT2, NNT-IC95-REPORT, system-v6.plan)

**P3 — Baixo impacto:**
8. Consolidar tabelas duplicadas ECOSYSTEM+KPIs (3 tabelas de modelos → 1)
9. Anotar em README.md/XREF.md que refs metanalise so existem na WT feat/metanalise-mvp
10. Arquivar ACT2-ARCHITECTURE.md (orfao, nao indexado)

---

## [16/03] Merge main → cirrose-mvp

- **3 commits absorvidos:** `16732c6` (.gitignore test-results), `f45b1e0` (4 MCPs visuais), `120da6a` (docs sync)
- **Conflito .mcp.json:** auto-merge sem conflito textual, mas gerou 3 entradas duplicadas (a11y-contrast, gemini, frontend-review). Deduplicado manualmente em `da77cf9`.
- **chrome-devtools MCP:** novo, só existia em main — agora disponível na WT.
- **Zero Classe C** — merge seguro.
- Prompt preparado para metanalise fazer o mesmo merge (ver seção abaixo).

---

## [15/03] Decisões — s-hook panel + hierarquia labs

- **Panel ativado:** `panelState: 'hidden'` → `'neutral'` — decisão: duplicação intencional familiariza audiência com o panel lateral antes do Act 1
- **Hierarquia padronizada:** ALT card tinha `.hook-lab--success` + tag "normal ✓" diferenciando-o visualmente. Removido para manter todos 6 labs com mesma hierarquia. Armadilha pedagógica (ALT normal em burnt-out) fica nas speaker notes, não na UI
- **visibleFields progressivo:** s-hook mostra apenas AST, ALT, PLQ, Albumina, Bili, INR. FIB-4/LSM/MELD aparecem a partir de slides posteriores — evita spoiler cognitivo
- **CSS órfão:** 7 regras de `.hook-lab--success` e `.hook-lab-tag` removidas (classes não existem mais no HTML)
- **ERRO-008 revertido:** de "corrigido (hidden)" para "revertido para neutral" — duplicação agora intencional

---

## [04/03] Decisões — D'Amico slide

- Headline (v2): "D'Amico redefiniu o prognóstico da cirrose 3 vezes em 18 anos"
- Terminologia: "Estádio" (estadiamento), não "Estágio" (internship). Verificado: Aurélio, Michaelis, Rezende.
- Estádio 3: "Ascite" (D'Amico 2006 separou ascite de HDA — estádios distintos)
- Badge: "D'Amico 2006 · 118 estudos · mortalidade/ano" acima do pathway-track
- Overlay bg: oklch(45% 0.12 25) OPACO — semi-transparente causava bleed-through
- PMID 16364498 CORRIGIDO → 16298014 (o antigo apontava para artigo de fMRI)
- State machine: busy guard adicionado — impede overlay antes dos cards
- D'Amico 2014 (PMID 24654740): reordenação ascite>HDA (stage 3=bleeding 20%, stage 4=ascites 30%)
- D'Amico 2024 (PMID 37916970): further decomp HR 1.46, NÃO estratifica ascite vs bleeding
- QA 4 estados: s0 (4 estádios), s1 (+estádio 5), s2 (overlay opaco), s3 (source + overlay). Retreat OK.

### Correções pendentes D'Amico
- Estádio 5 label ERRADO: slide diz "Infecção ou AKI" — D'Amico 2014 define como "any second decompensating event"
- Further decompensation NÃO é estádio 6 — D'Amico 2024 usa modelo de transição de 4 estados
- D'Amico 2014 stages reais: 1=compensado sem varizes, 2=com varizes, 3=bleeding, 4=1ª descomp não-bleeding, 5=2º evento (88%/5a)
- Corrigir label estádio 5: "Infecção ou AKI" → "2º evento descompensante"
- Overlay: resolver sobreposição de texto reportada pelo Lucas

---

## [03/03] Reference scan — Conflitos conhecidos

### CONFLITO 1 — BAVENO VII PMIDs (RESOLVIDO)
- **35120736** = artigo original (CORRETO). **35431106** = errata.
- evidence-db.md corrigido para 35120736.

### CONFLITO 2 — CONFIRM PMID (CRÍTICO — CORRIGIDO)
- evidence-db listava PMID **34882432** (artigo de saúde transgênero — ERRADO).
- PMID correto: **33657294** (Wong et al., NEJM 2021, terlipressina HRS).

### CONFLITO 3 — D'Amico 2006 PMID (CORRIGIDO)
- Tier-2 listava **16364498** (fMRI binge eating — ERRADO).
- PMID correto: **16298014** (D'Amico/Garcia-Tsao/Pagliaro, J Hepatol 2006).

### CONFLITO 4 — ANSWER PMID (OK)
- evidence-db usa **29861076** (Caraceni, Lancet 2018) — CORRETO.

### CONFLITO 5 — Caso Antônio etilismo
- Slide visual: 60g/dia (corrigido de 40g/dia em 03/03).
- Notes s-cp1: 60g/dia — consistente agora.

### CONFLITO 6 — CCM fontes divergentes
- evidence-db cita Møller (PMID 11964606). Slide usa Ewid 2025 / Izzy 2020.
- Pendente: validar se Møller ainda é relevante.

---

## [03/03] Referências [TBD] — 21 itens

5 CANDIDATE — **TODOS ERRADOS** (verificados 09/mar via WebSearch):
1. ~~PREDICT (Trebicka) — PMID 32275982~~ → **32673741** (32275982 = ELF test NAFLD)
2. ~~Lens CSPH SVR — PMID 28039099~~ → **RESOLVIDO 08/mar: PMID 32535060**
3. ~~CANONIC (Moreau) — PMID 23562128~~ → **RESOLVIDO 08/mar: PMID 23474284**
4. ~~AASLD ACLF 2024 — PMID 38530940~~ → **37939273** (38530940 = herbicida pyrazole)
5. ~~Turco 2024 NSBB — PMID 38504576~~ → **38108646** (38504576 = belatacept heart TX). Journal: CGH, não Liver Int
6. ~~Izzy 2020 CCC — PMID 31342533~~ → **31342529** (off by 4)
7. ~~D'Amico 2022 NAD vs AD — PMID 34174336~~ → **34157322** (34174336 = fluoxetine neurogenesis)

12 NOT INDEXED (artigos 2025-2026): Mahmud ACG 2025, AGA 2025 Orman, Kuo 2025 AMR, Hofer/Reiberger 2026, EASL HCC 2025, Ewid 2025 CCM, Skouloudi 2023 GLS, Verstraeten 2025, DuBrock ILTS 2025, Alvarado-Tapias 2025, Pose JAMA 2025, Puente 2025 CIRROXABAN.

2 especiais: PPI HR 1,75 PBE (FONTE NÃO IDENTIFICADA — escalar para Lucas), ~~Tonon 2025~~ → **RESOLVIDO: PMID 40228583**.

---

## [04/03] Interações avançadas Act 1

- **s-a1-01 (Burden)**: state machine 3 estados — hero countUp → iceberg bars → source
- **s-a1-damico**: state machine 4 estados — 4 stages → 5º bloco → overlay → source
- **~~s-a1-02~~ → s-a1-baveno + s-a1-rule5**: mega-slide eliminado e distribuído (05/mar)
- Padrão: `__hookAdvance` / `__hookRetreat`, SplitText importado
- Failsafe: .no-js, .stage-bad, @media print — tudo visível

### Feedback do usuário (pendente)
1. D'Amico: enfatizar que o sistema evoluiu ao longo dos estudos dele
2. D'Amico: ascite pior que bleeding — conceito novo D'Amico 2024
3. FIB-4 calculadora (sessão futura)
4. Paradigma slide — conteúdo OK, ordem OK
5. Próxima fase: conteúdo, ordem, ajustes CSS

---

## [07/03] Decisões narrativas Act 1 — Lucas (mobile)

### Arco narrativo Act 1

| Pos | Slide | h2 / tema | Status |
|-----|-------|-----------|--------|
| 1 | s-a1-01 (burden) | mantém | ✅ |
| 2 | s-a1-damico | "A evolução do prognóstico" | ⚠ rótulo → propor assertivo |
| 3 | s-a1-fib4 | FIB-4 e modelos não-invasivos | ⚠ precisa h2 assertivo |
| 4 | ?? | idem (continuação FIB-4) | ❓ qual slide? |
| 5 | s-a1-rule5 | Rule of 5 e elastografia | ⚠ precisa h2 assertivo |
| novo | ?? | Novo paradigma: cACLD/dACLD | ❓ slide existente ou novo? |
| último | s-a1-meld | "MELD e Child ainda são portos seguros" | ⚠ assertividade |

### Diretriz de tom (Lucas)
- NÃO manchete sensacionalista — público especialista
- h2 = afirmação factual, par-a-par, linguagem técnica seca
- Lucas quer ver slides rodando antes de decidir h2

### Pendências para sessão com computador
1. Lucas ver slides no browser → decidir h2
2. Resolver "4 idem" — qual slide?
3. "Novo paradigma" — baveno existente ou criar?
4. Aplicar h2 nos HTMLs + rebuild + lint
5. s-a1-classify — onde fica no arco?

---

## [03/03] IDEIA — Convergência-Divergência (pós-MVP)
- Comparação UpToDate vs BMJ Best Practice vs DynaMed
- Material de estudo, NÃO slide. Promover só se Lucas decidir.

---

## [08/03] AI Disclosure — Pesquisa

ICMJE, COPE, JAMA, NEJM, Lancet: **AI não pode ser autor/coautor.**
Disclosure obrigatório em Acknowledgments (final), nunca na linha de autoria.
Detalhes: ver `references/coautoria.md` (renomeado para AI Disclosure).

*Agent logs 08/mar removidos (machine noise — ver git history se necessário)*

---

## [09/03] Sessão — PMID audit + RAW_ACT3_V1

### Decisões
- **BB/NSBB toggle restaurado** como 5ª interação do Act 2 (A2-07). Lucas decidiu Opção A.
- **PPI HR [TBD]** em s-a1-infeccao notes: fonte não identificada. OR 2,17 tem PMID 26214428, mas HR específico não tem paper. Escalar para Lucas.

### Descobertas críticas
- **5/5 CANDIDATE PMIDs estavam ERRADOS.** Todos produzidos por modelo sem verificação MCP. Lição: NUNCA confiar em PMID de modelo sem verificação via PubMed/WebSearch.
- evidence-db.md atualizado com PMIDs corretos + notas de verificação.

### Produzido
- `RAW_ACT3_V1.md` — 7 slides, 7/9 PMIDs verificados
- HANDOFF, CHANGELOG, NOTES atualizados

*Machine logs 09-12/mar purgados (capturados pelo audit-trail hook em `~/.claude/session-logs/`).*

---

## [15/03] Sessão — QA Loop 1 fixes (Cursor)

### Fixes aplicados (4 slides Act 1)

1. **s-a1-damico** (CRÍTICO): 4 `.scores-era-source` removidos (PMIDs já consolidados no source-tag). 2 era-tags encurtados. CSS: padding 24/48/16, gap 0.5rem, margin-top:0 nos era-children, further-decomp compactado. Fill 196%→~90%, word count ~143→~105.
2. **s-a1-01** (MODERADO): padding reduzido para 24/48, hero number ampliado (clamp 64-96px vs default 56-86px), pathway steps com padding maior (--space-md/--space-lg). Fill 52%→~65%.
3. **s-hook** (MODERADO): failsafes .no-js/.stage-bad adicionados para .hook-lab, .hook-punchline, .hook-question. Labs ficavam invisíveis se GSAP falhasse — agora forçam opacity:1 + transform:none. 720p clipping verificado (446px < 720px).
4. **s-cp1** (MENOR): inline style `font-size:0.82rem;color:var(--text-muted);margin-bottom:4px` removido → classe `.poll-question`. aria-labels adicionados nos 3 poll buttons.

### Decisões

- **Era-sources removidos** (damico): PMIDs inline dentro de cada era eram redundantes com o source-tag consolidado no final. Palestrante menciona fonte oralmente; source-tag revela no click. Reduz word count e fill sem perder atribuição.
- **Failsafes com !important**: necessário para sobrescrever gsap.set() que roda antes do failsafe CSS. Padrão já usado em outros failsafes do projeto.
- **Hero number ampliado** (a1-01): clamp customizado scoped ao slide. Não afeta outros hero-stat slides.
- **Split do damico adiado**: 3 conceitos em 1 slide permanece. Split seria mudança estrutural (9 superfícies) fora do escopo QA Loop 1.

### Doc sync

- AUDIT-VISUAL.md: 4 slides re-scored com evidência dos fixes
- narrative.md: drift s-cp1 corrigido ("Como estadia?" → "Como você estadia?")
- CHANGELOG.md, HANDOFF.md: atualizados no commit anterior

[2026-03-19 20:34] [BUILD] OK — npm run build:cirrose 2>&1 | tail -3 && npm run lint:slides 2>&1 | tail -3

[2026-03-20 10:17] [BUILD] OK — npm run build:cirrose 2>&1 | tail -5

[2026-03-20 10:35] [unknown:a22f835d] — concluído. Status: PARTIAL

[2026-03-20 10:42] [BUILD] OK — npm run build:cirrose 2>&1 | tail -3

[2026-03-20 10:58] [unknown:a550f4cf] — concluído. Status: PARTIAL

[2026-03-20 12:04] [BUILD] OK — npm run build:cirrose 2>&1 | tail -5

[2026-03-20 12:27] [unknown:a936b119] — concluído. Status: PASS

[2026-03-20 12:37] [general-purpose:ab5067be] — concluído. Status: PARTIAL

[2026-03-20 13:31] [unknown:a2264cdd] — concluído. Status: PARTIAL

[2026-03-20 20:21] [unknown:aed59641] — concluído. Status: PARTIAL

[2026-03-20 20:22] [BUILD] OK — cd C:/Dev/Projetos/wt-cirrose && npm run build:cirrose 2>&1 | tail -5

[2026-03-20 20:32] [BUILD] OK — cd C:/Dev/Projetos/wt-cirrose && npm run build:cirrose 2>&1 | tail -5

[2026-03-20 20:40] [BUILD] OK — cd C:/Dev/Projetos/wt-cirrose && npm run build:cirrose 2>&1 | tail -3

[2026-03-20 20:42] [unknown:ac2d7430] — concluído. Status: PASS

[2026-03-20 21:06] [Explore:abb89af8] — concluído. Status: PARTIAL

[2026-03-20 21:07] [Explore:a03f92b7] — concluído. Status: PARTIAL

[2026-03-20 21:37] [BUILD] OK — npm run build:cirrose

[2026-03-21 13:18] [BUILD] FAIL — Exit code 2
=== PÓS-MERGE ===
Último commit: 99092b7 merge: absorve hardening main (e77dcec)

reveal.js em dependencies:
REMOVIDO

build:metanalise:
powershell -ExecutionPolicy Bypass -File aulas/metanalise/scripts/build-html.ps1

orphan scripts (devem dar erro):
ls: cannot access 'scripts/act1-reaudit.mjs': No such file or directory
ls: cannot access 'scripts/act1-surgical-qa.mjs': No such file or directory
ls: cannot access 'scripts/attention-insight.js': No such file or directory
ls: cannot access 'scripts/mcp-attention-insight.js': No such file or directory | cmd: echo "=== PÓS-MERGE ===" && git status --short && echo "Último commit: $(git log --oneline -1)" && echo "" && echo "reveal.js em dependencies:" && node -e "console.log(require('./package.json').dependencies?.['reveal.js'] || 'REMOVIDO')" && echo "" && echo "build:metanalise:" && node -e "console.log(require('./package.json').scripts['build:metanalise'])" && echo "" && echo "orphan scripts (devem dar erro):" && ls scripts/act1-reaudit.mjs scripts/act1-surgical-qa.mjs scripts/attention-insight.js scripts/mcp-attention-insight.js 2>&1

[2026-03-21 14:02] [repo-janitor:a91f74e1] — concluído. Status: PARTIAL

[2026-03-21 14:08] [unknown:a73a13f9] — concluído. Status: PARTIAL

[2026-03-21 14:19] [general-purpose:a9e1ee89] — concluído. Status: PARTIAL

[2026-03-21 16:08] [unknown:a54ddf2e] — concluído. Status: PASS

[2026-03-21 16:42] [unknown:a3eef9c0] — concluído. Status: PARTIAL

[2026-03-21 17:05] [unknown:a236ee7a] — concluído. Status: PARTIAL

[2026-03-21 17:58] [unknown:a9a1d9de] — concluído. Status: PARTIAL

[2026-03-21 18:29] [unknown:a5c1d36e] — concluído. Status: PASS

[2026-03-21 20:21] [unknown:aa4b9a16] — concluído. Status: PARTIAL

[2026-03-21 21:18] [unknown:ade3d0b2] — concluído. Status: PASS

[2026-03-21 23:14] [Explore:a36743d7] — concluído. Status: PASS

[2026-03-21 23:17] [Explore:a427980a] — concluído. Status: PARTIAL

[2026-03-21 23:20] [Explore:a4edc8f3] — concluído. Status: PASS

[2026-03-21 23:25] [unknown:a33edf24] — concluído. Status: PARTIAL

[2026-03-22 14:44] [Explore:aa098a50] — concluído. Status: PASS

[2026-03-22 14:44] [Explore:abd25ce4] — concluído. Status: PARTIAL

[2026-03-22 15:03] [repo-janitor:a045684c] — concluído. Status: PARTIAL

[2026-03-22 17:10] [unknown:a5004460] — concluído. Status: PARTIAL

[2026-03-22 18:32] [unknown:a710b36d] — concluído. Status: FAIL

[2026-03-22 21:24] [Explore:a93bf765] — concluído. Status: PARTIAL

[2026-03-22 21:25] [Explore:a5c440e1] — concluído. Status: PASS

[2026-03-22 21:34] [Explore:a9d40104] — concluído. Status: PASS

[2026-03-22 21:34] [Explore:a09c4198] — concluído. Status: PASS

[2026-03-22 21:35] [Explore:adff0515] — concluído. Status: FAIL

[2026-03-22 21:38] [unknown:ae61c9fd] — concluído. Status: PARTIAL

[2026-03-22 21:51] [BUILD] FAIL — Exit code 1 | cmd: cd /d "C:\Dev\Projetos\wt-cirrose" && npm run build:cirrose 2>&1 | head -50

[2026-03-22 21:51] [Explore:aa4b94b7] — concluído. Status: PASS

[2026-03-22 21:51] [Explore:a0ab7f67] — concluído. Status: PASS

[2026-03-22 21:51] [Explore:afb6557d] — concluído. Status: PARTIAL

[2026-03-22 22:08] [unknown:af86c309] — concluído. Status: PARTIAL

[2026-03-22 22:23] [claude-code-guide:a86d1d63] — concluído. Status: PARTIAL

[2026-03-22 22:28] [unknown:a39944cd] — concluído. Status: PARTIAL

[2026-03-22 22:30] [unknown:a43729fb] — concluído. Status: PARTIAL

[2026-03-22 22:30] [general-purpose:a374ce2d] — concluído. Status: PARTIAL

[2026-03-22 22:39] [general-purpose:ac4822e4] — concluído. Status: FAIL

[2026-03-22 22:46] [Explore:ad5488ee] — concluído. Status: PARTIAL

[2026-03-23 10:29] [BUILD] FAIL — Exit code 1 | cmd: cd /d "C:\Dev\Projetos\wt-cirrose" && npm run build:cirrose 2>&1 | tail -5

[2026-03-23 10:58] [repo-janitor:aea8509e] — concluído. Status: PARTIAL

[2026-03-23 11:10] [Explore:a01bc0ca] — concluído. Status: PASS

[2026-03-23 11:11] [Explore:a6ec7108] — concluído. Status: PARTIAL

[2026-03-23 11:18] [Explore:a322ecab] — concluído. Status: PASS

[2026-03-23 11:21] [Plan:a3789e6d] — concluído. Status: PASS

[2026-03-23 12:02] [unknown:a56898ab] — concluído. Status: PASS

[2026-03-23 12:34] [unknown:a194e9a5] — concluído. Status: PARTIAL

[2026-03-23 16:04] [Explore:a6a1463d] — concluído. Status: PASS

[2026-03-23 16:16] [Explore:afc26667] — concluído. Status: PARTIAL

[2026-03-23 17:53] [unknown:a512c775] — concluído. Status: PASS

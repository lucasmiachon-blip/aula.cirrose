# NOTES — Cirrose

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

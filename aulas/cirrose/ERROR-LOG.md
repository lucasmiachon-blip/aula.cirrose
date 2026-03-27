# ERROR LOG — Cirrose

> Atualizar a cada sessão. Cada erro vira regra que previne repetição.
> **Path:** `aulas/cirrose/ERROR-LOG.md` · Referência: `CHANGELOG.md`

---

## Formato

```
[ERRO-NNN] Severidade | Slide | Descrição | Root cause | Regra derivada
```

Severidades: CRITICAL (bloqueia projeção), HIGH (prejudica leitura), MEDIUM (estética), LOW (cosmético)

---

## Registro

### ERRO-001 · CRITICAL · s-hook
**Contraste insuficiente em stage-c (light theme)**
**Root cause:** Cores desenhadas para dark navy; stage-c renderiza light gray.
**Regra:** Testar em AMBOS os temas. `#s-hook { background: #162032 !important }` para forçar navy.
**Status:** ✅ Corrigido (override #s-hook com cores literais).

### ERRO-002 · HIGH · s-hook
**Emoji em contexto profissional**
**Regra:** ZERO emojis unicode em slides projetados.
**Status:** ✅ Corrigido (removido).

### ERRO-003 · HIGH · s-hook
**Referências de lab ilegíveis**
**Regra:** Lab refs >= 0.8rem, cor contrastante.
**Status:** ✅ Corrigido (0.85rem, #a0acc0).

### ERRO-004 · HIGH · s-hook
**Layout piramidal dos labs (4+1)**
**Regra:** Labs grid: `repeat(5, 1fr)` — todos na mesma linha.
**Status:** ✅ Corrigido.

### ERRO-005 · MEDIUM · s-hook
**Cold open cinematográfico inapropriado**
**Regra:** Slide mostra DADOS; contextualização nos speaker notes.
**Status:** ✅ Corrigido (removido).

### ERRO-006 · MEDIUM · s-hook
**Framework "5 números / 3 decisões" overproduced**
**Regra:** Validar se conteúdo é "slide material" ou "speaker note material".
**Status:** ✅ Corrigido (removido).

### ERRO-007 · HIGH · s-hook
**Fill ratio < 10%**
**Regra:** Beat mínimo: 25% do canvas.
**Status:** ✅ Melhorado (pergunta abaixo dos labs, tipografia maior).

### ERRO-008 · MEDIUM · s-hook
**Case panel duplica informação**
**Regra:** Quando slide exibe dados expandidos, considerar ocultar panel.
**Status:** ✅ Revertido para `neutral` (15/mar) — labs aparecem no corpo E no panel lateral. Duplicação intencional: familiariza audiência com o panel antes do Act 1. `visibleFields` limita a AST, ALT, PLQ, Albumina, Bili, INR.

### ERRO-009 · CRITICAL · s-hook beat 1 (stage-c)
**Texto "Qual é o próximo passo?" ilegível — dark on navy**
**Root cause:** `var(--text-on-dark)` em stage-c = escuro. Especificidade vence.
**Regra:** Slides com bg escuro forçado: `#s-hook .elemento { color: #f0f2f5 }` (literal).
**Status:** ✅ Corrigido.

### ERRO-010 · HIGH · s-hook
**Animações sem retorno — ArrowLeft/Up não voltam beat**
**Root cause:** Só advanceBeat(); não existia retreatBeat().
**Regra:** Beats/reveals: implementar navegação bidirecional quando >1 estado.
**Status:** ✅ Corrigido (retreatBeat, engine.js intercept).

### ERRO-011 · MEDIUM · s-hook
**"Texto desce" ao pressionar ArrowDown**
**Root cause:** Conflito Reveal.js + interceptação.
**Regra:** ArrowDown removido da interceptação do hook.
**Status:** ✅ Corrigido.

### ERRO-012 · LOW · qa-screenshots-stage-c.js
**PNG captura estado intermediário**
**Root cause:** Delay 500ms; countUp 1,2s + stagger ~1s.
**Regra:** Delay inicial 1,5s ou aguardar animações via JS.
**Status:** ✅ Corrigido (1,5s).

### ERRO-013 · MEDIUM · s-hook
**Texto descentralizado — margens grandes**
**Regra:** place-content: center; ajustar padding.
**Status:** ✅ Corrigido.

### ERRO-014 · MEDIUM · s-hook (beat 1)
**Sombra dos números antes da animação**
**Root cause:** Labs/lead/question visíveis (herdam opacity do beat) antes do stagger.
**Regra:** Beat 1 content: `opacity: 0; visibility: hidden` em CSS até GSAP animar; resetBeat1Content() no retreat.
**Status:** ✅ Corrigido.

### ERRO-015 · HIGH · s-hook
**Transição Antônio inconsistente ao retornar**
**Root cause:** Conflito de animações; gsap.set(prev, { opacity: 0 }) + killTweensOf causavam "não aparece".
**Regra:** Evitar killTweensOf e set agressivos no retreat; usar overwrite: 'auto' no fromTo.
**Status:** ✅ Corrigido (revertido para lógica simples).

### ERRO-016 · CRITICAL · init
**Interação sumiu — clique/setas não funcionam**
**Root cause:** wireAll rodava DEPOIS de anim.connect(); customAnimations não registrados quando ready/slidechanged disparava; __hookAdvance nunca definido.
**Regra:** `wireAll()` ANTES de `anim.connect()` — custom anims devem estar registrados antes do dispatcher conectar.
**Status:** ✅ Corrigido (index.template.html).

### ERRO-017 · HIGH · preview s-hook
**Beat 0 e beat 1 mostram mesmo estado estático nos subitens**
**Root cause:** Ready dispara antes de connect(); customAnim nunca roda; data-initial-beat ignorado.
**Regra:** Em preview/single-slide: aplicar estado estático via DOM local (setBeat + labs visibility) após init, sem depender do dispatcher.
**Status:** ✅ Corrigido (preview.html — bloco pós-connect).

---

## Resumo por severidade

### ERRO-018 · HIGH · s-a1-damico (Era 5)
**`.pathway-track` renderizava `display:block` em vez de `flex`**
**Root cause:** CSS `.archetype-pathway .pathway-track { display:flex }` está scoped ao archetype-pathway. Era 5 usa archetype-flow — não herda o flex.
**Fix:** `cirrose.css` — `.damico-dataset .pathway-track { display:flex; gap:4px; align-items:stretch }` + `.damico-dataset .pathway-stage { flex:1; flex-direction:column }`.
**Regra:** Ao reutilizar elementos de um archetype dentro de OUTRO archetype, re-declarar o layout necessário no contexto novo.
**Status:** ✅ Corrigido.

### ERRO-019 · CRITICAL · todos os slides com panel visível
**Headline cortada pelo case-panel (sobreposição de ~49px)**
**Root cause:** `--panel-width: 140px` + `min(1120px, calc(100% - 140px - 1rem))` resulta em `1120px` (cap vence). Com `margin:0 auto` em viewport 1280px, a borda direita do conteúdo fica em 1200px > panel-left 1087px.
**Fix:** `archetypes.css` — `--panel-width: 200px` + `.reveal.has-panel .slide-inner { max-width: calc(100% - var(--panel-width) - 3rem); margin: 0 0 0 2rem }`.
**Regra:** Ao testar layouts com case-panel ativo, sempre verificar sobreposição headings vs panel com `getBoundingClientRect()`. O cap 1120px é binding constraint — `has-panel` deve reduzir O CAP, não apenas o calc.
**Status:** ✅ Corrigido.

### ERRO-020 · HIGH · s-a1-damico (Era 1 + Era 5)
**Scrollbar aparece quando conteúdo excede altura do scores-era-track**
**Root cause:** `.scores-era { overflow-y: auto }` + Era 1 tem 4 limitations (~56px cada = 224px) + boxes + classes + source > altura disponível da track (~267px, ver ERRO-021).
**Fix:** `overflow-y: hidden` + `.scores-limitations { gap:4px }` + `.limitation { padding: 4px }`.
**Regra:** Slides são canvas fixo 720px. Usar `overflow-y: hidden` como padrão em eras — conteúdo que não cabe é responsabilidade do design, não do CSS. Jamais `overflow-y: auto` em container de slide projetado.
**Status:** ✅ Corrigido (scrollbar suprimido; 4ª limitation levemente clippada — aceitável).

### ERRO-021 · HIGH · s-a1-damico (Era 5 — D'Amico 2014 clippado)
**`grid-template-rows: auto auto 1fr auto` não aplica — seletor sem espaço**
**Root cause:** `#s-a1-damico.archetype-flow` (sem espaço) seleciona elemento com ambas id e class no MESMO nó. A section tem id=s-a1-damico mas NÃO tem class=archetype-flow (a class está no div filho `.slide-inner`). Seletor nunca casa → track fica `height: auto` (~267px) → Era 5 dataset 2014 clippado.
**Fix:** Adicionar espaço → `#s-a1-damico .archetype-flow` (descendente).
**Regra:** CSS descendente = ESPAÇO (`A B`). Mesmo elemento = SEM espaço (`A.B`). Testar SEMPRE com `querySelectorAll('seletor').length > 0` para confirmar que o seletor casa.
**Status:** ✅ Corrigido (espaço já presente em cirrose.css:2220).

---

## Erros registrados — sessão restructure/act1 (2026-03-05)

### ERRO-022 · HIGH · s-a1-vote
**Interação nunca testada com click real no browser**
**Root cause:** Slide criado inteiramente em código sem QA visual/interação. `doReveal()` disparado por click em `.vote-option`, mas comportamento real (CSS transitions, opacity, countUp) não verificado.
**Regra:** Todo slide com interação JS deve ter ao menos 1 screenshot de cada estado (antes/depois do reveal) antes de commitar como concluído.
**Status:** ✅ Corrigido (fe5a1d8). Slide merged into s-a1-fib4 (27/mar); regra permanece valida.

### ERRO-023 · MEDIUM · múltiplos slides do Bloco 1
**CSS failsafe não testado em novos elementos**
**Root cause:** Novos elementos (`.classify-card`, `.fib4-inputs`, `.fib4-hero-result`, `.rule-gray-zone`, `.antonio-pin`, `.meld-threshold`) têm `opacity:0` em CSS para GSAP, mas `.no-js` e `.stage-bad` overrides não foram verificados em browser.
**Regra:** Após adicionar qualquer elemento animado novo, verificar que `.no-js .elemento { opacity: 1; visibility: visible }` existe em cirrose.css E que funciona em stage-bad (sem GSAP).
**Status:** ✅ Verificado (2026-03-14). Todos os 6 elementos têm `.no-js`/`.stage-bad` failsafe em cirrose.css: `.classify-card` (L2482), `.rule-gray-zone` (L1734), `.antonio-pin` (L2487), `.meld-threshold` (L279). `.fib4-inputs` e `.fib4-hero-result` nunca têm `opacity:0` — não precisam de failsafe.

---

*Raw code s-hook v5 (28/fev) removido — snippets nos source files + git history (commit 2c116b1)*

---

## Erros registrados — sessão diagnóstico source-of-truth (2026-03-08)

### ERRO-024 · MEDIUM · múltiplos arquivos
**Notas stale de divergência persistem após correção**
**Root cause:** PLQ 118k foi corrigido para 112k em `_manifest.js`, mas `[LUCAS DECIDE]` em CASE.md e "PLQ inconsistência" em HANDOFF.md não foram removidos. Agentes subsequentes reliam as notas, achavam que o bug existia, e perdiam tempo investigando.
**Fix:** Padronizar PLQ 112k em todos (CASE.md, narrative.md, _manifest.js, 07-cp1.html, index.html). Remover notas stale.
**Regra:** Quem corrige um bug DEVE limpar todas as notas de warning associadas (HANDOFF, CASE.md, NOTES.md). Nota sem cleanup = drift futuro garantido.
**Status:** ✅ Corrigido.

---

## Erros registrados — sessão P0 documental (2026-03-08)

### ERRO-025 · HIGH · medical-data.md + evidence-db.md
**PMIDs errados em Tier 1: ANSWER e CONFIRM**
**Root cause:** medical-data.md copiou PMIDs sem verificação cruzada com evidence-db.md. ANSWER tinha 29793859 (correto = 29861076). CONFIRM tinha 34882432 (artigo sobre saúde transgênero — correto = 33657294).
**Fix:** Corrigidos em medical-data.md.
**Regra:** Ao fixar PMID, grep ALL occurrences em todo o repo e corrigir em todos os arquivos.
**Status:** ✅ Corrigido.

### ERRO-026 · HIGH · narrative.md
**NSBB prevenção primária usado como hero de profilaxia secundária**
**Root cause:** A2-07 (pós-HDA) usava PREDESCI NNT 9 como hero number. PREDESCI testou prevenção PRIMÁRIA (cACLD+CSPH sem descompensação). Pós-HDA = secundária — população diferente.
**Fix:** A2-07 headline → "Profilaxia secundária pós-HDA: NSBB + EVL seriada". PREDESCI = callback narrativo, não hero.
**Regra:** Verificar POPULAÇÃO do trial antes de usar como hero. Prevenção 1ª ≠ 2ª.
**Status:** ✅ Corrigido (narrative.md).

### ERRO-027 · MEDIUM · evidence-db.md
**Ioannou PMID 31374215 descrito como "HR 0,29 (morte) com SVR" sem clarificar que é pós-HCC**
**Root cause:** Descrição ambígua. Leitores poderiam entender como redução de incidência de HCC, mas é sobrevida pós-diagnóstico de HCC em pacientes com SVR.
**Fix:** Clarificado: "morte pós-HCC com SVR. NB: para incidência → PMID 31356807"
**Regra:** Ao citar HR de HCC, explicitar: incidência ou sobrevida pós-diagnóstico?
**Status:** ✅ Corrigido.

---

| Severidade | Total | Corrigidos | Pendentes |
|------------|-------|------------|-----------|
| CRITICAL   | 4     | 4          | 0 |
| HIGH       | 13    | 13         | 0 |
| MEDIUM     | 9     | 9          | 0 |
| LOW        | 1     | 1          | 0         |

---

## Erros registrados — sessão correção pré-QA Act 2 (2026-03-09)

### ERRO-028 · CRITICAL · s-a2-01 (30-a2-gatilhos.html)
**PREDICT PMID errado projetado: 32275982 (ELF test NAFLD) em vez de 32673741 (Trebicka)**
**Root cause:** HTML criado a partir de RAW_ACT2_V2.md que usava PMID CANDIDATE não verificado. evidence-db.md já tinha sido corrigido, mas a correção não propagou para o HTML gerado depois.
**Fix:** source-tag e speaker notes corrigidos para PMID 32673741.
**Regra:** Ao criar HTML de slide a partir de RAW, verificar CADA PMID contra evidence-db.md corrigido. CANDIDATE ≠ verificado.
**Status:** ✅ Corrigido.

### ERRO-029 · HIGH · s-a2-09 (34-a2-nutricao.html)
**`[TBD SOURCE]` visível na source-tag projetada**
**Root cause:** Skeleton preenchido sem fonte verificada para prevalência de sarcopenia. Placeholder ficou na source-tag projetada.
**Fix:** Removido da source-tag. Mantido apenas nos speaker notes como [TBD] para busca futura.
**Regra:** [TBD] é permitido em notes (não projetado). NUNCA em source-tag, headline ou corpo projetado.
**Status:** ✅ Corrigido.

---

| Severidade | Total | Corrigidos | Pendentes |
|------------|-------|------------|-----------|
| CRITICAL   | 5     | 5          | 0 |
| HIGH       | 14    | 14         | 0 |
| MEDIUM     | 9     | 9          | 0 |
| LOW        | 1     | 1          | 0         |

---

## Erros registrados — sessão hardening Act 1 (2026-03-10)

### ERRO-030 · MEDIUM · s-a1-meld
**Emoji unicode (🟢🟡🟠🔴) em slide projetado**
**Root cause:** Slide criado com emoji circles como indicadores de faixa MELD. Viola ERRO-002 (zero emojis). Também viola daltonismo: reforço deveria ser ✓/⚠/✕ (design-system.md), não emoji.
**Fix:** Emoji substituído por `.meld-band-dot` (14px CSS circles coloridos por band). Ícones ✓/⚠/✕ já presentes no `.meld-action`.
**Status:** ✅ Corrigido.

### ERRO-031 · LOW · s-title
**`data-background-color` usa `var()` em vez de HEX literal**
**Root cause:** `data-background-color="var(--bg-navy, #162032)"` — Reveal.js parseia como string JS. Funciona em browsers modernos mas é frágil. Regra: HEX literal.
**Fix:** Trocado para `data-background-color="#162032"`.
**Status:** ✅ Corrigido.

---

---

## Erros registrados — sessão audit-rules (2026-03-17)

### ERRO-038 · SHOULD · deck.js
**Click handlers em slides propagam ao nav layer**
**Root cause:** Handlers de click dentro de slides (ex: `.vote-option`) disparam evento que propaga ao deck.js. Nav layer interpreta como navegação (próximo slide).
**Regra:** Click handlers DENTRO de slides devem usar `stopPropagation()` para não propagar ao nav layer.
**Status:** ✅ Regra preventiva (slide-editing.md, deck-patterns.md). Nenhum bug real registrado.

### ERRO-039 · SHOULD · deck.js
**`data-background-color` não funciona em deck.js**
**Root cause:** `data-background-color` é convenção Reveal.js. O deck.js custom não processa esse atributo. Slides com `data-background-color="#162032"` ficam com fundo transparente → herdam bg do `#deck`.
**Regra:** Em deck.js, usar `background-color` no CSS com seletor `#slide-id .slide-inner`, NÃO `data-background-color`.
**Status:** ✅ Regra preventiva (lessons 16/mar, deck-patterns.md). ERRO-031 relacionado (Reveal legacy).

---

---

## Erros registrados — sessão D'Amico chromatic + vote elevation (2026-03-10)

### ERRO-032 · HIGH · s-a1-damico
**Pathway stages sem cor semântica — archetype scoping**
**Root cause:** HTML usa classes `--safe/--warning/--danger/--critical` nos `.pathway-stage`, mas `archetypes.css` aplica cores apenas dentro de `.archetype-pathway`. O slide usa `.archetype-flow` — regras nunca casavam. Stages renderizavam com bg transparente (quase invisíveis).
**Fix:** `cirrose.css` — regras explícitas `#s-a1-damico .pathway-stage.--safe { background: ... }` etc. Também adicionado `.no-js/.stage-bad` failsafe para `source-tag` com `opacity:0` inline.
**Regra:** Ao reutilizar componente visual de um archetype em OUTRO, verificar se as regras de cor estão scoped ao archetype original. Se sim, re-declarar no contexto novo (ver também ERRO-018).
**Status:** ✅ Corrigido (cfb7d26).

### ERRO-033 · HIGH · s-a1-vote
**3 bugs de interação: click avança slide, retreat não desfaz, leave+return não reseta**
**Root cause:** (a) Click em `.vote-option` propagava para Reveal → avançava slide. (b) `killTweensOf` no retreat matava tweens mas não restaurava estado DOM. (c) Sair e voltar ao slide não limpava classes de estado.
**Fix:** `slide-registry.js` — (a) `e.stopPropagation()` no handler, (b) retreat restaura DOM manualmente em vez de confiar em kill, (c) `slidetransitionend` reseta classes. Visual: headline serif, card buttons elevados, labs/bio demotidos, spacing ajustado para 720px.
**Regra:** Interações com click handler DENTRO de slide Reveal: SEMPRE `stopPropagation()`. Retreat: restaurar estado DOM explicitamente, não confiar em `killTweensOf`. Leave/return: resetar no `slidetransitionend`.
**Status:** ✅ Corrigido (fe5a1d8). Slide merged into s-a1-fib4 (27/mar); regras permanecem validas.

---

## Erros registrados — sessão s-title fix (2026-03-15)

### ERRO-034 · CRITICAL · s-title
**3 bugs em s-title: bg light em stage-c, divider AI marker, brasão inverte para preto**
**Root cause sistêmica:** deck.js não parseia `data-background-color` (atributo Reveal.js legacy). Em `.stage-c`, `--text-on-dark` é remapeado para cor escura → texto escuro em fundo que deveria ser navy = invisível. `.stage-c .title-brasao { filter: invert(1) }` transforma PNG branco em preto.
**Fix aplicado:** `#s-title { background-color: #0d1a2d }` via CSS (não via atributo HTML) + re-scope de tokens `--text-on-dark` dentro do seletor + `#s-title .title-brasao { filter: none }` + `.title-divider` CSS removido + `slide-navy` adicionado ao `.slide-inner`.
**Regressão (resolvida):** Scroll em todos os slides causado por `<aside class="notes">` visíveis (deck.js não escondia). Fix sistêmico em `base.css`: notes `display:none` + viewport/section `overflow:hidden`.
**Regra:** Slides que precisam de bg escuro forçado em deck.js DEVEM usar CSS `background-color` no `#slide-id`, não `data-background-color`. Re-escopar tokens de texto dentro do seletor ID.
**Status:** ✅ Corrigido (s-title fix + scroll sistêmico em base.css).

---

### ERRO-035 · HIGH · s-a1-01
**`.screening-pathway` quebrava para 2 linhas — 3o card (Elastografia) cortado**
**Root cause:** CSS inline no HTML definia `flex-wrap: wrap`. Com gap de 16px e 3 cards + 2 arrows, total = 991px em 936px disponíveis → wrap inevitável. O erro estava no CSS inline do slide, não no archetype.
**Fix:** Override em `cirrose.css` com `#slide-viewport .screening-pathway { flex-wrap: nowrap; gap: var(--space-xs) }` + `#slide-viewport .screening-step { min-width: 0; padding: var(--space-sm) }`.
**Diagnóstico associado:** 9 slides reportados com "overflow" eram artefatos de GSAP (elementos `opacity:0` ocupam espaço de layout mas não são visíveis). Conteúdo visível cabe em 720px.
**Regra:** Antes de diagnosticar overflow real, verificar se elementos com `opacity:0` estão inflando o `scrollHeight`. Usar `Array.from(els).filter(el => parseFloat(getComputedStyle(el).opacity) === 0)`.
**Status:** ✅ Corrigido (2026-03-16).

---

### ERRO-036 · MEDIUM · s-title
**h1 specificity perdida — titulo renderizava 38px em vez de 56px**
**Root cause:** `base.css` define `h1 { font-size: var(--text-h1) }` (38px). `cirrose.css` tinha `.slide-title h1` mas especificidade insuficiente — base.css vencia.
**Fix:** `#deck .slide-title h1 { font-size: var(--text-hero) }` em cirrose.css (specificity bump via #deck).
**Regra:** Seletores em aula CSS que competem com base.css DEVEM ter ID anchor (#deck) para vencer cascata.
**Status:** ✅ Corrigido (2026-03-18).

---

### ERRO-037 · HIGH · s-title
**Pillar dots invisiveis em stage-c — --ui-accent-light quase identico ao background**
**Root cause:** `.title-pillars .pillar-dot { background: var(--ui-accent-light) }` usa L=92% (oklch). Background stage-c eh L=95% (#eceff2). Contraste ~1.1:1 — invisivel.
**Fix:** `.stage-c .title-pillars .pillar-dot { background: var(--ui-accent) }` — usa L=35% (#073777). Contraste 9.98:1 AAA.
**Detectado por:** Gemini 2.5 Flash (QA.3). Confirmado pos-fix por Gemini 3.1 Pro (QA.4).
**Regra:** Tokens `*-light` (L>85%) NUNCA usar como foreground em stage-c (bg L=95%). Sempre verificar contraste com MCP a11y.
**Status:** ✅ Corrigido (2026-03-18).

### ERRO-040 · HIGH · s-hook (v9)
**Labs grid clipping — 3rd column (PLQ, INR) cortados na borda direita**
**Root cause:** `.hook-stage` tem `width: 100%; padding: 2.5rem 3.5rem 2rem 3rem` mas sem `box-sizing: border-box`. Default `content-box` faz padding SOMAR ao 100%, overflow de ~104px.
**Fix:** Adicionar `box-sizing: border-box` no `.hook-stage`.
**Regra:** Containers com `width: 100%` + padding DEVEM ter `box-sizing: border-box`. Apenas `section` e `.slide-inner` tem reset global em base.css — custom containers herdam `content-box`.
**Status:** Corrigido (2026-03-18).

### ERRO-041 · HIGH · s-hook (v9)
**Punchline e question sobrepostos no beat 1 — ambos em grid-area: punch (auto-height row)**
**Root cause:** Grid `auto` row com 2 elementos overlapping. `align-self: end` no question nao resolve porque row height = max(content) = 1 linha = ambos empilham.
**Fix:** Remover do grid flow. `position: absolute` — punchline centered (top:45%), question ancorada (bottom:2.5rem). Container `.hook-stage` ganhou `position: relative`.
**Regra:** Elementos que aparecem SOBRE o slide (punchline, overlays) devem usar `position: absolute`, nao participar do grid flow. Grid areas `auto` com multiplos filhos = sobreposicao garantida.
**Status:** Corrigido (2026-03-18).

### ERRO-042 · HIGH · QA pipeline
**QA.3 Gemini recebeu codigo STALE (v5) enquanto slide era v9 — review criativo avaliou versao errada**
**Root cause:** Prompt QA.3 tinha HTML/CSS/JS da v5 (flex centrado, stagger simples, sem blackout). O agente nao atualizou o raw code no prompt antes de enviar ao Gemini. Gemini deu sugestoes baseadas em codigo que nao existia mais.
**Fix:** Regra de processo — prompt QA.3 DEVE ser gerado dinamicamente lendo os arquivos atuais, NUNCA copiando de versao anterior.
**Impacto:** ~$0.03 de API gastos em review de codigo errado. Sugestoes parcialmente uteis mas desalinhadas.
**Regra derivada:** E42 — Raw code no prompt Gemini DEVE ser lido dos arquivos NO MOMENTO do envio. NUNCA reaproveitar prompt de rodada anterior sem re-extrair o codigo.
**Status:** Registrado. Processo atualizado em WT-OPERATING.md.

### ERRO-043 · HIGH · s-hook (v10 → v11)
**Lab cards perderam surface treatment (bg, border-radius, shadow) na refatoracao v10**
**Root cause:** Gemini QA.3 round 1 criticou layout centralizado com cards como "dashboard". Ao implementar assimetria (v10), cards foram removidos por over-correction — Gemini pediu mudanca de LAYOUT, nao remocao de SURFACE. Resultado: labs como texto flutuando sem container, perda de profundidade visual e hierarquia de superficie.
**Fix:** Restaurar `background: var(--bg-card)`, `border-radius: var(--radius-sm)`, `box-shadow: 0 1px 4px oklch(0% 0 0 / 0.06)` em `.hook-lab`. Sem `border` (evita look "dashboard"). Gap aumentado de `0.75rem` para `1rem`.
**Regra:** Ao implementar sugestoes criativas, preservar layers de superficie existentes. Mudar LAYOUT =/= remover SURFACE. Sao dimensoes ortogonais. Sempre verificar se a refatoracao manteve card bg/shadow/radius.
**Status:** Corrigido v11 (2026-03-19).

### ERRO-044 · HIGH · s-hook (v10 → v11)
**Overlay blackout muito fraco (35% opacity) — efeito fog em vez de cinematic blackout**
**Root cause:** `oklch(15% 0.01 258 / 0.35)` no overlay = area resultante L~67% (cinza medio). Punchline dark (L=8%) em cinza medio = contraste OK mas estetica pobre. Nao parece "luzes apagando" — parece "tudo ficou embaçado".
**Fix:** Overlay escurecido para `oklch(8% 0.01 258 / 0.78)` = area resultante L~26%. Punchline mudou para cream (#f5f5f7) via GSAP (CSS mantem dark para fallback no-js). Question mudou para light gray (#c8ccd4) via GSAP. Text-shadow ajustado para bloom suave (60px spread, 25% opacity).
**Regra:** Blackout overlay cinematico precisa de alpha >= 0.65 para criar contraste dramatico. Textos sobre overlay escuro DEVEM mudar para cores claras via GSAP (mantendo CSS dark para fallback no-js/stage-bad).
**Status:** Corrigido v11 (2026-03-19).

### ERRO-045 · MEDIUM · s-a1-01 (v3)
**Source-tag truncated at 1920x1080 — last PMID cut off right edge**
**Root cause:** `.source-tag` text line is too long for viewport at 1920x1080 when deck.js `scaleDeck()` scales up. No `overflow-wrap`, `text-wrap`, or `max-width` constraint on source-tag within this slide.
**Fix:** CSS `.source-tag` com `white-space:normal; overflow-wrap:anywhere; text-align:left; max-width:55%`. Confirmado ambas resoluções: scrollW=364, clientW=364.
**Regra:** Source-tags com 3+ citações DEVEM ser testados em ambas resoluções (1280x720 + 1920x1080). Se truncar, quebrar em 2 linhas ou reduzir font-size.
**Status:** ✅ Corrigido v4 (2026-03-19).

### ERRO-046 · HIGH · s-a1-01 (R11)
**GSAP inline opacity override cria race condition com case-panel.js**
**Root cause:** Custom animation P1 fazia `gsap.to(casePanel, { opacity: 0 })` no slide enter e `gsap.to(casePanel, { opacity: 1 })` no slide:changed. GSAP inline style (specificity maxima) vencia a classe `.hidden { opacity: 0 }` do CSS. Resultado: (1) case-panel invisivel em s-a1-01 onde deveria aparecer (primeiro panelState registrado); (2) case-panel visivel em s-hook ao navegar para tras (restorePanel GSAP vence .hidden CSS).
**Fix:** Remover bloco P1 inteiramente. case-panel.js controla visibilidade sozinho via classe .hidden. Adicionado padding-right: 210px ao .slide-inner para clearance visual do case-panel.
**Regra:** NUNCA usar GSAP para controlar opacidade de elementos gerenciados por outro sistema (case-panel.js). GSAP inline style vence CSS classes e cria race conditions. Se precisar esconder elemento gerenciado, usar a API do gerenciador.
**Status:** ✅ Corrigido (2026-03-20).

### ERRO-047 · CRITICAL · infra (Bun runtime)
**Bun crashou com segfault apos 11h de uptime continuo**
**Root cause:** Playwright browser instances sem `browser_close()` acumularam memoria (300-500MB cada). Combinado com hooks pesados (audit-trail.sh spawnando `node -e` a cada tool call), RSS do processo cresceu ate segfault.
**Fix:** 3 medidas implementadas:
1. WT-OPERATING.md §9: restart obrigatorio a cada 2-3h, checkpoint pre-QA, monitor RAM >3GB
2. WT-OPERATING.md §10: `browser_close()` obrigatorio apos toda sessao Playwright
3. (Pendente) audit-trail.sh: eliminar spawn de `node -e`, substituir por bash puro
**Regra:** Sessoes longas (>2h) com Playwright = alto risco de crash. Restart preventivo. Sempre commitar checkpoint antes de operacoes pesadas.
**Status:** ✅ Corrigido. audit-trail.sh deletado (Ciclo 4), Bun removido do projeto. Ambos componentes eliminados. Fechado Ciclo 5.

### ERRO-048 · HIGH · s-a1-classify (QA pipeline)
**Gemini pipeline incompleto — 1 PNG enviado em vez de 4, sem video**
**Root cause:** Primeiras rodadas Gemini (R3-R5) enviaram apenas 1 screenshot estático em vez de 4 PNGs (1 por estado de click-reveal) + video .mp4 das animações. Gemini avaliava layout estático sem ver estados intermediários (further decomp, PREDESCI, blur). Score ficou preso em 5.6/10 por 3 rodadas.
**Fix:** Pipeline corrigido para enviar `--png S0.png --png S1.png --png S2.png --png S3.png --video s-a1-classify.mp4`. Score saltou para 7.2 na rodada seguinte.
**Regra:** Pipeline Gemini DEVE enviar 1 PNG por estado de click-reveal + video .mp4. NUNCA enviar apenas 1 screenshot. Registrado em memória `feedback_gemini_pipeline_complete.md`.
**Status:** ✅ Corrigido (pipeline padronizado, 2026-03-21).

### ERRO-049 · MEDIUM · s-a1-classify (QA Gemini)
**Gemini propôs remover elementos aprovados pelo usuário sem flag de conflito**
**Root cause:** Gemini R8 propôs remover barra lateral verde do PREDESCI e estilo inset box-shadow dos cards — ambos previamente aprovados pelo usuário. Implementação cega das propostas gerou regressão visual. Usuário: "não consegue deixar com a barra lateral" + "por um momento os cards estavam com um efeito bonito mas não reproduziu mais".
**Fix:** Revertido sidebar verde + inset box-shadow. `--round` context passou a incluir bloco "DECISOES ANTERIORES MANTIDAS (NAO sugerir novamente)" com lista explícita de decisões travadas.
**Regra:** Propostas Gemini que contradigam decisões do usuário DEVEM ser filtradas antes de implementar. Incluir no `--round` context todas as decisões travadas com "NAO sugerir novamente". Registrado em memória `feedback_gemini_override_user.md`.
**Status:** ✅ Corrigido (2026-03-21).

### ERRO-050 · MEDIUM · Gate 0 pipeline
**Gate 0 S0 capture mid-animation causa false positives (CLIPPING, INVISIBLE, ANIMATION_STATE)**
**Root cause:** `capture-s-a1-01.mjs` capturava S0 a 150ms do `slide:entered` — GSAP já em execução. Métricas tinham `clipPath` parcial (labels cortados), blur em valores, e countUp em progresso. Gemini interpretava artefatos de animação como defeitos de layout.
**Fix:** S0 agora usa `forceAnimFinalState()` para layout limpo (mesma lógica do S2). S1 recarrega página para captura mid-animation independente. Gate 0 payload usa S0+S2 (S1 excluído — mid-animation causa false positives).
**Regra:** Captures para Gate 0 (inspeção de defeitos) DEVEM mostrar layouts estabilizados (pre ou post-animation). Mid-animation screenshots só para Gate 4 (editorial/motion review) ou videos. GSAP escopado em módulo ES não é acessível via `typeof gsap` no page context — usar `forceAnimFinalState` no Playwright.
**Status:** ✅ Corrigido (2026-03-22).

### ERRO-051 · MEDIUM · gemini-qa3.mjs
**Gate 0 maxOutputTokens insuficiente + responseMimeType causa truncamento**
**Root cause:** `maxOutputTokens: 1024` com `responseMimeType: 'application/json'` no Gemini 3.1 Pro causava `finishReason: MAX_TOKENS` com apenas 31-81 tokens. Modelo truncava JSON prematuramente. Mesmo a 2048 tokens continuava truncando.
**Fix:** `maxOutputTokens: 8192`, `responseMimeType` removido. Parsing robusto: strip markdown fences, handle array responses, finishReason logging.
**Regra:** Gemini 3.1 Pro com `responseMimeType: 'application/json'` pode truncar prematuramente. Remover e confiar no prompt para formato. `maxOutputTokens` mínimo 8192 para responses JSON estruturados.
**Status:** ✅ Corrigido (2026-03-22).

### ERRO-052 · HIGH · cirrose.css + archetypes.css
**vw em clamp() causa overflow em viewports >1280px com deck.js scaleDeck()**
**Root cause:** `scaleDeck()` aplica `transform: scale(s)` onde `s = Math.min(innerWidth/1280, innerHeight/720)`. Isso é visual — CSS layout calcula com o viewport real. `clamp(min, Xvw, max)` onde `X*12.8` está entre min e max faz fontes crescerem em viewports maiores (ex: 1920x1080), estourando o container 1280x720 do slide. s-a1-classify tinha PREDESCI `clamp(64px, 6vw, 100px)` = 76.8px@1280 mas 100px@1920 = overflow + clipping.
**Fix:** 36 clamp() com vw ativo substituídos por px fixo calculado em 1280px. cirrose.css (29) + archetypes.css (7). 4 clamp() dead code (vw >= max em 1280) preservados. :root tokens em base.css não tocados.
**Regra:** Em deck.js com scaleDeck(), NUNCA usar vw/vh em font-size de slides. Usar px fixo. vw referencia viewport real, não container escalado.
**Status:** ✅ Corrigido (2026-03-22).

### ERRO-053 · CRITICAL · processo (QA pipeline)
**Pipeline QA inteiro ignorado — 8 memorias de feedback violadas em 1 sessao**
**Root cause:** Ao receber pedido "rode ciclo QA nos 3 slides", interpretei como "executar script Gemini 3x" em vez de seguir o pipeline de 6 gates documentado em WT-OPERATING.md §4. Nao li o documento operacional. Nao consultei memorias de feedback. Executei no modo "fazer rapido".
**Violacoes:** (1) Gemini com PNGs stale (pre-mudanca), (2) 3 calls paralelas → ECONNRESET em 2/3, (3) zero Gates 1-2 antes do Gemini, (4) zero checkpoints com usuario, (5) batch em vez de slide-a-slide, (6) sem screenshots 1920x1080, (7) sem video, (8) sem reflexao pre-execucao.
**Fix:** Memoria feedback_qa_never_skip_pipeline.md criada. Pipeline slide-a-slide com checkpoints entre CADA gate.
**Regra:** "Rodar QA" = apresentar plano dos gates ANTES de executar. NUNCA atalhar pipeline. NUNCA batch Gemini.
**Status:** ✅ Fechado (processo). Regra de pipeline QA criada. Won't-fix — não há código a corrigir. Fechado Ciclo 5.

### ERRO-054 · HIGH · s-a1-01 (GSAP vs CSS race condition)
**Match punch animation quebrada: CSS classes nao sobrescrevem GSAP inline styles**
**Root cause:** GSAP stagger entry seta `opacity:1` e `transform` inline (max specificity). CSS `.matched` e `.dimmed` tentam aplicar `opacity:0.65` e `transform:scale(0.98)` mas perdem para inline. Gemini QA3-R1 detectou (Motion 4/10, Craft 4/10).
**Fix:** Mover opacity/transform/x/scale para GSAP timeline no slide-registry.js. CSS mantem apenas bg/border/filter (paint properties).
**Regra:** GSAP controla layout props (opacity, transform). CSS controla paint props (background, border, filter). NUNCA competir.
**Status:** ✅ Corrigido (2026-03-23). slide-registry.js + cirrose.css atualizados.

### ERRO-055 · MEDIUM · global (source-tag vs case-panel)
**Source-tag sobreposta pelo case-panel em slides com panel ativo**
**Root cause:** `.case-panel` e position:absolute right:16px width:180px z-index:20. Source-tags com max-width:90% podem fluir por baixo do panel. s-a1-01 (grid layout) tinha source-tag com right:0 ignorando padding.
**Fix:** (1) Global: `#deck.has-panel .source-tag { max-width: calc(100% - 220px) }`. (2) Defensivo: `.stage-c .source-tag { grid-column: 1 / -1 }`. (3) Local s-a1-01: `right: 210px; max-width: none`.
**Regra:** Todo componente que flui ate a borda direita DEVE respeitar clearance do case-panel (220px). Usar `#deck.has-panel` como seletor.
**Status:** ✅ Corrigido (2026-03-23).

### ERRO-056 · MEDIUM · processo (Playwright MCP + deck.js)
**Playwright MCP browser_press_key nao navega deck.js**
**Root cause:** deck.js escuta `keydown` no `document`. Playwright MCP envia keyboard events mas deck.js nao recebe — provavel falta de focus no page. Hash navigation (#slide-id, #/N) tambem nao funciona (deck.js usa transform, nao scroll). `scrollIntoView()` nao navega slides.
**Workaround:** Usar Playwright Node script standalone com `page.locator().click()` + `page.keyboard.press()` em loop, verificando `.slide-active` a cada step.
**Regra:** Para screenshots de slides especificos, usar script Node standalone (nao Playwright MCP). Verificar `.slide-active` apos cada navegacao.
**Status:** ✅ Fechado (workaround). Playwright MCP não suporta deck.js. Node script standalone documentado como solução permanente. Fechado Ciclo 5.

### ERRO-057 · HIGH · global (CSS import order)
**Cascata CSS invertida: base → cirrose → archetypes (deveria ser base → archetypes → cirrose)**
**Root cause:** `index.template.html` importava CSS na ordem `base.css → cirrose.css → archetypes.css`. Archetypes (genérico) vinha DEPOIS de cirrose (específico), vencendo na cascata em seletores de mesma specificity. `.slide-headline` em archetypes.css:48 sobrescrevia cirrose.css:28. Documentação (CLAUDE.md cirrose) já dizia a ordem correta, mas o código não batia.
**Fix:** Trocada ordem para `base → archetypes → cirrose`. Comment de archetypes.css atualizado.
**Regra derivada:** E57 → validate-css.sh Check 1 verifica import order automaticamente.
**Status:** ✅ Corrigido (2026-03-24).

### ERRO-058 · LOW · cirrose.css (duplicate selector)
**`.stage-bad .source-tag` definido 2x em cirrose.css (linhas 96 e 102)**
**Root cause:** Propriedades diferentes (color vs opacity) no mesmo seletor, em blocos separados.
**Fix:** Unificados num único bloco com ambas propriedades.
**Status:** ✅ Corrigido (2026-03-24).

---

## Erros registrados — sessão QA visual s-a1-01 (2026-03-25)

### ERRO-059 · HIGH · s-a1-01 (ghost rows)
**Ghost rows com fundo rosada/bege em vez de cinza neutro**
**Root cause:** (1) `.stack-row` usava `background: transparent`, herdando o Stage-C surface warm cream (hue 258). (2) `.stack-row.matched` usava `var(--safe-light)` que computa hue 25 (salmon) por bug `color-mix(in oklch)`: endpoint acromático tem hue=0, browser interpola 15%×170 + 85%×0 = 25.5.
**Fix:** Ambos trocados para `background: oklch(96% 0 0)` (cinza neutro, zero chroma).
**Regra:** `color-mix()` com endpoint acromático interpola hue → nunca confiar em `var(--safe-light)` para backgrounds neutros.
**Status:** ✅ Corrigido (2026-03-25).

### ERRO-060 · HIGH · s-a1-01 (source-tag)
**Source-tag com contraste insuficiente para projeção (~3.9:1 vs requisito ≥7:1)**
**Root cause:** GSAP (slide-registry.js:174) setava `opacity: 0.6` inline. CSS color oklch(25% 0.01 258) a 60% opacity sobre bg oklch(97%) → contraste efetivo ~3.9:1.
**Fix:** GSAP opacity mudado de 0.6 → 1. Font-size de 0.85rem → clamp(16px, 1.1vw, 20px). PMIDs removidos do texto visivel (mantidos em notes).
**Regra:** GSAP opacity em texto projetado NUNCA < 0.85. Verificar contraste efetivo (cor × opacity × bg).
**Status:** ✅ Corrigido (2026-03-25).

### ERRO-061 · MEDIUM · s-a1-01 (clipping ghost rows)
**Matched ghost rows clipadas 4px na borda direita**
**Root cause:** `.guideline-stack` com `overflow: hidden` + GSAP match punch `x: 4` empurra matched rows 4px pra fora. Stack right=830, matched rows right=834 → 4px clipados. `.guideline-rec` pai já tinha `overflow: hidden` com padding suficiente (24px right).
**Fix:** (1) Removido `overflow: hidden` de `.guideline-stack`. (2) Adicionado `padding: 0 var(--space-md) 0 var(--space-xl)` ao `.guideline-rec`.
**Regra:** Containers com overflow:hidden duplo (pai+filho) → verificar se animações GSAP com translate/x violam o container interno.
**Status:** ✅ Corrigido (2026-03-25).

### ERRO-062 · HIGH · s-a1-baveno (return visits)
**SplitText não anima, tudo aparece de uma vez, estado inconsistente no retorno**
**Root cause:** ctx.revert() é cleanup insuficiente: (1) advance/retreat criam orphan tweens fora do gsap.context → não revertidos; (2) inline styles HTML (style="opacity:0" em predesci/sourceTag) não restaurados; (3) SplitText char divs potencialmente persistentes após revert incompleto.
**Fix:** Defensive reset no início da factory: killTweensOf nos 5 elementos, nuke de char divs residuais via textContent=textContent, gsap.set explícito para predesci/sourceTag opacity:0, display:'' no oldTerm.
**Regra:** Custom animations com advance/retreat (orphan tweens) DEVEM ter reset defensivo no início da factory. Nunca depender apenas de ctx.revert() para inline styles pré-existentes.
**Status:** ✅ Corrigido (2026-03-26).

---

*Ultima atualizacao: 2026-03-26 · 62 erros registrados, 62 fechados (59 corrigidos, 2 processo, 1 workaround), 0 pendentes.*

---

## Resumo final

| Severidade | Total | Corrigidos | Pendentes |
|------------|-------|------------|-----------|
| CRITICAL   | 8     | 8          | 0 |
| HIGH       | 30    | 30         | 0 |
| MEDIUM     | 18    | 18         | 0 |
| LOW        | 3     | 3          | 0 |
| SHOULD     | 2     | 2          | 0 |
| **Total**  | **61**| **61**     | **0** |

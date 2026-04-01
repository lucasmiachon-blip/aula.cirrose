# ERROR LOG — Cirrose

> Atualizar a cada sessão. Cada erro vira regra que previne repetição.
> **Path:** `aulas/cirrose/ERROR-LOG.md` · Referência: `CHANGELOG.md`
> **Detalhes completos:** `git log -- aulas/cirrose/ERROR-LOG.md` (517L → compactado 2026-03-27)

---

## Formato

```
[ERRO-NNN] Severidade | Slide | Descrição | Root cause | Regra derivada
```

Severidades: CRITICAL (bloqueia projeção), HIGH (prejudica leitura), MEDIUM (estética), LOW (cosmético)

---

## Erros resolvidos — compacto (ERRO-001 a ERRO-052)

> Regras derivadas codificadas em `.claude/rules/slide-rules.md` §8.
> Detalhes de cada erro: `git show cf15437:aulas/cirrose/ERROR-LOG.md` (versão pré-compactação).

| ID | Sev | Slide | Descrição | Regra derivada |
|----|-----|-------|-----------|----------------|
| 001 | CRIT | s-hook | Contraste insuficiente em stage-c | Testar em ambos os temas |
| 002 | HIGH | s-hook | Emoji em contexto profissional | Zero emojis em slides |
| 003 | HIGH | s-hook | Referências de lab ilegíveis | Lab refs >= 0.8rem, cor contrastante |
| 004 | HIGH | s-hook | Layout piramidal dos labs (4+1) | Grid repeat(5, 1fr) |
| 005 | MED | s-hook | Cold open cinematográfico | Dados no slide; contexto em notes |
| 006 | MED | s-hook | Framework overproduced | Slide material vs note material |
| 007 | HIGH | s-hook | Fill ratio < 10% | Beat mínimo 25% canvas |
| 008 | MED | s-hook | Case panel duplica info | Ocultar panel quando slide mostra dados expandidos |
| 009 | CRIT | s-hook | Texto ilegível — dark on navy | Cor literal em bg escuro forçado |
| 010 | HIGH | s-hook | Animações sem retorno | Navegação bidirecional quando >1 estado |
| 011 | MED | s-hook | "Texto desce" ArrowDown | Remover ArrowDown da interceptação |
| 012 | LOW | qa-scripts | PNG captura estado intermediário | Delay >= 1.5s para animações |
| 013 | MED | s-hook | Texto descentralizado | place-content: center |
| 014 | MED | s-hook | Sombra antes da animação | opacity:0 visibility:hidden até GSAP |
| 015 | HIGH | s-hook | Transição inconsistente no retreat | overwrite: 'auto', lógica simples |
| 016 | CRIT | init | Interação sumiu | wireAll() ANTES de connect() |
| 017 | HIGH | preview | Beat 0/1 mesmo estado | Estado via DOM local após init |
| 018 | HIGH | s-a1-cpt | pathway-track display:block | Re-declarar layout em contexto de archetype novo |
| 019 | CRIT | panel global | Headline cortada pelo panel | has-panel reduz cap, não calc |
| 020 | HIGH | s-a1-cpt | Scrollbar em scores-era-track | overflow-y: hidden em slides |
| 021 | HIGH | s-a1-cpt | grid-template-rows seletor sem espaço | CSS descendente = ESPAÇO (A B ≠ A.B) |
| 022 | HIGH | s-a1-vote | Interação nunca testada em browser | Screenshot cada estado antes de commit |
| 023 | MED | múltiplos | CSS failsafe não testado | .no-js/.stage-bad failsafe obrigatório |
| 024 | MED | múltiplos | Notas stale após correção | Limpar warnings associados ao corrigir bug |
| 025 | HIGH | evidence | PMIDs errados Tier 1 (ANSWER, CONFIRM) | grep ALL occurrences de PMID |
| 026 | HIGH | narrative | NSBB prevenção 1ª como hero de 2ª | Verificar POPULAÇÃO do trial |
| 027 | MED | evidence-db | Ioannou PMID ambíguo HCC | Explicitar incidência vs sobrevida |
| 028 | CRIT | s-a2-01 | PMID errado projetado (CANDIDATE) | Verificar cada PMID contra evidence-db |
| 029 | HIGH | s-a2-09 | [TBD SOURCE] visível em source-tag | [TBD] permitido só em notes |
| 030 | MED | s-a1-meld | Emoji unicode em slide | Zero emojis (reincidência ERRO-002) |
| 031 | LOW | s-title | data-background-color com var() | HEX literal no atributo |
| 032 | HIGH | s-a1-cpt | Pathway stages sem cor semântica | Re-declarar cor em archetype novo |
| 033 | HIGH | s-a1-vote | 3 bugs interação (click/retreat/leave) | stopPropagation + retreat DOM + reset leave |
| 034 | CRIT | s-title | bg light + AI marker + brasão invertido | CSS bg-color, não data-background-color |
| 035 | HIGH | s-a1-01 | screening-pathway wrap 2 linhas | flex-wrap: nowrap + min-width: 0 |
| 036 | MED | s-title | h1 specificity perdida (38px) | ID anchor #deck para vencer cascata |
| 037 | HIGH | s-title | Pillar dots invisíveis stage-c | Tokens *-light NUNCA foreground em stage-c |
| 038 | SHOULD | deck.js | Click handlers propagam ao nav | stopPropagation() em slides |
| 039 | SHOULD | deck.js | data-background-color não funciona | CSS background-color, não atributo |
| 040 | HIGH | s-hook | Labs grid clipping sem border-box | box-sizing: border-box com width:100%+padding |
| 041 | HIGH | s-hook | Punchline/question sobrepostos | position: absolute para overlays, não grid |
| 042 | HIGH | QA pipeline | Gemini recebeu código stale | Ler arquivos no momento do envio (E42) |
| 043 | HIGH | s-hook | Surface treatment perdido | Layout ≠ surface (dimensões ortogonais) |
| 044 | HIGH | s-hook | Overlay blackout fraco (35%) | alpha >= 0.65 para blackout (E44) |
| 045 | MED | s-a1-01 | Source-tag truncada @1920 | Testar em ambas resoluções (E45) |
| 046 | HIGH | s-a1-01 | GSAP race com case-panel.js | Nunca GSAP em elemento de outro sistema |
| 047 | CRIT | infra | Bun segfault após 11h | Restart preventivo, browser_close |
| 048 | HIGH | classify | Gemini pipeline — 1 PNG em vez de 4 | 1 PNG por estado + vídeo |
| 049 | MED | classify | Gemini remove elementos aprovados | Filtrar propostas vs decisões travadas |
| 050 | MED | Gate 0 | S0 capture mid-animation | Layouts estabilizados para Gate 0 |
| 051 | MED | gemini-qa3 | maxOutputTokens truncamento | min 8192, remover responseMimeType |
| 052 | HIGH | CSS global | vw em clamp() + scaleDeck() overflow | px fixo, nunca vw/vh em deck.js (E52) |

---

## Erros recentes — detalhado (ERRO-053 a ERRO-062)

### ERRO-053 · CRITICAL · processo (QA pipeline)
**Pipeline QA inteiro ignorado — 8 memórias de feedback violadas em 1 sessão**
**Root cause:** Ao receber pedido "rode ciclo QA nos 3 slides", interpretei como "executar script Gemini 3x" em vez de seguir o pipeline de 6 gates documentado em WT-OPERATING.md §4.
**Regra:** "Rodar QA" = apresentar plano dos gates ANTES de executar. NUNCA atalhar pipeline. NUNCA batch Gemini.
**Status:** ✅ Fechado (processo).

### ERRO-054 · HIGH · s-a1-01 (GSAP vs CSS race condition)
**Match punch animation quebrada: CSS classes não sobrescrevem GSAP inline styles**
**Root cause:** GSAP stagger entry seta opacity:1 e transform inline (max specificity). CSS .matched/.dimmed perdem.
**Regra:** GSAP controla layout props (opacity, transform). CSS controla paint props (bg, border, filter). NUNCA competir.
**Status:** ✅ Corrigido (2026-03-23).

### ERRO-055 · MEDIUM · global (source-tag vs case-panel)
**Source-tag sobreposta pelo case-panel em slides com panel ativo**
**Root cause:** .case-panel position:absolute right:16px width:180px z-index:20. Source-tags com max-width:90% fluem por baixo.
**Regra:** Componente que flui até borda direita DEVE respeitar clearance do case-panel (220px). Usar #deck.has-panel.
**Status:** ✅ Corrigido (2026-03-23).

### ERRO-056 · MEDIUM · processo (Playwright MCP + deck.js)
**Playwright MCP browser_press_key não navega deck.js**
**Root cause:** deck.js escuta keydown no document. Playwright MCP envia events mas deck.js não recebe (falta de focus). Hash nav também não funciona.
**Regra:** Para screenshots de slides específicos, usar script Node standalone (não Playwright MCP).
**Status:** ✅ Fechado (workaround permanente).

### ERRO-057 · HIGH · global (CSS import order)
**Cascata CSS invertida: base → cirrose → archetypes (deveria ser base → archetypes → cirrose)**
**Root cause:** index.template.html importava CSS na ordem errada. Archetypes vencia cirrose na cascata.
**Regra derivada:** E57 → validate-css.sh Check 1 verifica import order automaticamente.
**Status:** ✅ Corrigido (2026-03-24).

### ERRO-058 · LOW · cirrose.css (duplicate selector)
**.stage-bad .source-tag definido 2x (linhas 96 e 102)**
**Root cause:** Propriedades diferentes no mesmo seletor, em blocos separados.
**Status:** ✅ Corrigido (2026-03-24).

### ERRO-059 · HIGH · s-a1-01 (ghost rows)
**Ghost rows com fundo rosada/bege em vez de cinza neutro**
**Root cause:** color-mix(in oklch) com endpoint acromático (hue=0) interpola salmon em vez de teal.
**Regra:** color-mix() com endpoint acromático interpola hue → nunca confiar em var(--safe-light) para backgrounds neutros.
**Status:** ✅ Corrigido (2026-03-25).

### ERRO-060 · HIGH · s-a1-01 (source-tag)
**Source-tag contraste insuficiente (~3.9:1 vs ≥7:1)**
**Root cause:** GSAP opacity 0.6 inline. CSS color oklch(25%) a 60% opacity → contraste efetivo 3.9:1.
**Regra:** GSAP opacity em texto projetado NUNCA < 0.85. Verificar contraste efetivo (cor × opacity × bg).
**Status:** ✅ Corrigido (2026-03-25).

### ERRO-061 · MEDIUM · s-a1-01 (clipping ghost rows)
**Matched ghost rows clipadas 4px na borda direita**
**Root cause:** .guideline-stack overflow:hidden + GSAP match punch x:4 empurra rows para fora.
**Regra:** Containers com overflow:hidden duplo (pai+filho) → verificar se GSAP translate viola container interno.
**Status:** ✅ Corrigido (2026-03-25).

### ERRO-062 · HIGH · s-a1-baveno (return visits)
**SplitText não anima no retorno, tudo aparece de uma vez**
**Root cause:** ctx.revert() insuficiente: orphan tweens fora do gsap.context, inline styles HTML não restaurados, char divs persistentes.
**Regra:** Custom animations com advance/retreat DEVEM ter reset defensivo no início da factory. Nunca depender só de ctx.revert() para inline styles.
**Status:** ✅ Corrigido (2026-03-26).

### ERRO-063 · MEDIUM · global (hardcoded shadow colors)
**Shadow/border usa `oklch(0% 0 0 / N)` literal quando tokens `--shadow-subtle`/`--shadow-soft`/`--overlay-border` existem em base.css**
**Root cause:** Tokens criados depois dos slides. Slides nunca migrados.
**Regra:** Shadows e borders transparentes DEVEM usar `var(--shadow-subtle)` (0.04), `var(--shadow-soft)` (0.06) ou `var(--overlay-border)` (0.08). Grep: `oklch(0% 0 0` em cirrose.css.
**Status:** ✅ Corrigido em s-a1-fib4 (2026-03-29). Sistemico: ~20 instancias restantes (batch futuro).

### ERRO-064 · MEDIUM · s-a1-fib4 (missing daltonism icons)
**Cores semanticas (safe/danger/warning) sem icone de reforco para daltonismo**
**Root cause:** Design-reference exige icones (✓/✕/⚠) mas slide foi criado sem eles.
**Regra:** Todo elemento com cor semantica clinica DEVE ter icone de reforco adjacente. Ref: design-reference.md "Reforco icone obrigatorio".
**Status:** ✅ Corrigido (2026-03-29). Adicionados ✓ VPN, ✕ VPP, ⚠ zona indeterminada.

---

### ERRO-065 · HIGH · global (FOUC — Flash of Unstyled Content)
**Animacao de estado final aparece por poucos ms antes do slide estabilizar**
**Root cause:** `animate()` rodava em `slide:entered` (400ms apos `slide:changed`). Durante o fade-in, elementos ficavam no estado CSS default (visivel). GSAP `set()` so escondia apos 400ms — flash perceptivel.
**Root cause 2:** `transitionend` de filhos (CSS transitions em .rule-zone, .elasto-card etc) fazia bubble ate `<section>`, disparando `slide:entered` prematuramente.
**Root cause 3:** `cleanup()` (ctx.revert) rodava imediatamente em `slide:changed`, resetando GSAP do slide anterior durante o fade-out — snap visivel.
**Fixes (3):**
1. deck.js: `if (evt.target !== currentSlide) return` no transitionend listener
2. engine.js: `animate()` roda em `slide:changed` (imediato, nao `slide:entered`). Delays GSAP (0.3-0.4s) alinham com transicao CSS 400ms.
3. engine.js: cleanup atrasado 450ms com protecao contra re-entrada (captura contexto no momento da navegacao).
4. CSS: `.fib4-spectrum` e `.elasto-confounders` recebem `opacity: 0` base. GSAP revela. Failsafes .no-js/.stage-bad preservados.
**Regra:** Containers animados DEVEM ter `opacity: 0` no CSS base. GSAP revela com `set(container, { opacity: 1 })`. `animate()` DEVE rodar no primeiro evento de navegacao, nao apos transicao.
**Status:** ✅ Corrigido (2026-03-30). Afeta TODOS os slides com custom animations.

### ERRO-066 · HIGH · global (FOUC intra-slide — era children flash)
**Children de eras stacked ficam visiveis por ~0.45s ao trocar de era (showEra fade-in completa antes de postAnim esconder filhos)**
**Root cause:** `showEra(idx)` faz `gsap.to(era, { autoAlpha: 1 })`. O `onComplete` callback chama `runS*Anims()` que faz `gsap.set(children, { opacity: 0 })` + animacao. Entre autoAlpha atingir ~0.1 e onComplete, filhos ficam visiveis no estado HTML cru — flash perceptivel.
**Root cause 2:** CSS nao tinha `opacity: 0` para filhos de eras S1/S2 (surgery-stats, guideline-cards). Apenas S0 tinha anti-flash.
**Relacao com ERRO-065:** 065 = FOUC cross-slide (slide:entered vs slide:changed). 066 = FOUC intra-slide (era transition children).
**Fixes (3):**
1. CSS: Todos os filhos animados de TODAS as eras recebem `opacity: 0` no CSS base (anti-flash).
2. JS init: `gsap.set()` pre-esconde filhos de eras futuras (S1, S2) no momento do init.
3. JS advance: `gsap.set()` re-esconde filhos ANTES de `showEra()`, nao depois no callback.
**Regra derivada:** §5 slide-rules.md — "Anti-flash intra-slide". TODO filho animado de era stacked DEVE ter `opacity: 0` no CSS + `gsap.set({opacity:0})` no init + re-hide no advance() ANTES do showEra().
**Status:** ✅ Corrigido em s-a1-cpt (2026-03-31). Verificar outros slides com era stacking.

### ERRO-067 · HIGH · processo (Gate 4 cego a motion e cor semantica)
**Gate 4 (Gemini) e Gate 2 (Opus) falham em avaliar: (a) video/motion design, (b) hierarquia de cor semantica clinica**
**Root cause:** Prompt Gate 4 envia video .webm mas nao instrui Gemini a analisar motion (timing, flash, stagger, easing). Prompt inclui tabela de cores mas sem criterios de avaliacao (e.g., --danger so para risco clinico real, progressao safe→warning→danger). Opus (Gate 2) tambem nao flaggou --danger no ceiling (flaw, nao perigo clinico).
**Root cause 2:** Sem criterio explicito, ambos os modelos tratam cor como decoracao, nao como linguagem clinica.
**Fixes:**
1. Gate 4 prompt: adicionar secao explicita de avaliacao de motion design (timing, flash, stagger quality, era transitions).
2. Gate 4 prompt: adicionar criterios de avaliacao de cor semantica (--danger = intervir agora, --warning = investigar, NUNCA misturar).
3. Gate 2 protocolo: adicionar verificacao de cor semantica como MUST check.
**Regra derivada:** Prompts QA DEVEM incluir criterios explicitos de avaliacao para motion e cor semantica. Modelo sem criterio = modelo cego.
**Status:** RESOLVIDO — Gate 4 v3.0 (3 chamadas paralelas) separa atencao visual/code/motion. Cor semantica agora avaliada isoladamente na Call A.

### ERRO-068 · HIGH · processo (Gate 4 atencao diluida — chamada unica)
**Gate 4 v1/v2 usava chamada unica com codigo+PNGs+video. Modelo focava no codigo (nota 10/10) e dava nota de cortesia para visual (9.3/10 quando era 2.7/10 real).**
**Root cause:** Atencao do LLM e finita. Codigo estruturado (CSS, HTML, JS) domina a atencao vs imagens/video. Gemini Pro com prompt visual-puro deu 2.7/10 para o mesmo slide que recebeu 9.3 com codigo junto. Lucas identificou: "front end e UI UX design muito ruins em classificar".
**Root cause 2:** Prompt unico pedia avaliacao de 15+ dimensoes (visual + CSS + failsafes + motion) num so output. Modelo priorizava o que sabia responder bem (CSS cascade) e inflava o resto.
**Fix:** Gate 4 v3.0 — 3 chamadas paralelas via Promise.all:
- Call A (visual): PNGs + video, ZERO codigo. Foco exclusivo em distribuicao, proporcao, cor, tipografia, composicao.
- Call B (UX+code): PNGs + raw HTML/CSS/JS, SEM video. Gestalt, carga cognitiva, information design, cascade, failsafes.
- Call C (motion): PNGs + video + animation JS. Timing, easing, narrativa, crossfade, artefatos.
**Resultado:** Visual caiu de 9.3 → 4.6/10 (honesto). UX+Code 8.4/10. Custo ~$0.10/slide (antes ~$0.07).
**Regra derivada:** NUNCA avaliar visual design e craft de codigo na mesma chamada LLM. Atencao finita = misturar inputs = inflar notas.
**Status:** RESOLVIDO — Gate 4 v3.0 em producao.

### ERRO-069 · HIGH · processo (Gate 4 Call C motion inflado — 9-10/10 irreal)
**Call C (motion) deu 10/10 (R9) e 9/10 (R10) para animacoes que nao sao de nivel profissional. Anti-sycophancy superficial nao resolve.**
**Root cause:** Gemini Pro nao tem baseline de motion design profissional. Nao conhece os 12 principios de animacao (Disney), nao distingue stagger mecanico de organico, nao avalia anticipation/follow-through/secondary action. O prompt diz "seja duro" mas nao define O QUE e "bom" em motion.
**Root cause 2:** Criterios atuais (timing 300-800ms, easing power2.out) sao necessarios mas insuficientes. Verificam correcao tecnica, nao qualidade artistica. Um stagger com timing correto e easing correto pode ser completamente mecanico e sem narrativa.
**Root cause 3:** Inventario de timestamps (prova de visualizacao) prova que o modelo VIU as transicoes, mas nao que AVALIOU a qualidade. "Vi fade de 400ms sem artefato" ≠ "a animacao e boa".
**Fixes pendentes:**
1. Prompt Call C: adicionar criterios de motion design profissional (12 principios, anticipation, follow-through, secondary action, staging focal)
2. Prompt Call C: adicionar exemplos concretos de penalizacao (stagger uniforme = mecanico → max 7, countUp sem pausa dramatica → max 6)
3. Prompt Call C: definir ceiling por tipo (apresentacao medica com GSAP realista = 6-8 se bem feita, 9 = excepcional com narrativa cinematografica)
4. Considerar: video de referencia (WWDC/TED) como benchmark visual ou descricao textual de benchmark
**Regra derivada:** Anti-sycophancy sem criterios profissionais = inutil. "Seja duro" sem definir "bom" = notas arbitrarias. Prompt DEVE incluir rubrica com ceiling e exemplos de penalizacao.
**Status:** PENDENTE — prompt Call C a ser enriquecido.
**Relacao com ERRO-067/068:** 067 = cego a motion. 068 = atencao diluida (fix: 3 calls). 069 = motion isolado mas sem criterio profissional.

### ERRO-070 · MEDIUM · CSS (specificity loss — slide-inner override ignorado)
**`#s-cp1 .slide-inner` (1-1-0) perdia para `#slide-viewport > section .slide-inner` (1-1-1). Grid layout nunca aplicava — flex do base vencia. Strip ficava left-aligned.**
**Root cause:** Seletor com ID+class tem especificidade menor que ID+element+class. Contagem: ids iguais, classes iguais, mas base tem 1 element type a mais.
**Fix:** Nao lutar contra o base. Seguir padrao de `.slide-title`: herdar flex do base, adicionar apenas `align-items: center; text-align: center`. Nao sobrescrever `display`.
**Regra derivada:** Para slides com layout custom, NUNCA sobrescrever `display` do `.slide-inner`. Adicionar propriedades ao flex existente (como `.slide-title` faz).
**Status:** CORRIGIDO — s-cp1 usa padrao s-title.

### ERRO-071 · MEDIUM · CSS (stage-c token override — dark tokens viram light)
**`--text-on-dark` em stage-c = `oklch(12%...)` (quase preto). `--bg-navy` em stage-c = `oklch(95%...)` (quase branco). Slide navy fica light-on-light em stage-c.**
**Root cause:** stage-c inverte TODOS os tokens dark para light. Slide cinematic navy precisa re-declarar os valores Plan A em escopo local.
**Fix:** Override de todos `--*-on-dark` + `--bg-navy*` + `--border-navy` no `#s-cp1 .slide-inner`. Color explícita no `h2`.
**Regra derivada:** Slide navy em stage-c DEVE re-declarar TODOS os dark tokens no `.slide-inner`. Nao confiar em heranca de `.slide-navy` class.
**Status:** CORRIGIDO.

### ERRO-072 · LOW · CSS (oklch from syntax — CSS Color 5 incompatibilidade)
**`oklch(from var(--safe) l c h / 0.12)` = CSS Color 5 (relative color syntax). Nao suportado em todos browsers.**
**Fix:** `color-mix(in oklch, var(--token) N%, oklch(97% 0 0))` = CSS Color 4, amplamente suportado.
**Regra derivada:** Usar `color-mix()` (Color 4) em vez de `oklch(from ...)` (Color 5) para derivacoes de cor.
**Status:** CORRIGIDO — mortality bands usam color-mix.

### ERRO-073 · HIGH · CSS (danger root token hue 25° = terracotta, nao vermelho)
**`--danger: oklch(50% 0.18 25)` / `#cc4a3a` = hue 25° OKLCH = laranja-avermelhado. Renderiza como terracotta/coral/tijolo — nao vermelho puro. Todos os 47 usos downstream (color-mix, -light, -on-dark) herdaram o warm shift. `-light` variants (#f4e0dc) viravam bege em vez de rosa-claro.**
**Root cause:** Hue 25° em OKLCH cai na faixa orange-red, nao pure red (0-10°). Chroma 0.18 insuficiente para compensar. Compare: Bootstrap #dc3545 (hue ~1°), Tailwind #ef4444 (hue ~0°).
**Agravantes:** (1) Texto dos cards/zones usava --text-primary generico em vez de cor semantica da zona. (2) Backgrounds usavam 15% mix ratio — projetado para badges, nao para cards em projecao a 6m. (3) Cards danger no elasto tinham bg branco identico aos warning.
**Fix:** Token raiz: `oklch(48% 0.21 8)` / `#dc3545`. Propaga automaticamente. Mix ratios escalados (25-40%) nos componentes. Texto das zones usa cor semantica da severidade.
**Regra derivada:** (1) Danger root DEVE ter hue ≤10° e chroma ≥0.20. (2) Backgrounds de severidade em area grande (cards, zones) usam 25-40% color-mix, nao tokens -light (15%). (3) Texto dentro de elementos com cor semantica DEVE usar a cor semantica, nao --text-primary generico.
**Status:** CORRIGIDO — 3 commits (f38b0b8, 9bf5f6f).

### ERRO-074 · HIGH · CSS/JS (hierarquia intra-slide — elementos identicos, punchline invisivel)
**Dentro de um slide state, multiplos elementos recebiam tratamento visual identico (mesma cor + tamanho + peso). Punchline indistinguivel dos elementos de suporte. Viewer nao sabe onde olhar primeiro.**
**Exemplos:** CPT S0: flaw nodes, kappa callout, ceiling result — todos `--downgrade` identico. CPT S1: surgery stats com -light (15% mix) — A/B/C quase iguais. Elasto: icones sem cor explicita (herdavam --text-primary generico). Von Restorff JS com hue 25 hardcoded (terracotta).
**Root cause:** Aplicacao uniforme de tokens sem considerar hierarquia narrativa. O punchline do argumento recebia o mesmo tratamento que labels de suporte.
**Fix:** (1) Ceiling result: downgrade→warning (punchline sobe de nivel). (2) Surgery stats: -light→25-35% color-mix. (3) Icones elasto: cor explicita por severity. (4) Von Restorff hue 25→8.
**Regra derivada:** Dentro de um slide state, o punchline DEVE ter tratamento visual superior aos elementos de suporte. Mesma cor semantica e aceitavel entre suportes, mas o elemento culminante precisa de cor elevada, tamanho/peso maior, ou ambos. Icones DEVEM ter cor explicita matching severity — nunca herdar generico.
**Status:** CORRIGIDO.

### ERRO-075 · MEDIUM · CSS (cor semantica redundante em texto de dados — "gold em tudo")
**Quando icone + borda ja carregam o sinal de severidade, tingir o TEXTO dos dados com a mesma cor cria ruido visual, nao informacao. Repeticao em 3+ cards identicos transforma sinal em parede monocromatica. Mesmo problema com elementos de role distinto (label vs evidencia) recebendo tratamento identico (filled bg) dentro da mesma cor semantica.**
**Exemplos:** Elasto S0: 3 warning cards com magnitude amber (+17-21%, PVC, 15 kPa) — 6 elementos amber em 75% do slide. CPT S0: flaw pills (⚠ Ascite, ⚠ EH) e kappa callout (κ ≤ 0,41) todos com bg filled ochre identico.
**Root cause:** Aplicacao maximalista de cor semantica — TODOS os textos de um severity recebem a cor, sem avaliar quais elementos ja carregam o sinal (icone, borda) e quais precisam de legibilidade (dados numericos).
**Fix:** (1) Warning magnitude text: --warning-on-light → --text-primary (dados legíveis, icone+borda carregam sinal). (2) Flaw pills: bg filled → bg-card (outline only), kappa callout mantem filled. Cria 3 tiers: outline (labels) → filled (evidencia) → amber (punchline).
**Regra derivada:** Cor semantica em texto so se justifica quando o texto E o elemento semantico primario (titulo, punchline). Dados numericos, magnitudes e labels de suporte usam --text-primary — o sinal vem de icone + borda + bg, nao do texto. Dentro da mesma cor, diferenciar roles via peso visual (outline vs filled), nao via mais cor.
**Status:** CORRIGIDO.

*Ultima atualizacao: 2026-04-01 · 75 erros registrados, 73 fechados, 2 pendentes.*

---

## Resumo

| Severidade | Total | Corrigidos | Pendentes |
|------------|-------|------------|-----------|
| CRITICAL   | 9     | 9          | 0 |
| HIGH       | 34    | 32         | 2 |
| MEDIUM     | 23    | 23         | 0 |
| LOW        | 4     | 4          | 0 |
| SHOULD     | 2     | 2          | 0 |
| **Total**  | **74**| **72**     | **2** |

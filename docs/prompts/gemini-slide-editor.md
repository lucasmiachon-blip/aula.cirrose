# Gemini Slide Editor — Prompt Template (QA.3)

> Template reutilizavel para review criativo Gemini 3.1 Pro.
> Preencher placeholders `{{...}}` com dados do slide sendo avaliado.
> Raw code DEVE ser extraido dos arquivos no momento do envio (E42).
> Ref: WT-OPERATING.md §QA.3

---

Voce e um profissional senior de front-end, UI/UX e design visual. Eu te contratei para revisar um slide de uma apresentacao projetada em auditorio. Nao quero QA, nao quero lint — quero sua opiniao como quem projeta interfaces e entende hierarquia visual, tipografia para projecao, motion design e comunicacao visual.

---

## CONTEXTO

- **Formato:** Slide de apresentacao projetada (1280x720, projetor, auditorio ~500 pessoas)
- **Tema:** Cirrose Hepatica — congresso medico brasileiro
- **Publico:** Medicos que ja viram milhares de slides de PowerPoint. Precisamos ser melhor que isso.
- **Stack:** HTML/CSS/JS vanilla. GSAP 3.14 para animacoes. OKLCH color tokens. Offline-first.
- **Theme:** Light — fundo creme claro (oklch 95%), texto escuro (oklch ~12%)
- **Tipografia:** Instrument Serif (display), DM Sans (corpo), JetBrains Mono (dados)
- **Navegacao:** ArrowRight avanca, ArrowLeft recua. Sem hover (projecao, nao web).

---

## HIERARQUIAS VISUAIS — O que guia sua analise

Voce domina estes principios e deve usa-los como lente:

- **Hierarquia tipografica:** tamanho, peso, familia e caso criam ordem de leitura. O que e titulo, o que e suporte, o que e detalhe — a 5 metros de distancia
- **Hierarquia de cor/contraste:** saturacao, lightness e chroma direcionam atencao. Cor semantica (vermelho = alerta) vs cor decorativa
- **Hierarquia espacial:** proximidade (Gestalt), alinhamento, white space intencional vs vazio acidental. Fill ratio adequado ao tipo de slide
- **Hierarquia temporal (motion):** o que aparece primeiro, o que demora, o que corta seco. Stagger, easing, pausa — cada escolha de timing comunica prioridade
- **Hierarquia de informacao:** o que e hero (1 elemento dominante), o que e evidencia de suporte, o que e contexto periferico. Von Restorff — o diferente atrai

Use estas hierarquias para avaliar se o slide **direciona o olho** ou **compete consigo mesmo**.

---

## SLIDE SENDO AVALIADO

{{SLIDE_NAME}} — {{SLIDE_ROLE}}

{{CONTEXT_PARAGRAPH}}

---

## CODIGO ATUAL

### HTML
```html
{{RAW_HTML}}
```

### CSS
```css
{{RAW_CSS}}
```

### JavaScript (GSAP interactions)
```js
{{RAW_JS}}
```

### Fluxo da interacao
{{INTERACTION_FLOW}}

---

## MATERIAL VISUAL

Anexados:
{{ATTACHMENTS_DESCRIPTION}}

---

## O QUE QUERO DE VOCE

Liberdade total. Use sua expertise em UI/UX e design visual.

**O que funciona** — e qual principio de design sustenta (nao me diga "esta bom" sem explicar o mecanismo).

**O que nao funciona** — e o que voce faria. Seja especifico: se e tamanho, diga quanto. Se e cor, diga qual valor. Se e timing, diga os segundos. Se e layout, mostre a estrutura.

**O que esta faltando** — detalhes de craft que voce ve faltando como profissional. Micro-interacoes, espacamento, typographic details, motion refinements.

Para CADA sugestao:
- **Snippet pronto** (CSS/JS/HTML) quando a mudanca e objetiva
- **Direcao criativa** quando depende de contexto que voce nao tem
- **Ambos** quando quiser

Foco especial:
- Este slide funciona **projetado a 5 metros** ou so funciona na tela do notebook?
- As animacoes **comunicam** (guiam atencao, criam tensao, revelam progressao) ou **decoram**?
- O slide tem **um ponto focal claro** ou varios elementos competem?
- Os **micro-detalhes** (sombras, letter-spacing, easing curves, transitions) estao no nivel profissional?

NAO quero: checklist, PASS/FAIL, elogios sem substancia, sugestoes que sacrifiquem legibilidade.

Responda em portugues (PT-BR). Codigo em ingles. Seja direto.

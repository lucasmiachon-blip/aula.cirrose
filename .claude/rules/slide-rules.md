# Slide Rules — Edição, Identidade, CSS, Motion

> Canônico. Merge de: deck-patterns, slide-editing, slide-identity, css-errors, motion-qa.

---

## 1. Estrutura de Slide

```html
<section id="s-a1-cpt">
  <div class="slide-inner slide-navy">
    <h2>Carvedilol reduz HVPG em 20% vs placebo</h2>
    <div class="evidence" data-animate="stagger">...</div>
  </div>
  <aside class="notes">
    [0:00-0:30] Hook. PAUSA 3s.
    [DATA] Fonte: EASL 2024 | Verificado: 2026-02-13
  </aside>
</section>
```

**Regras estruturais:**
- `<h2>` = asserção clínica (NUNCA rótulo genérico). `<ul>`/`<ol>` PROIBIDOS em slides.
- `<aside class="notes">` obrigatório em TODO `<section>`.
- Background escuro: CSS `.slide-navy` no `.slide-inner` + seletor `#slide-id .slide-inner` no CSS. deck.js NÃO parseia `data-background-color`.
- `<body class="stage-c">` obrigatório. Sem stage class, tokens defaultam para valores root.
- NUNCA inline style com `display`/`visibility`/`opacity` no `<section>` (E07 — fatal).
- Layout vai dentro de `.slide-inner`, NUNCA no `<section>`.
- Dados de paciente (labs, exames, inputs) SOMENTE no sidebar card + calculator. Slide body mostra RESULTADO + DECISÃO CLÍNICA, nunca inputs brutos.

---

## 2. Checklist Pré-Edição (OBRIGATÓRIO)

- [ ] `<h2>` é asserção clínica
- [ ] Sem `<ul>`/`<ol>` no slide
- [ ] `<aside class="notes">` com timing e fontes
- [ ] `<section>` sem `style` com `display` (E07)
- [ ] Tags balanceadas
- [ ] Dados numéricos verificados (ver §Design Reference)
- [ ] Animações via `data-animate`, NUNCA gsap inline
- [ ] Se bg escuro: `.slide-inner` tem `.slide-navy`

**Batch:** Max 5 slides por batch. Declarar → aprovação → executar → preview → commit.
**"Só ajusta X" = escopo é APENAS X (E20, 3x reincidente).**

---

## 3. Animação Declarativa (data-animate)

NUNCA `gsap.to()` inline. Usar atributos declarativos no HTML:

| `data-animate` | Efeito | Extras |
|----------------|--------|--------|
| `countUp` | Número animado (1.5s, power2.out) | `data-target="25"` `data-decimals="1"` |
| `stagger` | Filhos sequenciais (0.5s each) | `data-stagger="0.15"` |
| `drawPath` | SVG stroke progressivo (1.5s) | — |
| `fadeUp` | Fade + translateY (0.8s) | — |
| `highlight` | Von Restorff — destaca linha | `data-highlight-row="3"` |

**CSS failsafe:** `[data-animate] { opacity: 0; } .no-js [data-animate] { opacity: 1; }`

---

## 4. Click-Reveal (substitui Fragments)

```html
<div data-reveal="1">Primeiro</div>
<div data-reveal="2">Segundo</div>
```

- Max 4 reveals por slide (Cowan 4±1). Arrow right avança um. PageDown pula todos.
- Click handlers DENTRO de slides DEVEM usar `stopPropagation()` (E38).
- CSS: `[data-reveal] { opacity: 0; transform: translateY(8px); }` / `.revealed { opacity: 1; transform: none; }`

---

## 5. Eventos deck.js

| Evento | Quando | Usar para |
|--------|--------|-----------|
| `slide:changed` | Imediato ao navegar | Cleanup: `ctx.revert()`, clear timers |
| `slide:entered` | Após transition (+600ms fallback) | Iniciar animações |

- Todos os slides existem no DOM o tempo todo.
- Eventos disparam no `document`.
- `registerCustom` (via `wireAll`) DEVE ser chamado ANTES de `connect()`.
- **Retreat:** restaurar estado DOM explicitamente (`classList.remove`, reset textContent). NUNCA confiar apenas em `killTweensOf` — mata tweens mas não desfaz DOM.
- **Leave/return:** `slide:changed` DEVE resetar classes de estado (`.revealed`, `.dimmed`, `.correct`). Usuário pode sair e voltar a qualquer momento.
- **Anti-flash intra-slide (E66):** Slides com eras stacked (grid-area: stack) — TODO filho animado de era futura DEVE: (1) ter `opacity: 0` no CSS base (anti-flash), (2) `gsap.set({opacity:0})` no init do handler, (3) `gsap.set({opacity:0})` no `advance()` ANTES de `showEra()`. Failsafe `.no-js`/`.stage-bad` via `[class*="prefix-"]` cobre todos.

---

## 6. Modos de Palco

| Classe `<body>` | Uso |
|-----------------|-----|
| `.stage-c` | Plan C (padrão) — light 1280x720, GSAP ativo |
| `.stage-bad` | Plan B — projetor fraco, sem animação |
| (nenhuma) | Plan A (futuro) — dark 1920x1080 |

Outros: `?qa=1` força estado final. `?print-pdf` desabilita animações. `?mode=residencia` mostra apêndices.

---

## 7. Slide ID — 9 Superfícies

Formato: `s-{act}-{slug}` (ex: `s-a1-cpt`, `s-cp1`, `s-app-alb`). ID é IMUTÁVEL após primeiro commit.

| # | Arquivo | Campo |
|---|---------|-------|
| 1 | `aulas/cirrose/slides/_manifest.js` | `id` no objeto |
| 2 | `aulas/cirrose/slides/NN-slug.html` | `<section id="...">` |
| 3 | `aulas/cirrose/slide-registry.js` | chave em `customAnimations` (se tiver) |
| 4 | `aulas/cirrose/cirrose.css` | seletores `#s-xxx` |
| 5 | `aulas/cirrose/references/narrative.md` | tabela do ato |
| 6 | `aulas/cirrose/references/evidence-db.md` | referências |
| 7 | `aulas/cirrose/AUDIT-VISUAL.md` | scorecard |
| 8 | `aulas/cirrose/HANDOFF.md` | menções |
| 9 | `aulas/cirrose/index.html` | GERADO — `npm run build:cirrose`, NUNCA editar |

**RENAME:** Operação de ALTO RISCO. `grep -rn "ID_ANTIGO" aulas/{aula}/` antes. Tocar TODAS as 9 superfícies. Rename de ID e rename de filename = commits separados.
**SPLIT:** Manter slide original como A, criar B com novo ID, atualizar manifest + narrative + contagens.
**DELETE:** Remover de manifest, registry, CSS. Arquivo HTML → `slides/_archive/`. Rebuild.

---

## 8. CSS Errors

> Tabela completa (52 E-codes): `docs/css-error-codes.md`. Top 10 injetados no Gate 4: `docs/prompts/error-digest.md`.

**Regras MUST mais frequentes:** E07 (display inline), E20 (escopo), E26 (flex:1), E38 (stopPropagation), E52 (vw sem clamp).
**AI Markers PROIBIDOS:** Linhas decorativas sob títulos, emojis em slides médicos, gradientes sem função.

---

## 9. Motion QA — Checklist

| Propriedade | Range aceitável |
|-------------|----------------|
| Fade/translate | 300–600ms (ideal 400ms) |
| countUp | 800–1200ms |
| stagger total | ≤ 1.5s para grupo |
| stagger delay | 100–200ms (ideal 150ms) |
| drawPath SVG | 600–1000ms |
| Max duration | ≤ 2s (exceto sequências) |

**Easing:** Entrada `power2.out` ou `power3.out`. PROIBIDO: `bounce`, `elastic`, `back`, `linear` em UI.
**countUp:** APENAS números de impacto (NNT, HR, %, mortalidade).
**Estado final:** opacity 1, transform 0, texto legível, print-pdf correto.

| Tipo slide | Animação esperada |
|------------|-------------------|
| Mortalidade/NNT | countUp lento (1s+), pausa |
| Checkpoint | Reveal sequencial por decisão |
| Dados GRADE | highlight Von Restorff |
| Hero | countUp single number |
| Comparação | stagger lado-a-lado |
| Timeline | drawPath progressivo |

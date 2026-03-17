# deck.js — Navigation + GSAP Patterns

> Canonico para: deck.js (cirrose, metanalise). Speaker notes, click-reveal, data-animate.
> Codigo: `shared/js/deck.js` + `shared/js/engine.js` + `shared/js/click-reveal.js`
> Reveal.js (grade/osteoporose frozen): [reveal-legacy.md](reveal-legacy.md)
> Relacionados: [slide-editing](slide-editing.md) · [motion-qa](motion-qa.md)

---

## Import

```js
import { initDeck } from '../../shared/js/deck.js';
import { initAnimations } from '../../shared/js/engine.js';
```

---

## Estrutura de Slide

```html
<section id="s-a1-damico">
  <div class="slide-inner slide-navy">
    <h2>Carvedilol reduz HVPG em 20% vs placebo</h2>
    <div class="evidence" data-animate="stagger">
      <!-- evidencia visual aqui -->
    </div>
  </div>
  <aside class="notes">
    [0:00-0:30] Hook.
    PAUSA 3s.
    [DATA] Fonte: EASL 2024 | Verificado: 2026-02-13
  </aside>
</section>
```

### Regras
- `<h2>` = assercao clinica (NUNCA rotulo generico)
- `<aside class="notes">` obrigatorio em TODO `<section>`
- NUNCA inline style com `display`/`visibility`/`opacity` no `<section>` (E07)
- `.slide-navy` no `.slide-inner` quando bg escuro
- Background escuro: via CSS `background-color` no seletor `#slide-id .slide-inner` (ver abaixo)

### Background em deck.js

**`data-background-color` NAO funciona em deck.js** (atributo Reveal.js-only, deck.js nao o parseia).

Para bg escuro em deck.js:
```css
/* Em cirrose.css ou aula.css */
#s-a1-damico .slide-inner {
  background-color: var(--bg-navy);
}
```
Adicionar `.slide-navy` no HTML para tokens de texto corretos.

> `data-background-color` pode permanecer no HTML como documentacao/legacy, mas nao tem efeito funcional.

---

## Animacao Declarativa (data-animate)

**NUNCA gsap.to() inline em slide.** Usar atributos declarativos:

```html
<!-- Engine detecta e orquestra via slide:entered -->
<span class="hero-number" data-animate="countUp" data-target="25">0</span>
<div class="cards" data-animate="stagger">...</div>
<svg><path data-animate="drawPath" d="M0,0 L100,50"/></svg>
<div data-animate="fadeUp">...</div>
```

### Tipos disponiveis
| `data-animate` | Efeito | Atributos extras |
|----------------|--------|-----------------|
| `countUp` | Numero animado | `data-target="25"` `data-decimals="1"` (opcional) |
| `stagger` | Filhos entram sequenciais | `data-stagger="0.15"` (opcional) |
| `drawPath` | SVG stroke progressivo | — |
| `fadeUp` | Fade + translate Y | — |
| `highlight` | Von Restorff (destaque seletivo) | `data-highlight-row="3"` |

### Von Restorff Pattern
```html
<table class="tufte" data-animate="highlight" data-highlight-row="3">
  ...
</table>
```
Engine: aplica opacidade 0.4 em todas as linhas exceto a alvo, que recebe scale 1.02 + cor semantica.

### Custom Animations
Registrar em `slide-registry.js` → `customAnimations`:
```js
's-a1-damico': (slide, gsap) => { /* ... */ }
```
Custom animations devem ser registradas (`wireAll`) ANTES do dispatcher conectar (ERRO-016).

---

## Eventos deck.js

| Evento | Quando | Usar para |
|--------|--------|-----------|
| `slide:changed` | Slide muda | Cleanup: `ctx.revert()`, clear timers |
| `slide:entered` | Slide visivel (pos-transicao) | Iniciar animacoes |

> deck.js NAO tem evento `ready`. Animacao inicial via `setTimeout` + dispatch em `initDeck`.
> Todos os slides existem no DOM simultaneamente (sem reciclagem como Reveal.js).

---

## Click-Reveal (Progressive Disclosure)

deck.js usa `data-reveal` + `click-reveal.js` (NAO fragments Reveal.js):

```html
<div data-reveal="1">Aparece no primeiro click</div>
<div data-reveal="2">Aparece no segundo click</div>
```

Click handlers DENTRO de slides devem usar `stopPropagation()` para nao propagar ao nav layer (ERRO-033).

---

## Appendice (modo residencia)

```html
<section class="appendix" data-visibility="hidden">
  <!-- engine.js remove data-visibility ANTES do init quando ?mode=residencia -->
</section>
```

**IMPORTANT:** `hidden` (nao `uncounted`). Em deck.js, o atributo nao tem efeito nativo — `engine.js` o pre-processa removendo-o para residencia.

---

## Speaker Notes — Formato Canonico

```html
<aside class="notes">
  [0:00-0:30] Hook — numero de impacto.
  PAUSA 3s — deixar absorver.
  PERGUNTAR: "Quantos ja viram isso?"
  ENFASE: "Este dado muda a conduta."
  [DATA] Fonte: EASL 2024, Tab.3 | Verificado: 2026-02-13
</aside>
```

---

## PDF Export

deck.js: `?print-pdf` flag detectado por engine.js (desabilita animacoes, forca estado final).

Workflow: `npm run build:{aula} && npm run preview` → abrir `?print-pdf` → Chrome Ctrl+P → Landscape, sem margens, background ON.

> DeckTape com deck.js requer flags manuais (ver skill `export`). PDF export e backlog conhecido.

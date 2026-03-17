# Reveal.js — Legacy Patterns (FROZEN)

> **FROZEN:** Aplica-se APENAS a grade e osteoporose (Reveal.js legacy).
> Cirrose e metanalise usam deck.js → [deck-patterns.md](deck-patterns.md)
> NAO usar estas patterns para novos projetos.

---

## Import

```js
import Reveal from 'reveal.js';
import Notes from 'reveal.js/plugin/notes/notes.esm.js';
import 'reveal.js/dist/reveal.css';
```

---

## Estrutura de Slide

```html
<section data-background-color="#0d1a2d">
  <div class="slide-inner slide-navy">
    <h2>Assercao clinica aqui</h2>
    <div class="evidence">...</div>
  </div>
  <aside class="notes">...</aside>
</section>
```

### Background
HEX literal em `data-background-color` (Reveal parseia JS-side).

---

## Fragments

```html
<p class="fragment fade-up">Primeiro</p>
<p class="fragment fade-up">Segundo</p>
```

Degradacao graciosa: `.no-js .fragment { opacity: 1 }`.

---

## Eventos Reveal.js

| Evento | Quando | Usar para |
|--------|--------|-----------|
| `slidechanged` | Inicio da transicao | Cleanup: `ctx.revert()`, clear timers |
| `slidetransitionend` | Fim da transicao | Iniciar animacoes |
| `ready` | Deck carregou | Animar slide inicial |

### viewDistance Warning
Reveal.js recicla DOM de slides distantes (`viewDistance` config). GSAP nao pode calcular bounding box de elemento com `display:none`. Por isso: animacoes so no `slidetransitionend` (slide ja visivel).

---

## PDF Export (Reveal.js)

Config em engine.js:
```js
pdfSeparateFragments: false,
pdfMaxPagesPerSlide: 1,
showNotes: 'separate-page',
```

Workflow: `npm run build && npm run preview` → abrir `?print-pdf` → Chrome Ctrl+P → Landscape, sem margens, background ON.

Em modo print-pdf, engine desabilita animacoes e forca estado final.

---

## Appendice

```html
<section class="appendix" data-visibility="hidden">
  <!-- hidden = removido do DOM, nao navegavel -->
  <!-- ?mode=residencia remove o atributo ANTES do init -->
</section>
```

`hidden` → remove do DOM, nao navegavel.
`uncounted` → navegavel, so nao conta (funciona apenas no fim do deck).

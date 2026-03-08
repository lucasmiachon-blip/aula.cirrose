# CLAUDE.md — Osteoporose Masterclass

> Contexto Osteoporose. Hierarquia: CLAUDE.md (root) → **este arquivo** (osteoporose-specific).

## Projeto

- **Titulo:** Osteoporose — Diagnostico, Tratamento e Seguimento
- **Slides:** 70/70 (46 main + 25 appendix, migrados)
- **Stack:** Reveal.js 5.x · GSAP 3.12 · Vanilla HTML/CSS/JS · OKLCH design tokens
- **Resolucao:** 1280 x 720 (Plan C) · 1920 x 1080 (Plan A)
- **Offline-first:** Zero CDN. Todos assets locais.

## Arquivos de trabalho

| Arquivo | Papel |
|---------|-------|
| `slides/*.html` | **DEFAULT — editar estes** (70 arquivos, 1 por slide) |
| `slides/_manifest.js` | Source of truth: ordem |
| `index.template.html` | Template com `%%SLIDES%%` placeholder |
| `index.html` | **Gerado** — `npm run build:osteoporose` |
| `osteoporose.css` | Estilos especificos desta aula |
| `archetypes.css` | Layout archetypes |

### Shared (nao alterar sem autorizacao)

| Arquivo | Papel |
|---------|-------|
| `../../shared/css/base.css` | Design system tokens |
| `../../shared/js/engine.js` | GSAP dispatcher + Reveal init |

### Fluxo de edicao

1. Editar `slides/NN.html`
2. `npm run build:osteoporose` (gera `index.html`)
3. `npm run dev:osteoporose` → abrir `/aulas/osteoporose/index.html`

## Slide map

- **Main:** S01-S06, S12-S14, S14b, S17, S19, S22-S26, S28-S31, S32-S33, S35-S44, S45-S50, S99
- **Appendix:** S09-S11, S51-S72

## Documentacao

1. **CLAUDE.md** ← voce esta aqui
2. **HANDOFF.md** — Pendencias e estado
3. **CHANGELOG.md** — Historico (append-only)

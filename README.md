# Aula Cirrose

Apresentação médica interativa sobre cirrose hepática para hepatologistas seniores (Brasil). Slides assertion-evidence com animações GSAP, navegação custom (`deck.js`), offline-first.

## Stack

deck.js (custom navigation) · GSAP 3.14.2 · Vite 6.x · Vanilla HTML/CSS/JS · OKLCH · Zero CDN · Offline-first.

## Projeto

`aulas/cirrose/` — 44 slides, QA visual em andamento.

## Quick Start

```bash
npm install
npm run dev              # Vite hot reload (port 4100)
npm run build:cirrose    # Concatena slides → index.html
npm run preview          # Servir localmente
```

## Lint & QA

```bash
npm run lint:slides         # Assertion-evidence linter
npm run lint:case-sync      # CASE.md ↔ _manifest.js sync
npm run lint:narrative-sync # narrative.md ↔ _manifest.js sync
npm run done:cirrose        # Gate check (build + lint + screenshots)
```

## Setup

```bash
bash scripts/install-hooks.sh   # Instala pre-commit, pre-push, post-merge hooks
```

## Docs

Documentação completa em [`docs/README.md`](docs/README.md). Para agentes AI, ver [`CLAUDE.md`](CLAUDE.md).

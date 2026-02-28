# CHANGELOG — GRADE

> Migração Aulas_core → aulas-magnas. Append-only.

---

## 2026-02-26 — Batch 2: 48 slides restantes

- **Script:** `scripts/migrate-grade-slides.js` — conversão batch Aulas_core → aulas-magnas
- **Slides:** 11.html–58.html (S07, S61, S14, … S42)
- **Manifest:** `_manifest.js` com 58 entradas (ordem _list.txt)
- **Build:** `npm run build:grade` gera index.html com 58 slides

## 2026-02-26 — Batch 1: estrutura + 10 slides

- **Estrutura:** `slides/`, `scripts/`, `grade.css`, `archetypes.css`, `index.template.html`
- **Build:** `build-html.ps1`, `npm run build:grade`
- **Slides:** 01.html–10.html (S01, S02, S05, S06, S03, S09, S36, S08, S11, S10)
- **Assets:** `assets/figures/` copiado de Aulas_core
- **OKLCH:** grade.css sem hex, tokens de base.css
- **package.json:** `build:grade` script

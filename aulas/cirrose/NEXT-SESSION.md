# NEXT-SESSION — s-a1-elasto QA pipeline

> Contexto profundo do slide EM ANDAMENTO. Ler so se for trabalhar neste slide.
> Atualizado: 2026-03-29

---

## Contexto: apreciacao critica do laudo elastografico

Slide criado 29/mar (pesquisa profunda, 12 PMIDs). Bugfix 30/mar (registry, panel, dead CSS).
3 beats: confounders (auto) → MASLD gap (click) → MRE escape (click).

**H2:** "Fibroscan, MRE e outros métodos não invasivos". Sincronizado em 4 superficies. NAO alterar.

---

## Estado atual dos arquivos

| Arquivo | Estado | Detalhes |
|---------|--------|----------|
| `slides/03c-a1-elasto.html` | **ATUALIZADO** | 3 beats. 4 confounders (ALT, pos-prandial, ICC, colestase) + MASLD gap (PPV 90→63%) + MRE escape (AUROC 0,94). |
| `slides/_manifest.js` | OK | clickReveals=2, customAnim='s-a1-elasto', panelState='neutral', timing=120 |
| `slide-registry.js` | **ATUALIZADO** | __hookAdvance pattern. 3 states (0=auto, 1=click, 2=click). GSAP fade/stagger. |
| `cirrose.css` | **ATUALIZADO** | ~190 linhas #s-a1-elasto scoped. Failsafes .no-js/.stage-bad. |
| `references/narrative.md` | OK | Slide 6. Proposito: confounders + MASLD gap + MRE escape. |
| `references/evidence-db.md` | OK | 12 rows (PMIDs verificados 29/mar). |
| `AUDIT-VISUAL.md` | OK | Placeholder (14 dims = —). |
| `qa-screenshots/` | **VAZIO** | Nunca capturado. Pipeline inteiro pendente. |

---

## Issues conhecidos (pre-QA)

1. **Word count ~78 palavras** (limite 30). Distribuido ~26/beat, mas S2 mostra tudo. Precedente: fib4 41 aceito. Decisao Lucas.
2. **Gate 0 C1 FAIL esperado** — word count > 30.
3. **ANIMATION_STATE false positive possivel** — state machine substitui (nao aditiva). Override: `--force-gate4`.
4. **Panel lateral** — 7 campos (AST, ALT, plq, albumin, Bili, INR, fib4=5,91). LSM = '—' (sera preenchido em slide futuro?).

---

## PMIDs verificados (12)

| PMID | Claim | Fonte |
|------|-------|-------|
| 34166721 | ALT flare +1,3-3× LSM | EASL NITs 2021 |
| 38762390 | Pos-prandial +17-21% / Colestase ate 15 kPa | WFUMB 2024 |
| 37908293 | ICC/Fontan mediana 15 kPa | Fontan 2023 |
| 33982942 | MASLD PPV 63% | Pons 2021 |
| 41138818 | ANTICIPATE-NASH 83-95% | Banares IPD 2025 |
| 39165159 | MRE AUROC 0,94 F4 | Chon meta 2024 |
| 29908362 | MRE vs TE F1-F3 | Hsu 2019 |
| 39649032 | Falha TE 3,37% / obeso 5,86% | NHANES |
| 41498616 | SSM Cochrane sens 72,9% @ spec 90% | Cochrane 2026 |
| 40807038 | Esteatose S3 discordancia 38,6% | Losurdo 2025 |

(2 PMIDs adicionais em notes: XL probe cutoff EASL NITs 2021, alcool agudo abstinencia)

---

## QA pipeline (sequencia)

1. `node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide s-a1-elasto --video`
2. `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-elasto --inspect` (Gate 0)
3. Gate 2 conversacional (Opus: sharp + a11y + code + visual)
4. `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-elasto --editorial --round 1` (Gate 4)

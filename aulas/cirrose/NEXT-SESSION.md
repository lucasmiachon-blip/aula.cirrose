# NEXT-SESSION — Proximo trabalho

> Contexto para rehidratacao. Atualizado: 2026-03-31.

---

## Venue — TV Samsung (dados confirmados 2026-03-30)

| Metrica | Valor | Impacto |
|---------|-------|---------|
| TV | Samsung UN55F6400 (2013), 55", Full HD 1920x1080 nativo, 16:9 |
| screen (browser) | 1280x800 — provavelmente scaling/nao-fullscreen. Nativo e 1080p |
| devicePixelRatio | 2.5 (do laptop conectado, nao da TV) |
| Distancia | ~6m |

---

## Mudancas sessao 2 (31/mar)

1. **CSS single-file** — base.css (598 linhas) absorvido em cirrose.css. 4695 linhas, 1 camada, 0 cascata.
2. **FA definido** — 89 U/L (normal, sem colestase). CASE.md + panelStates + s-hook.
3. **GGT+FA no s-hook** — grid 8 labs (3 colunas). GGT 210 alert, FA 89 normal.
4. **Git standalone** — worktree orfa convertida. Repo `lucasmiachon-blip/aula.cirrose`, branch `main`.
5. **Dead CSS mapeado** — ~680 linhas orfas identificadas, nao removidas ainda.

### Sessao anterior (31/mar, sessao 1)
1. archetypes.css + base.css eliminados — CSS single-file (cirrose.css).
2. 33 slides CONTENT removidos → `slides/_archive/`. Manifest 44→11.
3. Source-tag padronizado — left-align, 0.85rem.
4. GGT (210) adicionado a panelStates e CASE.md.

---

## Prioridade 1: Dead CSS cleanup

~680 linhas de CSS orfao dos 33 slides arquivados. Blocos mapeados:

| Bloco | Linhas aprox | Classes |
|-------|-------------|---------|
| Albumin Cards | ~27 | albumin-cards, alb-* |
| SBP Flow | ~24 | sbp-* |
| Decision Tree | ~29 | decision-*, q-* |
| HE Pillars | ~24 | he-pillar* |
| Recompensation | ~28 | recomp-* |
| Etiology Compare | ~24 | etiology-*, etio-* |
| Surveillance | ~39 | surveillance-*, surv-* |
| Checkpoint Variants | ~10 | case-danger, case-hope |
| Poll Interactivity | ~25 | poll-* |
| Baveno Checklist | ~13 | baveno-checklist |
| Close Recap | ~32 | close-* |
| Appendix | ~98 | app-*, app-etio-* |
| Scattered (flow, hero, comparison) | ~280 | flow-*, hero-stat, comparison-* |

Tambem: `.hero-number` duplicada (linha ~491 ativa, linha ~4484 morta).

---

## Prioridade 2: QA remanescente

### s-a1-meld
- Gate 4 R2 5.6. SPLIT decision pendente.
- Research completo: 9 rows, 17 PMIDs.
- Requer: decidir SPLIT, re-screenshot, Gate 4 R3.

### s-cp1
- Breathing slide navy. Centering pendente viewport Lucas.
- Research completo: 4 rows, 11 PMIDs.

---

## Prioridade 3: Act 2 (do zero)

33 slides removidos. Conteudo vive em:
- `references/narrative.md` — arco narrativo, pacing
- `references/evidence-db.md` — trials, PMIDs, NNTs
- `slides/_archive/` — HTML anterior (referencia, nao reusar)

Abordagem: criar 1 slide por vez, QA completo antes do proximo.

---

## Pendencias

| Item | Status |
|------|--------|
| Dead CSS cleanup | Mapeado, ~680 linhas. Nao executado. |
| s-a1-meld SPLIT | Lucas decidir |
| s-cp1 centering | Verificar viewport |
| Gate 4 motion calibration | Prompt precisa criterios profissionais |
| guard-product-files | SUPRIMIDO — re-habilitar apos sprint |

---

## Infra

- **CSS:** single-file cirrose.css (4695 linhas). Sem base.css, sem archetypes.
- **Git:** repo standalone `lucasmiachon-blip/aula.cirrose`, branch `main`.
- **GEMINI_API_KEY:** OK. **PERPLEXITY_API_KEY:** ausente.
- **Sprint mode:** `SPRINT_MODE=1` disponivel para hooks.

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

## Mudancas desta sessao (31/mar)

1. **archetypes.css eliminado** — cascata 3→2 camadas. Conteudo migrado para cirrose.css (componentes standalone, prefixos removidos).
2. **33 slides CONTENT removidos** → `slides/_archive/`. Manifest 44→11. Serao reconstruidos 1-a-1.
3. **Source-tag padronizado** — left-align, 0.85rem, width calc(100%+128px) escapa padding 64px.
4. **GGT (210) e FA ([TBD])** adicionados a panelStates e CASE.md.
5. **archetype-flow removido** de s-a1-cpt e s-a1-rule5.
6. **archetype-hero-stat removido** de s-a1-classify, s-a1-baveno, s-a3-01 (sessao anterior).

---

## Prioridade 1: QA remanescente

### s-a1-meld
- Gate 4 R2 5.6. SPLIT decision pendente.
- Research completo: 9 rows, 17 PMIDs.
- Requer: decidir SPLIT, re-screenshot, Gate 4 R3.

### s-cp1
- Breathing slide navy. Centering pendente viewport Lucas.
- Research completo: 4 rows, 11 PMIDs.

---

## Prioridade 2: Act 2 (do zero)

33 slides removidos. Conteudo vive em:
- `references/narrative.md` — arco narrativo, pacing
- `references/evidence-db.md` — trials, PMIDs, NNTs
- `slides/_archive/` — HTML anterior (referencia, nao reusar)

Abordagem: criar 1 slide por vez, sem archetypes, QA completo antes do proximo.

---

## Pendencias

| Item | Status |
|------|--------|
| FA valor (CASE.md) | Lucas precisa definir |
| s-a1-meld SPLIT | Lucas decidir |
| s-cp1 centering | Verificar viewport |
| Gate 4 motion calibration | Prompt precisa criterios profissionais |
| guard-product-files | SUPRIMIDO — re-habilitar apos sprint |

---

## Infra

- **Cascata CSS:** base.css → cirrose.css (2 camadas). Sem archetypes.
- **GEMINI_API_KEY:** OK. **PERPLEXITY_API_KEY:** ausente.
- **Sprint mode:** `SPRINT_MODE=1` disponivel para hooks.

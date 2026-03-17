# QA Screenshots — Cirrose

## Estrutura atual

| Pasta | Conteudo |
|-------|----------|
| `browser-qa/` | Screenshots manuais via browser |
| `act1-reaudit/` | Re-auditoria Act 1 |
| `first5/` | Primeiros 5 slides (baseline) |
| `first5-postfix/` | Primeiros 5 slides (pos-fix) |
| `s-title/`, `s-hook/`, `s-a1-*`, `s-cp1/` | Per-slide QA (Act 1) |

Flat PNGs na raiz (`s-hook-s0.png`, `s-title.png`, etc.) sao capturas avulsas.

## Captura

Script: `scripts/qa-batch-screenshot.mjs`
Requer `npm run dev` (port 3000).

> **Nota historica:** Batches anteriores usavam `stage-a/`, `stage-b/`, `stage-c/` como subdirs.
> Estrutura atual migrou para per-slide folders.

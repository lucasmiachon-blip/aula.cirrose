# QA Screenshots — Cirrose

## Estrutura

| Pasta | Conteúdo |
|-------|----------|
| `stage-a` | Plan A (dark, 1920×1080) |
| `stage-b` | Plan B (light, 1280×720, sem animação) |
| `stage-c` | Plan C (light, 1280×720, com animações) |

## stage-c/ — batch atual: hook (5 transições)

```
aulas/cirrose/qa-screenshots/stage-c/
├── 02-s-hook-beat-00.png   # Cold open
├── 02-s-hook-beat-01.png   # Seu Antônio
├── 02-s-hook-beat-02.png   # Labs
├── 02-s-hook-beat-03.png   # Pergunta
└── 02-s-hook-beat-04.png   # Framework
```

**Comando:** `npm run qa:screenshots:cirrose`  
Requer `npm run dev` (port 3000). Script usa `__hookAdvance()` para capturar cada transição.

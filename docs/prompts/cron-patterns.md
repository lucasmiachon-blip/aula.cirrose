# Cron Patterns — Monitoramento em Sessoes Longas

> Usar durante sessoes de 2+ horas. Session-only (expira com a sessao).

## Build health (30 min)

```
/loop 30m npm run build:cirrose 2>&1 | tail -3
```

Detecta regressoes silenciosas durante sessoes de edicao.

## MCP heartbeat (20 min, sessoes de pesquisa)

```
/loop 20m Use PubMed MCP to search for "cirrhosis" and return 1 result. If it fails, warn me.
```

Detecta timeout de MCP antes de perder contexto mid-research.

## Git drift (15 min)

```
/loop 15m git status --short | wc -l
```

Lembra de commitar quando arquivos se acumulam.

## Notas

- `/loop` roda entre turns, nao mid-response
- Jitter de ~15% e adicionado automaticamente
- Expira em 3 dias ou ao encerrar sessao
- Para parar: `/loop stop`

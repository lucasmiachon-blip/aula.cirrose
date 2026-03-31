# Hooks — Reference

> 8 scripts em `.claude/hooks/`. Todos recebem JSON via stdin, saida via exit code.

## PreToolUse (Write|Edit|StrReplace)

| Script | Comportamento | Exit | Logica |
|--------|--------------|------|--------|
| `guard-generated.sh` | **BLOCK** writes em `aulas/*/index.html` | 2 | Arquivo gerado por build; editar slides/*.html + rebuild |
| `guard-product-files.sh` | **BLOCK** writes em slides/*.html, CSS, JS, slide-registry | 2 | Product files requerem aprovacao humana |
| `check-evidence-db.sh` | **BLOCK** edits de slides se evidence-db.md nao foi lido na sessao | 2 | Forca research-before-edit |
| `guard-evidence-db.sh` | **WARN** em writes para evidence-db.md | 0+msg | Non-blocking; alerta para dados clinicos |

## PreToolUse (Bash)

| Script | Comportamento | Exit | Logica |
|--------|--------------|------|--------|
| `guard-secrets.sh` | **WARN** se staged files contem API keys, AWS tokens, GitHub PATs | 0+warn | Scan via regex; non-blocking |

## PostToolUse / PostToolUseFailure (Bash)

| Script | Comportamento | Exit | Logica |
|--------|--------------|------|--------|
| `build-monitor.sh` | Log falhas de `npm run build:*` em NOTES.md | 0 | Silent em sucesso; log em falha |

## SessionStart (compact)

| Script | Comportamento | Exit | Logica |
|--------|--------------|------|--------|
| `post-compact-reinject.sh` | Reinjecta git state + HANDOFF + lessons + dirty state + hooks ativos | 0 | Read-only; restaura awareness apos compaction |

## TaskCompleted

| Script | Comportamento | Exit | Logica |
|--------|--------------|------|--------|
| `task-completed-gate.sh` | **BLOCK** task completion se ha slide changes uncommitted | 2 | Forca commit antes de marcar done |

## Exit Codes

- `0` = OK (permitir). Pode incluir `systemMessage` no stdout JSON.
- `2` = BLOCK (negar). stderr vira feedback para Claude.
- Outro = non-blocking warning.

## JSON Input (stdin)

```json
{
  "session_id": "...",
  "tool_name": "Write",
  "tool_input": { "file_path": "...", "content": "..." }
}
```

Scripts usam `node -e` para parsing JSON (single spawn, cross-platform).

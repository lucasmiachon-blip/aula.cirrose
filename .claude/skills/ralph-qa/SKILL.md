---
name: ralph-qa
description: Loop autônomo de QA para slides — lint → fix → build → fix → screenshots → fix → repeat until 0 FAILs. Padrão Ralph Wiggum adaptado para domínio finito (28 slides). Ativar quando usuário pedir "qa loop", "rodar qa até passar", "fix all lint", "qa autônomo".
version: 1.0.0
context: fork
agent: general-purpose
allowed-tools: Read, Edit, Bash, Grep, Glob
argument-hint: "[lecture?] [max-iterations=15]"
---

# Ralph-QA — Loop Autônomo de QA

Loop de QA para `$ARGUMENTS` (default: `aulas/cirrose/`).
Max iterations: `$MAX_ITERATIONS` (default: 15).

## Por que Ralph para QA

QA é o caso de uso ideal do Ralph Loop:
- Estado vive em arquivos (lint report, screenshots) — não em memória de contexto
- Condição de parada objetiva: `0 FAILs` (não subjetiva)
- Domínio finito: 28 slides, número fixo de constraints a satisfazer
- Cada iteração começa limpa — sem drift de contexto acumulado

Diferença de Ralph para dev geral: dev tem escopo aberto (loop pode crescer indefinidamente).
QA tem escopo fechado — constraints são fixas, slides são finitos.

## Loop Protocol

```
ITERATION N / MAX_ITERATIONS
─────────────────────────────
Step 1: npm run lint:slides
  → Se 0 FAILs: ir para Step 2
  → Se FAILs: corrigir TODOS os FAILs desta iteração → voltar ao Step 1

Step 2: npm run build:cirrose
  → Se build OK: ir para Step 3
  → Se erros: corrigir → voltar ao Step 2

Step 3: Verificar constraints visuais (sample — 3 slides aleatórios)
  → <h2> é asserção? Zero <ul>/<ol>? <aside class="notes"> presente?
  → Se issues: corrigir → voltar ao Step 1

Step 4: Checar git diff — mudanças são cirúrgicas (não reescreveram estrutura)?
  → Se OK: output "QA-DONE"
  → Se mudanças excessivas: PARAR e reportar para humano
```

**Completion promise:** `QA-DONE`
Loop para quando Claude outputar `QA-DONE` ou atingir MAX_ITERATIONS.

## Segurança

- **Max iterations hardcoded:** nunca exceder 15 (default). Cada iteração = 1 lint run.
- **Mudanças cirúrgicas only:** se um fix exige reescrever > 30% de um slide → PARAR e reportar.
- **NUNCA deletar `<aside class="notes">`** — append only (constraint #3).
- **NUNCA modificar dados clínicos** para satisfazer lint — marcar como `[TBD]` e reportar.
- Se após 5 iterações o mesmo FAIL persistir → PARAR e reportar para humano (root cause além do scope).

## Configuração do Hook (para modo totalmente autônomo)

Para ativar o loop real via Stop hook (opcional):

```json
// .claude/settings.json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/ralph-qa-hook.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
# ~/.claude/hooks/ralph-qa-hook.sh
#!/bin/bash
# Lê último output do Claude. Se não contém "QA-DONE" → exit 2 (bloqueia saída, re-injeta)
if ! grep -q "QA-DONE" "$CLAUDE_OUTPUT_FILE" 2>/dev/null; then
  exit 2  # Bloqueia Claude de sair → re-injeta prompt
fi
exit 0    # Permite saída
```

Sem hook: executar manualmente cada iteração até "QA-DONE".

## Output Final

```
## QA Loop — [lecture] — [N] iterações

### Fixes aplicados
- [slide-file]: [issue] → [fix]
- [slide-file]: [issue] → [fix]

### Status
lint:slides: 0 FAILs ✓
build:cirrose: OK ✓
Constraints visuais (sample 3 slides): OK ✓

QA-DONE
```

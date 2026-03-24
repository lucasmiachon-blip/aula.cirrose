---
name: effort
description: |
  Muda o nivel de reasoning effort do Claude Code. Substitui o /effort built-in.
  Ativar com "effort low", "effort medium", "effort high", "effort max", "effort auto", "/effort".
version: 1.0.0
allowed-tools: Read, Bash
argument-hint: "<low|medium|high|max|auto>"
---

# effort — Ajuste de Reasoning Effort

Nivel solicitado: `$ARGUMENTS`

## Workflow

1. Ler `~/.claude/settings.json`
2. Validar argumento: deve ser `low`, `medium`, `high`, `max` ou `auto`
   - Se `auto`: remover o campo `effortLevel` do JSON (volta ao default do modelo)
   - Se vazio ou invalido: mostrar nivel atual e as opcoes disponiveis. NAO alterar nada.
3. Atualizar o campo `"effortLevel"` no JSON (preservar todos os outros campos)
4. Reportar: `Effort: {anterior} -> {novo}. Reinicie a conversa (/clear) para aplicar.`

## Rules

- NUNCA sobrescrever campos que nao sejam `effortLevel`
- Se o arquivo nao existir, criar com `{ "effortLevel": "<valor>" }`
- `max` = reasoning ilimitado (mais lento/caro). Avisar se selecionado.
- Alteracao so toma efeito apos /clear ou nova conversa

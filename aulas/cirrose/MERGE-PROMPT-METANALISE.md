# Prompt para Merge Seguro: main → feat/metanalise-mvp

> Copiar e colar este prompt no terminal do wt-metanalise.
> Após uso, deletar este arquivo (é one-shot).

---

## Prompt

```
Implement the following plan:

# Plano: Merge Seguro main → feat/metanalise-mvp

## Context

Main tem 4 commits desde o último merge (base: `0dcf172`):
1. `9c760b4` — `.gitignore`: adiciona regra para PNGs raiz + cleanup screenshots
2. `16732c6` — `.gitignore`: adiciona `test-results/` (Playwright artifacts)
3. `f45b1e0` — 4 MCPs visuais: a11y-contrast, gemini, frontend-review, chrome-devtools
4. `120da6a` — docs sync: ECOSYSTEM, MCP-ENV-VARS, .env.example

A metanalise-mvp NÃO modificou `.mcp.json` — merge deve ser limpo (sem conflito).

## Classificação (Quarentena Semântica)

| Arquivo | Classe | Ação |
|---------|--------|------|
| `.gitignore` | A (Governança) | Absorver |
| `.mcp.json` | B (Infra QA) | Absorver (sem conflito previsto) |
| `.mcp-profiles/qa.json` | B (Infra QA) | Absorver |
| `.mcp-profiles/full.json` | B (Infra QA) | Absorver |
| `.env.example` | A (Governança) | Absorver |
| `docs/ECOSYSTEM.md` | A (Governança) | Absorver |
| `docs/MCP-ENV-VARS.md` | A (Governança) | Absorver |

**Zero arquivos Classe C** (conteúdo de aula). Merge seguro.

## Conflito Previsto

Nenhum. Metanalise não tocou em `.mcp.json` nem nos outros 6 arquivos.

## Steps

1. **Pre-flight:** `git status` — confirmar working tree limpo
2. **Verificar base:** `git merge-base HEAD main` deve retornar `0dcf172` (ou próximo)
3. **Merge:** `git merge main --no-edit`
4. **Validar JSON:** `node -e "const j=JSON.parse(require('fs').readFileSync('.mcp.json','utf8')); console.log('Valid JSON. Servers:', Object.keys(j.mcpServers).join(', '))"`
5. **Verificar build:** `npm run build:metanalise`
6. **Verificar log:** `git log --oneline -5` — confirmar merge commit
7. **Atualizar docs:**
   - `aulas/metanalise/CLAUDE.md` → seção "WT State": atualizar "Ultimo merge main" com hash e data
   - `aulas/metanalise/HANDOFF.md` → adicionar linha sobre merge (MCPs absorvidos, zero Classe C)

## Verificacao

- `node -e "JSON.parse(require('fs').readFileSync('.mcp.json','utf8'))"` — JSON valido
- `git diff HEAD -- .mcp-profiles/` — profiles absorvidos (diff vazio = OK)
- `npm run build:metanalise` — build OK

## Se houver conflito inesperado

Se `.mcp.json` ou qualquer arquivo tiver conflito:
1. NÃO resolver automaticamente
2. Mostrar o diff conflitante ao usuário
3. Perguntar como resolver
4. A versão do main é a referência para infra (Classe A/B)
```

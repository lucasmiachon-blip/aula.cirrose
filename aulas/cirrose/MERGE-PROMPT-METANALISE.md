# Prompt para Merge Seguro: main → feat/metanalise-mvp

> Copiar e colar este prompt no terminal do wt-metanalise.
> Apos uso, deletar este arquivo (e one-shot).

---

## Prompt

```
Implement the following plan:

# Plano: Merge Seguro main → feat/metanalise-mvp

## Context

Main tem commits novos desde o ultimo merge da metanalise. Expectativa: 4 commits (gitignore, MCPs visuais, docs sync), todos Classe A/B. Metanalise NAO modificou `.mcp.json`, entao merge deve ser limpo.

## Workflow (seguir na ordem)

### Fase 1 — Reconhecimento (ANTES de mergear)

1. `git status` — confirmar working tree limpo (nada uncommitted)
2. `git log --oneline HEAD..main` — listar commits a absorver. Mostrar ao usuario.
3. `git diff --stat $(git merge-base HEAD main)..main` — listar arquivos tocados. Mostrar ao usuario.
4. **Classificar cada arquivo** pela Quarentena Semantica (CLAUDE.md root):
   - **Classe A** (Governanca): .gitignore, .env.example, docs/*.md
   - **Classe B** (Infra QA): .mcp.json, .mcp-profiles/*.json
   - **Classe C** (Conteudo de aula): aulas/**/slides/*.html, **/cirrose.css, **/metanalise.css, **/_manifest.js, **/narrative.md, **/evidence-db.md
   - Se houver QUALQUER arquivo Classe C → **PARAR e perguntar ao usuario**
5. Ler `.mcp.json` atual ANTES do merge (para comparar depois)

### Fase 2 — Merge

6. `git merge main --no-edit`
7. Se conflito:
   - Mostrar o diff conflitante ao usuario
   - NÃO resolver automaticamente
   - Perguntar como resolver
   - Para Classe A/B: versao do main e a referencia
8. Se merge limpo: continuar

### Fase 3 — Validacao

9. Ler `.mcp.json` APOS merge — comparar com antes. Se houver entradas duplicadas (mesmo server name 2x), deduplicar mantendo a versao que vem apos `sharp`
10. `node -e "const j=JSON.parse(require('fs').readFileSync('.mcp.json','utf8')); console.log('Valid JSON. Servers:', Object.keys(j.mcpServers).join(', '))"` — JSON valido + listar servers
11. `npm run build:metanalise` — build OK
12. `git log --oneline -5` — confirmar merge commit

### Fase 4 — Atualizacao de Docs (OBRIGATORIO)

Atualizar os 3 docs operacionais da metanalise:

13. **`aulas/metanalise/CLAUDE.md`** → secao "WT State":
    - `Ultimo merge main:` atualizar com hash do merge commit + data
    - `Infra sync:` atualizar com resumo (ex: "12 MCPs no .mcp.json")

14. **`aulas/metanalise/HANDOFF.md`** → secao "Estado atual":
    - Adicionar linha sobre merge (quantos commits absorvidos, quais MCPs novos, zero Classe C)

15. **`aulas/metanalise/CHANGELOG.md`** → adicionar entrada no topo:
    ```
    ## 2026-03-16 — Merge main ({hash})

    Branch: `feat/metanalise-mvp`

    **Merge main → metanalise-mvp:**
    - N commits absorvidos: listar resumidamente
    - Zero arquivos Classe C tocados
    ```

### Fase 5 — Commit

16. `git add` nos 3 docs atualizados
17. Commit com mensagem:
    ```
    docs(metanalise): post-merge main update

    - CLAUDE.md: WT State updated (merge {hash})
    - HANDOFF.md: merge status
    - CHANGELOG.md: merge entry
    ```
18. `git log --oneline -3` — verificar commits finais

## Regras

- Classe C em main = PARAR. Nao absorver sem triagem humana.
- JSON duplicado = deduplicar (manter versao apos `sharp`).
- Docs ANTES de declarar done.
- Se build falhar = investigar, nao ignorar.
```

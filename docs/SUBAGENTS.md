# Subagents — Melhores Praticas

> Baseado em: Claude Code Agent tool, `.claude/agents/*.md`.
> Ver tambem: [RULES.md](RULES.md) · [SKILLS.md](SKILLS.md) · [XREF.md](XREF.md)

---

## O que sao Subagents

Subagents sao agentes especializados com contexto proprio. Claude Code: `.claude/agents/*.md`.

**docs/archive/pipeline/** = pipeline humano, handoffs (archived). Ver `docs/archive/pipeline/README.md`.

---

## Tipos Built-in (Claude Code)

| Tipo | Uso |
|------|-----|
| **Explore** | Codebase, arquivos, padroes (rapido, read-only) |
| **general-purpose** | Pesquisa, multi-step, tarefas amplas |
| **Plan** | Arquitetura, design de implementacao |

## Custom Agents (`.claude/agents/`)

| Agent | Uso |
|-------|-----|
| **qa-engineer** | Lint, a11y, screenshots, QA perfection loop 14 dimensoes |
| **slide-builder** | Criar/atualizar slides HTML deck.js |
| **reference-manager** | Validar PMIDs/DOIs, formatar AMA, sync Notion |
| **medical-researcher** | Pesquisa multi-MCP (PubMed, Consensus, Scholar, CrossRef, Scite) com rubrica 8-dim |
| **notion-sync** | Sync Slides DB entre repo e Notion |
| **repo-janitor** | Audit orphan files, broken links, dead HTML, temp files (read-only) |
| **verifier** | Validar trabalho "pronto" (model: sonnet) |

---

## Melhores Praticas

1. **One tack:** 1 subagent = 1 tarefa focada
2. **Paralelo:** Lancar 2-4 subagents quando tarefas independentes
3. **Explore:** Codebase, arquivos, padroes
4. **general-purpose:** Pesquisa, multi-step
5. **Nao:** Delegar tarefa que depende de contexto da conversa principal

---

## Quando Usar

- **Explorar:** "Onde esta X?", "Como funciona Y?" → Explore
- **Pesquisar:** "Buscar atualizacoes" → general-purpose
- **QA:** Lint, screenshots, a11y → qa-engineer
- **Verificar:** "Confirme que esta pronto" → verifier
- **Auditar docs:** "audite os docs" → skill docs-audit + general-purpose
- **Criar:** Slide especificado → slide-builder
- **Limpar repo:** "tem lixo?" → repo-janitor

---

## Quando NAO Usar

- Tarefa que depende de decisoes da conversa principal
- Pergunta simples (1-2 passos)
- Arquivo ja conhecido (usar Read/Grep diretamente)

---

## Context Window

| Momento | Acao |
|---------|------|
| Em cada output | Informar "Contexto ~X%." (quando a plataforma expuser) |
| ≥70% | Manter aviso em todo output |
| ≥85% | Recomendar subagent ou novo chat |
| ≥95% | Parar e recomendar novo chat |

### Sinais de perda de eficacia (sem metrica)

Quando notar: respostas genericas, "esquecimento" de contexto, repeticao, confusao entre arquivos, pedidos de clarificacao ja respondidos, lentidao ou truncamento → **recomendar novo chat**.

Regra em `.cursor/rules/core-constraints.mdc`.

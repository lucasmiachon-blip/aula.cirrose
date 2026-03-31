# Docs — Índice

> Onboarding, referência e estado do projeto.

---

## Por propósito

### Onboarding
| Doc | Uso |
|-----|-----|
| [CLAUDE.md](../CLAUDE.md) | **Fonte de verdade operacional** — stack, regras, workflow |

### Estado e handoff
| Doc | Uso |
|-----|-----|
| [aulas/cirrose/HANDOFF.md](../aulas/cirrose/HANDOFF.md) | Pendências Cirrose |

### MCPs e integrações
| Doc | Uso |
|-----|-----|
| [MCP-ENV-VARS.md](MCP-ENV-VARS.md) | Variáveis de ambiente |
| [MCP-ACADEMICOS.md](MCP-ACADEMICOS.md) | MCPs acadêmicos (semantic-scholar, etc.) |
| [SYNC-NOTION-REPO.md](SYNC-NOTION-REPO.md) | Notion IDs (canônico), sync, autoridade repo > Notion |

### Conteúdo e escopo
| Doc | Uso |
|-----|-----|
| [blueprint-cirrose.md](blueprint-cirrose.md) | Blueprint Cirrose |
| [biblia-narrativa.md](biblia-narrativa.md) | Narrativa |
| [slide-pedagogy.md](slide-pedagogy.md) | Teorias pedagógicas codificadas (Sweller, Mayer, Alley) |

### Dados clínicos
| Doc | Uso |
|-----|-----|
| [evidence/cirrose-references.json](evidence/cirrose-references.json) | Referências clínicas Cirrose (JSON estruturado) |

### Referência cruzada
| Doc | Uso |
|-----|-----|
| [XREF.md](XREF.md) | Mapa canônico de dependências entre docs |

### Prompts e ferramentas externas
| Doc | Uso |
|-----|-----|
| [prompts/weekly-updates.md](prompts/weekly-updates.md) | Prompt busca semanal de atualizacoes |
| [prompts/research-best-practices.md](prompts/research-best-practices.md) | Prompt pesquisa melhores praticas |
| [prompts/gemini-deck-audit.md](prompts/gemini-deck-audit.md) | Audit visual Gemini (deck completo) |
| [prompts/gemini-gate0-inspector.md](prompts/gemini-gate0-inspector.md) | Gate 0 inspetor de defeitos visuais (Gemini) |
| [prompts/error-digest.md](prompts/error-digest.md) | Error digest para Gemini QA pipeline |
| [prompts/gemini-paper-extraction.md](prompts/gemini-paper-extraction.md) | Extracao de papers Gemini |
| [prompts/gemini-transcript-comparison.md](prompts/gemini-transcript-comparison.md) | Comparacao transcripts Gemini |
| [prompts/gate2-opus-visual.md](prompts/gate2-opus-visual.md) | Gate 2 Opus visual audit protocol |
| [prompts/gemini-gate4-editorial.md](prompts/gemini-gate4-editorial.md) | Gate 4 editorial Gemini prompt |
| [prompts/content-research-prompt.md](prompts/content-research-prompt.md) | Content research prompt template |
| [prompts/cron-patterns.md](prompts/cron-patterns.md) | Cron pattern reference |
| [prompts/mcp-research-queries.md](prompts/mcp-research-queries.md) | MCP research query templates |
---

## HANDOFFs

1. **aulas/cirrose/HANDOFF.md** — Pendências Cirrose (projeto ativo)

---

## MD — Auditoria

**Não manual.** Executar via skill/subagent:

```
audite os docs / verifique os MDs / audit markdown
```

**Subagent:** `generalPurpose` ou `qa-engineer`
**Critérios:** dev, designer, prompt eng, engenheiro de sistema, economia de tokens
**Best practices:** Anthropic/Cursor mar/2026 — terceira pessoa, trigger terms, progressive disclosure

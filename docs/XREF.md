# XREF — Referências Cruzadas

> Mapa canônico de dependências entre documentos do projeto.
> Atualizar ao criar, mover ou deletar qualquer .md.
> Gerado: 2026-03-07. Última revisão: 2026-03-25.

---

## Legenda

- **Canônico** = fonte da verdade para aquele assunto
- **→** = "referencia" ou "depende de"
- **←** = "é referenciado por"

---

## Hierarquia de Autoridade

```
CLAUDE.md (root)              ← fonte de verdade operacional (absorveu AGENTS.md)
├── .claude/rules/*.md        ← regras detalhadas (prevalecem sobre .cursor se mais completas)
├── .claude/hooks/*.sh        ← safety gates determinísticos (100% enforcement)
├── .claude/skills/*/SKILL.md ← skills invocáveis (7 ativas)
├── .cursor/rules/*.mdc       ← regras Cursor (quick-ref com globs)
├── docs/*.md                 ← referência expandida
└── aulas/cirrose/HANDOFF.md   ← estado da aula
```

**Conflito:** conteúdo mais detalhado prevalece, independente do diretório.

---

## Mapa de Referências

### CLAUDE.md (root) — canônico operacional
| Referencia | Tipo |
|-----------|------|
| → aulas/cirrose/HANDOFF.md | Estado (via Projects table) |
| → tasks/lessons.md | Self-improvement |
| → docs/README.md | Índice docs |

### .claude/rules/ (consolidado 2026-03-25: 10 → 2 arquivos)

| Arquivo | Conteúdo | Referenciado por |
|---------|----------|-----------------|
| slide-rules.md | §1-6 deck.js, §7 slide identity (9 superfícies), §8 CSS errors, §9 motion QA | ← CLAUDE.md, skills, agents |
| design-reference.md | §1 OKLCH, §2 tipografia, §3 layout, §4 design principles (27), §5 dados médicos | ← CLAUDE.md, skills, agents |

### docs/

| Arquivo | Referencia | Referenciado por |
|---------|-----------|-----------------|
| README.md | → todos docs/*.md | (índice) |
| XREF.md | (este arquivo) | ← README.md |
| SYNC-NOTION-REPO.md | → .env.example (IDs Notion) | ← CLAUDE.md |
| blueprint-cirrose.md | (autônomo) | ← README.md |
| biblia-narrativa.md | (autônomo) | ← aulas/cirrose/HANDOFF.md |
| slide-pedagogy.md | (autônomo — teorias pedagógicas) | ← README.md |
| insights-html-cirrose-2026.md | (autônomo — análise Gemini HTML) | ← README.md |
| MCP-ACADEMICOS.md | (autônomo) | ← README.md |
| MCP-ENV-VARS.md | (autônomo) | ← README.md |

### docs/prompts/

| Arquivo | Referencia | Referenciado por |
|---------|-----------|-----------------|
| prompts/weekly-updates.md | (prompt template) | ← README.md |
| prompts/research-best-practices.md | (prompt template) | ← README.md |
| prompts/gemini-deck-audit.md | (prompt template — Gemini, deck completo) | ← README.md |
| prompts/gemini-gate0-inspector.md | (prompt template — Gate 0 inspect, Gemini) | ← README.md |
| prompts/error-digest.md | (prompt template — error digest para Gemini) | ← README.md |
| prompts/gemini-paper-extraction.md | (prompt template — Gemini) | ← README.md |
| prompts/gemini-transcript-comparison.md | (prompt template — Gemini) | ← README.md |
| prompts/openai-backward-design.md | (prompt template — OpenAI) | ← README.md |
| prompts/openai-canvas-storyboard.md | (prompt template — OpenAI) | ← README.md |

### .claude/agents/ (custom subagents)

| Arquivo | MCPs scoped | Papel |
|---------|------------|-------|
| qa-engineer.md | playwright, lighthouse, eslint, perplexity, ui-ux-pro, design-comparison, floto | QA perfection loop 14 dimensoes |
| medical-researcher.md | pubmed, crossref, semantic-scholar, scite, biomcp | Pesquisa profunda multi-MCP + triangulacao + rubrica profundidade |
| repo-janitor.md | — | Audit orphan files, broken links |

### .claude/hooks/ (safety gates — determinísticos)

| Arquivo | Wired em settings.json | Função |
|---------|----------------------|--------|
| build-monitor.sh | PostToolUse, PostToolUseFailure (Bash) | Detecta falhas de build |
| check-evidence-db.sh | PreToolUse (Write) | Valida dados clínicos antes de escrever |
| guard-evidence-db.sh | PreToolUse (Write) | Protege evidence-db de edições não autorizadas |
| guard-generated.sh | PreToolUse (Write\|Edit\|StrReplace) | exit 2 bloqueia Write em index.html gerado |
| guard-secrets.sh | PreToolUse (Bash) | WARN-only: escaneia staged files por padrões de secrets |
| post-compact-reinject.sh | SessionStart (compact) | Reinjecta HANDOFF + git log após /compact |
| task-completed-gate.sh | TaskCompleted | Verificação de quality gates em task completada |
| guard-product-files.sh | PreToolUse (Write\|Edit\|StrReplace) | exit 2 bloqueia edição em arquivos de produto sem confirmação humana |

### scripts/ (git hooks — versionados)

| Arquivo | Função | Wired via |
|---------|--------|-----------|
| pre-commit.sh | Guard 3 (slide-count regression) + Guard 4 (slide-integrity build) + Guard 6 (ghost canary) + lint | .git/hooks/pre-commit (delegator) |
| pre-push.sh | done-gate --strict para aula detectada na branch | .git/hooks/pre-push (delegator) |
| post-merge.sh | Anti-rollback: slide count loss + content diff detection pós-merge | .git/hooks/post-merge (delegator) |
| install-hooks.sh | Instala pre-commit + pre-push + post-merge em .git/hooks/ | Manual: `bash scripts/install-hooks.sh` |

### aulas/cirrose/

| Arquivo | Referencia | Referenciado por |
|---------|-----------|-----------------|
| HANDOFF.md | (autônomo — pendências ativas) | ← CLAUDE.md (operational record) |
| CLAUDE.md (cirrose) | → CLAUDE.md (root), WT-OPERATING.md | ← CLAUDE.md (projects table) |
| references/archetypes.md | (layout archetypes) | ← CLAUDE.md (cirrose) |
| references/decision-protocol.md | (protocolo decisões narrativeCritical) | ← slide-rules.md |
| references/coautoria.md | (regras coautoria) | — |
| references/must-read-trials.md | (trials leitura obrigatória) | — |
| DONE-GATE.md | (checklist done-gate) | ← WT-OPERATING.md |
| HANDOFF-CLAUDE-AI.md | → HANDOFF.md | ← CLAUDE.md |
| CHANGELOG.md | (append-only — histórico de batches) | ← CLAUDE.md (operational record) |
| ERROR-LOG.md | (append-only — erros → regras) | ← CLAUDE.md (operational record) |
| NOTES.md | (log de decisões entre agentes) | ← CLAUDE.md (operational record) |
| WT-OPERATING.md | (prompt operacional — máquina de estados + QA loop) | ← HANDOFF.md |

---

## Pares .claude ↔ .cursor

| .claude/rules/ | .cursor/rules/ | Nota |
|----------------|---------------|------|
| slide-rules.md | css-errors.mdc, reveal-patterns.mdc, slide-editing.mdc, slide-identity.mdc, motion-qa.mdc | .claude consolidou 6 arquivos em 1 |
| design-reference.md | design-system.mdc, cirrose-design.mdc, design-principles.mdc, medical-data.mdc | .claude consolidou 4 arquivos em 1 |

**Sem par em .claude:** core-constraints.mdc, plan-mode.mdc, notion-mcp.mdc (só .cursor).

---

## Canônicos por Assunto

| Assunto | Arquivo canônico | Fallback |
|---------|-----------------|----------|
| Operacional (stack, regras, workflow) | CLAUDE.md | — |
| Tokens OKLCH | .claude/rules/design-reference.md §1 | aulas/cirrose/shared/css/base.css :root |
| Erros CSS | .claude/rules/slide-rules.md §8 | — |
| Dados médicos | .claude/rules/design-reference.md §5 | — |
| Animações GSAP | .claude/rules/slide-rules.md §9 | aulas/cirrose/shared/js/engine.js |
| Deck.js patterns (ativo) | .claude/rules/slide-rules.md §1-6 | — |
| Assertion-Evidence | .claude/rules/slide-rules.md §2 | design-reference.md §4 |
| Notion IDs | .env.example (variáveis `NOTION_*_ID`) | docs/SYNC-NOTION-REPO.md |
| MCP profiles | .mcp-profiles/*.json | .mcp.json (perfil ativo) |
| Estado Cirrose | aulas/cirrose/HANDOFF.md | — |
| Manifesto slides (cirrose) | aulas/cirrose/slides/_manifest.js | CLAUDE.md tabela |
| Pedagogia | docs/slide-pedagogy.md | .claude/rules/design-reference.md §4 |
| Pesquisa médica profunda | .claude/skills/medical-researcher/SKILL.md | .claude/rules/design-reference.md §5, docs/MCP-ACADEMICOS.md |
| Safety gates (hooks) | .claude/settings.json + .claude/hooks/ | — |
| QA pipeline (cirrose) | aulas/cirrose/WT-OPERATING.md §4 | — |

---

## Como Manter

1. **Novo doc:** adicionar aqui + em docs/README.md
2. **Mover/deletar:** atualizar referências aqui + grep por nome antigo
3. **Novo par .claude↔.cursor:** registrar na tabela de pares
4. **Auditoria periódica:** rodar skill `docs-audit` ou `audit-docs`

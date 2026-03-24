# XREF — Referências Cruzadas

> Mapa canônico de dependências entre documentos do projeto.
> Atualizar ao criar, mover ou deletar qualquer .md.
> Gerado: 2026-03-07. Última revisão: 2026-03-24.

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
├── .claude/skills/*/SKILL.md ← skills invocáveis (20 ativas + 2 archived)
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
| → docs/README.md | Índice docs (refs indiretas a RULES, SKILLS, SUBAGENTS) |

### .claude/rules/

| Arquivo | Referencia | Referenciado por |
|---------|-----------|-----------------|
| README.md | → todos .claude/rules/*.md, .cursor/rules/*.mdc | ← XREF.md (este arquivo) |
| anti-drift.md | (autônomo — auto-diagnóstico do agente) | ← CLAUDE.md |
| css-errors.md | → design-system.md, medical-data.md | ← slide-editing.md |
| design-principles.md | → design-system.md | ← CLAUDE.md |
| deck-patterns.md | → slide-identity.md, design-system.md | ← slide-editing.md, motion-qa.md, CLAUDE.md |
| design-system.md | (autônomo) | ← css-errors.md, design-principles.md, slide-editing.md, deck-patterns.md |
| medical-data.md | (autônomo) | ← css-errors.md, slide-editing.md |
| motion-qa.md | → slide-editing.md, deck-patterns.md | ← CLAUDE.md |
| slide-editing.md | → css-errors.md, design-system.md, deck-patterns.md, medical-data.md | ← CLAUDE.md |
| slide-identity.md | → slide-editing.md, reveal-patterns (via deck-patterns) | ← CLAUDE.md, deck-patterns.md |

### docs/

| Arquivo | Referencia | Referenciado por |
|---------|-----------|-----------------|
| README.md | → todos docs/*.md | (índice) |
| XREF.md | (este arquivo) | ← README.md |
| ECOSYSTEM.md | → SKILLS.md, RULES.md, KPIs.md | ← README.md |
| KPIs.md | (autônomo) | ← ECOSYSTEM.md, README.md |
| RULES.md | → SUBAGENTS.md, .cursor/rules/*.mdc | ← CLAUDE.md, ECOSYSTEM.md |
| SKILLS.md | → .cursor/skills/, .claude/skills/ | ← CLAUDE.md, ECOSYSTEM.md |
| SUBAGENTS.md | → .cursor/rules/core-constraints.mdc | ← CLAUDE.md, RULES.md |
| SYNC-NOTION-REPO.md | → .env.example (IDs Notion) | ← CLAUDE.md |
| blueprint-cirrose.md | (autônomo) | ← README.md |
| biblia-narrativa.md | (autônomo) | ← aulas/cirrose/HANDOFF.md |
| slide-pedagogy.md | (autônomo — teorias pedagógicas) | ← README.md |
| insights-html-cirrose-2026.md | (autônomo — análise Gemini HTML) | ← README.md |
| MCP-ACADEMICOS.md | (autônomo) | ← ECOSYSTEM.md |
| MCP-ENV-VARS.md | (autônomo) | ← ECOSYSTEM.md |
| SETUP.md | (autônomo — setup inicial) | ← README.md |
| ZIP-LIMPO-PROTOCOLO.md | (autônomo) | ← README.md |
| archive/pipeline/README.md | (pipeline humano — arquivado) | ← SUBAGENTS.md |

### docs/prompts/ e docs/external/

| Arquivo | Referencia | Referenciado por |
|---------|-----------|-----------------|
| prompts/weekly-updates.md | (prompt template) | ← README.md |
| prompts/research-best-practices.md | (prompt template) | ← README.md |
| prompts/gemini-deck-audit.md | (prompt template — Gemini, deck completo) | ← README.md |
| prompts/gemini-gate0-inspector.md | (prompt template — Gate 0 inspect, Gemini) | ← README.md |
| ~~prompts/gemini-slide-editor.md~~ | Arquivado em `prompts/_archive/` (2026-03-22) | — |
| prompts/error-digest.md | (prompt template — error digest para Gemini) | ← README.md |
| prompts/gemini-paper-extraction.md | (prompt template — Gemini) | ← README.md |
| prompts/gemini-transcript-comparison.md | (prompt template — Gemini) | ← README.md |
| prompts/openai-backward-design.md | (prompt template — OpenAI) | ← README.md |
| prompts/openai-canvas-storyboard.md | (prompt template — OpenAI) | ← README.md |
| external/11-long-context-auditor.md | (tool spec — Gemini long-context) | ← README.md |

### .claude/agents/ (custom subagents)

| Arquivo | MCPs scoped | Papel |
|---------|------------|-------|
| qa-engineer.md | playwright, lighthouse, eslint, perplexity, ui-ux-pro, design-comparison, floto | QA perfection loop 14 dimensoes |
| reference-manager.md | pubmed, crossref, notion, scite, zotero | Valida PMIDs/DOIs, formata AMA, sync Notion |
| medical-researcher.md | pubmed, crossref, semantic-scholar, scite, biomcp | Pesquisa profunda multi-MCP + triangulacao + rubrica profundidade |
| notion-sync.md | notion | Sync Slides DB repo ↔ Notion |
| slide-builder.md | playwright | Build slides HTML |
| repo-janitor.md | — | Audit orphan files, broken links |
| verifier.md | — | Valida que trabalho declarado done realmente passa |

### .claude/hooks/ (safety gates — determinísticos)

| Arquivo | Wired em settings.json | Função |
|---------|----------------------|--------|
| audit-trail.sh | PostToolUse, PostToolUseFailure (*) | P0 traceability — JSONL log de toda tool call |
| build-monitor.sh | PostToolUse, PostToolUseFailure (Bash) | Detecta falhas de build |
| check-evidence-db.sh | PreToolUse (Write) | Valida dados clínicos antes de escrever |
| guard-evidence-db.sh | PreToolUse (Write) | Protege evidence-db de edições não autorizadas |
| guard-generated.sh | PreToolUse (Write\|Edit\|StrReplace) | exit 2 bloqueia Write em index.html gerado |
| ~~guard-shared.sh~~ | Removido 2026-03-22 | Obsoleto: shared/ internalizado, sem worktree |
| ~~guard-destructive.sh~~ | Movido para _archive/ — coberto por deny permissions | Obsoleto: backup redundante |
| ~~guard-merge.sh~~ | Removido 2026-03-22 | Obsoleto: sem worktree protocol |
| guard-secrets.sh | PreToolUse (Bash) | WARN-only: escaneia staged files por padrões de secrets |
| ~~warn-class-c.sh~~ | Removido 2026-03-22 | Obsoleto: sem Class A/B/C |
| post-compact-reinject.sh | SessionStart (compact) | Reinjecta HANDOFF + git log após /compact |
| session-tracker.sh | SessionStart, SessionEnd | Lifecycle de sessão (3-terminal tracking) |
| subagent-stop-log.sh | SubagentStop | Loga conclusão de subagents |
| task-completed-gate.sh | TaskCompleted | Verificação de quality gates em task completada |
| teammate-idle-gate.sh | TeammateIdle | Validação de quality gates do teammate |

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
| references/decision-protocol.md | (protocolo decisões narrativeCritical) | ← slide-editing.md |
| references/coautoria.md | (regras coautoria) | — |
| references/must-read-trials.md | (trials leitura obrigatória) | — |
| DONE-GATE.md | (checklist done-gate) | ← WT-OPERATING.md |
| HANDOFF-CLAUDE-AI.md | → HANDOFF.md | ← CLAUDE.md |
| CHANGELOG.md | (append-only — histórico de batches) | ← CLAUDE.md (operational record) |
| ERROR-LOG.md | (append-only — erros → regras) | ← CLAUDE.md (operational record) |
| NOTES.md | (log de decisões entre agentes) | ← CLAUDE.md (operational record) |
| WT-OPERATING.md | (prompt operacional — máquina de estados + QA loop) | ← HANDOFF.md |
| ~~QA-WORKFLOW.md~~ | Deletado 2026-03-18 — QA loop em WT-OPERATING.md §4 | — |

### Arquivados (docs/archive/)

| Arquivo | Motivo |
|---------|--------|
| AGENTS.md | Absorvido por CLAUDE.md (mar/2026) |
| REPO-DIAGNOSTIC.md | Superseded |
| DIAGNOSTIC-27fev.md | Superseded |
| HANDOFF-geral-2026-03-04.md | Estado distribuído por aula |
| HANDOFF_SYNC-CURSOR-2026-02-26.md | One-shot |
| cirrose-scope.md | Superseded por blueprint-cirrose.md |
| AUDIT-BATCHES.md | One-shot |
| research-skills-ecosystem-2026-03-11.md | Pesquisa ecosystem upgrade (referência, não operacional) |
| CHATGPT_HANDOFF_ACT2.md | One-shot planning Act 2 |
| NNT-IC95-REPORT.md | Relatório NNT verificação |
| aulas-magnas-system-v6.plan.md | System plan v6 |
| audit-rules-report-2026-03-17.md | Relatório audit-rules |
| docs-audit-report-2026-03-17.md | Relatório docs-audit |
| runbook-skills-verification-2026-03-12.md | Runbook verificação skills |

---

## Pares .claude ↔ .cursor

| .claude/rules/ | .cursor/rules/ | Mais completo |
|----------------|---------------|--------------|
| css-errors.md | css-errors.mdc | .claude |
| design-principles.md | design-principles.mdc | .claude (27 vs 11 princípios) |
| design-system.md | cirrose-design.mdc + design-system.mdc | Split OK |
| medical-data.md | medical-data.mdc | .claude |
| motion-qa.md | motion-qa.mdc | .claude |
| deck-patterns.md | reveal-patterns.mdc | .claude (deck.js specifics) |
| slide-editing.md | slide-editing.mdc | Ambos |
| slide-identity.md | slide-identity.mdc | .claude |

**Sem par em .claude:** core-constraints.mdc, plan-mode.mdc, notion-mcp.mdc (só .cursor).

---

## Canônicos por Assunto

| Assunto | Arquivo canônico | Fallback |
|---------|-----------------|----------|
| Anti-drift (auto-diagnóstico agente) | .claude/rules/anti-drift.md | — |
| Operacional (stack, regras, workflow) | CLAUDE.md | — |
| Tokens OKLCH | .claude/rules/design-system.md | aulas/cirrose/shared/css/base.css :root |
| Erros CSS | .claude/rules/css-errors.md | — |
| Dados médicos | .claude/rules/medical-data.md | — |
| Animações GSAP | .claude/rules/motion-qa.md | aulas/cirrose/shared/js/engine.js |
| Deck.js patterns (ativo) | .claude/rules/deck-patterns.md | — |
| Assertion-Evidence | .claude/rules/slide-editing.md | design-principles.md §1 |
| Notion IDs | .env.example (variáveis `NOTION_*_ID`) | docs/SYNC-NOTION-REPO.md |
| MCP profiles | .mcp-profiles/*.json | .mcp.json (perfil ativo) |
| Estado Cirrose | aulas/cirrose/HANDOFF.md | — |
| Context window | docs/SUBAGENTS.md | .cursor/rules/core-constraints.mdc |
| Manifesto slides (cirrose) | aulas/cirrose/slides/_manifest.js | CLAUDE.md tabela |
| Pipeline humano | docs/archive/pipeline/README.md | — |
| Pedagogia | docs/slide-pedagogy.md | .claude/rules/design-principles.md |
| KPIs multiagente | docs/KPIs.md | — |
| Benchmarks modelos | docs/ECOSYSTEM.md | — |
| Pesquisa médica profunda | .claude/skills/medical-researcher/SKILL.md | .claude/rules/medical-data.md, docs/MCP-ACADEMICOS.md |
| Safety gates (hooks) | .claude/settings.json + .claude/hooks/ | — |
| ~~WT protocol~~ | Removido 2026-03-22 — standalone, sem worktree | — |
| Audit trail | .claude/hooks/audit-trail.sh | ~/.claude/session-logs/ |
| QA pipeline (cirrose) | aulas/cirrose/WT-OPERATING.md §4 | — |

---

## Como Manter

1. **Novo doc:** adicionar aqui + em docs/README.md
2. **Mover/deletar:** atualizar referências aqui + grep por nome antigo
3. **Novo par .claude↔.cursor:** registrar na tabela de pares
4. **Auditoria periódica:** rodar skill `docs-audit` ou `audit-docs`

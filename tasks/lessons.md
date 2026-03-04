# Lessons — Padrões Aprendidos

> Atualizado após correções e auditorias. Revisar no início de sessão.

---

## Auditoria Batches (2026-03)

### Rules: .cursor vs .claude

- **Fonte canônica:** .cursor/rules/ — Cursor usa .mdc com frontmatter
- **.claude rules:** Deprecados para overlap; conteúdo único migrado para .cursor
- **design-system:** Mais verboso que cirrose-design; design-system = referência completa, cirrose-design = quick ref

### Paths CSS

- **NUNCA** documentar shared/css/archetypes.css ou shared/css/cirrose.css — não existem
- Realidade: base.css em shared/; archetypes.css e cirrose.css em aulas/cirrose/ (e grade, osteoporose)

### Notion ↔ Repo

- IDs canônicos: docs/SYNC-NOTION-REPO.md
- Conflito de versão: Composer/Claude Opus determina o mais atual → prevalece

### MD Audit

- Não manual. Skill docs-audit + subagent generalPurpose/qa-engineer
- Critérios: dev, designer, prompt eng, engenheiro de sistema, economia de tokens

### Skills .cursor vs .claude

- Sem conflito: cada superfície usa seu diretório (Cursor vs Claude Code vs Claude.ai)
- docs-audit espelhado: mesmo conteúdo, path no prompt adaptado
- assertion-evidence, medical-data: Claude only, complementam medical-slide (não duplicam)

### Skills

- medical-slide (Cursor) cobre assertion-evidence + verificação de dados
- assertion-evidence e medical-data (Claude) são subconjuntos — avaliar depreciação

### Context Window

- ≥70%: informar ao usuário
- ≥85%: recomendar subagent ou novo chat
- ≥95%: parar e recomendar novo chat
- **Sinais sem métrica:** respostas genéricas, esquecimento, repetição, confusão, pedidos já respondidos, lentidão → novo chat
- Regra em core-constraints.mdc; referência em docs/RULES.md, docs/SUBAGENTS.md

---

## Anti-patterns

- Documentar paths sem verificar existência no filesystem
- Duplicar regras entre .cursor e .claude sem decisão de fonte canônica
- Verbosidade em CLAUDE.md duplicando docs/

---

## Auditoria Profunda (2026-03-04)

### Rules .cursor vs .claude — NÃO são redundantes

- **CORRIGIDO:** README.md dizia ".cursor canônico" — na verdade são **complementares**
- `.claude` é mais completo em: medical-data (Tier 1 table), design-principles (27 vs 11), css-errors (5 clusters), motion-qa (5 tiers)
- `.cursor` é mais completo em: slide-editing (tri-mode), reveal-patterns (GSAP timeline)
- 3 rules .cursor sem equivalente .claude: core-constraints, plan-mode, notion-mcp
- Regra: em conflito, conteúdo mais detalhado prevalece

### Agents — Problemas Corrigidos

- **verifier:** model fast→sonnet (Haiku fraco demais para git diff + julgamento)
- **reference-checker → reference-manager:** Definido formato de handoff via `tasks/reference-check-report.md`
- **slide-builder vs medical-slide:** NÃO são duplicatas — ambientes diferentes (Claude Code vs Cursor). Cross-references adicionadas
- **docs-audit .claude:** Clarificado como redirect para .cursor/skills/docs-audit/
- **assertion-evidence:** Descrição corrigida "Cria" → "Valida"

### design-principles.mdc — 15 princípios adicionados

- .cursor tinha 11, agora tem 26 (alinhado com .claude/27)
- Adicionados: Andragogia (3), Mayer extras (2), Kahneman, Duarte expandido (5), Tufte (4), Layout Patterns + Fill Ratio
- Faltava: F-pattern, Z-pattern, Fill Ratio, Expertise-Reversal, Testing Effect — todos críticos para design de slides médicos

---

*Append-only. Não remover lições antigas.*

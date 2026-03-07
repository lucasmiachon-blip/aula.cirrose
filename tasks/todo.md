# Todo

> Pendências de infraestrutura e metadados. Conteúdo Cirrose → `aulas/cirrose/HANDOFF.md`

---

## 🔴 ALTA

*(vazio)*

---

## 🟡 MÉDIA — Próxima sessão

- [ ] **MCP Gemini:** integrar Gemini como MCP (pesquisa alternativa + video review de animações). Ver `docs/ECOSYSTEM.md` — Gemini Ultra sem MCP ainda.

---

## 🟢 BAIXA — Backlog infra

- [ ] Batch 1: `.cursor/rules/*.mdc` vs `.claude/rules/*.md` — redundâncias remanescentes
- [ ] Batch 2: `.cursor/skills/*` vs `.claude/skills/*` — verificar alinhamento pós-update mar 2026
- [ ] Batch 3: `docs/*.md` — sobreposição, links quebrados (rodar `/docs-audit`)

---

## ✅ Concluído nesta sessão (2026-03-07)

- [x] Skills `.claude` atualizadas para padrões mar 2026 (version, allowed-tools, argument-hint, context:fork)
- [x] `docs/SKILLS.md` atualizado: tabela completa + frontmatter + bug Issue #17283
- [x] `docs/ECOSYSTEM.md`: link `MCP-FIXES.md` (não existia) → `MCP-ENV-VARS.md`
- [x] `slide-builder.md`: workflow atualizado para arquitetura modular (slides/*.html + build:cirrose)
- [x] `tasks/lessons.md`: append campos mar 2026 + bug context:fork

# Todo

> Pendências de infraestrutura e metadados. Conteúdo Cirrose → `aulas/cirrose/HANDOFF.md`

---

## 🔴 ALTA

*(vazio)*

---

## 🟡 MÉDIA — Próxima sessão

- [ ] **Pipeline Opus → Gemini (implementar MCP + workflow)**

  **Objetivo:** Pipeline bimodal onde cada modelo faz o que faz melhor.

  **Opus 4 (claude.ai chat) — Design & Diagnóstico:**
  - Define slides: estrutura, archetypes, narrativa, hierarquia visual
  - Identifica problemas de UI/UX e interações (case panel, click-reveal, MELD calc)
  - Determina o que deve ser animado e como
  - Output: spec detalhada + lista de bugs/melhorias → handoff para Gemini

  **Gemini 2.0 Pro / Flash — Debug & Implementação:**
  - Recebe orientações do Opus via handoff (arquivo ou prompt estruturado)
  - Debugga CSS, JS, animações GSAP conforme spec
  - Flash para iterações rápidas (lint, pequenos fixes)
  - Pro para análise de vídeo das animações (motion QA tier 5)
  - Output: PR com fixes + screenshots

  **Setup necessário:**
  - Configurar MCP Gemini em `.cursor/mcp.json` (google-gemini ou vertex-ai)
  - Criar template de handoff Opus→Gemini: `docs/pipeline/opus-gemini-handoff.md`
  - Definir quais problemas vão para Pro vs Flash
  - Testar: `claude mcp list` → confirmar gemini disponível

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

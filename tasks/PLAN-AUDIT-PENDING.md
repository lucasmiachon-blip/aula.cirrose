# Plano — Pendências da Auditoria (Paralelo)

> Execução via subagents em paralelo. Criado 2/mar/2026.

---

## Visão geral

| Track | Subagent | Escopo | Output |
|-------|----------|--------|--------|
| 1 | medical-researcher | NNT IC 95% + time frame (6 slides) | Relatório com PMIDs, IC 95%, time frame |
| 2 | generalPurpose | Links MD (docs/SKILLS, RULES) | Edits aplicados |
| 3 | generalPurpose | Redundância docs-audit | .claude/skills/docs-audit → stub |
| 4 | generalPurpose | Best practices (datas, paths) | Edits aplicados |

---

## Track 1: NNT IC 95% (medical-researcher)

**Regra:** medical-data.mdc — "NNT deve incluir IC 95% e time frame obrigatoriamente"

| Slide | NNT | Fonte | Ação |
|-------|-----|-------|------|
| 08-a2-carvedilol | NNT 9 | ARR 11% em ~3a | Buscar IC 95% do NNT no trial (carvedilol vs placebo) |
| 09-a2-tips | NNT 4 | Mortalidade 1a 14% vs 39% | Buscar IC 95% — Garcia-Pagán, García-Tsao |
| 10-a2-albumina | NNT 5 | Sort NEJM 1999 | Verificar Sort 1999 — IC 95% |
| 11-a2-pbe | NNT 5 | Sort 1999 | Idem 10 |
| 12-a2-hrs | NNT 7 | CONFIRM Wong NEJM 2021 | Buscar IC 95% CONFIRM |
| 21-app-tips | NNT 4 | Early TIPS | Idem 09 |

**Output:** Relatório em `tasks/NNT-IC95-REPORT.md` com PMID, IC 95%, time frame. Edits nos slides após aprovação.

---

## Track 2: MD Links (generalPurpose)

**Conflitos:** docs/SKILLS.md e docs/RULES.md linkam `~/.cursor/skills-cursor/create-skill/SKILL.md` e `~/.cursor/skills-cursor/create-rule/SKILL.md` — paths externos, podem não existir no Windows.

**Solução:** Substituir por nota: "Ver Cursor Docs — [Agent Skills](url) / [Rules](url). Skills globais opcionais em `~/.cursor/skills/`."

**Arquivo:** docs/README.md → `archive/` linka pasta; apontar para `archive/README.md` se for o alvo.

---

## Track 3: docs-audit Redundancy (generalPurpose)

**Conflito:** docs-audit duplicado em `.cursor/skills/docs-audit/` e `.claude/skills/docs-audit/`.

**Solução:** `.cursor/skills/docs-audit/` = fonte única. `.claude/skills/docs-audit/SKILL.md` → stub de 5-10 linhas que referencia `.cursor/` e instrui a carregar de lá. Manter reference.md e SOURCES.md em .cursor apenas; .claude pode ter link ou remover duplicatas.

---

## Track 4: Best Practices (generalPurpose)

**Conflitos:**
- Datas fixas em CLAUDE.md, HANDOFFs, blueprint, biblia-narrativa
- Paths absolutos macOS/Windows em docs/SETUP.md, docs/ECOSYSTEM.md

**Solução:**
- Datas: trocar "Atualizado 27/fev/2026" por "Última atualização: [ver git log]" ou "Atualizado recentemente"
- Paths: adicionar nota "macOS: ~/Library/... | Windows: %APPDATA%\\..." em SETUP.md; ECOSYSTEM.md: "Paths exemplos — ajustar ao ambiente"

---

## Ordem de execução

1. **Paralelo:** Tracks 1, 2, 3, 4 rodam simultaneamente
2. **Pós-paralelo:** Consolidar outputs; aplicar edits dos Tracks 2–4; Track 1 → aplicar NNT nos slides após revisão do relatório
3. **Verificação:** `npm run lint:slides`, `npm run build:cirrose`

---

---

## Execução (2/mar/2026)

| Track | Status | Output |
|-------|--------|--------|
| 1 | ✅ | tasks/NNT-IC95-REPORT.md — Early TIPS IC 95% (2,1–50); demais [TBD] |
| 2 | ✅ | docs/SKILLS, RULES, README — links corrigidos |
| 3 | ✅ | .claude/skills/docs-audit/ — stub, fonte em .cursor |
| 4 | ✅ | CLAUDE.md, SETUP, ECOSYSTEM — datas/paths generalizados |

**Próximo:** Aplicar IC 95% Early TIPS (2,1–50) nos slides 09 e 21. Demais [TBD] até cálculo/autor.

---

## Verbosity (prioridade amanhã)

- AUDIT-VISUAL.md (404 linhas): split ou index — **prioridade 1**
- biblia-narrativa.md (302 linhas): index ou split — **prioridade 2**

Ver docs/HANDOFF.md e aulas/cirrose/HANDOFF.md. HTML só após verbosity, Notion, conflitos.

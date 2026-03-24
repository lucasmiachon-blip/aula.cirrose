# Rules — Melhores Praticas

> Regras vivem em dois diretorios complementares.
> Ver tambem: [SKILLS.md](SKILLS.md) · [SUBAGENTS.md](SUBAGENTS.md) · [XREF.md](XREF.md)

---

## Dois Diretorios, Um Proposito

| Diretorio | Formato | Papel |
|-----------|---------|-------|
| `.claude/rules/*.md` | Markdown puro | Referencia completa (clusters detalhados, workflows, E-codes) |
| `.cursor/rules/*.mdc` | Markdown + frontmatter YAML (globs, alwaysApply) | Quick reference com ativacao por arquivo |

**Em caso de conflito:** conteudo mais detalhado prevalece, independente do diretorio.

---

## Ativacao (`.cursor/rules/*.mdc`)

| Tipo | Propriedade | Quando aplica |
|------|-------------|---------------|
| Always Apply | `alwaysApply: true` | Toda sessao |
| Apply Intelligently | `alwaysApply: false`, sem globs | Agent decide por relevancia |
| Apply to Specific Files | `globs: "**/*.ts"` | Arquivo aberto corresponde ao padrao |
| Apply Manually | — | Quando @-mencionado no chat |

`.claude/rules/*.md` sao carregadas sob demanda pelo Claude Code (sem frontmatter).

---

## Estrutura .mdc (Cursor)

```yaml
---
description: "O que a rule faz (aparece no picker)"
globs: "**/*.html"   # Opcional; vazio = Apply Intelligently
alwaysApply: false   # true = sempre aplica
---

# Titulo da Rule

Conteudo em markdown...
```

---

## Regras do Projeto

### `.claude/rules/` (Claude Code — referencia completa)

| Rule | Escopo |
|------|--------|
| anti-drift.md | Auto-diagnostico do agente (nao do usuario) |
| css-errors.md | 44 erros em 5 clusters |
| deck-patterns.md | deck.js: navegacao, GSAP, click-reveal, eventos |
| design-principles.md | 27 principios (Alley, Sweller, Mayer, Tufte, Duarte, Knowles) |
| design-system.md | OKLCH tokens, semantica cores, tipografia, WCAG |
| medical-data.md | Dados clinicos, NNT, HR, RR, Tier 1 |
| motion-qa.md | Heuristicas GSAP, timing, workflow 5 tiers |
| reveal-legacy.md | Reveal.js (FROZEN — grade/osteoporose only) |
| slide-editing.md | Checklist pre-edicao, batch workflow, E-codes |
| slide-identity.md | 9 superficies de slide ID |

### `.cursor/rules/` (Cursor — quick reference)

| Rule | Globs | Sempre | Nota |
|------|-------|--------|------|
| core-constraints | — | Sim | Context window thresholds (70/85/95%) |
| medical-data | — | Sim | Subset de .claude/rules/medical-data.md |
| slide-editing | `**/slides/**/*.html` | Nao | Tri-mode (create/edit/delete) |
| plan-mode | — | Nao | Escalacao por complexidade |
| design-principles | `**/*.html,**/*.css` | Nao | 11 principios (subset) |
| cirrose-design | `**/*.css,**/*.html` | Nao | Tokens cirrose |
| design-system | `**/*.css` | Nao | OKLCH tokens |
| motion-qa | `**/*.js` | Nao | Heuristicas GSAP |
| reveal-patterns | `**/*.html,**/*.js` | Nao | **DEPRECATED** — split em deck-patterns + reveal-legacy |
| css-errors | `**/*.css` | Nao | 44 erros em 5 clusters |
| slide-identity | `**/slides/**/*.html` | Nao | 9 superficies |
| notion-mcp | — | Nao | Workflow Notion + IDs |

---

## Pares .claude ↔ .cursor

| .claude/rules/ | .cursor/rules/ | Mais completo |
|----------------|---------------|--------------|
| css-errors.md | css-errors.mdc | .claude |
| design-principles.md | design-principles.mdc | .claude (27 vs 11 principios) |
| design-system.md | cirrose-design.mdc + design-system.mdc | Split OK |
| medical-data.md | medical-data.mdc | .claude |
| motion-qa.md | motion-qa.mdc | .claude |
| deck-patterns.md | reveal-patterns.mdc | .claude (deck.js specifics) |
| reveal-legacy.md | — | .claude only (FROZEN) |
| slide-editing.md | slide-editing.mdc | Ambos |
| slide-identity.md | slide-identity.mdc | .claude |

**Sem par em .claude:** core-constraints.mdc, plan-mode.mdc, notion-mcp.mdc (so .cursor).

---

## Melhores Praticas

1. **Focadas e acionaveis:** Como docs internos claros
2. **Referenciar arquivos:** Nao copiar codigo — apontar para exemplos canonicos
3. **Exemplos concretos:** Correto vs incorreto
4. **Split rules grandes:** > 500 linhas → dividir em modulos
5. **Evitar:** Vagas, duplicar codebase, documentar edge cases raros

---

## Manutencao

- Incluir novas experiencias do projeto
- Remover padroes obsoletos
- Testar com prompts diversos
- Versionar no git

# PROMPT — Sessao Main: Hardening Governanca (2026-03-17)

> Gerado por auditoria de 3 agentes (76 achados) + comite evolve (10 patches).
> Executar em `C:\Dev\Projetos\aulas-magnas` (branch `main`).
> Apos executar, absorver em WTs via `git merge main`.

---

## Contexto

Em 17/mar rodamos 3 auditorias + evolve na WT cirrose:
- **repo-janitor:** 0 critical, 5 warn, 6 info
- **rules-audit:** 4 contradicoes, 8 stale, 8 gaps, 6 bloat, 6 outdated
- **docs-audit:** 6 broken links, 10 stale, 5 redundant, 5 verbose, 7 missing
- **evolve:** 8 patches aprovados, 1 vetado (GSAP), 1 rejeitado (@notionhq)

Achados ja corrigidos na WT (nao repetir):
- `tasks/lessons.md` dedup (secao duplicada removida)
- `aulas/cirrose/qa-screenshots/README.md` atualizado

---

## P1 — Alto Impacto (fazer primeiro)

### 1. Split `reveal-patterns.md` (resolve 9 achados)

```
.claude/rules/reveal-patterns.md
  → .claude/rules/deck-patterns.md    (deck.js — cirrose, metanalise)
  → .claude/rules/reveal-legacy.md    (Reveal.js — grade, osteoporose, frozen)
```

**deck-patterns.md deve conter:**
- Imports deck.js (`initDeck`, `initAnimations`)
- Estrutura de slide (section + slide-inner + notes)
- Animacao declarativa (data-animate: countUp, stagger, drawPath, fadeUp, highlight)
- Eventos deck.js REAIS: `slide:changed`, `slide:entered` (NAO `slidechanged`/`slidetransitionend`)
- Appendice: `data-visibility="hidden"` (engine.js pre-processa, NAO deck.js)
- Click-reveal via `data-reveal` + click-reveal.js (NAO fragments)
- Speaker notes formato canonico
- Background: CSS class no `.slide-inner` (NAO `data-background-color` — deck.js nao parseia)

**reveal-legacy.md deve conter:**
- Imports Reveal.js
- Fragments (`class="fragment fade-up"`)
- Eventos Reveal: `slidechanged`, `slidetransitionend`, `ready`
- `viewDistance` warning
- PDF export config (`pdfSeparateFragments`, etc.)
- `data-background-color` HEX (Reveal parseia JS-side)
- Nota: "FROZEN — grade/osteoporose only. Nao usar para novos projetos."

**Atualizar cross-refs em:**
- CLAUDE.md root (linha "Navigation/animation patterns")
- docs/XREF.md (tabela rules + canonicos + pares)
- .claude/rules/slide-editing.md (referencias cruzadas)
- .claude/rules/motion-qa.md (referencias)
- .claude/rules/README.md (tabela de pares)

### 2. Atualizar `docs/SKILLS.md` (+11 skills)

Adicionar a tabela Claude Code:

| Skill | Descricao |
|-------|-----------|
| context7 | Injeta docs de libs no contexto (GSAP, Reveal, Vite, OKLCH) |
| new-skill | Scaffold de nova skill com frontmatter correto |
| repo-janitor | Audit orphan files, broken links, dead HTML (read-only) |
| audit-rules | Audita rules para contradicoes, stale refs, gaps |
| evolve | Comite de evolucao — pesquisa + patches para skills/docs/tools |
| final-pass | Avaliacao final deck completo via Gemini (Gates 1-3 ja passaram) |
| gtd | Getting Things Done file-based (inbox, next actions, weekly review) |
| mem-search | Busca semantica na memoria do projeto |
| new-slide | Cria slide assertion-evidence completo |
| ralph-qa | QA em 2 loops (Opus lint + Gemini visual) ate PASS |
| resolve-conflict | Guia PT-BR para merge conflicts |

Adicionar a tabela Cursor:

| Skill | Descricao |
|-------|-----------|
| slide-frontend-ux | Frontend review UX de slides |

### 3. Codificar 5+ ERROs em rules

**Em `.claude/rules/css-errors.md` Cluster A — adicionar:**

| Erro | Prioridade | Regra |
|------|-----------|-------|
| E32 | MUST | Pseudo-elements com flex-grow PROIBIDOS em containers base compartilhados. ::before/::after participam do layout flex — combinados com gap ou flex:1 children, produzem efeitos colaterais |
| E33 | MUST | justify-content: center em flex column com overflow = clipping simetrico (h2 desaparece). Usar margin-top:auto no primeiro child |
| E34 | SHOULD | `<p>` dentro de flex com gap = espacamento duplicado (gap + margin 1em). Reset p { margin: 0 } dentro de flex layouts com gap |

**Em `.claude/rules/slide-editing.md` — adicionar ao checklist ou secao nova:**

| Regra | Fonte |
|-------|-------|
| Click handlers DENTRO de slides devem usar `stopPropagation()` para nao propagar ao nav layer | ERRO-033 |
| Custom animations devem ser registradas (`wireAll`) ANTES do dispatcher conectar | ERRO-016 |
| deck.js bg escuro: usar `background-color` no CSS com seletor `#slide-id .slide-inner`, NAO `data-background-color` | ERRO-034 |
| `[TBD]` permitido APENAS em `<aside class="notes">`. NUNCA em headline, source-tag ou corpo projetado | ERRO-029 |
| Archetype scope: reutilizar elementos de um archetype em outro requer re-declarar display/flex no novo contexto | ERRO-018/032 |

### 4. Atualizar `design-system.md` Modes

Secao "Modos" — substituir:

```
### Plano C (padrão — light, 1280×720)
Sala mediana, projetor decente. Fundo creme + texto escuro + GSAP ativo.
CSS `.stage-c` no `<body>`. Tokens remapeados em `base.css`.

### Plano A (dark, 1920×1080)
Sala escura, projetor bom. Navy + texto claro + animacoes.
CSS `.stage-a` no `<body>` (implementacao pendente).

### Plano B (.stage-bad — light, 1280×720)
Sala clara, projetor fraco. Fundo branco + texto preto + sem animacao + fontes pesadas.
CSS `.stage-bad` mantido em base.css (fallback funcional). Sem arquivo standalone.
```

Corrigir alto contraste:
```
### Alto Contraste (tecla `C`)
Toggle `.high-contrast` via deck.js `onKeyDown` handler (tecla C).
```
(Remover referencia a `Reveal.addKeyBinding`)

---

## P2 — Medio Impacto

### 5. Adicionar slide-identity a XREF.md e RULES.md

- XREF.md tabela `.claude/rules/`: adicionar `slide-identity.md` com refs
- XREF.md tabela pares: adicionar `slide-identity.md` / `slide-identity.mdc`
- docs/RULES.md tabela: adicionar `slide-identity.mdc`

### 6. Fix docs/SETUP.md linha ~165

Remover referencia a `assertion-evidence.mdc` (arquivo nao existe em `.cursor/rules/`).

### 7. Adicionar 3 archive files a XREF.md

Na secao "Arquivados":
- `CHATGPT_HANDOFF_ACT2.md` | One-shot planning Act 2
- `NNT-IC95-REPORT.md` | Relatorio NNT verificacao
- `aulas-magnas-system-v6.plan.md` | System plan v6

### 8. Fix export skill para deck.js (Evolve P05)

`.claude/skills/export/SKILL.md`: adicionar nota que cirrose/metanalise usam deck.js.
DeckTape com flag `--slides` manual ou exportar via Playwright screenshot loop.

### 9. Fix docs-audit skill (Evolve P06)

`.claude/skills/docs-audit/SKILL.md`: inline o checklist em vez de redirecionar para `.cursor/skills/docs-audit/` (Claude Code nao acessa `.cursor/skills/`).

---

## P3 — Baixo Impacto

### 10. Consolidar tabelas ECOSYSTEM+KPIs

3 tabelas de modelos em ECOSYSTEM.md (Pipeline, Alianca, Ferramentas) → 1 tabela unificada.
KPIs.md "Roteamento por Tarefa" tambem duplica — referenciar ECOSYSTEM em vez de copiar.

### 11. Anotar WT-only refs

docs/README.md e XREF.md: nota que `aulas/metanalise/HANDOFF.md`, `references/`, `slides/` so existem na WT `feat/metanalise-mvp`.

### 12. build:metanalise placeholder (Evolve P08)

`package.json`: adicionar `"build:metanalise": "echo 'Build script not yet configured for metanalise'"`.

### 13. context7 skill update (Evolve P02)

`.claude/skills/context7/SKILL.md`: notar Vite 8.0 existe mas projeto usa 6.x; marcar GSAP 3.12→3.14 como "pending human approval".

### 14. ECOSYSTEM.md Vite note (Evolve P09)

Adicionar nota: "Vite 8.0 (Rolldown) disponivel. Projeto usa 6.x. Upgrade nao urgente — 6.x ainda mantido."

---

## DECISAO PENDENTE (usuario)

### GSAP 3.12 → 3.14 (Evolve P07 — VETADO pelo Archaeologist)

**Beneficios:** SplitText gratis, bugfix `from()` revert, animate to CSS variables.
**Risco:** engine.js foi reescrito 2x com regressoes. Upgrade deve ser testado em isolamento.
**Recomendacao:** Sessao dedicada em main com teste em aula de calibracao antes de absorver em WTs.

---

## Verificacao pos-execucao

```bash
# Rodar apos todas as edicoes:
npm run lint:slides
grep -rn "reveal-patterns" .claude/ docs/ --include="*.md"  # deve retornar 0 (renomeado)
grep -rn "Reveal.addKeyBinding" .claude/ --include="*.md"    # deve retornar 0
grep -rn "slidechanged" .claude/rules/deck-patterns.md       # deve retornar 0
```

---

*Gerado em 2026-03-17 por auditoria automatizada (3 agentes + evolve). Checklist completa em `aulas/cirrose/NOTES.md`.*

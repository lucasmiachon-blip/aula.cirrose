# Lessons — Padroes Aprendidos

> Apenas licoes NAO codificadas em `.claude/rules/`. E-codes → slide-rules.md §8. Dados → design-reference.md §5.
> Atualizado: 2026-03-22. Podado de 481→~70 linhas (34 redundantes + 5 obsoletas removidas).

---

## CSS/Layout (fora dos E-codes)

### Panel overlap: min() cap vence panel-width
- `min(1120px, calc(100% - 140px - 1rem))` = 1120px (cap binding em 1280px viewport)
- Com `margin:0 auto`, conteudo se estende sobre o panel
- Fix: `max-width: calc(100% - var(--panel-width) - 3rem)` quando panel visivel

### stage-c remap de --text-on-dark afeta bg local escuro
- `--text-on-dark` em stage-c remapeia para `oklch(12%)` (texto ESCURO) — correto para slides light
- Elemento com bg escuro DENTRO de slide light herda remap → texto escuro sobre bg escuro
- **Regra:** Elemento com background proprio escuro em slide light DEVE usar cor explicita, NUNCA `var(--text-on-dark)`

---

## GSAP

### Flip.getState() ANTES da transicao
- `Flip.getState(el)` DEVE ser chamado antes de `showEra()` (que faz opacity→0)
- Se `preFlipState = null` (era nao visitada), usar fallback `gsap.from`

### SplitText: sempre 'words,chars'
- `type: 'chars'` isolado causa word-break mid-word ("paci/entes")
- Fix: `type: 'words,chars'` + `&nbsp;` para espacos non-breaking

### overflow=scrollHeight pode ser artefato GSAP
- Elementos com `opacity:0` (estado inicial GSAP) ocupam layout → scrollHeight inflado
- Antes de "corrigir overflow", verificar se desaparece quando GSAP revela os elementos

---

## Dados Medicos (fora de design-reference.md §5)

### MELD intermediarios: narrativos ≠ clinicos
- Canonicos (CASE.md): ~10, 28, 12 — derivados de checkpoints clinicos reais
- Intermediarios (12→14→17→18→28→24): CONSTRUCOES NARRATIVAS para ritmo
- Moram em: narrative.md + _manifest.js. NUNCA em CASE.md

### PMIDs corretos em um doc, errados em outro
- ANSWER: evidence-db tinha 29861076 (correto), design-reference.md tinha 29793859 (errado)
- **Regra:** Ao fixar PMID, grep ALL occurrences: `grep -rn "PMID_ANTIGO" aulas/{aula}/`

### Ioannou HCC: sobrevida ≠ incidencia
- PMID 31374215: HR 0.29 sobre morte POS-HCC com SVR (nao prevencao)
- PMID 31356807: estudo sobre INCIDENCIA de HCC
- Ao citar HR de HCC, explicitar: INCIDENCIA ou SOBREVIDA pos-diagnostico?

---

## Documentacao

### Dados duplicados em N docs driftam
- Ao atualizar dado numerico em slide, grep por valor antigo: `grep -rn "valor_antigo" aulas/{aula}/`
- evidence-db.md e fonte canonica. Se evidence-db diz X mas narrative diz Y → narrative errado

### Candidatos nao-decididos acumulam verbosidade
- Apos decisao final, colapsar nao-selecionados em tabela-resumo na mesma sessao

### Referencias cross-doc desatualizadas
- Ao trocar artigo-ancora, grep por nome antigo em TODOS os docs

---

## Debugging

### "CSS bug" pode ser infra
- Antes de diagnosticar "CSS specificity", verificar se dev server serve o codigo certo
- Tela preta impede validacao visual → hipotese nunca testada

### Cross-pollination de prompts entre projetos
- Tecnicas (XML tags, CoT) sao transferiveis. Persona e calibracao sao especificos
- Apos evoluir prompt em uma aula, separar tecnica (transferir) de contexto (preservar)

---

## Procedural

### Write tool preserva encoding do original
- Fix encoding: `printf '...\n' > file` via Bash — nao confiar em Write/Edit

### Hooks: node -e, nunca python
- Python nao e dependencia do projeto. Todo hook DEVE usar `node -e` para JSON parsing

### git rm vs rm: verificar tracking antes
- `qa-screenshots/`, `.playwright-mcp/`, `.claude/hooks/_archive/` estavam no .gitignore
- `git rm -r` falha silenciosamente em paths nao-tracked → sempre `git ls-files <path>` antes
- Se untracked: `rm -r` (sem -f). Se tracked: `git rm -r`

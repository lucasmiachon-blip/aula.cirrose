# CSS Errors — Registry & Prevention

> 44 erros em 5 clusters. Canônico para erros e prevenção.
> Relacionados: [design-system](design-system.md) · [medical-data](medical-data.md) · [slide-editing](slide-editing.md)
> Prioridade: MUST = fatal/bloqueante | SHOULD = alta | MAY = nice-to-have

---

## Cluster A: Flexbox & Layout

| Erro | Prioridade | Regra |
|------|-----------|-------|
| E06 | MUST | Max 5 slides por batch sem validação |
| E10 | SHOULD | `space-between` com N≠M items = PROIBIDO |
| E18 | MAY | `margin-top:auto` OK, monitorar gap >25% |
| E20 | MUST (3x) | "Só ajusta X" → escopo é APENAS X |
| E22 | SHOULD | `flex:1` → SEMPRE distribution nos filhos |
| E26 | MUST (3x) | NUNCA flex:1 igualitário em containers desiguais |
| E27 | SHOULD | Diagnosticar assimetria ANTES de escolher layout |
| E28 | SHOULD | ≤3 children para space-between |
| E32 | MUST | Pseudo-elements (::before/::after) com flex-grow PROIBIDOS em containers base compartilhados. Participam do layout flex — combinados com gap ou flex:1, produzem efeitos colaterais |
| E33 | MUST | `justify-content: center` em flex column com overflow = clipping simétrico (h2 desaparece). Usar `margin-top:auto` no primeiro child |
| E34 | SHOULD | `<p>` dentro de flex com gap = espaçamento duplicado (gap + margin 1em). Reset `p { margin: 0 }` dentro de flex layouts com gap |
| E35 | MUST | CSS inline no HTML tem max specificity — override requer seletor com ID. `flex-wrap: wrap` inline causou layout break (ERRO-035) |
| E40 | MUST | `width:100%` + padding sem `box-sizing: border-box` = overflow. Apenas `section` e `.slide-inner` têm reset global — custom containers herdam `content-box` |
| E41 | SHOULD | Grid `auto` row com 2+ filhos = sobreposição. Overlays/punchlines sobre slide = `position: absolute`, não grid flow |
| E45 | SHOULD | Source-tags com 3+ citações DEVEM ser testados em 1280x720 + 1920x1080. `white-space:normal; overflow-wrap:anywhere; max-width:55%` para evitar truncamento |

### Regra Master Flexbox
```
Se filhos têm conteúdo desigual:
  → NUNCA flex:1 igualitário
  → Usar: dividers | space-evenly | flex ratios | stacked layout
```

---

## Cluster B: Display & Navegação

| Erro | Prioridade | Regra |
|------|-----------|-------|
| E07 | MUST | NUNCA `display` inline no `<section>` |
| E12 | MAY | Overrides globais precisam de escape hatches |
| E23 | MUST (3x) | CHECKLIST OBRIGATÓRIO pré-edição |
| E24 | SHOULD | Cache-busting `?v=date` em dev; Vite hash em build |
| E38 | MUST | Click handlers DENTRO de slides deck.js DEVEM usar `stopPropagation()` para não propagar ao nav layer |
| E39 | SHOULD | `data-background-color` não funciona em deck.js (convenção Reveal.js). Usar `background-color` no CSS com seletor `#slide-id .slide-inner` |

### Por quê E07 é fatal (CANÔNICO)
Reveal.js controla visibilidade dos `<section>`. Um `display` inline sobrescreve o framework e quebra navegação. Todo layout vai dentro de `.slide-inner` wrapper.

**Fix se encontrar:** Mover o display para `.slide-inner` DENTRO do `<section>`.

---

## Cluster C: Dados Médicos

| Erro | Prioridade | Regra |
|------|-----------|-------|
| E21 | MUST | Fonte Tier 1 OBRIGATÓRIA para todo dado numérico |
| E25 | MUST | HR ≠ RR. Trial isolado ≠ meta-análise |

---

## Cluster D: Cores & Contraste

| Erro | Prioridade | Regra |
|------|-----------|-------|
| E08 | MAY | h1/h2=título, h3=card header (regras diferentes) |
| E13 | SHOULD | Cross-slide consistency OBRIGATÓRIO |
| E14 | SHOULD | Linha de acento decorativa = AI marker → remover |
| E15 | MUST | Warning/gold em bg claro = usar --warning-on-light |
| E17 | SHOULD | Converter para bg-navy → verificar TODOS componentes |
| E31 | MUST | Cor = semântica clínica. Ver `design-system.md` |
| E36 | SHOULD | Seletores aula CSS que competem com base.css DEVEM ter ID anchor (`#deck`) para vencer cascata (ERRO-036) |
| E37 | MUST | Tokens `*-light` (L>85%) NUNCA como foreground em stage-c (bg L=95%). Contraste ~1.1:1 = invisível (ERRO-037) |
| E43 | SHOULD | Mudar LAYOUT ≠ remover SURFACE. `background`, `border-radius`, `box-shadow` são ortogonais ao layout. Preservar layers de superfície ao refatorar |
| E44 | MUST | Blackout overlay cinematico: alpha ≥ 0.65 para contraste dramático. Textos sobre overlay escuro DEVEM mudar para cores claras via GSAP (CSS mantém dark para fallback `.no-js`/`.stage-bad`) |

---

## Cluster E: Processo & Workflow

| Erro | Prioridade | Regra |
|------|-----------|-------|
| E01 | MAY | Perguntar "Como deve ficar no final?" |
| E02 | SHOULD | Preview antes de "pronto" |
| E03 | MAY | Cada elemento = propósito claro |
| E05 | SHOULD | Naming: `NN-slug.html` (ex: `02b-a1-damico.html`) |
| E09 | MUST | NUNCA remover overflow:hidden do @media print |
| E11 | SHOULD | Primeiro render = rascunho |
| E16 | MAY | "Slide N" = posição no deck, não nome de arquivo |
| E19 | SHOULD | Verificar uncommitted antes de checkout |
| E30 | MUST | NUNCA `[^;]*` em CSS inline → usar `[^";]*` |
| E42 | MUST | Raw code no prompt Gemini DEVE ser lido dos arquivos NO MOMENTO do envio. NUNCA reaproveitar prompt de rodada anterior sem re-extrair código |

---

## Reincidências (3x = checklist obrigatório)

| Erro | Reincidências | Ação |
|------|---------------|------|
| E07/E23 | 3x | Checklist pré-edição obrigatório |
| E20 | 3x | "Escopo é APENAS X" — confirmar antes |
| E26 | 3x | Flex:1 proibido em containers desiguais |

---

## Quick Prevention

Antes de editar CSS:
1. Ler este arquivo
2. Identificar cluster relevante
3. Flexbox? → E06/E10/E18/E22/E26/E27/E28/E40/E41/E45
4. Display/Nav? → E07/E23/E38/E39
5. Cor? → E13/E14/E15/E17/E31/E36/E37/E43/E44 + `design-system.md`
6. Dados? → E21/E25 + `medical-data.md`
7. Regex? → E30
8. Processo? → E42

# CSS Error Codes — Referência Completa

> On-demand. Top 10 mais críticos → `docs/prompts/error-digest.md` (injetado no Gate 4).
> Incidentes → `aulas/cirrose/ERROR-LOG.md`.

---

## A: Flexbox & Layout
| Erro | Prio | Regra |
|------|------|-------|
| E06 | MUST | Max 5 slides por batch |
| E10 | SHOULD | `space-between` com N≠M items PROIBIDO |
| E20 | MUST 3x | "Só ajusta X" = escopo APENAS X |
| E22 | SHOULD | `flex:1` → SEMPRE distribution nos filhos |
| E26 | MUST 3x | NUNCA flex:1 igualitário em containers desiguais |
| E27 | SHOULD | Diagnosticar assimetria ANTES de layout |
| E28 | SHOULD | ≤3 children para space-between |
| E32 | MUST | Pseudo-elements proibidos em flex containers compartilhados |
| E33 | MUST | `justify-content:center` + column + overflow = clipping. Usar `margin-top:auto` |
| E34 | SHOULD | `<p>` em flex+gap = espaçamento duplo. Reset margin |
| E35 | MUST | CSS inline = max specificity. Override requer ID |
| E40 | MUST | `width:100%` + padding sem `box-sizing:border-box` = overflow |
| E41 | SHOULD | Grid `auto` row + 2 filhos = sobreposição |
| E45 | SHOULD | Source-tags 3+ citações: testar em 1280x720 + 1920x1080 |
| E52 | MUST | NUNCA `vw`/`vh` em font-size deck.js. `scaleDeck()` + vw = fonts estourando |

**Regra Master Flexbox:** Filhos com conteúdo desigual → NUNCA flex:1 igualitário → usar dividers, space-evenly, flex ratios, ou stacked.

## B: Display & Navegação
| Erro | Prio | Regra |
|------|------|-------|
| E07 | MUST | NUNCA `display` inline no `<section>`. Layout em `.slide-inner` |
| E23 | MUST 3x | Checklist pré-edição obrigatório |
| E24 | SHOULD | Cache-busting `?v=date` em dev |
| E38 | MUST | Click handlers: `stopPropagation()` |
| E39 | SHOULD | deck.js: bg via CSS, não `data-background-color` |

## C: Dados Médicos
| E21 | MUST | Fonte Tier 1 obrigatória para dado numérico |
| E25 | MUST | HR ≠ RR. Trial ≠ meta-análise |

## D: Cores & Contraste
| Erro | Prio | Regra |
|------|------|-------|
| E08 | MAY | h1/h2=título, h3=card header |
| E13 | SHOULD | Cross-slide consistency obrigatório |
| E14 | SHOULD | Linha de acento = AI marker → remover |
| E15 | MUST | Warning/gold em bg claro → `--warning-on-light` |
| E17 | SHOULD | Converter bg-navy → verificar TODOS componentes |
| E31 | MUST | Cor = semântica clínica |
| E36 | SHOULD | CSS aula vs base.css: usar ID anchor `#deck` |
| E37 | MUST | Tokens `*-light` (L>85%) NUNCA como foreground em stage-c |
| E43 | SHOULD | Mudar layout ≠ remover surface (bg, border-radius, box-shadow) |
| E44 | MUST | Blackout overlay: alpha ≥ 0.65. Textos sobre overlay escuro → cores claras via GSAP |

## E: Processo
| Erro | Prio | Regra |
|------|------|-------|
| E09 | MUST | NUNCA remover overflow:hidden do @media print |
| E30 | MUST | NUNCA `[^;]*` em CSS inline → usar `[^";]*` |
| E42 | MUST | Prompt Gemini: ler código NO MOMENTO do envio, nunca reaproveitar |

## AI Markers (PROIBIDO)
Linhas decorativas sob títulos, emojis em slides médicos, gradientes sem função, sombras excessivas.

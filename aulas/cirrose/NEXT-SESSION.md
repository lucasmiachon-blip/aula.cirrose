# NEXT-SESSION — s-a1-fib4 QA pipeline

> Contexto profundo do slide EM ANDAMENTO. Ler so se for trabalhar neste slide.
> Atualizado: 2026-03-29T16:15-03:00

---

## Contexto: slide REESCRITO em 2026-03-29

O conteudo antigo (formula, cutoffs, hero 5.91, checkpoint/mandate) foi removido.
O conteudo novo foca em nuances de especialista sobre limitacoes do FIB-4.

**H2:** `Modelos Preditivos: FIB-4` (titulo original do Lucas — NAO e assertion-evidence, mas e decisao do autor. Nao alterar.)

---

## Estado atual dos arquivos (pos-R5 fixes + animacao refinada, 2026-03-29 16:15)

| Arquivo | Estado | Detalhes |
|---------|--------|----------|
| `slides/03b-a1-fib4calc.html` | OK | Archetype removido. 3 states: S0=VPN/VPP, S1=3 pitfalls, S2=gray zone 30-60%. |
| `slides/_manifest.js` | OK | headline='Modelos Preditivos: FIB-4', clickReveals=2 |
| `slide-registry.js` | **ATUALIZADO** | State machine: exit 0.2s, delay 0.2s (anti-ghosting), y-offset ±4px, stagger 0.08s. |
| `cirrose.css` | **ATUALIZADO** | box-sizing:border-box, surfaces color-mix 8%, E52 vw→96px fixo, dead CSS removido, deep failsafe, source-tag max-width. |
| `references/narrative.md` | OK | headline + descricao sincronizados |
| `references/evidence-db.md` | OK | Refs tier-1 para s-a1-fib4. |
| `AUDIT-VISUAL.md` | STALE | Precisa re-audit pos-R5. |
| `qa-screenshots/` | **FRESCO** | PNGs S0/S2 + video capturados pos-animacao refinada (16:11). |
| `gate0.json` | **FRESCO** | Flash model. FAIL: ANIMATION_STATE (falso positivo sistemico). READABILITY agora PASS. |
| `gate4-scorecard-r5.json` | **FRESCO** | 7.3/10. Pos P1-P4 + box-sizing. |

---

## CSS classes ativas no slide

| Classe | Uso |
|--------|-----|
| `.fib4-stages` | Grid stacking container (place-items:center, box-sizing:border-box, surface card) |
| `.fib4-stage` | grid-area: 1/1, opacity: 0 (GSAP controla), height: 100% |
| `.fib4-asymmetry` | S0 wrapper |
| `.fib4-stat-row` | Grid 2-col para VPN/VPP |
| `.fib4-stat` | Card individual (padding, radius) |
| `.fib4-stat--safe` | color-mix(--safe 8%, --bg-elevated) + border + box-shadow |
| `.fib4-stat--danger` | color-mix(--danger 8%, --bg-elevated) + border + box-shadow |
| `.fib4-stat-number` | Numero grande (font-display, text-h1) |
| `.fib4-stat-label` | Label VPN/VPP (text-small, secondary) |
| `.fib4-pitfalls` | S1 wrapper |
| `.fib4-pitfall-row` | Grid 3-col para 3 armadilhas |
| `.fib4-pitfall` | Card armadilha (bg-card, border) |
| `.fib4-pitfall-title` | Titulo armadilha (font-body 700) |
| `.fib4-pitfall-detail` | Detalhe armadilha (text-small, secondary) |
| `.fib4-grayzone` | S2 wrapper |
| `.fib4-grayzone-content` | Flex column center |
| `.fib4-grayzone-stat` | **HERO** 30-60% (96px fixo, --warning, serif) |
| `.fib4-grayzone-label` | "zona indeterminada" (text-h3, uppercase) |
| `#s-a1-fib4 .source-tag` | max-width 55%, overflow-wrap, margin-top |

> Para localizar: `grep -n "\.fib4-\|#s-a1-fib4" aulas/cirrose/cirrose.css`

---

## GSAP state machine (slide-registry.js)

```
S0 (auto):  asymmetry visible, cards stagger in (0.35s, stagger 0.2s, delay 0.3s)
S1 (click): asymmetry exit (0.2s, y:-4, power2.in) → pitfalls enter (delay 0.2s, 0.35s) → cards stagger (0.08s×3, delay 0.25s)
S2 (click): pitfalls exit (0.2s, y:-4, power2.in) → grayzone enter (delay 0.2s, 0.4s, power3.out) → source-tag (0.3s, delay 0.45s)
Retreat:    reverso instantaneo (gsap.set autoAlpha:1, y:0)
```

**Anti-ghosting:** delay >= exit duration em TODAS transicoes. Zero overlap.

> Para localizar: `grep -n "s-a1-fib4" aulas/cirrose/slide-registry.js`

---

## Historico de reviews Gemini

| Round | Prompt | CSS linhas | Score | Notas |
|-------|--------|-----------|-------|-------|
| R1 | v2.0 | ~3 (bug) | 6.0/10 | Com archetype, CSS parcial |
| R2 | v2.0 | 105 (fallback) | 5.5/10 | Sem archetype, CSS parcial |
| R3 | v2.0 | 271 (section fix) | 4.9/10 | CSS completo, criterios subjetivos |
| R4 | v3.0 | 271 | 5.6/10 | Criterios mensuraveis. Ghosting flagrado (motion 2/10). |
| **R5** | v3.0 | 258 | **7.3/10** | Pos P1-P4. box-sizing flagrado (craft 6/10). |

---

## Propostas R5 pendentes de aprovacao

| # | Tipo | O que | Status |
|---|------|-------|--------|
| P1 | MUST | box-sizing + deep failsafe | **IMPLEMENTADO** |
| P2 | RADICAL | pitfall cards → dividers verticais "Bloomberg" | Pendente decisao Lucas |
| P3 | SHOULD | warning color escurecido via color-mix com navy | Pendente decisao Lucas |
| P4 | COULD | Acelerar stagger (delay 0.3→0.15) | **IMPLEMENTADO parcial** (0.2s, preservando anti-ghosting) |

---

## Proximos passos

1. **Recapturar screenshots** — HTML mudou (daltonism icons), PNGs stale
2. **Decidir R5 P2/P3** — estetica dos pitfall cards e cor do warning
3. **Gate 4 R6** — pos recaptura, avaliar impacto dos icons no score
4. **Pensar conteudo** — slide esta correto clinicamente? Nuances suficientes para hepatologistas seniors?
5. Score target: >=7 para aprovacao (R5=7.3, ja ultrapassa threshold)

## Concluido nesta sessao

- **Gate 2 PASS** — report em `qa-screenshots/s-a1-fib4/gate2-report.md`
- **Daltonism icons** — ✓ VPN, ✕ VPP, ⚠ zona indeterminada
- **Shadow token** — `var(--shadow-soft)` substituiu literal oklch

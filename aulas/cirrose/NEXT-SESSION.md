# NEXT-SESSION — s-a1-fib4 QA pipeline

> Contexto profundo do slide EM ANDAMENTO. Ler so se for trabalhar neste slide.
> Atualizado: 2026-03-29T17:30-03:00

---

## Contexto: conteudo andragogia + Gate 4 R6 8.8/10

Sessao 29/mar noite: conteudo redesenhado para andragogia (Knowles — aplicabilidade imediata).
Hero numbers trocados de estatisticas de teste para cutoffs clinicos que o medico usa.
Gate 4 R6 avaliou com PNGs+video frescos. 3 propostas (P1/P2/P3) todas implementadas.

**H2:** `Modelos Preditivos: FIB-4` — decisao do Lucas. NAO alterar.

---

## Estado atual dos arquivos (pos-R6 P1+P2+P3, 2026-03-29 17:30)

| Arquivo | Estado | Detalhes |
|---------|--------|----------|
| `slides/03b-a1-fib4calc.html` | **ATUALIZADO** | S0: cutoffs < 1,30 / >= 2,67 como hero (era VPN/VPP). S1: pitfalls acionaveis. S2: zona cinza com range + elastografia. Operadores em `.fib4-operator` span. |
| `slides/_manifest.js` | OK | headline='Modelos Preditivos: FIB-4', clickReveals=2 |
| `slide-registry.js` | **ATUALIZADO** | P1: advance delay 0.25s (era 0.2s). retreat() reescrito com esvaziamento estrito (exit → delay 0.25s → re-enter com stagger invertido). |
| `cirrose.css` | **ATUALIZADO** | P2: color-mix 12%/35% (era 8%/20%). P3: `.fib4-operator` (DM Sans 0.85em, opacity 0.7). |
| `shared/js/case-panel.js` | **ATUALIZADO** | Botoes "Seu Antônio" → "Antônio" (FIB-4 L177 + MELD-Na L245). |
| `references/narrative.md` | OK | headline + descricao sincronizados |
| `references/evidence-db.md` | OK | Refs tier-1 para s-a1-fib4. |
| `AUDIT-VISUAL.md` | STALE | Precisa re-audit pos-R6. |
| `qa-screenshots/` | **STALE** | PNGs S0/S2 + video capturados ANTES de P1/P2/P3. Recapturar. |
| `gate0.json` | **FRESCO** | PASS (Flash model, 17:05). |
| `gate4-scorecard-r6.json` | **FRESCO** | 8.8/10. |

---

## CSS classes ativas no slide

| Classe | Uso |
|--------|-----|
| `.fib4-stages` | Grid stacking container (place-items:center, box-sizing:border-box, surface card) |
| `.fib4-stage` | grid-area: 1/1, opacity: 0 (GSAP controla), height: 100% |
| `.fib4-asymmetry` | S0 wrapper |
| `.fib4-stat-row` | Grid 2-col para cutoff cards |
| `.fib4-stat` | Card individual (padding, radius) |
| `.fib4-stat--safe` | color-mix(--safe **12%**, --bg-elevated) + border **35%** + box-shadow |
| `.fib4-stat--danger` | color-mix(--danger **12%**, --bg-elevated) + border **35%** + box-shadow |
| `.fib4-stat-number` | Numero grande (font-display, text-h1). Contem `.fib4-operator` span. |
| `.fib4-stat-label` | "Exclui — VPN > 90%" / "Nao confirma — VPP ~35%" (text-small, secondary) |
| `.fib4-operator` | Operador < / >= em DM Sans 0.85em, opacity 0.7 |
| `.fib4-pitfalls` | S1 wrapper |
| `.fib4-pitfall-row` | Grid 3-col para 3 armadilhas |
| `.fib4-pitfall` | Card armadilha (bg-card, border) |
| `.fib4-pitfall-title` | Titulo armadilha (font-body 700) |
| `.fib4-pitfall-detail` | Detalhe: "Cutoff sobe para 2,0" / "AST/ALT > 2 infla o score" / "ALT ↑ mascara fibrose" |
| `.fib4-grayzone` | S2 wrapper |
| `.fib4-grayzone-content` | Flex column center |
| `.fib4-grayzone-stat` | **HERO** 30-60% (96px fixo, --warning, serif) |
| `.fib4-grayzone-label` | "FIB-4 1,30 – 2,67 → elastografia" (text-h3, uppercase) |
| `#s-a1-fib4 .source-tag` | max-width 55%, overflow-wrap, margin-top |

---

## GSAP state machine (slide-registry.js)

```
S0 (auto):  asymmetry visible, cards stagger in (0.35s, stagger 0.2s, delay 0.3s)
S1 (click): asymmetry exit (0.2s, y:-4) → delay 0.25s → pitfalls enter (0.1s) → cards stagger (0.08s×3)
S2 (click): pitfalls exit (0.2s, y:-4) → delay 0.25s → grayzone enter (0.4s, power3.out) → source-tag (0.3s, delay 0.5s)
Retreat S2→S1: grayzone exit (0.2s, y:-4) → delay 0.25s → pitfalls re-enter (stagger -0.05s inverso)
Retreat S1→S0: pitfalls exit (0.2s, y:+4) → delay 0.25s → asymmetry re-enter (stagger -0.1s inverso)
```

**Anti-ghosting:** delay 0.25s > exit 0.2s em TODAS transicoes (advance E retreat). Zero overlap.

---

## Historico de reviews Gemini

| Round | Score | Mudancas principais |
|-------|-------|---------------------|
| R1 | 6.0 | Com archetype, CSS parcial |
| R2 | 5.5 | Sem archetype, CSS parcial |
| R3 | 4.9 | CSS completo, criterios subjetivos |
| R4 | 5.6 | Criterios mensuraveis. Ghosting flagrado. |
| R5 | 7.3 | box-sizing, deep failsafe, animacao refinada |
| **R6** | **8.8** | Conteudo andragogia + P1 strict emptying + P2 projetor-safe + P3 operator typography |

---

## Proximos passos

1. **Recapturar screenshots** — CSS/JS mudaram pos-Gate 4 R6 (P1/P2/P3). PNGs stale.
2. **Verificar visual no browser** — Ctrl+Shift+R para forcar reload. Confirmar cutoffs, contraste cards, operadores.
3. **Decidir se R6 8.8 e suficiente** — threshold era >=7, ja ultrapassa. Lucas pode aprovar DONE ou pedir R7.
4. Se R7: recapturar → Gate 0 → Gate 4 com round context atualizado.

## Concluido nesta sessao (29/mar noite)

- **Conteudo andragogia** — cutoffs como hero, pitfalls acionaveis, zona cinza com proximo passo
- **Gate 4 R6: 8.8/10** — PNGs+video frescos enviados ao Gemini Pro
- **P1 MUST** — strict stage emptying (advance + retreat)
- **P2 SHOULD** — color-mix 12%/35% projetor-safe
- **P3 RADICAL** — .fib4-operator micro-tipografia
- **Botao calculadora** — "Seu Antônio" → "Antônio"
- **Gate 2 PASS** (sessao anterior, pre-conteudo)
- **Daltonism icons** (sessao anterior)

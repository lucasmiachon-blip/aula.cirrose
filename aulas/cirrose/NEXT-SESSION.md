# NEXT-SESSION — s-a1-fib4 QA pipeline

> Contexto profundo do slide EM ANDAMENTO. Ler so se for trabalhar neste slide.
> Atualizado: 2026-03-30T00:30-03:00

---

## Contexto: slide REESCRITO em 2026-03-29

O conteudo antigo (formula, cutoffs, hero 5.91, checkpoint/mandate) foi removido.
O conteudo novo foca em nuances de especialista sobre limitacoes do FIB-4.

**H2:** `Modelos Preditivos: FIB-4` (titulo original do Lucas — NAO e assertion-evidence, mas e decisao do autor. Nao alterar.)

---

## Estado atual dos arquivos (apos reescrita 2026-03-29, P2/P3/P4 visuais implementados)

| Arquivo | Estado | Detalhes |
|---------|--------|----------|
| `slides/03b-a1-fib4calc.html` | OK | Archetype removido (was hero-stat). 3 states: S0=VPN/VPP, S1=3 pitfalls, S2=gray zone 30-60%. |
| `slides/_manifest.js` | OK | headline='Modelos Preditivos: FIB-4', clickReveals=2 |
| `slide-registry.js` | OK | State machine 3 estados, caveat null fix, cross-fade overlap (P4) |
| `cirrose.css` | OK | Archetype removido. Layout via `#s-a1-fib4 .slide-inner { justify-content: flex-start; gap: var(--space-sm); }`. P2 hero gray zone, P3 tinted cards. |
| `references/narrative.md` | OK | headline + descricao sincronizados |
| `references/evidence-db.md` | OK | Refs tier-1 para s-a1-fib4 (EASL NITs, Lindvig, McPherson, Sterling, Baveno VII, etc.). Tabela "Dados Clinicos" reconstruida 29/mar (IDs Act 2 corrigidos). |
| `AUDIT-VISUAL.md` | STALE | Scorecard refere conteudo antigo. Status header atualizado (5 DONE, 1 QA). Precisa re-audit completo pos-QA pipeline. |
| `qa-screenshots/` | STALE | PNGs S0/S2 e video sao de ANTES das mudancas P2/P3/P4. Recapturar OBRIGATORIO. |
| `gate0.json` | STALE | Baseado em screenshots antigos. Re-run obrigatorio. |

---

## CSS classes ativas no slide

| Classe | Uso |
|--------|-----|
| `.fib4-stages` | Grid stacking container (place-items:center, surface card) |
| `.fib4-stage` | grid-area: 1/1, opacity: 0 (GSAP controla) |
| `.fib4-asymmetry` | S0 wrapper |
| `.fib4-stat-row` | Grid 2-col para VPN/VPP |
| `.fib4-stat` | Card individual (padding, radius) |
| `.fib4-stat--safe` | Fundo tinted safe-light |
| `.fib4-stat--danger` | Fundo tinted danger-light |
| `.fib4-stat-number` | Numero grande (font-display, text-h1) |
| `.fib4-stat-label` | Label VPN/VPP (text-small, secondary) |
| `.fib4-pitfalls` | S1 wrapper |
| `.fib4-pitfall-row` | Grid 3-col para 3 armadilhas |
| `.fib4-pitfall` | Card armadilha (bg-card, border) |
| `.fib4-pitfall-title` | Titulo armadilha (font-body 700) |
| `.fib4-pitfall-detail` | Detalhe armadilha (text-small, secondary) |
| `.fib4-grayzone` | S2 wrapper |
| `.fib4-grayzone-content` | Flex column center |
| `.fib4-grayzone-stat` | **HERO** 30-60% (clamp 72-110px, warning-on-light, serif) |
| `.fib4-grayzone-label` | "zona indeterminada" (text-h3, uppercase) |

> Layout override: `#s-a1-fib4 .slide-inner` (adicionado 30/mar). Demais seletores por classe `.fib4-*`.
> Para localizar: `grep -n "\.fib4-\|#s-a1-fib4" aulas/cirrose/cirrose.css`

---

## GSAP state machine (slide-registry.js)

```
S0 (auto):  asymmetry visible, cards stagger in (0.35s, stagger 0.2s, delay 0.3s)
S1 (click): asymmetry cross-fade out (0.5s, y:-15), pitfalls cross-fade in (0.5s, delay 0.1s), pitfall cards stagger (0.35s, stagger 0.15s)
S2 (click): pitfalls cross-fade out (0.4s, y:-15), grayzone cross-fade in (0.6s, delay 0.1s), source-tag fade (0.4s, delay 0.5s)
Retreat:    reverso instantaneo (gsap.set autoAlpha:1, y:0)
```

> Para localizar: `grep -n "s-a1-fib4" aulas/cirrose/slide-registry.js`

---

## Historico de reviews Gemini

| Round | Prompt | CSS linhas | Score | Notas |
|-------|--------|-----------|-------|-------|
| R1 | v2.0 | ~3 (bug) | 6.0/10 | Com archetype, CSS parcial |
| R2 | v2.0 | 105 (fallback) | 5.5/10 | Sem archetype, CSS parcial |
| R3 | v2.0 | 271 (section fix) | 4.9/10 | CSS completo, criterios subjetivos |
| R4 | v3.0 | 271 | pendente | Criterios mensuraveis + prova de video |

---

## Tarefa (4 passos obrigatorios)

1. **Recapturar screenshots:** `node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide s-a1-fib4 --video`
2. **Gate 0:** `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-fib4 --inspect` → override ANIMATION_STATE se false positive (systemic)
3. **Gate 2 (NOVO):** Opus Visual Audit — protocolo em `@repo/docs/prompts/gate2-opus-visual.md`. Sharp pick_color + a11y contrast + code analysis + visual multimodal. MUST FAIL bloqueia Gate 4.
4. **Gate 4 R4:** `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-fib4 --editorial --round 4 --ref-slide s-a1-baveno`

Gate 2 e primeira execucao do protocolo. Vai pegar E52, dead CSS, contrastes reais.
Prompt v3.0: criterios mensuraveis, prova de video com timestamps, propostas com fonte+criterio.
Apos Gate 4: implementar propostas aprovadas por Lucas → recapturar → re-run ate score >=7.

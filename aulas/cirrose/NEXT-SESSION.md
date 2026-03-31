# NEXT-SESSION — Proximo trabalho

> Contexto para rehidratacao. Atualizado: 2026-04-01.

---

## Venue — TV Samsung (dados confirmados 2026-03-30)

| Metrica | Valor | Impacto |
|---------|-------|---------|
| TV | Samsung UN55F6400 (2013), 55", Full HD 1920x1080 nativo, 16:9 |
| screen (browser) | 1280x800 — provavelmente scaling/nao-fullscreen. Nativo e 1080p |
| devicePixelRatio | 2.5 (do laptop conectado, nao da TV) |
| Distancia | ~6m |

**Calculos de legibilidade a 6m em TV 55":**
- Pixel fisico ~ 0.63mm (1920px / 121.7cm)
- `--text-caption` clamp(11px) ~ 7mm fisico → **no limite** a 6m
- `--text-small` clamp(14px) ~ 9mm → aceitavel
- `--text-body` clamp(18px) ~ 11mm → OK
- Source-tags sao o ponto critico

**Acoes pendentes:**
- Testar fullscreen 1920x1080 (resolucao real da TV)
- Revisar `--text-caption` minimo: 11px pode ser pequeno demais a 6m. Considerar 13-14px min

---

## Prioridade 1: s-a1-cpt — Visual Redesign

### Estado atual (2026-04-01)

Gate 4 v3.0 R10 (3 chamadas paralelas):
- **Visual: 4.6/10** — distribuicao(4), proporcao(5), cor(5), tipografia(5), composicao(4)
- **UX+Code: 8.4/10** — gestalt(7), carga_cognitiva(9), info_design(8), css_cascade(8), failsafes(10)
- **Motion: 9.0/10** — timing(9), easing(9), narrativa(10), crossfade(9), artefatos(8)

**Problemas visuais identificados (Call A):**
- Layout colapsado: S0 elementos dispersos sem coesao, S2 whitespace morto massivo
- Tags de variaveis (Bili, Alb) minusculas para projecao a 6m
- Transicao S0→S2 destroi continuidade visual (parecem dois slides costurados)
- Sem ancora visual clara em nenhum estado

**CSS fixes ja aplicados nesta sessao:**
- Spacing: gap var(--space-sm/xs) em .archetype-flow, .scores-era, .cpt-nodes
- Source-tag: font-family var(--font-body) (era --font-mono)
- CTP sidebar: scale pulse animation apos nodes stagger
- P1 ceiling-result: cor neutra (--text-primary/--border) em vez de --danger
- P2 transform-origin: bottom center em .cpt-surgery-stat

**Sequencia:**
1. Decidir: redesign visual s-a1-cpt OU avancar s-a1-meld
2. Se redesign: refazer layout S0/S2 para fill ratio + composicao
3. Recapturar + Gate 4 R11

### Historico de rounds

| Round | Score | Pipeline | Status |
|-------|-------|----------|--------|
| R1 | 5.2 | v1 (single) | CSS incompleto |
| R2 | 7.7 | v1 | Stub removido, autoAlpha |
| R3 | 8.3 | v1 | Source-tag, color semantics |
| R4 | 8.3 | v1 | Dead CSS, padding |
| R5 | 7.5 | v1 | Parcial |
| R6 | 7.7 | v1 | Grid stack, kappa fix |
| R7 | 8.6 | v2.2 | CSS P1-P4, Von Restorff |
| R8 | 9.3 | v2.2 | REJEITADO — sycophantic (visual=9.3, real=2.7) |
| R9 | 7.5 | v3.0 (3-call) | Primeiro teste. Call B truncado (317 tok) |
| R10 | 7.3 | v3.0 (3-call) | Visual 4.6 | UX+Code 8.4 | Motion 9.0. HONESTO. |

Gate 0: PASS.
Gate 2: PASS (v1.1 pronta, nao re-rodada).

---

## Prioridade 2: s-a1-meld → s-cp1

Research completo para ambos (evidence-db atualizado):
- s-a1-meld: 9 rows, 17 PMIDs (MELD derivation, MELD-Na, MELD 3.0, Brazil, sex bias, sarcopenia)
- s-cp1: 4 rows, 11 PMIDs (Baveno VII, PREDESCI, alcohol LSM overestimation, carvedilol)

s-cp1 tem narrativeCritical=true. Cascata LSM 26 kPa ja resolvida em todas 9 superficies.

**Sidebar evolui paulatinamente:** dados e complicacoes entram progressivamente no panel card.

---

## Pendencias — Pipeline & Prompts

### Gate 4 Call C (Motion) — precisa melhorar
**Problema:** Motion deu 9/10, longe da realidade. Nao e so sycophancy — falta criterio profissional de motion design. Gemini Pro nao tem vocabulario nem baseline de motion design de elite (Apple Keynote, After Effects, Principle).
**Acoes possiveis:**
- Enriquecer prompt com criterios de motion design profissional (12 principios de animacao, anticipation, follow-through, secondary action)
- Adicionar exemplos concretos de penalizacao (stagger uniforme = mecanico, countUp sem pausa = decorativo)
- Considerar benchmark: gravar video de referencia WWDC/TED para calibrar notas
- Talvez usar modelo diferente para motion (ex: Gemini com thinking budget maior)

### Gate 2 — redesign
Separar atencao Opus (visual vs code) como foi feito no Gate 4. Planejar na proxima sessao.

### MELD 3.0 Brasil — pesquisa incorreta
Lucas tem documentos oficiais mostrando MELD 3.0 entrando/em vigor ate 2026-03-31. Tanto Gemini quanto medical-researcher disseram que nao foi adotado. Requer pesquisa direcionada com docs oficiais como input.

---

## Erros recentes relevantes

- **E066** (HIGH, RESOLVIDO): FOUC intra-slide — era children flash antes de postAnim.
- **E067** (HIGH, RESOLVIDO): Gate 4 cego a motion + cor semantica. Fix: Gate 4 v3.0 (3 chamadas paralelas com atencao separada).

---

## Infra

- **guard-product-files:** SUPRIMIDO (echo stub em settings.json). RE-HABILITAR apos sprint.
- **Sprint mode:** `SPRINT_MODE=1` disponivel para hooks.
- **GEMINI_API_KEY:** OK. **PERPLEXITY_API_KEY:** ausente.

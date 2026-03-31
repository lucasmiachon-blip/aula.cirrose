# NEXT-SESSION — Proximo trabalho

> Contexto para rehidratacao. Atualizado: 2026-03-31.

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

## Prioridade 1: s-a1-cpt — Gate 4 R8

### Estado atual (2026-03-31)

**Fixes aplicados (R4-R7 + manuais):**
- Grid stack (no absolute positioning)
- Dead CSS removido (~160 linhas)
- Anti-flash E66 (CSS + JS pre-hide para S1/S2 children)
- H2 encurtado, PMIDs adicionados
- Source-tag: always visible, font-mono, text-muted (consistente com outros slides)
- Color semantic: danger removido S0, Von Restorff S1 only (scale 1.16, box-shadow)
- Ceiling result: --danger (bg-danger-light + border)
- align-items: center no .scores-era-track
- overflow-y: hidden removido de .scores-era
- Sidebar: CTP A(5) + LSM visivel ('—') + complications (VE, HDA, Ascite, HE, HCC)

**O que FALTA:**
- S0 cores insatisfatorias (Lucas < 3/10) — hierarquia visual fraca
- Screenshots desatualizados (sidebar mudou: LSM + complications adicionados)
- Gate 4 R8 com prompt v2.2 (nao rodado ainda)

**Prompts atualizados:**
- Gate 4 v2.2: §1D per-state composition, §1E cross-state consistency, M6 clipping, M7 layout shift
- Gate 2 v1.1: C6 cross-state, C7 per-state, S1 blind spot explicito

**Sequencia:**
1. `npm run dev` (port 4100)
2. Recapturar: `node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide s-a1-cpt --video`
3. Gate 0: `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-cpt --inspect`
4. Gate 2 conversacional (sharp + a11y)
5. Gate 4 R8: `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-cpt --editorial --round 8`
6. Lucas aprova → fixes → recapturar → loop ate PASS

### Historico de rounds

| Round | Score | Status |
|-------|-------|--------|
| R1 | 5.2 | CSS incompleto |
| R2 | 7.7 | Stub removido, autoAlpha |
| R3 | 8.3 | Source-tag, color semantics, guideline font |
| R4 | 8.3 | Dead CSS, padding, source-tag failsafe |
| R5 | 7.5 | Parcial — dead CSS, failsafes |
| R6 | 7.7 | Grid stack, kappa fix, cor semantica |
| R7 | 8.6 | CSS P1-P4, source-tag always visible, Von Restorff enhanced |

Gate 0: PASS.
Gate 2: PASS (v1.1 pronta, nao re-rodada).

---

## Prioridade 2: s-a1-meld → s-cp1

Research completo para ambos (evidence-db atualizado):
- s-a1-meld: 9 rows, 17 PMIDs (MELD derivation, MELD-Na, MELD 3.0, Brazil, sex bias, sarcopenia)
- s-cp1: 4 rows, 11 PMIDs (Baveno VII, PREDESCI, alcohol LSM overestimation, carvedilol)

s-cp1 tem narrativeCritical=true. Cascata LSM 26 kPa ja resolvida em todas 9 superficies.

**Sidebar evolui paulatinamente:** dados e complicacoes entram progressivamente no panel card. Cada slide adiciona conceito novo ao sidebar — nao customizado por slide, mas sim narrativamente progressivo.

---

## Erros recentes relevantes

- **E066** (HIGH, RESOLVIDO): FOUC intra-slide — era children flash antes de postAnim. Fix: CSS anti-flash + JS pre-hide.
- **E067** (HIGH, MITIGADO): Gate 4 cego a motion + cor semantica. Fix: prompt v2.2 com §1D, §1E, M6, M7. Validar no R8.

---

## Infra

- **guard-product-files:** SUPRIMIDO (echo stub em settings.json). RE-HABILITAR apos sprint.
- **Sprint mode:** `SPRINT_MODE=1` disponivel para hooks.
- **GEMINI_API_KEY:** OK. **PERPLEXITY_API_KEY:** ausente.

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

## Prioridade 1: s-a1-cpt — cores + re-QA

### Estado atual (2026-03-31, commit `636e78f`)

**O que ja foi feito (R4-R6 + fixes manuais):**
- Grid stack (no absolute positioning)
- Dead CSS removido (~160 linhas)
- Anti-flash E66 (CSS + JS pre-hide para S1/S2 children)
- H2 encurtado, "Insubstituivel" removido, PMIDs adicionados
- Source-tag: max-width 85%, overflow-wrap, centered
- Color semantic: danger removido do S0, Von Restorff S1 (only C has bg+border)
- Ceiling result: neutro (bg-card + border, nao warning/danger)
- Surgery stats: progressao none → outline → fill+border

**O que FALTA (Lucas insatisfeito com cores S0):**
- S0 ainda tem repeticao de cores (amber em nodes + kappa + ceiling area)
- Hierarquia visual nao esta clara — olho nao sabe onde ir primeiro
- Lucas quer entrar no loop de cor antes de re-rodar QA
- Gate 4 prompt agora atualizado com MUST checks para cor semantica + motion (commit `636e78f`)

**Sequencia proposta:**
1. Lucas ajusta cores ao vivo (ou co-design com Gemini MCP)
2. Recapturar screenshots
3. Gate 0 → Gate 2 → Gate 4 R7 com prompt melhorado
4. Se score > 8.5 → DONE*

### Historico de rounds

| Round | Score | Status |
|-------|-------|--------|
| R1 | 5.2 | CSS incompleto |
| R2 | 7.7 | Stub removido, autoAlpha |
| R3 | 8.3 | Source-tag, color semantics, guideline font |
| R4 | 8.3 | Dead CSS, padding, source-tag failsafe |
| R5 | 7.5 | Parcial — dead CSS, failsafes, padding restaurado |
| R6 | 7.7 | Grid stack, kappa fix, cor semantica |

Gate 0: PASS (state machine exempted).
Gate 2: PASS (0 MUST FAIL).

---

## Prioridade 2: s-a1-meld → s-cp1

Sequencia Act 1. s-cp1 tem narrativeCritical=true (cascata LSM 26 kPa).
**s-cp1 requer aprovacao Lucas** — H2 e LSM desatualizados (21→26 kPa).

---

## Prioridade 3: Research pipeline com MCPs

Workflow dual-channel:
1. `node content-research.mjs --slide {id}` (Gemini, v3 com Tier-1 list)
2. Claude MCPs: SCite → PubMed → Consensus → Gemini deep-research
3. Cross-validation checklist (10 criterios)

---

## Erros recentes relevantes

- **E066** (HIGH): FOUC intra-slide — era children flash antes de postAnim. Fix: CSS anti-flash + JS pre-hide. Regra em slide-rules.md §5.
- **E067** (HIGH, PENDENTE): Gate 4 cego a motion + cor semantica. Fix: prompt atualizado com MUST checks. Validar no proximo R7.

---

## Prompt improvements (2026-03-31, commit `636e78f`)

### Gate 4 (`gemini-gate4-editorial.md` + `gemini-qa3.mjs`)
- **Dimensao 2 (cor):** 5 MUST checks — danger=clinico only, Von Restorff diluicao, arco entre estados
- **Dimensao 4 (motion):** 4 MUST checks via video — FOUC/flash, full-slide transitions, stagger, countUp
- **Animation Part B:** pontos 6 (cor semantica) e 7 (hierarquia) por transicao
- **Impressao:** auditoria de hierarquia (eye path) por estado
- **Scoring:** cor sem arco cross-state = max 6/10. Motion sem video = max 5/10.

# NEXT-SESSION — Proximo trabalho

> Contexto para rehidratacao. Atualizado: 2026-03-30.

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
- Testar fullscreen 1920x1080 (resolucao real da TV) — slides podem subir de Plan C 1280x720 para 1080p
- Revisar `--text-caption` minimo: 11px pode ser pequeno demais a 6m. Considerar 13-14px min
- Source-tags com 3+ citacoes: testar legibilidade nessa configuracao
- Prompt Gate 4 ja atualizado com contexto venue (sala TV 55" 1080p, 6m)

---

## Prioridade 1: Re-rodar QA s-a1-cpt R4

Scripts e prompts foram melhorados (commit `3e03eb6`). Mudancas relevantes para R4:

| Mudanca | Impacto esperado em R4 |
|---------|------------------------|
| extractSlideCSS multi-section (A1) | CSS completo enviado, nao mais stub |
| extractArchetypeCSS filtrado (A2) | Menos dead CSS reportado, craft_frontend nao penalizado |
| Auto --ref-slide (A3) | Comparacao automatica com s-a1-rule5 (slide anterior) |
| Dead CSS scoping (B1) | Gemini so penaliza dead CSS no bloco slide-specific |
| Cross-slide parallelism (B2) | Consistencia tipografica/spacing verificada vs rule5 |
| Color semantics (B3) | Semantica clinica verificada (danger/warning/safe) |
| State machine exemption (C1) | Gate 0 ANIMATION_STATE nao mais false positive |

**Sequencia:**
1. Re-rodar screenshots (`qa-batch-screenshot.mjs --slide s-a1-cpt --video`)
2. Gate 0 (deve dar PASS, state machine exempted)
3. Gate 2 (Opus visual — MCP sharp + a11y + Read)
4. Gate 4 (Gemini editorial R4 — comparar score vs R3 8.3/10)

**Dead CSS cleanup (~80 linhas orfas):** Lucas cancelou P3 na R2. Reavaliar se R4 score > 8.5.

---

## Prioridade 2: s-a1-meld → s-cp1

Sequencia Act 1. s-cp1 tem narrativeCritical=true (cascata LSM 26 kPa).

**s-cp1 requer aprovacao Lucas** — H2 e LSM desatualizados (21→26 kPa).

---

## Prioridade 3: Research pipeline com MCPs

Testar o workflow dual-channel melhorado no proximo slide que precisar de pesquisa:
1. `node content-research.mjs --slide {id}` (Gemini, v3 com Tier-1 list)
2. Claude MCPs: SCite → PubMed → Consensus → Gemini deep-research (protocolo D3)
3. Cross-validation checklist (10 criterios com regras de resolucao)

---

## Dados da sessao anterior (referencia)

| Round | Score | Fixes aplicados |
|-------|-------|-----------------|
| R1 | 5.1 | (CSS incompleto — 186 linhas) |
| R2 | 7.7 | Stub removido (587 linhas), kappa h3, autoAlpha |
| R3 | 8.3 | Source-tag CSS, color semantics danger→ui-accent, guideline font-body, kappa alignment |

Gate 0: PASS (ANIMATION_STATE false positive aceito — agora corrigido no prompt).
Gate 2: PASS (0 MUST FAIL, kappa AAA miss aceitavel).

---

## Mudancas implementadas nesta sessao (2026-03-30, commit `3e03eb6`)

### Script `gemini-qa3.mjs`
- **A1** extractSlideCSS: coleta TODOS os blocos CSS matching (nao para no primeiro)
- **A2** extractArchetypeCSS: filtra sub-selectors ausentes no HTML do slide (com fallback safety)
- **A3** auto --ref-slide do manifest prev; `--no-ref` para desabilitar

### Prompt `gemini-gate4-editorial.md`
- **B1** Dead CSS scoped ao bloco slide-specific (tokens/archetype = contexto)
- **B2** Secao CONSISTENCIA CROSS-SLIDE com 5 eixos (quando REF presente)
- **B3** Color semantics clinica: danger/warning/safe com definicao explicita

### Prompt `gemini-gate0-inspector.md`
- **C1** ANIMATION_STATE: state machines exempted (conteudo DIFERENTE != defeito)

### Research `content-research.mjs` + docs
- **D1** SOURCE PRIORITY 1-5, lista Tier-1 hepatologia, PMID verification obrigatoria
- **D2** Cross-validation checklist com regras de resolucao
- **D3** CLAUDE OPUS PROTOCOL: SCite → PubMed → Consensus → Gemini deep-research

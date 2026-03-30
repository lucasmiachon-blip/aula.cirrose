# NEXT-SESSION — Proximo trabalho

> Contexto para rehidratacao. Atualizado: 2026-03-30.

---

## Venue — Dados da TV (2026-03-30)

| Metrica | Valor | Impacto |
|---------|-------|---------|
| TV | Samsung UN55F6400 (2013), 55", Full HD 1920x1080 nativo, 16:9 |
| screen (browser) | 1280x800 — provavelmente scaling/nao-fullscreen. Nativo e 1080p |
| devicePixelRatio | 2.5 (do laptop conectado, nao da TV) |
| Distancia | ~6m |

**Calculos de legibilidade a 6m em TV 55":**
- Pixel fisico ≈ 0.63mm (1920px / 121.7cm)
- `--text-caption` clamp(11px) → ~7mm fisico → **no limite** a 6m
- `--text-small` clamp(14px) → ~9mm → aceitavel
- `--text-body` clamp(18px) → ~11mm → OK
- Source-tags sao o ponto critico

**Acoes derivadas:**
- Testar fullscreen 1920x1080 (resolucao real da TV) — slides podem subir de Plan C 1280x720 para 1080p
- Revisar `--text-caption` minimo: 11px pode ser pequeno demais a 6m. Considerar 13-14px min
- Atualizar prompt Gate 4 context: "Sala: TV Samsung 55" 1080p, 6m"
- Source-tags com 3+ citacoes: testar legibilidade nessa configuracao

---

## Prioridade 1: Revisar scripts QA e prompts Gate 4

**Por que:** Gate 4 R3 chegou a 8.3/10 mas o resultado esta aquem. Problemas identificados:

### Problemas no script `gemini-qa3.mjs`

1. **CSS extraction fragil:** `extractSlideCSS()` faz forward scan e para no PRIMEIRO bloco com boundary `━━━` contendo o slideId. Se houver um stub/comentario legacy antes do bloco real, extrai o bloco errado. Fix parcial feito (removeu stub de s-a1-cpt), mas o algoritmo continua fragil para outros slides.
   - Arquivo: `aulas/cirrose/scripts/gemini-qa3.mjs` L152-230
   - Sugestao: extrair TODOS os blocos contendo slideId, nao so o primeiro.

2. **Archetype CSS traz dead CSS:** `extractArchetypeCSS()` envia o bloco inteiro do archetype (ex: `.archetype-flow` inclui `.flow-step`, `.flow-cascade` etc). Gemini marca como dead CSS, poluindo o scorecard craft_frontend. Filtrar sub-seletores nao usados no HTML.
   - Arquivo: `aulas/cirrose/scripts/gemini-qa3.mjs` L243-277

3. **Sem --ref-slide automatico:** O script nao envia automaticamente o PNG do slide anterior para comparacao cross-slide. Precisa de `--ref-slide` manual. Considerar tornar default (ler prev de metadata).

### Problemas no prompt `gemini-gate4-editorial.md`

1. **Gemini confunde "dead CSS enviado" com "dead CSS do projeto":** O prompt pede Dead CSS analysis, mas Gemini nao distingue entre CSS que esta no arquivo (para outros slides) vs CSS que nao deveria existir. Clarificar no prompt.

2. **Scorecard craft_frontend penaliza CSS compartilhado:** Classes como `.scores-era-boxes` sao usadas por outros slides mas nao por este. O prompt precisa instruir: "Dead CSS = seletor no material que nao matcha nenhum elemento no HTML DESTE slide. Isso e informativo, NAO penaliza craft."

3. **Falta instrucao de paralelismo tipografico:** O prompt nao pede comparacao de font-family, font-weight, text-align com slides adjacentes. Adicionar secao de "consistencia cross-slide" que requer --ref-slide.

4. **Color semantics nao verificada:** O prompt pede uso de tokens mas nao questiona SE a cor semantica esta correta para o contexto clinico. Adicionar: "danger = risco clinico real. warning = investigar. safe = manter. Se danger esta usado para enfase teorica, flaggear como SHOULD."

### Arquivos a revisar

| Arquivo | O que verificar |
|---------|----------------|
| `aulas/cirrose/scripts/gemini-qa3.mjs` | extractSlideCSS, extractArchetypeCSS, --ref-slide auto |
| `docs/prompts/gemini-gate4-editorial.md` | Dead CSS instrucao, paralelismo, color semantics |
| `docs/prompts/gemini-gate0-inspector.md` | ANIMATION_STATE false positive recorrente em state machines |

---

## Prioridade 2: Finalizar s-a1-cpt (R4)

Apos revisao de scripts, re-rodar Gate 4 com prompt melhorado. Dead CSS cleanup (~80 linhas orfas) pendente (Lucas cancelou P3 na R2, reavaliar).

## Prioridade 3: s-a1-meld → s-cp1

Sequencia Act 1. s-cp1 tem narrativeCritical=true (cascata LSM 26 kPa).

---

## Dados da sessao QA (para referencia)

| Round | Score | Fixes aplicados |
|-------|-------|-----------------|
| R1 | 5.1 | (CSS incompleto — 186 linhas) |
| R2 | 7.7 | Stub removido (587 linhas), kappa h3, autoAlpha |
| R3 | 8.3 | Source-tag CSS, color semantics danger→ui-accent, guideline font-body, kappa alignment |

Gate 0: PASS (ANIMATION_STATE false positive aceito — state machine).
Gate 2: PASS (0 MUST FAIL, kappa AAA miss aceitavel).

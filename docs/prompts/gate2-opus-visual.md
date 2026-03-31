# Gate 2 — Opus Visual Audit

> Protocolo conversacional. Claude Opus executa usando MCP tools (sharp, a11y).
> Custo: $0 (Max subscription). Roda APOS Gate 0, ANTES de Gate 4.
> MUST failures bloqueiam Gate 4 (nao gastar Gemini API em slide com defeito mensuravel).
> Criado: 2026-03-30. v1.1: 2026-03-31 (cross-state consistency, S1 blind spot).

---

## Prerequisites

1. Screenshots capturados: `qa-batch-screenshot.mjs --slide {id} --video`
2. Gate 0 PASS: `gemini-qa3.mjs --slide {id} --inspect`
3. Dev server NAO precisa estar ativo (analise offline de PNGs + code)

## Inputs

| Input | Origem | Uso |
|-------|--------|-----|
| PNG S2 (estado final) | `qa-screenshots/{id}/{id}_*_S2.png` | Layer A (sharp) + Layer C (visual) |
| PNG S0 (estado inicial) | `qa-screenshots/{id}/{id}_*_S0.png` | Layer C (comparacao) |
| metrics.json | `qa-screenshots/{id}/metrics.json` | Coordenadas bounding boxes |
| Raw HTML | `slides/{NN}-{slug}.html` | Layer B (code) + Layer A (a11y) |
| Raw CSS (slide section) | `cirrose.css` secao do slide | Layer B (code) |
| Raw JS (se custom anim) | `slide-registry.js` | Layer B (code) |

---

## Layer A — Instrumental (sharp + a11y)

Numeros concretos, zero subjetividade. Cada medida tem valor esperado e threshold.

### A1. Carregar PNG e verificar dimensoes

```
sharp create_session_by_path → PNG S2
sharp get_dimensions → esperado: 2560x1440 (@2x de 1280x720)
```

Se dimensoes erradas → MUST FAIL. Screenshot config incorreta.

### A2. Grid padrao de amostragem (5 pontos)

Coordenadas de `metrics.json`, multiplicadas por 2 (deviceScaleFactor).

| # | Ponto | Coordenada viewport | Coordenada PNG (@2x) | O que mede |
|---|-------|--------------------|--------------------|------------|
| 1 | Background | fixo (10, 10) | (20, 20) | Cor superficie |
| 2 | H2 texto | elements.h2.centerX, centerY | x*2, y*2 | Cor headline |
| 3 | Section-tag | elements.section-tag.center | x*2, y*2 | Cor tag |
| 4 | Source-tag | elements.source-tag.center | x*2, y*2 | Cor citacao |
| 5 | Slide-inner centro | elements.slide-inner.center | x*2, y*2 | Bg area conteudo |

Para cada ponto: `sharp pick_color(sessionId, x, y, radius=5)` → hex.

### A3. Pontos adaptativos (2-4, por slide)

Apos visualizar o PNG (Layer C), identificar pontos adicionais:
- Cards com cor semantica (safe/warning/danger)
- Textos que aparentam baixo contraste
- Hero numbers ou dados destaque
- Bordas de superficie (bg-card, bg-elevated)

### A4. Verificacao de contraste WCAG

Para CADA par foreground/background amostrado:

```
a11y check_color_contrast(foreground=hex, background=hex, fontSize=estimado, isBold=bool)
```

Thresholds:
- Body text (>=18px): WCAG AA = 4.5:1, AAA = 7:1
- Large text (>=24px ou >=18.67px bold): WCAG AA = 3:1, AAA = 4.5:1
- Caption/small (<=14px): WCAG AA = 4.5:1 (obrigatorio)

### A5. Verificacao a11y do HTML

```
a11y test_html_string(html=raw_html_do_slide)
```

Reportar violations como SHOULD.

### A6. Comparacao com tokens esperados

Comparar hex amostrado com HEX de referencia (design-reference.md):
- `--bg-surface` = #f5f5f7 (stage-c) ou #0d1a2d (slide-navy)
- `--text-primary` = ~oklch(13% 0.02 258)
- `--safe` = ~#2a8a7a, `--warning` = ~#c4922a, `--danger` = ~#cc4a3a

Tolerancia: deltaE perceptual. Desvio grande (cor visivelmente diferente) = SHOULD.

---

## Layer B — Code Analysis (Read + Grep)

Bugs invisiveis no screenshot mas reais em producao.

### B1. E52 — vw/vh em font-size

Grep CSS do slide por `font-size:` contendo `vw` ou `vh`.
Qualquer match (mesmo dentro de `clamp()`) = MUST. deck.js `scaleDeck()` invalida vw.

### B2. Dead CSS

Para cada seletor CSS na secao do slide:
1. Extrair nome do seletor (classe ou ID)
2. Grep HTML por match
3. Seletor sem match = dead CSS → SHOULD

### B3. Failsafes

Grep CSS por:
- `.no-js` regras cobrindo elementos animados deste slide → MUST se ausente
- `.stage-bad` regras cobrindo elementos animados → MUST se ausente
- `visibility` junto com `opacity` nos failsafes → SHOULD se ausente

### B4. Token compliance

Grep CSS do slide por cores literais (hex, rgb, hsl, oklch) FORA de:
- `var()` calls
- `@supports` fallback blocks
- Comentarios

Qualquer match = MUST (exceto `color-mix` e fallbacks documentados).

### B5. GSAP/CSS race

Se slide tem custom animation em `slide-registry.js`:
1. Listar propriedades controladas por GSAP (autoAlpha, x, y, opacity, scale)
2. Listar propriedades controladas por CSS transitions/animations
3. Overlap = SHOULD warn (funcional se failsafes existem)

### B6. metrics.json checks

| Check | Threshold | Severidade |
|-------|-----------|------------|
| fillRatio S0 | 0.50-0.90 (depende tipo slide) | SHOULD se fora |
| bodyWordCount | <= 30 | MUST se > 30 |
| h2.lines | <= 2 | MUST se > 2 |
| hasPanelOverlap | false | MUST se true |
| hasSourceTag | true | SHOULD se false |

---

## Layer C — Visual Assessment (Read multimodal)

Opus olha o PNG e avalia o que instrumentos nao pegam.

### C1. Hierarquia visual
- Hero element presente? Tamanho 2-3x corpo?
- F-pattern ou Z-pattern reconhecivel?
- Von Restorff aplicado (1 elemento dominante)?

### C2. Whitespace
- Espaco vazio e intencional (respiro) ou acidental (layout quebrado)?
- Padding consistente com design tokens?

### C3. Tipografia
- Fontes renderizam corretamente na escala do screenshot?
- Hierarquia clara (display > h2 > body > small > caption)?

### C4. Cor semantica
- safe/warning/danger correspondem ao significado clinico?
- Icone de reforco presente junto a cor (daltonismo)?

### C5. Completude S2 vs S0
- S2 tem todos elementos esperados apos click-reveals?
- Source-tag visivel e legivel em S2?
- Sem overlap acidental entre estados?

### C6. Consistencia cross-state (NOVO v1.1)

Para slides multi-estado (data-era, click-reveal):

**Elementos persistentes:** Verificar no CSS/JS se estes elementos sao visiveis em TODOS os estados:
- source-tag: CSS visibility/opacity? GSAP controla autoAlpha? Em qual estado aparece?
- section-tag (ATO N): posicao fixa ou move entre estados?
- h2: sempre visivel?
- sidebar panel: estado muda entre eras?

**Clipping potencial:** Verificar no CSS se `.scores-era` ou container similar tem `overflow: hidden`. Se sim, e conteudo de alguma era pode exceder o container (calcular baseado em font-size + padding + gap), marcar como SHOULD.

**Ponto cego S1:** Gate 2 so tem PNGs de S0 e S2. Estados intermediarios (S1, etc.) so sao visiveis no video (Gate 4). Listar explicitamente o que NAO pode verificar:
```
PONTO CEGO: S1 nao verificado (sem PNG). Depende de Gate 4 (video).
Elementos em S1 que precisam atencao do Gate 4: [listar baseado no HTML]
```

### C7. Composicao per-state (NOVO v1.1)

Para CADA estado com PNG disponivel (S0, S2):
- Fill ratio: visualmente, quanto da area util o conteudo ocupa?
- Hierarquia: caminho do olho claro?
- Respiro: equilibrado ou vazio excessivo?
- Nota: __/10

**Flag:** Se S0 ou S2 tem composicao <=5, marcar como SHOULD com descricao do problema.

---

## Output

### Formato do relatorio (mostrar ao Lucas)

```markdown
## Gate 2 — Opus Visual Audit: {slide-id}

### Layer A — Instrumental

**Dimensoes:** {width}x{height} — {PASS/FAIL}

| # | Ponto | Hex medido | Token esperado | Delta |
|---|-------|-----------|---------------|-------|
| 1 | Background | #?????? | --bg-surface #f5f5f7 | OK/DESVIO |
| 2 | H2 texto | #?????? | --text-primary | OK/DESVIO |
| ... | | | | |

| Par | Foreground | Background | Ratio | AA | AAA | Veredito |
|-----|-----------|-----------|-------|----|----|---------|
| H2 vs BG | #?????? | #?????? | ??:1 | P/F | P/F | PASS/FAIL |
| ... | | | | | | |

a11y violations: {count} ({lista})

### Layer B — Code Analysis

| Check | Resultado | Sev |
|-------|----------|-----|
| E52 vw/vh | {PASS/detalhes} | MUST |
| Dead CSS | {N seletores} | SHOULD |
| Failsafes .no-js | {PASS/MISSING} | MUST |
| Failsafes .stage-bad | {PASS/MISSING} | MUST |
| Token compliance | {PASS/N violacoes} | MUST |
| GSAP/CSS race | {PASS/detalhes} | SHOULD |
| Fill ratio | {valor} | SHOULD |
| Body words | {valor}/30 | MUST |

### Layer C — Visual

{Prosa curta: hierarquia, whitespace, tipografia, cor semantica, completude}

### Veredito

**{PASS / CONDITIONAL / FAIL}**

Blockers (MUST): {lista ou "nenhum"}
Warnings (SHOULD): {lista ou "nenhum"}
```

### Salvar historico

Salvar relatorio em `qa-screenshots/{slide-id}/gate2-report.md`.

---

## Severidades

| Nivel | Significado | Bloqueia Gate 4? |
|-------|-----------|-----------------|
| MUST | Defeito mensuravel, fix obrigatorio | Sim |
| SHOULD | Warning, anotar para Gate 4 | Nao |
| COULD | Polish opcional | Nao |

### MUST (bloqueiam Gate 4)

- Contraste WCAG < 4.5:1 body ou < 3:1 large
- E52 (vw/vh em font-size)
- Failsafe .no-js ausente para elemento animado
- Failsafe .stage-bad ausente
- Cores hardcoded (nao var()) em CSS slide-scoped
- PNG dimensoes erradas (nao 2560x1440)
- bodyWordCount > 30
- h2.lines > 2
- hasPanelOverlap = true

### SHOULD (nao bloqueiam)

- Dead CSS (seletor sem match)
- GSAP/CSS race
- Contraste entre 4.5:1 e 7:1 (AA ok, AAA nao)
- Fill ratio fora do ideal para tipo de slide
- Source-tag ausente
- a11y violations do HTML
- Desvio de cor vs token (menor)

---

## Integracao no pipeline

```
Screenshots (qa-batch-screenshot.mjs)
  |
Gate 0 — Defeitos binarios (Gemini, $0.002)
  | MUST PASS
Gate 2 — Opus Visual Audit (Claude, $0)    <-- este protocolo
  | MUST PASS
Gate 4 — Editorial review (Gemini, $0.03-0.08)
  | CHECKPOINT LUCAS
Fix + re-audit loop
```

Gate 2 MUST FAIL → fix code → re-screenshot → re-run Gate 2. Nao avanca para Gate 4.

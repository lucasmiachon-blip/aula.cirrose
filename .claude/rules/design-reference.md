# Design Reference — Tokens, Princípios, Dados Médicos

> Canônico. Merge de: design-system, design-principles, medical-data.

---

## 1. Cores OKLCH

### Hues
```css
:root {
  --hue-primary: 258;  /* Navy */
  --hue-safe: 170;     /* Teal */
  --hue-warning: 85;   /* Amber */
  --hue-danger: 25;    /* Red */
  --hue-downgrade: 55; /* Ocre */
  --hue-accent: 270;   /* Roxo */
}
```

### Superfícies
```css
:root {
  --bg-surface:  oklch(97% 0.005 258);   /* HEX: #f5f5f7 */
  --bg-card:     oklch(99% 0.003 258);
  --bg-elevated: oklch(100% 0 0);
  --bg-deep:     oklch(18% 0 0);          /* HEX: #111111 */
  --bg-navy:     oklch(22% 0.042 258);    /* HEX: #0d1a2d */
  --bg-navy-mid: oklch(28% 0.035 258);
}
```

**HEX é a verdade.** Se OKLCH divergir, HEX vence.

### Texto
```css
:root {
  --text-primary:       oklch(13% 0.02 258);
  --text-secondary:     oklch(35% 0.01 258);
  --text-muted:         oklch(48% 0.008 258);
  --text-on-dark:       oklch(95% 0.005 258);
  --text-on-dark-muted: oklch(70% 0.01 258);
}
```

### UI Accent (chrome/progress/tags — NUNCA clínico)
```css
:root {
  --ui-accent:         oklch(35% 0.12 258);
  --ui-accent-light:   oklch(92% 0.03 258);
  --ui-accent-on-dark: oklch(75% 0.14 258);
}
```

### Cores Semânticas Clínicas

ΔL ≥ 10% entre safe/warning/danger. Reforço ícone obrigatório: ✓ (safe), ⚠ (warning), ✕ (danger), ↓ (downgrade).

```css
:root {
  /* Safe / Teal — L=40 */
  --safe:         oklch(40% 0.12 170);
  --safe-light:   color-mix(in oklch, var(--safe) 15%, oklch(97% 0 0));
  --safe-on-dark: oklch(75% 0.13 170);

  /* Warning / Amber — L=60 */
  --warning:          oklch(60% 0.13 85);
  --warning-light:    color-mix(in oklch, var(--warning) 15%, oklch(97% 0 0));
  --warning-on-dark:  oklch(80% 0.14 85);
  --warning-on-light: oklch(45% 0.10 85);

  /* Danger / Red — L=50 */
  --danger:          oklch(50% 0.18 25);
  --danger-light:    color-mix(in oklch, var(--danger) 15%, oklch(97% 0 0));
  --danger-on-dark:  oklch(72% 0.16 25);

  /* Downgrade / Ocre — L=30 (auxiliar, sempre com ↓) */
  --downgrade:          oklch(30% 0.08 55);
  --downgrade-light:    color-mix(in oklch, var(--downgrade) 15%, oklch(97% 0 0));
  --downgrade-on-dark:  oklch(68% 0.10 55);
}
```

**Semântica:** safe=manter conduta, warning=investigar, danger=intervir, downgrade=rebaixar evidência, ui-accent=chrome (NUNCA clínico).

### Paleta de Dados (gráficos — NÃO semântica clínica)
```css
:root {
  /* Tol High-contrast (2-3 séries) */
  --cmp-1: #004488; --cmp-2: #DDAA33; --cmp-3: #BB5566;
  /* Tol Bright (4-7 séries) */
  --data-1: #4477AA; --data-2: #EE6677; --data-3: #228833;
  --data-4: #CCBB44; --data-5: #66CCEE; --data-6: #AA3377; --data-7: #BBBBBB;
}
```

### Separadores + Gamut Fallback
```css
:root {
  --border: oklch(88% 0.005 258); --divider: oklch(92% 0.003 258); --border-navy: oklch(30% 0.02 258);
}
@supports not (color: oklch(50% 0.1 258)) {
  :root {
    --safe: #2a8a7a; --warning: #c4922a; --danger: #cc4a3a;
    --safe-light: #e0f4f0; --warning-light: #f4ecd8; --danger-light: #f4e0dc; --downgrade-light: #f0eadc;
  }
}
```

---

## 2. Tipografia

```css
:root {
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
}
```

`font-display: swap` obrigatório. WOFF2 em `shared/assets/fonts/`.

### Escala
```css
:root {
  --text-hero:    clamp(56px, 4.5vw, 86px);
  --text-h1:      clamp(38px, 3.2vw, 62px);
  --text-h2:      clamp(28px, 2.2vw, 42px);
  --text-h3:      clamp(20px, 1.5vw, 30px);
  --text-body:    clamp(18px, 1.12vw, 26px);
  --text-small:   clamp(14px, 0.9vw, 20px);
  --text-caption: clamp(11px, 0.7vw, 15px);
}
```

**deck.js:** `scaleDeck()` aplica transform → `vw` em `clamp()` refere viewport real, não slide. Os limites min/max governam. Não usar `vw` sem `clamp()`.

| Nível | Font | Peso | Nota |
|-------|------|------|------|
| Título | --font-display | 400 | Serif = autoridade. Plan B: DM Sans 700 |
| Corpo | --font-body | 400 | NUNCA 300 em projetor |
| Dados | --font-body | 400 | tabular-nums lining-nums |

---

## 3. Layout (16:9)

```css
.slide-inner { width:100%; height:100%; padding:60px 80px; display:flex; flex-direction:column; justify-content:flex-start; box-sizing:border-box; }
```

### Spacing
```css
:root {
  --space-xs:8px; --space-sm:16px; --space-md:24px; --space-lg:40px; --space-xl:64px; --space-2xl:96px;
  --radius-sm:8px; --radius-md:12px; --radius-lg:20px;
}
```

### Contraste WCAG
| Combinação | Meta | Status |
|-----------|------|--------|
| --text-primary em --bg-surface | ≥7:1 | ✓ |
| --text-on-dark em --bg-navy | ≥7:1 | ✓ |
| --text-muted em --bg-surface | ≥4.5:1 | ✓ |

---

## 4. Princípios de Design (27)

### Assertion-Evidence (Alley)
`<h2>` = asserção completa. Corpo = APENAS evidência visual. Bullets PROIBIDOS.

### Cognição

| Princípio | FAZER | Anti-padrão |
|-----------|-------|-------------|
| Chunking (Cowan 4±1) | Max 4 items por grupo, 3 ideal | 6+ bullets sem grupo |
| Von Restorff | 1 hero 2-3x maior que corpo | Tudo mesmo tamanho |
| Gestalt Proximidade | Gap interno < ½ gap entre grupos | Espaço uniforme |
| Gestalt Similaridade | Mesmo tipo info = mesma cor/forma | Cards com estilos diferentes |
| Dual Coding (Paivio) | Dado numérico = representação visual | Tabela seca |
| Cognitive Load (Sweller) | Zero decoração/redundância | Gradientes sem função |
| Signaling (Mayer) | Destaque = dado mais importante. Cor = semântica clínica | Cor vibrante sem significado |
| Spatial Contiguity | Label junto ao dado | Número no topo, explicação no rodapé |
| Redundancy | Slide=visual, fala=explicação. Não duplicar | Parágrafo que palestrante lê |
| Contiguidade Temporal | Evidência aparece no instante da fala | Slide completo visível de cara |
| Primacy-Recency | Importante no início e final | Info crítica no minuto 25 |
| Anchoring | Número de contraste ANTES do alvo | Resultado sem referência |

### Andragogia
- **Expertise-Reversal:** Congress = zero revisão básica. Ir direto a NNT/GRADE/conduta.
- **Testing Effect:** Checkpoint ANTES de revelar resposta.

### Duarte
- **Sparkline Narrativa:** Alternar problema/solução, min 4 beats.
- **Contraste como Ritmo:** Alternar bg escuro/claro = marcador narrativo.
- **Ponto Focal Único:** UM elemento dominante por slide.
- **Regra de 3:** Max 3 grupos por layout.

### Tufte
- **Data-Ink Ratio:** Cada pixel carrega informação. Zero gridlines decorativas.
- **Tabelas Tufte:** Sem bordas verticais. Horizontal só thead/totais. Números à direita.
- **Small Multiples:** Mesmo layout repetido com dados diferentes.
- **Lie Factor = 1:** Visual proporcional ao dado.
- **Layering:** Separar com cor/posição/opacidade, sem bordas.

### Layout Patterns
- **F-Pattern:** Texto + dados laterais.
- **Z-Pattern:** Impacto (abertura, hero, CTA).
- **Hierarquia:** Tamanho > Cor/Contraste > Posição > Peso tipográfico.

| Tipo slide | Fill Ratio |
|-----------|-----------|
| Data-heavy | 75-90% |
| Conceitual | 65-80% |
| Checkpoint | 50-65% |
| Hero/quote | 30-55% |

### Anti-padrões
- **Taglines editoriais:** Frases que resumem sem asserir ("4 dados. 1 numero. 1 decisao.") adicionam zero valor clínico. H2 = assertiva médica ou label descritivo (quando Lucas define). NUNCA hooks editoriais.

---

## 5. Dados Médicos

### Princípio Absoluto
**NUNCA inventar, estimar ou usar de memória** dado numérico médico. Sem fonte → `[TBD]`.
**País-alvo padrão:** Brasil.

### Checklist E21 — antes de QUALQUER dado em slide
- [ ] Valor vem de paper (não memória)?
- [ ] Paper verificado via PubMed/WebSearch?
- [ ] Time frame explícito?
- [ ] NNT com IC 95% e time frame?
- [ ] Se guideline: leu a guideline, não extrapolou?

### Formato NNT
```
NNT [valor] (IC 95%: [lower]–[upper]) em [tempo] | [população]
```
Hierarquia: **NNT > ARR > HR**. NNT=decisão (hero, --safe). HR=acadêmico (menor destaque).

### Regras
- **PMIDs:** NUNCA usar PMID de LLM sem verificar em PubMed. Marcar `[CANDIDATE]` até verificado.
- **População:** Verificar população do trial. Prevenção 1ª ≠ 2ª. Trial de pop A ≠ hero de slide pop B.
- **HR ≠ RR (E25):** HR = trial isolado. RR = meta-análise. NUNCA misturar.
- **Speaker notes:** `[DATA] Fonte: EASL 2024, Tab.3 | Verificado: 2026-02-12`

### Conteúdo — Permitido vs Proibido
**OK:** Reduzir texto mantendo significado, reorganizar hierarquia, adicionar de fontes verificadas, remover drogas não disponíveis no Brasil.
**PROIBIDO:** Inventar dados/referências, modificar números sem fonte, extrapolar entre estudos.

### Diagnostic Tool Framing
Slides sobre ferramentas diagnósticas (elastografia, scores, FiB-4) focam em CRITICAL APPRAISAL — como interpretar o resultado para o paciente em frente a você — não em técnica/física/algoritmo.
Frame: "Recebi este resultado. Quais condições no MEU paciente tornam este número não confiável?"
Anti-padrão: "Este é um escore que mede a rigidez hepática dividindo..."

### Fontes Tier 1 — Hepatologia

| Fonte | Tipo | Referência | ID |
|-------|------|-----------|-----|
| BAVENO VII | Consenso HP | J Hepatol 2022 | DOI:10.1016/j.jhep.2021.12.012 |
| EASL Cirrose 2024 | CPG | J Hepatol 2024 | DOI: TBD |
| AASLD Varizes 2024 | Practice Guidance | Hepatology 2024 | DOI: TBD |
| PREDESCI | RCT | Lancet 2019 | PMID:30910320 |
| CONFIRM | RCT | N Engl J Med 2021 | PMID:33657294 |
| ANSWER | RCT | Lancet 2018 | PMID:29861076 |
| D'Amico 2006 | Systematic review | J Hepatol 2006 | PMID:16298014 |

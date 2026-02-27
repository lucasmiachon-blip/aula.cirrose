# Archetypes — HTML Skeletons & Constraints

> Lookup table para coding agents. Copiar skeleton, preencher conteúdo clínico.
> CSS live em `archetypes.css`. Este MD é o contrato de interface.

## Global Rules (todos archetypes)

```css
max-width: min(1120px, 100%);   /* panel-safe */
padding: 2rem;
display: grid;
height: 100%;
align-content: start;
```

- Headline `<h2>` = assertion clínica (verbo + dado). Nunca rótulo.
- Zero `<ul><li>` no body. Usar componentes do archetype.
- `<cite class="source-tag">` no final se há dado citável.
- `data-reveal="N"` para click-reveal sequencial (engine.js controla).
- **Failsafe obrigatório:** todo elemento com `data-reveal` ou GSAP entry DEVE ter fallback CSS:
  ```css
  .failsafe-gsap [data-reveal] { opacity: 1 !important; }
  ```
  Sem isso, dados clínicos ficam presos em `opacity: 0` se JS falhar. Ver CLAUDE.md § Animation Safety.

---

## 1. `archetype-figure` — Assertion + Figura + Hero Stat

```html
<section id="s-{id}">
  <div class="slide-inner archetype-figure">
    <span class="section-tag">ATO {N} · TÓPICO</span>
    <h2>Assertion clínica aqui</h2>
    <div class="figure-split">
      <div class="slide-figure">
        <img src="img/{file}" alt="{desc}">
      </div>
      <div class="hero-stat" data-reveal="1">
        <div class="hero-value">
          <span class="hero-number">{N}</span>
          <span class="hero-unit">{unit}</span>
        </div>
        <span class="hero-label">{label}</span>
        <span class="hero-context">{source}</span>
      </div>
    </div>
    <cite class="source-tag">{referência}</cite>
  </div>
  <aside class="notes">...</aside>
</section>
```

| Constraint | Valor |
|------------|-------|
| Grid rows | `auto auto 1fr auto` |
| Img max-height | `55vh` |
| Hero number font | `--text-hero` via `--font-display` |
| Hero color | `--danger` (mortalidade) ou `--safe` (benefício) |
| figure-split | `flex`, gap `--space-lg`, img flex:3, stat flex:1 |

---

## 2. `archetype-metrics` — Assertion + 2-4 Metric Cards

```html
<section id="s-{id}">
  <div class="slide-inner archetype-metrics">
    <span class="section-tag">ATO {N} · TÓPICO</span>
    <h2>Assertion clínica aqui</h2>
    <div class="metric-row">
      <div class="metric-card" data-reveal="1">
        <span class="metric-icon metric-{semantic}">{emoji}</span>
        <span class="metric-value">{valor}</span>
        <span class="metric-unit">{unit}</span>
        <span class="metric-ci">{IC 95%}</span>
        <span class="metric-label">{label}</span>
      </div>
      <!-- repeat 2-4 cards -->
    </div>
    <cite class="source-tag">{referência}</cite>
  </div>
  <aside class="notes">...</aside>
</section>
```

| Constraint | Valor |
|------------|-------|
| Grid rows | `auto auto 1fr auto` |
| Card layout | `flex-wrap`, gap 16px, min-width 160px, max-width 300px |
| Semantic classes | `.metric-safe`, `.metric-danger`, `.metric-caution` |
| Value font | `--text-h2` via `--font-display`, tabular-nums |
| Max cards | 4 (se >4, usar grid 2×2) |

---

## 3. `archetype-interactive` — Assertion + Widget Area

```html
<section id="s-{id}">
  <div class="slide-inner archetype-interactive">
    <span class="section-tag">ATO {N} · TÓPICO</span>
    <h2>Assertion clínica aqui</h2>
    <div class="interactive-area">
      <!-- widget content (e.g. MELD calculator) -->
    </div>
    <div class="interactive-controls">
      <button class="ctrl-btn ctrl-secondary">{reset}</button>
      <button class="ctrl-btn ctrl-primary">{action}</button>
    </div>
    <cite class="source-tag">{referência}</cite>
  </div>
  <aside class="notes">...</aside>
</section>
```

| Constraint | Valor |
|------------|-------|
| Grid rows | `auto auto 1fr auto auto` |
| Area bg | `--bg-surface`, radius-sm, padding 20px, min-height 280px |
| JS | Requer `registerCustom` em `engine.js` com ID string |

---

## 4. `archetype-checkpoint` — Case + Decision Options

```html
<section id="s-{id}" data-severity="{neutral|caution|danger|hope}">
  <div class="slide-inner archetype-checkpoint">
    <h2>Pergunta clínica provocativa?</h2>
    <div class="checkpoint-layout">
      <div class="case-expanded">
        <h3>📋 Seu Antônio — Estado Atual</h3>
        <div class="case-data">
          <div class="data-item">
            <span class="data-label">{param}</span>
            <span class="data-value">{valor}</span>
          </div>
          <!-- repeat -->
        </div>
      </div>
      <div class="decision-area">
        <div class="decision-option" data-reveal="1">
          <span class="option-label">{Opção A}</span>
          <span class="option-answer">{explicação}</span>
        </div>
        <!-- repeat 2-3 options -->
      </div>
    </div>
  </div>
  <aside class="notes">...</aside>
</section>
```

| Constraint | Valor |
|------------|-------|
| Layout | Grid 55%/45%, gap 24px |
| Severity | `data-severity` no `<section>` → tints border-left |
| Case card | bg-card, border-left 4px accent, radius-sm |
| Options | bg-elevated, border, radius-sm, cursor pointer |
| CasePanel.js | `registerState('{id}', {...})` obrigatório |

---

## Archetypes Planejados (Stage B — não implementados)

| Nome | Uso previsto | Slides candidatos |
|------|-------------|-------------------|
| `archetype-comparison` | 2 painéis lado a lado | s-a3-02 (HCV vs Álcool vs MASLD) |
| `archetype-flow` | Fluxo horizontal com setas | s-a2-04 (PBE Dx→Tx→profilaxia) |
| `archetype-pillars` | 3 colunas paralelas | s-a2-06 (lactulose+rifaximina+nutrição) |
| `archetype-table` | Tabela Tufte | s-a1-05 (etiologias) |
| `archetype-timeline` | Steps temporais | s-a2-02 (Early TIPS 72h) |
| `archetype-recap` | 3 take-homes de fechamento | s-close |

Skeleton HTML será definido quando cada archetype for implementado em `archetypes.css`.

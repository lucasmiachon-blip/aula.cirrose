# HANDOFF — Cirrose (projeto)

> Só pendências ativas. Detalhes históricos → CHANGELOG.md, ERROR-LOG.md. Claude.ai → HANDOFF-CLAUDE-AI.md

---

## Estado atual — 2026-03-05

**Último commit:** `6933c5e` — interatividade CPs + FIB-4 painel + fixes visuais  
**Slides:** 30/30 buildados (index.html atualizado nesta sessão)

### Feito nesta sessão
- **s-hook**: contraste texto (oklch explícito no dark navy), cards uniformes, FIB-4 só visível em s-a1-02
- **s-a1-01**: GBD 2021 (1,32M→1,43M mortes, PMID 39927433); bug transição burden-hero--compact corrigido; pulse display:none após GSAP; hero-label oculto em compact; source-tag 11px + nowrap + PMID ao final
- **CSS global**: `.source-tag` padrão = `clamp(10px, 0.55vw, 11px)`, `white-space:nowrap`, `text-align:center`; archetypes.css `grid-template-columns:1fr` + `.source-tag { justify-self:stretch }`
- **s-a1-01 QA**: beat 0 ✅ beat 1 ✅ beat 2 ✅

### Padrão source-tag (aplicar em todos os slides)
```
Autor et al. Revista Ano · Dataset opcional · PMID XXXXXXX
```
PMID **sempre ao final**, sem parênteses no meio. `white-space:nowrap` já garante linha única.

---

## Prioridades — PRÓXIMA SESSÃO

### 🔴 IMEDIATO

1. ~~**`npm run lint:slides`**~~ ✅ (2026-03-05 — clean)
2. **QA visual** — CP1, CP2, CP3, albumina, HE, SVR (pendente do batch anterior)
3. **Aplicar padrão source-tag** nos demais slides (PMID ao final, nowrap) — s-a2-01 até s-a3-03

### 🟡 MÉDIA — PMIDs TBD (14 restantes)

Ver `docs/insights-html-cirrose-2026.md` seção "Pendências TBD restantes".  
Prioritários: AGA 2025 Orman (s-a2-03), Lens CSPH 53% (s-a3-02), EASL HCC 2025 (s-a3-03).

### 🟡 MÉDIA — CTP interobserver variability

Candidatos: PMID 6546609 (Christensen 1984) ou PMID 16305721 (Cholongitas 2005).  
Atualizar `limitation-source` em `02b-a1-damico.html` após verificar.

### 🟡 MÉDIA — burden-iceberg prevalência

`burden-iceberg` usa GBD 2017 (112M comp + 10,6M decomp, PMID 31981519).  
GBD 2021 não reporta prevalência equivalente — manter GBD 2017 com anotação nos notes.

### 🟢 BAIXA — Bloco 2 e 3 restantes

- Bloco 2: S3 fill remanescente
- Bloco 3: S3 fill + hero typography
- Appendix R1: archetype-appendix sem case panel

---

## Pendências abertas

- **ERRO-008** — Case panel redundante em s-hook
- **AUDIT** — Fixes I2–I10 (ver AUDIT-VISUAL.md)
- **21 referências [TBD]** catalogadas em NOTES.md (linhas 100–122)
- **Narrativa novo arco** — hook DM2 → GBD burden → FIB-4 como pivot
  - s-a1-01 burden: ✅ GBD 2021 incorporado
  - Pendente: slide DM2/screening (EASL 2024, ADA 2024)

## Dados do caso — inconsistências menores

- **PLQ 112k (hook) vs 118k (CP1)** — duas visitas; plausível mas sem nota de contexto
- **Stage no CP1**: `07-cp1.html` mostra `cACLD → CSPH` (seta), `_manifest.js` mostra `cACLD/CSPH` (barra) — cosmético

---

## Offline

`npm run build:cirrose`, `npm run lint:slides`, `npm run preview` — funcionam offline.

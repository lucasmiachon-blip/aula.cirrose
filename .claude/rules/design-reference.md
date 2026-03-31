# Design Reference — Semântica, Dados Médicos

> Apenas o que NÃO está no código. Tokens/tipografia/spacing → `aulas/cirrose/cirrose.css` (seção :root).
> Princípios de design (27) → `docs/design-principles.md` (consultar sob demanda).

---

## 1. Semântica de Cor

Cores clínicas ≠ UI. ΔL ≥ 10% entre safe/warning/danger. Ícone obrigatório: ✓ ⚠ ✕ ↓.

| Token | Significado clínico | Uso |
|-------|---------------------|-----|
| `--safe` | Manter conduta | Resultado favorável, meta atingida |
| `--warning` | Investigar/monitorar | Zona cinza, requer acompanhamento |
| `--danger` | Intervir agora | Risco real: morte, sangramento, falência |
| `--downgrade` | Rebaixar evidência | Limitação, caveat (sempre com ↓) |
| `--ui-accent` | Chrome/UI | Progresso, tags, decoração — NUNCA clínico |

HEX é verdade. Se OKLCH divergir, HEX vence. Paleta de dados: Tol (daltonism-safe).

## 2. Tipografia — Regras (valores em cirrose.css :root)

| Regra | Detalhe |
|-------|---------|
| Serif = autoridade | `--font-display` (Instrument Serif) para títulos |
| NUNCA peso 300 em projetor | Mínimo 400 para corpo |
| tabular-nums lining-nums | Em dados numéricos |
| `font-display: swap` | Obrigatório. WOFF2 em `shared/assets/fonts/` |
| NUNCA `vw` sem `clamp()` | `scaleDeck()` + vw = overflow (E52) |

## 3. Dados Médicos

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
Frame: "Recebi este resultado. Quais condições no MEU paciente tornam este número não confiável?"
Anti-padrão: "Este é um escore que mede a rigidez hepática dividindo..."

### Fontes Tier 1 — Hepatologia

| Fonte | Tipo | ID |
|-------|------|----|
| BAVENO VII | Consenso HP | DOI:10.1016/j.jhep.2021.12.012 |
| EASL Cirrose 2024 | CPG | DOI: TBD |
| AASLD Varizes 2024 | Practice Guidance | DOI: TBD |
| PREDESCI | RCT | PMID:30910320 |
| CONFIRM | RCT | PMID:33657294 |
| ANSWER | RCT | PMID:29861076 |
| D'Amico 2006 | Systematic review | PMID:16298014 |

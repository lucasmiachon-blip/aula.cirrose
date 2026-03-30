# NEXT-SESSION — Proximo trabalho

> Contexto para rehidratacao. Atualizado: 2026-03-31.

---

## Resumo da sessao anterior (s-a1-cpt)

**Rename s-a1-damico → s-a1-cpt** — operacao completa em 15 superficies.

**Pesquisa multi-MCP:**
- Scite: Durand & Valla 2005 (DOI 10.1016/j.jhep.2004.11.015, 628 cit) — "almost intuitive score at bedside". Ruf et al. 2022 (DOI 10.1016/j.aohep.2021.100535) — review historico.
- Consensus: Peng 2016 meta-analise (418 cit) — CTP e MELD similar na maioria dos cenarios. Huo 2006 — ceiling effect documentado.
- Gemini Deep Research (11 min): relatorio estruturado 3 secoes. Kappa ate 0,41. Mortalidade cirurgica A10/B30/C75. TIPS preemptivo Baveno VII. Recompensacao CTP A + MELD <10.

**Gemini co-design (brainstorm):**
Consenso Opus+Gemini: abandonar cronologia, focar no paradoxo. 3 states:
- S0 (auto): 5 nos variaveis, 2 destacam (Ascite+EH) com κ ≤ 0,41. Ceiling effect countUp (3,1→30 mg/dL = 3 pts).
- S1 (click): Mortalidade cirurgica countUp (A 10%, B 30%, C >75%) + Von Restorff no C (scale 1.12).
- S2 (click): Baveno VII cards — Recompensacao (CTP A + MELD <10) + TIPS pre-emptivo (C 10-13, B ≥8).

**Backup:** `slides/_archive/02b-a1-damico-backup.html` preserva conteudo MELD-Na + D'Amico para slides futuros.

**Status:** DRAFT. Build OK (44 slides). lint:slides PASS. Pronto para QA pipeline.

---

## Proximo trabalho

### Prioridade 1: QA pipeline em s-a1-cpt

4 passos obrigatorios:
1. `node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide s-a1-cpt --video`
2. Gate 0 (Flash): `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-cpt --inspect`
3. Gate 2 (Opus): analise visual MCP (sharp + a11y + Read)
4. Gate 4 (Pro): `node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-cpt --editorial --round 1`

### Prioridade 2: s-a1-meld

Proximo slide Act 1. Estado CONTENT. Conteudo MELD parcialmente disponivel no backup (_archive).

### Prioridade 3: Cascata LSM 26 kPa em s-cp1

**narrativeCritical=true** — requer aprovacao Lucas.
- `slides/07-cp1.html` H2: "LSM 21 kPa" → "LSM 26 kPa"
- `references/narrative.md` linha 66: "LSM 21 kPa" para cp1
- CASE.md ja atualizado (source of truth).

---

## Dados CTP confirmados (para QA e revisao)

| Dado | Valor | Fonte | Status |
|------|-------|-------|--------|
| Pugh 1973 | PMID 4541913 | Br J Surg | Verificado |
| Durand & Valla 2005 | DOI 10.1016/j.jhep.2004.11.015 | J Hepatol, 628 cit | Verificado |
| Kappa inter-observer | ate 0,41 | Gemini cite 10,12 | [CANDIDATE] |
| Ceiling effect | Bili 3,1 e 30 = 3 pts | Durand & Valla + Huo 2006 | Verificado |
| Mortalidade cirurgica | A ~10%, B ~30%, C >75% | Multiplas series | Verificado |
| TIPS preemptivo | CTP C 10-13, B ≥8 + sangramento | Baveno VII (PMID 35120736) | Verificado |
| Recompensacao | CTP A + MELD <10 | Baveno VII | Verificado |

**[CANDIDATE]:** Kappa 0,41 — PMID exato nao confirmado. Gemini cite 10,12 referencia multiplas fontes. Buscar PMID especifico no proximo QA.

---

## Decisoes travadas (cpt)

1. H2 "Child-Pugh-Turcotte: aspectos historicos, limitacoes e uso atual" — definido por Lucas.
2. Arco falhas→sobrevivencia→redencao — co-design Gemini, aprovado por Lucas.
3. Conteudo MELD-Na e D'Amico → slides separados (1-2 futuros).
4. Zero tabela CTP classica (expert sabe de cor).
5. countUp no ceiling (3,1→30) e mortalidade cirurgica (10/30/75).
6. Von Restorff no C >75% (scale 1.12).

---

## Legibilidade 5m — pendente

Lucas vai informar tamanho da TV. Formula:
- render_px = CSS_font × (1080/720) na TV 1080p
- mm_fisico = render_px × (TV_height_mm / 1080)
- Referencia: legibilidade minima 5m ≈ 20mm, confortavel ≈ 35mm

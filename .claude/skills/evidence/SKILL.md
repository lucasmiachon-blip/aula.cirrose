---
name: evidence
description: Busca evidencias clinicas no PubMed para slides. Use quando o usuario pedir "buscar evidencia", "pesquisar trial", "search evidence", "achar estudo sobre", "preciso de PMID para". Retorna citacao AMA + numeros prontos para slide.
version: 0.3.0
context: fork
agent: general-purpose
allowed-tools: Read, WebSearch
argument-hint: "[query clinica]"
---

# Search Evidence (Router v0.3)

Busca evidencia clinica para: `$ARGUMENTS`

## Routing

**Fast path** (PMID/DOI isolado):
Se `$ARGUMENTS` contem um PMID (ex: `30910320`) ou DOI (ex: `10.1016/j.jhep.2021.12.012`):
1. Buscar PubMed MCP com o identificador
2. Extrair: citacao AMA, design, n, primary endpoint, effect size + IC 95%
3. Retornar formatado para slide

**Deep path** (topico clinico):
Se `$ARGUMENTS` e um topico (ex: `carvedilol portal hypertension`, `terlipressin HRS-AKI`):
1. Delegar para `/medical-researcher $ARGUMENTS`
2. O medical-researcher faz fan-out multi-MCP, triangulacao, depth rubric
3. Retorna resultado completo com verificacao cruzada

## Output (fast path)

```
## [Topico] — Evidencia (buscado [data])

### Tier-1 Encontrado:

1. **[Trial Name]** (Ano)
   Autor et al. Journal Ano;Vol:Pags. PMID: XXXXX
   Design: [RCT/Meta-analise/Guideline] | n = XXX
   Endpoint: [descricao]
   Resultado: [effect size] (95% CI: X-Y), p = Z
   Impacto: [mudanca de conduta]

### Assertion pronta para slide:
"[Frase completa adequada para <h2>]"

### Dados a verificar:
- [numeros incertos sinalizados com [VERIFY]]
```

## Regras

- NUNCA inventar dados — se nao encontrar, reportar `[TBD]`
- HR != RR != OR — especificar sempre
- Trial isolado != meta-analise — nao misturar
- PMID de LLM = `[CANDIDATE]` ate verificacao em PubMed

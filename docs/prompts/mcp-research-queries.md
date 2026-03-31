# MCP Research Query Templates

> Reduzir output dos MCPs medicos. Preencher campos antes de disparar.
> Cada template gera queries focadas que retornam dados uteis, nao lixo.

---

## Como usar

1. Lucas define os **campos** que quer pesquisar (ex: AUROC, limitacoes, populacoes)
2. Claude preenche o template com o topico do slide
3. Cada MCP recebe query especifica ao seu ponto forte
4. Output limitado por `limit`, `topN`, `max_results` — nunca default

---

## Template A — Performance Diagnostica

**Preencher:**
- TESTE: _____ (ex: FIB-4, APRI, ELF)
- CONDICAO: _____ (ex: advanced fibrosis F3-F4, cirrhosis)
- ETIOLOGIA: _____ (ex: NAFLD, alcohol, HBV, mixed)

### Scite (melhor para: Smart Citations, contrasting evidence)
```
term: "{TESTE} AUROC sensitivity specificity {CONDICAO}"
topic: "Hepatology"
date_from: "2020"
limit: 5
paper_type: "Meta-Analysis"
```

### Scholar Gateway (melhor para: passagens full-text com numeros)
```
query: "diagnostic accuracy {TESTE} for detecting {CONDICAO} in patients with {ETIOLOGIA} liver disease AUROC sensitivity specificity"
topN: 5
start_year: 2020
```

### Consensus (melhor para: abstracts amplos, discovery)
```
query: "{TESTE} diagnostic accuracy {CONDICAO} {ETIOLOGIA} AUROC sensitivity specificity comparison"
```

### PubMed (quando disponivel — melhor para: busca estruturada)
```
query: "{TESTE}[Title] AND {CONDICAO}[Title] AND (AUROC OR sensitivity OR specificity)"
max_results: 5
sort: "relevance"
```

---

## Template B — Limitacoes e Confounders

**Preencher:**
- TESTE: _____
- CONFOUNDER: _____ (ex: age, alcohol, obesity, burnt-out)

### Scite
```
term: "{TESTE} limitations {CONFOUNDER} confounding false positive"
topic: "Hepatology"
date_from: "2020"
limit: 5
has_tally: true
```

### Scholar Gateway
```
query: "limitations of {TESTE} index {CONFOUNDER} effect on diagnostic accuracy liver fibrosis"
topN: 5
start_year: 2020
```

---

## Template C — Divergencias entre Guidelines

**Preencher:**
- TOPICO: _____ (ex: FIB-4 cutoffs, NSBB indication, albumin use)

### Consensus (melhor para guidelines)
```
query: "EASL AASLD AGA Baveno VII {TOPICO} recommendations comparison divergence"
```

### Scite (contrasting citations)
```
term: "guideline recommendation {TOPICO}"
contrasting_from: 3
limit: 5
```

---

## Template D — Calculadoras / Scores Emergentes

**Preencher:**
- AREA: _____ (ex: liver fibrosis, portal hypertension, ACLF)
- COMPARADOR: _____ (ex: FIB-4, MELD, Child-Pugh)

### Consensus
```
query: "novel non-invasive {AREA} score calculator comparison {COMPARADOR} patent-free open access diagnostic accuracy"
```

### Scholar Gateway
```
query: "new non-invasive test {AREA} improved accuracy compared to {COMPARADOR} free calculator"
topN: 5
start_year: 2022
```

---

## Regras de output

| MCP | Parametro | Default projeto | Justificativa |
|-----|-----------|----------------|---------------|
| Scite | `limit` | **5** (max 8) | Output >10 gera 50KB+ de Smart Citations |
| Scholar Gateway | `topN` | **5** (max 8) | Full-text chunks sao longos |
| Consensus | (sem limite manual) | OK — retorna abstracts curtos |
| PubMed | `max_results` | **5** (max 10) | Metadata e leve |

---

## Anti-patterns (NAO fazer)

- Query aberta: "FIB-4 liver fibrosis" → retorna tudo, nada util
- Sem filtro de data: inclui papers de 1990 sobre APRI
- Scite com limit=10+: gera >50KB de JSON com citacoes repetidas
- Scholar Gateway com topN=15+: chunks de texto longos, maioria ruido
- Disparar 4 MCPs com a MESMA query: duplicacao de contexto
- Rodar pesquisa sem Lucas definir os campos primeiro

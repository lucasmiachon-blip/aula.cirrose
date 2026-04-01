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

## Framing adversarial (aplicar a TODOS os templates)

Antes de buscar evidencia que CONFIRMA, buscar evidencia que CONTRADIZ.
Cada template lista o vies especifico a combater. O objetivo nao e provar que o slide esta certo — e encontrar onde ele pode estar errado.

---

## Template A — Performance Diagnostica

**Vies a combater:** O teste pode performar PIOR que o reportado se o espectro da populacao divergir (spectrum bias). AUROC em centro terciario ≠ atencao primaria. Buscar estudos que CONTESTEM a acuracia antes de confirmar.

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

**Vies a combater:** Buscar evidencia de que a limitacao INVALIDA o uso clinico, nao apenas "diminui a acuracia". Se o confounder causa reclassificacao clinica (ex: tratar quem nao precisa), isso e MUST — nao SHOULD.

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

**Vies a combater:** Quando guidelines divergem, buscar o PORQUE (base de evidencia diferente? populacao diferente? conflito de interesse?), nao apenas o QUE cada sociedade diz. Divergencia sem explicacao = gap que a audiencia vai questionar.

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

**Vies a combater:** Score novo pode ter vies de publicacao (so estudos positivos publicados) e validacao apenas pelo grupo que o criou. Buscar validacao EXTERNA independente. Se so tem validacao interna, flag como [UNCONFIRMED].

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

---

## Template E — Tratamento / Intervencao

**Vies a combater:** Trial positivo ≠ beneficio clinico real. Buscar PRIMEIRO: NNH (dano), populacao do trial vs populacao do slide (generalizable?), endpoint surrogate vs clinico, disponibilidade no Brasil. Se NNT existe mas NNH nao, o slide esta incompleto.

**Preencher:**
- DROGA: _____ (ex: carvedilol, terlipressina, rifaximina)
- CONDICAO: _____ (ex: CSPH, HRS-AKI, hepatic encephalopathy)
- COMPARADOR: _____ (ex: placebo, propranolol, lactulose)
- POPULACAO: _____ (ex: compensated cirrhosis, decompensated Child B/C)

### PubMed
```
query: "{DROGA}[Title] AND {CONDICAO}[Title] AND (randomized controlled trial[pt] OR meta-analysis[pt])"
max_results: 5
sort: "relevance"
```

### Consensus
```
query: "{DROGA} vs {COMPARADOR} {CONDICAO} NNT number needed to treat mortality"
```

### Scite (contrasting evidence)
```
term: "{DROGA} {CONDICAO} adverse events safety NNH harm"
topic: "Hepatology"
date_from: "2020"
limit: 5
```

### Scholar Gateway
```
query: "{DROGA} versus {COMPARADOR} {CONDICAO} randomized trial primary endpoint effect size"
topN: 5
start_year: 2020
```

---

## Template F — Epidemiologia / Prognostico

**Vies a combater:** Dados epidemiologicos variam por regiao, periodo e definicao. "Mortalidade 20%" — de qual populacao? Qual periodo? Buscar dados que CONTESTEM o numero do slide com populacoes diferentes. GBD ≠ coorte hospitalar ≠ registro nacional.

**Preencher:**
- CONDICAO: _____ (ex: first decompensation, ACLF, variceal bleeding)
- DESFECHO: _____ (ex: mortality, incidence, prevalence)
- POPULACAO: _____ (ex: compensated cirrhosis, all-cause cirrhosis)
- PERIODO: _____ (ex: 1-year, 5-year, in-hospital)

### PubMed
```
query: "{CONDICAO}[Title] AND ({DESFECHO}[Title] OR prognosis[Title]) AND (cohort study[pt] OR meta-analysis[pt])"
max_results: 5
sort: "relevance"
```

### Consensus
```
query: "{CONDICAO} {DESFECHO} natural history cirrhosis {PERIODO} prognosis survival"
```

### Scholar Gateway
```
query: "{CONDICAO} {POPULACAO} {DESFECHO} {PERIODO} prospective cohort or registry"
topN: 5
start_year: 2018
```

---

## Template G — Manejo / Algoritmo

**Vies a combater:** Algoritmos de manejo refletem a pratica do centro que os publicou. Buscar se o algoritmo e VALIDADO em outros centros, se ha passos que variam entre guidelines (EASL vs AASLD), e se a realidade brasileira (acesso, custo) altera a sequencia.

**Preencher:**
- CONDICAO: _____ (ex: ascites, hepatic encephalopathy, variceal prophylaxis)
- INTERVENCAO_ESCALONADA: _____ (ex: spironolactone → furosemide → LVP → TIPS)
- CRITERIO_FALHA: _____ (ex: weight loss <2kg/week, recurrent encephalopathy)

### PubMed
```
query: "{CONDICAO}[Title] AND (management[Title] OR treatment algorithm[Title]) AND practice guideline[pt]"
max_results: 5
sort: "pub_date"
```

### Consensus
```
query: "{CONDICAO} stepwise management algorithm {CRITERIO_FALHA} escalation criteria guideline"
```

### Scite
```
term: "{CONDICAO} refractory {CRITERIO_FALHA} second-line treatment"
topic: "Hepatology"
date_from: "2020"
limit: 5
```

---

## Template H — Complicacao / Emergencia

**Vies a combater:** Em emergencias, guidelines recomendam com base em trials pequenos (n<200) porque RCTs em pacientes criticos sao raros. Buscar se o trial-base da recomendacao tem poder estatistico adequado e se a mortalidade SEM tratamento e confiavel (vies historico: mortalidade de controles caiu com melhora de cuidados gerais).

**Preencher:**
- COMPLICACAO: _____ (ex: HRS-AKI, variceal hemorrhage, ACLF, SBP)
- CRITERIO_DIAGNOSTICO: _____ (ex: ICA criteria, PMN ≥250, CLIF-C ACLF)
- INTERVENCAO_URGENTE: _____ (ex: terlipressin+albumin, vasoactive+EGD, ceftriaxone)
- JANELA_TERAPEUTICA: _____ (ex: <6h, <12h, <72h)

### PubMed
```
query: "{COMPLICACAO}[Title] AND (mortality[Title] OR treatment[Title]) AND (randomized controlled trial[pt] OR systematic review[pt])"
max_results: 5
sort: "relevance"
```

### Consensus
```
query: "{COMPLICACAO} {INTERVENCAO_URGENTE} time to treatment mortality cirrhosis emergency"
```

### Scholar Gateway
```
query: "{COMPLICACAO} {CRITERIO_DIAGNOSTICO} diagnostic criteria validation {JANELA_TERAPEUTICA}"
topN: 5
start_year: 2019
```

### Scite (contrasting: eficacia questionada?)
```
term: "{INTERVENCAO_URGENTE} {COMPLICACAO} efficacy questioned safety concern"
topic: "Hepatology"
date_from: "2020"
limit: 5
```

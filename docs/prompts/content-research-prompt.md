# Content Research Prompt — aula.cirrose

> Prompt v3 (2026-03-30). Source of truth: `aulas/cirrose/scripts/content-research.mjs`.
> Este documento DOCUMENTA o que o script faz. Se divergir, o script vence.

## Modelos
- **Claude:** Opus 4.6 (via assinatura Max — Claude Code ou claude.ai — custo $0)
- **Gemini:** 3.1 Pro (melhor raciocinio disponivel, $2.00/$12.00 per 1M tokens)
- Fallback: Gemini 2.5 Pro (GA estavel, $1.25/$10.00 — trocar modelo na URI)

## Prompt Engineering — decisoes especificas pro Gemini 3.1 Pro

Baseado na documentacao oficial do Google (Vertex AI Gemini 3 Prompting Guide, marco 2026):

1. **Temperatura 1.0 (default)** — valores menores causam looping em tarefas de raciocinio.
   A precisao vem do thinkingLevel, nao da temperatura.
2. **Constraints positivas, nao negativas** — em vez de "NEVER fabricate", usar "write [VERIFICAR]
   when confidence < 90%". Gemini 3 over-indexa em constraints negativas amplas.
3. **Direto e estruturado** — Gemini 3 responde melhor a instrucoes curtas e diretas.
   Tecnicas verbosas de prompt eng pra modelos antigos degradam performance.
4. **Formato consistente** — usar UM estilo (=== SECTIONS ===), nao misturar XML + Markdown.
5. **Knowledge cutoff declarado** — Gemini 3.1 Pro tem cutoff em janeiro 2025.
   Declarar explicitamente no prompt melhora grounding.
6. **thinkingLevel em vez de thinkingBudget** — API do 3.1 Pro migrou pra niveis nomeados.
7. **Grounding with Google Search** — acesso a dados em tempo real (ate hoje, marco 2026).
   Cutoff do modelo e jan/2025, mas com search habilitado ele busca na web.
   Custo: $14/1k search queries (~$0.014 por busca). Gemini decide quantas buscas fazer.

## Como usar

### Via script (recomendado)
```bash
# Rodar pesquisa completa para um slide
node aulas/cirrose/scripts/content-research.mjs --slide s-a1-fib4

# Com campos especificos
node aulas/cirrose/scripts/content-research.mjs --slide s-a1-fib4 --fields "AUROC por etiologia;;Cutoffs age-adjusted;;VPN vs VPP"

# Apenas ver o prompt montado (sem chamar API)
node aulas/cirrose/scripts/content-research.mjs --slide s-a1-fib4 --prompt-only
```

Output salvo em: `aulas/cirrose/qa-screenshots/{slide-id}/content-research.md`

### Via Claude (assinatura Max — custo $0)
Claude Code monta o prompt e roda direto como Opus. Ou cole o prompt preenchido aqui no claude.ai.
Nao precisa de API key — usa a assinatura.

### Via Gemini (curl no terminal)
```powershell
$env:GEMINI_KEY = "sua-key"

$body = @{
    contents = @(@{
        role = "user"
        parts = @(@{ text = $prompt })
    })
    systemInstruction = @{
        parts = @(@{ text = $systemPrompt })
    }
    generationConfig = @{
        temperature = 1.0
        maxOutputTokens = 4096
        thinkingConfig = @{
            thinkingLevel = "HIGH"
        }
    }
    tools = @(@{
        google_search = @{}
    })
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
    -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key=$env:GEMINI_KEY" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

---

## SYSTEM PROMPT (EN — fixo, identico nos dois modelos)

> v2 (2026-03-28): +guideline divergence, +REFORCO vs NUANCE, +narrative metadata, +genealogia obrigatoria para scores

```
You are a hepatology evidence consultant for a congress-level medical presentation. Your audience is practicing hepatologists — they know the basics cold. Skip fundamentals — provide only advanced, actionable content.

You are called ONLY for slides flagged as weak in content.

YOUR TASK: Given a weak slide's clinical claim, its position in the narrative arc, and its current evidence, provide targeted content reinforcement with the highest-quality sources available.

=== EVIDENCE HIERARCHY (always classify every source you cite) ===

Tag each reference with its type:
[GUIDELINE] — Society guidelines: EASL, AASLD, Baveno consensus, ACG, AGA, WHO. State issuing body + year.
[META/SR] — Systematic reviews and meta-analyses. State N studies pooled, total N patients if available.
[RCT] — Randomized controlled trials. State N=, arms, primary endpoint.
[LANDMARK] — Foundational/genealogy studies that established a concept (e.g., first description of HVPG threshold). State historical significance.
[BOOK] — Textbook passages (Sherlock, Zakim & Boyer, Schiff, Sleisenger). Always cite: Author, Edition, Chapter, Page range.
[COHORT] — Prospective or retrospective cohort. State N=, follow-up period.
[EXPERT] — Expert opinion, narrative review, editorial. Flag explicitly as lowest tier.

=== EVIDENCE QUALITY ASSESSMENT ===

For each key recommendation or finding, provide a GRADE-style quality rating:
- ⊕⊕⊕⊕ HIGH — Consistent RCTs or overwhelming observational with large effect
- ⊕⊕⊕◯ MODERATE — RCTs with limitations or strong observational
- ⊕⊕◯◯ LOW — Observational studies or RCTs with serious limitations
- ⊕◯◯◯ VERY LOW — Case series, expert opinion, indirect evidence

When adapting GRADE to non-intervention questions (prognosis, diagnosis), note: "[GRADE adaptado — questao diagnostica/prognostica]"

When a guideline gives a strong recommendation on low-quality evidence, flag the discrepancy explicitly.

=== GUIDELINE DIVERGENCE (mandatory when 2+ societies cited) ===

When multiple guidelines address the same topic (e.g., EASL vs AASLD vs Baveno), explicitly compare:
- Where they agree (consensus = high confidence)
- Where they diverge (state each society's position + year)
- Which is more recent or based on stronger evidence
Flag divergences clearly — the audience makes real clinical decisions based on which guideline they follow.

=== REFORCO vs NUANCE (distinguish clearly) ===

REFORCO = evidence that STRENGTHENS the slide's claim. The claim is correct — here's more proof.
NUANCE = evidence that QUALIFIES, LIMITS, or CONTRADICTS the claim. The claim needs a caveat.
If a finding does both (supports in one population, contradicts in another), put it in NUANCE.

=== EVIDENCE-BASED MEDICINE CRITIQUE ===

When relevant (and briefly), note:
- Known criticisms of the evidence base (e.g., surrogate endpoints, industry funding, generalizability)
- Where expert practice diverges from published evidence
- Ongoing debates or recent shifts in the field

=== NARRATIVE METADATA (use to calibrate your response) ===

The slide metadata includes archetype, narrative role, and tension level. Interpret them:
- Archetype "hero-stat": slide centers on ONE powerful number (NNT, HR, AUROC). Ensure that number has CI95% and source.
- Archetype "comparison": side-by-side data. Ensure both sides have equal evidence quality.
- Narrative role "setup": establishing foundation — prioritize clarity and sourcing over drama.
- Narrative role "payoff": revealing key insight — evidence must be rock-solid.
- Narrative role "pivot": changing direction — flag if evidence supports the pivot.
- Tension 1-2/5: low stakes, educational. Tension 4-5/5: high stakes, clinical decision moment.

=== CONSTRAINTS ===

- Output in Brazilian Portuguese (PT-BR). Maximum 600 words.
- Your knowledge cutoff is January 2025, but you have access to Google Search for recent information. Use search to verify PMIDs, find recent guidelines (2023-2026), and check for updates to recommendations. When confidence is below 90% on any PMID, statistic, or page number, write [VERIFICAR] and state what to look up.
- When citing textbooks, describe the argument the passage makes. Provide author, edition, chapter, and page range.
- Prioritize sources from 2020-2025. Include older sources only when they are foundational/landmark.
- This audience is expert-level (hepatologists at congress). Provide only actionable, advanced content — assume all fundamentals are known.
- Focus exclusively on what is MISSING from the slide. Use the provided existing data as your baseline, then build on top of it.

=== OUTPUT FORMAT (follow exactly — use markdown headings) ===

## CLAIM
[the h2 assertion]

## STATUS
FORTE | NUANCAVEL | DESATUALIZADO | INCOMPLETO | ERRADO

## AVALIACAO PMIDs EXISTENTES
(obrigatorio se ha PMIDs no slide)
Para cada PMID ja presente:
- PMID | Primeiro autor, Ano | [TYPE TAG] | Status: ATUAL / SUPERSEDED / RETRACTED
  Se SUPERSEDED: citar o paper que o substituiu com PMID

## NUANCE (max 2 — FIRST: what qualifies, limits, or contradicts the claim)
- [finding that QUALIFIES, LIMITS, or CONTRADICTS] — [TYPE TAG] — source — [stat] — [year]
  GRADE: ⊕⊕◯◯ [one-line justification]
  (if EBM critique applies, add one line: "Critica: ...")

## REFORCO (max 2 — evidence that strengthens the claim)
- [finding] — [TYPE TAG] — PMID:XXXXX or [Book, Ed, Ch, p.XX] — N=X — [stat with CI95%/p] — [year]
  GRADE: ⊕⊕⊕◯ [one-line justification]

## GENEALOGIA
(MANDATORY if slide is about a score, test, or classification; skip otherwise — max 1)
- [LANDMARK] — [who first described/established this concept] — [year] — [original population/context] — [why it matters for the claim]
  Note: if the test was created for a different population than the slide's context, state this explicitly.

## DIVERGENCIA ENTRE GUIDELINES
(MANDATORY if 2+ guidelines cited; skip otherwise)
| Topico | EASL | AASLD | Baveno | Outro |
|--------|------|-------|--------|-------|
| [topic] | [position + year] | [position + year] | [position + year] | |

## CONTEUDO SUGERIDO (max 1)
- Body text (<=30 words, assertion-evidence format, no bullets)
- Visual: [data visualization that would prove the claim]

## DECISAO CLINICA (max 1)
- [the "e dai?" — what clinical action this enables for a hepatologist seeing 20 cirrhosis patients/month]

## GAPS (max 2)
- [what an expert would ask that this slide can't answer]

## DADOS PARA SPEAKER NOTES (max 3)
- [estatistica: NNT, HR, OR, CI95%, p-valor] — fonte — como usar na fala
(Destino: <aside class="notes"> do slide HTML)

If the claim is FORTE and evidence is complete, say so in 2 lines and stop. Do not pad.
```

---

## USER PROMPT TEMPLATE (preenchido automaticamente pelo script)

> v2: patient anchor dinamico (CASE.md), archetype/role glossary, --fields opcionais

```
FLAG: This slide was flagged as WEAK IN CONTENT. Reason: {{weakness.description}}
(category: {{weakness.category}}, severity: {{weakness.severity}}/3)

SLIDE: {{slideId}}
POSITION IN ARC: {{actLabel}} — position {{position}} ({{sectionTag}})
NARRATIVE ROLE: {{narrativeRole}} | Tension: {{tensionLevel}}/5

CLAIM (h2):
{{h2}}

CURRENT BODY (<=30 words visible on slide):
{{bodyText}}

CURRENT DATA IN NOTES:
{{notes}}

EXISTING PMIDs:
{{existingPMIDs or NENHUM}}

SLIDE SOURCE TAG:
{{sourceTag or (none)}}

EVIDENCE-DB ENTRIES:
{{evidenceBlock}}

NARRATIVE CONTEXT:
- Previous slide claimed: {{prevClaim}}
- Next slide will claim: {{nextClaim}}
- Patient anchor: {{extractPatientAnchor()}}
  (reads CASE.md at runtime: nome, idade, profissao, etiologia, via)

ARCHETYPE & ROLE GLOSSARY (for this slide):
- Archetype "{{archetype}}": see NARRATIVE METADATA in system prompt
- Role "{{narrativeRole}}": see NARRATIVE METADATA in system prompt
- Tension {{tensionLevel}}/5: calibrate evidence depth accordingly

NARRATIVE BLOCK:
{{narrativeBlock}}

WHAT I NEED:
Strengthen this slide's evidence base. Prioritize: guidelines from authorities (EASL, AASLD, Baveno), recent meta-analyses/systematic reviews (last 5 years), landmark RCTs. Include textbook references if they add weight. Classify every source. Rate evidence quality via GRADE. Flag discrepancies between recommendation strength and evidence quality. Note genealogy of key concepts if foundational studies exist. If evidence is genuinely weak or contested, say so — do not manufacture strength.

=== CAMPOS ESPECIFICOS SOLICITADOS (responder CADA um) ===
{{RESEARCH_FIELDS_TEXT — only if --fields flag passed}}
```

---

## CROSS-VALIDATION CHECKLIST

Apos rodar nos dois modelos, preencher esta tabela. Divergencias = verificar no PubMed antes de usar.

| # | Criterio | Claude | Gemini | Match? | Acao se diverge |
|---|----------|--------|--------|--------|-----------------|
| 1 | STATUS do claim | | | | Se diverge: usar o mais conservador |
| 2 | PMIDs identicos? | | | | PMID exclusivo → verificar no PubMed MCP |
| 3 | Estatisticas batem? | | | | Numero do paper original vence |
| 4 | GRADE concorda? | | | | Se diverge: justificar com criterios GRADE |
| 5 | Tipo de fonte (tag) | | | | Classificacao mais especifica vence |
| 6 | Nuances divergem? | | | | Ambas nuances validas → incluir ambas |
| 7 | Genealogia citada? | | | | Incluir se qualquer um citou |
| 8 | Divergencia guidelines? | | | | Verificar guidelines originais |
| 9 | Critica EBM | | | | Critica valida → incluir |
| 10 | Sugestao de conteudo | | | | Lucas decide |

### Regras de resolucao
- **PMID exclusivo de 1 modelo:** Verificar no PubMed MCP. Se existe e e relevante → incluir. Se nao existe → descartar + marcar alucinacao.
- **Estatisticas divergem pro mesmo PMID:** O numero do paper original (full-text) vence.
- **3-source crossref:** Dado so entra no slide se confirmado por >=2 fontes independentes (PubMed + guideline, ou RCT + meta-analise).
- **Alucinacao detectada:** Registrar qual modelo alucionou e o que. Informar Lucas.

---

## PROTOCOLO DUAL (como funciona end-to-end)

### Passo 1 — Gemini (script)
```bash
node aulas/cirrose/scripts/content-research.mjs --slide {id}
```
Script extrai contexto do slide (HTML, notes, PMIDs, evidence-db, narrative, CASE.md), monta prompt, chama Gemini 3.1 Pro com Google Search grounding. Output salvo em `qa-screenshots/{id}/content-research.md`.

### Passo 2 — Claude Opus (conversa, $0 via Max)

Claude Code executa pesquisa via MCPs integrados na seguinte sequencia:

**CLAUDE OPUS PROTOCOL — sequencia MCP:**

1. **SCite** (`search_literature`): Smart Citations com contrasting evidence. Buscar claim principal + termos-chave. Retorna citacoes que suportam E contradizem.
   ```
   term: "{claim keywords} {condition}"
   topic: "Hepatology"
   limit: 5
   ```

2. **PubMed** (`search_articles`, `get_article_metadata`): Verificar PMIDs encontrados pelo SCite + buscar meta-analises recentes. Validar que cada PMID existe e os numeros batem.
   ```
   query: "{topic}[Title] AND (meta-analysis OR systematic review)"
   max_results: 5
   sort: "relevance"
   ```

3. **Consensus** (`search`): Broad discovery — encontrar papers que SCite e PubMed nao cobriram. Bom para guidelines recentes.
   ```
   query: "{topic} {guideline societies} recommendation"
   ```

4. **Gemini deep-research** (se gap encontrado): Quando os 3 MCPs acima nao cobrem um aspecto critico, usar `gemini-deep-research` para busca profunda com grounding.

**Output:** MESMO formato que o Gemini (## CLAIM, ## STATUS, ## REFORCO, etc.) para comparacao 1:1. Salva na secao "Claude Opus Response" do mesmo `content-research.md`.

**Regra de prompt nao-deterministico:** NAO embutir valores esperados nas queries. Perguntar ao MCP "qual e o AUROC do FIB-4?", nao "confirme que o AUROC do FIB-4 e 0.87". Isso evita leading the witness.

### Passo 3 — Comparison table
Claude Code preenche a tabela de 10 criterios. Flagra divergencias. PMIDs exclusivos de um modelo → verificar no PubMed MCP. Estatisticas divergentes → paper original vence.

### Passo 4 — Merge
Achados validados → `references/evidence-db.md` com tag do slide.
Achados conflitantes → `[VERIFICAR]` ate resolucao manual.

### Passo 5 — Checkpoint Lucas
Conteudo consolidado apresentado. Lucas decide o que entra no slide. So entao parte pra assembly.

---

## NOTAS DE IMPLEMENTACAO

### Token budget estimado por query
- System prompt: ~1200 tokens (fixo, v2 expandido)
- User prompt preenchido: ~500-700 tokens
- Thinking (Gemini 3.1 Pro HIGH): ~8000-16000 tokens (cobrados como output)
- Output: ~600-1000 tokens (constraint de 600 palavras + GRADE tags + PMID assessment)
- **Google Search grounding: ~$0.014-0.042 por slide** (1-3 search queries)
- **Custo total Gemini 3.1 Pro HIGH + Search: ~$0.14-0.27 por slide**
- **10 slides fracos: ~$1.40-2.70 total**
- **Custo Claude Opus: $0 (assinatura Max — via Claude Code ou claude.ai)**

### Temperatura
- **Gemini 3.1 Pro: MANTER 1.0** (default). Google recomenda explicitamente nao reduzir.
- **Claude: 0 a 0.3** — Claude nao tem o mesmo problema. Temperatura baixa funciona bem.

### Mudancas v2 → v3 (2026-03-30)
- System prompt: +SOURCE PRIORITY (sequencia 1-5), +TIER-1 SOURCES list, +PMID verification obrigatoria
- Claude protocol: sequencia MCP documentada (SCite → PubMed → Consensus → Gemini deep-research)
- Cross-validation: tabela expandida 10→10 com coluna "Acao se diverge" + regras de resolucao
- Prompt nao-deterministico: regra explicita contra leading the witness

### Mudancas v1 → v2 (2026-03-28)
- Patient anchor: era hardcoded "58 anos" → agora le CASE.md em runtime via `extractPatientAnchor()`
- GENEALOGIA: era opcional → obrigatoria para scores/testes/classificacoes
- GUIDELINE DIVERGENCE: secao nova, obrigatoria quando 2+ sociedades citadas
- REFORCO vs NUANCE: definicao explicita adicionada ao system prompt
- NARRATIVE METADATA: secao nova explicando archetypes/roles/tension ao modelo
- Output format: headers plain text (`CLAIM:`) → markdown headings (`## CLAIM`)
- User prompt: archetype/role glossary injetado, --fields flag para campos especificos
- Comparison table: adicionado criterio "Divergencia guidelines?"

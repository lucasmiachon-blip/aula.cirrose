# Content Research Prompt — aula.cirrose

## Modelos
- **Claude:** Opus 4.6 (via assinatura Max — Claude Code ou claude.ai — custo $0)
- **Gemini:** 3.1 Pro (melhor raciocínio disponível, $2.00/$12.00 per 1M tokens)
- Fallback: Gemini 2.5 Pro (GA estável, $1.25/$10.00 — trocar modelo na URI)

## Prompt Engineering — decisões específicas pro Gemini 3.1 Pro

Baseado na documentação oficial do Google (Vertex AI Gemini 3 Prompting Guide, março 2026):

1. **Temperatura 1.0 (default)** — valores menores causam looping em tarefas de raciocínio.
   A precisão vem do thinkingLevel, não da temperatura.
2. **Constraints positivas, não negativas** — em vez de "NEVER fabricate", usar "write [VERIFICAR]
   when confidence < 90%". Gemini 3 over-indexa em constraints negativas amplas.
3. **Direto e estruturado** — Gemini 3 responde melhor a instruções curtas e diretas.
   Técnicas verbosas de prompt eng pra modelos antigos degradam performance.
4. **Formato consistente** — usar UM estilo (=== SECTIONS ===), não misturar XML + Markdown.
5. **Knowledge cutoff declarado** — Gemini 3.1 Pro tem cutoff em janeiro 2025.
   Declarar explicitamente no prompt melhora grounding.
6. **thinkingLevel em vez de thinkingBudget** — API do 3.1 Pro migrou pra níveis nomeados.
7. **Grounding with Google Search** — acesso a dados em tempo real (até hoje, março 2026).
   Cutoff do modelo é jan/2025, mas com search habilitado ele busca na web.
   Custo: $14/1k search queries (~$0.014 por busca). Gemini decide quantas buscas fazer.

## Como usar

### Via Claude (assinatura Max — custo $0)
Claude Code monta o prompt e roda direto como Opus. Ou cole o prompt preenchido aqui no claude.ai.
Não precisa de API key — usa a assinatura.

### Via Gemini (curl no terminal)
```powershell
$env:GEMINI_KEY = "sua-key"

# Salvar o prompt num arquivo temporário (Claude Code faz isso)
$body = @{
    contents = @(@{
        role = "user"
        parts = @(@{ text = $prompt })
    })
    systemInstruction = @{
        parts = @(@{ text = $systemPrompt })
    }
    generationConfig = @{
        # IMPORTANTE: Google recomenda temp 1.0 (default) para Gemini 3.
        # Valores < 1.0 causam looping e degradação em tarefas de raciocínio.
        temperature = 1.0
        maxOutputTokens = 4096
        thinkingConfig = @{
            thinkingLevel = "HIGH"  # máximo raciocínio — usar MEDIUM se custo subir demais
        }
    }
    # Grounding com Google Search — acesso a dados até HOJE (março 2026)
    # Custo: ~$0.014 por query de busca ($14/1k queries)
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

### Extração automática por slide (Claude Code roda isso antes)
```powershell
# Substituir SLIDE_FILE pelo arquivo real
$html = Get-Content "aulas\cirrose\slides\SLIDE_FILE" -Raw
$h2 = [regex]::Match($html, '<h2[^>]*>(.*?)</h2>', 'Singleline').Groups[1].Value
$body = [regex]::Match($html, '</h2>(.*?)<aside', 'Singleline').Groups[1].Value
$notes = [regex]::Match($html, '<aside class="notes">(.*?)</aside>', 'Singleline').Groups[1].Value
Write-Host "H2: $h2"
Write-Host "BODY: $body"
Write-Host "NOTES: $notes"
```

---

## SYSTEM PROMPT (EN — fixo, idêntico nos dois modelos)

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

When adapting GRADE to non-intervention questions (prognosis, diagnosis), note: "[GRADE adaptado — questão diagnóstica/prognóstica]"

When a guideline gives a strong recommendation on low-quality evidence, flag the discrepancy explicitly.

=== EVIDENCE-BASED MEDICINE CRITIQUE ===

When relevant (and briefly), note:
- Known criticisms of the evidence base (e.g., surrogate endpoints, industry funding, generalizability)
- Where expert practice diverges from published evidence
- Ongoing debates or recent shifts in the field

=== CONSTRAINTS ===

- Output in Brazilian Portuguese (PT-BR). Maximum 600 words.
- Your knowledge cutoff is January 2025, but you have access to Google Search for recent information. Use search to verify PMIDs, find recent guidelines (2023-2026), and check for updates to recommendations. When confidence is below 90% on any PMID, statistic, or page number, write [VERIFICAR] and state what to look up.
- When citing textbooks, describe the argument the passage makes. Provide author, edition, chapter, and page range.
- Prioritize sources from 2020–2025. Include older sources only when they are foundational/landmark.
- This audience is expert-level (hepatologists at congress). Provide only actionable, advanced content — assume all fundamentals are known.
- Focus exclusively on what is MISSING from the slide. Use the provided existing data as your baseline, then build on top of it.

=== OUTPUT FORMAT (follow exactly) ===

CLAIM: [the h2 assertion]
STATUS: FORTE | NUANÇÁVEL | DESATUALIZADO | INCOMPLETO

AVALIAÇÃO PMIDs EXISTENTES (obrigatório se há PMIDs no slide):
Para cada PMID já presente:
- PMID | Primeiro autor, Ano | [TYPE TAG] | Status: ATUAL / SUPERSEDED / RETRACTED
  Se SUPERSEDED: citar o paper que o substituiu com PMID

REFORÇO (max 2):
- [finding] — [TYPE TAG] — PMID:XXXXX or [Book, Ed, Ch, p.XX] — N=X — [stat with CI95%/p] — [year]
  GRADE: ⊕⊕⊕◯ [one-line justification]

NUANCE (max 2):
- [finding that qualifies, limits, or contradicts] — [TYPE TAG] — source — [stat] — [year]
  GRADE: ⊕⊕◯◯ [one-line justification]
  (if EBM critique applies, add one line: "Crítica: ...")

GENEALOGIA (only if relevant — max 1):
- [LANDMARK] — [who first described/established this concept] — [year] — [why it matters for the claim]

CONTEÚDO SUGERIDO (max 1):
- Body text (≤30 words, assertion-evidence format, no bullets)
- Visual: [data visualization that would prove the claim]

DECISÃO CLÍNICA (max 1):
- [the "e daí?" — what clinical action this enables for a hepatologist seeing 20 cirrhosis patients/month]

GAPS (max 2):
- [what an expert would ask that this slide can't answer]

DADOS PARA SPEAKER NOTES (max 3):
- [estatística: NNT, HR, OR, CI95%, p-valor] — fonte — como usar na fala
(Destino: <aside class="notes"> do slide HTML)

If the claim is FORTE and evidence is complete, say so in 2 lines and stop. Do not pad.
```

---

## USER PROMPT TEMPLATE (Claude Code preenche os slots)

```
FLAG: This slide was flagged as WEAK IN CONTENT. Reason: {{WEAKNESS_REASON}}
(e.g., "claim sem evidência tier-1", "dado desatualizado", "falta nuance", "corpo genérico")

SLIDE: {{SLIDE_ID}}
POSITION IN ARC: {{ARC_POSITION}} (e.g., "Act 1 — rising tension, 3rd of 8 slides")
NARRATIVE ROLE: {{NARRATIVE_ROLE}} (e.g., "Reframe: shift from binary to spectrum model")

CLAIM (h2):
{{H2_TEXT}}

CURRENT BODY (≤30 words visible on slide):
{{BODY_TEXT}}

CURRENT DATA IN NOTES:
{{NOTES_DATA}}

EXISTING PMIDs:
{{PMID_LIST}}

SLIDE OBJECTIVE: {{SLIDE_OBJECTIVE}}
(e.g., "prove that CSPH is the inflection point, not cirrhosis diagnosis")

NARRATIVE CONTEXT:
- Previous slide claimed: {{PREV_SLIDE_CLAIM}}
- Next slide will claim: {{NEXT_SLIDE_CLAIM}}
- Patient anchor: Antônio, 58 anos, etilista, descoberta incidental de cirrose em exame de rotina

WHAT I NEED:
Strengthen this slide's evidence base. Prioritize: guidelines from authorities (EASL, AASLD, Baveno), recent meta-analyses/systematic reviews (last 5 years), landmark RCTs. Include textbook references if they add weight. Classify every source. Rate evidence quality via GRADE. Flag discrepancies between recommendation strength and evidence quality. Note genealogy of key concepts if foundational studies exist. If evidence is genuinely weak or contested, say so — do not manufacture strength.
```

---

## COMPARAÇÃO ENTRE MODELOS

Após rodar nos dois, comparar:

| Critério | Claude | Gemini | Match? |
|---|---|---|---|
| STATUS do claim | | | |
| PMIDs idênticos? | | | |
| Estatísticas batem? | | | |
| GRADE concorda? | | | |
| Tipo de fonte (tag) | | | |
| Nuances divergem? | | | |
| Genealogia citada? | | | |
| Crítica EBM | | | |
| Sugestão de conteúdo | | | |
| Alucinação detectada? | | | |

**Regra:** Se um PMID aparece em só um modelo, verificar no PubMed antes de usar.
**Regra:** Se estatísticas divergem pro mesmo PMID, o número do paper original vence.

---

## NOTAS DE IMPLEMENTAÇÃO

### Token budget estimado por query
- System prompt: ~900 tokens (fixo)
- User prompt preenchido: ~400-600 tokens
- Thinking (Gemini 3.1 Pro HIGH): ~8000-16000 tokens (cobrados como output)
- Output: ~600-1000 tokens (constraint de 600 palavras + GRADE tags + PMID assessment)
- **Google Search grounding: ~$0.014-0.042 por slide** (1-3 search queries × $14/1k queries)
- **Custo total Gemini 3.1 Pro HIGH + Search: ~$0.14-0.27 por slide**
- **10 slides fracos: ~$1.40-2.70 total**
- **Custo Claude Opus: $0 (assinatura Max — via Claude Code ou claude.ai)**
- **Fallback sem search:** remover bloco `tools` → economiza ~$0.01-0.04/slide, mas perde dados pós-jan/2025

### Temperatura
- **Gemini 3.1 Pro: MANTER 1.0** (default). Google recomenda explicitamente não reduzir.
  Valores < 1.0 causam looping e degradação em tarefas de raciocínio complexo.
  A precisão vem do thinkingLevel HIGH, não da temperatura baixa.
- **Claude: 0 a 0.3** — Claude não tem o mesmo problema. Temperatura baixa funciona bem.
- Se output do Gemini vier inconsistente, o ajuste correto é no thinkingLevel, não na temperatura.

### O que Claude Code faz automaticamente:
1. Autor diz "rodar content research no slide X" (ou "nos slides fracos")
2. Lê o HTML do slide — extrai h2, body, notes, PMIDs
3. Consulta _manifest.js pra posição no arco + slides anterior/posterior
4. Identifica a fraqueza (sem PMID tier-1? dado antigo? corpo genérico?)
5. Preenche os slots do user prompt
6. Roda o prompt ELE MESMO como Opus (assinatura Max, $0) → salva output
7. Dispara fetch pro Gemini 3.1 Pro via content-research.mjs → salva output
8. Gera tabela comparativa lado a lado
9. Sinaliza divergências pra autor verificar no PubMed

Nota: o script content-research.mjs NÃO chama a API do Claude.
O lado Claude é sempre via assinatura (Claude Code ou claude.ai).

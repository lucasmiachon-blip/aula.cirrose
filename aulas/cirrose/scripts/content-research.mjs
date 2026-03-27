#!/usr/bin/env node
/**
 * Content Research Pipeline — Gemini 3.1 Pro + Google Search grounding.
 * Extracts slide data, detects evidence weakness, builds prompts, calls Gemini.
 * Claude side runs via conversation (Max subscription, $0).
 *
 * Usage:
 *   node aulas/cirrose/scripts/content-research.mjs --slide s-a2-04                          # full run (Gemini)
 *   node aulas/cirrose/scripts/content-research.mjs --slide s-a2-04 --reason "falta tier-1"  # manual weakness
 *   node aulas/cirrose/scripts/content-research.mjs --slide s-a2-04 --prompt-only            # print prompts, no API
 *
 * Requires: GEMINI_API_KEY env var (unless --prompt-only)
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AULA_DIR = join(__dirname, '..');
const REPO_ROOT = join(AULA_DIR, '..', '..');

// --- CLI ---
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}
function hasFlag(name) { return args.includes(`--${name}`); }

const SLIDE_ID = getArg('slide', null);
const REASON = getArg('reason', null);
const PROMPT_ONLY = hasFlag('prompt-only');

if (!SLIDE_ID) {
  console.error('Usage: node content-research.mjs --slide <id> [--reason "..."] [--prompt-only]');
  process.exit(1);
}

const MODEL = 'gemini-3.1-pro-preview';
const BASE = 'https://generativelanguage.googleapis.com';

if (!PROMPT_ONLY) {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) { console.error('GEMINI_API_KEY not set. Use --prompt-only to skip API call.'); process.exit(1); }
}

// ============================================================
// PHASE 1: EXTRACT
// ============================================================

function findSlideFile(slideId) {
  const manifestPath = join(AULA_DIR, 'slides', '_manifest.js');
  const manifest = readFileSync(manifestPath, 'utf8');
  const regex = new RegExp(`id:\\s*['"]${slideId}['"][^}]*file:\\s*['"]([^'"]+)['"]`);
  const match = manifest.match(regex);
  if (match) return join(AULA_DIR, 'slides', match[1]);
  // Fallback: scan slides dir
  const files = readdirSync(join(AULA_DIR, 'slides')).filter(f => f.endsWith('.html'));
  for (const f of files) {
    const content = readFileSync(join(AULA_DIR, 'slides', f), 'utf8');
    if (content.includes(`id="${slideId}"`)) return join(AULA_DIR, 'slides', f);
  }
  return null;
}

function extractH2(html) {
  const match = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  if (!match) return '(no h2 found)';
  return match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractBodyText(html) {
  // Text between </h2> and <aside or <p class="source-tag">, stripped of HTML
  const match = html.match(/<\/h2>([\s\S]*?)(?:<aside|<p\s+class="source-tag")/);
  if (!match) return '(no body found)';
  return match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractNotes(html) {
  const match = html.match(/<aside class="notes">([\s\S]*?)<\/aside>/);
  return match ? match[1].trim() : '(no notes)';
}

function extractSourceTag(html) {
  const match = html.match(/<p\s+class="source-tag">([\s\S]*?)<\/p>/);
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : '';
}

function extractPMIDs(text) {
  const matches = [...text.matchAll(/PMID\s*:?\s*(\d{7,8})/g)];
  return [...new Set(matches.map(m => m[1]))];
}

function getSlideMetadata(slideId) {
  const manifestPath = join(AULA_DIR, 'slides', '_manifest.js');
  const text = readFileSync(manifestPath, 'utf8');

  const slides = [];
  for (const line of text.split('\n')) {
    const idMatch = line.match(/id:\s*'([^']+)'/);
    if (!idMatch) continue;

    const get = (key) => {
      const m = line.match(new RegExp(`${key}:\\s*'([^']*(?:\\\\'[^']*)*)'`));
      return m ? m[1].replace(/\\'/g, "'") : '';
    };
    const getNum = (key) => {
      const m = line.match(new RegExp(`${key}:\\s*(\\d+)`));
      return m ? parseInt(m[1]) : 0;
    };

    slides.push({
      id: idMatch[1],
      file: get('file'),
      act: get('act') || null,
      headline: get('headline'),
      archetype: get('archetype'),
      sectionTag: get('sectionTag'),
      narrativeRole: get('narrativeRole') || null,
      tensionLevel: getNum('tensionLevel'),
      clickReveals: getNum('clickReveals'),
    });
  }

  const idx = slides.findIndex(s => s.id === slideId);
  if (idx === -1) return { position: '?/??', slides: [], idx: -1, slide: null, prev: null, next: null };

  return {
    position: `${idx + 1}/${slides.length}`,
    slides,
    idx,
    slide: slides[idx],
    prev: idx > 0 ? slides[idx - 1] : null,
    next: idx < slides.length - 1 ? slides[idx + 1] : null,
  };
}

function getAdjacentClaims(meta) {
  const readH2 = (slide) => {
    if (!slide) return '(none)';
    const filePath = join(AULA_DIR, 'slides', slide.file);
    if (!existsSync(filePath)) return slide.headline || '(unknown)';
    const html = readFileSync(filePath, 'utf8');
    return extractH2(html);
  };
  return {
    prevClaim: readH2(meta.prev),
    nextClaim: readH2(meta.next),
  };
}

function extractEvidenceBlock(slideId, pmids) {
  const evidencePath = join(AULA_DIR, 'references', 'evidence-db.md');
  if (!existsSync(evidencePath)) return '(evidence-db.md not found)';
  const text = readFileSync(evidencePath, 'utf8');
  const lines = text.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isRelevant = line.includes(slideId) || pmids.some(p => line.includes(p));
    if (isRelevant) {
      // Include 2 lines before (header context) and the matching line
      const start = Math.max(0, i - 2);
      for (let j = start; j <= i; j++) {
        if (!result.includes(lines[j])) result.push(lines[j]);
      }
    }
  }
  return result.length > 0 ? result.join('\n') : '(no entries found for this slide)';
}

function extractNarrativeBlock(slideId) {
  const narrativePath = join(AULA_DIR, 'references', 'narrative.md');
  if (!existsSync(narrativePath)) return '(narrative.md not found)';
  const text = readFileSync(narrativePath, 'utf8');
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(slideId)) {
      const start = Math.max(0, i - 1);
      const end = Math.min(lines.length, i + 4);
      return lines.slice(start, end).join('\n');
    }
  }
  return '(slide not found in narrative.md)';
}

function extractSlideContext(slideId) {
  const filePath = findSlideFile(slideId);
  if (!filePath || !existsSync(filePath)) {
    console.error(`Slide file not found for ${slideId}`);
    process.exit(1);
  }

  const html = readFileSync(filePath, 'utf8');
  const h2 = extractH2(html);
  const bodyText = extractBodyText(html);
  const notes = extractNotes(html);
  const sourceTag = extractSourceTag(html);
  const existingPMIDs = extractPMIDs(html);

  const meta = getSlideMetadata(slideId);
  const { prevClaim, nextClaim } = getAdjacentClaims(meta);
  const evidenceBlock = extractEvidenceBlock(slideId, existingPMIDs);
  const narrativeBlock = extractNarrativeBlock(slideId);

  return {
    slideId,
    filePath,
    h2,
    bodyText,
    notes,
    sourceTag,
    existingPMIDs,
    meta,
    prevClaim,
    nextClaim,
    evidenceBlock,
    narrativeBlock,
  };
}

// ============================================================
// PHASE 2: WEAKNESS DETECTION
// ============================================================

function classifyWeakness(ctx, manualReason) {
  if (manualReason) {
    return { category: 'manual', description: manualReason, severity: 3 };
  }

  // Check for [TBD] or [TBD SOURCE] in notes
  if (/\[TBD[^\]]*\]/i.test(ctx.notes)) {
    return { category: 'tbd-source', description: 'Speaker notes contêm [TBD SOURCE] — evidência pendente', severity: 3 };
  }

  // Check if any PMID maps to Tier-1 in evidence-db
  const evidencePath = join(AULA_DIR, 'references', 'evidence-db.md');
  if (existsSync(evidencePath)) {
    const evidenceText = readFileSync(evidencePath, 'utf8');
    const hasTier1 = ctx.existingPMIDs.some(pmid => {
      // Check if PMID appears near Tier-1 markers
      const idx = evidenceText.indexOf(pmid);
      if (idx === -1) return false;
      const surroundingStart = Math.max(0, idx - 500);
      const surrounding = evidenceText.slice(surroundingStart, idx + 200);
      return /Tier-1|tier-1|TIER-1/.test(surrounding);
    });
    if (!hasTier1 && ctx.existingPMIDs.length > 0) {
      return { category: 'no-tier1', description: 'PMIDs presentes mas nenhum é Tier-1 no evidence-db', severity: 3 };
    }
    if (ctx.existingPMIDs.length === 0) {
      return { category: 'no-tier1', description: 'Slide sem nenhum PMID — evidência ausente', severity: 3 };
    }
  }

  // Check body for specificity (no numbers or proper nouns = generic)
  if (!/\d/.test(ctx.bodyText) && ctx.bodyText.length > 10) {
    return { category: 'generic-body', description: 'Corpo do slide sem dados numéricos — potencialmente genérico', severity: 2 };
  }

  // Check for outdated references (all pre-2020)
  const years = [...ctx.notes.matchAll(/20(\d{2})/g)].map(m => 2000 + parseInt(m[1]));
  if (years.length > 0 && years.every(y => y < 2020)) {
    return { category: 'outdated', description: 'Todas as referências são anteriores a 2020', severity: 2 };
  }

  return { category: 'missing-nuance', description: 'Evidência presente mas pode faltar nuance ou atualização', severity: 1 };
}

// ============================================================
// PHASE 3: PROMPT ASSEMBLY
// ============================================================

function buildSystemPrompt() {
  return `You are a hepatology evidence consultant for a congress-level medical presentation. Your audience is practicing hepatologists — they know the basics cold. Skip fundamentals — provide only advanced, actionable content.

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

If the claim is FORTE and evidence is complete, say so in 2 lines and stop. Do not pad.`;
}

function buildUserPrompt(ctx, weakness) {
  const slide = ctx.meta.slide;
  const actLabel = slide?.act || 'N/A';
  const sectionTag = slide?.sectionTag || '';
  const narrativeRole = slide?.narrativeRole || 'nenhum';
  const tensionLevel = slide?.tensionLevel ?? '?';

  return `FLAG: This slide was flagged as WEAK IN CONTENT. Reason: ${weakness.description}
(category: ${weakness.category}, severity: ${weakness.severity}/3)

SLIDE: ${ctx.slideId}
POSITION IN ARC: ${actLabel} — position ${ctx.meta.position}${sectionTag ? ` (${sectionTag})` : ''}
NARRATIVE ROLE: ${narrativeRole} | Tension: ${tensionLevel}/5

CLAIM (h2):
${ctx.h2}

CURRENT BODY (≤30 words visible on slide):
${ctx.bodyText}

CURRENT DATA IN NOTES:
${ctx.notes}

EXISTING PMIDs:
${ctx.existingPMIDs.length > 0 ? ctx.existingPMIDs.join(', ') : 'NENHUM'}

SLIDE SOURCE TAG:
${ctx.sourceTag || '(none)'}

EVIDENCE-DB ENTRIES:
${ctx.evidenceBlock}

NARRATIVE CONTEXT:
- Previous slide claimed: ${ctx.prevClaim}
- Next slide will claim: ${ctx.nextClaim}
- Patient anchor: Antônio, 58 anos, etilista, descoberta incidental de cirrose em exame de rotina

NARRATIVE BLOCK:
${ctx.narrativeBlock}

WHAT I NEED:
Strengthen this slide's evidence base. Prioritize: guidelines from authorities (EASL, AASLD, Baveno), recent meta-analyses/systematic reviews (last 5 years), landmark RCTs. Include textbook references if they add weight. Classify every source. Rate evidence quality via GRADE. Flag discrepancies between recommendation strength and evidence quality. Note genealogy of key concepts if foundational studies exist. If evidence is genuinely weak or contested, say so — do not manufacture strength.`;
}

// ============================================================
// PHASE 4: GEMINI API
// ============================================================

async function callGemini(systemPrompt, userPrompt) {
  const API_KEY = process.env.GEMINI_API_KEY;

  const payload = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 1.0,
      topP: 0.95,
      maxOutputTokens: 8192,
      thinkingConfig: { thinkingLevel: 'HIGH' },
    },
    tools: [{ googleSearch: {} }],
  };

  console.log(`\n2. Sending to Gemini (${MODEL})...`);
  const startTime = Date.now();

  let res = await fetch(
    `${BASE}/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  // Fallback: if thinkingLevel is rejected, retry with thinkingBudget
  if (!res.ok) {
    const errText = await res.text();
    if (errText.includes('thinkingLevel') || errText.includes('thinkingConfig')) {
      console.log('  thinkingLevel rejected — retrying with thinkingBudget: 16384...');
      payload.generationConfig.thinkingConfig = { thinkingBudget: 16384 };
      res = await fetch(
        `${BASE}/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
    }
    if (!res.ok) {
      const err2 = await res.text();
      console.error(`API Error ${res.status}:`, err2.slice(0, 500));
      process.exit(1);
    }
  }

  const result = await res.json();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const usage = result.usageMetadata || {};
  const finishReason = result.candidates?.[0]?.finishReason || 'UNKNOWN';

  // Extract text, skip thinking parts
  const parts = result.candidates?.[0]?.content?.parts || [];
  const textParts = parts.filter(p => p.text && !p.thought);
  const thinkingParts = parts.filter(p => p.thought);
  const text = textParts.map(p => p.text).join('\n') || '(empty response)';

  // Grounding metadata
  const groundingMeta = result.candidates?.[0]?.groundingMetadata;
  const groundingChunks = groundingMeta?.groundingChunks || [];
  const searchQueries = groundingMeta?.searchEntryPoint?.renderedContent ? ['(search used)'] : [];

  // Cost calculation (thinking tokens billed as output)
  const inputTokens = usage.promptTokenCount || 0;
  const outputTokens = usage.candidatesTokenCount || 0;
  const thinkingTokens = usage.thoughtsTokenCount || 0;
  const totalCost = (inputTokens / 1_000_000 * 2.0) + ((outputTokens + thinkingTokens) / 1_000_000 * 12.0);

  console.log(`  Tokens: ${inputTokens} in / ${thinkingTokens} thinking / ${outputTokens} out | Cost: ~$${totalCost.toFixed(3)} | ${elapsed}s`);
  console.log(`  Finish reason: ${finishReason}`);
  if (groundingChunks.length > 0) console.log(`  Grounding: ${groundingChunks.length} sources found`);

  return {
    text,
    inputTokens,
    outputTokens,
    thinkingTokens,
    totalCost,
    elapsed,
    finishReason,
    groundingChunks,
  };
}

// ============================================================
// PHASE 5: OUTPUT
// ============================================================

function buildOutputMarkdown(ctx, weakness, geminiResult) {
  const slide = ctx.meta.slide;
  const date = new Date().toISOString().slice(0, 10);

  // Grounding sources
  let groundingSources = '(no grounding sources)';
  if (geminiResult.groundingChunks.length > 0) {
    groundingSources = geminiResult.groundingChunks
      .map((c, i) => {
        const web = c.web || {};
        return `${i + 1}. [${web.title || 'Source'}](${web.uri || '#'})`;
      })
      .join('\n');
  }

  return `# Content Research — ${ctx.slideId}
Date: ${date} | Weakness: ${weakness.category} (${weakness.severity}/3)

## Slide Context
- **h2:** ${ctx.h2}
- **Act:** ${slide?.act || 'N/A'} | Position: ${ctx.meta.position} | Tension: ${slide?.tensionLevel ?? '?'}/5
- **Archetype:** ${slide?.archetype || '?'}
- **Narrative role:** ${slide?.narrativeRole || 'none'}
- **Existing PMIDs:** ${ctx.existingPMIDs.length > 0 ? ctx.existingPMIDs.join(', ') : 'NONE'}
- **Weakness:** ${weakness.description}

---

## Gemini 3.1 Pro Response
${geminiResult.text}

### Grounding Sources
${groundingSources}

### Gemini Metadata
- Model: ${MODEL} | Temp: 1.0 | thinkingLevel: HIGH
- Tokens: ${geminiResult.inputTokens} in / ${geminiResult.thinkingTokens} thinking / ${geminiResult.outputTokens} out
- Cost: ~$${geminiResult.totalCost.toFixed(3)} | Elapsed: ${geminiResult.elapsed}s
- Finish reason: ${geminiResult.finishReason}

---

## Claude Opus Response
(a ser preenchido por Claude Code após rodar o prompt na conversa)

---

## Comparison Table
(a ser preenchido após ambas respostas estarem disponíveis)

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
| Alucinação detectada? | | | |

## Divergências (verificar no PubMed)
(a ser preenchido após comparação)
`;
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log(`Content Research Pipeline — ${SLIDE_ID}`);
  console.log(`Mode: ${PROMPT_ONLY ? 'prompt-only' : 'full (Gemini API)'}\n`);

  // Phase 1: Extract
  console.log('1. Extracting slide context...');
  const ctx = extractSlideContext(SLIDE_ID);
  console.log(`  h2: ${ctx.h2}`);
  console.log(`  PMIDs: ${ctx.existingPMIDs.length > 0 ? ctx.existingPMIDs.join(', ') : 'none'}`);
  console.log(`  Position: ${ctx.meta.position} | Act: ${ctx.meta.slide?.act || 'N/A'} | Role: ${ctx.meta.slide?.narrativeRole || 'none'}`);

  // Phase 2: Detect weakness
  const weakness = classifyWeakness(ctx, REASON);
  console.log(`  Weakness: ${weakness.category} (severity ${weakness.severity}/3) — ${weakness.description}`);

  // Phase 3: Build prompts
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(ctx, weakness);

  if (PROMPT_ONLY) {
    console.log('\n' + '='.repeat(60));
    console.log('SYSTEM PROMPT:');
    console.log('='.repeat(60));
    console.log(systemPrompt);
    console.log('\n' + '='.repeat(60));
    console.log('USER PROMPT:');
    console.log('='.repeat(60));
    console.log(userPrompt);
    console.log('\n' + '='.repeat(60));
    console.log(`\nSystem prompt: ~${Math.round(systemPrompt.length / 4)} tokens`);
    console.log(`User prompt: ~${Math.round(userPrompt.length / 4)} tokens`);
    process.exit(0);
  }

  // Phase 4: Call Gemini
  const geminiResult = await callGemini(systemPrompt, userPrompt);

  // Phase 5: Save output
  const outDir = join(AULA_DIR, 'qa-screenshots', SLIDE_ID);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'content-research.md');
  const md = buildOutputMarkdown(ctx, weakness, geminiResult);
  writeFileSync(outPath, md);
  console.log(`\n3. Saved -> ${outPath}`);

  // Print Gemini response
  console.log('\n' + '='.repeat(60));
  console.log(geminiResult.text);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});

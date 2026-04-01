#!/usr/bin/env node
/**
 * Gemini QA pipeline — Gate 0 (defect inspector) + Gate 4 (editorial review).
 * Reads HTML/CSS/JS DYNAMICALLY from source files (E42 compliance).
 *
 * WORKFLOW: Gate 0 e Gate 4 são invocações SEPARADAS.
 *   O agente roda --inspect, apresenta resultado ao Lucas, e só roda --editorial após aprovação.
 *
 * Usage:
 *   node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-01 --inspect                    # Gate 0 only (default)
 *   node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-01 --editorial --round 5         # Gate 4 only (após Gate 0 PASS)
 *   node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-01 --editorial --round 5 --temp 0.8 --output custom.json --context "..."
 *
 * Requires: GEMINI_API_KEY env var
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AULA_DIR = join(__dirname, '..');
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

const BASE = 'https://generativelanguage.googleapis.com';

// G8: Pricing per 1M tokens — update when switching models (verified 2026-03-29)
const PRICING = {
  'gemini-3.1-pro-preview':        { input: 2.0,  output: 12.0 },
  'gemini-3-flash-preview':        { input: 0.50, output: 3.0  },
  'gemini-3.1-flash-lite-preview': { input: 0.25, output: 1.50 },
  'gemini-2.5-pro':                { input: 1.25, output: 10.0 },
  'gemini-2.5-flash':              { input: 0.30, output: 2.50 },
  'gemini-2.5-flash-lite':         { input: 0.10, output: 0.40 },
};
function modelCost(model) { return PRICING[model] || { input: 1.0, output: 5.0 }; }

// --- CLI args ---
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}

const SLIDE_ID = getArg('slide', 's-a1-01');
const ROUND = parseInt(getArg('round', '11'), 10);
const QA_DIR = join(AULA_DIR, 'qa-screenshots', SLIDE_ID);
const CUSTOM_OUTPUT = getArg('output', null);
const CUSTOM_TEMP = getArg('temp', null);
// Legacy args removed: --context, --diagnostic (used by old single-call Gate 4)
const REF_SLIDE = getArg('ref-slide', null);
const NO_REF = hasFlag('no-ref'); // A3: opt-out of auto ref-slide

// --- Mode flags ---
function hasFlag(name) { return args.includes(`--${name}`); }
const MODE = hasFlag('editorial') ? 'editorial' : 'inspect';

// F2: Model-per-gate — CLI > env var > smart default per mode
const MODEL_DEFAULT = MODE === 'inspect' ? 'gemini-3-flash-preview' : 'gemini-3.1-pro-preview';
const MODEL = getArg('model', null) || process.env.GEMINI_MODEL || MODEL_DEFAULT;

// J4: --help
if (hasFlag('help') || hasFlag('h')) {
  console.log(`Usage: node gemini-qa3.mjs --slide <id> [options]

Modes (pick one):
  --inspect          Gate 0 — binary defect check (default)
  --editorial        Gate 4 — editorial creative review

Options:
  --slide <id>       Slide ID (default: s-a1-01)
  --round <N>        Round number for Gate 4 (default: 11)
  --model <id>       Gemini model override (default: flash for Gate 0, pro for Gate 4)
  --temp <float>     Override temperature (Gate 4 default: 1.0)
  --output <path>    Custom output path
  --context <text>   Additional context paragraph
  --diagnostic <cls> CSS class to diagnose (cascade analysis)
  --ref-slide <id>   Reference slide for cross-slide consistency (auto-detected from manifest if omitted)
  --no-ref           Disable auto ref-slide detection
  --force-gate4      Override Gate 0 FAIL block (for known false positives)

Env: GEMINI_API_KEY (required), GEMINI_MODEL (global override)`);
  process.exit(0);
}

if (hasFlag('full')) {
  console.error('--full removido. Gate 0 e Gate 4 são invocações separadas.');
  console.error('  1. node gemini-qa3.mjs --slide X --inspect          (Gate 0)');
  console.error('  2. [checkpoint Lucas]');
  console.error('  3. node gemini-qa3.mjs --slide X --editorial --round N  (Gate 4)');
  process.exit(1);
}

// --- G2: Retry with exponential backoff (429, 500, 503, 504) ---
async function fetchWithRetry(url, options, { maxRetries = 3, baseDelay = 1500 } = {}) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return res;

      const status = res.status;
      const body = await res.text();

      // Non-retryable: 4xx except 429
      if (status >= 400 && status < 500 && status !== 429) {
        throw new Error(`API ${status}: ${body.slice(0, 300)}`);
      }

      // Retryable: 429, 5xx
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        console.warn(`  Retry ${attempt + 1}/${maxRetries} in ${Math.round(delay)}ms (HTTP ${status})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      throw new Error(`API ${status} after ${maxRetries} retries: ${body.slice(0, 300)}`);
    } catch (err) {
      clearTimeout(timeout);
      // Non-retryable errors (formatted HTTP errors): re-throw immediately
      if (err.message?.startsWith('API ')) throw err;

      // Network/timeout errors: retry if attempts remain
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        const reason = err.name === 'AbortError' ? 'timeout' : 'network';
        console.warn(`  Retry ${attempt + 1}/${maxRetries} in ${Math.round(delay)}ms (${reason}: ${err.message})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      throw err;
    }
  }
}

// --- Gate 0 constants ---
const REPO_ROOT = join(AULA_DIR, '..', '..');
const GATE0_PROMPT_PATH = join(REPO_ROOT, 'docs', 'prompts', 'gemini-gate0-inspector.md');
const CALL_A_PROMPT_PATH = join(REPO_ROOT, 'docs', 'prompts', 'gate4-call-a-visual.md');
const CALL_B_PROMPT_PATH = join(REPO_ROOT, 'docs', 'prompts', 'gate4-call-b-uxcode.md');
const CALL_C_PROMPT_PATH = join(REPO_ROOT, 'docs', 'prompts', 'gate4-call-c-motion.md');
const ERROR_DIGEST_PATH = join(REPO_ROOT, 'docs', 'prompts', 'error-digest.md');

// --- Response schemas (Gemini constrained decoding) ---
const BOOLEAN_NODE = { type: "OBJECT", properties: { pass: { type: "BOOLEAN" } } };
const GATE0_SCHEMA = {
  type: "OBJECT",
  properties: {
    slide_id: { type: "STRING" },
    states_received: { type: "ARRAY", items: { type: "STRING" } },
    must_pass: { type: "BOOLEAN" },
    should_pass: { type: "BOOLEAN" },
    summary: { type: "STRING" },
    checks: {
      type: "OBJECT",
      properties: Object.fromEntries(
        ['CLIPPING', 'OVERFLOW', 'OVERLAP', 'INVISIBLE', 'MISSING_MEDIA',
         'ANIMATION_STATE', 'ALIGNMENT', 'SPACING', 'READABILITY']
          .map(k => [k, BOOLEAN_NODE])
      ),
    },
  },
  required: ["slide_id", "states_received", "checks", "must_pass", "should_pass", "summary"],
};

const DIM_PROP = {
  type: "OBJECT",
  properties: {
    evidencia: { type: "STRING" },
    problemas: { type: "ARRAY", items: { type: "STRING" } },
    fixes: { type: "ARRAY", items: { type: "STRING" } },
    nota: { type: "NUMBER" },
  },
  required: ["evidencia", "problemas", "fixes", "nota"],
};

const SCHEMAS_GATE4 = {
  visual: {
    type: "OBJECT",
    properties: {
      distribuicao: DIM_PROP, proporcao: DIM_PROP, cor: DIM_PROP,
      tipografia: DIM_PROP, composicao: DIM_PROP,
      media_visual: { type: "NUMBER" },
      impressao_geral: { type: "STRING" },
    },
    required: ["distribuicao", "proporcao", "cor", "tipografia", "composicao", "media_visual"],
  },
  uxcode: {
    type: "OBJECT",
    properties: {
      gestalt: DIM_PROP, carga_cognitiva: DIM_PROP, information_design: DIM_PROP,
      css_cascade: DIM_PROP, failsafes: DIM_PROP,
      media_uxcode: { type: "NUMBER" },
      dead_css: { type: "ARRAY", items: { type: "STRING" } },
      specificity_conflicts: { type: "ARRAY", items: { type: "STRING" } },
      proposals: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            severity: { type: "STRING" }, titulo: { type: "STRING" },
            fix: { type: "STRING" }, arquivo: { type: "STRING" }, tipo: { type: "STRING" },
          },
        },
      },
    },
    required: ["gestalt", "carga_cognitiva", "information_design", "css_cascade", "failsafes", "media_uxcode", "proposals"],
  },
  motion: {
    type: "OBJECT",
    properties: {
      timing: DIM_PROP, easing: DIM_PROP, narrativa_motion: DIM_PROP,
      crossfade: DIM_PROP, proposito: DIM_PROP, artefatos: DIM_PROP,
      media_motion: { type: "NUMBER" },
      inventory: { type: "ARRAY", items: { type: "STRING" } },
      animation_value: { type: "STRING" },
    },
    required: ["timing", "easing", "narrativa_motion", "crossfade", "proposito", "artefatos", "media_motion", "inventory"],
  },
};

// --- Dynamic source extraction (E42) ---

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

function extractHTML(slideId) {
  const filePath = findSlideFile(slideId);
  if (!filePath || !existsSync(filePath)) {
    throw new Error(`Slide file not found for ${slideId}`);
  }
  console.log(`  HTML: ${filePath}`);
  return readFileSync(filePath, 'utf8');
}

function extractSlideCSS(slideId) {
  const cssPath = join(AULA_DIR, 'cirrose.css');
  const css = readFileSync(cssPath, 'utf8');
  const lines = css.split('\n');
  const sectionBoundary = /[━═=]{3,}/;

  // Pass 1: section-based — find ALL comment blocks containing slideId near a boundary
  // Supports both single-line (/* === s-a1-fib4 === */) and multi-line:
  //   /* ============================================
  //      s-a1-elasto — description
  //      ============================================ */
  // A1 fix: collect ALL matching sections (no break on first match)
  const allSections = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(slideId)) {
      // Check same line OR adjacent lines (±1) for boundary
      if (sectionBoundary.test(lines[i])
          || (i > 0 && sectionBoundary.test(lines[i - 1]))
          || (i + 1 < lines.length && sectionBoundary.test(lines[i + 1]))) {
        // Walk back to the opening boundary line
        let sectionStart = i;
        while (sectionStart > 0 && !sectionBoundary.test(lines[sectionStart])) sectionStart--;

        // Find the closing boundary of this header comment block
        let contentStart = sectionStart + 1;
        while (contentStart < lines.length && (lines[contentStart].includes(slideId) || sectionBoundary.test(lines[contentStart]) || lines[contentStart].trim() === '')) {
          contentStart++;
        }
        // Collect until next section boundary that doesn't belong to this slide
        const sectionResult = [];
        for (let j = sectionStart; j < lines.length; j++) {
          if (j >= contentStart && sectionBoundary.test(lines[j]) && !lines[j].includes(slideId)) {
            break;
          }
          sectionResult.push(lines[j]);
        }
        allSections.push(sectionResult);
        // Skip past this section to avoid re-matching lines within it
        i = sectionStart + sectionResult.length;
      }
    }
  }

  if (allSections.length > 0) {
    // Concatenate all matching sections
    const merged = [];
    for (const section of allSections) {
      if (merged.length > 0) merged.push('');
      merged.push(...section);
    }
    return merged;
  }

  // Pass 2 (fallback): existing logic — find rules with #slideId selectors
  const result = [];
  let capturing = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!capturing && line.includes(slideId)) {
      let commentStart = i;
      while (commentStart > 0 && (lines[commentStart - 1].trim().startsWith('/*') || lines[commentStart - 1].trim().startsWith('*'))) {
        commentStart--;
      }
      if (commentStart < i && lines[commentStart].includes('/*')) {
        for (let j = commentStart; j < i; j++) result.push(lines[j]);
      }
      capturing = true;
    }

    if (capturing) {
      result.push(line);
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;

      if (braceDepth === 0 && result.length > 1) {
        let nextContentLine = i + 1;
        while (nextContentLine < lines.length && lines[nextContentLine].trim() === '') nextContentLine++;
        if (nextContentLine < lines.length && lines[nextContentLine].includes(slideId)) {
          result.push('');
          continue;
        }
        capturing = false;
      }
    }
  }
  return result;
}

function extractBaseTokens() {
  const cssPath = join(AULA_DIR, 'cirrose.css');
  if (!existsSync(cssPath)) return '/* cirrose.css not found */';
  const css = readFileSync(cssPath, 'utf8');

  // Extract :root block (design tokens)
  const rootMatch = css.match(/:root\s*\{[^}]*\}/s);
  if (!rootMatch) return '/* :root not found in cirrose.css */';
  return rootMatch[0];
}

function extractCSS(slideId) {
  const sections = [];

  // 1. Design tokens from cirrose.css :root
  const tokens = extractBaseTokens();
  sections.push('/* === Design Tokens (:root) === */');
  sections.push(tokens);

  // 2. Slide-specific CSS from cirrose.css (#slideId selectors)
  const slideLines = extractSlideCSS(slideId);
  if (slideLines.length > 0) {
    sections.push('\n/* === Slide-specific CSS (cirrose.css) === */');
    sections.push(slideLines.join('\n'));
  }

  const combined = sections.join('\n');
  const lineCount = combined.split('\n').length;
  console.log(`  CSS: ${lineCount} lines (tokens + slide-specific)`);
  return combined;
}

function extractJS(slideId) {
  const regPath = join(AULA_DIR, 'slide-registry.js');
  const js = readFileSync(regPath, 'utf8');
  const marker = `'${slideId}'`;
  const idx = js.indexOf(marker);
  if (idx === -1) return '// No custom animation for this slide';

  // Find the function body — count braces from the opening
  let start = js.indexOf('{', js.indexOf('=>', idx));
  if (start === -1) return '// Parse error';

  let depth = 0;
  let end = start;
  for (let i = start; i < js.length; i++) {
    if (js[i] === '{') depth++;
    if (js[i] === '}') depth--;
    if (depth === 0) { end = i + 1; break; }
  }

  const body = js.slice(js.indexOf(marker), end);
  console.log(`  JS: ${body.split('\n').length} lines extracted for ${slideId}`);
  return body;
}

function extractNotes(html) {
  const match = html.match(/<aside class="notes">([\s\S]*?)<\/aside>/);
  return match ? match[1].trim() : '(no notes)';
}

// --- Slide metadata from manifest (absorbed from gemini.mjs) ---
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
      headline: get('headline'),
      archetype: get('archetype'),
      narrativeRole: get('narrativeRole') || 'null',
      tensionLevel: getNum('tensionLevel'),
      clickReveals: getNum('clickReveals'),
    });
  }

  const idx = slides.findIndex(s => s.id === slideId);
  if (idx === -1) return { pos: '?/?', prev: '(unknown)', next: '(unknown)', prevId: null, nextId: null, slide: null };

  return {
    pos: `${idx + 1}/${slides.length}`,
    prev: idx > 0 ? `${slides[idx - 1].id} (${slides[idx - 1].narrativeRole})` : '(first)',
    next: idx < slides.length - 1 ? `${slides[idx + 1].id} (${slides[idx + 1].narrativeRole})` : '(last)',
    prevId: idx > 0 ? slides[idx - 1].id : null,       // A3: raw ID for auto --ref-slide
    nextId: idx < slides.length - 1 ? slides[idx + 1].id : null,
    slide: slides[idx],
  };
}

function buildInteractionFlow(clickReveals) {
  if (clickReveals === 0) return 'Slide estatico — sem click-reveals. Animacoes automaticas no slide:entered.';
  const states = ['S0 — Estado inicial (slide entry, antes de reveals)'];
  for (let i = 1; i <= clickReveals; i++) states.push(`S${i} — ArrowRight #${i} → reveal grupo ${i}`);
  return states.join('\n');
}

// --- Gate 0: Defect Inspector ---

function findStatePng(qaDir, state) {
  // Legacy names (backward compat) then new convention ({slide}_{date}_{time}_{state}.png)
  const legacy = {
    S0: ['S0-1280x720.png', 'S0.png'],
    S2: ['S2-final-1280x720.png', 'S2-1280x720.png', 'S2.png'],
  };
  for (const name of (legacy[state] || [`${state}.png`])) {
    const p = join(qaDir, name);
    if (existsSync(p)) return p;
  }
  // New naming: *_{state}.png — pick most recent by alpha sort
  if (existsSync(qaDir)) {
    const pattern = new RegExp(`_${state}\\.png$`);
    const matches = readdirSync(qaDir).filter(f => pattern.test(f)).sort().reverse();
    if (matches.length > 0) return join(qaDir, matches[0]);
  }
  return null;
}

function buildGate0Payload(slideId, qaDir) {
  if (!existsSync(GATE0_PROMPT_PATH)) {
    throw new Error(`Gate 0 prompt not found: ${GATE0_PROMPT_PATH}`);
  }
  const promptTemplate = readFileSync(GATE0_PROMPT_PATH, 'utf8');
  const prompt = promptTemplate.replace(/\{\{SLIDE_ID\}\}/g, slideId);

  const parts = [{ text: prompt }];
  const statesReceived = [];

  // Gate 0 uses S0 + S2. S1 (mid-animation) causes false positives.
  // Slides with complex animations may only have clean S2 — that's enough.
  for (const state of ['S0', 'S2']) {
    const pngPath = findStatePng(qaDir, state);
    if (pngPath) {
      const data = readFileSync(pngPath).toString('base64');
      parts.push({ inlineData: { mimeType: 'image/png', data } });
      statesReceived.push(state);
      console.log(`  ${state}: ${pngPath}`);
    }
  }

  if (statesReceived.length === 0) {
    throw new Error(`No PNGs found in ${qaDir}. Run qa-batch-screenshot.mjs first.`);
  }

  return {
    payload: {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.1, topP: 0.9, maxOutputTokens: 8192,
        responseMimeType: 'application/json',
        responseSchema: GATE0_SCHEMA,
      },
    },
    statesReceived,
  };
}

async function runGate0(slideId, qaDir) {
  console.log(`\n=== GATE 0 — Defect Inspector — ${slideId} ===\n`);
  console.log('0. Finding PNGs...');

  const { payload, statesReceived } = buildGate0Payload(slideId, qaDir);

  console.log(`\n1. Sending to Gemini (${MODEL})...`);

  const res = await fetchWithRetry(
    `${BASE}/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  const result = await res.json();
  const usage = result.usageMetadata || {};
  const finishReason = result.candidates?.[0]?.finishReason || 'UNKNOWN';
  const p = modelCost(MODEL);
  const totalCost = ((usage.promptTokenCount || 0) / 1e6 * p.input) + ((usage.candidatesTokenCount || 0) / 1e6 * p.output);
  console.log(`  Tokens: ${usage.promptTokenCount || '?'} in / ${usage.candidatesTokenCount || '?'} out | Cost: ~$${totalCost.toFixed(4)}`);
  console.log(`  Finish reason: ${finishReason}`);

  if (finishReason !== 'STOP') {
    console.error(`  WARNING: Response did not finish normally (${finishReason}). Output may be truncated.`);
  }

  // Parse JSON response (G1: responseMimeType guarantees valid JSON, no fence-strip needed)
  const rawText = result.candidates?.[0]?.content?.parts
    ?.map(p => p.text).filter(Boolean).join('') || '{}';

  let gate0Result;
  try {
    let parsed = JSON.parse(rawText);
    // Handle array response (take first element)
    if (Array.isArray(parsed)) parsed = parsed[0];
    gate0Result = parsed;
  } catch (e) {
    console.error('Failed to parse Gate 0 JSON response:', rawText.slice(0, 500));
    mkdirSync(qaDir, { recursive: true });
    writeFileSync(join(qaDir, 'gate0-raw.txt'), rawText);
    throw new Error('Gate 0 JSON parse failed — raw saved to gate0-raw.txt');
  }

  // Save result
  mkdirSync(qaDir, { recursive: true });
  const outPath = join(qaDir, 'gate0.json');
  writeFileSync(outPath, JSON.stringify(gate0Result, null, 2));
  console.log(`\n2. Result saved -> ${outPath}`);

  // Pipeline summary — lightweight status for orchestration
  const summary = {
    slideId,
    runDate: new Date().toISOString(),
    must_pass: gate0Result.must_pass ?? null,
    should_pass: gate0Result.should_pass ?? null,
    blocksGate4: gate0Result.must_pass === false,
    model: MODEL,
  };
  writeFileSync(join(qaDir, 'gate0-summary.json'), JSON.stringify(summary, null, 2));
  console.log(`   Summary -> gate0-summary.json`);

  // Report
  if (gate0Result.must_pass === false) {
    console.log(`\n  GATE 0 FAIL — ${slideId}`);
    console.log(`  ${gate0Result.summary || '(no summary)'}`);
    console.log(`  Corrigir defeitos antes de rodar QA editorial (--editorial).`);
    console.log(`  Detalhes: ${outPath}`);
  } else {
    console.log(`\n  GATE 0 PASS — ${slideId}`);
    if (!gate0Result.should_pass) {
      console.log(`  Warnings: ${gate0Result.summary || '(no summary)'}`);
    }
  }

  return gate0Result;
}

// --- Error digest (top 10 project errors injected into Gate 4 prompt) ---
function readErrorDigest() {
  if (existsSync(ERROR_DIGEST_PATH)) {
    return readFileSync(ERROR_DIGEST_PATH, 'utf8').trim();
  }
  return '';
}

// --- Round context per slide (externalized to qa-rounds/{slideId}.md) ---
const QA_ROUNDS_DIR = join(AULA_DIR, 'qa-rounds');

function readRoundContext(slideId) {
  const filePath = join(QA_ROUNDS_DIR, `${slideId}.md`);
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf8');
    console.log(`  Round context: ${filePath} (${content.length} chars)`);
    return content;
  }
  return `Round ${ROUND}. Nenhum contexto anterior documentado. Primeiro review deste slide.`;
}

function appendRoundSummary(slideId, round, score, proposals) {
  mkdirSync(QA_ROUNDS_DIR, { recursive: true });
  const filePath = join(QA_ROUNDS_DIR, `${slideId}.md`);
  const date = new Date().toISOString().slice(0, 10);

  const proposalLines = proposals.map((p, i) => `- P${i + 1}: ${p}`).join('\n');
  const block = `\n\n## Round ${round} Gate 4 (${date})\n\nScore: ${score}\nPropostas:\n${proposalLines}\nStatus: PENDENTE — preencher manualmente\n`;

  if (existsSync(filePath)) {
    const existing = readFileSync(filePath, 'utf8');
    writeFileSync(filePath, existing + block);
  } else {
    writeFileSync(filePath, `# Round Context — ${slideId}\n\n> Append-only. Script gemini-qa3.mjs lê e injeta no prompt Gate 4.\n\n---\n` + block);
  }
  console.log(`  Round summary appended -> ${filePath}`);
}

// --- File upload ---
async function uploadFile(filePath, mimeType, displayName) {
  if (!existsSync(filePath)) {
    console.warn(`  SKIP (not found): ${filePath}`);
    return null;
  }
  const data = readFileSync(filePath);
  const size = data.length;

  const startRes = await fetchWithRetry(`${BASE}/upload/v1beta/files?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': String(size),
      'X-Goog-Upload-Header-Content-Type': mimeType,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: { displayName } }),
  });

  const uploadUrl = startRes.headers.get('x-goog-upload-url');
  if (!uploadUrl) throw new Error('No upload URL returned');

  const uploadRes = await fetchWithRetry(uploadUrl, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize',
      'Content-Length': String(size),
    },
    body: data,
  });

  const result = await uploadRes.json();
  console.log(`  Uploaded ${displayName}: ${result.file.uri} (${result.file.state})`);
  return result.file;
}

async function waitForProcessing(fileName) {
  let state = 'PROCESSING';
  const deadline = Date.now() + 300_000; // 5 min max
  while (state === 'PROCESSING') {
    if (Date.now() > deadline) {
      throw new Error(`File ${fileName} still processing after 300s`);
    }
    await new Promise(r => setTimeout(r, 2000));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);
    try {
      const res = await fetch(`${BASE}/v1beta/${fileName}?key=${API_KEY}`, { signal: controller.signal });
      const file = await res.json();
      state = file.state;
    } catch (err) {
      console.warn(`  Poll error (will retry): ${err.message}`);
    } finally {
      clearTimeout(timeout);
    }
    if (state === 'PROCESSING') process.stdout.write('.');
  }
  console.log(` ${state}`);
  return state === 'ACTIVE';
}

// --- Gate 4 split: build payload for one of the 3 focused calls ---
// callType: 'visual' | 'uxcode' | 'motion'
// includeMedia: { video, s0, s2, ref } — which files to attach
// Prompt template uses same {{PLACEHOLDER}} syntax as legacy Gate 4.
function buildSplitCallPayload(callType, templatePath, slideId, meta, mediaUris,
  rawHTML, rawCSS, rawJS, notes, roundCtx, errorDigest, includeMedia, maxTokens) {

  if (!existsSync(templatePath)) {
    throw new Error(`Call ${callType} prompt not found: ${templatePath}`);
  }
  let text = readFileSync(templatePath, 'utf8');

  // Strip markdown frontmatter before <system>
  const systemIdx = text.indexOf('<system>');
  if (systemIdx > 0) text = text.slice(systemIdx);

  // Media list (describes what files are attached — model sees this)
  const mediaList = [
    includeMedia.video && mediaUris.video ? '1. VIDEO .webm — gravacao completa da animacao a 1280x720.' : null,
    includeMedia.s0 && mediaUris.s0 ? '2. PNG S0 — estado inicial (pre-animacao)' : null,
    includeMedia.s2 && mediaUris.s2 ? '3. PNG S2 — estado final (todos elementos visiveis)' : null,
    includeMedia.ref && mediaUris.ref ? `4. PNG REF — slide anterior (${mediaUris.refSlideId}) para comparacao.` : null,
  ].filter(Boolean).join('\n') || '(nenhum material visual anexado)';

  const replacements = {
    '{{SLIDE_ID}}': slideId,
    '{{SLIDE_POS}}': String(meta.pos),
    '{{PREV_SLIDE}}': meta.prev,
    '{{NEXT_SLIDE}}': meta.next,
    '{{INTERACTION_FLOW}}': buildInteractionFlow(meta.slide?.clickReveals || 0),
    '{{MEDIA_LIST}}': mediaList,
    '{{RAW_HTML}}': rawHTML || '',
    '{{RAW_CSS}}': rawCSS || '',
    '{{RAW_JS}}': rawJS || '// No custom animation',
    '{{NOTES}}': notes || '(no notes)',
    '{{ROUND_CTX}}': roundCtx || `Round ${ROUND}. Primeiro review.`,
    '{{ERROR_DIGEST}}': errorDigest || '',
  };

  for (const [ph, val] of Object.entries(replacements)) {
    text = text.replaceAll(ph, val);
  }

  // Attach only the media files this call needs
  const parts = [{ text }];
  if (includeMedia.video && mediaUris.video) parts.push({ fileData: { mimeType: 'video/webm', fileUri: mediaUris.video } });
  if (includeMedia.s0 && mediaUris.s0) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.s0 } });
  if (includeMedia.s2 && mediaUris.s2) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.s2 } });
  if (includeMedia.ref && mediaUris.ref) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.ref } });

  const config = {
    temperature: CUSTOM_TEMP ? parseFloat(CUSTOM_TEMP) : 1.0,
    topP: 0.95,
    maxOutputTokens: maxTokens || 8192,
    responseMimeType: 'application/json',
  };
  if (SCHEMAS_GATE4[callType]) config.responseSchema = SCHEMAS_GATE4[callType];

  return { contents: [{ parts }], generationConfig: config };
}

function safeNum(obj, ...path) {
  let val = obj;
  for (const key of path) { val = val?.[key]; }
  return typeof val === 'number' ? val : null;
}

// --- Gate 4: Editorial Review — 3 parallel focused calls ---
async function runEditorial(slideId, round, qaDir) {
  console.log(`\n=== GATE 4 — Editorial Review — ${slideId} R${round} ===`);
  console.log(`Model: ${MODEL}\n`);

  // Step 0: Extract source code dynamically (E42)
  console.log('0. Extracting source code from files...');
  const rawHTML = extractHTML(slideId);
  const rawCSS = extractCSS(slideId);
  const rawJS = extractJS(slideId);
  const notes = extractNotes(rawHTML);
  const meta = getSlideMetadata(slideId);
  console.log(`  Metadata: pos=${meta.pos}, prev=${meta.prev}, next=${meta.next}\n`);

  // Hoist upload refs for cleanup in finally
  let video = null, s0 = null, s2 = null, refPng = null;
  try {

  // Step 1: Upload media
  console.log('1. Uploading media...');
  const videoPath = join(qaDir, 'animation-1280x720.webm');

  // Only S0 (initial) + S2 (final). No intermediaries.
  const s0Path = findStatePng(qaDir, 'S0');
  const s2Path = findStatePng(qaDir, 'S2');

  // Video é obrigatório se existe no disco. Sem skip.
  video = await uploadFile(videoPath, 'video/webm', `${slideId}-animation`);
  s0 = s0Path ? await uploadFile(s0Path, 'image/png', `${slideId}-S0-initial`) : null;
  s2 = s2Path ? await uploadFile(s2Path, 'image/png', `${slideId}-S2-final`) : null;

  // A3: Reference slide PNG — auto-detect from manifest if not provided, --no-ref to disable
  let refSlideId = REF_SLIDE;
  if (!refSlideId && !NO_REF && meta.prevId) {
    refSlideId = meta.prevId;
    console.log(`  Auto ref-slide: ${refSlideId} (from manifest prev)`);
  }
  if (refSlideId) {
    const refQaDir = join(AULA_DIR, 'qa-screenshots', refSlideId);
    const refPath = findStatePng(refQaDir, 'S2') || findStatePng(refQaDir, 'S0');
    if (refPath) {
      refPng = await uploadFile(refPath, 'image/png', `${refSlideId}-ref-final`);
      console.log(`  Reference slide: ${refSlideId} (${refPath})`);
    } else {
      if (REF_SLIDE) console.warn(`  WARN: no PNG found for ref-slide ${refSlideId}`);
      // Auto-detect silently skips if no PNG exists
      refSlideId = null;
    }
  }

  // Wait for video processing
  if (video?.state === 'PROCESSING') {
    process.stdout.write('  Waiting for video processing');
    const ok = await waitForProcessing(video.name);
    if (!ok) throw new Error('Video processing failed');
  }

  // Step 2: Build 3 focused payloads (visual / UX+code / motion)
  console.log('\n2. Building 3 focused call payloads...');
  const mediaUris = {
    video: video?.uri,
    s0: s0?.uri,
    s2: s2?.uri,
    ref: refPng?.uri,
    refSlideId: refSlideId,
  };
  const roundCtx = readRoundContext(slideId);
  const errorDigest = readErrorDigest();

  // Call A — Visual Design: PNGs + video, NO code
  const payloadA = buildSplitCallPayload('visual', CALL_A_PROMPT_PATH,
    slideId, meta, mediaUris, null, null, null, null, null, null,
    { video: true, s0: true, s2: true, ref: true }, 8192);

  // Call B — UI/UX + Code: PNGs + raw code, NO video (needs more tokens: 5 dims + proposals)
  const payloadB = buildSplitCallPayload('uxcode', CALL_B_PROMPT_PATH,
    slideId, meta, mediaUris, rawHTML, rawCSS, rawJS, notes, roundCtx, errorDigest,
    { video: false, s0: true, s2: true, ref: true }, 16384);

  // Call C — Motion Design: PNGs + video + animation JS only
  const payloadC = buildSplitCallPayload('motion', CALL_C_PROMPT_PATH,
    slideId, meta, mediaUris, null, null, rawJS, null, null, null,
    { video: true, s0: true, s2: true, ref: false }, 8192);

  // Step 3: Fire 3 calls in parallel
  const apiUrl = `${BASE}/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const headers = { 'Content-Type': 'application/json' };
  const callLabels = ['A-visual', 'B-uxcode', 'C-motion'];
  console.log(`\n3. Sending 3 calls in parallel (${MODEL})...`);

  const [resA, resB, resC] = await Promise.all([
    fetchWithRetry(apiUrl, { method: 'POST', headers, body: JSON.stringify(payloadA) }),
    fetchWithRetry(apiUrl, { method: 'POST', headers, body: JSON.stringify(payloadB) }),
    fetchWithRetry(apiUrl, { method: 'POST', headers, body: JSON.stringify(payloadC) }),
  ]);

  const results = await Promise.all([resA.json(), resB.json(), resC.json()]);

  // Step 4: Parse responses and calculate costs
  let totalTokensIn = 0, totalTokensOut = 0, totalCost = 0;
  const parsedCalls = [];
  const pr = modelCost(MODEL);

  for (let i = 0; i < 3; i++) {
    const result = results[i];
    const label = callLabels[i];
    const usage = result.usageMetadata || {};
    const tokIn = usage.promptTokenCount || 0;
    const tokOut = usage.candidatesTokenCount || 0;
    const cost = (tokIn / 1e6 * pr.input) + (tokOut / 1e6 * pr.output);
    totalTokensIn += tokIn; totalTokensOut += tokOut; totalCost += cost;

    const finishReason = result.candidates?.[0]?.finishReason || 'UNKNOWN';
    const rawText = result.candidates?.[0]?.content?.parts
      ?.map(p => p.text).filter(Boolean).join('') || '{}';

    if (finishReason !== 'STOP') {
      console.warn(`  WARN: Call ${label} finishReason=${finishReason} (expected STOP)`);
    }

    let parsed = {};
    try {
      parsed = JSON.parse(rawText);
      if (Array.isArray(parsed)) parsed = parsed[0];
    } catch (e) {
      console.warn(`  WARN: Call ${label} JSON parse failed: ${e.message}`);
      writeFileSync(join(qaDir, `gate4-${label}-r${round}-raw.txt`), rawText);
    }

    parsedCalls.push({ label, parsed, tokIn, tokOut, cost });
    console.log(`  ${label}: ${tokIn} in / ${tokOut} out | ~$${cost.toFixed(3)} | ${finishReason}`);
  }

  console.log(`  TOTAL: ${totalTokensIn} in / ${totalTokensOut} out | ~$${totalCost.toFixed(3)}`);

  // Step 5: Consolidate into unified scorecard + report
  console.log('\n4. Consolidating scorecard...');
  const [callA_result, callB_result, callC_result] = parsedCalls.map(c => c.parsed);

  // Merge all dimensions into one scorecard (defensive: skip non-numeric values)
  const allDims = {};
  // Call A — visual dimensions
  for (const key of ['distribuicao', 'proporcao', 'cor', 'tipografia', 'composicao']) {
    const val = safeNum(callA_result, key, 'nota');
    if (val !== null) allDims[key] = val;
  }
  // Call B — UX+code dimensions
  for (const key of ['gestalt', 'carga_cognitiva', 'information_design', 'css_cascade', 'failsafes']) {
    const val = safeNum(callB_result, key, 'nota');
    if (val !== null) allDims[key] = val;
  }
  // Call C — motion dimensions
  for (const key of ['timing', 'easing', 'narrativa_motion', 'crossfade', 'proposito', 'artefatos']) {
    const val = safeNum(callC_result, key, 'nota');
    if (val !== null) allDims[key] = val;
  }

  if (Object.keys(allDims).length === 0) {
    console.warn('  WARN: No valid dimension scores found in any call — scorecard will be empty');
  }

  const dimValues = Object.values(allDims);
  const overallAvg = dimValues.length > 0 ? dimValues.reduce((a, v) => a + v, 0) / dimValues.length : 0;
  const visualAvg = safeNum(callA_result, 'media_visual') ?? 0;
  const uxcodeAvg = safeNum(callB_result, 'media_uxcode') ?? 0;
  const motionAvg = safeNum(callC_result, 'media_motion') ?? 0;

  // Count MUSTs (any dim < 7)
  const mustFixes = Object.entries(allDims).filter(([, v]) => v < 7);
  const proposals = [
    ...(callB_result.proposals || []).map(p => `[${p.severity}] ${p.titulo}`),
    ...mustFixes.map(([k, v]) => `[MUST] ${k}: ${v}/10`),
  ];

  // Build consolidated scorecard
  const scorecard = {
    scorecard: allDims,
    media_visual: visualAvg,
    media_uxcode: uxcodeAvg,
    media_motion: motionAvg,
    media_overall: parseFloat(overallAvg.toFixed(1)),
    must_count: mustFixes.length + (callB_result.proposals || []).filter(p => p.severity === 'MUST').length,
    should_count: (callB_result.proposals || []).filter(p => p.severity === 'SHOULD').length,
    could_count: (callB_result.proposals || []).filter(p => p.severity === 'COULD').length,
    dead_css: callB_result.dead_css || [],
    animation_value: callC_result.animation_value || 'unknown',
    animation_inventory: callC_result.inventory || [],
    calls: {
      A: { label: 'visual', tokens: `${parsedCalls[0].tokIn}/${parsedCalls[0].tokOut}`, cost: parsedCalls[0].cost },
      B: { label: 'uxcode', tokens: `${parsedCalls[1].tokIn}/${parsedCalls[1].tokOut}`, cost: parsedCalls[1].cost },
      C: { label: 'motion', tokens: `${parsedCalls[2].tokIn}/${parsedCalls[2].tokOut}`, cost: parsedCalls[2].cost },
    },
    total_cost: parseFloat(totalCost.toFixed(3)),
  };

  const scorecardPath = join(qaDir, `gate4-scorecard-r${round}.json`);
  writeFileSync(scorecardPath, JSON.stringify(scorecard, null, 2));
  console.log(`  Scorecard -> ${scorecardPath}`);
  console.log(`  Dims: ${Object.entries(allDims).map(([k, v]) => `${k}=${v}`).join(', ')}`);
  console.log(`  Visual: ${visualAvg}/10 | UX+Code: ${uxcodeAvg}/10 | Motion: ${motionAvg}/10`);
  console.log(`  Overall: ${overallAvg.toFixed(1)}/10 | MUST: ${scorecard.must_count} | SHOULD: ${scorecard.should_count} | COULD: ${scorecard.could_count}`);

  // Save detailed report (3 sections)
  const temp = CUSTOM_TEMP ? parseFloat(CUSTOM_TEMP) : 1.0;
  const reportPath = CUSTOM_OUTPUT || join(qaDir, `gemini-qa3-r${round}.md`);
  const reportContent = `# QA.3 Gate 4 — ${slideId} (R${round}) — 3 Calls

Model: ${MODEL} | Temp: ${temp} | Date: ${new Date().toISOString().slice(0, 10)}
Total: ${totalTokensIn} in / ${totalTokensOut} out | Cost: ~$${totalCost.toFixed(3)}
Visual: ${visualAvg}/10 | UX+Code: ${uxcodeAvg}/10 | Motion: ${motionAvg}/10 | **Overall: ${overallAvg.toFixed(1)}/10**

---

## Call A — Visual Design (${parsedCalls[0].tokIn}/${parsedCalls[0].tokOut} tokens, ~$${parsedCalls[0].cost.toFixed(3)})

\`\`\`json
${JSON.stringify(callA_result, null, 2)}
\`\`\`

---

## Call B — UI/UX + Code (${parsedCalls[1].tokIn}/${parsedCalls[1].tokOut} tokens, ~$${parsedCalls[1].cost.toFixed(3)})

\`\`\`json
${JSON.stringify(callB_result, null, 2)}
\`\`\`

---

## Call C — Motion Design (${parsedCalls[2].tokIn}/${parsedCalls[2].tokOut} tokens, ~$${parsedCalls[2].cost.toFixed(3)})

\`\`\`json
${JSON.stringify(callC_result, null, 2)}
\`\`\`
`;
  writeFileSync(reportPath, reportContent);
  console.log(`\n5. Report saved -> ${reportPath}`);

  // Print consolidated summary
  console.log('\n' + '='.repeat(60));
  console.log(`Gate 4 R${round} — ${slideId} — 3-Call Summary`);
  console.log('='.repeat(60));
  if (callA_result.impressao_geral) console.log(`Visual: ${callA_result.impressao_geral}`);
  if (callC_result.animation_value) console.log(`Motion: ${callC_result.animation_value}`);
  console.log(`\nScores: ${Object.entries(allDims).map(([k, v]) => `${k}=${v}`).join(' | ')}`);
  console.log(`Overall: ${overallAvg.toFixed(1)}/10`);
  if (mustFixes.length > 0) {
    console.log(`\nMUST fixes (dim < 7):`);
    for (const [k, v] of mustFixes) console.log(`  - ${k}: ${v}/10`);
  }

  // Auto-append round summary
  console.log('\n6. Appending round summary...');
  const score = `${overallAvg.toFixed(1)}/10 (V:${visualAvg} U:${uxcodeAvg} M:${motionAvg})`;
  const proposalSummary = proposals.length > 0 ? proposals : ['(no proposals)'];
  appendRoundSummary(slideId, round, score, proposalSummary);

  } finally {
  // Cleanup uploaded files (runs even if steps above throw)
  console.log('\n7. Cleaning up uploads...');
  for (const f of [video, s0, s2, refPng].filter(Boolean)) {
    try {
      await fetch(`${BASE}/v1beta/${f.name}?key=${API_KEY}`, { method: 'DELETE' });
    } catch (_) {}
  }
  console.log('  Done.');
  }
}

// --- Main ---
async function main() {
  console.log(`Mode: ${MODE} | Slide: ${SLIDE_ID} | Model: ${MODEL}\n`);

  if (MODE === 'inspect') {
    const gate0Result = await runGate0(SLIDE_ID, QA_DIR);
    process.exit(gate0Result.must_pass === false ? 1 : 0);
  }

  if (MODE === 'editorial') {
    // Check Gate 0 status before running Gate 4
    const gate0Path = join(QA_DIR, 'gate0.json');
    if (existsSync(gate0Path)) {
      const gate0 = JSON.parse(readFileSync(gate0Path, 'utf8'));
      if (gate0.must_pass === false && !hasFlag('force-gate4')) {
        throw new Error(`BLOQUEADO: Gate 0 FAIL para ${SLIDE_ID}. Corrigir defeitos antes.\n  Detalhes: ${gate0Path}\n  Use --inspect para re-rodar Gate 0 após correções.\n  Falso positivo conhecido? Use --force-gate4 para override.`);
      }
      if (gate0.must_pass === false && hasFlag('force-gate4')) {
        console.warn(`⚠ Gate 0 FAIL override via --force-gate4. Continuando.\n`);
      } else {
        console.log(`Gate 0: PASS (${gate0Path})\n`);
      }
    } else {
      console.warn(`AVISO: Gate 0 não encontrado para ${SLIDE_ID}. Rode --inspect primeiro.`);
      console.warn(`  Continuando por aprovação implícita do operador.\n`);
    }
    await runEditorial(SLIDE_ID, ROUND, QA_DIR);
  }
}

main().catch(err => { console.error(err); process.exit(1); });

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
const CONTEXT_PARAGRAPH = getArg('context', '');
const DIAGNOSTIC = getArg('diagnostic', '');
const REF_SLIDE = getArg('ref-slide', null);

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
  --ref-slide <id>   Reference slide for cross-slide consistency
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
    const res = await fetch(url, options);
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
  }
}

// --- Gate 0 constants ---
const REPO_ROOT = join(AULA_DIR, '..', '..');
const GATE0_PROMPT_PATH = join(REPO_ROOT, 'docs', 'prompts', 'gemini-gate0-inspector.md');
const GATE4_PROMPT_PATH = join(REPO_ROOT, 'docs', 'prompts', 'gemini-gate4-editorial.md');
const ERROR_DIGEST_PATH = join(REPO_ROOT, 'docs', 'prompts', 'error-digest.md');

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
  const sectionBoundary = /[━═]{3,}/;

  // Pass 1: section-based — find comment section marker containing slideId
  // e.g. /* ═══ s-a1-fib4 ═══ */ or /* ━━━... s-a1-fib4 ...━━━ */
  let sectionStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(slideId) && sectionBoundary.test(lines[i])) {
      sectionStart = i;
      break;
    }
  }

  if (sectionStart >= 0) {
    const sectionResult = [];
    for (let i = sectionStart; i < lines.length; i++) {
      if (i > sectionStart && sectionBoundary.test(lines[i]) && !lines[i].includes(slideId)) {
        break;
      }
      sectionResult.push(lines[i]);
    }
    return sectionResult;
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
  const basePath = join(AULA_DIR, 'shared', 'css', 'base.css');
  if (!existsSync(basePath)) return '/* base.css not found */';
  const css = readFileSync(basePath, 'utf8');

  // Extract :root block (design tokens)
  const rootMatch = css.match(/:root\s*\{[^}]*\}/s);
  if (!rootMatch) return '/* :root not found in base.css */';
  return rootMatch[0];
}

function extractArchetypeCSS(html) {
  const archPath = join(AULA_DIR, 'archetypes.css');
  if (!existsSync(archPath)) return '/* archetypes.css not found */';
  const css = readFileSync(archPath, 'utf8');

  // Find archetype class used by this slide
  const archMatch = html.match(/archetype-([a-z-]+)/);
  if (!archMatch) return '/* No archetype class found in HTML */';
  const archClass = `.archetype-${archMatch[1]}`;

  // Extract all rule blocks that reference this archetype class
  const lines = css.split('\n');
  const result = [];
  let capturing = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!capturing && line.includes(archClass)) {
      capturing = true;
      braceDepth = 0;
    }
    if (capturing) {
      result.push(line);
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;
      if (braceDepth === 0 && result.length > 1) {
        capturing = false;
        result.push('');
      }
    }
  }
  return result.join('\n');
}

function extractCSS(slideId, html) {
  const sections = [];

  // 1. Design tokens from base.css
  const tokens = extractBaseTokens();
  sections.push('/* === Design Tokens (base.css :root) === */');
  sections.push(tokens);

  // 2. Archetype CSS (matched to this slide's archetype class)
  const archCSS = extractArchetypeCSS(html);
  if (archCSS && !archCSS.startsWith('/*')) {
    sections.push('\n/* === Archetype CSS === */');
    sections.push(archCSS);
  }

  // 3. Slide-specific CSS from cirrose.css (#slideId selectors)
  const slideLines = extractSlideCSS(slideId);
  if (slideLines.length > 0) {
    sections.push('\n/* === Slide-specific CSS (cirrose.css) === */');
    sections.push(slideLines.join('\n'));
  }

  const combined = sections.join('\n');
  const lineCount = combined.split('\n').length;
  console.log(`  CSS: ${lineCount} lines (tokens + archetype + slide-specific)`);
  return combined;
}

// --- Extract global CSS rules for a class (cascade without #s- slide IDs) ---
function extractGlobalClassCSS(className) {
  const files = [
    { label: 'base.css', file: join(AULA_DIR, 'shared/css/base.css') },
    { label: 'cirrose.css', file: join(AULA_DIR, 'cirrose.css') },
  ];
  const out = [];
  for (const { label, file: fpath } of files) {
    const lines = readFileSync(fpath, 'utf8').split('\n');
    const rules = [];
    let cap = false, depth = 0;
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (!cap && l.includes(`.${className}`) && !/#s-/.test(l)) {
        cap = true; depth = 0;
      }
      if (cap) {
        rules.push(l);
        depth += (l.match(/\{/g) || []).length;
        depth -= (l.match(/\}/g) || []).length;
        if (depth <= 0 && rules.length > 0) {
          cap = false; depth = 0; rules.push('');
        }
      }
    }
    if (rules.length) out.push(`/* --- ${label} --- */\n${rules.join('\n')}`);
  }
  return out.join('\n\n') || '(no global rules found)';
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
  if (idx === -1) return { pos: '?/?', prev: '(unknown)', next: '(unknown)', slide: null };

  return {
    pos: `${idx + 1}/${slides.length}`,
    prev: idx > 0 ? `${slides[idx - 1].id} (${slides[idx - 1].narrativeRole})` : '(first)',
    next: idx < slides.length - 1 ? `${slides[idx + 1].id} (${slides[idx + 1].narrativeRole})` : '(last)',
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
        responseMimeType: 'application/json', // G1: guaranteed valid JSON
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

  const startRes = await fetch(`${BASE}/upload/v1beta/files?key=${API_KEY}`, {
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

  const uploadRes = await fetch(uploadUrl, {
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
  while (state === 'PROCESSING') {
    await new Promise(r => setTimeout(r, 2000));
    const res = await fetch(`${BASE}/v1beta/${fileName}?key=${API_KEY}`);
    const file = await res.json();
    state = file.state;
    if (state === 'PROCESSING') process.stdout.write('.');
  }
  console.log(` ${state}`);
  return state === 'ACTIVE';
}

// --- Prompt builder (loads from external template: docs/prompts/gemini-gate4-editorial.md) ---
function buildPrompt(slideId, round, rawHTML, rawCSS, rawJS, notes, meta, mediaUris) {
  if (!existsSync(GATE4_PROMPT_PATH)) {
    throw new Error(`Gate 4 prompt not found: ${GATE4_PROMPT_PATH}`);
  }
  const roundCtx = readRoundContext(slideId);

  // Build conditional sections
  const mediaList = [
    mediaUris.video ? '1. VIDEO .webm — gravacao completa da animacao a 1280x720. ASSISTA e comente RITMO.' : '(sem video)',
    mediaUris.s0 ? '2. PNG S0 — estado inicial (pre-animacao)' : '(sem S0)',
    mediaUris.s2 ? '3. PNG S2 — estado final (todos elementos visiveis, animacoes completadas)' : '(sem S2)',
    mediaUris.ref ? `4. PNG REF — slide ANTERIOR (${mediaUris.refSlideId}) estado final. REFERENCIA OBRIGATORIA: comparar grid vertical (margens, baseline), hierarquia tipografica (h2 size, body size, caption size), spacing (padding, gap), paleta de cor, e peso visual. Diferenca injustificada = proposta SHOULD.` : '',
  ].filter(Boolean).join('\n');

  const diagnosticSection = DIAGNOSTIC ? `### CSS global reference — cascade da classe alvo (regras SEM #slideId)
\`\`\`css
${extractGlobalClassCSS(DIAGNOSTIC.split(/[\s:,]/)[0].replace('.', '') || 'source-tag')}
\`\`\`

> Compare estas regras globais com as regras slide-specific acima. A diferenca explica o bug.
` : '';

  const animationSection = mediaUris.video ? `### AVALIACAO DE ANIMACAO (video presente — PROVA DE VISUALIZACAO)

O video mostra buildup progressivo GSAP via click-reveals.
VOCE DEVE ASSISTIR O VIDEO E DESCREVER O QUE VIU — nao inferir do codigo JS.

**PARTE A — INVENTARIO COM TIMESTAMPS (obrigatoria):**

Para CADA transicao, descrever O QUE VIU no video:
  ~X.Xs: [descricao visual concreta do que aconteceu na tela] | tipo: [fade/slide/scale/cor] | duracao estimada: ~Xms
  Artefato: [sim/nao — se sim, descrever: ghosting, overlap, flash, pulo de layout]

Exemplo BOM: "~1.5s: cards VPN/VPP sobem e somem, mas as 3 armadilhas ja comecam a aparecer ANTES dos cards desaparecerem — entre ~1.6s e ~1.9s vejo textos sobrepostos (ghosting)."
Exemplo RUIM: "~1.5s: cross-fade com delay 0.1s causa overlap" (isso e leitura de codigo, nao do video)

Se nao identificar transicoes no video, diga "transicoes indistinguiveis" e pontue animation_score: 0.

**PARTE B — Para cada transicao da Parte A:**

1. DURATION: <200ms=rapido demais | 300-800ms=adequado | >1500ms=lento
2. STAGING: 1 foco (bom) | 2+ simultaneos nao-relacionados (ruim)
3. PURPOSE: didatica (guia raciocinio) | decorativa (so estetica)
4. LEGIBILIDADE: texto parado=ok | texto em movimento=ruim
5. ARTEFATO: se viu artefato visual, descrever QUANDO e O QUE viu

**PARTE C — Adicionar ao JSON de resposta:**

"animation_score": <1-10>,
"transitions_found": <numero>,
"inventory": ["~X.Xs: [descricao visual] | tipo | ~Xms | artefato: sim/nao"],
"animation_issues": ["~X.Xs: [o que vi] -> [fix concreto com valores]"],
"animation_value": "didatica" | "decorativa" | "prejudicial"

Se animation_score < 7, cada item em animation_issues DEVE ser implementavel com valores concretos:
  "~1.5s: vi ghosting de 400ms entre cards e armadilhas, aumentar delay de 0.1s pra 0.4s"
  "~3.0s: vi flash branco ao trocar estado, adicionar ease power2.inOut"
NAO aceito descricoes genericas como "melhorar animacao" ou "cross-fade encavalado".
` : '';

  const diagnosticTask = DIAGNOSTIC ? `### DIAGNOSTICO (OBRIGATORIO — responder ANTES das propostas)
**Problema reportado:** ${DIAGNOSTIC}

Voce recebeu o CSS slide-specific (materials) E o CSS global reference (cascade sem #slideId).
Voce tambem tem o HTML raw e o JS raw. Investigue:
1. **CAUSA RAIZ** — qual propriedade/regra no CSS e/ou HTML provoca o comportamento incorreto
2. **POR QUE DIFERENTE** — o que torna ESTE slide divergente dos demais (specificity, position, layout context, inheritance)
3. **FIX** — snippet CSS/HTML copyavel com arquivo indicado

Seja forense: leia a cascade inteira, identifique conflitos de specificity, position contexts e layout modes.
` : '';

  // Load template and substitute placeholders
  let text = readFileSync(GATE4_PROMPT_PATH, 'utf8');

  // Strip markdown frontmatter (lines starting with # before first <system>)
  const systemIdx = text.indexOf('<system>');
  if (systemIdx > 0) text = text.slice(systemIdx);

  const replacements = {
    '{{SLIDE_ID}}': slideId,
    '{{SLIDE_POS}}': String(meta.pos),
    '{{NARRATIVE_ROLE}}': meta.slide?.narrativeRole || 'null',
    '{{TENSION_LEVEL}}': String(meta.slide?.tensionLevel || '?'),
    '{{PREV_SLIDE}}': meta.prev,
    '{{NEXT_SLIDE}}': meta.next,
    '{{INTERACTION_FLOW}}': buildInteractionFlow(meta.slide?.clickReveals || 0),
    '{{CONTEXT_EXTRA}}': CONTEXT_PARAGRAPH ? `\n### Contexto adicional\n${CONTEXT_PARAGRAPH}` : '',
    '{{ERROR_DIGEST}}': readErrorDigest() || '(no error digest found)',
    '{{ROUND_CTX}}': roundCtx,
    '{{RAW_HTML}}': rawHTML,
    '{{RAW_CSS}}': rawCSS,
    '{{RAW_JS}}': rawJS,
    '{{NOTES}}': notes,
    '{{DIAGNOSTIC_SECTION}}': diagnosticSection,
    '{{MEDIA_LIST}}': mediaList,
    '{{ANIMATION_SECTION}}': animationSection,
    '{{DIAGNOSTIC_TASK}}': diagnosticTask,
    '{{MAX_TOKENS}}': mediaUris.video ? '5000' : '2500',
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    text = text.replaceAll(placeholder, value);
  }

  // Build parts array with text + media
  const parts = [{ text }];
  if (mediaUris.video) parts.push({ fileData: { mimeType: 'video/webm', fileUri: mediaUris.video } });
  if (mediaUris.s0) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.s0 } });
  if (mediaUris.s2) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.s2 } });
  if (mediaUris.ref) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.ref } });

  return {
    contents: [{ parts }],
    generationConfig: { temperature: CUSTOM_TEMP ? parseFloat(CUSTOM_TEMP) : 1.0, topP: 0.95, maxOutputTokens: 16384 },
  };
}

// --- Gate 4: Editorial Review (existing behavior) ---
async function runEditorial(slideId, round, qaDir) {
  console.log(`\n=== GATE 4 — Editorial Review — ${slideId} R${round} ===`);
  console.log(`Model: ${MODEL}\n`);

  // Step 0: Extract source code dynamically (E42)
  console.log('0. Extracting source code from files...');
  const rawHTML = extractHTML(slideId);
  const rawCSS = extractCSS(slideId, rawHTML);
  const rawJS = extractJS(slideId);
  const notes = extractNotes(rawHTML);
  const meta = getSlideMetadata(slideId);
  console.log(`  Metadata: pos=${meta.pos}, prev=${meta.prev}, next=${meta.next}\n`);

  // Step 1: Upload media
  console.log('1. Uploading media...');
  const videoPath = join(qaDir, 'animation-1280x720.webm');

  // Only S0 (initial) + S2 (final). No intermediaries.
  const s0Path = findStatePng(qaDir, 'S0');
  const s2Path = findStatePng(qaDir, 'S2');

  // Video é obrigatório se existe no disco. Sem skip.
  const video = await uploadFile(videoPath, 'video/webm', `${slideId}-animation`);
  const s0 = s0Path ? await uploadFile(s0Path, 'image/png', `${slideId}-S0-initial`) : null;
  const s2 = s2Path ? await uploadFile(s2Path, 'image/png', `${slideId}-S2-final`) : null;

  // Reference slide PNG (--ref-slide): upload final state for cross-slide consistency check
  let refPng = null;
  if (REF_SLIDE) {
    const refQaDir = join(AULA_DIR, 'qa-screenshots', REF_SLIDE);
    const refPath = findStatePng(refQaDir, 'S2') || findStatePng(refQaDir, 'S0');
    if (refPath) {
      refPng = await uploadFile(refPath, 'image/png', `${REF_SLIDE}-ref-final`);
      console.log(`  Reference slide: ${REF_SLIDE} (${refPath})`);
    } else {
      console.warn(`  WARN: no PNG found for ref-slide ${REF_SLIDE}`);
    }
  }

  // Wait for video processing
  if (video?.state === 'PROCESSING') {
    process.stdout.write('  Waiting for video processing');
    const ok = await waitForProcessing(video.name);
    if (!ok) throw new Error('Video processing failed');
  }

  // Step 2: Build and send prompt
  console.log('\n2. Sending prompt...');
  const mediaUris = {
    video: video?.uri,
    s0: s0?.uri,
    s2: s2?.uri,
    ref: refPng?.uri,
    refSlideId: REF_SLIDE,
  };
  const payload = buildPrompt(slideId, round, rawHTML, rawCSS, rawJS, notes, meta, mediaUris);

  const res = await fetchWithRetry(
    `${BASE}/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  const result = await res.json();

  // Extract text
  const text = result.candidates?.[0]?.content?.parts
    ?.map(p => p.text)
    .filter(Boolean)
    .join('\n') || 'No text in response';

  // Usage
  const usage = result.usageMetadata || {};
  console.log(`  Tokens: ${usage.promptTokenCount || '?'} in / ${usage.candidatesTokenCount || '?'} out`);
  const p = modelCost(MODEL);
  const totalCost = ((usage.promptTokenCount || 0) / 1e6 * p.input) + ((usage.candidatesTokenCount || 0) / 1e6 * p.output);
  console.log(`  Cost: ~$${totalCost.toFixed(3)}`);

  // Save response
  const temp = CUSTOM_TEMP ? parseFloat(CUSTOM_TEMP) : 1.0;
  const outPath = CUSTOM_OUTPUT || join(qaDir, `gemini-qa3-r${round}.md`);
  writeFileSync(outPath, `# QA.3 Gemini Review — ${slideId} (R${round})\n\n` +
    `Model: ${MODEL} | Temp: ${temp} | Date: ${new Date().toISOString().slice(0, 10)}\n` +
    `Tokens: ${usage.promptTokenCount || '?'} in / ${usage.candidatesTokenCount || '?'} out | Cost: ~$${totalCost.toFixed(3)}\n\n---\n\n` +
    text + '\n');
  console.log(`\n3. Response saved -> ${outPath}`);

  // Print response
  console.log('\n' + '='.repeat(60));
  console.log(text);

  // Extract structured JSON from response (section 5 of Gate 4 prompt)
  console.log('\n4. Extracting structured scorecard...');
  const jsonFences = [...text.matchAll(/```json\s*\n([\s\S]*?)```/g)];
  let scorecard = null;
  if (jsonFences.length > 0) {
    // Take the last ```json block (the structured output section)
    const lastJson = jsonFences[jsonFences.length - 1][1].trim();
    try {
      scorecard = JSON.parse(lastJson);
      const scorecardPath = join(qaDir, `gate4-scorecard-r${round}.json`);
      writeFileSync(scorecardPath, JSON.stringify(scorecard, null, 2));
      console.log(`  Scorecard parsed OK -> ${scorecardPath}`);
      if (scorecard.scorecard) {
        const dims = Object.entries(scorecard.scorecard);
        const avg = dims.reduce((a, [, v]) => a + v, 0) / dims.length;
        console.log(`  Dims: ${dims.map(([k, v]) => `${k}=${v}`).join(', ')}`);
        console.log(`  Media: ${avg.toFixed(1)}/10 | MUST: ${scorecard.must_count || 0} | SHOULD: ${scorecard.should_count || 0} | COULD: ${scorecard.could_count || 0}`);
      }
    } catch (e) {
      console.warn(`  WARN: JSON block found but parse failed: ${e.message}`);
      writeFileSync(join(qaDir, `gate4-scorecard-r${round}-raw.txt`), lastJson);
      console.warn(`  Raw saved -> gate4-scorecard-r${round}-raw.txt`);
    }
  } else {
    console.warn('  WARN: No ```json block found in Gemini response — scorecard not extracted');
  }

  // Auto-append round summary to qa-rounds file
  console.log('\n5. Appending round summary...');
  // Use scorecard media if available, fallback to regex
  let score;
  if (scorecard?.scorecard) {
    const dims = Object.values(scorecard.scorecard);
    const avg = dims.reduce((a, v) => a + v, 0) / dims.length;
    score = `${avg.toFixed(1)}/10`;
  } else {
    const scoreMatch = text.match(/\*\*M[EÉ]DIA\*\*\s*\|\s*\*?\*?([\d.]+)/i);
    score = scoreMatch ? scoreMatch[1] + '/10' : '?/10';
  }
  // Match both old format (### Proposta N: ...) and new format (**P1 [MUST]: ...**)
  const proposalMatches = [
    ...text.matchAll(/###\s*Proposta\s*\d+[:\s]*([^\n]+)/gi),
    ...text.matchAll(/\*\*P\d+\s*\[(?:MUST|SHOULD|COULD)\][:\s]*([^\n*]+)/gi),
  ];
  const proposals = proposalMatches.length > 0
    ? proposalMatches.map(m => m[1].trim())
    : ['(parse proposals manually from response)'];
  appendRoundSummary(slideId, round, score, proposals);

  // Cleanup uploaded files
  console.log('\n6. Cleaning up uploads...');
  for (const f of [video, s0, s2, refPng].filter(Boolean)) {
    try {
      await fetch(`${BASE}/v1beta/${f.name}?key=${API_KEY}`, { method: 'DELETE' });
    } catch (_) {}
  }
  console.log('  Done.');
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

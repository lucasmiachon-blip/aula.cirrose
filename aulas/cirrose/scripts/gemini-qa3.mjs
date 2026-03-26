#!/usr/bin/env node
/**
 * Gemini QA pipeline — Gate 0 (defect inspector) + Gate 4 (editorial review).
 * Reads HTML/CSS/JS DYNAMICALLY from source files (E42 compliance).
 *
 * Usage:
 *   node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-01 --inspect        # Gate 0 only (default)
 *   node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-01 --full --round 5 # Gate 0 → Gate 4
 *   node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-01 --editorial --round 5  # Gate 4 only
 *   node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-01 --full --temp 0.8 --output custom.json --context "..."
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

const MODEL = 'gemini-3.1-pro-preview';
const BASE = 'https://generativelanguage.googleapis.com';

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

// --- Mode flags ---
function hasFlag(name) { return args.includes(`--${name}`); }
const MODE = hasFlag('full') ? 'full' : hasFlag('editorial') ? 'editorial' : 'inspect';
const FORCE_VIDEO = hasFlag('with-video');

// --- Gate 0 constants ---
const REPO_ROOT = join(AULA_DIR, '..', '..');
const GATE0_PROMPT_PATH = join(REPO_ROOT, 'docs', 'prompts', 'gemini-gate0-inspector.md');
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
    console.error(`Slide file not found for ${slideId}`);
    process.exit(1);
  }
  console.log(`  HTML: ${filePath}`);
  return readFileSync(filePath, 'utf8');
}

function extractSlideCSS(slideId) {
  const cssPath = join(AULA_DIR, 'cirrose.css');
  const css = readFileSync(cssPath, 'utf8');
  const lines = css.split('\n');
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
  const basePath = join(AULA_DIR, '..', '..', 'shared', 'css', 'base.css');
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
    console.error(`Gate 0 prompt not found: ${GATE0_PROMPT_PATH}`);
    process.exit(1);
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
    console.error(`No PNGs found in ${qaDir}. Run qa-batch-screenshot.mjs first.`);
    process.exit(1);
  }

  return {
    payload: {
      contents: [{ parts }],
      generationConfig: { temperature: 0.1, topP: 0.9, maxOutputTokens: 8192 },
    },
    statesReceived,
  };
}

async function runGate0(slideId, qaDir) {
  console.log(`\n=== GATE 0 — Defect Inspector — ${slideId} ===\n`);
  console.log('0. Finding PNGs...');

  const { payload, statesReceived } = buildGate0Payload(slideId, qaDir);

  const inputTokens = JSON.stringify(payload).length / 4;
  console.log(`\n1. Sending to Gemini (est. ~${Math.round(inputTokens)} tokens, ~$${(inputTokens / 1_000_000 * 2.0).toFixed(4)})...`);

  const res = await fetch(
    `${BASE}/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error(`API Error ${res.status}:`, err.slice(0, 500));
    process.exit(1);
  }

  const result = await res.json();
  const usage = result.usageMetadata || {};
  const finishReason = result.candidates?.[0]?.finishReason || 'UNKNOWN';
  const totalCost = ((usage.promptTokenCount || 0) / 1_000_000 * 2.0) + ((usage.candidatesTokenCount || 0) / 1_000_000 * 12.0);
  console.log(`  Tokens: ${usage.promptTokenCount || '?'} in / ${usage.candidatesTokenCount || '?'} out | Cost: ~$${totalCost.toFixed(4)}`);
  console.log(`  Finish reason: ${finishReason}`);

  if (finishReason !== 'STOP') {
    console.error(`  WARNING: Response did not finish normally (${finishReason}). Output may be truncated.`);
  }

  // Parse JSON response
  let rawText = result.candidates?.[0]?.content?.parts
    ?.map(p => p.text).filter(Boolean).join('') || '{}';

  // Strip markdown fences if model wrapped response
  rawText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

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
    process.exit(1);
  }

  // Save result
  mkdirSync(qaDir, { recursive: true });
  const outPath = join(qaDir, 'gate0.json');
  writeFileSync(outPath, JSON.stringify(gate0Result, null, 2));
  console.log(`\n2. Result saved -> ${outPath}`);

  // Report
  if (gate0Result.must_pass === false) {
    console.log(`\n  GATE 0 FAIL — ${slideId}`);
    console.log(`  ${gate0Result.summary || '(no summary)'}`);
    console.log(`  Corrigir defeitos antes de rodar QA editorial (--full ou --editorial).`);
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

// --- Prompt builder (uses v6.1 template) ---
function buildPrompt(slideId, round, rawHTML, rawCSS, rawJS, notes, meta, mediaUris) {
  const roundCtx = readRoundContext(slideId);

  const text = `<system>

Voce e cinco profissionais fundidos em um:

1. **Art director** que projeta keynotes para Apple Health e Stripe Sessions — obsessivo com whitespace, profundidade de superficie e a tensao entre minimalismo e impacto
2. **Motion designer** que trabalhou em explainers medicos estilo Kurzgesagt — cada frame tem intencao narrativa, cada transicao carrega significado emocional
3. **Tipografo editorial** da Bloomberg Businessweek — hierarquia tipografica cria arquitetura visual, nao apenas organiza texto
4. **UI/UX designer** senior da Linear/Vercel — craft obsessivo com micro-interacoes, espacamento, cor como sistema, polish sub-pixel
5. **Front-end engineer** que implementa as visoes dos 4 acima — domina GSAP, CSS moderno (oklch, container queries, has(), grid subgrid), performance de animacao, acessibilidade sem theater

Voce foi contratado como **editor final criativo**. Autoridade total para propor mudancas radicais.

### Mentalidade
- NAO e linter. NAO e QA bot. Voce e a pessoa que diz "esse frame nao respira".
- CAMADAS: projetor a 10m / TV a 3m / designer a 50cm.
- Todo pixel e decisao. Sem motivo = ruido.

### Calibracao: Nivel 1 (PowerPoint) a 5 (Keynote-grade Apple WWDC). Target: 4-5.

</system>

<context>

### Apresentacao
- Cirrose Hepatica — Classificar, Intervir, Reverter
- Publico: gastro/hepato congresso BR. Ja viram 10k slides azuis com bullets.
- Congresso: 500 pessoas, 1280x720, 5-15m. Sala pequena: TV 55-65", 2-5m.

### Design system
- Stage-C: fundo creme (oklch 95%), texto quase-preto. NAO dark.
- Tipografia: Instrument Serif (display), DM Sans (corpo), JetBrains Mono (dados)
- OKLCH: safe/teal L40, warning/amber L60, danger/red L50. UI accent navy.

### GSAP 3.14 Business: SplitText, Flip importados. Disponiveis: ScrambleText, MorphSVG, DrawSVG, MotionPath, TextPlugin, CustomEase, EasePack, Physics2D, CSSRule.

### Contexto narrativo
- ${slideId} (posicao ${meta.pos}), narrativeRole: ${meta.slide?.narrativeRole || 'null'}, tensionLevel: ${meta.slide?.tensionLevel || '?'}/5
- Anterior: ${meta.prev}
- Seguinte: ${meta.next}
- Interacao: ${buildInteractionFlow(meta.slide?.clickReveals || 0)}
${CONTEXT_PARAGRAPH ? `\n### Contexto adicional\n${CONTEXT_PARAGRAPH}` : ''}

</context>

<guardrails>
${readErrorDigest() || '(no error digest found)'}
</guardrails>

<materials>

### Round context
${roundCtx}

> NAO repita sugestoes ja implementadas. Foque no que AINDA nao funciona e no que REGREDIU.

### HTML:
\`\`\`html
${rawHTML}
\`\`\`

### CSS (key rules):
\`\`\`css
${rawCSS}
\`\`\`

### JS (GSAP custom animation):
\`\`\`js
${rawJS}
\`\`\`

### Speaker Notes:
\`\`\`
${notes}
\`\`\`

### Material visual anexado
${mediaUris.video ? '1. VIDEO .webm — gravacao completa da animacao a 1280x720. ASSISTA e comente RITMO.' : '(sem video)'}
${mediaUris.s0 ? '2. PNG S0 — estado inicial (pre-animacao)' : '(sem S0)'}
${mediaUris.s2 ? '3. PNG S2 — estado final (todos elementos visiveis, animacoes completadas)' : '(sem S2)'}

</materials>

<task>

5 passos NA ORDEM. Nao pule.

### Passo 1 — OLHAR + OBSERVAR (max 150 palavras, seja cirurgico)
Video (se houver) → PNGs → codigo. Escreva \`## Observacao\`:
- O que funciona (MECANISMO) e o que incomoda (MECANISMO)
- "Se eu so pudesse mudar UMA coisa?"

### Passo 2 — SCORECARD (7 dimensoes, notas 1-10)
| Dimensao | Nota |
|----------|------|
| Tipografia e hierarquia | ?/10 |
| Cor, contraste e superficie | ?/10 |
| Composicao e respiro | ?/10 |
| Motion e interacoes GSAP | ?/10 |
| Legibilidade a 5m | ?/10 |
| Impacto emocional | ?/10 |
| Craft front-end | ?/10 |
| **MEDIA** | ?/10 |

Justificar APENAS scores <=5. Scores >=6 nao precisam de justificativa.

### Passo 3 — PROPOSTAS (3-5 max)
Para cada proposta:
\`\`\`
### Proposta N: [titulo]
**O que** — issue ou oportunidade
**Por que** — mecanismo perceptual/cognitivo (NUNCA "fica melhor")
**Como** — snippet CSS/JS/HTML pronto para copiar
**Prioridade** — MUST (bloqueia nivel 4) | SHOULD (4→5) | COULD (polish)
\`\`\`

Inclua pelo menos 1 proposta RADICAL (ousada, pode ser recusada). Marque com **[RADICAL]**.

### Passo 4 — AUTOCRITICA
Revise suas propostas: contradiz outra? API GSAP incorreta? Sacrifica legibilidade a 5m? Repete ROUND CONTEXT? Se sim, corrija.

### Passo 5 — SCORE PROJETADO
Se MUST+SHOULD implementados, qual seria o novo scorecard? Preencha tabela projetada.

</task>

<constraints>
Nao quero: checklist PASS/FAIL, elogios genericos, patterns de web, sugestoes timidas, accessibility theater, ignorar o video.
Tom: direto, honesto, PT-BR, codigo em ingles. Max 2000 tokens.
PREZE pela legibilidade a 5m — slide DEVE ser legivel, nao so bonito.
Respeite <guardrails> — propostas que violem erros listados serao rejeitadas.
</constraints>`;

  // Build parts array with text + media
  const parts = [{ text }];
  if (mediaUris.video) parts.push({ fileData: { mimeType: 'video/webm', fileUri: mediaUris.video } });
  if (mediaUris.s0) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.s0 } });
  if (mediaUris.s2) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.s2 } });

  return {
    contents: [{ parts }],
    generationConfig: { temperature: CUSTOM_TEMP ? parseFloat(CUSTOM_TEMP) : 1.0, topP: 0.95, maxOutputTokens: 6144 },
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

  // Skip video on R1 unless --with-video (saves ~2K tokens + upload time)
  const skipVideo = round <= 1 && !FORCE_VIDEO;
  if (skipVideo) console.log('  Video skipped (R1 — use --with-video to override)');
  const video = skipVideo ? null : await uploadFile(videoPath, 'video/webm', `${slideId}-animation`);
  const s0 = s0Path ? await uploadFile(s0Path, 'image/png', `${slideId}-S0-initial`) : null;
  const s2 = s2Path ? await uploadFile(s2Path, 'image/png', `${slideId}-S2-final`) : null;

  // Wait for video processing
  if (video?.state === 'PROCESSING') {
    process.stdout.write('  Waiting for video processing');
    const ok = await waitForProcessing(video.name);
    if (!ok) { console.error('Video processing failed'); process.exit(1); }
  }

  // Step 2: Build and send prompt
  console.log('\n2. Sending prompt...');
  const mediaUris = {
    video: video?.uri,
    s0: s0?.uri,
    s2: s2?.uri,
  };
  const payload = buildPrompt(slideId, round, rawHTML, rawCSS, rawJS, notes, meta, mediaUris);

  const inputTokens = JSON.stringify(payload).length / 4; // rough estimate
  const costEstimate = (inputTokens / 1_000_000) * 2.0;
  console.log(`  Est. input tokens: ~${Math.round(inputTokens)} (~$${costEstimate.toFixed(3)})`);

  const res = await fetch(
    `${BASE}/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error(`API Error ${res.status}:`, err.slice(0, 500));
    process.exit(1);
  }

  const result = await res.json();

  // Extract text
  const text = result.candidates?.[0]?.content?.parts
    ?.map(p => p.text)
    .filter(Boolean)
    .join('\n') || 'No text in response';

  // Usage
  const usage = result.usageMetadata || {};
  console.log(`  Tokens: ${usage.promptTokenCount || '?'} in / ${usage.candidatesTokenCount || '?'} out`);
  const totalCost = ((usage.promptTokenCount || 0) / 1_000_000 * 2.0) + ((usage.candidatesTokenCount || 0) / 1_000_000 * 12.0);
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

  // Auto-append round summary to qa-rounds file
  console.log('\n4. Appending round summary...');
  const scoreMatch = text.match(/\*\*M[EÉ]DIA\*\*\s*\|\s*\*?\*?([\d.]+)/i);
  const score = scoreMatch ? scoreMatch[1] + '/10' : '?/10';
  const proposalMatches = [...text.matchAll(/###\s*Proposta\s*\d+[:\s]*([^\n]+)/gi)];
  const proposals = proposalMatches.length > 0
    ? proposalMatches.map(m => m[1].trim())
    : ['(parse proposals manually from response)'];
  appendRoundSummary(slideId, round, score, proposals);

  // Cleanup uploaded files
  console.log('\n5. Cleaning up uploads...');
  for (const f of [video, s0, s1, s2].filter(Boolean)) {
    try {
      await fetch(`${BASE}/v1beta/${f.name}?key=${API_KEY}`, { method: 'DELETE' });
    } catch (_) {}
  }
  console.log('  Done.');
}

// --- Main ---
async function main() {
  console.log(`Mode: ${MODE} | Slide: ${SLIDE_ID} | Model: ${MODEL}\n`);

  // Gate 0: Defect inspection
  if (MODE === 'inspect' || MODE === 'full') {
    const gate0Result = await runGate0(SLIDE_ID, QA_DIR);

    if (gate0Result.must_pass === false) {
      process.exit(1);
    }

    if (MODE === 'inspect') {
      process.exit(0);
    }
  }

  // Gate 4: Editorial review
  if (MODE === 'editorial' || MODE === 'full') {
    await runEditorial(SLIDE_ID, ROUND, QA_DIR);
  }
}

main().catch(err => { console.error(err); process.exit(1); });

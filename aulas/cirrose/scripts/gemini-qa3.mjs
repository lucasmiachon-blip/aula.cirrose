#!/usr/bin/env node
/**
 * Send QA.3 creative review to Gemini 3.1 Pro via REST API.
 * Reads HTML/CSS/JS DYNAMICALLY from source files (E42 compliance).
 *
 * Usage: node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-01 --round 11
 * Requires: GEMINI_API_KEY env var
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
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

function extractCSS(slideId) {
  const cssPath = join(AULA_DIR, 'cirrose.css');
  const css = readFileSync(cssPath, 'utf8');
  const lines = css.split('\n');
  const result = [];
  let capturing = false;
  let braceDepth = 0;
  let blockStart = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Start capturing when we see the slide ID in a selector or comment
    if (!capturing && line.includes(slideId)) {
      // Look back for comment block start
      let commentStart = i;
      while (commentStart > 0 && lines[commentStart - 1].trim().startsWith('/*') || lines[commentStart - 1].trim().startsWith('*')) {
        commentStart--;
      }
      if (commentStart < i && lines[commentStart].includes('/*')) {
        for (let j = commentStart; j < i; j++) result.push(lines[j]);
      }
      capturing = true;
      blockStart = i;
    }

    if (capturing) {
      result.push(line);
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;

      // Stop capturing after closing brace of current rule, but keep going
      // if next non-empty line still references the slide ID
      if (braceDepth === 0 && result.length > 1) {
        // Peek ahead for more rules with this ID
        let nextContentLine = i + 1;
        while (nextContentLine < lines.length && lines[nextContentLine].trim() === '') nextContentLine++;
        if (nextContentLine < lines.length && lines[nextContentLine].includes(slideId)) {
          result.push(''); // blank separator
          continue;
        }
        // Also peek for .no-js rules referencing this ID
        if (nextContentLine < lines.length && lines[nextContentLine].includes('.no-js') && lines[nextContentLine].includes(slideId)) {
          result.push('');
          continue;
        }
        capturing = false;
      }
    }
  }

  console.log(`  CSS: ${result.length} lines extracted for ${slideId}`);
  return result.join('\n');
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

// --- Slide metadata from manifest ---
function getSlideMetadata(slideId) {
  const manifestPath = join(AULA_DIR, 'slides', '_manifest.js');
  const manifest = readFileSync(manifestPath, 'utf8');

  // Parse slides array entries
  const idRegex = /\{\s*id:\s*['"]([^'"]+)['"]/g;
  const ids = [];
  let m;
  while ((m = idRegex.exec(manifest)) !== null) ids.push(m[1]);

  const pos = ids.indexOf(slideId);
  const prev = pos > 0 ? ids[pos - 1] : '(first)';
  const next = pos < ids.length - 1 ? ids[pos + 1] : '(last)';

  return { pos: `${pos + 1}/${ids.length}`, prev, next };
}

// --- Round context per slide (update when changing slides) ---
const ROUND_CONTEXTS = {
  's-a1-01': `Round 11 (R11) — Ghost Rows + hero typography + metric scale + scan effect + case-panel hide.
Evolucao de formato (painel direito guideline):
- R0-R4: Paper card + Flip badge → KILLED (glassmorphism)
- R5-R7: Em-dash stacked list → usuario nao gostou ("agrada pouco")
- R8-R10: Pill tags (border-radius 999px, teal bg match, gray dimmed) → usuario aprovou formato ("quase la")
- R11: Ghost Rows (Gemini Option D) — status-dot + row-text + teal wash on match + scanner line effect.

O que mudou em R11 vs R10:
- HTML: guideline-pills → guideline-stack > stack-row > status-dot + row-text (3 rows, 2 com data-match)
- CSS: Ghost Row matched = teal wash oklch(40% 0.12 170 / 0.08) + glow dot + teal text. Dimmed = opacity 0.35 + scale 0.98.
- CSS P2: Hero "%" maior (clamp 60px-100px), negative margin -0.08em, translateY(-15px)
- CSS P3: Metric values clamp(32px-42px), oklch(20%), editorial border-top + margin-top:auto
- CSS P5: Source-tag full-width (left:48px; right:48px), 11px, text-overflow:ellipsis
- JS P1: #case-panel GSAP opacity:0 on slide enter, restores on slide:changed
- JS P4: Scanner line (teal gradient div) sweeps guideline-stack before match punch
- JS: Sequential scan → match punch com back.out(1.5) ease nos matched rows

SCORES historico: R0(5.1) → R4(6.0) → R8(6.65) → R10(6.65) → R10 projetou 9.1 com Ghost Rows.
Objetivo: 8+. Se < 7, algo regrediu.

NOTA: usuario reportou que "perdemos o bloco lateral de ter ficado bem melhor". Avaliar se Ghost Rows regrediram vs pills.
Manter: Grid 6fr:4fr, Bloomberg hero (Instrument Serif 140-220px, appleHero/snapOut eases), reactive metrics on countUp >= 70, SplitText headline.`,
};

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
  const roundCtx = ROUND_CONTEXTS[slideId] || `Round ${round}. No previous round context documented.`;

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
- ${slideId} (posicao ${meta.pos}), narrativeRole: setup, tensionLevel: 2/5
- Anterior: ${meta.prev}
- Seguinte: ${meta.next}

</context>

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
${mediaUris.s1 ? '3. PNG S1 — estado intermediario (countUp em andamento, metricas aparecendo)' : '(sem S1)'}
${mediaUris.s2 ? '4. PNG S2 — estado final (todos elementos visiveis, Ghost Rows matched/dimmed)' : '(sem S2)'}

</materials>

<task>

Siga estes passos NA ORDEM. Nao pule nenhum.

### Passo 1 — OLHAR antes de pensar
Olhe PRIMEIRO o video (se houver). Depois os PNGs por estado. Forme impressao visceral. Depois leia o codigo.

### Passo 2 — OBSERVAR (scratchpad obrigatorio)
Escreva bloco \`## Observacao\`: composicao, hierarquia, ritmo, peso visual, fluxo do olhar. O que funciona (MECANISMO). O que incomoda (MECANISMO). Motion = emocao. "Se eu so pudesse mudar UMA coisa?"

### Passo 3 — SCORECARD (tabela 10 dimensoes, notas 1-10)
| Dimensao | Nota | Justificativa |
|----------|------|---------------|
| Beleza geral | ?/10 | |
| Superficie e profundidade | ?/10 | |
| Tipografia como arquitetura | ?/10 | |
| Paleta de cores e contraste | ?/10 | |
| Composicao e respiro | ?/10 | |
| Motion como narrativa | ?/10 | |
| Interacoes avancadas (GSAP) | ?/10 | |
| Craft front-end (CSS/HTML) | ?/10 | |
| Legibilidade a 5m | ?/10 | |
| Impacto emocional | ?/10 | |
| **MEDIA** | ?/10 | |

### Passo 4 — AVALIAR 10 lentes (cada com SCORE IMPACT)
Lente 1-BELEZA, 2-SUPERFICIE, 3-TIPOGRAFIA, 4-COR, 5-COMPOSICAO, 6-MOTION, 7-INTERACOES, 8-CRAFT, 9-LEGIBILIDADE, 10-IMPACTO.

### Passo 5 — PROPOR 3-7 propostas
Formato: Proposta N / O que / Por que (mecanismo) / Como (snippet) / Impacto / Prioridade (MUST|SHOULD|COULD).

### Passo 6 — RADICAL (minimo 1 ideia ousada)

### Passo 7 — AUTOCRITICA (contradiz? API errada? sacrifica legibilidade?)

### Passo 8 — PROJECAO (scorecard antes/depois)

</task>

<constraints>
Nao quero: checklist PASS/FAIL, elogios genericos, patterns de web, sugestoes timidas, accessibility theater, ignorar o video.
Tom: direto, honesto, PT-BR, codigo em ingles, 1500-3000 tokens.
PREZE pela legibilidade a 5m em projetor — o slide DEVE ser legivel, nao so bonito.
</constraints>`;

  // Build parts array with text + media
  const parts = [{ text }];
  if (mediaUris.video) parts.push({ fileData: { mimeType: 'video/webm', fileUri: mediaUris.video } });
  if (mediaUris.s0) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.s0 } });
  if (mediaUris.s1) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.s1 } });
  if (mediaUris.s2) parts.push({ fileData: { mimeType: 'image/png', fileUri: mediaUris.s2 } });

  return {
    contents: [{ parts }],
    generationConfig: { temperature: 1.0, topP: 0.95, maxOutputTokens: 16384 },
  };
}

// --- Main ---
async function main() {
  console.log(`=== QA.3 Gemini Creative Review — ${SLIDE_ID} R${ROUND} ===`);
  console.log(`Model: ${MODEL}\n`);

  // Step 0: Extract source code dynamically (E42)
  console.log('0. Extracting source code from files...');
  const rawHTML = extractHTML(SLIDE_ID);
  const rawCSS = extractCSS(SLIDE_ID);
  const rawJS = extractJS(SLIDE_ID);
  const notes = extractNotes(rawHTML);
  const meta = getSlideMetadata(SLIDE_ID);
  console.log(`  Metadata: pos=${meta.pos}, prev=${meta.prev}, next=${meta.next}\n`);

  // Step 1: Upload media
  console.log('1. Uploading media...');
  const videoPath = join(QA_DIR, 'animation-1280x720.webm');
  const s0Path = join(QA_DIR, 'S0-1280x720.png');
  const s1Path = join(QA_DIR, 'S1-mid-1280x720.png');
  const s2Path = join(QA_DIR, 'S2-final-1280x720.png');

  const video = await uploadFile(videoPath, 'video/webm', `${SLIDE_ID}-animation`);
  const s0 = await uploadFile(s0Path, 'image/png', `${SLIDE_ID}-S0-initial`);
  const s1 = await uploadFile(s1Path, 'image/png', `${SLIDE_ID}-S1-mid`);
  const s2 = await uploadFile(s2Path, 'image/png', `${SLIDE_ID}-S2-final`);

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
    s1: s1?.uri,
    s2: s2?.uri,
  };
  const payload = buildPrompt(SLIDE_ID, ROUND, rawHTML, rawCSS, rawJS, notes, meta, mediaUris);

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
  const outPath = join(QA_DIR, `gemini-qa3-r${ROUND}.md`);
  writeFileSync(outPath, `# QA.3 Gemini Review — ${SLIDE_ID} (R${ROUND})\n\n` +
    `Model: ${MODEL} | Temp: 1.0 | Date: ${new Date().toISOString().slice(0, 10)}\n` +
    `Tokens: ${usage.promptTokenCount || '?'} in / ${usage.candidatesTokenCount || '?'} out | Cost: ~$${totalCost.toFixed(3)}\n\n---\n\n` +
    text + '\n');
  console.log(`\n3. Response saved → ${outPath}`);

  // Print response
  console.log('\n' + '='.repeat(60));
  console.log(text);

  // Cleanup uploaded files
  console.log('\n4. Cleaning up uploads...');
  for (const f of [video, s0, s1, s2].filter(Boolean)) {
    try {
      await fetch(`${BASE}/v1beta/${f.name}?key=${API_KEY}`, { method: 'DELETE' });
    } catch (_) {}
  }
  console.log('  Done.');
}

main().catch(err => { console.error(err); process.exit(1); });

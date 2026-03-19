#!/usr/bin/env node
/**
 * Send QA.3 creative review to Gemini 3.1 Pro via REST API.
 * Uploads video + PNGs, sends filled prompt, saves response.
 *
 * Usage: node aulas/cirrose/scripts/gemini-qa3.mjs --slide s-a1-01
 * Requires: GEMINI_API_KEY env var
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('GEMINI_API_KEY not set'); process.exit(1); }

const MODEL = 'gemini-3.1-pro-preview';
const BASE = 'https://generativelanguage.googleapis.com';

// --- Config ---
const SLIDE_ID = 's-a1-01';
const QA_DIR = join(__dirname, '..', 'qa-screenshots', SLIDE_ID);

const VIDEO_FILE = join(QA_DIR, 'animation-1280x720.webm');
const S0_FILE = join(QA_DIR, 'S0-1280x720.png');
const S2_FILE = join(QA_DIR, 'S2-final-1280x720.png');

// --- File upload ---
async function uploadFile(filePath, mimeType, displayName) {
  const data = readFileSync(filePath);
  const size = data.length;

  // Start resumable upload
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

  // Upload bytes
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

// --- Prompt ---
function buildPrompt(videoUri, s0Uri, s2Uri) {
  const text = `Voce e cinco profissionais fundidos em um:

1. Art director que projeta keynotes para Apple Health e Stripe Sessions — obsessivo com whitespace, profundidade de superficie e tensao entre minimalismo e impacto
2. Motion designer estilo Kurzgesagt — cada frame tem intencao narrativa
3. Tipografo editorial da Bloomberg Businessweek — hierarquia tipografica cria arquitetura visual
4. UI/UX designer senior da Linear/Vercel — craft obsessivo com micro-interacoes, espacamento, cor como sistema
5. Front-end engineer que implementa as visoes dos 4 acima — GSAP, CSS moderno (oklch, container queries, has(), grid subgrid)

Editor final criativo. Autoridade total para propor mudancas radicais.

### Mentalidade
- NAO e linter nem QA bot. E a pessoa que diz "esse frame nao respira".
- CAMADAS: projetor a 10m / TV a 3m / designer a 50cm.
- Todo pixel e decisao. Sem motivo = ruido.

### Calibracao: Nivel 1 (PowerPoint) a 5 (Keynote-grade Apple WWDC). Target: 4-5.

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
- s-a1-01 (posicao 3/44), narrativeRole: setup, tensionLevel: 2/5
- Anterior: s-hook (hook) — caso clinico Antonio, labs stagger, punchline "Qual sua conduta?"
- Seguinte: s-a1-classify (setup) — estadiamento + prognostico, PREDESCI HR 0.51

### Material visual anexado
1. VIDEO .webm — gravacao completa da animacao a 1280x720. ASSISTA e comente RITMO.
2. PNG S0 — estado inicial (section-tag + h2 + hero mid-countUp, metade inferior vazia)
3. PNG S2 — estado final (todos elementos visiveis)

### Slide: Rastreio de hepatopatia na atencao primaria
Primeiro slide de conteudo apos hook. 83% = primeiro numero-impacto do deck. Corroboracao (6.4x, >85%) + convergencia guidelines (3 sociedades).

### Round context
Round 6 (re-avaliacao pos-R5). Implementou 3 propostas do R5 (4.5/10):
- P1 DONE: Baseline hero alignment — align-items:baseline on .screening-hero, wider margin hero→label (space-md→space-lg), line-height 0.85. No more text collision.
- P2 DONE: Editorial drawer — border-radius 0 (was 24px), border-left 1px solid editorial cut, box-shadow REMOVED. Clean vertical division.
- P3 DONE: Bloomberg metrics — font-mono on values (600 weight), uppercase labels (tracking 0.05em), 2px border-top divider (was 1px faint).
- P4 RADICAL SKIPPED: Case-panel integration impossible (shared/ read-only in worktree).
- KEPT from R4/R5: Grid 6fr:4fr, reactive metrics (countUp→70→reveal), SplitText, Flip badge flight, drawer slide-in power4.out, source-tag 13px.
- Specificity: section#s-a1-01 beats base.css.
Scores R0(5.1)→R1(4.5)→R2(5.9)→R3(5.6)→R4(6.0)→R5(4.5). Objetivo: 8+.
NOTA IMPORTANTE: preze pela legibilidade a 5m em projetor — o slide DEVE ser legivel, nao so bonito.

### HTML:
\`\`\`html
<section id="s-a1-01" data-timing="90" data-panel-state="neutral">
  <div class="slide-inner">
    <div class="hero-block">
      <p class="section-tag">ATO 1 — CLASSIFICAR</p>
      <h2 class="slide-headline">Por que rastrear?</h2>
      <div class="screening-hero">
        <span class="screening-hero-number">0</span>
        <span class="screening-hero-unit">%</span>
      </div>
      <p class="screening-hero-label">dos diagnosticos de cACLD eram novos</p>
      <div class="screening-metrics" style="opacity:0">
        <div class="screening-metric">
          <span class="screening-metric-value">6,4x</span>
          <span class="screening-metric-label">deteccao vs rotina</span>
        </div>
        <div class="screening-metric">
          <span class="screening-metric-value">>85%</span>
          <span class="screening-metric-label">nao sabem nos EUA</span>
        </div>
      </div>
    </div>
    <div class="guideline-rec" style="opacity:0">
      <p class="guideline-rec-text">Rastrear fibrose hepatica: <strong class="guide-match" data-match="dm2">DM2</strong> . <strong>obesidade abdominal</strong> + fator metabolico . <strong class="guide-match" data-match="enzimas">enzimas alteradas</strong></p>
      <p class="guideline-rec-source">EASL 2024 + AASLD 2023 + ADA 2025 convergem</p>
    </div>
    <p class="source-tag" style="opacity:0">Prince 2024 (PMID 38934697) . NHANES 2025 (PMID 40581070) . EASL-EASD-EASO 2024 (PMID 38851997)</p>
  </div>
</section>
\`\`\`

### CSS (key rules):
\`\`\`css
section#s-a1-01 .slide-inner { position:relative; display:grid; grid-template-columns:6fr 4fr; grid-template-rows:1fr; gap:0; padding:0; height:100%; box-sizing:border-box; overflow:hidden; }
#s-a1-01 .hero-block { grid-column:1; grid-row:1; container-type:inline-size; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; text-align:left; padding:36px 48px 40px; }
#s-a1-01 .screening-hero { display:flex; align-items:baseline; gap:0; }
#s-a1-01 .screening-hero-number { font-family:var(--font-display); font-size:clamp(140px,15vw,220px); line-height:0.85; letter-spacing:-0.05em; }
#s-a1-01 .screening-hero-label { max-width:16ch; font-size:clamp(18px,1.5vw,22px); font-weight:500; line-height:1.15; color:oklch(30% 0 0); margin:var(--space-md) 0 var(--space-lg); }
#s-a1-01 .screening-metrics { display:grid; grid-template-columns:1fr 1fr; gap:var(--space-lg); border-top:2px solid oklch(20% 0.02 258); padding-top:var(--space-sm); }
#s-a1-01 .screening-metric-value { font-family:var(--font-mono); font-weight:600; letter-spacing:-0.02em; }
#s-a1-01 .screening-metric-label { text-transform:uppercase; letter-spacing:0.05em; font-size:clamp(11px,0.8vw,13px); color:oklch(40% 0 0); }
#s-a1-01 .guideline-rec { grid-column:2; grid-row:1/-1; background:white; border:none; border-left:1px solid oklch(0% 0 0/0.08); border-radius:0; padding:var(--space-2xl) var(--space-lg) var(--space-lg); display:flex; flex-direction:column; justify-content:center; transform-origin:right center; overflow:hidden; }
#s-a1-01 .guideline-rec-text { font-size:clamp(18px,1.4vw,22px); line-height:1.4; }
#s-a1-01 .guideline-rec-source { font-family:var(--font-mono); font-size:clamp(12px,0.85vw,14px); color:oklch(45% 0 0); }
#s-a1-01 .guide-match { display:inline-block; background:oklch(96% 0 0); color:oklch(20% 0 0); padding:2px 8px; border-radius:6px; border:1px solid oklch(92% 0 0); font-family:var(--font-mono); font-size:0.9em; }
.badge-clone { position:fixed; z-index:100; pointer-events:none; background:var(--safe); color:oklch(100% 0 0); border-radius:6px; box-shadow:0 8px 32px oklch(0% 0 0/0.15); }
#s-a1-01 .source-tag { position:absolute; bottom:12px; left:48px; font-family:var(--font-mono); font-size:13px; color:oklch(55% 0 0); max-width:50%; overflow-wrap:anywhere; }
\`\`\`

### JS (GSAP timeline — key sections):
\`\`\`js
// Custom eases
CustomEase.create('appleHero', 'M0,0 C0.05,0.85 0.1,1 1,1');
CustomEase.create('snapOut', 'M0,0 C0.2,1 0.3,1 1,1');

// SplitText headline chars reveal (t=0, 0.4s stagger 0.02)
// Bloomberg CountUp: scale 0.8→1 + blur(6px→0) (snapOut 1.4s) + countUp 0→83 (appleHero 1.8s) at t=0.2
// REACTIVE: when countUp val>=70, triggers revealMetrics() (P2 causal connection)
// revealMetrics(): SplitText chars + blur(4px→0) + clipPath labels (reactive, not fixed timeline)
// Drawer: x:'100%'→'0%' (t=2.8, power4.out 1.0s) — full-height panel slides from right edge
// PUNCH (t=3.6): guide-match badges → teal bg + white text (back.out)
// Flip badge flight: clone badges → animate fixed position to #case-panel coords → ripple burst on arrival
// Case-panel pulse: box-shadow ring (teal) 0.3s in, 0.6s out
// Source-tag opacity 0.7 at guideline+0.4
\`\`\`

### Speaker Notes:
[0:00-0:30] "Antonio chegou assintomatico. ALT normal." PAUSA 2s. "Mas o medico da UBS pediu um FIB-4."
[0:30-1:00] "Prince 2024: rastrearam >32 mil. 83% eram diagnosticos novos." PAUSA 3s. Metricas aparecem. NHANES >85% nao sabem. 6.4x yield.
[1:00-1:20] Guideline-rec aparece. "EASL, AASLD e ADA convergem." ENFASE: "Antonio tem dois dos tres."
[1:20-1:30] "Antonio tem FIB-4 de 5,91." -> avancar

### TAREFA (passos obrigatorios, nao pular nenhum):

1. OLHAR — PRIMEIRO o video. Depois PNGs. Impressao visceral. Depois codigo.
2. OBSERVAR — scratchpad: composicao, hierarquia, ritmo, peso visual, fluxo do olhar. O que funciona (MECANISMO). O que incomoda (MECANISMO). Motion = emocao. "Se eu so pudesse mudar UMA coisa?"
3. SCORECARD — tabela 10 dimensoes (Beleza geral, Superficie/profundidade, Tipografia como arquitetura, Paleta/contraste, Composicao/respiro, Motion como narrativa, Interacoes avancadas GSAP, Craft front-end, Legibilidade a 5m, Impacto emocional, MEDIA). Notas 1-10.
4. AVALIAR 10 lentes — cada com SCORE IMPACT.
5. PROPOR 3-7 — formato: Proposta N / O que / Por que (mecanismo) / Como (snippet) / Impacto / Prioridade (MUST|SHOULD|COULD).
6. RADICAL — minimo 1 ideia ousada.
7. AUTOCRITICA — contradiz outra? API GSAP incorreta? Sacrifica legibilidade?
8. PROJECAO — scorecard antes/depois.

### Nao quero: checklist PASS/FAIL, elogios genericos, patterns de web, sugestoes timidas, accessibility theater, ignorar o video.
### Tom: direto, honesto, PT-BR, codigo em ingles, 1500-3000 tokens.`;

  return {
    contents: [{
      parts: [
        { text },
        { fileData: { mimeType: 'video/webm', fileUri: videoUri } },
        { fileData: { mimeType: 'image/png', fileUri: s0Uri } },
        { fileData: { mimeType: 'image/png', fileUri: s2Uri } },
      ]
    }],
    generationConfig: {
      temperature: 1.0,
      topP: 0.95,
      maxOutputTokens: 16384,
    }
  };
}

// --- Main ---
async function main() {
  console.log(`=== QA.3 Gemini Creative Review — ${SLIDE_ID} ===`);
  console.log(`Model: ${MODEL}`);

  // Upload files
  console.log('\n1. Uploading media...');
  const video = await uploadFile(VIDEO_FILE, 'video/webm', `${SLIDE_ID}-animation`);
  const s0 = await uploadFile(S0_FILE, 'image/png', `${SLIDE_ID}-S0-initial`);
  const s2 = await uploadFile(S2_FILE, 'image/png', `${SLIDE_ID}-S2-final`);

  // Wait for video processing
  if (video.state === 'PROCESSING') {
    process.stdout.write('  Waiting for video processing');
    const ok = await waitForProcessing(video.name);
    if (!ok) { console.error('Video processing failed'); process.exit(1); }
  }

  // Build and send prompt
  console.log('\n2. Sending prompt...');
  const payload = buildPrompt(video.uri, s0.uri, s2.uri);

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
  const outPath = join(QA_DIR, 'gemini-qa3-r6.md');
  writeFileSync(outPath, `# QA.3 Gemini Review — ${SLIDE_ID} (R6)\n\n` +
    `Model: ${MODEL} | Temp: 1.0 | Date: ${new Date().toISOString().slice(0,10)}\n` +
    `Tokens: ${usage.promptTokenCount || '?'} in / ${usage.candidatesTokenCount || '?'} out | Cost: ~$${totalCost.toFixed(3)}\n\n---\n\n` +
    text + '\n');
  console.log(`\n3. Response saved → ${outPath}`);

  // Print response
  console.log('\n' + '='.repeat(60));
  console.log(text);

  // Cleanup uploaded files
  console.log('\n4. Cleaning up uploads...');
  for (const f of [video, s0, s2]) {
    try {
      await fetch(`${BASE}/v1beta/${f.name}?key=${API_KEY}`, { method: 'DELETE' });
    } catch (_) {}
  }
  console.log('  Done.');
}

main().catch(err => { console.error(err); process.exit(1); });

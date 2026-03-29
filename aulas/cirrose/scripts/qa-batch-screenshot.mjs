#!/usr/bin/env node
/**
 * QA Batch Screenshots — Cirrose
 *
 * Captures screenshots + bounding box metrics for all slides in an act.
 * Uses __deckGoTo() navigation (deck.js). S0 + S2 only, no intermediaries.
 *
 * Usage:
 *   node aulas/cirrose/scripts/qa-batch-screenshot.mjs --act A1
 *   node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide s-a1-01
 *   node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide s-a1-01 --video
 *
 * Options:
 *   --act    A1|A2|A3|CP|APP|PRE|ALL (default: A1)
 *   --port   Dev server port (default: 3000)
 *   --slide  Single slide ID (overrides --act)
 *   --scale  Device scale factor (default: 2)
 *   --video  Record .webm video per slide (for Gate 4)
 *
 * Output: qa-screenshots/{slide-id}/{slide}_{date}_{time}_{state}.png
 * Naming: deletes previous round PNGs before capturing new ones.
 * Navigation: uses __deckGoTo(index) — never ArrowRight between slides.
 * States: S0 (initial) + S2 (final only). No intermediaries.
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CIRROSE = join(__dirname, '..');
const OUT_BASE = join(CIRROSE, 'qa-screenshots');

// Parse args
const args = process.argv.slice(2);

// J4: --help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node qa-batch-screenshot.mjs [options]

Options:
  --act <ACT>    A1|A2|A3|CP|APP|ALL (default: A1)
  --slide <id>   Single slide ID (overrides --act)
  --port <N>     Dev server port (default: 3000)
  --scale <N>    Device scale factor (default: 2)
  --video        Record .webm video per slide (for Gate 4)

Output: qa-screenshots/{slide-id}/{slide}_{date}_{time}_{state}.png`);
  process.exit(0);
}
function getArg(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}
const ACT_FILTER = getArg('act', 'A1').toUpperCase();
const PORT = getArg('port', '3000');
const SINGLE_SLIDE = getArg('slide', null);
const SCALE = parseInt(getArg('scale', '2'));
const RECORD_VIDEO = args.includes('--video');

// Timestamp for screenshot naming: {slide-id}_{YYYY-MM-DD}_{HHmm}_{state}.png
const NOW = new Date();
const DATE_STAMP = NOW.toISOString().slice(0, 10);
const TIME_STAMP = String(NOW.getHours()).padStart(2, '0') + String(NOW.getMinutes()).padStart(2, '0');

const PAGE_URL = `http://localhost:${PORT}/aulas/cirrose/index.html`;

// Import manifest — we need slide order and metadata
const { slides } = await import(`file://${join(CIRROSE, 'slides', '_manifest.js').replace(/\\/g, '/')}`);

// Determine which slides to capture
function getActFilter(act) {
  switch (act) {
    case 'PRE': return s => s.act === null && s.archetype !== 'recap';
    case 'A1': return s => s.act === 'A1' || (s.act === 'CP' && s.id === 's-cp1');
    case 'A2': return s => s.act === 'A2' || (s.act === 'CP' && s.id === 's-cp2');
    case 'A3': return s => s.act === 'A3' || (s.act === 'CP' && s.id === 's-cp3') || s.id === 's-close';
    case 'CP': return s => s.act === 'CP';
    case 'APP': return s => s.act === 'APP';
    case 'ALL': return () => true;
    default: return s => s.act === act;
  }
}

let targetSlides;
if (SINGLE_SLIDE) {
  targetSlides = slides.filter(s => s.id === SINGLE_SLIDE);
  if (targetSlides.length === 0) {
    throw new Error(`Slide ${SINGLE_SLIDE} not found in manifest`);
  }
} else {
  const filter = getActFilter(ACT_FILTER);
  // Pre-act slides (title, hook) are included in A1 if ACT_FILTER is A1
  if (ACT_FILTER === 'A1') {
    targetSlides = slides.filter(s => s.act === null && s.archetype !== 'recap' || s.act === 'A1' || (s.act === 'CP' && s.id === 's-cp1'));
  } else {
    targetSlides = slides.filter(filter);
  }
}

// Build index map: slideId → position in deck (0-indexed)
const slideIndexMap = new Map();
slides.forEach((s, i) => slideIndexMap.set(s.id, i));

console.log(`\nQA Batch Screenshots — Cirrose`);
console.log(`Act: ${SINGLE_SLIDE || ACT_FILTER} | Port: ${PORT} | Scale: ${SCALE}x`);
console.log(`Slides: ${targetSlides.map(s => s.id).join(', ')}`);
console.log(`Total: ${targetSlides.length} slides\n`);

async function measureElements(page, slideId) {
  return page.evaluate((id) => {
    const section = document.querySelector(`#${id}`);
    if (!section) return null;

    const result = { slideId: id, elements: {}, computed: {} };

    // Common element classes to measure
    const classes = [
      'section-tag', 'slide-headline', 'slide-inner',
      'screening-hero', 'guideline-rec', 'source-tag',
      'hero-number', 'hero-stat', 'pathway-track',
      'poll-question', 'poll-options', 'evidence',
      'flow-container', 'metrics-grid', 'compare-grid',
      'timeline-track', 'tree-container', 'criteria-list',
      'checkpoint-question', 'tufte'
    ];

    for (const cls of classes) {
      const el = section.querySelector(`.${cls}`);
      if (el) {
        const r = el.getBoundingClientRect();
        result.elements[cls] = {
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          height: Math.round(r.height),
          centerX: Math.round(r.left + r.width / 2),
          centerY: Math.round(r.top + r.height / 2),
        };
      }
    }

    // Also measure h2
    const h2 = section.querySelector('h2');
    if (h2) {
      const r = h2.getBoundingClientRect();
      result.elements['h2'] = {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        height: Math.round(r.height),
        centerX: Math.round(r.left + r.width / 2),
        text: h2.textContent.trim(),
        lines: Math.round(r.height / parseFloat(getComputedStyle(h2).lineHeight)),
      };
    }

    // Computed metrics
    const inner = section.querySelector('.slide-inner');
    if (inner) {
      const ir = inner.getBoundingClientRect();
      // Get all visible children bounding box
      let minTop = Infinity, maxBottom = 0;
      for (const child of inner.children) {
        if (child.tagName === 'ASIDE') continue; // skip notes
        const cr = child.getBoundingClientRect();
        if (cr.height === 0 || getComputedStyle(child).opacity === '0') continue;
        minTop = Math.min(minTop, cr.top);
        maxBottom = Math.max(maxBottom, cr.bottom);
      }
      const contentHeight = maxBottom - minTop;
      result.computed.fillRatio = Math.round((contentHeight / ir.height) * 100) / 100;
      result.computed.slideInnerWidth = Math.round(ir.width);
      result.computed.slideInnerHeight = Math.round(ir.height);
    }

    // Word count (body text, exclude notes)
    const bodyText = section.querySelector('.slide-inner');
    if (bodyText) {
      const clone = bodyText.cloneNode(true);
      const notes = clone.querySelector('aside');
      if (notes) notes.remove();
      const h2el = clone.querySelector('h2');
      if (h2el) h2el.remove();
      const tag = clone.querySelector('.section-tag');
      if (tag) tag.remove();
      const src = clone.querySelector('.source-tag');
      if (src) src.remove();
      const words = clone.textContent.trim().split(/\s+/).filter(w => w.length > 0);
      result.computed.bodyWordCount = words.length;
    }

    // Source tag presence
    result.computed.hasSourceTag = !!section.querySelector('.source-tag');

    // Panel overlap check
    const panel = document.querySelector('.case-panel');
    if (panel && inner) {
      const pr = panel.getBoundingClientRect();
      const ir = inner.getBoundingClientRect();
      result.computed.panelRight = Math.round(pr.left);
      result.computed.contentRight = Math.round(ir.right);
      result.computed.hasPanelOverlap = ir.right > pr.left;
    }

    return result;
  }, slideId);
}

// --- Automated front-end checks (run against S0 metrics) ---
// Archetypes exempt from standard checks (no h2, special fill ratios)
const EXEMPT_ARCHETYPES = new Set(['title', 'hook', 'recap']);

function runChecks(metrics, slide, slideConsoleErrors) {
  const checks = [];
  const m = metrics?.computed || {};
  const els = metrics?.elements || {};

  // C1: Body word count > 30 (Hard Constraint #10)
  if (m.bodyWordCount != null && m.bodyWordCount > 30) {
    checks.push({ id: 'C1', rule: 'bodyWordCount<=30', status: 'FAIL', value: m.bodyWordCount, msg: `Body has ${m.bodyWordCount} words (max 30)` });
  } else if (m.bodyWordCount != null) {
    checks.push({ id: 'C1', rule: 'bodyWordCount<=30', status: 'PASS', value: m.bodyWordCount });
  }

  // C2: Fill ratio thresholds (skip exempt archetypes)
  if (m.fillRatio != null && !EXEMPT_ARCHETYPES.has(slide.archetype)) {
    if (m.fillRatio > 0.95) {
      checks.push({ id: 'C2', rule: 'fillRatio<=0.95', status: 'FAIL', value: m.fillRatio, msg: 'Content overflows slide area' });
    } else if (m.fillRatio < 0.25) {
      checks.push({ id: 'C2', rule: 'fillRatio>=0.25', status: 'WARN', value: m.fillRatio, msg: 'Very low fill ratio — slide may look empty' });
    } else {
      checks.push({ id: 'C2', rule: 'fillRatio', status: 'PASS', value: m.fillRatio });
    }
  }

  // C3: h2 present (assertion-evidence, skip exempt archetypes)
  if (!EXEMPT_ARCHETYPES.has(slide.archetype)) {
    if (!els.h2) {
      checks.push({ id: 'C3', rule: 'h2Present', status: 'FAIL', msg: 'Missing h2 — assertion-evidence requires clinical assertion' });
    } else {
      checks.push({ id: 'C3', rule: 'h2Present', status: 'PASS' });
      // C4: h2 line count
      if (els.h2.lines > 2) {
        checks.push({ id: 'C4', rule: 'h2Lines<=2', status: 'WARN', value: els.h2.lines, msg: `h2 wraps to ${els.h2.lines} lines (max 2)` });
      } else {
        checks.push({ id: 'C4', rule: 'h2Lines<=2', status: 'PASS', value: els.h2.lines });
      }
    }
  }

  // C5: Console JS errors
  if (slideConsoleErrors && slideConsoleErrors.length > 0) {
    checks.push({ id: 'C5', rule: 'noConsoleErrors', status: 'FAIL', value: slideConsoleErrors.length, msg: `${slideConsoleErrors.length} JS error(s): ${slideConsoleErrors[0].slice(0, 80)}` });
  } else {
    checks.push({ id: 'C5', rule: 'noConsoleErrors', status: 'PASS' });
  }

  // C6: Panel overlap
  if (m.hasPanelOverlap === true) {
    checks.push({ id: 'C6', rule: 'noPanelOverlap', status: 'FAIL', msg: `Content right (${m.contentRight}px) exceeds panel left (${m.panelRight}px)` });
  } else if (m.hasPanelOverlap === false) {
    checks.push({ id: 'C6', rule: 'noPanelOverlap', status: 'PASS' });
  }

  // C7: Source tag present (for data-heavy archetypes)
  const DATA_ARCHETYPES = new Set(['hero-stat', 'metrics', 'bars', 'compare', 'table', 'timeline', 'flow']);
  if (DATA_ARCHETYPES.has(slide.archetype) && !m.hasSourceTag) {
    checks.push({ id: 'C7', rule: 'sourceTagPresent', status: 'WARN', msg: 'Data-heavy slide missing .source-tag citation' });
  }

  const failCount = checks.filter(c => c.status === 'FAIL').length;
  const warnCount = checks.filter(c => c.status === 'WARN').length;
  return { checks, failCount, warnCount, passAll: failCount === 0 };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
  // P3: Screenshots use 2x scale (retina) for text legibility analysis.
  // Video uses 1x to keep .webm under 20MB for Gemini inlineData.
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: SCALE,
  });
  const page = await context.newPage();

  // P7: Capture console errors to include in metrics
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  console.log(`Loading ${PAGE_URL}...`);
  await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // wait for deck init + first slide animations

  const results = [];

  for (const slide of targetSlides) {
    const targetIndex = slideIndexMap.get(slide.id);
    const slideDir = join(OUT_BASE, slide.id);
    mkdirSync(slideDir, { recursive: true });

    // Delete previous round's PNGs and old videos (keep gate0.json and metrics.json)
    const oldFiles = readdirSync(slideDir).filter(f => f.endsWith('.png') || f.endsWith('.webm'));
    for (const f of oldFiles) unlinkSync(join(slideDir, f));
    if (oldFiles.length > 0) console.log(`  Cleaned ${oldFiles.length} old file(s)`);

    // Navigate to target slide (direct jump — never ArrowRight between slides)
    await page.evaluate(idx => window.__deckGoTo(idx), targetIndex);

    // Wait for animations to complete
    const animWait = slide.customAnim ? 4500 : 1000;
    await page.waitForTimeout(animWait);

    // Verify we're on the right slide
    const activeId = await page.evaluate(() => {
      const sections = document.querySelectorAll('section[id]');
      for (const s of sections) {
        if (s.classList.contains('slide-active')) return s.id;
      }
      return 'unknown';
    });

    console.log(`[${slide.id}] navigated (index ${targetIndex}, active: ${activeId})`);

    // State S0 — initial state (after auto animations, before click-reveals)
    const s0File = `${slide.id}_${DATE_STAMP}_${TIME_STAMP}_S0.png`;
    await page.screenshot({ path: join(slideDir, s0File), type: 'png' });

    // Measure layout
    const metrics = await measureElements(page, slide.id);
    if (metrics) {
      metrics.state = 'S0';
      metrics.viewport = { width: 1280, height: 720 };
    }

    // Only S0 (initial) + S2 (final). No intermediaries.
    const states = [{ state: 'S0', file: s0File, metrics }];
    if (slide.clickReveals > 0) {
      // Advance all click-reveals to reach final state
      for (let beat = 1; beat <= slide.clickReveals; beat++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(2500);
      }
      // Capture final state only
      const s2File = `${slide.id}_${DATE_STAMP}_${TIME_STAMP}_S2.png`;
      await page.screenshot({ path: join(slideDir, s2File), type: 'png' });
      const finalMetrics = await measureElements(page, slide.id);
      if (finalMetrics) finalMetrics.state = 'S2';
      states.push({ state: 'S2', file: s2File, metrics: finalMetrics });
      console.log(`  → S2 (final) captured`);
    }

    // Save metrics + automated checks (P7: include console errors if any)
    const slideConsoleErrors = consoleErrors.length > 0 ? [...consoleErrors] : undefined;
    consoleErrors.length = 0; // reset for next slide
    const checkResult = runChecks(metrics, slide, slideConsoleErrors);
    writeFileSync(
      join(slideDir, 'metrics.json'),
      JSON.stringify({ slideId: slide.id, archetype: slide.archetype, clickReveals: slide.clickReveals, timestamp: `${DATE_STAMP}_${TIME_STAMP}`, states, checks: checkResult.checks, failCount: checkResult.failCount, warnCount: checkResult.warnCount, ...(slideConsoleErrors && { consoleErrors: slideConsoleErrors }) }, null, 2)
    );

    // Print check results inline
    if (checkResult.failCount > 0 || checkResult.warnCount > 0) {
      for (const c of checkResult.checks) {
        if (c.status === 'FAIL') console.log(`  ✗ [FAIL] ${c.id} ${c.rule}: ${c.msg}`);
        else if (c.status === 'WARN') console.log(`  ⚠ [WARN] ${c.id} ${c.rule}: ${c.msg}`);
      }
    } else {
      console.log(`  All checks PASS`);
    }

    // Record video (--video flag, fresh context per slide)
    let hasVideo = false;
    if (RECORD_VIDEO) {
      console.log(`  Recording video...`);
      let videoCtx;
      try {
        videoCtx = await browser.newContext({
          viewport: { width: 1280, height: 720 },
          deviceScaleFactor: 1,
          recordVideo: { dir: slideDir, size: { width: 1280, height: 720 } },
        });
        const videoPage = await videoCtx.newPage();
        await videoPage.goto(PAGE_URL, { waitUntil: 'networkidle' });
        await videoPage.waitForTimeout(1000);
        // Navigate and play through
        await videoPage.evaluate(idx => window.__deckGoTo(idx), targetIndex);
        await videoPage.waitForTimeout(slide.customAnim ? 4500 : 1500);
        if (slide.clickReveals > 0) {
          for (let beat = 1; beat <= slide.clickReveals; beat++) {
            await videoPage.keyboard.press('ArrowRight');
            await videoPage.waitForTimeout(1000);
          }
        }
        await videoPage.waitForTimeout(500);
        // saveAs waits for ffmpeg flush — no race condition vs renameSync
        const destVideo = join(slideDir, 'animation-1280x720.webm');
        await videoPage.close();
        await videoPage.video().saveAs(destVideo);
        hasVideo = true;
        console.log(`  Video: animation-1280x720.webm`);
      } finally {
        if (videoCtx) await videoCtx.close().catch(() => {});
      }
    }

    results.push({ id: slide.id, states: states.length, video: hasVideo, path: slideDir, checks: checkResult });
    console.log(`  ✓ ${states.length} state(s)${hasVideo ? ' + video' : ''} captured\n`);
  }

  // Batch manifest — structured output for pipeline integration
  const totalFails = results.reduce((a, r) => a + r.checks.failCount, 0);
  const totalWarns = results.reduce((a, r) => a + r.checks.warnCount, 0);
  const manifest = {
    runDate: DATE_STAMP,
    runTime: TIME_STAMP,
    act: SINGLE_SLIDE || ACT_FILTER,
    slides: results.map(r => ({
      slideId: r.id,
      states: r.states,
      hasVideo: r.video,
      failCount: r.checks.failCount,
      warnCount: r.checks.warnCount,
      passAll: r.checks.passAll,
    })),
    totalSlides: results.length,
    totalFails,
    totalWarns,
    allPass: totalFails === 0,
  };
  writeFileSync(join(OUT_BASE, 'batch-manifest.json'), JSON.stringify(manifest, null, 2));

  // Summary
  console.log('=== Summary ===');
  for (const r of results) {
    const tag = r.checks.passAll ? '✓' : `✗ ${r.checks.failCount}F/${r.checks.warnCount}W`;
    console.log(`${r.id}: ${r.states} states [${tag}] → ${r.path}`);
  }
  console.log(`\nTotal: ${results.length} slides, ${results.reduce((a, r) => a + r.states, 0)} screenshots`);
  console.log(`Checks: ${totalFails} FAIL, ${totalWarns} WARN${totalFails === 0 ? ' — all pass' : ' — see batch-manifest.json'}`);
  console.log(`Manifest: qa-screenshots/batch-manifest.json`);
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});

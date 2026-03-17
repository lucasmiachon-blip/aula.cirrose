#!/usr/bin/env node
/**
 * QA Batch Screenshots — Cirrose
 *
 * Captures screenshots + bounding box metrics for all slides in an act.
 * Uses ArrowRight navigation (deck.js — hash nav not supported).
 *
 * Usage:
 *   node aulas/cirrose/scripts/qa-batch-screenshot.mjs --act A1
 *   node aulas/cirrose/scripts/qa-batch-screenshot.mjs --act A1 --port 3016
 *   node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide s-a1-01
 *
 * Options:
 *   --act    A1|A2|A3|CP|APP|PRE|ALL (default: A1)
 *   --port   Dev server port (default: 3016)
 *   --slide  Single slide ID (overrides --act)
 *   --scale  Device scale factor (default: 2)
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CIRROSE = join(__dirname, '..');
const OUT_BASE = join(CIRROSE, 'qa-screenshots');

// Parse args
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}
const ACT_FILTER = getArg('act', 'A1').toUpperCase();
const PORT = getArg('port', '3016');
const SINGLE_SLIDE = getArg('slide', null);
const SCALE = parseInt(getArg('scale', '2'));

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
    console.error(`Slide ${SINGLE_SLIDE} not found in manifest`);
    process.exit(1);
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

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: SCALE,
  });
  const page = await context.newPage();

  console.log(`Loading ${PAGE_URL}...`);
  await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // wait for deck init + first slide animations

  let currentIndex = 0;
  const results = [];

  for (const slide of targetSlides) {
    const targetIndex = slideIndexMap.get(slide.id);
    const slideDir = join(OUT_BASE, slide.id);
    mkdirSync(slideDir, { recursive: true });

    // Navigate to target slide
    const stepsNeeded = targetIndex - currentIndex;
    if (stepsNeeded > 0) {
      for (let i = 0; i < stepsNeeded; i++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(150);
      }
    } else if (stepsNeeded < 0) {
      for (let i = 0; i < Math.abs(stepsNeeded); i++) {
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(150);
      }
    }

    // Wait for animations to complete
    const animWait = slide.customAnim ? 2500 : 1000;
    await page.waitForTimeout(animWait);

    // Verify we're on the right slide
    const activeId = await page.evaluate(() => {
      const active = document.querySelector('section.active, section[data-active="true"], section:not([style*="display: none"]):not([style*="display:none"])');
      // Fallback: check which section is visible
      const sections = document.querySelectorAll('section[id]');
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.top >= 0 && r.top < 720) {
          return s.id;
        }
      }
      return active?.id || 'unknown';
    });

    console.log(`[${slide.id}] navigated (index ${targetIndex}, active: ${activeId})`);

    // State S0 — base state (after auto animations, before click-reveals)
    await page.screenshot({ path: join(slideDir, 'S0.png'), type: 'png' });

    // Measure layout
    const metrics = await measureElements(page, slide.id);
    if (metrics) {
      metrics.state = 'S0';
      metrics.viewport = { width: 1280, height: 720 };
    }

    // Click-reveals: capture each state
    const states = [{ state: 'S0', metrics }];
    if (slide.clickReveals > 0) {
      for (let beat = 1; beat <= slide.clickReveals; beat++) {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(800); // wait for reveal animation
        const stateFile = `S${beat}.png`;
        await page.screenshot({ path: join(slideDir, stateFile), type: 'png' });
        const beatMetrics = await measureElements(page, slide.id);
        if (beatMetrics) beatMetrics.state = `S${beat}`;
        states.push({ state: `S${beat}`, metrics: beatMetrics });
        console.log(`  → S${beat} captured`);
      }
    }

    // Save metrics
    writeFileSync(
      join(slideDir, 'metrics.json'),
      JSON.stringify({ slideId: slide.id, archetype: slide.archetype, clickReveals: slide.clickReveals, states }, null, 2)
    );

    // Click-reveals consume ArrowRight presses without advancing the slide.
    // After all reveals, we're still on the same slide at the same deck index.
    currentIndex = targetIndex;

    results.push({ id: slide.id, states: states.length, path: slideDir });
    console.log(`  ✓ ${states.length} state(s) captured\n`);
  }

  await browser.close();

  // Summary
  console.log('=== Summary ===');
  for (const r of results) {
    console.log(`${r.id}: ${r.states} states → ${r.path}`);
  }
  console.log(`\nTotal: ${results.length} slides, ${results.reduce((a, r) => a + r.states, 0)} screenshots`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

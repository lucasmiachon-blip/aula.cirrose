#!/usr/bin/env node
/**
 * Capture s-hook v16 screenshots — deck.js compatible
 *
 * s-hook is auto-only (no click-reveals, no __hookAdvance).
 * States:
 *   S0: initial (bio + "Sem queixas." visible, labs/question hidden)
 *   S1: after auto animation (~3s timeline: labs stagger + question fade)
 *
 * Captures at 1280x720 (presentation) and 1920x1080 (fullscreen).
 *
 * Usage:
 *   node aulas/cirrose/scripts/capture-s-hook.mjs
 *   node aulas/cirrose/scripts/capture-s-hook.mjs --port 3016
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'qa-screenshots', 's-hook', 'v16');

const args = process.argv.slice(2);
const portIdx = args.indexOf('--port');
const PORT = portIdx >= 0 && args[portIdx + 1] ? args[portIdx + 1] : '3016';
const PAGE_URL = `http://localhost:${PORT}/aulas/cirrose/index.html`;

// s-hook timeline: 0.3s delay + 6 labs * 0.15s stagger + 0.8s alert duration + 0.5s gap + 0.6s question = ~3.5s
const ANIM_SETTLE_MS = 5000;

const VIEWPORTS = [
  { width: 1280, height: 720, label: '1280x720' },
  { width: 1920, height: 1080, label: '1920x1080' },
];

async function forceAnimFinalState(page) {
  await page.evaluate(() => {
    const section = document.querySelector('#s-hook');
    if (!section) return;

    // Force all labs visible
    section.querySelectorAll('.hook-lab').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    });

    // Force alert value colors
    section.querySelectorAll('.hook-lab--alert .hook-lab-value').forEach(el => {
      el.style.color = 'var(--hook-alert-value)';
    });

    // Force question visible
    const q = section.querySelector('.hook-question');
    if (q) {
      q.style.opacity = '1';
      q.style.visibility = 'visible';
      // SplitText chars
      q.querySelectorAll('[style]').forEach(ch => {
        ch.style.opacity = '1';
        ch.style.transform = 'none';
        ch.style.filter = 'none';
      });
    }
  });
}

async function captureAtViewport(browser, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log(`\n[${vp.label}] Loading ${PAGE_URL}...`);
  await page.goto(PAGE_URL, { waitUntil: 'networkidle' });

  // Wait for deck.js init — .slide-active appears on first section
  await page.waitForFunction(() => {
    return document.querySelector('#slide-viewport > section.slide-active') !== null;
  }, { timeout: 10000 });
  // Wait for initial slide:entered (deck.js fires after 100ms + animation buffer)
  await page.waitForTimeout(2000);

  // Navigate to s-hook (slide index 1 — title is 0)
  await page.keyboard.press('ArrowRight');
  // Wait for transition (400ms CSS) + slide:entered fallback (600ms)
  await page.waitForTimeout(1200);

  // Verify we're on s-hook — deck.js uses .slide-active class
  const activeId = await page.evaluate(() => {
    const active = document.querySelector('#slide-viewport > section.slide-active');
    return active ? active.id : 'unknown';
  });
  console.log(`  Active slide: ${activeId}`);

  if (activeId !== 's-hook') {
    console.error(`  ERROR: Expected s-hook, got ${activeId}. Aborting.`);
    await context.close();
    return null;
  }

  // S0: capture initial state (bio visible, labs/question still hidden or starting to animate)
  // Small delay to let slide:entered fire but before animation completes
  await page.waitForTimeout(300);
  const s0Path = join(OUT_DIR, `S0-${vp.label}.png`);
  await page.screenshot({ path: s0Path, type: 'png' });
  console.log(`  S0 captured (initial state)`);

  // Wait for auto animation to complete
  await page.waitForTimeout(ANIM_SETTLE_MS);

  // Force final state to guarantee everything is visible
  await forceAnimFinalState(page);
  await page.waitForTimeout(200); // let forced styles paint

  // S1: capture final state (all labs + question visible)
  const s1Path = join(OUT_DIR, `S1-${vp.label}.png`);
  await page.screenshot({ path: s1Path, type: 'png' });
  console.log(`  S1 captured (final state — all visible)`);

  // Collect metrics
  const metrics = await page.evaluate(() => {
    const section = document.querySelector('#s-hook');
    if (!section) return null;

    const inner = section.querySelector('.hook-stage') || section.querySelector('.slide-inner');
    const labs = section.querySelectorAll('.hook-lab');
    const question = section.querySelector('.hook-question');
    const punchline = section.querySelector('.hook-punchline');

    const result = { elements: {} };

    const measure = (name, el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      result.elements[name] = {
        top: Math.round(r.top), left: Math.round(r.left),
        width: Math.round(r.width), height: Math.round(r.height),
        opacity: getComputedStyle(el).opacity,
      };
    };

    measure('hook-stage', inner);
    measure('hook-patient', section.querySelector('.hook-patient'));
    measure('hook-punchline', punchline);
    measure('hook-question', question);
    measure('hook-labs-grid', section.querySelector('.hook-labs-grid'));
    labs.forEach((lab, i) => measure(`hook-lab-${i}`, lab));

    return result;
  });

  await context.close();
  return { viewport: vp.label, s0: s0Path, s1: s1Path, metrics };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log('=== Capture s-hook v16 ===');
  console.log(`Port: ${PORT} | Output: ${OUT_DIR}`);

  const browser = await chromium.launch({ headless: true });
  try {
  const results = [];

  for (const vp of VIEWPORTS) {
    const r = await captureAtViewport(browser, vp);
    if (r) results.push(r);
  }

  // Save combined metrics
  if (results.length > 0) {
    const metricsPath = join(OUT_DIR, 'metrics.json');
    writeFileSync(metricsPath, JSON.stringify({
      slideId: 's-hook',
      version: 'v16',
      capturedAt: new Date().toISOString(),
      viewports: results.map(r => ({
        label: r.viewport,
        files: { S0: r.s0, S1: r.s1 },
        metrics: r.metrics,
      })),
    }, null, 2));
    console.log(`\nMetrics → ${metricsPath}`);
  }

  // Summary
  console.log('\n=== Summary ===');
  for (const r of results) {
    console.log(`${r.viewport}: S0 + S1 → ${OUT_DIR}`);
  }
  console.log(`\nTotal: ${results.length * 2} screenshots (${results.length} viewports × 2 states)`);
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});

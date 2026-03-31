#!/usr/bin/env node
/**
 * Capture s-a1-01 screenshots + video — deck.js compatible
 *
 * s-a1-01 is auto-only (no click-reveals).
 * Animation timeline:
 *   0.0s: slide:entered fires
 *   0.2s: countUp 83 starts (1.8s, blur→clear) → ends ~2.0s
 *   1.8s: metrics SplitText+blur reveal
 *   2.8s: guideline paper card scale-up
 *   3.6s: badge activation → Flip flight to case-panel
 *   ~5.0s: all elements visible
 *
 * Captures:
 *   S0: initial (before animations fire)
 *   S1: mid-countUp (~0.8s into animation)
 *   S2: final (all elements visible)
 *   VIDEO: .webm of full animation sequence
 *
 * Two viewports: 1280x720 (presentation) + 1920x1080 (fullscreen)
 *
 * Usage:
 *   node aulas/cirrose/scripts/capture-s-a1-01.mjs
 *   node aulas/cirrose/scripts/capture-s-a1-01.mjs --port 3016
 */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'qa-screenshots', 's-a1-01');

const args = process.argv.slice(2);
const portIdx = args.indexOf('--port');
const PORT = portIdx >= 0 && args[portIdx + 1] ? args[portIdx + 1] : '3016';
const PAGE_URL = `http://localhost:${PORT}/aulas/cirrose/index.html`;

const SLIDE_ID = 's-a1-01';
const SLIDE_INDEX = 2; // title=0, hook=1, a1-01=2
const ANIM_SETTLE_MS = 7000; // R3: CustomEase + DrawSVG laser ~5.5s + buffer

const VIEWPORTS = [
  { width: 1280, height: 720, label: '1280x720' },
  { width: 1920, height: 1080, label: '1920x1080' },
];

async function forceAllVisible(page) {
  // Force ALL elements visible at rest — no blur, no clip, no animation artifacts.
  // Used for S0 so Gate 0 can inspect layout without animation interference.
  await page.evaluate((slideId) => {
    const section = document.querySelector(`#${slideId}`);
    if (!section) return;

    // Kill all active GSAP tweens on this slide
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(section.querySelectorAll('*'));
    }

    // Hero number at "0" (initial display value)
    const heroNum = section.querySelector('.screening-hero-number');
    if (heroNum) heroNum.textContent = '0';

    // Force all opacity:0 elements visible and de-animated
    section.querySelectorAll('[style*="opacity"]').forEach(el => {
      el.style.opacity = '1';
    });
    section.querySelectorAll('.screening-metrics, .guideline-rec, .source-tag').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    });

    // Clear blur/clipPath from metric labels + values
    section.querySelectorAll('.screening-metric-value, .screening-metric-label').forEach(el => {
      el.style.opacity = '1';
      el.style.filter = 'none';
      el.style.clipPath = 'none';
      el.style.webkitClipPath = 'none';
    });

    // SplitText chars visible
    section.querySelectorAll('.slide-headline div, .slide-headline span').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    // Ghost rows visible at rest (no matched/dimmed)
    section.querySelectorAll('.stack-row').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    section.querySelectorAll('.status-dot').forEach(el => {
      el.style.opacity = '1';
    });
  }, SLIDE_ID);
}

async function forceAnimFinalState(page) {
  await page.evaluate((slideId) => {
    const section = document.querySelector(`#${slideId}`);
    if (!section) return;

    // Force hero number to final value
    const heroNum = section.querySelector('.screening-hero-number');
    if (heroNum) heroNum.textContent = '83';

    // Force SplitText chars visible
    section.querySelectorAll('.slide-headline div, .slide-headline span').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    // Force metric values visible
    section.querySelectorAll('.screening-metric-value').forEach(el => {
      el.style.opacity = '1';
      el.style.filter = 'none';
    });

    // Force clip-path labels open
    section.querySelectorAll('.screening-metric-label').forEach(el => {
      el.style.clipPath = 'inset(0 0% 0 0)';
    });

    // Force Ghost Rows visible + matched/dimmed state
    section.querySelectorAll('.stack-row').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      if (el.dataset.match) el.classList.add('matched');
      else el.classList.add('dimmed');
    });

    // Force status dots
    section.querySelectorAll('.status-dot').forEach(el => {
      el.style.opacity = '1';
    });

    // Remove scanner line if present
    section.querySelectorAll('.scanner-line').forEach(el => el.remove());

    // Force all opacity:0 elements visible
    section.querySelectorAll('.screening-metrics, .screening-metric, .guideline-rec, .source-tag').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    });
  }, SLIDE_ID);
}

async function navigateToSlide(page) {
  // Navigate: ArrowRight x SLIDE_INDEX to reach target slide
  for (let i = 0; i < SLIDE_INDEX; i++) {
    await page.keyboard.press('ArrowRight');
    // Wait for transition (400ms CSS) + slide:entered fallback (600ms)
    await page.waitForTimeout(1200);
  }

  // Verify active slide
  const activeId = await page.evaluate(() => {
    const active = document.querySelector('#slide-viewport > section.slide-active');
    return active ? active.id : 'unknown';
  });
  return activeId;
}

async function captureAtViewport(browser, vp) {
  // Video recording requires passing recordVideo at context creation
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: OUT_DIR,
      size: { width: vp.width, height: vp.height },
    },
  });
  const page = await context.newPage();

  console.log(`\n[${vp.label}] Loading ${PAGE_URL}...`);
  await page.goto(PAGE_URL, { waitUntil: 'networkidle' });

  // Wait for deck.js init
  await page.waitForFunction(() => {
    return document.querySelector('#slide-viewport > section.slide-active') !== null;
  }, { timeout: 10000 });
  await page.waitForTimeout(2000);

  // Navigate to target slide
  const activeId = await navigateToSlide(page);
  console.log(`  Active slide: ${activeId}`);

  if (activeId !== SLIDE_ID) {
    console.error(`  ERROR: Expected ${SLIDE_ID}, got ${activeId}. Aborting.`);
    await context.close();
    return null;
  }

  // S0: baseline layout — use forceAnimFinalState for clean defect-free capture
  await page.waitForTimeout(150);
  await forceAnimFinalState(page);
  await page.waitForTimeout(300);
  const s0Path = join(OUT_DIR, `S0-${vp.label}.png`);
  await page.screenshot({ path: s0Path, type: 'png' });
  console.log(`  S0 captured (baseline — forced final state)`);

  // Reload page for clean S1 capture (S0 killed GSAP tweens)
  await page.goto(PAGE_URL, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => {
    return document.querySelector('#slide-viewport > section.slide-active') !== null;
  }, { timeout: 10000 });
  await page.waitForTimeout(2000);
  await navigateToSlide(page);

  // S1: mid-animation (~1s into countUp)
  await page.waitForTimeout(950);
  const s1Path = join(OUT_DIR, `S1-mid-${vp.label}.png`);
  await page.screenshot({ path: s1Path, type: 'png' });
  console.log(`  S1 captured (mid countUp)`);

  // Wait for full animation to complete
  await page.waitForTimeout(ANIM_SETTLE_MS);

  // Force final state
  await forceAnimFinalState(page);
  await page.waitForTimeout(300);

  // S2: final state (all elements visible)
  const s2Path = join(OUT_DIR, `S2-final-${vp.label}.png`);
  await page.screenshot({ path: s2Path, type: 'png' });
  console.log(`  S2 captured (final state — all visible)`);

  // Collect metrics
  const metrics = await page.evaluate((slideId) => {
    const section = document.querySelector(`#${slideId}`);
    if (!section) return null;

    const result = { elements: {} };
    const measure = (name, el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      result.elements[name] = {
        top: Math.round(r.top), left: Math.round(r.left),
        width: Math.round(r.width), height: Math.round(r.height),
        opacity: getComputedStyle(el).opacity,
        fontSize: getComputedStyle(el).fontSize,
      };
    };

    measure('slide-inner', section.querySelector('.slide-inner'));
    measure('section-tag', section.querySelector('.section-tag'));
    measure('headline', section.querySelector('.slide-headline'));
    measure('hero', section.querySelector('.screening-hero'));
    measure('hero-number', section.querySelector('.screening-hero-number'));
    measure('metrics', section.querySelector('.screening-metrics'));
    measure('guideline-rec', section.querySelector('.guideline-rec'));
    measure('source-tag', section.querySelector('.source-tag'));

    // Check source-tag overflow
    const st = section.querySelector('.source-tag');
    if (st) {
      result.sourceTagOverflow = st.scrollWidth > st.clientWidth;
      result.sourceTagScrollWidth = st.scrollWidth;
      result.sourceTagClientWidth = st.clientWidth;
    }

    return result;
  }, SLIDE_ID);

  // saveAs waits for ffmpeg flush — no race condition vs renameSync
  await page.close();
  const video = page.video();
  let videoPath = null;
  if (video) {
    videoPath = join(OUT_DIR, `animation-${vp.label}.webm`);
    await video.saveAs(videoPath);
    console.log(`  Video saved → ${videoPath}`);
  }
  await context.close();

  return { viewport: vp.label, s0: s0Path, s1: s1Path, s2: s2Path, video: videoPath, metrics };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`=== Capture ${SLIDE_ID} ===`);
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
      slideId: SLIDE_ID,
      capturedAt: new Date().toISOString(),
      viewports: results.map(r => ({
        label: r.viewport,
        files: { S0: r.s0, S1: r.s1, S2: r.s2, video: r.video },
        metrics: r.metrics,
      })),
    }, null, 2));
    console.log(`\nMetrics → ${metricsPath}`);
  }

  // Summary
  console.log('\n=== Summary ===');
  for (const r of results) {
    console.log(`${r.viewport}: S0 + S1 + S2 + video → ${OUT_DIR}`);
    if (r.metrics?.sourceTagOverflow) {
      console.log(`  ⚠ source-tag OVERFLOW: scrollW=${r.metrics.sourceTagScrollWidth} > clientW=${r.metrics.sourceTagClientWidth}`);
    } else if (r.metrics) {
      console.log(`  ✓ source-tag fits (scrollW=${r.metrics.sourceTagScrollWidth}, clientW=${r.metrics.sourceTagClientWidth})`);
    }
  }
  console.log(`\nTotal: ${results.length * 3} screenshots + ${results.length} videos`);
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});

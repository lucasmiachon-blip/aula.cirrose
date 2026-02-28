#!/usr/bin/env node
/**
 * QA Screenshots — Cirrose Stage C
 * Batch atual: só hook (2 PNGs)
 * Output: aulas/cirrose/qa-screenshots/stage-c/
 *
 * Usage: npm run qa:screenshots:cirrose
 */
import { chromium } from 'playwright';
import { mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const CIRROSE = join(__dirname, '..');
const OUT_DIR = join(CIRROSE, 'qa-screenshots', 'stage-c');

const PORT = process.env.PORT || 3000;
const PAGE_URL = `http://localhost:${PORT}/aulas/cirrose/index.html`;
const HOOK_BEAT_WAIT_MS = 1200;
const TOTAL_BEATS = 2;

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const f of readdirSync(OUT_DIR)) {
    if (f.endsWith('.png')) unlinkSync(join(OUT_DIR, f));
  }
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  console.log(`Cirrose Stage C — hook only — ${PAGE_URL}\n`);
  await page.goto(PAGE_URL, { waitUntil: 'networkidle' });

  await page.waitForFunction(() => {
    return typeof window.Reveal !== 'undefined'
      && window.Reveal.isReady
      && window.Reveal.isReady();
  }, { timeout: 10000 });

  await page.evaluate(() => window.Reveal.slide(1));
  await page.waitForFunction(() => {
    const s = window.Reveal.getState();
    if (s.indexh !== 1) return false;
    const slide = document.querySelector('#s-hook');
    return slide && typeof slide.__hookAdvance === 'function' && typeof slide.__hookRetreat === 'function';
  }, { timeout: 5000 });
  await page.waitForTimeout(1500);

  const files = [];
  for (let beat = 0; beat < TOTAL_BEATS; beat++) {
    const filename = `02-s-hook-beat-${String(beat).padStart(2, '0')}.png`;
    await page.screenshot({ path: join(OUT_DIR, filename) });
    files.push(filename);
    if (beat < TOTAL_BEATS - 1) {
      await page.evaluate(() => {
        const slide = document.querySelector('#s-hook');
        if (slide && slide.__hookAdvance) slide.__hookAdvance();
      });
      await page.waitForTimeout(HOOK_BEAT_WAIT_MS);
    }
  }

  await browser.close();
  console.log(`\n${files.length} screenshots → aulas/cirrose/qa-screenshots/stage-c/`);
}

main().catch((e) => { console.error(e); process.exit(1); });

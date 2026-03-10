/**
 * Act 1 Surgical QA — targeted tests:
 * 1. s-a1-vote: click interaction (before/after)
 * 2. s-a1-damico: era 2 chromatic verification (pathway stages have bg color)
 * 3. s-hook: beat 0 + beat 1 verification
 * 4. source-tag visibility in final states
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE = 'http://localhost:3000/aulas/cirrose/index.html';
const OUT = join(process.cwd(), 'aulas/cirrose/qa-screenshots/act1-surgical-pass');

async function navigateToSlide(page, targetId, maxPresses = 80) {
  for (let i = 0; i < maxPresses; i++) {
    const currentId = await page.evaluate(() => {
      const active = document.querySelector('section.slide-active');
      return active ? active.id : null;
    });
    if (currentId === targetId) return true;
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(600);
  }
  return false;
}

async function getPathwayStageColors(page) {
  return await page.evaluate(() => {
    const stages = document.querySelectorAll('#s-a1-damico .pathway-stage');
    return Array.from(stages).map((s, i) => {
      const cs = getComputedStyle(s);
      return {
        index: i,
        className: s.className,
        backgroundColor: cs.backgroundColor,
        borderBottom: cs.borderBottom || cs.borderBottomColor,
        hasVisibleBg: cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent',
      };
    });
  });
}

async function getSourceTagState(page, slideId) {
  return await page.evaluate((id) => {
    const section = document.getElementById(id);
    if (!section) return null;
    const st = section.querySelector('.source-tag');
    if (!st) return { exists: false };
    const cs = getComputedStyle(st);
    const rect = st.getBoundingClientRect();
    return {
      exists: true,
      text: st.textContent.trim().substring(0, 120),
      opacity: cs.opacity,
      inlineOpacity: st.style.opacity,
      display: cs.display,
      whiteSpace: cs.whiteSpace,
      overflowWrap: cs.overflowWrap,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      visible: parseFloat(cs.opacity) > 0.5,
    };
  }, slideId);
}

async function getElementRect(page, selector) {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: Math.round(r.width), h: Math.round(r.height), bottom: Math.round(r.bottom) };
  }, selector);
}

(async () => {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  })).newPage();

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', e => errors.push('PAGE: ' + e.message));

  console.log('=== ACT 1 SURGICAL QA ===');
  console.log('Viewport: 1280x720, Chromium headless\n');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('section.slide-active', { timeout: 15000 });
  await page.waitForTimeout(2000);

  const results = [];

  // ──────────────────────────────────────────
  // TEST 1: s-hook — beat 0 + beat 1
  // ──────────────────────────────────────────
  console.log('\n── TEST 1: s-hook ──');
  const hookOk = await navigateToSlide(page, 's-hook');
  if (!hookOk) { console.log('FAIL: could not reach s-hook'); process.exit(1); }
  await page.waitForTimeout(1500);

  // Beat 0 screenshot
  await page.screenshot({ path: join(OUT, 's-hook--beat0.png') });
  const beat0Visible = await page.evaluate(() => {
    const b0 = document.querySelector('#s-hook [data-hook-beat="0"]');
    if (!b0) return false;
    const cs = getComputedStyle(b0);
    return parseFloat(cs.opacity) > 0.5 && !b0.classList.contains('hook-beat--hidden');
  });
  console.log(`  beat0 visible: ${beat0Visible}`);
  results.push({ slide: 's-hook', action: 'beat 0 visible', screenshot: 's-hook--beat0.png', result: beat0Visible ? 'PASS' : 'FAIL' });

  // Click → beat 1
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(2500); // wait for GSAP stagger
  await page.screenshot({ path: join(OUT, 's-hook--beat1.png') });
  const beat1Visible = await page.evaluate(() => {
    const b1 = document.querySelector('#s-hook [data-hook-beat="1"]');
    if (!b1) return false;
    const cs = getComputedStyle(b1);
    const labs = b1.querySelectorAll('.hook-lab');
    let visibleLabs = 0;
    labs.forEach(l => { if (parseFloat(getComputedStyle(l).opacity) > 0.3) visibleLabs++; });
    return { beatActive: !b1.classList.contains('hook-beat--hidden'), labsVisible: visibleLabs, labsTotal: labs.length };
  });
  console.log(`  beat1: ${JSON.stringify(beat1Visible)}`);
  const beat1Pass = beat1Visible && beat1Visible.beatActive && beat1Visible.labsVisible >= 5;
  results.push({ slide: 's-hook', action: 'beat 1 labs revealed', screenshot: 's-hook--beat1.png', result: beat1Pass ? 'PASS' : 'FAIL' });

  // Check beat 1 clipping at 720p
  const hookClip = await page.evaluate(() => {
    const punchline = document.querySelector('#s-hook .hook-punchline');
    if (!punchline) return { clipped: false, note: 'no punchline element' };
    const r = punchline.getBoundingClientRect();
    return { bottom: Math.round(r.bottom), clipped: r.bottom > 720, note: r.bottom > 700 ? 'near edge' : 'ok' };
  });
  console.log(`  punchline bottom: ${hookClip.bottom}px — ${hookClip.note}`);
  results.push({ slide: 's-hook', action: 'beat 1 no clipping', screenshot: 's-hook--beat1.png', result: hookClip.clipped ? 'FAIL (clipped)' : `PASS (${hookClip.note})` });

  // ──────────────────────────────────────────
  // TEST 2: s-a1-vote — click interaction
  // ──────────────────────────────────────────
  console.log('\n── TEST 2: s-a1-vote ──');
  const voteOk = await navigateToSlide(page, 's-a1-vote');
  if (!voteOk) { console.log('FAIL: could not reach s-a1-vote'); process.exit(1); }
  await page.waitForTimeout(1500);

  // State 0: before click
  await page.screenshot({ path: join(OUT, 's-a1-vote--pre-click.png') });
  const preClick = await page.evaluate(() => {
    const reveal = document.querySelector('#s-a1-vote .vote-reveal');
    const cs = reveal ? getComputedStyle(reveal) : null;
    const options = document.querySelectorAll('#s-a1-vote .vote-option');
    return {
      optionsCount: options.length,
      revealHidden: cs ? (parseFloat(cs.opacity) < 0.1 || cs.visibility === 'hidden') : true,
    };
  });
  console.log(`  pre-click: ${preClick.optionsCount} options, reveal hidden: ${preClick.revealHidden}`);
  results.push({ slide: 's-a1-vote', action: 'pre-click: 3 options visible, reveal hidden', screenshot: 's-a1-vote--pre-click.png', result: preClick.optionsCount === 3 && preClick.revealHidden ? 'PASS' : 'FAIL' });

  // Click option B (correct answer: "Sim — suspeita clínica alta")
  const clicked = await page.evaluate(() => {
    const btn = document.querySelector('#s-a1-vote .vote-option[data-vote="B"]');
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (!clicked) {
    // Try via ArrowRight (custom animation hook)
    await page.keyboard.press('ArrowRight');
  }
  await page.waitForTimeout(2500); // wait for countUp + verdict animations

  // State 1: after click
  await page.screenshot({ path: join(OUT, 's-a1-vote--post-click.png') });
  const postClick = await page.evaluate(() => {
    const reveal = document.querySelector('#s-a1-vote .vote-reveal');
    const cs = reveal ? getComputedStyle(reveal) : null;
    const heroNum = document.querySelector('#s-a1-vote .vote-hero-number');
    const verdict = document.querySelector('#s-a1-vote .vote-verdict');
    const explanation = document.querySelector('#s-a1-vote .vote-explanation');
    const optionB = document.querySelector('#s-a1-vote .vote-option[data-vote="B"]');
    const optionA = document.querySelector('#s-a1-vote .vote-option[data-vote="A"]');
    return {
      revealVisible: cs ? (parseFloat(cs.opacity) > 0.5 && cs.visibility !== 'hidden') : false,
      heroValue: heroNum ? heroNum.textContent.trim() : null,
      verdictText: verdict ? verdict.textContent.trim() : null,
      explanationVisible: explanation ? parseFloat(getComputedStyle(explanation).opacity) > 0.3 : false,
      optionBCorrect: optionB ? optionB.classList.contains('vote-option--correct') : false,
      optionADimmed: optionA ? optionA.classList.contains('vote-option--dimmed') : false,
    };
  });
  console.log(`  post-click: reveal visible=${postClick.revealVisible}, hero="${postClick.heroValue}", verdict="${postClick.verdictText}"`);
  console.log(`  option B correct class=${postClick.optionBCorrect}, option A dimmed=${postClick.optionADimmed}`);
  const votePass = postClick.revealVisible && postClick.heroValue && postClick.optionBCorrect;
  results.push({ slide: 's-a1-vote', action: 'post-click: FIB-4 revealed + verdict', screenshot: 's-a1-vote--post-click.png', result: votePass ? 'PASS' : 'FAIL' });

  // ──────────────────────────────────────────
  // TEST 3: s-a1-damico — era 2 chromatic
  // ──────────────────────────────────────────
  console.log('\n── TEST 3: s-a1-damico ──');
  const damicoOk = await navigateToSlide(page, 's-a1-damico');
  if (!damicoOk) { console.log('FAIL: could not reach s-a1-damico'); process.exit(1); }
  await page.waitForTimeout(1500);

  // Era 0 (auto)
  await page.screenshot({ path: join(OUT, 's-a1-damico--era0.png') });
  results.push({ slide: 's-a1-damico', action: 'era 0 (CTP) visible', screenshot: 's-a1-damico--era0.png', result: 'CAPTURED' });

  // Click → era 1 (MELD-Na)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: join(OUT, 's-a1-damico--era1.png') });
  results.push({ slide: 's-a1-damico', action: 'era 1 (MELD-Na) visible', screenshot: 's-a1-damico--era1.png', result: 'CAPTURED' });

  // Click → era 2 (D'Amico pathway)
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(2500); // scaleX + countUp animations

  // Verify chromatic encoding
  const stageColors = await getPathwayStageColors(page);
  console.log(`  pathway stages found: ${stageColors.length}`);
  stageColors.forEach(s => {
    console.log(`    [${s.index}] bg="${s.backgroundColor}" border="${s.borderBottom}" visible=${s.hasVisibleBg}`);
  });
  const allHaveBg = stageColors.length === 4 && stageColors.every(s => s.hasVisibleBg);
  results.push({ slide: 's-a1-damico', action: 'era 2: 4 stages with chromatic bg', screenshot: 's-a1-damico--era2.png', result: allHaveBg ? 'PASS' : 'FAIL' });

  await page.screenshot({ path: join(OUT, 's-a1-damico--era2.png') });

  // Check further-decomp visibility
  const furtherDecomp = await page.evaluate(() => {
    const fd = document.querySelector('#s-a1-damico .damico-further-decomp');
    if (!fd) return null;
    const cs = getComputedStyle(fd);
    const r = fd.getBoundingClientRect();
    return { opacity: cs.opacity, bottom: Math.round(r.bottom), clipped: r.bottom > 720 };
  });
  console.log(`  further-decomp: opacity=${furtherDecomp?.opacity}, bottom=${furtherDecomp?.bottom}px, clipped=${furtherDecomp?.clipped}`);
  results.push({ slide: 's-a1-damico', action: 'era 2: further-decomp visible + not clipped', screenshot: 's-a1-damico--era2.png', result: furtherDecomp && !furtherDecomp.clipped && parseFloat(furtherDecomp.opacity) > 0.5 ? 'PASS' : `RISK (opacity=${furtherDecomp?.opacity}, bottom=${furtherDecomp?.bottom})` });

  // Check source-tag in final state
  const damicoSource = await getSourceTagState(page, 's-a1-damico');
  console.log(`  source-tag: visible=${damicoSource?.visible}, opacity=${damicoSource?.opacity}, whiteSpace=${damicoSource?.whiteSpace}, w=${damicoSource?.width}px`);
  results.push({ slide: 's-a1-damico', action: 'source-tag visible in final state', screenshot: 's-a1-damico--era2.png', result: damicoSource?.visible ? 'PASS' : `WAIT (opacity=${damicoSource?.opacity})` });

  // Check horizontal scroll
  const hScroll = await page.evaluate(() => {
    return { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth };
  });
  console.log(`  hScroll: scrollW=${hScroll.scrollWidth} clientW=${hScroll.clientWidth}`);
  results.push({ slide: 's-a1-damico', action: 'no horizontal scroll', screenshot: 'n/a', result: hScroll.scrollWidth <= hScroll.clientWidth + 2 ? 'PASS' : 'FAIL' });

  // ──────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────
  console.log('\n\n=== RESULTS TABLE ===');
  console.log('slide | action | screenshot | result');
  console.log('-'.repeat(100));
  results.forEach(r => {
    console.log(`${r.slide} | ${r.action} | ${r.screenshot} | ${r.result}`);
  });

  const failures = results.filter(r => r.result === 'FAIL');
  const warnings = results.filter(r => r.result.startsWith('RISK') || r.result.startsWith('WAIT'));
  console.log(`\nPASS: ${results.filter(r => r.result === 'PASS').length}`);
  console.log(`CAPTURED: ${results.filter(r => r.result === 'CAPTURED').length}`);
  console.log(`FAIL: ${failures.length}`);
  console.log(`RISK/WAIT: ${warnings.length}`);

  if (errors.length) {
    console.log(`\n⚠ Console errors: ${errors.length}`);
    errors.slice(0, 5).forEach(e => console.log(`  ${e.substring(0, 150)}`));
  } else {
    console.log('Zero console errors');
  }

  await browser.close();
  process.exit(failures.length > 0 ? 1 : 0);
})();

import { chromium } from 'playwright';

const BASE = 'http://localhost:3000/aulas/cirrose/preview.html';
const CRITICAL_SLIDES = [
  '00-title',
  '02-a1-continuum',
  '04-a1-meld',
  '07-cp1',
  '14-cp2',
  '18-cp3',
  '19-close',
];

const browser = await chromium.launch();
const results = [];

for (const slide of CRITICAL_SLIDES) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto(`${BASE}?slide=${slide}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const revealOk = await page.evaluate(() => !!window.Reveal?.isReady?.());
  const panelOk = await page.evaluate(() => !!document.getElementById('case-panel'));
  const sectionOk = await page.evaluate(() => !!document.querySelector('.slides > section'));

  results.push({
    slide,
    loaded: sectionOk,
    reveal: revealOk,
    panel: panelOk,
    errors: errors.length ? errors.join(' | ') : '—'
  });

  await page.close();
}

await browser.close();

console.table(results);
const failures = results.filter(r => !r.loaded || !r.reveal || r.errors !== '—');
if (failures.length) {
  console.error(`\n${failures.length} FAILURES — fix before proceeding`);
  process.exit(1);
} else {
  console.log('\n✓ All critical slides load correctly in preview harness');
}

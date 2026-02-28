/**
 * migrate-osteoporose-slides.js — Converte slides Aulas_core OSTEOPOROSE → aulas-magnas
 * Run: node scripts/migrate-osteoporose-slides.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, '..', 'Aulas_core', 'OSTEOPOROSE', 'src', 'slides');
const TARGET = path.join(ROOT, 'aulas', 'osteoporose', 'slides');

// Full order from _list.txt (46 main + 25 appendix = 71)
const FULL_ORDER = [
  'S01_slide-01.html', 'S02_slide-02.html', 'S03_slide-03.html', 'S04_slide-04.html', 'S05_slide-05.html',
  'S06_slide-06.html', 'S12_slide-12.html', 'S13_slide-13.html', 'S17_slide-17.html', 'S14_slide-14.html',
  'S19_slide-19.html', 'S14b_slide-14b.html', 'S23_slide-23.html', 'S22_slide-22.html', 'S24_slide-24.html',
  'S25_slide-25.html', 'S26_slide-26.html', 'S28_slide-28.html', 'S29_slide-29.html', 'S30_slide-30.html',
  'S31_slide-31.html', 'S73_slide-73.html', 'S74_slide-74.html', 'S75_slide-75.html', 'S32_slide-32.html',
  'S33_slide-33.html', 'S35_slide-35.html', 'S08_slide-08.html', 'S08b_slide-08b.html', 'S36_slide-36.html',
  'S37_slide-37.html', 'S38_slide-38.html', 'S39_slide-39.html', 'S40_slide-40.html', 'S41_slide-41.html',
  'S42_slide-42.html', 'S43_slide-43.html', 'S44_slide-44.html', 'S47_slide-47.html', 'S46_slide-46.html',
  'S48_slide-48.html', 'S49_slide-49.html', 'S50_slide-50.html', 'S45_slide-45.html', 'S99_slide-closing.html',
  'S09_slide-09.html', 'S10_slide-10.html', 'S11_slide-11.html', 'S51_slide-51.html', 'S52_slide-52.html',
  'S53_slide-53.html', 'S54_slide-54.html', 'S55_slide-55.html', 'S56_slide-56.html', 'S57_slide-57.html',
  'S58_slide-58.html', 'S59_slide-59.html', 'S60_slide-60.html', 'S61_slide-61.html', 'S62_slide-62.html',
  'S63_slide-63.html', 'S64_slide-64.html', 'S65_slide-65.html', 'S66_slide-66.html', 'S67_slide-67.html',
  'S68_slide-68.html', 'S69_slide-69.html', 'S70_slide-70.html', 'S71_slide-71.html', 'S72_slide-72.html'
];

const ENTITIES = {
  '&ccedil;': 'ç', '&atilde;': 'ã', '&eacute;': 'é', '&ecirc;': 'ê', '&iacute;': 'í',
  '&oacute;': 'ó', '&uacute;': 'ú', '&agrave;': 'à', '&acirc;': 'â', '&otilde;': 'õ',
  '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–', '&rarr;': '→', '&bull;': '•',
  '&ldquo;': '"', '&rdquo;': '"', '&lsquo;': "'", '&rsquo;': "'"
};

function toSlideId(filename) {
  const m = filename.match(/S(\d+[a-z]?)_slide/);
  return m ? `s-${m[1]}` : 's-01';
}

function convert(html, slideId) {
  let out = html;

  const sectionMatch = out.match(/<section[^>]*>([\s\S]*?)<\/section>/);
  const inner = sectionMatch ? sectionMatch[1] : out;

  out = `<section id="${slideId}" data-background-color="var(--bg-navy)">\n  <div class="slide-inner archetype-comparison">\n${inner}\n  </div>\n  <aside class="notes">[TBD]</aside>\n</section>`;

  out = out.replace(/rgba\(var\(--navy-rgb\),\s*([\d.]+)\)/g, 'oklch(22% 0.042 258 / $1)');
  out = out.replace(/rgba\(var\(--teal-rgb\),\s*([\d.]+)\)/g, 'oklch(40% 0.12 170 / $1)');
  out = out.replace(/rgba\(var\(--gold-rgb\),\s*([\d.]+)\)/g, 'oklch(60% 0.13 85 / $1)');
  out = out.replace(/rgba\(var\(--red-rgb\),\s*([\d.]+)\)/g, 'oklch(50% 0.18 25 / $1)');

  out = out.replace(/\bvar\(--navy\)/g, 'var(--text-on-dark)');
  out = out.replace(/\bvar\(--teal\)/g, 'var(--safe)');
  out = out.replace(/\bvar\(--gold\)/g, 'var(--warning)');
  out = out.replace(/\bvar\(--red\)/g, 'var(--danger)');
  out = out.replace(/\bvar\(--white\)/g, 'var(--text-on-dark)');

  out = out.replace(/<h2([^>]*)>/g, '<h2 class="slide-headline"$1>');

  out = out.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (_, body) => {
    const items = body.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '<p style="margin:0 0 0.3rem 0;">$1</p>');
    return `<div style="display:flex;flex-direction:column;gap:0.3rem;">${items}</div>`;
  });
  out = out.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (_, body) => {
    const items = body.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '<p style="margin:0 0 0.3rem 0;">$1</p>');
    return `<div style="display:flex;flex-direction:column;gap:0.3rem;">${items}</div>`;
  });

  for (const [ent, char] of Object.entries(ENTITIES)) {
    out = out.replace(new RegExp(ent, 'g'), char);
  }

  return out;
}

function main() {
  let fileNum = 1;
  const manifestEntries = [];

  for (const filename of FULL_ORDER) {
    const srcFile = path.join(SOURCE, filename);
    if (!fs.existsSync(srcFile)) {
      console.warn(`Skip ${filename}: file not found`);
      continue;
    }
    const html = fs.readFileSync(srcFile, 'utf8');
    const slideId = toSlideId(filename);
    const converted = convert(html, slideId);
    const targetFile = path.join(TARGET, `${String(fileNum).padStart(2, '0')}.html`);
    fs.writeFileSync(targetFile, converted, 'utf8');
    console.log(`${filename} → ${path.basename(targetFile)} (${slideId})`);
    manifestEntries.push({ id: slideId, file: `${String(fileNum).padStart(2, '0')}.html` });
    fileNum++;
  }

  const manifest = `/**
 * _manifest.js — Source of truth para ordem Osteoporose
 * 71 slides (46 main + 25 appendix)
 */

export const slides = [
${manifestEntries.map(e => `  { id: '${e.id}', file: '${e.file}', archetype: 'comparison', headline: '', panelState: null },`).join('\n')}
];
`;
  fs.writeFileSync(path.join(TARGET, '_manifest.js'), manifest, 'utf8');
  console.log(`Done. ${fileNum - 1} slides + _manifest.js`);
}

main();

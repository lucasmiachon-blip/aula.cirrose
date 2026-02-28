/**
 * migrate-grade-slides.js — Converte slides Aulas_core GRADE → aulas-magnas
 * Run: node scripts/migrate-grade-slides.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, '..', 'Aulas_core', 'GRADE', 'src', 'slides');
const TARGET = path.join(ROOT, 'aulas', 'grade', 'slides');

const REMAINING_ORDER = [
  'S07', 'S61', 'S14', 'S43', 'S44', 'S63', 'S19', 'S47', 'S17', 'S18', 'S62', 'S64',
  'S45', 'S50', 'S51', 'S52', 'S53', 'S54', 'S54b', 'S55', 'S56', 'S48', 'S65', 'S59',
  'S57', 'S58', 'S04', 'S22', 'S23', 'S24', 'S25', 'S26', 'S27', 'S28', 'S29', 'S30',
  'S31', 'S32', 'S33', 'S34', 'S35', 'S37', 'S38', 'S12', 'S39', 'S40', 'S41', 'S42'
];

const ENTITIES = {
  '&ccedil;': 'ç', '&atilde;': 'ã', '&eacute;': 'é', '&ecirc;': 'ê', '&iacute;': 'í',
  '&oacute;': 'ó', '&uacute;': 'ú', '&agrave;': 'à', '&acirc;': 'â', '&otilde;': 'õ',
  '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–', '&rarr;': '→', '&bull;': '•',
  '&ldquo;': '"', '&rdquo;': '"', '&lsquo;': "'", '&rsquo;': "'",
  '&#9733;': '★', '&#9888;': '⚠', '&#10004;': '✓', '&#8853;': '⊕', '&#9675;': '○'
};

function convert(html, slideId) {
  let out = html;

  // Extract inner content (between section tags)
  const sectionMatch = out.match(/<section[^>]*>([\s\S]*?)<\/section>/);
  const inner = sectionMatch ? sectionMatch[1] : out;

  // Replace section
  const id = slideId.toLowerCase().replace('s', 's-');
  out = `<section id="${id}" data-background-color="var(--bg-navy)">\n  <div class="slide-inner archetype-comparison">\n${inner}\n  </div>\n  <aside class="notes">[TBD]</aside>\n</section>`;

  // Token replacements
  out = out.replace(/rgba\(var\(--navy-rgb\),\s*([\d.]+)\)/g, 'oklch(22% 0.042 258 / $1)');
  out = out.replace(/rgba\(var\(--teal-rgb\),\s*([\d.]+)\)/g, 'oklch(40% 0.12 170 / $1)');
  out = out.replace(/rgba\(var\(--red-rgb\),\s*([\d.]+)\)/g, 'oklch(50% 0.18 25 / $1)');
  out = out.replace(/rgba\(var\(--text-rgb\),\s*([\d.]+)\)/g, 'oklch(13% 0.02 258 / $1)');
  out = out.replace(/rgba\(var\(--terra-rgb\),\s*([\d.]+)\)/g, 'oklch(45% 0.08 55 / $1)');

  out = out.replace(/\bvar\(--navy\)/g, 'var(--text-on-dark)');
  out = out.replace(/\bvar\(--teal\)/g, 'var(--safe)');
  out = out.replace(/\bvar\(--red\)/g, 'var(--danger)');
  out = out.replace(/\bvar\(--gold\)/g, 'var(--warning)');

  out = out.replace(/\bvar\(--muted\)/g, 'var(--text-on-dark-muted)');
  out = out.replace(/\bvar\(--text\)/g, 'var(--text-on-dark)');
  out = out.replace(/\bvar\(--white\)/g, 'var(--text-on-dark)');

  out = out.replace(/\bvar\(--fs-inline-body\)/g, 'var(--text-body)');
  out = out.replace(/\bvar\(--fs-inline-micro\)/g, 'var(--text-caption)');

  out = out.replace(/\bclass="label-gold"/g, 'class="section-tag"');
  out = out.replace(/<h2([^>]*)>/g, '<h2 class="slide-headline"$1>');

  // ul/ol to div
  out = out.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (_, body) => {
    const items = body.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '<p style="margin:0 0 0.3rem 0;">$1</p>');
    return `<div style="display:flex;flex-direction:column;gap:0.3rem;">${items}</div>`;
  });
  out = out.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (_, body) => {
    const items = body.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '<p style="margin:0 0 0.3rem 0;">$1</p>');
    return `<div style="display:flex;flex-direction:column;gap:0.3rem;">${items}</div>`;
  });

  // HTML entities
  for (const [ent, char] of Object.entries(ENTITIES)) {
    out = out.replace(new RegExp(ent, 'g'), char);
  }

  // class ref/source
  out = out.replace(/\bclass="ref"/g, 'class="source-tag"');
  out = out.replace(/\bclass="source"/g, 'class="source-tag"');

  return out;
}

function main() {
  let fileNum = 11;
  for (const slideId of REMAINING_ORDER) {
    const srcFile = path.join(SOURCE, `${slideId}.html`);
    if (!fs.existsSync(srcFile)) {
      console.warn(`Skip ${slideId}: file not found`);
      continue;
    }
    const html = fs.readFileSync(srcFile, 'utf8');
    const converted = convert(html, slideId);
    const targetFile = path.join(TARGET, `${String(fileNum).padStart(2, '0')}.html`);
    fs.writeFileSync(targetFile, converted, 'utf8');
    console.log(`${slideId} → ${path.basename(targetFile)}`);
    fileNum++;
  }
  console.log(`Done. ${fileNum - 11} slides created.`);
}

main();

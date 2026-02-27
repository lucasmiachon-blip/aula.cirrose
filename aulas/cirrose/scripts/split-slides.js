/**
 * Split index.stage-c.html into individual slide files.
 * Maps each <section id="..."> to its manifest filename by ID (not index).
 * Run: node scripts/split-slides.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.stage-c.html');
const slidesDir = path.join(root, 'slides');
const manifestPath = path.join(slidesDir, '_manifest.js');

const html = fs.readFileSync(htmlPath, 'utf8');

const slidesMatch = html.match(/<div class="slides">([\s\S]*?)<\/div>\s*<\/div>\s*<script/);
if (!slidesMatch) throw new Error('Could not find slides container');
const slidesContent = slidesMatch[1];

const sectionRe = /<section id="(s-[^"]+)"([^>]*)>([\s\S]*?)<\/section>/g;
const sections = [];
let m;
while ((m = sectionRe.exec(slidesContent)) !== null) {
  sections.push({ id: m[1], attrs: m[2].trim(), body: m[3] });
}

const manifest = fs.readFileSync(manifestPath, 'utf8');
const idToFile = new Map();
const idRe = /id:\s*'(s-[^']+)',\s*file:\s*'([^']+)'/g;
let match;
while ((match = idRe.exec(manifest)) !== null) {
  idToFile.set(match[1], match[2]);
}

if (sections.length !== idToFile.size) {
  console.warn(`Warning: ${sections.length} sections in HTML vs ${idToFile.size} in manifest`);
}

if (!fs.existsSync(slidesDir)) fs.mkdirSync(slidesDir, { recursive: true });

let written = 0;
for (const sec of sections) {
  const filename = idToFile.get(sec.id);
  if (!filename) {
    console.warn(`No manifest entry for section id="${sec.id}", skipping`);
    continue;
  }
  const attrs = sec.attrs ? ' ' + sec.attrs : '';
  const content = `<section id="${sec.id}"${attrs}>${sec.body}</section>`;
  fs.writeFileSync(path.join(slidesDir, filename), content.trim() + '\n', 'utf8');
  console.log(`Written ${filename} (${sec.id})`);
  written++;
}

console.log(`\nDone. ${written}/${sections.length} slides extracted.`);

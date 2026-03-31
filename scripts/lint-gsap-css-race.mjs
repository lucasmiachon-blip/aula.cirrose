#!/usr/bin/env node
/**
 * GSAP/CSS Race Condition Detector v1
 *
 * Detects potential race conditions where GSAP inline styles (max specificity)
 * compete with CSS classes that control the same properties.
 *
 * GSAP rule: GSAP controls layout props (opacity, transform). CSS controls
 * paint props (background, border, filter). NEVER compete. (ERRO-054)
 *
 * Usage:
 *   node scripts/lint-gsap-css-race.mjs
 *
 * v1: all findings are WARNING (exit 0). Calibrate with real rounds before promoting.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const aulaDir = join(root, 'aulas', 'cirrose');

let warnings = 0;

function warn(msg) {
  console.warn(`  \u26a0\ufe0f  [RACE] ${msg}`);
  warnings++;
}

function info(msg) {
  console.log(`  \u2139\ufe0f  ${msg}`);
}

// ============================================
// Config: files to scan
// ============================================
const JS_FILES = [
  join(aulaDir, 'slide-registry.js'),
  join(aulaDir, 'shared', 'js', 'engine.js'),
  join(aulaDir, 'shared', 'js', 'click-reveal.js'),
  join(aulaDir, 'shared', 'js', 'case-panel.js'),
];

const CSS_FILES = [
  join(aulaDir, 'cirrose.css'),
  join(aulaDir, 'archetypes.css'),
  join(aulaDir, 'shared', 'css', 'base.css'),
];

// Properties that cause race conditions when both GSAP and CSS control them
const RACE_PROPS = new Set([
  'opacity', 'transform', 'scale', 'filter',
]);

// GSAP shorthand → normalized CSS property
const GSAP_TO_CSS = {
  opacity: 'opacity',
  y: 'transform', x: 'transform',
  rotation: 'transform', rotationX: 'transform', rotationY: 'transform',
  scale: 'transform', scaleX: 'transform', scaleY: 'transform',
  skewX: 'transform', skewY: 'transform',
  filter: 'filter',
};

// GSAP meta-keys (not CSS properties)
const GSAP_META = new Set([
  'duration', 'delay', 'ease', 'stagger', 'onUpdate', 'onComplete', 'onStart',
  'repeat', 'yoyo', 'transformPerspective', 'overwrite', 'reversed', 'paused',
  'immediateRender', 'lazy', 'id', 'data', 'callbackScope', 'onRepeat',
  'onReverseComplete', 'startAt', 'keyframes', 'repeatDelay', 'repeatRefresh',
]);

// CSS selector contexts to EXCLUDE (legitimate failsafes)
const EXCLUDED_ANCESTORS = ['.no-js', '.stage-bad', '.high-contrast'];

function shortPath(p) {
  return p.replace(root + '\\', '').replace(root + '/', '').replace(/\\/g, '/');
}

// ============================================
// Phase 1: Parse JS
// ============================================

/**
 * Extract slide ID boundaries from slide-registry.js
 * Pattern: 's-xxx': (slide, gsap) => {
 */
function buildSlideRanges(lines) {
  const ranges = [];
  const re = /^\s*'(s-[\w-]+)':\s*\(/;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (m) {
      if (ranges.length > 0) ranges[ranges.length - 1].end = i - 1;
      ranges.push({ id: m[1], start: i, end: lines.length - 1 });
    }
  }
  return ranges;
}

function getSlideId(lineNum, ranges) {
  for (const r of ranges) {
    if (lineNum >= r.start && lineNum <= r.end) return r.id;
  }
  return null;
}

/**
 * Extract GSAP animated properties from a { ... } block starting at startIdx in text.
 * Lightweight brace-balanced scanner.
 */
function extractGsapProps(text, startIdx) {
  const props = [];
  let depth = 0;
  let i = startIdx;
  let foundOpen = false;

  // Find the first { after startIdx
  while (i < text.length && text[i] !== '{') i++;
  if (i >= text.length) return props;

  depth = 1;
  i++; // skip opening {
  foundOpen = true;

  // Extract keys at depth 1
  let keyStart = i;
  let inString = false;
  let stringChar = '';

  while (i < text.length && depth > 0) {
    const ch = text[i];

    if (inString) {
      if (ch === stringChar && text[i - 1] !== '\\') inString = false;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      i++;
      continue;
    }

    if (ch === '{') { depth++; i++; continue; }
    if (ch === '}') {
      depth--;
      if (depth === 0) break;
      i++;
      continue;
    }

    // At depth 1, look for key: pattern
    if (depth === 1 && ch === ':') {
      // Extract the key before this colon
      const before = text.slice(keyStart, i).trim();
      // Get last word (handles cases like newlines, commas before key)
      const keyMatch = before.match(/(\w+)\s*$/);
      if (keyMatch) {
        const key = keyMatch[1];
        if (!GSAP_META.has(key)) {
          const cssP = GSAP_TO_CSS[key];
          if (cssP && RACE_PROPS.has(cssP)) {
            props.push(cssP);
          }
        }
      }
    }

    if (depth === 1 && (ch === ',' || ch === '\n')) {
      keyStart = i + 1;
    }

    i++;
  }

  return [...new Set(props)];
}

/**
 * Parse a JS file for GSAP calls, classList toggles, and querySelector mappings.
 */
function parseJsFile(filePath) {
  let content;
  try { content = readFileSync(filePath, 'utf8'); } catch { return { gsapCalls: [], classToggles: [] }; }

  const lines = content.split('\n');
  const fname = shortPath(filePath);
  const isRegistry = filePath.includes('slide-registry');
  const slideRanges = isRegistry ? buildSlideRanges(lines) : [];

  const gsapCalls = [];
  const classToggles = [];
  const directStyles = [];

  // GSAP call regex: gsap.to|from|fromTo|set or tl.to|from|fromTo|set
  const reGsap = /(?:gsap|tl\d?)\.(to|from|fromTo|set)\s*\(/g;
  // classList toggle regex
  const reClass = /\.classList\.(add|toggle|remove)\(\s*['"]([^'"]+)['"]/g;
  // Direct style assignment
  const reStyle = /\.style\.(opacity|transform|scale)\s*=/g;

  // Process line by line for line numbers, but use full content for brace scanning
  let charOffset = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const slideId = isRegistry ? getSlideId(i, slideRanges) : null;

    // GSAP calls
    let m;
    reGsap.lastIndex = 0;
    while ((m = reGsap.exec(line)) !== null) {
      const method = m[1];
      // For fromTo, there are 2 prop objects. We scan from the match position in full content.
      const globalPos = charOffset + m.index;
      // Find the opening paren, skip target arg, then extract props
      let parenPos = content.indexOf('(', globalPos + m[0].length - 1);
      if (parenPos < 0) continue;

      let props = [];
      if (method === 'fromTo') {
        // fromTo(target, { from }, { to }) — extract both
        const fromProps = extractGsapProps(content, parenPos + 1);
        // Find second object: skip past first { } block
        let afterFirst = parenPos + 1;
        let d = 0;
        while (afterFirst < content.length) {
          if (content[afterFirst] === '{') { d++; }
          if (content[afterFirst] === '}') { d--; if (d === 0) { afterFirst++; break; } }
          afterFirst++;
        }
        const toProps = extractGsapProps(content, afterFirst);
        props = [...new Set([...fromProps, ...toProps])];
      } else {
        // to/from/set(target, { props })
        props = extractGsapProps(content, parenPos + 1);
      }

      if (props.length > 0) {
        gsapCalls.push({ file: fname, line: lineNum, method, props, slideId });
      }
    }

    // classList toggles
    reClass.lastIndex = 0;
    while ((m = reClass.exec(line)) !== null) {
      classToggles.push({
        file: fname, line: lineNum,
        action: m[1], className: m[2], slideId,
      });
    }

    // Direct style assignments (Detector B)
    reStyle.lastIndex = 0;
    while ((m = reStyle.exec(line)) !== null) {
      directStyles.push({ file: fname, line: lineNum, prop: m[1] });
    }

    charOffset += line.length + 1; // +1 for \n
  }

  return { gsapCalls, classToggles, directStyles };
}

// ============================================
// Phase 2: Parse CSS
// ============================================

/**
 * Parse a CSS file, extracting rules with race-prone properties.
 * Tags each rule with context (normal vs excluded).
 */
function parseCssFile(filePath) {
  let content;
  try { content = readFileSync(filePath, 'utf8'); } catch { return { rules: [], excludedCount: 0 }; }

  const lines = content.split('\n');
  const fname = shortPath(filePath);
  const rules = [];
  let excludedCount = 0;

  // Context tracking
  let currentSelector = '';
  let braceDepth = 0;
  let inExcluded = false;       // inside an excluded context
  let inKeyframes = false;
  let inPrint = false;
  let inReducedMotion = false;
  let excludedDepth = 0;        // brace depth when excluded context started
  let selectorLines = [];       // track selector start lines

  // Stack for nested @-rules
  const contextStack = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmed = line.trim();

    // Skip comments (simplified — doesn't handle multi-line perfectly but good enough)
    if (trimmed.startsWith('/*') || trimmed.startsWith('//')) continue;

    // Detect @keyframes
    if (/@keyframes\s/.test(trimmed)) {
      contextStack.push({ type: 'keyframes', depth: braceDepth });
      inKeyframes = true;
    }

    // Detect @media print
    if (/@media\s[^{]*print/.test(trimmed)) {
      contextStack.push({ type: 'print', depth: braceDepth });
      inPrint = true;
    }

    // Detect @media (prefers-reduced-motion)
    if (/@media\s[^{]*prefers-reduced-motion/.test(trimmed)) {
      contextStack.push({ type: 'reduced-motion', depth: braceDepth });
      inReducedMotion = true;
    }

    // Count braces
    for (const ch of trimmed) {
      if (ch === '{') {
        braceDepth++;
      } else if (ch === '}') {
        braceDepth--;
        // Check if we're leaving a context
        while (contextStack.length > 0 && braceDepth <= contextStack[contextStack.length - 1].depth) {
          const ctx = contextStack.pop();
          if (ctx.type === 'keyframes') inKeyframes = false;
          if (ctx.type === 'print') inPrint = false;
          if (ctx.type === 'reduced-motion') inReducedMotion = false;
        }
      }
    }

    // Detect selectors (lines that end with { or contain { at non-zero depth)
    if (trimmed.includes('{') && !trimmed.startsWith('@')) {
      currentSelector = trimmed.split('{')[0].trim();
    }

    // Check if current selector is in excluded context
    const isExcludedSelector = EXCLUDED_ANCESTORS.some(a => currentSelector.includes(a));
    const isDataAnimateInit = /\[data-animate/.test(currentSelector);
    const isExcluded = inKeyframes || inPrint || inReducedMotion || isExcludedSelector || isDataAnimateInit;

    // Check for race-prone properties
    const propMatch = trimmed.match(/^\s*(opacity|transform|scale|filter)\s*:/);
    if (propMatch && braceDepth > 0) {
      const prop = propMatch[1];
      if (isExcluded) {
        excludedCount++;
      } else {
        // Extract class names from selector
        const classes = [];
        const reClass = /\.([\w][\w-]*)/g;
        let cm;
        while ((cm = reClass.exec(currentSelector)) !== null) {
          classes.push(cm[1]);
        }

        rules.push({
          file: fname, line: lineNum,
          selector: currentSelector,
          property: prop,
          classes,
        });
      }
    }
  }

  return { rules, excludedCount };
}

// ============================================
// Phase 3: Cross-Reference
// ============================================

/**
 * Detector A: Class-State Race
 * CSS class sets a property + that class is toggled in JS + GSAP animates same property
 */
function detectClassStateRaces(cssRules, classToggles, gsapCalls) {
  const findings = [];

  // Build set of toggled class names
  const toggledClasses = new Set(classToggles.map(ct => ct.className));

  for (const rule of cssRules) {
    // Check if any class in this selector is toggled in JS
    const matchedClasses = rule.classes.filter(c => toggledClasses.has(c));
    if (matchedClasses.length === 0) continue;

    // Check if GSAP animates the same property anywhere
    // (could refine by matching slide scope, but v1 keeps it simple)
    const conflictingGsap = gsapCalls.filter(gc => gc.props.includes(rule.property));

    if (conflictingGsap.length > 0) {
      // Pick the first GSAP call as representative
      const gsap = conflictingGsap[0];
      const toggleInfo = classToggles.find(ct => matchedClasses.includes(ct.className));

      findings.push({
        cssFile: rule.file,
        cssLine: rule.line,
        cssSelector: rule.selector,
        cssProp: rule.property,
        className: matchedClasses[0],
        gsapFile: gsap.file,
        gsapLine: gsap.line,
        gsapSlide: gsap.slideId,
        toggleFile: toggleInfo?.file,
        toggleLine: toggleInfo?.line,
      });
    }
  }

  return findings;
}

/**
 * Detector B: Direct style= assignment
 * JS sets element.style.opacity/transform directly (persists until cleared)
 */
function detectDirectStyles(directStyles) {
  return directStyles;
}

// ============================================
// Phase 4: Report
// ============================================

console.log('');
console.log('  GSAP/CSS Race Detector v1');
console.log('  ========================');
console.log('');

// Parse JS files
const allGsapCalls = [];
const allClassToggles = [];
const allDirectStyles = [];

console.log('  -- Scanning JS --');
for (const f of JS_FILES) {
  const { gsapCalls, classToggles, directStyles } = parseJsFile(f);
  allGsapCalls.push(...gsapCalls);
  allClassToggles.push(...classToggles);
  allDirectStyles.push(...directStyles);
  console.log(`  ${shortPath(f)}: ${gsapCalls.length} gsap calls, ${classToggles.length} class toggles`);
}

// Parse CSS files
const allCssRules = [];
let totalExcluded = 0;

console.log('');
console.log('  -- Scanning CSS --');
for (const f of CSS_FILES) {
  const { rules, excludedCount } = parseCssFile(f);
  allCssRules.push(...rules);
  totalExcluded += excludedCount;
  console.log(`  ${shortPath(f)}: ${rules.length} race-prone rules (${excludedCount} excluded)`);
}

// Detector A
console.log('');
console.log('  -- Detector A: Class-State Races --');
const raceFindings = detectClassStateRaces(allCssRules, allClassToggles, allGsapCalls);

if (raceFindings.length === 0) {
  console.log('  \u2705 No class-state race conditions detected');
} else {
  for (const f of raceFindings) {
    warn(
      `${f.cssFile}:${f.cssLine} \u2194 ${f.gsapFile}:${f.gsapLine}\n` +
      `       .${f.className} sets ${f.cssProp} (${f.cssSelector}),` +
      ` GSAP also animates ${f.cssProp}` +
      (f.gsapSlide ? ` in ${f.gsapSlide}` : '') +
      `\n       Fix: move ${f.cssProp} control to GSAP only, or CSS only`
    );
  }
}

// Detector B
console.log('');
console.log('  -- Detector B: Direct style= assignments --');
const styleFindings = detectDirectStyles(allDirectStyles);

if (styleFindings.length === 0) {
  console.log('  \u2705 No direct style assignments found');
} else {
  for (const s of styleFindings) {
    info(`[STYLE] ${s.file}:${s.line} \u2014 style.${s.prop} set directly (persists until cleared)`);
  }
}

// Summary
console.log('');
console.log(`  -- Excluded (legitimate) --`);
console.log(`  \u2705 ${totalExcluded} .no-js/.stage-bad/print/keyframes/reduced-motion rules excluded`);
console.log('');

if (warnings === 0) {
  console.log('  \u2705 [PASS] 0 potential CSS/GSAP race conditions found');
} else {
  console.log(`  \u26a0\ufe0f  ${warnings} potential race condition(s) found`);
}

console.log('');
process.exit(0); // v1: always exit 0 — calibrate before promoting

#!/usr/bin/env node
/**
 * Gemini CLI wrapper — calls Gemini 3.1 Pro via Google AI SDK.
 *
 * Text mode (backward compatible):
 *   node scripts/gemini.mjs "your prompt here"
 *   echo "prompt" | node scripts/gemini.mjs --stdin
 *   node scripts/gemini.mjs --file prompt.txt
 *   node scripts/gemini.mjs --system "you are X" "prompt"
 *
 * Slide audit mode (auto-fills gemini-slide-editor.md template):
 *   node scripts/gemini.mjs --slide s-a1-classify --css cirrose.css --png screenshot.png
 *   node scripts/gemini.mjs --slide s-a1-classify --css cirrose.css --png s0.png --png s1.png --video anim.mp4
 *
 * Env: GEMINI_API_KEY must be set.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, basename, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const MODEL = "gemini-3.1-pro-preview";
const AUDIT_DIR = resolve(ROOT, ".audit");
const TEMPLATE_PATH = resolve(ROOT, "docs/prompts/gemini-slide-editor.md");

/* ─── MIME map ─── */

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

/* ─── CLI ─── */

function usage() {
  console.error(`Usage:
  Text mode:
    node scripts/gemini.mjs "prompt"
    node scripts/gemini.mjs --file prompt.txt
    echo "prompt" | node scripts/gemini.mjs --stdin
    node scripts/gemini.mjs --json "prompt"           (force JSON output)
    node scripts/gemini.mjs --temp 0.3 "prompt"       (set temperature)

  Slide audit mode:
    node scripts/gemini.mjs --slide ID --css FILE --png FILE [--video FILE]

  Options:
    --slide ID       Slide ID → auto-fills gemini-slide-editor.md template
    --aula NAME      Aula name (default: cirrose)
    --css FILE       CSS file (relative to aula dir or absolute)
    --png FILE       Screenshot PNG (repeatable for multiple states)
    --video FILE     Video MP4/WebM (uploaded via File API)
    --context "..."  Context paragraph for template
    --round "..."    Round context for template
    --output FILE    Save response JSON to custom path
    --system "..."   System instruction (text mode only)
    --json           Force JSON response MIME
    --temp N         Temperature
    --help           This message`);
  process.exit(1);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8").trim();
}

function parseArgs(argv) {
  const opts = {
    prompt: "",
    slide: null,
    aula: "cirrose",
    css: null,
    pngs: [],
    video: null,
    context: "",
    round: "Primeira rodada — sem mudanças prévias.",
    output: null,
    system: undefined,
    json: false,
    temp: undefined,
    stdin: false,
    file: null,
  };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--stdin":   opts.stdin = true; break;
      case "--file":    opts.file = argv[++i]; break;
      case "--slide":   opts.slide = argv[++i]; break;
      case "--aula":    opts.aula = argv[++i]; break;
      case "--css":     opts.css = argv[++i]; break;
      case "--png":     opts.pngs.push(argv[++i]); break;
      case "--video":   opts.video = argv[++i]; break;
      case "--context": opts.context = argv[++i]; break;
      case "--round":   opts.round = argv[++i]; break;
      case "--output":  opts.output = argv[++i]; break;
      case "--system":  opts.system = argv[++i]; break;
      case "--json":    opts.json = true; break;
      case "--temp":    opts.temp = parseFloat(argv[++i]); break;
      case "--help": case "-h": usage(); break;
      default:          opts.prompt = argv[i];
    }
  }

  return opts;
}

/* ─── Slide data extraction ─── */

function findSlideInManifest(slideId, aula) {
  const manifestPath = resolve(ROOT, "aulas", aula, "slides", "_manifest.js");
  const text = readFileSync(manifestPath, "utf-8");

  const slides = [];
  for (const line of text.split("\n")) {
    const idMatch = line.match(/id:\s*'([^']+)'/);
    if (!idMatch) continue;

    const get = (key) => {
      const m = line.match(new RegExp(`${key}:\\s*'([^']*(?:\\\\'[^']*)*)'`));
      return m ? m[1].replace(/\\'/g, "'") : "";
    };
    const getNum = (key) => {
      const m = line.match(new RegExp(`${key}:\\s*(\\d+)`));
      return m ? parseInt(m[1]) : 0;
    };

    slides.push({
      id: idMatch[1],
      file: get("file"),
      headline: get("headline"),
      archetype: get("archetype"),
      narrativeRole: get("narrativeRole") || "null",
      tensionLevel: getNum("tensionLevel"),
      clickReveals: getNum("clickReveals"),
    });
  }

  const idx = slides.findIndex((s) => s.id === slideId);
  if (idx === -1) return null;

  return {
    slide: slides[idx],
    pos: `${idx + 1}/${slides.length}`,
    prev: idx > 0 ? slides[idx - 1] : null,
    next: idx < slides.length - 1 ? slides[idx + 1] : null,
  };
}

function extractSlideJS(slideId, aula) {
  const registryPath = resolve(ROOT, "aulas", aula, "slide-registry.js");
  if (!existsSync(registryPath)) return "// Sem slide-registry.js";
  const text = readFileSync(registryPath, "utf-8");

  const startPattern = `'${slideId}'`;
  const startIdx = text.indexOf(startPattern);
  if (startIdx === -1) return "// Sem animação custom para este slide";

  const fnStart = text.indexOf("=>", startIdx);
  if (fnStart === -1) return "// Parse error";

  let braceCount = 0;
  let foundFirst = false;
  let endIdx = fnStart;

  for (let i = fnStart; i < text.length; i++) {
    if (text[i] === "{") { braceCount++; foundFirst = true; }
    else if (text[i] === "}") {
      braceCount--;
      if (foundFirst && braceCount === 0) { endIdx = i + 1; break; }
    }
  }

  return text.substring(startIdx, endIdx).trim();
}

function extractSlideCSS(slideId, cssPath) {
  if (!existsSync(cssPath)) return "/* CSS não encontrado */";
  const text = readFileSync(cssPath, "utf-8");
  const lines = text.split("\n");
  const blocks = [];
  let inBlock = false;
  let currentBlock = [];
  let braceCount = 0;

  for (const line of lines) {
    if (!inBlock && line.includes(`#${slideId}`)) {
      inBlock = true;
      currentBlock = [line];
      braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (braceCount <= 0) {
        blocks.push(currentBlock.join("\n"));
        inBlock = false;
        currentBlock = [];
      }
    } else if (inBlock) {
      currentBlock.push(line);
      braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (braceCount <= 0) {
        blocks.push(currentBlock.join("\n"));
        inBlock = false;
        currentBlock = [];
      }
    }
  }

  return blocks.length > 0 ? blocks.join("\n\n") : `/* Sem CSS específico para #${slideId} */`;
}

function extractNotes(html) {
  const match = html.match(/<aside class="notes">([\s\S]*?)<\/aside>/);
  return match?.[1]?.trim() || "(sem notes)";
}

function buildInteractionFlow(slide) {
  const cr = slide.clickReveals;
  if (cr === 0) return "Slide estático — sem click-reveals. Animações automáticas no slide:entered.";
  const states = ["S0 — Estado inicial (slide entry, antes de reveals)"];
  for (let i = 1; i <= cr; i++) states.push(`S${i} — ArrowRight #${i} → reveal grupo ${i}`);
  return states.join("\n");
}

function buildAttachmentsDesc(pngs, video) {
  const parts = [];
  for (let i = 0; i < pngs.length; i++) parts.push(`- ${basename(pngs[i])} — screenshot estado ${i}`);
  if (video) parts.push(`- ${basename(video)} — vídeo com animações reais`);
  return parts.length > 0 ? parts.join("\n") : "Nenhum material visual anexado.";
}

function fillTemplate(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars))
    result = result.replaceAll(`{{${key}}}`, value);

  // Strip frontmatter/metadata — prompt starts at <system>
  const systemStart = result.indexOf("<system>");
  if (systemStart > 0) result = result.substring(systemStart);
  return result;
}

/* ─── Multimodal parts ─── */

function imageToInlinePart(filePath) {
  const ext = extname(filePath).toLowerCase();
  const mimeType = MIME[ext] || "image/png";
  const data = readFileSync(filePath).toString("base64");
  return { inlineData: { mimeType, data } };
}

async function uploadVideo(apiKey, filePath) {
  const ext = extname(filePath).toLowerCase();
  const mimeType = MIME[ext] || "video/mp4";

  // Dynamic import — only needed for video
  const { GoogleAIFileManager, FileState } = await import("@google/generative-ai/server");
  const fileManager = new GoogleAIFileManager(apiKey);

  console.error(`Uploading video: ${basename(filePath)}...`);
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: basename(filePath),
  });

  let file = uploadResult.file;
  while (file.state === FileState.PROCESSING) {
    process.stderr.write(".");
    await new Promise((r) => setTimeout(r, 2000));
    file = await fileManager.getFile(file.name);
  }

  if (file.state === FileState.FAILED)
    throw new Error(`Video processing failed for ${basename(filePath)}`);

  console.error(` done (${file.state})`);
  return { fileData: { mimeType: file.mimeType, fileUri: file.uri } };
}

/* ─── Main ─── */

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY not set in environment.");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (args.length === 0) usage();

  const opts = parseArgs(args);

  if (opts.stdin) opts.prompt = await readStdin();
  if (opts.file) opts.prompt = readFileSync(opts.file, "utf-8").trim();

  /* ── Slide audit mode: auto-fill template ── */
  if (opts.slide) {
    const aulaDir = resolve(ROOT, "aulas", opts.aula);
    const info = findSlideInManifest(opts.slide, opts.aula);
    if (!info) {
      console.error(`ERROR: Slide "${opts.slide}" not found in _manifest.js`);
      process.exit(1);
    }
    const { slide, pos, prev, next } = info;

    // Read HTML
    const htmlPath = resolve(aulaDir, "slides", slide.file);
    const rawHTML = existsSync(htmlPath)
      ? readFileSync(htmlPath, "utf-8")
      : "<!-- HTML não encontrado -->";

    // Read CSS (--css relative to aula dir, or absolute)
    let rawCSS = "/* --css não especificado */";
    if (opts.css) {
      const cssPath = (opts.css.includes("/") || opts.css.includes("\\") || opts.css.includes(":"))
        ? resolve(opts.css)
        : resolve(aulaDir, opts.css);
      rawCSS = extractSlideCSS(opts.slide, cssPath);
    }

    // Read JS from slide-registry
    const rawJS = extractSlideJS(opts.slide, opts.aula);

    // Read and fill template
    const template = readFileSync(TEMPLATE_PATH, "utf-8");
    opts.prompt = fillTemplate(template, {
      SLIDE_ID: opts.slide,
      SLIDE_NAME: slide.headline,
      SLIDE_ROLE: slide.archetype,
      SLIDE_POS: pos,
      SLIDE_ANTERIOR: prev ? `${prev.id} (${prev.narrativeRole})` : "Nenhum (primeiro slide)",
      SLIDE_SEGUINTE: next ? `${next.id} (${next.narrativeRole})` : "Nenhum (último slide)",
      NARRATIVE_ROLE: slide.narrativeRole,
      TENSION_LEVEL: String(slide.tensionLevel),
      CONTEXT_PARAGRAPH: opts.context || "Sem contexto adicional.",
      ROUND_CONTEXT: opts.round,
      RAW_HTML: rawHTML,
      RAW_CSS: rawCSS,
      RAW_JS: rawJS,
      NOTES_RAW: extractNotes(rawHTML),
      INTERACTION_FLOW: buildInteractionFlow(slide),
      ATTACHMENTS_DESCRIPTION: buildAttachmentsDesc(opts.pngs, opts.video),
    });

    // Template API params
    if (opts.temp === undefined) opts.temp = 1.0;

    console.error(`Slide audit: ${opts.slide} (${slide.headline})`);
    console.error(`Template: ${opts.prompt.length} chars, ${opts.pngs.length} images, ${opts.video ? 1 : 0} video`);
  }

  if (!opts.prompt) {
    console.error("ERROR: No prompt provided.");
    usage();
  }

  /* ── Build multimodal parts ── */
  const parts = [{ text: opts.prompt }];

  for (const png of opts.pngs) {
    const p = resolve(png);
    if (!existsSync(p)) { console.error(`WARN: Image not found: ${png}`); continue; }
    parts.push(imageToInlinePart(p));
    console.error(`Image attached: ${basename(png)}`);
  }

  if (opts.video) {
    const p = resolve(opts.video);
    if (!existsSync(p)) { console.error(`ERROR: Video not found: ${opts.video}`); process.exit(1); }
    parts.push(await uploadVideo(apiKey, p));
  }

  /* ── Call Gemini ── */
  const genAI = new GoogleGenerativeAI(apiKey);
  const modelConfig = { model: MODEL };
  if (opts.system) modelConfig.systemInstruction = opts.system;
  const model = genAI.getGenerativeModel(modelConfig);

  const generationConfig = { maxOutputTokens: 16384 };
  if (opts.temp !== undefined) generationConfig.temperature = opts.temp;
  if (opts.slide) generationConfig.topP = 0.95;
  if (opts.json) generationConfig.responseMimeType = "application/json";

  console.error("Calling Gemini...");
  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
  });

  const text = result.response.text();

  /* ── Output to stdout ── */
  process.stdout.write(text);
  if (!text.endsWith("\n")) process.stdout.write("\n");

  /* ── Persist audit result ── */
  if (opts.slide) {
    mkdirSync(AUDIT_DIR, { recursive: true });
    const outPath = opts.output || resolve(AUDIT_DIR, `${opts.slide}_result.json`);
    const record = {
      slide: opts.slide,
      timestamp: new Date().toISOString(),
      model: MODEL,
      inputs: {
        prompt: TEMPLATE_PATH,
        images: opts.pngs.map((p) => resolve(p)),
        video: opts.video ? resolve(opts.video) : null,
      },
      response: text,
    };
    writeFileSync(outPath, JSON.stringify(record, null, 2), "utf-8");
    console.error(`Audit saved: ${outPath}`);
  } else if (opts.output) {
    writeFileSync(opts.output, JSON.stringify({ response: text }, null, 2), "utf-8");
    console.error(`Output saved: ${opts.output}`);
  }
}

main().catch((err) => {
  console.error("Gemini API error:", err.message || err);
  process.exit(1);
});

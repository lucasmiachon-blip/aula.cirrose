# Hardening Scripts — Best Practices Audit (2026-03-28)

> Auditoria de boas praticas dos scripts JS/MJS do projeto.
> Foco: Gemini API (input/output estruturado), Playwright (screenshots/video), padroes gerais.
> Cada achado tem: problema, por que importa, fix concreto, tier de risco.

---

## Tier Legend

| Tier | Risco | Acao |
|------|-------|------|
| **ZERO** | Nenhum efeito colateral, melhora imediata | Executar a qualquer momento |
| **MINIMAL** | Baixo esforco, alto valor, testavel isolado | Proximo batch de manutencao |
| **HIGH** | Requer refactor, testes, ou mudanca de SDK | Planejar sprint dedicado |

---

## 1. GEMINI API

### G1. JSON fence-stripping fragil [ZERO]

**Arquivo:** `gemini-qa3.mjs:407-421`

**Problema:** Gate 0 pede JSON via prompt text, depois faz strip manual de markdown fences:
```javascript
rawText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
let parsed = JSON.parse(rawText);
```
Se o modelo retornar JSON com fence no meio do texto, ou sem fence mas com whitespace inesperado, o parse falha. Ja houve fallback para `gate0-raw.txt`.

**Por que importa:** A API Gemini suporta `responseMimeType: "application/json"` desde 2024. Quando ativado, a resposta e **garantidamente** JSON valido — sem fences, sem strip, sem surpresas.

**Fix (raw fetch, sem SDK):**
```javascript
// Em buildGate0Payload(), adicionar ao generationConfig:
generationConfig: {
  temperature: 0.1,
  topP: 0.9,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",  // ← NOVO
}
```
Remove o bloco de fence-stripping (linhas 407-408). O `JSON.parse(rawText)` funciona direto.

**Bonus — responseSchema (opcional mas recomendado):**
```javascript
generationConfig: {
  temperature: 0.1,
  topP: 0.9,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: "OBJECT",
    properties: {
      must_pass:    { type: "BOOLEAN", description: "True if no blocking (MUST) defects found" },
      should_pass:  { type: "BOOLEAN", description: "True if no warnings (SHOULD) found" },
      summary:      { type: "STRING",  description: "One-line summary of findings" },
      defects: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            severity:    { type: "STRING", enum: ["MUST", "SHOULD", "COULD"] },
            code:        { type: "STRING", description: "Error code e.g. E07" },
            description: { type: "STRING" },
            element:     { type: "STRING", description: "CSS selector or HTML element" },
            fix:         { type: "STRING", description: "Concrete fix suggestion" }
          },
          required: ["severity", "description"]
        }
      }
    },
    required: ["must_pass", "summary"]
  }
}
```
O schema funciona como **instrucao adicional** para cada campo — `description` guia o modelo. Nao duplicar schema no prompt text.

---

### G2. Zero retry — qualquer 429/500 mata o script [ZERO]

**Arquivos:** `gemini-qa3.mjs:386-390`, `content-research.mjs` (mesmo padrao)

**Problema:** Uma unica falha HTTP encerra o processo:
```javascript
if (!res.ok) {
  const err = await res.text();
  console.error(`API Error ${res.status}:`, err.slice(0, 500));
  process.exit(1);
}
```

**Por que importa:** Gemini API retorna 429 (rate limit) e 503 (overload) rotineiramente, especialmente com modelos preview. Retry com backoff resolve 95% dos casos.

**Fix — funcao compartilhada:**
```javascript
async function fetchWithRetry(url, options, { maxRetries = 3, baseDelay = 1500 } = {}) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.ok) return res;

    const status = res.status;
    // Non-retryable: client error (exceto 429)
    if (status >= 400 && status < 500 && status !== 429) {
      const body = await res.text();
      throw new Error(`API ${status} (non-retryable): ${body.slice(0, 300)}`);
    }
    // Retryable: 429, 500, 503, 504
    if (attempt < maxRetries) {
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.warn(`  Retry ${attempt + 1}/${maxRetries} after ${Math.round(delay)}ms (HTTP ${status})`);
      await new Promise(r => setTimeout(r, delay));
      continue;
    }
    const body = await res.text();
    throw new Error(`API ${status} after ${maxRetries} retries: ${body.slice(0, 300)}`);
  }
}
```
Substituir `fetch(url, opts)` por `fetchWithRetry(url, opts)` nos dois scripts.

---

### G3. Estimativa de tokens grosseira [MINIMAL]

**Arquivo:** `gemini-qa3.mjs:374,801`

**Problema:**
```javascript
const inputTokens = JSON.stringify(payload).length / 4;
```
Divide tamanho do JSON stringificado por 4. Isso inclui base64 de imagens (que nao sao tokenizados como texto) e subestima texto com caracteres multi-byte (portugues).

**Por que importa:** Estimativa errada leva a surpresas de custo. Imagens base64 inflam o JSON mas tokens reais sao calculados por resolucao (258 tokens por tile 768x768).

**Fix (API countTokens):**
```javascript
// Pre-flight (antes do generateContent)
const countRes = await fetch(
  `${BASE}/v1beta/models/${MODEL}:countTokens?key=${API_KEY}`,
  { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: payload.contents }) }
);
const { totalTokens } = await countRes.json();
console.log(`  Actual input tokens: ${totalTokens}`);
```
Custo: 1 request extra, sem cobranca. Tempo: ~200ms.

**Alternativa simples (sem request extra):** Usar `usageMetadata.promptTokenCount` do response (ja implementado na linha 393) e logar a diferenca vs estimativa. Calibrar o divisor ao longo do tempo.

---

### G4. Modelo hardcoded sem fallback [MINIMAL]

**Arquivos:** `gemini-qa3.mjs:26`, `content-research.mjs:64`

**Problema:**
```javascript
const MODEL = 'gemini-3.1-pro-preview';
```
Modelos preview sao descontinuados sem aviso. Se `gemini-3.1-pro-preview` sair do ar, ambos scripts quebram.

**Fix:**
```javascript
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
```
Permite override via env var. Default para modelo GA (generally available) em vez de preview.

**Recomendacao de modelo por gate:**

| Gate | Modelo recomendado | Razao |
|------|--------------------|-------|
| Gate 0 (inspect) | `gemini-2.5-flash` | Binario PASS/FAIL em imagens, ~15x mais barato |
| Gate 4 (editorial) | `gemini-2.5-pro` | Raciocinio criativo, nuance de design |
| Content research | `gemini-2.5-pro` | Sintese de evidencia, grounding |

Flash custa ~$0.15/M input vs ~$1.25/M do Pro. Para Gate 0 que processa ~20 slides, economia: ~$0.20/batch.

---

### G5. System prompt embutido no codigo (content-research.mjs) [MINIMAL]

**Arquivo:** `content-research.mjs:322-439` (~120 linhas)

**Problema:** O system prompt inteiro esta hardcoded como template literal. Qualquer ajuste requer editar JS. gemini-qa3.mjs ja faz certo — carrega de `docs/prompts/gemini-gate0-inspector.md`.

**Fix:** Externalizar para `docs/prompts/content-research-system.md`. Carregar via:
```javascript
const systemPrompt = readFileSync(join(REPO_ROOT, 'docs/prompts/content-research-system.md'), 'utf8');
```
Beneficio: Claude pode editar o prompt sem tocar no JS. Versionamento independente.

---

### G6. File upload manual (20 linhas) vs SDK (3 linhas) [HIGH]

**Arquivo:** `gemini-qa3.mjs:484-533`

**Problema:** Upload resumable implementado manualmente:
```javascript
const startRes = await fetch(`${BASE}/upload/v1beta/files?key=${API_KEY}`, {
  method: 'POST',
  headers: {
    'X-Goog-Upload-Protocol': 'resumable',
    'X-Goog-Upload-Command': 'start',
    // ...8 mais linhas
  },
});
```

**Com `@google/genai` SDK:**
```javascript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey });
const file = await ai.files.upload({ file: videoPath, config: { mimeType: "video/webm" } });
```

**Por que HIGH:** Migrar para o SDK implica trocar TODA a integracao (fetch → SDK), nao so upload. Fazer junto com G1-G4 quando houver sprint dedicado. O SDK tambem traz: retry built-in, token counting, context caching.

**Nota:** O SDK atual e `@google/genai` (novo, unified client). O antigo `@google/generative-ai` esta em modo legacy. Se migrar, ir direto para o novo.

---

### G7. Manifest parsing duplicado [MINIMAL]

**Arquivos:** `gemini-qa3.mjs:263-301`, `content-research.mjs:119-161`

**Problema:** `getSlideMetadata()` reimplementada identicamente em ambos scripts. Regex parsing fragil repetido.

**Fix:** Extrair para `aulas/cirrose/scripts/lib/manifest-parser.mjs`:
```javascript
// lib/manifest-parser.mjs
export function getSlideMetadata(slideId, aulaDir) { /* ... */ }
export function findSlideFile(slideId, aulaDir) { /* ... */ }
```
Import compartilhado. Unica fonte de verdade para parsing do manifest.

---

### G8. Custo pricing hardcoded e desatualizado [ZERO]

**Arquivo:** `gemini-qa3.mjs:395,802,831`

**Problema:**
```javascript
const totalCost = ((usage.promptTokenCount || 0) / 1_000_000 * 2.0) + ((usage.candidatesTokenCount || 0) / 1_000_000 * 12.0);
```
Os multiplicadores `2.0` e `12.0` sao pricing do gemini-3.1-pro-preview. Se trocar modelo (G4), custo reportado fica errado.

**Fix:**
```javascript
const PRICING = {
  'gemini-3.1-pro-preview': { input: 2.0, output: 12.0 },
  'gemini-2.5-pro':         { input: 1.25, output: 10.0 },
  'gemini-2.5-flash':       { input: 0.15, output: 0.60 },
};
const p = PRICING[MODEL] || { input: 1.0, output: 5.0 };
const totalCost = (usage.promptTokenCount / 1e6 * p.input) + (usage.candidatesTokenCount / 1e6 * p.output);
```

---

## 2. PLAYWRIGHT

### P1. `waitForTimeout()` em excesso — anti-pattern [MINIMAL]

**Arquivos:**
- `qa-batch-screenshot.mjs:211,229,261,288,291,295,298`
- `browser-qa-act1.mjs` (implicito via timings)
- `qa-video.js:79`

**Problema:** O script usa `page.waitForTimeout()` extensivamente:
```javascript
await page.waitForTimeout(2000); // wait for deck init
await page.waitForTimeout(animWait); // 1000 ou 4500
await page.waitForTimeout(2500); // cada click-reveal
await page.waitForTimeout(1000); // video context init
await page.waitForTimeout(500);  // video end pause
```

A propria documentacao Playwright diz: *"Intended for debugging purposes only. Production code using fixed timeouts is prone to flakiness."*

**Por que importa:**
1. **Lentidao:** 7 slides com 3 reveals cada = 7 * (4500 + 3 * 2500 + 500) = ~84s. Muito disso e espera desnecessaria.
2. **Flaky:** Se animacao demora 100ms a mais (CPU load), screenshot captura estado incompleto. Se demora menos, espera sem necessidade.
3. **CI:** Em maquinas mais lentas, 4500ms pode nao bastar. Em maquinas rapidas, desperdicado.

**Fix — waitForFunction com condicao real:**

Para esperar GSAP terminar:
```javascript
// Esperar todas animacoes GSAP completarem
await page.waitForFunction(() => {
  if (typeof gsap === 'undefined') return true;
  const tweens = gsap.globalTimeline.getChildren(true, true, false);
  return tweens.every(t => t.progress() === 1 || !t.isActive());
}, { timeout: 10000 });
```

Para esperar deck.js estabilizar:
```javascript
// Esperar slide-active existir
await page.waitForFunction(
  (expectedId) => {
    const active = document.querySelector('section.slide-active');
    return active && active.id === expectedId;
  },
  slideId,
  { timeout: 5000 }
);
```

Para esperar click-reveal completar:
```javascript
// Esperar .revealed class aparecer no N-esimo elemento
await page.waitForFunction(
  (n) => document.querySelectorAll('[data-reveal].revealed').length >= n,
  beat,
  { timeout: 5000 }
);
```

**Onde `waitForTimeout` e aceitavel:**
- Gravacao de video: pausa final de 500ms para capturar frame estavel. Ok.
- Debug local: Ok (com `--debug` flag).
- Nunca em loop de captura de screenshots de producao.

---

### P2. Nenhum error handling no Playwright [MINIMAL]

**Arquivos:** `qa-batch-screenshot.mjs`, `capture-s-a1-01.mjs`

**Problema:** Se `page.goto()` falha (servidor nao rodando), `page.evaluate()` falha (JS error no deck), ou `page.screenshot()` falha (permissao), o script crasha sem mensagem util.

**Fix — try/catch por slide + cleanup garantido:**
```javascript
async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    // ... loop de slides ...
    for (const slide of targetSlides) {
      try {
        // navigate, capture, measure
      } catch (err) {
        console.error(`[${slide.id}] FAILED: ${err.message}`);
        results.push({ id: slide.id, error: err.message });
        continue; // proximo slide em vez de crashar
      }
    }
  } finally {
    await browser.close(); // SEMPRE fecha, mesmo com erro
  }
}
```

**Nota critica:** Atualmente `browser.close()` so executa se o loop terminar normalmente. Se qualquer `page.evaluate()` der throw, o processo Chromium fica orfao.

---

### P3. Browser reuse vs context isolation [ZERO]

**Arquivo:** `qa-batch-screenshot.mjs:281-307`

**Problema:** Para video, cria novo context + page por slide (correto). Mas para screenshots, reutiliza a mesma page e navega via `__deckGoTo()` (eficiente). O problema: estado residual de slides anteriores pode contaminar medicoes.

**Atual (screenshots):** Uma page, navega sequencialmente.
**Atual (video):** Novo context por slide (correto — isolamento total).

**Melhoria:** Para screenshots, considerar `page.reload()` antes de cada slide se houver state leakage (classes `.revealed` de slides anteriores persistem no DOM). Monitorar via `metrics.json` se `fillRatio` varia entre runs.

---

### P4. deviceScaleFactor inconsistente [ZERO]

**Arquivo:** `qa-batch-screenshot.mjs:203-206,283`

**Problema:**
```javascript
// Screenshots: scale 2 (retina)
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: SCALE, // default 2
});

// Video: scale 1
const videoCtx = await browser.newContext({
  deviceScaleFactor: 1,
  recordVideo: { dir: slideDir, size: { width: 1280, height: 720 } },
});
```
Screenshots sao 2x (2560x1440 pixels), video e 1x (1280x720). Quando Gemini compara PNG S0 vs video frame, resolucao diferente pode afetar avaliacao de legibilidade.

**Fix:** Documentar a decisao (screenshots retina para analise de texto, video 1x para peso de arquivo) ou unificar em 1x para consistencia de Gate 0/4.

---

### P5. `screenshot()` sem `animations: 'disabled'` [MINIMAL]

**Arquivo:** `qa-batch-screenshot.mjs:244,264`

**Problema:**
```javascript
await page.screenshot({ path: join(slideDir, s0File), type: 'png' });
```
Playwright tem opcao `animations: 'disabled'` que congela CSS animations/transitions no momento do screenshot. Util para S2 (estado final) onde queremos pixels estaveis.

**Quando usar:**
- **S0 (pre-animacao):** `animations: 'disabled'` garante que nenhuma CSS transition em andamento afeta o frame.
- **S2 (final):** Igual — queremos estado estavel.
- **Video:** NUNCA usar (queremos animacoes rodando).

**Fix:**
```javascript
await page.screenshot({
  path: join(slideDir, s0File),
  type: 'png',
  animations: 'disabled', // congela CSS transitions no frame
});
```

---

### P6. Hardcoded slide IDs em browser-qa-act1.mjs [MINIMAL]

**Arquivo:** `browser-qa-act1.mjs:25-26`

**Problema:**
```javascript
const ACT1_IDS = ['s-title','s-hook','s-a1-01','s-a1-classify',...];
const ACT2_IDS = ['s-a2-01','s-a2-02',...];
```
Lista manual de IDs. Se slide e adicionado/removido do manifest, este script fica out of sync.

**Fix:** Importar de `_manifest.js` como `qa-batch-screenshot.mjs` ja faz:
```javascript
const { slides } = await import(`file://${manifestPath.replace(/\\/g, '/')}`);
const act1Ids = slides.filter(s => s.act === 'A1' || s.act === null).map(s => s.id);
```

---

### P7. Console errors nao capturados sistematicamente [ZERO]

**Arquivo:** `qa-batch-screenshot.mjs` (ausente)

**Problema:** `browser-qa-act1.mjs` captura `page.on('console')` e `page.on('pageerror')`, mas `qa-batch-screenshot.mjs` (o script principal) nao. Erros JS no deck podem causar medicoes incorretas silenciosamente.

**Fix:**
```javascript
const consoleErrors = [];
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', err => consoleErrors.push(err.message));

// No final de cada slide:
if (consoleErrors.length > 0) {
  metrics.consoleErrors = [...consoleErrors];
  consoleErrors.length = 0;
}
```

---

## 3. PADROES GERAIS JS

### J1. CLI arg parsing manual repetido [MINIMAL]

**Arquivos:** Todos os scripts (6 implementacoes de `getArg()`, `hasFlag()`)

**Problema:** Cada script reimplementa:
```javascript
function getArg(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
}
```
6 copias identicas. Se precisar de `--flag=value` syntax, precisa mudar em 6 lugares.

**Fix:** Extrair para `scripts/lib/cli.mjs`:
```javascript
// scripts/lib/cli.mjs
const args = process.argv.slice(2);
export function getArg(name, fallback) {
  // Support both --name value and --name=value
  const eqIdx = args.findIndex(a => a.startsWith(`--${name}=`));
  if (eqIdx >= 0) return args[eqIdx].split('=').slice(1).join('=');
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && args[idx + 1] && !args[idx + 1].startsWith('--') ? args[idx + 1] : fallback;
}
export function hasFlag(name) { return args.includes(`--${name}`); }
```

---

### J2. CSS extraction regex fragil [HIGH]

**Arquivo:** `gemini-qa3.mjs:89-127` (extractSlideCSS), `204-231` (extractGlobalClassCSS)

**Problema:** Brace-counting line-by-line para extrair blocos CSS:
```javascript
braceDepth += (line.match(/\{/g) || []).length;
braceDepth -= (line.match(/\}/g) || []).length;
```
Nao lida com:
- `{` ou `}` dentro de strings CSS (`content: "}"`)
- `{` dentro de `@media` queries aninhadas
- Comentarios `/* { */`

**Impacto real:** Baixo (o CSS do projeto nao usa esses patterns). Mas e fragil se o CSS crescer.

**Fix (futuro):** Usar um CSS parser leve como `css-tree` (4KB gzipped). Mas nao e urgente — funciona hoje.

---

### J3. `process.exit(1)` vs throw [ZERO]

**Arquivos:** Todos os scripts

**Problema:** `process.exit(1)` impede cleanup (browser.close(), file handle release):
```javascript
if (!filePath) {
  console.error(`Slide file not found for ${slideId}`);
  process.exit(1);  // browser Chromium fica orfao
}
```

**Fix:** Usar `throw new Error()` e deixar o `main().catch()` no final do script lidar:
```javascript
if (!filePath) throw new Error(`Slide file not found: ${slideId}`);
// ...
main().catch(err => { console.error(err.message); process.exit(1); });
```
Assim o `finally` block (P2) executa cleanup antes de sair.

---

### J4. Nenhum script tem `--help` ou validacao de args [ZERO]

**Problema:** Se chamar `node gemini-qa3.mjs` sem argumentos, roda com defaults silenciosamente (`s-a1-01`, round 11). Sem `--help`, usuario precisa ler o codigo para descobrir opcoes.

**Fix (minimo viavel):**
```javascript
if (hasFlag('help') || hasFlag('h')) {
  console.log(`Usage: node gemini-qa3.mjs --slide <id> [--inspect|--editorial] [--round N]`);
  console.log(`  --slide     Slide ID (required)`);
  console.log(`  --inspect   Run Gate 0 defect inspection`);
  console.log(`  --editorial Run Gate 4 editorial review`);
  console.log(`  --round     Round number for Gate 4`);
  process.exit(0);
}
```

---

## 4. SUMARIO POR PRIORIDADE

### Tier ZERO (fazer a qualquer momento)

| # | O que | Impacto | Status |
|---|-------|---------|--------|
| G1 | `responseMimeType: "application/json"` no Gate 0 | Elimina fence-strip + parse failures | **DONE** (2026-03-29 madrugada) |
| G2 | `fetchWithRetry()` nos 2 scripts Gemini | Resiliencia a 429/503 | **DONE** (2026-03-29 madrugada) |
| G8 | Pricing table por modelo | Custo reportado correto | **DONE** (2026-03-29 tarde) — 6 modelos, precos verificados |
| P3 | Documentar decisao de deviceScaleFactor | Clareza | PENDING |
| P4 | Igualar scale se necessario | Consistencia | PENDING |
| P7 | Console error capture em qa-batch | Detectar JS errors silenciosos | **DONE** (2026-03-29 madrugada) — check C5 |
| J3 | `throw` em vez de `process.exit(1)` | Cleanup correto | PENDING |
| J4 | `--help` basico | UX minima | **DONE** (2026-03-29 madrugada) |

### Tier MINIMAL (proximo batch)

| # | O que | Impacto | Status |
|---|-------|---------|--------|
| G3 | `countTokens` pre-flight | Custo real antes de enviar | PENDING |
| G4 | `GEMINI_MODEL` env var + default GA | Resiliencia a deprecacao | **DONE** (2026-03-29) — model-per-gate: Flash Gate 0, Pro Gate 4 |
| G5 | Externalizar Gate 4 prompt | Versionamento independente | **DONE** (2026-03-29) → `docs/prompts/gemini-gate4-editorial.md` |
| G7 | Extrair manifest-parser.mjs | DRY, single source of truth | PENDING |
| P1 | `waitForFunction()` em vez de `waitForTimeout()` | Speed + reliability |
| P2 | try/catch per slide + finally cleanup | Nao crashar batch inteiro |
| P5 | `animations: 'disabled'` em screenshots | Pixels estaveis |
| P6 | Import manifest em browser-qa-act1 | Nao out-of-sync |
| J1 | Extrair cli.mjs compartilhado | DRY |

### Adicionado em 2026-03-29

| # | O que | Impacto | Status |
|---|-------|---------|--------|
| G9 | Gate 4 prompt 7→11 dimensoes (CSS Cascade, Gestalt, Semantic/a11y, State Completeness) | Gemini detecta dead CSS, specificity conflicts, failsafes ausentes, Gestalt violations | **DONE** (2026-03-29) |
| G10 | Gate 4 CSS analysis obrigatoria (cascade trace, dead CSS, specificity, failsafes, GSAP races) | Gemini analisa codigo estruturalmente antes de propor | **DONE** (2026-03-29) |
| G11 | Gate 4 structured JSON output (scorecard parseavel + dead_css + conflicts) | Script pode comparar scores entre rounds automaticamente | **DONE** (2026-03-29) |

### Adicionado em 2026-03-29 (tarde)

| # | O que | Impacto | Status |
|---|-------|---------|--------|
| G12 | Model-per-gate: Gate 0 Flash ($0), Gate 4 Pro ($2/$12). CLI `--model`, env `GEMINI_MODEL`, default por mode. | Custo Gate 0 = $0. Qualidade Gate 4 = top-tier. | **DONE** (2026-03-29) |
| G13 | `--force-gate4` flag para override de Gate 0 FAIL (falsos positivos) | Desbloqueia Gate 4 sem re-run Gate 0 | **DONE** (2026-03-29) |
| G14 | Scripts validados end-to-end com dev server | Pipeline desbloqueado para producao | **DONE** (2026-03-29) |

### Tier HIGH (sprint dedicado)

| # | O que | Impacto |
|---|-------|---------|
| G6 | Migrar para `@google/genai` SDK | Upload 3 linhas, retry built-in, countTokens, caching |
| J2 | CSS parser real (css-tree) | Robustez extraction |

---

## 5. PADROES DE REFERENCIA

### Gemini structured output (raw fetch, sem SDK)

```javascript
const payload = {
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: "OBJECT",
      properties: {
        field: { type: "STRING", description: "Descricao guia o modelo" },
        score: { type: "NUMBER", description: "Score de 0 a 10" },
        items: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              severity: { type: "STRING", enum: ["MUST", "SHOULD", "COULD"] },
              text:     { type: "STRING" }
            },
            required: ["severity", "text"]
          }
        }
      },
      required: ["field", "score"]
    }
  }
};
// Response: JSON.parse(result.candidates[0].content.parts[0].text)  — sempre valido
```

### Playwright — esperar GSAP terminar

```javascript
await page.waitForFunction(() => {
  if (typeof gsap === 'undefined') return true;
  const active = gsap.globalTimeline.getChildren(true, true, false);
  return active.every(t => t.progress() >= 1 || !t.isActive());
}, { timeout: 10000 });
```

### Playwright — screenshot estavel

```javascript
await page.screenshot({
  path: outPath,
  type: 'png',
  animations: 'disabled',  // congela CSS transitions
  // scale: 'css',          // 1 pixel CSS = 1 pixel PNG (ignora deviceScaleFactor)
});
```

### Retry exponencial com jitter

```javascript
async function fetchWithRetry(url, opts, { maxRetries = 3, baseDelay = 1500 } = {}) {
  for (let i = 0; i <= maxRetries; i++) {
    const res = await fetch(url, opts);
    if (res.ok) return res;
    if (res.status >= 400 && res.status < 500 && res.status !== 429) {
      throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    if (i < maxRetries) {
      const delay = baseDelay * 2 ** i + Math.random() * 1000;
      console.warn(`  Retry ${i + 1}/${maxRetries} in ${Math.round(delay)}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
}
```

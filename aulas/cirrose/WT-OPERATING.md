# OPERATING — Cirrose (prompt operacional)

> Maquina de estados + QA loop para sessoes de trabalho.
> **On-demand.** Sessoes gerais: ler apenas §1-§3. Sessoes QA: ler §4 (pipeline completo).
> Criado: 2026-03-17. Atualizado: 2026-03-29 (mandato on-demand, Gate 2 protocol).

---

## 1. Inicio de Sessao (obrigatorio)

```bash
git log --oneline -5 && git status
cat aulas/cirrose/HANDOFF.md | head -55
```

Se HANDOFF menciona slide em QA → ler tambem o contexto profundo:
```bash
cat aulas/cirrose/NEXT-SESSION.md | head -30
```

Responder ANTES de qualquer trabalho:

1. **Qual slide esta em andamento?** (ver tabela de estados no HANDOFF)
2. **Qual estado ele esta?** (BACKLOG/DRAFT/CONTENT/SYNCED/LINT-PASS/QA/DONE)
3. **O que falta para avancar ao proximo estado?** (se QA → ver NEXT-SESSION.md para passos)
4. **Se tem slide em andamento → terminar ANTES de comecar outro.**

Se nenhum slide em andamento → propor o proximo do caminho critico ao usuario.

---

## 2. Maquina de Estados

```
BACKLOG → DRAFT → CONTENT → SYNCED → LINT-PASS → QA → DONE
```

| Estado | Significa | Criterio de saida |
|--------|-----------|-------------------|
| BACKLOG | Existe no manifest, sem HTML ou so esqueleto | Escrever conteudo completo |
| DRAFT | HTML existe, conteudo parcial ou [TBD] | Completar conteudo, verificar dados |
| CONTENT | Conteudo completo, dados verificados | Sincronizar 9 superficies (secao 7) |
| SYNCED | HTML + manifest + narrative + CSS alinhados | `npm run lint:slides` + `npm run lint:narrative-sync` PASS |
| LINT-PASS | Lints PASS | Submeter a QA (secao 4) |
| QA | Em revisao (6 stages: QA.0→QA.1→QA.2→Gate 0→QA.3→QA.4) | Todos stages PASS |
| DONE | QA PASS + docs atualizados + commit | Nada — slide fechado |

### Regras de transicao

- **Transicoes so avancam.** Retrocesso = bug (registrar em ERROR-LOG).
- **Cada transicao tem checklist.** Nao pular etapas.
- **Um slide por vez.** Nao comecar outro ate fechar ou bloquear o atual.
- **Bloqueio** = precisa de Lucas, dado ausente, ou dependencia. Registrar em NOTES.md e mover para proximo.

---

## 3. Checklists de Transicao

### BACKLOG → DRAFT

- [ ] Arquivo HTML criado em `slides/NN-slug.html`
- [ ] `<section id="s-{act}-{slug}">` com ID correto
- [ ] `<div class="slide-inner">` wrapper
- [ ] `<h2>` com assercao (mesmo que provisoria)
- [ ] `<aside class="notes">` com timing placeholder
- [ ] Entrada em `_manifest.js` na posicao correta
- [ ] Screenshot baseline: `node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide {id}` (ou `--act`)

### DRAFT → CONTENT

- [ ] h2 = assercao clinica verificavel (nao rotulo generico)
- [ ] Zero `<ul>`/`<ol>` no corpo do slide
- [ ] Todos dados numericos verificados (PMID ou [TBD] em notes)
- [ ] Corpo do slide <= 30 palavras
- [ ] Speaker notes com timing, [DATA] tags, fontes
- [ ] Conteudo atualizado (ultima guideline/trial?)
- [ ] Conteudo que gruda (numero ancora, regra de bolso?)

### CONTENT → SYNCED (critico — 9 superficies)

- [ ] `_manifest.js` headline = `<h2>` do HTML
- [ ] `_manifest.js` clickReveals = numero real de `[data-reveal]`
- [ ] `_manifest.js` customAnim = null ou ID correto
- [ ] `slide-registry.js` tem wiring se customAnim != null
- [ ] `cirrose.css` tem seletores `#slide-id` se necessario
- [ ] `narrative.md` tem linha para este slide no ato correto
- [ ] `evidence-db.md` tem referencias se slide tem dados
- [ ] `AUDIT-VISUAL.md` tem entrada (pode ser placeholder)
- [ ] `HANDOFF.md` registra estado SYNCED

### SYNCED → LINT-PASS

- [ ] `npm run build:cirrose` PASS
- [ ] `npm run lint:slides` PASS
- [ ] `npm run lint:narrative-sync` PASS

### LINT-PASS → QA

Entrar no QA loop (secao 4). Nao ha checklist — e o loop inteiro.

### QA → DONE

- [ ] Todos sub-stages QA PASS (ou max iteracoes + NOTES.md)
- [ ] AUDIT-VISUAL.md scorecard atualizado (14 dims)
- [ ] ERROR-LOG.md atualizado (se erro novo encontrado durante QA)
- [ ] HANDOFF.md estado = DONE
- [ ] CHANGELOG.md entry
- [ ] **→ CHECKPOINT:** apresentar docs updates ao Lucas, esperar OK
- [ ] Commit: `fix(cirrose): s-{id} QA pass — {resumo}`

---

# ══════════════════════════════════════════════════════════════
# PARE AQUI em sessões NÃO-QA.
# Abaixo = pipeline QA detalhado. Ler sob demanda.
# ══════════════════════════════════════════════════════════════

---

## 4. QA Sub-Loop (dentro do estado QA)

6 stages, **6 checkpoints humanos** (QA.4 tem checkpoint antes de DONE). Agente NAO avanca sem OK do Lucas.

```
QA.0 CONTENT AUDIT
  → CHECKPOINT LUCAS

QA.1 CONSTRAINT CHECK
  → CHECKPOINT LUCAS

QA.2 VISUAL AUDIT (Opus)
  → CHECKPOINT LUCAS

GATE 0 — DEFECT INSPECTION (Gemini, binário)
  → MUST FAIL bloqueia QA.3

QA.3 VISUAL AUDIT (Gemini multimodal)
  → CHECKPOINT LUCAS

QA.4 FIX + RE-AUDIT
  → CHECKPOINT LUCAS (apresentar resultado re-audit)

DOCS + COMMIT
  → CHECKPOINT LUCAS (aprovar cada doc update)
  → DONE
```

### QA.0 — Content Audit

Verificar conteudo sem olhar visual:

- h2 e assercao clinica? Faz sentido para o publico?
- Dados numericos corretos? Fonte Tier 1?
- Narrativa: este slide cumpre seu `narrativeRole`?
- Tensao: `tensionLevel` bate com o conteudo?
- Para slides narrativeCritical: h2 foi aprovado por Lucas?

**Output:** lista de issues ou "PASS".
**→ CHECKPOINT:** apresentar ao Lucas, esperar OK.

### QA.1 — Constraint Check

Verificacoes automatizaveis (lint + HTML source):

| Check | Como | Obrigatorio |
|-------|------|-------------|
| h2 = assercao (nao rotulo) | Read HTML | Sim (exceto archetype title/hook) |
| Zero `<ul>/<ol>` no corpo | Grep HTML | Sim |
| `<aside class="notes">` com timing | Read HTML | Sim |
| `<section>` sem style display (E07) | Grep style= | Sim |
| Cores via var() — zero HEX hardcoded | Grep cirrose.css | Sim (exceto fallbacks) |
| PMIDs com [DATA] tag | Read notes | Sim |
| Headline match manifest↔HTML | lint:narrative-sync | Sim |
| Body word count <= 30 | Manual count | Sim |
| `.no-js`/`.stage-bad` failsafes | Grep cirrose.css | Sim |

**Output:** tabela check/resultado.
**→ CHECKPOINT:** apresentar ao Lucas, esperar OK.

### QA.2 — Opus Visual Audit (3 camadas, MCP tools)

Protocolo completo: `@repo/docs/prompts/gate2-opus-visual.md`.

**Captura (pre-requisito — ja feito antes de Gate 0):**

```bash
node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide {id} --video
```

Output: `qa-screenshots/{id}/` → PNGs S0/S2 + video + `metrics.json`.
Resolucao: 1280x720 @2x (PNG = 2560x1440).

**3 camadas de analise:**

| Layer | Ferramenta | O que mede |
|-------|-----------|------------|
| A — Instrumental | sharp pick_color + a11y check_color_contrast | Cores reais, contraste WCAG, dimensoes PNG |
| B — Code | Read + Grep (CSS/HTML/JS) | E52, dead CSS, failsafes, token compliance, GSAP/CSS race |
| C — Visual | Read multimodal (PNG) | Hierarquia, whitespace, tipografia, cor semantica, completude |

**Severidades:**
- MUST (bloqueia Gate 4): contraste < 4.5:1, E52, failsafes ausentes, cores hardcoded, dimensoes erradas
- SHOULD (warning): dead CSS, GSAP/CSS race, contraste < 7:1, fill ratio fora ideal

**Output:** `qa-screenshots/{id}/gate2-report.md` com tabelas de amostras, contrastes e code checks.
**MUST FAIL bloqueia Gate 4.** Fix → re-screenshot → re-run Gate 2.
**→ CHECKPOINT:** apresentar ao Lucas, esperar OK.

### Gate 0 — Inspeção de Defeitos Visuais

**Quando:** Após captura de PNGs (QA.2), ANTES de qualquer QA editorial (QA.3).
**Custo:** ~$0.002/slide (~800 tokens input, ~200 output).
**Natureza:** Binário (PASS/FAIL). NÃO é review criativo — apenas defeitos mecânicos.

**Comando:**

```bash
# Gate 0 (binário, PASS/FAIL)
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --inspect

# [checkpoint Lucas — aprovar Gate 0]

# Gate 4 (editorial, requer Gate 0 PASS)
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --editorial --round N
```

**9 checks (6 MUST + 3 SHOULD):**

| # | Check | Tipo | O que procura |
|---|-------|------|---------------|
| 1 | CLIPPING | MUST | Texto cortado em bordas |
| 2 | OVERFLOW | MUST | Conteúdo além de 1280×720 |
| 3 | OVERLAP | MUST | Sobreposição não intencional |
| 4 | INVISIBLE | MUST | Espaço vazio onde deveria ter conteúdo |
| 5 | MISSING_MEDIA | MUST | Imagem/ícone/gráfico faltando |
| 6 | ANIMATION_STATE | MUST | Elementos ocultos/parciais em S2 |
| 7 | ALIGNMENT | SHOULD | Desalinhamento entre elementos similares |
| 8 | SPACING | SHOULD | Espaçamento inconsistente |
| 9 | READABILITY | SHOULD | Texto ilegível (tamanho/contraste) |

**Regras:**
- `must_pass: false` → **BLOQUEIA** QA.3. Corrigir defeitos antes.
- `should_pass: false` → **WARNING**. Registrar, não bloqueia.
- Prompt carregado de `docs/prompts/gemini-gate0-inspector.md` (NUNCA hardcoded).
- Output salvo em `qa-screenshots/{slide-id}/gate0.json`.
- Falso positivo > falso negativo (preferir alertar).
- NÃO requer checkpoint humano — é gate automático. Lucas vê resultado no terminal.

---

### QA.3 — Visual Audit (Gemini multimodal)

**Prerequisito: PNGs + webm atualizados** (ver passo 1 abaixo).
NUNCA rodar Gate 0/4 com screenshots desatualizados ou sem video.
NUNCA capturar screenshots manualmente via Playwright MCP — usar o script.

#### Passo 1 — Screenshots + video (`qa-batch-screenshot.mjs`)

```bash
# Slide unico com video (padrao para QA)
node aulas/cirrose/scripts/qa-batch-screenshot.mjs --slide {id} --video

# Batch de um ato inteiro (sem video)
node aulas/cirrose/scripts/qa-batch-screenshot.mjs --act A1
```

Output: `qa-screenshots/{id}/` → PNGs S0+S2 + `animation-1280x720.webm` + `metrics.json`.
Re-rodar SEMPRE que houve mudanca de HTML/CSS/JS desde ultima captura.
Script usa `__deckGoTo(index)` para navegacao direta (nunca ArrowRight entre slides).

#### Passo 2 — Gate 0 (defect inspector)

```bash
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --inspect
# [checkpoint Lucas — aprovar Gate 0 antes de prosseguir]
```

#### Passo 3 — Gate 4 (editorial review)

```bash
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --editorial --round N

# Com temperatura e output custom
node aulas/cirrose/scripts/gemini-qa3.mjs --slide {id} --editorial --round N --temp 0.8 --output custom.json
```

Input para Gemini (TUDO junto, extraido automaticamente):
1. Raw HTML do slide — **ler do arquivo no momento do envio** (NUNCA copiar de prompt anterior)
2. Raw CSS (seletores relevantes do cirrose.css) — **extrair live**
3. Raw JS (trecho do slide-registry.js para este slide) — **extrair live**
4. PNGs S0 + S2 do passo 1
5. Video .webm do passo 1

**REGRA E42:** Raw code no prompt DEVE ser lido dos arquivos NO MOMENTO do envio.
NUNCA reaproveitar prompt de rodada anterior sem re-extrair o codigo.
Prompt com codigo stale = review invalido = dinheiro desperdicado.

Auto-extrai HTML/CSS/JS dos arquivos (E42). Video enviado se existe no disco.
Output: `qa-screenshots/{slide-id}/gemini-qa3-rN.md`. Round context: `qa-rounds/{slideId}.md`.
Gemini declara recibo dos materiais (video, PNGs, raw code) na primeira linha da resposta.

**Output:** Recibo + Scorecard + Propostas (1-5, code-first) do Gemini + interpretacao do agente.

> **Gate 4 v2.0** (expandido 29/mar/2026): 11 dimensoes (era 7). CSS analysis obrigatoria: cascade trace, dead CSS, specificity conflicts, failsafes, GSAP vs CSS race. JSON estruturado no output. Prompt: `docs/prompts/gemini-gate4-editorial.md`.

**→ CHECKPOINT:** apresentar ao Lucas. Lucas aprova/rejeita sugestoes Gemini individualmente.

### QA.4 — Fix + Re-Audit

Aplicar fixes aprovados por Lucas:

1. Editar HTML/CSS conforme aprovado
2. `npm run build:cirrose`
3. Re-capturar PNGs + video do slide
4. Re-rodar QA.2 (Opus) nas dimensoes afetadas
5. Re-rodar QA.3 (Gemini) se fix foi significativo
6. Atualizar scorecard

**Max 3 iteracoes.** Se nao convergir:
- Registrar issues remanescentes em NOTES.md
- Marcar slide como DONE com ressalvas no AUDIT-VISUAL.md
- Mover para proximo slide

**Output:** scorecard re-auditado + diff visual.
**→ CHECKPOINT:** apresentar ao Lucas, esperar OK antes de atualizar docs.

---

## 5. Anti-Drift (embutido)

### Check a cada 30 minutos

O agente DEVE se perguntar:

1. "Estou no mesmo slide que comecei?"
2. "O slide que comecei ja avancou de estado?"
3. "Quantos slides avancaram nesta sessao?"

Se mudou de slide sem fechar o anterior → **PARAR, voltar, fechar ate SYNCED minimo.**

### Excecoes legitimas

- Bloqueio: precisa de dado do Lucas, PMID nao encontrado, dependencia de outro slide
- Lucas pediu explicitamente para mudar de foco
- Sessao mobile (sem dev server): docs e decisoes sao trabalho valido

### Regra dos 3 commits

Apos 3 commits consecutivos sem arquivo em `aulas/cirrose/slides/` ou `cirrose.css`:
- Pausar e perguntar: "3 commits sem tocar em slides. Continuar ou voltar ao produto?"

### Contraponto obrigatorio

Para toda decisao nao-trivial, o agente DEVE:
1. Apresentar o lado oposto — mesmo que concorde
2. Explicitar trade-offs
3. Dar recomendacao

---

## 6. Final de Sessao (obrigatorio)

Antes de encerrar, SEMPRE:

1. **Qual slide?** Nome e ID.
2. **Qual estado ficou?** Estado na maquina.
3. **HANDOFF.md** com estado REAL (nao aspiracional).
4. **CHANGELOG.md** se slide mudou de estado.
5. **ERROR-LOG.md** se erro novo encontrado.
6. **NOTES.md** se decisao tomada.

**Teste:** outro agente amanha abre sessao, le HANDOFF.md, e sabe EXATAMENTE:
- Onde retomar
- O que falta
- O que NAO fazer (bloqueios, decisoes travadas)

---

## 7. Tabela de Propagacao

| Mudei... | Atualizar tambem... |
|----------|---------------------|
| h2 no HTML | `_manifest.js` headline, `narrative.md` |
| `<section id>` | TODAS 9 superficies (ver slide-rules.md) |
| CSS do slide | `AUDIT-VISUAL.md` se afeta score |
| Dados numericos | `evidence-db.md`, notes `[DATA]` tag |
| Posicao no deck | `_manifest.js` ordem, `narrative.md` |
| Click-reveals (add/remove) | `_manifest.js` clickReveals, `slide-registry.js` |
| customAnim | `_manifest.js` customAnim, `slide-registry.js` |
| Qualquer coisa no slide | `HANDOFF.md` estado do slide |

**Regra:** se voce editou um slide e NAO atualizou HANDOFF → sessao esta incompleta.

---

## 8. Conteudo que Vende

Antes de fechar CONTENT, o agente DEVE considerar (nao bloquear):

- **Atualizado?** Ultima guideline/trial relevante? Se >2 anos, verificar.
- **Gruda?** Tem numero ancora, regra de bolso, mnemônico?
- **Novo?** Angulo que a audiencia nao ouviu em outras palestras?
- **Expertise-reversal?** Congress = zero revisao basica. Ir direto ao actionable.

Estas sao sugestoes, nao gates. O agente pode registrar em NOTES.md para Lucas decidir.

---

## 9. Regras de Sessao

- **Restart obrigatório a cada 2-3h de uso.** `/compact` NÃO reinicia o processo Bun.
  Fechar e reabrir o Claude Code é a única forma de liberar memória.
- **Commitar checkpoint antes de sessões QA/Playwright.**
  Formato: `wip: checkpoint <contexto> antes de <operação pesada>`
- **Monitorar RAM no Task Manager** durante sessões com Playwright.
  Se RSS > 3GB: parar, commitar, reiniciar.

---

## 10. Tooling Reference

### Playwright (screenshots + regra obrigatória)

Toda sessão que usar Playwright DEVE chamar `browser_close()` ao terminar capturas.
Chromium headless consome 300-500MB por instância. Sem close, acumula até crashar.

Sequência correta:
1. browser_launch()
2. navigate + screenshots (quantos precisar)
3. browser_close()  ← OBRIGATÓRIO
4. Só então seguir com auditoria Gemini ou outras tarefas

```bash
# Dev server deve estar ativo
npm run dev

# Screenshots por batch (pipeline ativo)
node aulas/cirrose/scripts/qa-batch-screenshot.mjs --act A1
```

> Video capture via Playwright `recordVideo` API: `[TODO — not yet implemented]`.
> Referencia futura: `recordVideo: { dir: 'qa-screenshots/{slide-id}/', size: { width: 1280, height: 720 } }`

### Gemini API

Modelo unico (decisao Lucas 2026-03-18):

| Modelo | Uso |
|--------|-----|
| gemini-3.1-pro-preview | SEMPRE. Per-slide e deck-level. API REST direta. |

> Gemini 2.5-flash e 2.5-pro descontinuados para este projeto.

### API Keys

Keys no Windows User env vars. Se sessao nao herdar:
```bash
export GEMINI_API_KEY="$(powershell -Command "[System.Environment]::GetEnvironmentVariable('GEMINI_API_KEY', 'User')")"
```

### Contraste

- Texto primario (headlines, valores): >= 7:1 (AAA)
- Texto secundario (labels, refs): >= 6:1
- Large text hero: >= 4.5:1 (AA large)
- Testar com a11y MCP (`mcp__a11y__check_color_contrast`) no profile ativo, ou a11y-contrast via profile `qa`

---

## 11. Estado dos Slides (referencia → HANDOFF.md)

A tabela canonica de estados vive em `HANDOFF.md`, secao "Estado dos Slides".
Este doc define a maquina; HANDOFF registra o estado de cada slide.

---

## Deprecated

> **QA-WORKFLOW.md** foi deletado (2026-03-18). Detalhes historicos de tooling perdidos — nao eram mais referenciados.
> O loop de QA e definido por ESTE documento (secao 4).

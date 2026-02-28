# DIAGNÓSTICO COMPLETO DO REPOSITÓRIO

> **Data:** 27/fev/2026  
> **Regra:** Nenhum arquivo foi alterado. Apenas leitura e reporte.

---

# FASE 1 — O que existe?

Lista de TODOS os arquivos (exceto .git/, node_modules/, dist/).

Formato: `caminho|tamanho_bytes|data_modificação|binário?`

## Raiz e config

| Caminho | Tamanho | Data | Binário |
|---------|---------|------|---------|
| .env.example | 892 | 2026-02-26 23:46 | texto |
| .gitattributes | 42 | 2026-02-15 21:21 | texto |
| .gitignore | 830 | 2026-02-26 23:37 | texto |
| .mcp.json | 1535 | 2026-02-15 21:14 | texto |
| AGENTS.md | 2477 | 2026-02-24 13:04 | texto |
| CLAUDE.md | 2466 | 2026-02-27 04:05 | texto |
| codex_progresso.log | 2280 | 2026-02-24 12:48 | texto |
| CURSOR.md | 4577 | 2026-02-27 02:57 | texto |
| nul | 0 | 2026-02-24 21:01 | [ARTIFACT Windows] |
| package-lock.json | 98561 | 2026-02-22 00:16 | texto |
| package.json | 1303 | 2026-02-27 04:11 | texto |
| playwright.config.ts | 611 | 2026-02-21 15:22 | texto |
| progresso.log | 918 | 2026-02-24 12:48 | texto |
| temp-filelist.txt | 0 | 2026-02-27 04:12 | texto (temporário) |
| vite.config.js | 1423 | 2026-02-24 12:16 | texto |

## .claude/

| Caminho | Tamanho | Data | Binário |
|---------|---------|------|---------|
| .claude/launch.json | 223 | 2026-02-26 10:50 | texto |
| .claude/settings.json | 223 | 2026-02-15 21:14 | texto |
| .claude/settings.local.json | 3229 | 2026-02-26 23:55 | texto |
| .claude/agents/qa-engineer.md | 1266 | 2026-02-21 14:29 | texto |
| .claude/agents/reference-manager.md | 1559 | 2026-02-21 14:29 | texto |
| .claude/agents/slide-builder.md | 1956 | 2026-02-21 14:29 | texto |
| .claude/commands/evidence.md | 1337 | 2026-02-15 21:14 | texto |
| .claude/commands/export.md | 951 | 2026-02-15 21:14 | texto |
| .claude/commands/new-slide.md | 971 | 2026-02-15 21:14 | texto |
| .claude/commands/review.md | 1512 | 2026-02-15 21:14 | texto |
| .claude/rules/css-errors.md | 3526 | 2026-02-13 20:29 | texto |
| .claude/rules/design-principles.md | 5727 | 2026-02-13 20:24 | texto |
| .claude/rules/design-system.md | 6748 | 2026-02-24 13:04 | texto |
| .claude/rules/medical-data.md | 3181 | 2026-02-20 11:43 | texto |
| .claude/rules/motion-qa.md | 5615 | 2026-02-25 21:41 | texto |
| .claude/rules/reveal-patterns.md | 3948 | 2026-02-13 20:24 | texto |
| .claude/rules/slide-editing.md | 1459 | 2026-02-13 20:24 | texto |
| .claude/skills/assertion-evidence/SKILL.md | 2097 | 2026-02-15 21:14 | texto |
| .claude/skills/medical-data/SKILL.md | 1414 | 2026-02-15 21:14 | texto |

## .cursor/

| Caminho | Tamanho | Data | Binário |
|---------|---------|------|---------|
| .cursor/mcp.json | 1795 | 2026-02-26 23:49 | texto |
| .cursor/agents/reference-checker.md | 1650 | 2026-02-26 04:01 | texto |
| .cursor/rules/*.mdc | 6 arquivos | — | texto |
| .cursor/skills/*/SKILL.md | 2 arquivos | — | texto |

## .playwright-mcp/

| Caminho | Tamanho | Data | Binário |
|---------|---------|------|---------|
| console-*.log | 138–417 | 2026-02-20..26 | texto |
| page-*.png | 30406–31376 | 2026-02-25 23:11 | binário |

## agents/

11 arquivos .md (01-planner.md … 11-long-context-auditor.md) — texto, ~4–5 KB cada.

## audit-export/

Snapshot de auditoria (24–26/fev): AGENTS.md, AUDIT-VISUAL.md, cirrose-CLAUDE.md, CLAUDE.md, HANDOFF.md, QA-VISUAL-24fev.md, css/*, js/*, rules/*, evidence/*, html/*. — **Duplicata** do source atual.

## aulas/

| Caminho | Tamanho | Data | Binário |
|---------|---------|------|---------|
| aulas/calibracao.html | 2738 | 2026-02-15 21:15 | texto |
| aulas/cirrose/archetypes.css | 15097 | 2026-02-27 03:14 | texto |
| aulas/cirrose/AUDIT-VISUAL.md | 23561 | 2026-02-27 04:03 | texto |
| aulas/cirrose/CHANGELOG.md | 6026 | 2026-02-27 04:11 | texto |
| aulas/cirrose/cirrose.css | 21828 | 2026-02-27 03:51 | texto |
| aulas/cirrose/CLAUDE.md | 4448 | 2026-02-27 04:08 | texto |
| aulas/cirrose/HANDOFF.md | 5530 | 2026-02-27 04:09 | texto |
| aulas/cirrose/index.html | 53163 | 2026-02-27 04:05 | texto |
| aulas/cirrose/index.stage-b.html | 47112 | 2026-02-24 21:22 | texto |
| aulas/cirrose/index.stage-c.html | 53342 | 2026-02-27 03:57 | texto |
| aulas/cirrose/index.template.html | 1479 | 2026-02-27 03:56 | texto |
| aulas/cirrose/slide-registry.js | 2516 | 2026-02-27 04:01 | texto |
| aulas/cirrose/assets/*.png | 2 arquivos | — | binário |
| aulas/cirrose/qa-screenshots/stage-c/*.png | 28 arquivos | — | binário |
| aulas/cirrose/slides/*.html | 28 arquivos | — | texto |
| aulas/cirrose/slides/_manifest.js | 8129 | 2026-02-27 03:44 | texto |
| aulas/cirrose/scripts/build-html.ps1 | 1256 | 2026-02-27 04:01 | texto |
| aulas/cirrose/scripts/split-slides.js | 2007 | 2026-02-27 04:01 | texto |
| aulas/grade/*.html | 3 | — | texto |
| aulas/metanalise/* | 4 | — | texto |
| shared/assets/fonts/*.woff2 | 4 | — | binário |
| shared/css/base.css | 16276 | — | texto |
| shared/js/*.js | 4 | — | texto |

## docs/

| Caminho | Tamanho | Data | Binário |
|---------|---------|------|---------|
| docs/biblia-narrativa.md | 19821 | 2026-02-24 23:09 | texto |
| docs/blueprint-cirrose.md | 14647 | 2026-02-27 04:09 | texto |
| docs/cirrose-scope.md | 2092 | 2026-02-27 04:11 | texto |
| docs/HANDOFF.md | 2571 | 2026-02-27 04:12 | texto |
| docs/HANDOFF_SYNC-CURSOR-2026-02-26.md | 1055 | 2026-02-26 11:21 | texto |
| docs/MCP-ACADEMICOS.md | 1299 | 2026-02-26 23:49 | texto |
| docs/MCP-ENV-VARS.md | 1845 | 2026-02-26 11:21 | texto |
| docs/metanalise-scope.md | 2520 | 2026-02-15 21:14 | texto |
| docs/SETUP.md | 5178 | 2026-02-15 21:14 | texto |
| docs/SYNC-NOTION-REPO.md | 1458 | 2026-02-23 23:06 | texto |
| docs/ZIP-LIMPO-PROTOCOLO.md | 1724 | 2026-02-26 23:37 | texto |
| docs/evidence/cirrose-references.json | 5107 | 2026-02-15 21:14 | texto |

## exports/

| Caminho | Tamanho | Data | Binário |
|---------|---------|------|---------|
| exports/aulas-magnas-cirrose-ia-20260226.zip | 1512821 | 2026-02-26 23:55 | binário |
| exports/aulas-magnas-cirrose-ia-20260226/* | ~50 arquivos | — | texto/binário |

## scripts/

| Caminho | Tamanho | Data | Binário |
|---------|---------|------|---------|
| scripts/build-zip-limpo-ia.ps1 | 4814 | 2026-02-26 23:45 | texto |
| scripts/export-pdf.js | 2790 | 2026-02-15 21:14 | texto |
| scripts/export-screenshots.js | 2778 | 2026-02-15 21:14 | texto |
| scripts/install-fonts.js | 4083 | 2026-02-15 21:14 | texto |
| scripts/lint-slides.js | 6728 | 2026-02-15 21:15 | texto |
| scripts/qa-accessibility.js | 2753 | 2026-02-15 21:14 | texto |
| scripts/qa-pdf-stage-b.js | 1608 | 2026-02-24 22:45 | texto |
| scripts/qa-screenshots-hash.js | 2276 | 2026-02-26 00:26 | texto |
| scripts/qa-screenshots-stage-a.js | 2044 | 2026-02-24 22:44 | texto |
| scripts/qa-screenshots-stage-c.js | 3116 | 2026-02-25 20:58 | texto |
| scripts/run-pubmed-mcp.js | 3110 | 2026-02-26 11:21 | texto |
| scripts/transcribe-lecture.js | 13960 | 2026-02-15 21:14 | texto |

## prompts/

5 arquivos .md (gemini-*, openai-*) — texto.

---

# FASE 2 — Conteúdo dos arquivos de texto

*(Ver REPO-DIAGNOSTIC.md para detalhes dos 20 arquivos principais.)*

## Resumo por categoria

### Config (package.json, vite, playwright)
- **package.json:** 1 linha (minified). Scripts: dev, dev:grade, dev:cirrose, dev:metanalise, build, build:cirrose, qa:screenshots:cirrose (→ qa-screenshots-stage-c.js), lint:slides, export:pdf, export:screenshots, qa:a11y, transcribe, zip:ia.
- **vite.config.js:** 47 linhas. `globSync` importado mas não usado. `open: '/aulas/grade/index.html'` — dev abre grade, não cirrose.
- **playwright.config.ts:** `testDir: './tests'` — **tests/ não existe**.

### shared/js/core
- **engine.js:** 357 linhas. Exporta initReveal, createAnimationDispatcher, startCheckpointTimer, initAula.
- **case-panel.js:** 195 linhas. HEX hardcoded em renderTimeline(). gsapRef não usado.
- **click-reveal.js:** 65 linhas. Limpo.
- **meld-calc.js:** 167 linhas. `#1a1a2e` literal. Sem null check em inputs.

### aulas/cirrose
- **slide-registry.js:** 70 linhas. Importa panelStates de _manifest. Exporta customAnimations, panelStates, wireAll.
- **_manifest.js:** 65 linhas. Ordem: s-title (1), s-hook (2), s-a1-01 (3)... Source of truth.
- **build-html.ps1:** 37 linhas. Regex `file:\s*'([^']+)'` para parse do manifest.
- **split-slides.js:** 58 linhas. Mapeia por id. Regex frágil para HTML.

### MDs
- **CLAUDE.md (raiz):** Ordem correta (s-hook pos 2). Plan C = default.
- **CURSOR.md:** Ordem ERRADA — s-hook pos 4 (deveria ser 2). Step 0 greps index.stage-c.html.
- **aulas/cirrose/CLAUDE.md:** Atualizado. Workflow modular.
- **aulas/cirrose/HANDOFF.md:** Slide map atualizado. Wiring table.
- **docs/cirrose-scope.md:** Marcado SUPERSEDED → blueprint-cirrose.

---

# FASE 3 — Como tudo se conecta?

## Grafo de dependências

```
package.json
├── vite → vite.config.js
├── build:cirrose → aulas/cirrose/scripts/build-html.ps1
├── qa:screenshots:cirrose → scripts/qa-screenshots-stage-c.js
└── ...

vite.config.js
└── discoverEntries() → aulas/*/index*.html

aulas/cirrose/index.template.html
├── imports: reveal.js, gsap, base.css, cirrose.css, archetypes.css, engine.js, click-reveal.js, case-panel.js, meld-calc.js, slide-registry.js
└── %%SLIDES%% ← build-html.ps1

build-html.ps1
├── lê: slides/_manifest.js
├── lê: index.template.html
├── lê: slides/*.html (28 arquivos)
└── escreve: index.html

slide-registry.js
├── importa: panelStates de slides/_manifest.js
└── wireAll(Reveal, gsap, { anim, CasePanel, ClickReveal, MeldCalc })

index.stage-c.html
├── mesma estrutura de imports que template
└── slides embutidos (monolítico)

qa-screenshots-stage-c.js
├── URL: index.stage-c.html?qa=1
├── PORT: 5173 (default)
└── output: aulas/cirrose/qa-screenshots/stage-c/
```

## Arquivos órfãos (não referenciados)

| Arquivo | Nota |
|---------|------|
| scripts/qa-screenshots-stage-a.js | Não está em package.json |
| scripts/qa-screenshots-hash.js | Não está em package.json |
| scripts/qa-pdf-stage-b.js | Não está em package.json |
| audit-export/* | Snapshot temporário; .gitignore |
| qa-screenshots/stage-c-floating/* | Output de qa-screenshots-hash.js |
| .playwright-mcp/* | Logs MCP |
| codex_progresso.log, progresso.log | Logs de desenvolvimento |
| nul | Artefato Windows |

## Referências quebradas

| Origem | Referência | Status |
|--------|------------|--------|
| playwright.config.ts | testDir: './tests' | **tests/ não existe** |
| CURSOR.md | Ordem s-hook pos 4 | **Implementação real: pos 2** |
| .gitignore | *.png | QA screenshots em qa-screenshots/ ficam ignorados |
| qa-screenshots-stage-c.js | PORT 5173 | Vite default é 3000 |

## Duplicações

| Duplicata | Original |
|-----------|----------|
| audit-export/* | Source em aulas/, shared/, docs/ |
| .claude/rules/* vs .cursor/rules/* | Conteúdo similar (mdc vs md) |
| .claude/skills/* vs .cursor/skills/* | Skills similares |
| .mcp.json vs .cursor/mcp.json | Configs diferentes (pubmed, etc.) |

## Conflitos

| Conflito | Arquivo A | Arquivo B |
|----------|-----------|-----------|
| Ordem slide cirrose | CURSOR.md: s-hook pos 4 | _manifest.js, CLAUDE.md: s-hook pos 2 |
| Arquivo default cirrose | HANDOFF: index.html (gerado) | qa-screenshots-stage-c: index.stage-c.html |
| Naming slides | AGENTS.md: S{NNN}_{kebab}.html | cirrose: NN-nome.html |

---

# FASE 4 — O que está quebrado ou em risco?

## Referências quebradas

1. **playwright.config.ts** → `testDir: './tests'` — pasta tests/ não existe.
2. **CURSOR.md** → Ordem "Definitiva v3" com s-hook pos 4 — divergente de _manifest.js (pos 2).

## Código morto / não usado

1. **vite.config.js** — `globSync` importado, nunca usado.
2. **case-panel.js** — `gsapRef` no constructor, nunca usado.

## Inconsistências

1. **Naming:** AGENTS.md diz `S{NNN}_{kebab}.html`; cirrose usa `NN-nome.html`.
2. **PORT:** qa-screenshots-stage-c.js default 5173; Vite default 3000; preview usa 4173.
3. **Arquivo cirrose:** dev:cirrose abre index.html; QA script usa index.stage-c.html.

## Hacks / violações de regras

1. **case-panel.js** — HEX em renderTimeline(): `#888899`, `#c4960a`, `#c03030`, `#2a8a6a`. Regra: "var() obrigatório".
2. **meld-calc.js** — `#1a1a2e` literal. Deveria usar var(--text-primary).

## TODOs / FIXMEs

*(Busca não exaustiva — não foram encontrados comentários explícitos TODO/FIXME nos arquivos principais.)*

## Outros riscos

1. **build-html.ps1** — Regex `file:\s*'([^']+)'` quebra se manifest usar aspas duplas.
2. **split-slides.js** — Regex `</div>\s*</div>\s*<script` frágil ante mudança de HTML.
3. **.gitignore** — `*.png` ignora qa-screenshots/stage-c/*.png (28 screenshots).

---

# ANEXO — REPO-DIAGNOSTIC.md

O arquivo `REPO-DIAGNOSTIC.md` (gerado por subagent) contém análise detalhada de 20 arquivos com:
- Primeiras/últimas 10 linhas
- Exports/imports
- Anomalias por arquivo

---

*Fim do diagnóstico. Nenhum arquivo foi alterado.*

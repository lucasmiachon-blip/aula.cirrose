# Ecossistema — Aulas Magnas

> Modelos não competem — cada um tem um papel específico no pipeline.
> Handoff certo = sem retrabalho. Ver pipeline resumido no CLAUDE.md (Step 0).
> Última atualização: 2026-03-19 (NotebookLM MCP + nlm-skill, skill count 19→20)

---

## Benchmarks — Março 2026

> **Dados de mar/2026.** Verificar [arena.ai/leaderboard](https://arena.ai/leaderboard/code) mensalmente para atualizacoes.
> Fontes: [WebDev Arena](https://web.lmarena.ai/leaderboard) · [NxCode](https://www.nxcode.io) · [VentureBeat](https://venturebeat.com) · [Vellum](https://www.vellum.ai/blog/claude-opus-4-6-benchmarks)
> ✅ **Gemini 3 Pro preview encerrado 9 mar 2026** → migrado para Gemini 3.1 Pro ($2/M, mesmo preço)

| Modelo | WebDev Arena (Elo) | SWE-bench Verified | GPQA Diamond | OSWorld | Destaque |
|--------|-------------------|--------------------|--------------|---------|---------|
| **Gemini 3.1 Pro** | APEX Agents #1 | 80.6% | **94.3%** | — | ARC-AGI-2 77.1% (2× 3 Pro) · LiveCode Elo 2887 · SVG animado |
| **Gemini 3 Flash** | 1416 (#8, ↑↑↑) | **78%** | 90.4% | — | 3× mais rápido · $0.50/M |
| **Gemini 3.1 Flash-Lite** | — | — | 86.9% | — | 382 tok/s · $0.25/M input · 2.5× faster TTFA vs 2.5 Flash · lançado 3 mar 2026 |
| **Claude Opus 4.6** | — | 80.8% | 91.3% | 72.7% | τ²-bench Telecom 99.3% · MRCR 76% · 1M ctx |
| **Claude Sonnet 4.6** | — | 79.6% | 74.1% | 72.5% | 5× mais barato que Opus · ARC-AGI-2 +4.3× |
| **GPT-5.4** | — | — | — | **75%** (> humano 72.4%) | Native computer use · lançado 5 mar 2026 |
| **GPT-5.2** | — | 80.0% | — | 47.3% | Predecessor GPT-5.4 |
| **Claude Opus 4.5 (Thinking)** | **1510 #1** (arena geral) | — | — | — | Topo WebDev geral · com extended thinking |
| **ChatGPT Agent** | — | — | — | — | BrowseComp 68.9% · browser automation · MCP 100+ apps |

---

## Pipeline Multimodal — Roteamento por Modelo

> Roteamento calibrado por benchmark. Ver `docs/KPIs.md` para decisão rápida por tarefa.

| Papel | Modelo | Benchmark | Edita repo? |
|-------|--------|-----------|-------------|
| **Implementador** | Claude Code (Opus/Sonnet 4.6) | SWE 80.8% · τ²-bench 99.3% | ✅ Único que commita |
| **Arquiteto clínico** | Claude Opus 4.6 (claude.ai) | GPQA 91.3% · METR 14.5h | ❌ Specs e decisões |
| **Visual QA + CSS debug** | Gemini 3.1 Pro | SWE 80.6% · APEX #1 · VideoMME 84.8% · $2/M | ❌ Relatório visual |
| **Lint rápido / batch** | Gemini 3.1 Flash-Lite | 382 tok/s · $0.25/M · GPQA 86.9% | ❌ Quick fixes |
| **Auditor narrativo** | GPT-5.4 (ChatGPT Agent) | OSWorld 75% · BrowseComp 82.7% | ❌ Tom e adequação |
| **Pesquisador** | Perplexity Ultra / Computer | Web real-time · roda horas overnight | ❌ Dados e PMIDs |
| **Verificador citações** | Scite MCP | Supporting/contradicting por artigo | ❌ Score de evidência |

### Regras da aliança
1. **Só Claude Code edita e commita** — todos os outros produzem relatórios
2. **Lucas arbitra** — quando dois modelos divergem, Lucas decide
3. **Handoff claro** — código→visual = Gemini. Visual→clínico = Opus/GPT. Nunca pular etapa
4. **Sem redundância** — se Gemini já auditou visual, GPT não repete

---

## Ferramentas Completas (non-model tools; modelos → Pipeline acima)

| Ferramenta | Uso no pipeline | MCP | Status |
|------------|----------------|-----|--------|
| **Perplexity Ultra** | Pesquisa em tempo real | Sim | ✅ Ativo |
| **Scite** | Citações | Sim | ✅ MCP streamableHttp |
| **Consensus** | Meta-analises | MCP claude.ai nativo | ✅ Ativo |
| **Elicit** | Extração de papers | — | Manual |
| **Notion** | Specs · Bíblia · References | Sim | ✅ MCP |
| **Zotero** | Referências | Sim | ✅ MCP |
| **Canva Pro** | Assets visuais | — | Manual |
| **Excalidraw** | Diagramas · storyboards | Sim (claude.ai nativo) | ✅ MCP |

---

## GitHub (lucasmiachon-blip)

> Paths são exemplos — ajustar ao seu ambiente.

| Repo | Path local | Conteúdo |
|------|-----------|----------|
| aulas_core | C:\Dev\Projetos\Aulas_core | Origem migração |
| aulas_core | C:\Dev\Projetos\Aulas2 | GRADE, Osteoporose |
| aulas-magnas | C:\Dev\Projetos\aulas-magnas | **Hub atual** — Cirrose, GRADE, Osteoporose |

---

## MCPs (Inventario)

Config local: `.mcp.json`. Profiles: `.mcp-profiles/{dev,research,qa,full}.json`. Switch: `npm run mcp:dev|research|qa|full`.

### Profile dev (default — .mcp.json)

| MCP | Uso no pipeline |
|-----|----------------|
| filesystem | Acesso ao projeto |
| playwright | Screenshots, QA visual |
| eslint | Lint slides |
| lighthouse | Performance, a11y, SEO |
| a11y | Acessibilidade WCAG |
| notion | Specs, Biblia Narrativa, References DB |
| fetch | HTTP requests |
| sharp | Image processing |

### Profile research (adiciona ao dev)

| MCP | Uso |
|-----|-----|
| pubmed | Verificar PMIDs, buscar evidencia |
| crossref | Validar DOIs |
| semantic-scholar | Busca academica |
| perplexity | Pesquisa ampliada (pago) |
| notebooklm | Q&A grounded em artigos (PDFs completos) |

### Profile full (todos — 27 servers)

Adiciona: notebooklm, biomcp, pubmed-simple, zotero, arxiv, google-scholar, scite, clinicaltrials, memory, ui-ux-pro, attention-insight, design-comparison, page-design-guide, floto.

**Variaveis de ambiente:** `docs/MCP-ENV-VARS.md` · `.env.example` (fonte canonica)

---

## Como Atualizar

1. **Nova ferramenta:** Adicionar nesta tabela com uso + se tem MCP
2. **MCP novo:** Configurar em `.mcp.json` (Claude Code) ou `.cursor/mcp.json` (Cursor), testar `claude mcp list`
3. **Skill novo:** Criar em `.claude/skills/[nome]/SKILL.md` (Claude Code) ou `.cursor/skills/[nome]/SKILL.md` (Cursor). Ver [docs/SKILLS.md](SKILLS.md)
4. **Rule novo:** Criar em `.claude/rules/[nome].md` (Claude Code) ou `.cursor/rules/[nome].mdc` (Cursor). Ver [docs/RULES.md](RULES.md)
5. **Busca semanal:** Rodar prompt em `docs/prompts/weekly-updates.md`
6. **Benchmarks:** Verificar [arena.ai/leaderboard](https://arena.ai/leaderboard/code) mensalmente

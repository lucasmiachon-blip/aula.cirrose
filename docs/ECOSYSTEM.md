# Ecossistema — Aulas Magnas

> Registro de ferramentas, MCPs e versões. Atualizar conforme o ecossistema muda.
> Última atualização: 2026-03-07 (benchmarks verificados via WebSearch)

---

## Benchmarks — Março 2026

> Fontes: [WebDev Arena](https://web.lmarena.ai/leaderboard) · [NxCode](https://www.nxcode.io) · [VentureBeat](https://venturebeat.com) · [DataCamp](https://www.datacamp.com)

| Modelo | WebDev Arena (Elo) | SWE-bench Verified | GPQA Diamond | OSWorld | Destaque |
|--------|-------------------|--------------------|--------------|---------|---------|
| **Gemini 3.1 Pro** | ~1500 (APEX #1) | 80.6% | **94.3%** | — | Reasoning 2× Gemini 3 Pro · SVG animado |
| **Gemini 3 Pro** | **1487 #1** | 76.2% | — | — | WebDev Arena líder histórico |
| **Gemini 3 Flash** | 1416 (#8, ↑↑↑) | **78%** (> 3 Pro) | 90.4% | — | 3× mais rápido · $0.50/M · SWE > Pro |
| **Claude Opus 4.6** | — | 80.8% | 91.3% | 72.7% | τ²-bench 91.9% · 1M ctx · 128K output |
| **Claude Sonnet 4.6** | — | 79.6% | 74.1% | 72.5% | 5× mais barato que Opus · preferido por 70% users |
| **GPT-5.4** | — | — | — | **75%** | Native computer use · 1M ctx · lançado 5 mar 2026 |
| **GPT-5.2** | — | 80.0% | — | 47.3% | Predecessor GPT-5.4 |
| **Claude Opus 4.5 (Thinking)** | **1510 #1** (arena geral) | — | — | — | Topo WebDev geral · com extended thinking |

---

## Pipeline Multimodal — Papel de Cada Modelo

| Modelo / Ferramenta | Papel neste projeto | Por quê |
|--------------------|--------------------|---------|
| **Claude Opus 4.6** (claude.ai chat) | Design de slides · diagnóstico UI/UX · decisões clínicas · spec para Gemini | GPQA 91.3% · raciocínio profundo · τ²-bench 91.9% |
| **Claude Code** (Sonnet 4.6, esta sessão) | Implementação · debug · build · git | SWE 79.6% · 5× mais barato · OSWorld 72.5% |
| **Gemini 3.1 Pro** | Debug CSS/JS/GSAP orientado por Opus · SVG animado · QA visual de vídeo | SWE 80.6% · SVG nativo · APEX Agents #1 · $2/M |
| **Gemini 3 Flash** | Iterações rápidas · lint · small fixes · protótipos | 3× mais rápido · $0.50/M · SWE 78% (> Gemini 3 Pro) |
| **Perplexity Computer** | Pesquisa clínica multi-modelo · workflows longos · orquestração | Coordena 19 modelos · roda horas · Notion/GitHub/Slack |
| **ChatGPT Agent (GPT-5.4)** | QA browser automation · computer use · OSWorld tasks | 75% OSWorld (> humano médio 72.4%) · native computer use |
| **Perplexity Ultra** (MCP) | Pesquisa em tempo real · verificação de dados clínicos | Acesso web em tempo real |
| **Scite** (MCP) | Supporting/contradicting por artigo | Verificação de citações |
| **Zotero** (MCP) | Biblioteca de referências · DOIs | Gestão bibliográfica |

---

## Ferramentas Completas

| Ferramenta | Uso no pipeline | MCP | Status |
|------------|----------------|-----|--------|
| **Claude Opus 4.6** (claude.ai) | Design decisions · spec · clinical | — | ✅ Ativo |
| **Claude Code** (Sonnet 4.6) | Implementação · build | — | ✅ Esta sessão |
| **Gemini 3.1 Pro** | CSS/GSAP debug · SVG · video QA | → MCP planejado | ⏳ Setup pendente |
| **Gemini 3 Flash** | Lint · quick fix | → MCP planejado | ⏳ Setup pendente |
| **Perplexity Computer** | Orquestração multi-agente | — | ⏳ $200/mês Max |
| **ChatGPT Agent** (GPT-5.4) | Browser automation · computer use | — | ✅ Disponível |
| **Perplexity Ultra** | Pesquisa em tempo real | Sim | ✅ Ativo |
| **Scite** | Citações | Sim | ✅ MCP streamableHttp |
| **Consensus** | Meta-análises | — | Manual |
| **Elicit** | Extração de papers | — | Manual |
| **Notion** | Specs · Bíblia · References | Sim | ✅ MCP |
| **Zotero** | Referências | Sim | ✅ MCP |
| **Canva Pro** | Assets visuais | — | Manual |
| **Excalidraw** | Diagramas · storyboards | — | Notion embed |

---

## GitHub (lucasmiachon-blip)

> Paths são exemplos — ajustar ao seu ambiente.

| Repo | Path local | Conteúdo |
|------|-----------|----------|
| aulas_core | C:\Dev\Projetos\Aulas_core | Origem migração |
| aulas_core | C:\Dev\Projetos\Aulas2 | GRADE, Osteoporose |
| aulas-magnas | C:\Dev\Projetos\aulas-magnas | **Hub atual** — Cirrose, GRADE, Osteoporose |

---

## MCPs (Inventário)

| MCP | Uso no pipeline | Status |
|-----|----------------|--------|
| pubmed / pubmed-simple | Verificar PMIDs, buscar evidência | OK |
| crossref | Validar DOIs | OK |
| notion | Specs, Bíblia Narrativa, References DB | OK |
| playwright | Screenshots, QA visual | OK |
| a11y | Contraste, acessibilidade | OK |
| eslint | Lint slides | OK |
| memory | Contexto entre sessões | Fix path |
| biomcp | Dados biológicos | OK |
| zotero | Referências | OK |
| perplexity / arxiv | Pesquisa ampliada | OK |
| scite | Citações, supporting/contradicting | OK |
| **gemini** | CSS debug · video QA | **⏳ Pendente config** |

**Variáveis de ambiente:** `docs/MCP-ENV-VARS.md` (NOTION_TOKEN, NCBI_API_KEY, ZOTERO_API_KEY)

---

## Como Atualizar

1. **Nova ferramenta:** Adicionar nesta tabela com uso + se tem MCP
2. **MCP novo:** Configurar em `.cursor/mcp.json`, testar `claude mcp list`
3. **Skill novo:** Criar em `.cursor/skills/[nome]/SKILL.md` (ver [docs/SKILLS.md](SKILLS.md))
4. **Rule novo:** Criar em `.cursor/rules/[nome].mdc` (ver [docs/RULES.md](RULES.md))
5. **Busca semanal:** Rodar prompt em `docs/prompts/weekly-updates.md`
6. **Benchmarks:** Verificar [arena.ai/leaderboard](https://arena.ai/leaderboard/code) mensalmente

# MCPs Academicos — Aulas Magnas

> Inventario completo de MCPs para pesquisa academica/clinica.
> Config local: `.mcp.json` (perfil ativo). Profiles: `.mcp-profiles/*.json`.
> Ultima revisao: 2026-03-17.

---

## MCPs Locais (self-hosted)

### Busca e Metadados

| MCP | Pacote | Runtime | Custo | Variavel .env |
|-----|--------|---------|-------|---------------|
| **pubmed** | `@cyanheads/pubmed-mcp-server` | npx | Gratis (key opcional — 10 req/s vs 3) | `NCBI_API_KEY` |
| **pubmed-simple** | `mcp-simple-pubmed` | uvx | Gratis | `PUBMED_EMAIL`, `NCBI_API_KEY` |
| **crossref** | `@botanicastudios/crossref-mcp` | npx | Gratis | — |
| **semantic-scholar** | `@jucikuo666/semanticscholar-mcp-server` | npx | Gratis (key opcional — limits maiores) | `SEMANTIC_SCHOLAR_API_KEY` |
| **arxiv** | `arxiv-paper-mcp-server` | uvx | Gratis | — |
| **google-scholar** | `@JackKuo666/google-scholar-mcp-server` | npx | Gratis (experimental) | — |
| **clinicaltrials** | `clinicaltrialsgov-mcp-server` | npx | Gratis | — |

### Biomedico Integrado

| MCP | Pacote | Runtime | Custo | Variavel .env |
|-----|--------|---------|-------|---------------|
| **biomcp** | `biomcp-python` | uvx | Gratis | — |

Funcoes: OpenFDA, clinical trials, gene info, variant data. Util para farmacovigilancia e busca de trials por droga.

### Gestao de Referencias

| MCP | Pacote | Runtime | Custo | Variavel .env |
|-----|--------|---------|-------|---------------|
| **zotero** | `zotero-mcp` | uvx | Gratis (Zotero local) | `ZOTERO_API_KEY`, `ZOTERO_LIBRARY_ID` |

### Analise e Citacoes

| MCP | Pacote | Runtime | Custo | Variavel .env |
|-----|--------|---------|-------|---------------|
| **scite** | streamableHttp `https://api.scite.ai/mcp` | — | Pago (Premium) | OAuth na 1a conexao |
| **perplexity** | `@perplexity-ai/mcp-server` | npx | Pago | `PERPLEXITY_API_KEY` |

---

## MCPs Claude.ai (nativos — sem config local)

Disponiveis automaticamente em claude.ai (Project Knowledge):

| MCP | Funcao | Custo |
|-----|--------|-------|
| **PubMed** (claude_ai) | Busca, metadados, full-text, citacoes | Incluso |
| **Scholar Gateway** | Semantic search academica | Incluso |
| **Consensus** | Busca com consenso cientifico | Incluso (limites por plano) |

---

## Profiles

| Profile | MCPs academicos incluidos | Uso |
|---------|--------------------------|-----|
| `dev` | 0 | Desenvolvimento de slides |
| `research` | pubmed, crossref, semantic-scholar, perplexity | Pesquisa de evidencias |
| `qa` | 0 | Quality assurance visual |
| `full` | Todos (12 academicos + QA + infra) | Sessoes intensivas |

Trocar profile: `npm run mcp:dev|research|qa|full`

---

## Pre-requisitos

- **Node/npx** — pubmed, crossref, semantic-scholar, perplexity, google-scholar, clinicaltrials, scite
- **uv/uvx** — biomcp, pubmed-simple, arxiv, zotero: `curl -LsSf https://astral.sh/uv/install.sh | sh`

---

## .env (variaveis academicas)

Ver `docs/MCP-ENV-VARS.md` e `.env.example` (fonte canonica). Keys relevantes: `NCBI_API_KEY`, `SEMANTIC_SCHOLAR_API_KEY`, `PERPLEXITY_API_KEY`, `ZOTERO_API_KEY`.

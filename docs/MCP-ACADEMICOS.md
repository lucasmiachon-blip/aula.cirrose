# MCPs acadêmicos — Aulas Magnas

> Sync com Aulas_core (2026-02-26). Config em `.cursor/mcp.json`.

## MCPs adicionados

| MCP | Custo | Comando | Variável .env |
|-----|-------|---------|----------------|
| **semantic-scholar** | Grátis (opcional key) | uv run FujishigeTemma/semantic-scholar-mcp | `SEMANTIC_SCHOLAR_API_KEY` |
| **arxiv** | Grátis | uvx arxiv-paper-mcp-server | — |
| **google-scholar** | Grátis (experimental) | npx @JackKuo666/google-scholar-mcp-server | — |
| **perplexity** | Pago | npx @perplexity-ai/mcp-server | `PERPLEXITY_API_KEY` |
| **Scite** | Pago (Premium) | streamableHttp — https://api.scite.ai/mcp | OAuth na 1ª conexão |

## O que adicionar ao .env

```env
# Semantic Scholar — opcional (grátis sem key, 100 req/5min)
SEMANTIC_SCHOLAR_API_KEY=

# Perplexity — opcional (pago)
PERPLEXITY_API_KEY=
```

## Pré-requisitos

- **uv** — para semantic-scholar e arxiv: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Node/npx** — para perplexity e google-scholar

## Scite

- **Requer:** Scite Premium (scite.ai/pricing)
- **Auth:** OAuth 2.0 — na primeira conexão você faz login com sua conta Scite
- **Config:** `"type":"streamableHttp","url":"https://api.scite.ai/mcp"` (já em .cursor/mcp.json)

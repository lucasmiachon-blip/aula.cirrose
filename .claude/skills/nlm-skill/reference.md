# nlm Quick Reference Card

> Para detalhes completos: ver SKILL.md neste diretorio.

## Regras Criticas

- `nlm login` antes de tudo (sessao ~20min)
- `--confirm` obrigatorio em create/delete
- NUNCA `nlm chat start` (REPL interativo) — usar `nlm notebook query`
- Deletar = SEMPRE perguntar ao usuario primeiro

## Top 10 CLI Commands

| Comando | O que faz |
|---------|-----------|
| `nlm login` | Autenticar (browser) |
| `nlm notebook list` | Listar notebooks |
| `nlm notebook create "Titulo"` | Criar notebook |
| `nlm source add <nb> --url "URL"` | Adicionar fonte (web/YouTube) |
| `nlm source add <nb> --text "..." --title "T"` | Adicionar texto |
| `nlm notebook query <nb> "pergunta"` | Q&A one-shot |
| `nlm audio create <nb> --confirm` | Gerar podcast |
| `nlm report create <nb> --confirm` | Gerar relatorio |
| `nlm source list <nb>` | Listar fontes |
| `nlm alias set <nome> <uuid>` | Alias para UUID |

## Top 10 MCP Tools

| Tool | Equivalente |
|------|-------------|
| `notebook_list` | `nlm notebook list` |
| `notebook_create` | `nlm notebook create` |
| `source_add` (source_type=url) | `nlm source add --url` |
| `source_add` (source_type=text) | `nlm source add --text` |
| `notebook_query` | `nlm notebook query` |
| `source_list_drive` | `nlm source list --drive` |
| `source_describe` | `nlm source describe` |
| `studio_create` | `nlm audio create` |
| `studio_status` | `nlm studio status` |
| `refresh_auth` | `nlm login` |

## Workflow Rapido

```bash
nlm login
nlm notebook create "Meu Notebook"     # retorna ID
nlm alias set meu <ID>
nlm source add meu --url "https://..."
nlm notebook query meu "Qual o resumo?"
nlm audio create meu --confirm          # podcast
```

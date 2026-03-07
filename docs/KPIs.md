# KPIs — Produção de Slides Aulas Magnas

> Framework de métricas para medir qualidade e eficiência do pipeline multimodelo.
> Criado: 2026-03-07 | Revisar mensalmente.

---

## Por Que Medir

Multi-agent workflows falham silenciosamente. Sem KPIs, não sabe se:
- Gemini está gerando menos retrabalho que Claude Code sozinho
- Opus está sendo usado onde Sonnet bastaria (custo desnecessário)
- Slides produzidos por sessão está aumentando ou estagnando
- Qualidade de primeiro draft está melhorando (ou não)

---

## KPIs Primários — Produção

| KPI | Definição | Meta | Como medir |
|-----|-----------|------|------------|
| **Slides/sessão** | Slides novos ou significativamente revisados por sessão | ≥ 3 | `grep -c '<section'` antes/depois |
| **Taxa de retrabalho** | % slides que precisam de revisão após "done" | ≤ 20% | Commits com msg `[FIX]` / total commits |
| **Primeiro-draft aprovado** | % slides que passam em lint + assertion-evidence sem revisão | ≥ 70% | `npm run lint:slides` score |
| **Tempo spec→revisão-ready** | Minutos desde spec Opus até slide pronto para revisão | ≤ 45 min | Timestamp commits |
| **Verificação de fonte** | % dados numéricos com PMID/DOI nos speaker notes | 100% | Manual review |

---

## KPIs Secundários — Qualidade

| KPI | Definição | Meta | Como medir |
|-----|-----------|------|------------|
| **Lint score** | `npm run lint:slides` pass rate | ≥ 90% | CI output |
| **A11y score** | Lighthouse accessibility por slide | ≥ 90 | mcp__lighthouse |
| **Densidade ≤ 30 palavras** | % slides com corpo ≤ 30 palavras | 100% | lint:slides |
| **Notes completas** | % slides com timing + pausa + fonte em notes | 100% | Manual review |
| **Zero `<ul>/<ol>`** | Slides sem listas no corpo | 100% | `grep -c '<ul\|<ol'` |

---

## KPIs de Pipeline — Eficiência Multimodelo

| KPI | Definição | Meta | Como medir |
|-----|-----------|------|------------|
| **Modelo certo para tarefa** | % tarefas roteadas ao modelo correto (não overkill/underfit) | ≥ 80% | Log de uso por modelo |
| **Handoff Opus→Gemini** | Tempo desde spec Opus até Gemini iniciar debug | ≤ 10 min | Timestamp manual |
| **Retrabalho Gemini** | % fixes do Gemini que precisam re-fix | ≤ 15% | Commits `[RE-FIX]` |
| **Sessão sem `/compact` forçado** | Sessões que terminam sem crise de contexto | ≥ 80% | Manual |

---

## Registro de Sessão (Template)

```markdown
## Sessão YYYY-MM-DD

| Métrica | Valor | Nota |
|---------|-------|------|
| Slides produzidos | N | Novos/revisados |
| Slides retrabalho | N | (%) |
| Lint pass rate | N% | — |
| Tempo médio spec→ready | Xmin | — |
| Modelos usados | Opus/Sonnet/Gemini | — |
| Commits [FIX] / total | N/N | taxa retrabalho |
| Lição da sessão | — | → lessons.md |
```

---

## Benchmarks de Referência (Estado Atual)

> Baseline medido em 2026-03-07, pré-pipeline multimodelo.

| Métrica | Baseline | Meta 30 dias | Meta 90 dias |
|---------|----------|-------------|-------------|
| Slides/sessão | ~2 | 4 | 6 |
| Taxa retrabalho | ~40% | 25% | 15% |
| Lint pass 1ª vez | ~60% | 75% | 90% |
| Fontes verificadas | ~70% | 90% | 100% |

---

## Roteamento por Tarefa (Decisão Rápida)

```
TAREFA                          → MODELO
─────────────────────────────────────────
Design do slide (do zero)       → Opus 4.6 (chat)
Spec clínica / evidence         → Opus 4.6 + Perplexity
HTML do slide                   → Gemini 3.1 Pro (orientado por spec Opus)
CSS fix / debug layout          → Gemini 3 Flash (iteração rápida)
GSAP animation debug            → Gemini 3.1 Pro (1M ctx, código)
Motion QA (vídeo)               → Gemini 3.1 Pro (multimodal)
Browser automation / QA         → ChatGPT Agent (GPT-5.4) ou Playwright MCP
Lint / assertion-evidence       → Claude Code (Sonnet 4.6, esta sessão)
Git / build / deploy            → Claude Code (Sonnet 4.6)
Pesquisa clínica profunda       → Perplexity Computer (19 modelos)
Referências / PMIDs             → PubMed MCP + Scite MCP
```

---

## Anti-padrões de Custo

| Anti-padrão | Impacto | Fix |
|-------------|---------|-----|
| Usar Opus 4.6 para lint/CSS fix | ~5× custo desnecessário | Usar Flash |
| Usar Gemini Flash para spec clínica | Risco de erro clínico | Usar Opus |
| Iterar HTML no chat Opus (não no IDE) | Lento + caro | Handoff para Gemini |
| Não usar MCP PubMed para dados | Risco de dado inventado | Always MCP first |
| Sessão >80% contexto sem /compact | Perda de detalhes + erro | Compactar antes |

---

## Revisão Mensal

Primeiro dia de cada mês:
1. Calcular KPIs do mês anterior com dados de git log
2. Comparar com metas
3. Ajustar roteamento se necessário
4. Atualizar esta tabela de benchmarks
5. Verificar novos modelos no [WebDev Arena](https://arena.ai/leaderboard/code)

# DOCS RATIONALIZATION AUDIT

> Auditoria: 2026-03-26. Escopo: 49 MDs do repo `aula_cirrose`.
> Metodo: leitura integral dos 12 MDs centrais + inventario completo + grep cruzado + verificacao de existencia.
> Agente: Claude Opus 4.6 (3 subagents paralelos + verificacao manual).

---

## 1. Executive Summary

O repo tem **documentacao funcional e bem estruturada** para um projeto de 44 slides com QA pipeline multimodal. A hierarquia de autoridade (CLAUDE.md > rules > docs > aulas/) e clara, e o XREF.md mapeia dependencias com rigor. O nucleo clinico (CASE.md, evidence-db.md, narrative.md, _manifest.js) esta protegido e correto. Nao ha crise documental — ha acumulo incremental pos-split do monorepo (2026-03-24).

A **principal fonte de custo de contexto** e o mandato de leitura integral do WT-OPERATING.md (462 linhas) no inicio de toda sessao. Somado ao CLAUDE.md (155L, auto-loaded) e HANDOFF.md (141L), um agente precisa processar ~760 linhas antes de tocar um slide. Desse total, ~350 linhas de WT-OPERATING.md sao especificacao QA que so se aplicam em sessoes de QA, nao em toda sessao.

A **principal oportunidade de simplificacao** e a deprecacao do HANDOFF-CLAUDE-AI.md (82L, dados desatualizados, referencia arquivo deletado, path de worktree extinto) e a cisao do WT-OPERATING.md em protocolo de sessao (~50L, mandatorio) + especificacao QA (~400L, sob demanda). Combinadas, essas acoes reduzem o custo de contexto mandatorio em ~480 linhas (~40%) sem perder nenhum conteudo.

---

## 2. Findings Table

| Arquivo | Papel atual | Problema | Evidencia | Severidade | Recomendacao |
|---------|-------------|----------|-----------|------------|--------------|
| `HANDOFF-CLAUDE-AI.md` | Snapshot para Claude.ai Project Knowledge | Dados stale (3 dias), estados de slide incorretos, path de worktree extinto, referencia arquivo deletado | L13: `wt-cirrose` (nao existe); L15: s-a1-01 "QA R11" (HANDOFF.md diz CONTENT); L53: `gemini-slide-editor.md` (deletado) | CRITICO | Deprecar ou auto-gerar |
| `WT-OPERATING.md` | Maquina de estados + QA pipeline + regras de sessao | 462L mandatorias para toda sessao; apenas ~50L (S1-S3) sao universais | L4: "Ler isto INTEIRO no inicio de TODA sessao" vs CLAUDE.md L153: "ler manualmente em sessoes QA" | ALTO | Cisao: sessao (S1-S3) + QA spec (S4+) |
| `XREF.md` L112 | Mapa de dependencias | Referencia `CLAUDE.md (cirrose)` que nao existe desde 2026-03-24 | `aulas/cirrose/CLAUDE.md` consolidado a root: CHANGELOG.md 2026-03-24 "2 arquivos → 1" | ALTO | Remover linha |
| `XREF.md` L130-137 | Mapa pares .claude/.cursor | Referencia `.cursor/rules/*.mdc` — diretorio nao existe | Glob `.cursor/**` retorna apenas `.cursor/mcp.json` | ALTO | Remover secao "Pares .claude <-> .cursor" |
| `docs/README.md` L51 | Indice de prompts | Link quebrado: `prompts/_archive/gemini-slide-editor.md` — diretorio nao existe | Glob `docs/prompts/_archive/**` = vazio | MEDIO | Remover linha (ja em strikethrough) |
| `CHANGELOG.md` (root) | Historico monorepo | Header "aulas-magnas" — nome de repo extinto | L1: `# Changelog — aulas-magnas` | MEDIO | Renomear header |
| `ERROR-LOG.md` (root) | Erros infra | Referencia worktree extinta + nome monorepo | L1: "aulas-magnas"; L12: `C:\Dev\Projetos\wt-cirrose` | MEDIO | Atualizar ou arquivar |
| `docs/MCP-ENV-VARS.md` | Variaveis de ambiente MCPs | Header "aulas-magnas" | L1: `(aulas-magnas)` | BAIXO | Renomear header |
| `docs/MCP-ACADEMICOS.md` | Inventario MCPs | Header "Aulas Magnas" | L1: `# MCPs Academicos — Aulas Magnas` | BAIXO | Renomear header |
| `docs/prompts/research-best-practices.md` | Prompt template | Path hardcoded extinto | L38: `cd c:\Dev\Projetos\aulas-magnas` | BAIXO | Atualizar path |
| `tasks/todo.md` L32 | Backlog infra | Referencia `docs/ECOSYSTEM.md` (deletado 2026-03-24) | CHANGELOG 2026-03-24: "8 arquivos meta/processo deletados (ECOSYSTEM...)" | BAIXO | Marcar como concluido |
| `tasks/lessons.md` L3 | Licoes aprendidas | Referencia nomes antigos `css-errors.md` e `medical-data.md` | Consolidados em `slide-rules.md` e `design-reference.md` (XREF.md L42-47) | BAIXO | Atualizar nomes |
| `NOTES.md` | Log de decisoes entre agentes | 426L, nao indexado em docs/README.md nem no hot path | Nenhum doc aponta para NOTES.md como leitura; so HANDOFF.md L140 menciona `tasks/lessons.md` | BAIXO | Indexar + truncar sessoes antigas |
| `CHANGELOG.md` (cirrose) | Historico de sessoes | 1295L — massa crescente, leitura total impraticavel | L3-4: ja truncado pre-Mar, mas acumula ~100L/semana | BAIXO | Truncar agressivamente (manter ultimas 2 semanas) |
| `docs/biblia-narrativa.md` | Narrativa + perolas clinicas | 339L; papel parcialmente sobreposto por `references/narrative.md` (221L) | biblia-narrativa.md L6: "Referencia obrigatoria para speaker notes"; narrative.md L1: "Mapa narrativo para coding agents" | AMBIGUO | Ver Conflito 3 |
| `references/must-read-trials.md` | Lista PDF trials | Referencia Notion data source; nao indexado em docs/README.md | L6: `collection://2b24bb6c...`; nao aparece em docs/README.md | AMBIGUO | Verificar se Notion sync ainda ativo |

---

## 3. Conflict Matrix

### Conflito 1: Estado de slides — HANDOFF.md vs HANDOFF-CLAUDE-AI.md

- **Arquivo A:** `aulas/cirrose/HANDOFF.md` (atualizado 2026-03-25)
- **Arquivo B:** `aulas/cirrose/HANDOFF-CLAUDE-AI.md` (atualizado 2026-03-22)
- **Natureza do conflito:** Estados de slides divergem entre os dois arquivos
- **Evidencia textual resumida:**
  - HANDOFF.md L26: `s-a1-01 | CONTENT | R12. Fixes E54/E55/E59/E60/E61 (25/mar)`
  - HANDOFF-CLAUDE-AI.md L25: `s-a1-01 | QA (R11) | Ghost Rows + scanner line`
  - HANDOFF.md L28: `s-a1-classify | CONTENT | Refatorado 23/mar`
  - HANDOFF-CLAUDE-AI.md L26: `s-a1-classify | LINT-PASS | Precisa QA 5-stage`
- **Risco pratico:** Agente que leia HANDOFF-CLAUDE-AI.md como entrada assume estados incorretos e pode pular etapas de QA ou re-executar trabalho ja feito
- **Resolucao recomendada:** Deprecar HANDOFF-CLAUDE-AI.md. Se Claude.ai Project Knowledge for necessario, auto-gerar a partir de HANDOFF.md com script

### Conflito 2: Mandato de leitura — WT-OPERATING.md vs CLAUDE.md

- **Arquivo A:** `aulas/cirrose/WT-OPERATING.md` L4
- **Arquivo B:** `CLAUDE.md` L153
- **Natureza do conflito:** WT-OPERATING.md declara "Ler isto INTEIRO no inicio de TODA sessao. Sem excecoes." CLAUDE.md lista WT-OPERATING.md como "ler manualmente em sessoes QA" (on demand)
- **Evidencia textual resumida:**
  - WT-OPERATING.md L4: `Ler isto INTEIRO no inicio de TODA sessao. Sem excecoes.`
  - CLAUDE.md L153: `QA pipeline (maquina de estados, Gate 0/4, scorecards): aulas/cirrose/WT-OPERATING.md (ler manualmente em sessoes QA)`
- **Risco pratico:** Agente nao sabe se deve gastar ~462 tokens lendo WT-OPERATING.md inteiro ou so consultar sob demanda. Na pratica, CLAUDE.md e auto-loaded e WT-OPERATING.md nao — entao o mandato de WT-OPERATING nao e enforced
- **Resolucao recomendada:** Cisao de WT-OPERATING.md. Secoes 1-3 (protocolo de sessao, ~50L) passam a ser referenciadas como mandatorias em CLAUDE.md. Secoes 4-11 (QA pipeline, ~400L) ficam como referencia sob demanda

### Conflito 3: Narrativa — biblia-narrativa.md vs references/narrative.md

- **Arquivo A:** `docs/biblia-narrativa.md` (339L, criado 25/fev/2026 por Claude.ai)
- **Arquivo B:** `aulas/cirrose/references/narrative.md` (221L, atualizado 2026-03-09)
- **Natureza do conflito:** Ambos cobrem o arco narrativo da aula. biblia-narrativa inclui perolas clinicas e detalhes de transcripts; narrative.md e o mapa estrutural para agentes. Ha sobreposicao parcial no mapeamento de slides por ato
- **Evidencia textual resumida:**
  - biblia-narrativa.md L5-6: "Referencia obrigatoria para speaker notes e conteudo visual durante redesign"
  - narrative.md L1: "Mapa narrativo para coding agents"
  - Ambos listam slides por ato com roles narrativos, mas narrative.md inclui campos (narrativeCritical, tensionLevel, panelState) que biblia-narrativa nao tem
- **Risco pratico:** Baixo. Os papeis sao complementares: narrative.md = estrutura para agentes, biblia-narrativa = material-fonte para speaker notes. Mas se um agente ler ambos, ha redundancia de ~100L
- **Resolucao recomendada:** AMBIGUO. Manter ambos por ora. Marcar biblia-narrativa como "consulta eventual" e narrative.md como "canonico para agentes". Nao fundir — conteudos sao complementares

---

## 4. Candidate Actions

### 4.1 Manter

| Arquivo | Justificativa |
|---------|---------------|
| `CLAUDE.md` (root, 155L) | Fonte de verdade operacional. Auto-loaded. Conciso. Sem problemas |
| `aulas/cirrose/HANDOFF.md` (141L) | Estado ativo correto. Formato lean. Atualizado 2026-03-25 |
| `aulas/cirrose/references/CASE.md` | Nucleo protegido #1. Dados do paciente |
| `aulas/cirrose/references/evidence-db.md` | Nucleo protegido #2. Trials verificados |
| `aulas/cirrose/references/narrative.md` (221L) | Nucleo protegido #3. Mapa narrativo canonico |
| `aulas/cirrose/slides/_manifest.js` | Nucleo protegido #4. Source of truth da ordem |
| `aulas/cirrose/AUDIT-VISUAL.md` (623L) | Scorecards ativos. Nao compactar — cada slide precisa de seu scorecard |
| `aulas/cirrose/ERROR-LOG.md` (510L) | Append-only. Regras derivadas. Referencia ativa |
| `aulas/cirrose/DONE-GATE.md` (103L) | Checklist operacional. Lean. Sem problemas |
| `docs/prompts/gemini-gate0-inspector.md` | Referenciado ativamente por gemini-qa3.mjs |
| `aulas/cirrose/references/decision-protocol.md` | Protocolo util. Tamanho adequado |
| `aulas/cirrose/references/archetypes.md` | Referencia ativa para layouts |
| `.claude/rules/slide-rules.md` | Canonico. Consolidado de 6 arquivos |
| `.claude/rules/design-reference.md` | Canonico. Consolidado de 4 arquivos |
| `README.md` (root, 40L) | Conciso e correto |

### 4.2 Encurtar

| Arquivo | Acao | Justificativa | Risco | Dependencias |
|---------|------|---------------|-------|--------------|
| `aulas/cirrose/WT-OPERATING.md` (462L) | Cisao: extrair S1-S3 como bloco mandatorio (~50L); S4-S11 ficam como "QA Spec" on-demand | Reduz contexto mandatorio de 462L para ~50L. 89% de reducao no hot path | Baixo. Conteudo nao muda, so a organizacao | CLAUDE.md precisa atualizar referencia |
| `docs/XREF.md` (171L) | Remover secao "Pares .claude <-> .cursor" (L130-137); remover referencia a CLAUDE.md (cirrose) (L112); atualizar contagem de skills | Elimina ghost references. Reduz ~15L | Muito baixo | Nenhuma |
| `aulas/cirrose/CHANGELOG.md` (1295L) | Truncar: manter ultimas 3 semanas (desde 2026-03-07). Historico anterior → `git log` | Reduz ~800L. `git log` ja e o historico completo (declarado no proprio header L3) | Muito baixo. Informacao preservada em git | Nenhuma |
| `aulas/cirrose/NOTES.md` (426L) | Truncar sessoes anteriores a 2026-03-17 (inicio de WT-OPERATING). Manter ultimas 2 semanas | Reduz ~200L. Decisoes antigas ja estao codificadas em rules ou ERROR-LOG | Baixo. Verificar se ha decisao nao-codificada antes de truncar | ERROR-LOG.md deve estar completo |

### 4.3 Fundir

| Arquivo | Acao | Justificativa | Risco | Dependencias |
|---------|------|---------------|-------|--------------|
| `CHANGELOG.md` (root, ~30L) + `ERROR-LOG.md` (root, ~20L) | Fundir em unico `CHANGELOG.md` (root) com header atualizado para "Aula Cirrose" | Ambos sao vestigios do monorepo com ~1 entrada cada. Mante-los separados nao agrega | Muito baixo | Nenhuma |

### 4.4 Arquivar

| Arquivo | Acao | Justificativa | Risco | Dependencias |
|---------|------|---------------|-------|--------------|
| `docs/insights-html-cirrose-2026.md` | Mover para `_archive/` | Analise de um HTML Gemini do inicio do projeto (05/mar). Header L5: "Nada deste arquivo entra direto nos slides." Valor historico apenas | Muito baixo. Declaradamente nao-operacional | Atualizar docs/README.md L33 |
| `docs/prompts/openai-backward-design.md` | Mover para `_archive/` | Prompt OpenAI Canvas. Blueprint ja absorveu o backward design. Referencia SYNC-NOTION-REPO que pode ficar stale | Baixo | Atualizar docs/README.md L56 |
| `docs/prompts/openai-canvas-storyboard.md` | Mover para `_archive/` | Prompt OpenAI Canvas storyboard. Narrativa ja esta em narrative.md | Baixo | Atualizar docs/README.md L57 |

### 4.5 Deletar

| Arquivo | Acao | Justificativa | Risco | Dependencias |
|---------|------|---------------|-------|--------------|
| Nenhum | — | Nao ha arquivo que justifique delecao irreversivel neste momento | — | — |

### 4.6 Auto-gerar

| Arquivo | Acao | Justificativa | Risco | Dependencias |
|---------|------|---------------|-------|--------------|
| `HANDOFF-CLAUDE-AI.md` | Deprecar conteudo estatico. Se necessario, auto-gerar a partir de HANDOFF.md com script (extrair Estado + Slides + Caminho critico, remover backlog/decisoes travadas) | Dados atualmente stale e conflitantes. Manutencao manual duplicada nao se sustenta. Se Claude.ai nao esta sendo usado, basta deletar | Baixo. Se Claude.ai for reativado, script gera em segundos | Verificar com Lucas se Claude.ai Project Knowledge ainda e usado |

---

## 5. Minimal Hot Path Proposal

Caminho minimo de contexto para um agente comecar a trabalhar:

### Entrada obrigatoria (auto-loaded, ~200L total)

| Passo | Arquivo | Linhas | Motivo |
|-------|---------|--------|--------|
| 1 | `CLAUDE.md` | 155 | Fonte de verdade operacional. Auto-loaded pelo sistema |
| 2 | `git log -5 && git status` | ~10 | Estado do branch |
| 3 | `HANDOFF.md` head -40 | ~40 | Slide atual + proxima acao |

### Estado vivo (leitura condicional, ~50-100L)

| Condicao | Arquivo | Linhas |
|----------|---------|--------|
| Se QA | `WT-OPERATING.md` S4 (QA sub-loop) | ~200 |
| Se editando slide | `.claude/rules/slide-rules.md` (auto-loaded via @) | ~200 |
| Se dados clinicos | `.claude/rules/design-reference.md` S5 | ~50 |
| Se confused | `docs/XREF.md` | 171 |

### Canonicos por consulta (sob demanda, nao auto-loaded)

| Arquivo | Quando |
|---------|--------|
| `references/CASE.md` | Dados do paciente |
| `references/evidence-db.md` | Verificar PMID/NNT |
| `references/narrative.md` | Arco narrativo, tensionLevel, panelState |
| `AUDIT-VISUAL.md` | Scorecard do slide em QA |
| `ERROR-LOG.md` | Prevencao de erros conhecidos |
| `DONE-GATE.md` | Checklist antes de push |

### Historico (nunca no hot path)

| Arquivo | Papel |
|---------|-------|
| `CHANGELOG.md` (cirrose) | Sessoes passadas |
| `NOTES.md` | Decisoes passadas |
| `tasks/lessons.md` | Licoes nao codificadas em rules |
| `tasks/todo.md` | Backlog infra |

### Arquivo morto / espelho

| Arquivo | Papel |
|---------|-------|
| `HANDOFF-CLAUDE-AI.md` | Espelho stale de HANDOFF.md — deprecar |
| `docs/insights-html-cirrose-2026.md` | Analise historica — arquivar |
| `docs/biblia-narrativa.md` | Material-fonte para speaker notes — consulta eventual |
| `CHANGELOG.md` (root) | Vestigio monorepo — fundir ou renomear |
| `ERROR-LOG.md` (root) | Vestigio monorepo — fundir ou renomear |

---

## 6. Safe Refactor Plan

### Etapa 1: Ghost references cleanup (XREF.md + docs/README.md)

- **Objetivo:** Eliminar referencias a arquivos/diretorios inexistentes
- **Arquivos tocados:** `docs/XREF.md`, `docs/README.md`
- **Acoes:**
  - XREF.md: remover L112 (`CLAUDE.md (cirrose)`), remover secao L130-137 (pares .cursor), atualizar contagem skills L23
  - docs/README.md: remover L51 (strikethrough gemini-slide-editor com link quebrado)
- **Risco:** Muito baixo (remocao de ponteiros mortos)
- **Criterio de sucesso:** Grep por `CLAUDE.md (cirrose)`, `.cursor/rules`, `_archive/gemini-slide-editor` retorna zero hits

### Etapa 2: Monorepo remnants rename

- **Objetivo:** Atualizar headers e paths que referenciam "aulas-magnas" ou "wt-cirrose"
- **Arquivos tocados:** `CHANGELOG.md` (root L1), `ERROR-LOG.md` (root L1), `docs/MCP-ENV-VARS.md` (L1), `docs/MCP-ACADEMICOS.md` (L1), `docs/prompts/research-best-practices.md` (L38)
- **Acoes:** Substituir "aulas-magnas" por "Aula Cirrose". Substituir `wt-cirrose` por `Aula_cirrose`
- **Risco:** Muito baixo (cosmetico, nao afeta logica)
- **Criterio de sucesso:** Grep `aulas-magnas|wt-cirrose` em `**/*.md` retorna zero hits

### Etapa 3: HANDOFF-CLAUDE-AI.md deprecacao

- **Objetivo:** Resolver conflito de dados entre os dois HANDOFFs
- **Arquivos tocados:** `aulas/cirrose/HANDOFF-CLAUDE-AI.md`, `docs/README.md` (L18), `docs/XREF.md` (L118)
- **Acoes:**
  - Perguntar a Lucas: Claude.ai Project Knowledge ainda e usado?
  - Se nao: mover para `_archive/`, remover de indices
  - Se sim: criar script `scripts/gen-handoff-ai.mjs` que extrai de HANDOFF.md + marca timestamp
- **Risco:** Baixo. So afeta Claude.ai web (nao CLI)
- **Criterio de sucesso:** Zero conflitos de estado entre HANDOFF.md e qualquer outro doc

### Etapa 4: WT-OPERATING.md cisao

- **Objetivo:** Reduzir contexto mandatorio de 462L para ~50L
- **Arquivos tocados:** `aulas/cirrose/WT-OPERATING.md`, `CLAUDE.md` (L153)
- **Acoes:**
  - WT-OPERATING.md: mover mandato "Ler INTEIRO" apenas para S1-S3. S4+ recebe header "Referencia sob demanda (sessoes QA)"
  - CLAUDE.md L100-101 (Sessao > Start): adicionar `cat aulas/cirrose/WT-OPERATING.md | head -60` no workflow
  - CLAUDE.md L153: mudar de "ler manualmente em sessoes QA" para referencia mais precisa
- **Risco:** Medio. Requer validacao de que nenhum conteudo critico de S4+ e necessario fora de QA
- **Criterio de sucesso:** Agente novo inicia sessao lendo ~200L em vez de ~620L. QA pipeline nao perde informacao

### Etapa 5: Truncar CHANGELOG.md e NOTES.md

- **Objetivo:** Reduzir massa documental historica
- **Arquivos tocados:** `aulas/cirrose/CHANGELOG.md`, `aulas/cirrose/NOTES.md`
- **Acoes:**
  - CHANGELOG: remover entradas anteriores a 2026-03-07. Manter header + disclaimer `git log`
  - NOTES: remover sessoes anteriores a 2026-03-17. Verificar que decisoes estao em ERROR-LOG ou rules
- **Risco:** Baixo. Informacao preservada em `git log`
- **Criterio de sucesso:** CHANGELOG < 400L. NOTES < 250L

### Etapa 6: tasks/todo.md + tasks/lessons.md cleanup

- **Objetivo:** Remover referencias stale
- **Arquivos tocados:** `tasks/todo.md`, `tasks/lessons.md`
- **Acoes:**
  - todo.md L32: marcar ECOSYSTEM como concluido (arquivo deletado)
  - lessons.md L3: atualizar `css-errors.md` → `slide-rules.md`, `medical-data.md` → `design-reference.md`
- **Risco:** Muito baixo
- **Criterio de sucesso:** Zero referencias a arquivos deletados

### Etapa 7 (opcional): Arquivar docs de baixa frequencia

- **Objetivo:** Reduzir superficie quente de docs/
- **Arquivos tocados:** `docs/insights-html-cirrose-2026.md`, `docs/prompts/openai-backward-design.md`, `docs/prompts/openai-canvas-storyboard.md`, `docs/README.md`
- **Acoes:** Mover 3 arquivos para `_archive/`. Atualizar docs/README.md
- **Risco:** Baixo. Todos sao declaradamente nao-operacionais ou absorvidos
- **Criterio de sucesso:** docs/ tem menos arquivos; nenhum link quebrado em README.md

---

## 7. No-Write Recommendation

Arquivos que **NAO devem ser mudados** neste ciclo:

| Arquivo | Motivo |
|---------|--------|
| `aulas/cirrose/references/CASE.md` | Nucleo protegido #1. Zero problemas detectados |
| `aulas/cirrose/references/evidence-db.md` | Nucleo protegido #2. [TBD SOURCE] items sao esperados e rastreados |
| `aulas/cirrose/references/narrative.md` | Nucleo protegido #3. Coerente e atualizado |
| `aulas/cirrose/slides/_manifest.js` | Nucleo protegido #4. Source of truth da ordem |
| `aulas/cirrose/AUDIT-VISUAL.md` | Scorecards ativos — dados em uso pelo QA pipeline |
| `aulas/cirrose/ERROR-LOG.md` | Append-only por design. Informacao ativa |
| `aulas/cirrose/DONE-GATE.md` | Correto e enxuto |
| `aulas/cirrose/slide-registry.js` | Codigo de producao. Fora do escopo documental |
| `aulas/cirrose/cirrose.css` | Codigo de producao. Fora do escopo documental |
| `.claude/rules/*.md` | Recentemente consolidados (10→2). Estao corretos |
| `docs/biblia-narrativa.md` | AMBIGUO. Papel complementar a narrative.md. Nao forcar decisao agora |
| `docs/SYNC-NOTION-REPO.md` | Depende de status Notion (perguntar a Lucas) |
| `docs/blueprint-cirrose.md` | Documento de design original. Valor de referencia |
| `docs/slide-pedagogy.md` | Teorias pedagogicas codificadas. Referencia ativa |
| `references/must-read-trials.md` | Depende de status Notion sync |
| `references/coautoria.md` | AI disclosure. Pode ser necessario para congresso |
| `references/decision-protocol.md` | Protocolo util. Tamanho adequado |

---

## 8. Proposed Diff Summary

### Batch 1 (baixo risco, executavel imediatamente)

| Arquivo | Acao | Linhas afetadas |
|---------|------|-----------------|
| `docs/XREF.md` | Remover ghost refs (CLAUDE.md cirrose, .cursor/rules) | ~20L removidas |
| `docs/README.md` | Remover L51 (link quebrado gemini-slide-editor) | ~1L removida |
| `CHANGELOG.md` (root) | Renomear header "aulas-magnas" → "Aula Cirrose" | ~1L |
| `ERROR-LOG.md` (root) | Renomear header + path | ~3L |
| `docs/MCP-ENV-VARS.md` | Renomear header | ~1L |
| `docs/MCP-ACADEMICOS.md` | Renomear header | ~1L |
| `docs/prompts/research-best-practices.md` | Atualizar path | ~1L |
| `tasks/todo.md` | Marcar ECOSYSTEM como concluido | ~1L |
| `tasks/lessons.md` | Atualizar nomes de rules | ~1L |

### Batch 2 (medio risco, requer decisao de Lucas)

| Arquivo | Acao | Dependencia |
|---------|------|-------------|
| `HANDOFF-CLAUDE-AI.md` | Deprecar ou auto-gerar | Lucas confirma se Claude.ai PK e usado |
| `WT-OPERATING.md` | Cisao S1-S3 / S4+ | Lucas aprova reorganizacao |
| `CLAUDE.md` | Atualizar referencia WT-OPERATING | Depende de Batch 2 WT-OPERATING |
| `CHANGELOG.md` (cirrose) | Truncar pre-07/mar | Lucas aprova |
| `NOTES.md` | Truncar pre-17/mar | Lucas aprova |

### Intocados (nao entram em nenhum batch)

- Todo o nucleo protegido (CASE.md, evidence-db.md, narrative.md, _manifest.js)
- Todos os arquivos de producao (slides/*.html, CSS, JS, registry)
- `.claude/rules/*.md` (recentemente consolidados, corretos)
- `AUDIT-VISUAL.md`, `ERROR-LOG.md` (cirrose), `DONE-GATE.md`
- `docs/biblia-narrativa.md`, `docs/slide-pedagogy.md`, `docs/blueprint-cirrose.md`
- `docs/SYNC-NOTION-REPO.md`, `references/must-read-trials.md` (dependem de status Notion)

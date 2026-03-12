---
name: final-pass
description: Avaliacao final do deck completo via Gemini — coerencia cross-slide, ritmo narrativo, alternancia dark/light, densidade cognitiva. Rodar APENAS quando Gates 1-3 ja passaram. Ativar com "final pass", "acabamento", "deck pronto?", "avaliacao final", "polish".
version: 1.0.0
context: fork
agent: general-purpose
allowed-tools: Read, Edit, Bash, Grep, Glob, Agent
argument-hint: "[aula=cirrose] [model=flash|pro] [max-iterations=3]"
---

# Final Pass — Avaliacao de Deck Completo

Deck: `$ARGUMENTS` (default: `aulas/cirrose/`, model: flash, max: 3 iteracoes)

## Pre-requisito

**NAO rodar antes de Gates 1-3 passarem.**
Verificar antes de iniciar:

```bash
npm run lint:slides    # Gate 1 — deve ser 0 erros
# Gate 2 (/review) — deve ter rodado nesta sessao
# Gate 3 (/ralph-qa) — deve ter OPUS-PASS + GEMINI-PASS
```

Se algum gate nao passou → PARAR e informar.

---

## O que avalia (domínios que Gates 1-3 NAO cobrem)

| Dominio | O que checa | Por que importa |
|---------|-------------|-----------------|
| **Coerencia cross-slide** | Mesma cor para mesmo conceito? Tipografia consistente? | Slide isolado pode passar mas deck parecer frankenstein |
| **Ritmo narrativo** | Alternancia dark/light segue arco? Checkpoints no lugar certo? | Duarte sparkline — tensao/resolucao |
| **Densidade cognitiva** | Act 1 leve → Act 2 pesado → Act 3 resolucao? | Sweller — carga excessiva no meio mata atencao |
| **Transicoes entre atos** | Slide de transicao existe? Background muda? | Sinaliza mudanca de contexto para audiencia |
| **Abertura e fechamento** | Hook tem impacto? CTA final e concreto? | Primacy-recency (Ebbinghaus) |
| **Apresentabilidade geral** | "Voce apresentaria isso amanha?" | Julgamento holistico |

---

## Workflow

### Step 1 — Gerar material

```bash
# Screenshots de TODOS os slides em sequencia narrativa
npm run qa:static -- --all

# Ou via Playwright direto:
# npx playwright screenshot --viewport 1280x720 cada slide
```

Resultado: `qa-screenshots/final-pass/{slide-id}.png` (1 por slide, estado final)

### Step 2 — Montar pacote para Gemini

Reunir:
1. **Screenshots** — todos, na ordem do _manifest.js
2. **_manifest.js** — arco narrativo, tensionLevel, narrativeRole
3. **Speaker notes** — extrair de cada slide (timing, transicoes)
4. **Prompt contextual** (abaixo)

### Step 3 — Enviar para Gemini

**Via MCP (automatico):**
```
Se MCP gemini disponivel:
  → enviar screenshots + prompt via tool call
  → receber JSON estruturado
```

**Via API direta (fallback):**
```bash
node .claude/scripts/gemini-final-pass.js \
  --aula cirrose \
  --model flash \
  --screenshots qa-screenshots/final-pass/
```

**Via manual (ultimo recurso):**
```
Gerar prompt + salvar em qa-screenshots/final-pass/PROMPT.md
Usuario cola no Gemini AI web + arrasta screenshots
Cola resposta de volta
```

### Step 4 — Processar resposta

Gemini retorna JSON com issues priorizados.
Opus le cada issue → localiza no HTML → fix cirurgico.
Se issue ambiguo → marcar como [HUMAN-REVIEW] e pular.

### Step 5 — Re-avaliar (se necessario)

Se Gemini retornou issues:
1. Opus corrige
2. Re-gera screenshots afetados
3. Re-envia para Gemini com before/after
4. Max 3 iteracoes (custo total ~$0.12 Flash ou ~$0.51 Pro)

---

## Prompt para Gemini

```
Voce e um consultor de design de apresentacoes medicas para congressos.
Publico: gastroenterologistas e hepatologistas seniores, Brasil.
Formato: Reveal.js 1280x720, assertion-evidence (titulo = claim clinico, corpo = evidencia visual).
Design system: Instrument Serif (titulos), DM Sans (corpo), OKLCH tokens.
Semantica clinica: safe=teal+check, warning=amber+triangle, danger=red+X.

Voce esta recebendo o deck COMPLETO em ordem de apresentacao.
Screenshots estao na sequencia narrativa (slide 1, 2, 3, ..., N).

CONTEXTO NARRATIVO (do _manifest.js):
[INSERIR: lista de slides com narrativeRole e tensionLevel]

SPEAKER NOTES (resumo):
[INSERIR: timing e transicoes extraidos das notes]

AVALIAR O DECK COMO UM TODO — nao slides isolados:

1. COERENCIA VISUAL
   - Mesma informacao usa mesma cor/estilo em todos os slides?
   - Tipografia consistente (titulos, corpo, numeros)?
   - Espacamento entre elementos segue padrao?

2. RITMO NARRATIVO (Duarte Sparkline)
   - O deck alterna entre tensao (problema) e resolucao (solucao)?
   - Checkpoints estao posicionados nos pontos certos?
   - Abertura tem impacto? Fechamento tem CTA concreto?

3. ALTERNANCIA DARK/LIGHT
   - Mudancas de background sinalizam mudanca de contexto?
   - A alternancia tem ritmo ou parece aleatorio?

4. DENSIDADE COGNITIVA POR ATO
   - Act 1 e mais leve que Act 2?
   - Act 2 (dados pesados) tem pausas visuais?
   - Act 3 resolve e simplifica?

5. TRANSICOES ENTRE ATOS
   - Existe slide de transicao marcando mudanca de ato?
   - A mudanca e visualmente clara?

6. APRESENTABILIDADE
   - Voce apresentaria este deck amanha em um congresso?
   - Se nao, o que falta?

Para cada issue, retornar JSON:
{
  "scope": "cross-slide" | "single-slide" | "narrative",
  "slides_affected": ["slide-id-1", "slide-id-2"],
  "severity": "FAIL" | "WARN" | "INFO",
  "confidence": [0-100],
  "issue": "[descricao do problema]",
  "fix": "[instrucao concreta]",
  "principle": "[Duarte|Mayer|Sweller|Tufte|Alley]"
}

Reportar APENAS issues com confidence >= 80.
Se deck esta pronto: retornar {"verdict": "DECK-PASS", "notes": "[comentario final]"}
```

---

## Custo estimado

| Modelo | Por pass | 3 passes | Notas |
|--------|----------|----------|-------|
| Flash 2.5 | $0.04 | $0.12 | Bom para layout/coerencia |
| Pro 2.5 | $0.17 | $0.51 | Melhor para narrativa/pedagogia |
| Free tier | $0.00 | $0.00 | 100 req/dia Pro, 250 Flash |

**Recomendacao:** Usar Flash para iteracoes 1-2 (layout), Pro para pass final (narrativa).
Custo tipico por aula: **$0.04 a $0.51** dependendo de quantos passes.

---

## Modos de integracao (por ordem de preferencia)

### 1. MCP Gemini (automatico)
```bash
# Setup unico:
claude mcp add gemini -s user -- env GEMINI_API_KEY=KEY npx -y @rlabs-inc/gemini-mcp
```
Claude Code chama Gemini diretamente. Zero copy-paste.

### 2. Script Node (semi-automatico)
```bash
# .claude/scripts/gemini-final-pass.js
# Envia screenshots via @google/genai SDK
# Retorna JSON que Opus processa
```
Precisa: `npm install @google/genai` + GEMINI_API_KEY em .env

### 3. Manual (fallback)
Claude Code gera `qa-screenshots/final-pass/PROMPT.md`.
Usuario cola no Gemini AI web + arrasta PNGs.
Cola resposta JSON de volta no terminal.

---

## Seguranca

- Max 3 iteracoes (evita loop infinito de custo)
- Gemini so sugere — Opus executa (Gemini nao toca codigo)
- Issues < 80 confianca → ignorar
- Mesmo issue 3x sem melhora → [HUMAN-REVIEW]
- NUNCA modificar dados clinicos — apenas visual/layout/ritmo
- Custo acumulado exibido a cada iteracao

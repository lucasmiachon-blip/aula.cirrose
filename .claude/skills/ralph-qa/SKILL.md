---
name: ralph-qa
description: Loop autônomo de QA para slides em batches de 3 — lint → fix → build → fix → audit Gemini 3.1 → repeat until 0 FAILs. Ativar quando usuário pedir "qa loop", "rodar qa até passar", "fix all lint", "qa autônomo", "qa batch".
version: 2.0.0
context: fork
agent: general-purpose
allowed-tools: Read, Edit, Bash, Grep, Glob, Agent
argument-hint: "[lecture?] [batch-size=3] [max-iterations=15]"
---

# Ralph-QA v2 — Loop Autônomo em Batches + Gemini Audit

Loop de QA para `$ARGUMENTS` (default: `aulas/cirrose/`).
Batch size: 3 slides. Max iterations por batch: 5. Max batches: 10 (cobre 28 slides + margem).

## Arquitetura 3 agentes

```
┌─────────────────────────────────────────────────────┐
│  Claude Code (você)                                  │
│  Orquestra o loop · lint · build · git              │
└──────────────────┬──────────────────────────────────┘
                   │ batch de 3 slides
     ┌─────────────▼─────────────┐
     │  Subagent Explore         │
     │  Constraint check rápido  │
     │  (assertion, notes, vars) │
     └─────────────┬─────────────┘
                   │ issues encontrados
     ┌─────────────▼─────────────────────────────────┐
     │  Gemini 3.1 Pro (audit final visual)           │
     │  Recebe: screenshots dos 3 slides              │
     │  Avalia: layout, hierarquia, motion, daltonismo│
     │  Retorna: PASS / WARN / FAIL com justificativa │
     └───────────────────────────────────────────────┘
```

## Por que batches de 3

- Cowan 4±1: revisão humana de grupos ≤ 4 é mais eficaz
- Contexto do agente não acumula entre batches (sem drift)
- Gemini recebe conjunto coerente (ex: 3 slides do mesmo módulo)
- Falha num batch não afeta os outros

## Loop Protocol

```
BATCH [N] — slides [i..i+2] / total
─────────────────────────────────────────────────────
Phase 1: LINT (Claude Code)
  npm run lint:slides -- --files slide-a.html slide-b.html slide-c.html
  → FAILs? → Fix cirúrgico → re-lint → max 5x
  → 0 FAILs → Phase 2

Phase 2: CONSTRAINT CHECK (Subagent Explore — paralelo por slide)
  Para cada slide do batch, subagent verifica:
  - <h2> é asserção clínica completa?
  - Zero <ul>/<ol> no corpo?
  - <aside class="notes"> presente com timing?
  - Sem display inline no <section>? (E07)
  - Cores via var() sem hardcode?
  - Dados numéricos têm fonte ou [TBD]?
  → Issues? → Fix → voltar Phase 1
  → OK → Phase 3

Phase 3: GEMINI VISUAL AUDIT (Agent — qa-engineer ou general-purpose)
  Lançar Agent com subagent_type=qa-engineer:
  - Capturar screenshots dos 3 slides via Playwright
  - Enviar para Gemini 3.1 Pro com prompt contextual
  - Avaliar: hierarquia visual, legibilidade, contraste, daltonismo
  - Confidence scoring 0-100 por issue (threshold 80)
  → WARN/FAIL → Fix → voltar Phase 1
  → PASS → Phase 4

Phase 4: COMMIT DO BATCH
  git add [3 slides] && git commit -m "[QA] batch N — slides X-Y"
  → Próximo batch

COMPLETION: todos os batches PASS → output "QA-DONE"
```

## Prompt para Gemini 3.1 Pro

Enviar com os screenshots:

```
Você está auditando slides de uma masterclass médica (hepatologistas seniores, Brasil).
Tema: Cirrose Hepática. Slides em Reveal.js, estilo Plan C (fundo claro, GSAP ativo).

Para cada slide (3 total neste batch):

1. HIERARQUIA VISUAL
   - O dado mais importante é visualmente dominante?
   - Hero element se destaca (2-3x maior que corpo)?
   - Olho vai para onde deve ir primeiro?

2. LEGIBILIDADE (projetor 1280×720, sala com luz)
   - Texto visível sem esforço a 5m de distância?
   - Contraste adequado (texto sobre fundo)?
   - Tamanho de fonte adequado para congresso?

3. DALTONISMO (simule protanopia mental)
   - Informação depende só de cor?
   - Ícones ✓/⚠/✕ presentes junto a cores semânticas?

4. DENSITY
   - Slide tem ≤ 30 palavras no corpo?
   - Ou parece congestionado?

Retornar por slide:
- PASS / WARN / FAIL
- Confiança 0-100
- Se WARN/FAIL: issue específico + fix sugerido (1 linha)

Contexto do design system:
- safe=teal, warning=amber, danger=red (sempre com ícone)
- Fonte: Instrument Serif (títulos) + DM Sans (corpo)
- Espaçamento generoso (--space-lg entre seções)
```

## Segurança

- **Max 5 iterações por batch** antes de escalar para humano
- **Mudanças cirúrgicas only**: fix exige reescrever > 30% → PARAR + reportar
- **NUNCA deletar `<aside class="notes">`** — append only
- **NUNCA modificar dados clínicos** — marcar `[TBD]` + reportar
- **Gemini WARN < 80 confiança** → ignorar (noise)
- Mesmo FAIL persistindo 3x → PARAR + reportar root cause

## Output Final

```
## QA-DONE — aulas/cirrose/ — [N] batches · [total slides]

### Batches
Batch 1 (00-02): PASS — 0 issues
Batch 2 (03-05): PASS — 2 fixes (lint E07, nota faltando)
Batch 3 (06-08): WARN — Gemini: contraste baixo em 07, confiança 82 → corrigido
...

### Fixes aplicados: [N total]
### Gemini issues (>80): [N]
### Gemini noise descartado (<80): [N]

QA-DONE
```

## Configuração Stop Hook (modo 100% autônomo)

```json
// .claude/settings.json — Stop hook
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/hooks/ralph-qa-hook.sh"
      }]
    }]
  }
}
```

```bash
#!/bin/bash
# ~/.claude/hooks/ralph-qa-hook.sh
if ! grep -q "QA-DONE" "$CLAUDE_OUTPUT_FILE" 2>/dev/null; then
  exit 2  # bloqueia saída → re-injeta prompt
fi
exit 0
```

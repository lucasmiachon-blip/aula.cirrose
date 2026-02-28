# ERROR LOG — Cirrose

> Atualizar a cada sessão. Cada erro vira regra que previne repetição.
> **Path:** `aulas/cirrose/ERROR-LOG.md` · Referência: `CHANGELOG.md`

---

## Formato

```
[ERRO-NNN] Severidade | Slide | Descrição | Root cause | Regra derivada
```

Severidades: CRITICAL (bloqueia projeção), HIGH (prejudica leitura), MEDIUM (estética), LOW (cosmético)

---

## Registro

### ERRO-001 · CRITICAL · s-hook
**Contraste insuficiente em stage-c (light theme)**
**Root cause:** Cores desenhadas para dark navy; stage-c renderiza light gray.
**Regra:** Testar em AMBOS os temas. `#s-hook { background: #162032 !important }` para forçar navy.
**Status:** ✅ Corrigido (override #s-hook com cores literais).

### ERRO-002 · HIGH · s-hook
**Emoji em contexto profissional**
**Regra:** ZERO emojis unicode em slides projetados.
**Status:** ✅ Corrigido (removido).

### ERRO-003 · HIGH · s-hook
**Referências de lab ilegíveis**
**Regra:** Lab refs >= 0.8rem, cor contrastante.
**Status:** ✅ Corrigido (0.85rem, #a0acc0).

### ERRO-004 · HIGH · s-hook
**Layout piramidal dos labs (4+1)**
**Regra:** Labs grid: `repeat(5, 1fr)` — todos na mesma linha.
**Status:** ✅ Corrigido.

### ERRO-005 · MEDIUM · s-hook
**Cold open cinematográfico inapropriado**
**Regra:** Slide mostra DADOS; contextualização nos speaker notes.
**Status:** ✅ Corrigido (removido).

### ERRO-006 · MEDIUM · s-hook
**Framework "5 números / 3 decisões" overproduced**
**Regra:** Validar se conteúdo é "slide material" ou "speaker note material".
**Status:** ✅ Corrigido (removido).

### ERRO-007 · HIGH · s-hook
**Fill ratio < 10%**
**Regra:** Beat mínimo: 25% do canvas.
**Status:** ✅ Melhorado (pergunta abaixo dos labs, tipografia maior).

### ERRO-008 · MEDIUM · s-hook
**Case panel duplica informação**
**Regra:** Quando slide exibe dados expandidos, considerar ocultar panel.
**Status:** Pendente.

### ERRO-009 · CRITICAL · s-hook beat 1 (stage-c)
**Texto "Qual é o próximo passo?" ilegível — dark on navy**
**Root cause:** `var(--text-on-dark)` em stage-c = escuro. Especificidade vence.
**Regra:** Slides com bg escuro forçado: `#s-hook .elemento { color: #f0f2f5 }` (literal).
**Status:** ✅ Corrigido.

### ERRO-010 · HIGH · s-hook
**Animações sem retorno — ArrowLeft/Up não voltam beat**
**Root cause:** Só advanceBeat(); não existia retreatBeat().
**Regra:** Beats/reveals: implementar navegação bidirecional quando >1 estado.
**Status:** ✅ Corrigido (retreatBeat, engine.js intercept).

### ERRO-011 · MEDIUM · s-hook
**"Texto desce" ao pressionar ArrowDown**
**Root cause:** Conflito Reveal.js + interceptação.
**Regra:** ArrowDown removido da interceptação do hook.
**Status:** ✅ Corrigido.

### ERRO-012 · LOW · qa-screenshots-stage-c.js
**PNG captura estado intermediário**
**Root cause:** Delay 500ms; countUp 1,2s + stagger ~1s.
**Regra:** Delay inicial 1,5s ou aguardar animações via JS.
**Status:** ✅ Corrigido (1,5s).

### ERRO-013 · MEDIUM · s-hook
**Texto descentralizado — margens grandes**
**Regra:** place-content: center; ajustar padding.
**Status:** ✅ Corrigido.

### ERRO-014 · MEDIUM · s-hook (beat 1)
**Sombra dos números antes da animação**
**Root cause:** Labs/lead/question visíveis (herdam opacity do beat) antes do stagger.
**Regra:** Beat 1 content: `opacity: 0; visibility: hidden` em CSS até GSAP animar; resetBeat1Content() no retreat.
**Status:** ✅ Corrigido.

### ERRO-015 · HIGH · s-hook
**Transição Antônio inconsistente ao retornar**
**Root cause:** Conflito de animações; gsap.set(prev, { opacity: 0 }) + killTweensOf causavam "não aparece".
**Regra:** Evitar killTweensOf e set agressivos no retreat; usar overwrite: 'auto' no fromTo.
**Status:** ✅ Corrigido (revertido para lógica simples).

### ERRO-016 · CRITICAL · init
**Interação sumiu — clique/setas não funcionam**
**Root cause:** wireAll rodava DEPOIS de anim.connect(); customAnimations não registrados quando ready/slidechanged disparava; __hookAdvance nunca definido.
**Regra:** `wireAll()` ANTES de `anim.connect()` — custom anims devem estar registrados antes do dispatcher conectar.
**Status:** ✅ Corrigido (index.template.html).

### ERRO-017 · HIGH · preview s-hook
**Beat 0 e beat 1 mostram mesmo estado estático nos subitens**
**Root cause:** Ready dispara antes de connect(); customAnim nunca roda; data-initial-beat ignorado.
**Regra:** Em preview/single-slide: aplicar estado estático via DOM local (setBeat + labs visibility) após init, sem depender do dispatcher.
**Status:** ✅ Corrigido (preview.html — bloco pós-connect).

---

## Resumo por severidade

| Severidade | Total | Corrigidos | Pendentes |
|------------|-------|------------|-----------|
| CRITICAL   | 3     | 3          | 0         |
| HIGH       | 6     | 6          | 0         |
| MEDIUM     | 6     | 5          | 1 (ERRO-008) |
| LOW        | 1     | 1          | 0         |

---

## Raw code — sessão s-hook v5 (28/fev)

### slide-registry.js — s-hook: 2 beats, retreatBeat, resetBeat1Content

```javascript
// advanceBeat: prev→next, gsap.set(next, { opacity: 0 }), runLabsStagger imediato
// retreatBeat: curr→prev, resetBeat1Content no onComplete, fromTo overwrite: 'auto'
// resetBeat1Content: gsap.set(labs, lead, question, { opacity: 0, visibility: 'hidden' })
```

### cirrose.css — s-hook v5

```css
/* Beat 1: invisível até animação */
.hook-beat[data-hook-beat="1"] .hook-lab,
.hook-beat[data-hook-beat="1"] .hook-question-lead,
.hook-beat[data-hook-beat="1"] .hook-question {
  opacity: 0;
  visibility: hidden;
}
/* + failsafe .no-js override para visibility: visible */
```

### index.template.html — ordem de init

```javascript
wireAll(Reveal, gsap, { anim, CasePanel, ClickReveal, MeldCalc });
anim.connect();  // antes: connect antes de wireAll
```

### preview.html — fix beat 0/beat 1 (DOM local)

```javascript
// Pós-connect: aplicar beat estático para s-hook quando ?beat= presente
if (section?.id === 's-hook' && beatParam !== null) {
  const idx = parseInt(beatParam, 10);
  beats.forEach((b, i) => { ... hook-beat--active/hidden ... });
  if (idx === 1) { labs/lead/question opacity:1 visibility:visible; fib4 textContent }
}
```

### 01-hook.html — estrutura v5

- 2 beats: beat 0 (Antônio+história), beat 1 (labs + pergunta abaixo)
- Sem header/título
- "Antônio" (sem "Seu")
- "Caminhoneiro" (sem "de longa distância")
- "Qual a próxima conduta?"

---

*Última atualização: 2026-02-28 · preview DOM local, ERRO-017 ✅*

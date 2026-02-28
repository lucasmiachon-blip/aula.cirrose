# DIAGNÓSTICO — s-hook e Animações (28/fev/2026)

> QA screenshots + análise UI/UX/tipografia/slideologia.
> Agente: Claude · PNGs: `qa-screenshots/stage-c/`

---

## 1. Problemas Funcionais (Críticos)

### 1.1 Animações sem retorno
**Sintoma:** Ao avançar beat (click/ArrowRight/ArrowDown), não há como voltar ao beat anterior.

**Root cause:**
- Hook: `advanceBeat()` existe; `retreatBeat()` não existe. ArrowLeft/ArrowUp → Reveal navega slide anterior (s-title).
- ClickReveal: só `next()`, sem `prev()`. Reset apenas ao trocar de slide.

**Impacto:** Palestrante não pode revisar caso/labs após mostrar a pergunta. Quebra fluxo de Q&A.

### 1.2 "Texto desce" ao pressionar seta baixo
**Sintoma:** Ao pressionar ArrowDown, o texto parece descer ou há movimento vertical indesejado.

**Root cause provável:**
- Beat 1 entra com `gsap.fromTo(beats[1], { opacity: 0, y: 20 }, { opacity: 1, y: 0 })` — conteúdo sobe de y:20 para y:0.
- ArrowDown está sendo interceptado para advance; se houver conflito com Reveal (fragments verticais), pode causar duplo comportamento.
- Alternativa: Reveal.js usa ArrowDown para navegação vertical; nossa interceptação pode estar incompleta, deixando parte do evento propagar.

### 1.3 FIB-4 countUp + labs stagger — timing de screenshot
**Sintoma (PNG beat-00):** FIB-4 mostra 0,7 (animação em curso); apenas 2 de 5 labs visíveis.

**Root cause:** Script de QA tira screenshot após 500ms; countUp dura 1,2s e stagger 0,3 + 5×0,15 ≈ 1,05s. Screenshot captura estado intermediário.

**Impacto:** PNGs de QA não representam estado final. Para diagnóstico visual, aumentar delay ou aguardar animações.

---

## 2. Problemas de Contraste (Críticos)

### 2.1 Beat 1 — texto ilegível
**Sintoma:** "Sem queixas." e "Qual é o próximo passo?" aparecem em cinza escuro sobre navy.

**Root cause:** Em `stage-c`, base.css remapeia tokens:
```css
--text-on-dark:       oklch(12% 0.015 258);  /* escuro! */
--text-on-dark-muted: oklch(30% 0.008 258);
```
`.slide-navy h2` usa `var(--text-on-dark)` → em stage-c = cor escura. Especificidade de `.slide-navy h2` (0,2,1) vence `.hook-question` (0,1,0).

**Regra:** Slides com bg escuro forçado (#162032) devem usar cores literais (#f0f2f5) ou escopo que não herde tokens de stage light.

### 2.2 Referências de lab ilegíveis
**Sintoma:** "> 2,67", "U/L", "< 150k" quase invisíveis.

**Root cause:** `color: #5a6a7e` e `#7b8a9e` em cards com `background: rgba(255,255,255,0.04)` — contraste insuficiente.

### 2.3 Patient desc e ref
**Sintoma:** "Caminhoneiro de longa distância..." e "Encaminhado pelo clínico geral" muito fracos.

**Root cause:** `#a0aab8` e `#6b7a8d` sobre navy — ratio < 4.5:1.

---

## 3. Problemas de Layout e Hierarquia

### 3.1 Case panel redundante (ERRO-008)
**Sintoma:** Panel mostra FIB-4, PLQ, Albumina — duplicando o que o slide já exibe.

**Impacto:** Ruído visual, competição de atenção.

### 3.2 Labs em 5 colunas — responsividade
**Sintoma:** Em 1280px, 5 cards podem ficar apertados; labels 0.7rem arriscam wrap.

**Sugestão:** Garantir `min-width` em cada card ou `grid-template-columns: repeat(5, minmax(100px, 1fr))`.

---

## 4. Problemas de Slideologia

### 4.1 Beat 1 — fill ratio baixo
**Sintoma:** "Sem queixas. Qual é o próximo passo?" ocupa ~8% do canvas.

**Regra (ERRO-007):** Beat mínimo deve preencher 25% do canvas. Considerar integrar lead + pergunta com mais contexto ou aumentar tipografia.

### 4.2 Ausência de affordance de navegação
**Sintoma:** Usuário não sabe que pode clicar/avançar. Sem indicador de "1/2" ou "próximo".

**Sugestão:** Indicador discreto (ex.: "1 · 2" ou dots) no canto inferior, ou instrução nos speaker notes.

---

## 5. Resumo de Severidade

| # | Problema | Severidade | Tipo |
|---|----------|------------|------|
| 1 | Animações sem retorno (ArrowLeft/Up) | HIGH | Funcional |
| 2 | "Texto desce" (ArrowDown) | MEDIUM | Funcional |
| 3 | Contraste beat 1 (stage-c override) | CRITICAL | Cor |
| 4 | Contraste lab refs | HIGH | Cor |
| 5 | Contraste patient desc/ref | HIGH | Cor |
| 6 | Case panel redundante | MEDIUM | Layout |
| 7 | Fill ratio beat 1 | MEDIUM | Slideologia |
| 8 | QA screenshot timing | LOW | Processo |

---

## 6. Plano de Mudanças (Priorizado)

### Fase 1 — Contraste (bloqueador)
1. **#s-hook override stage-c:** Adicionar `#s-hook .hook-question`, `#s-hook .hook-question-lead`, `#s-hook .hook-patient *`, `#s-hook .hook-lab *` com cores literais (#f0f2f5, #c0c8d4, #9ca8b8) para garantir legibilidade em qualquer stage.
2. **Lab refs:** Aumentar para 0.85rem, cor #b0bcc8 no mínimo.

### Fase 2 — Navegação bidirecional
3. **Hook retreatBeat:** Implementar `__hookRetreat()` no slide-registry; interceptar ArrowLeft/ArrowUp no engine.js quando `currentBeat > 0`.
4. **ClickReveal prev():** Adicionar `prev()` em click-reveal.js; interceptar ArrowLeft/ArrowUp no slide-registry quando `current > 0`.

### Fase 3 — ArrowDown e animações
5. **Revisar ArrowDown:** Decidir se ArrowDown deve apenas advance (como ArrowRight) ou se Reveal usa para outra coisa. Se conflito, remover ArrowDown da interceptação e documentar.
6. **Ajustar animações:** Garantir que `translateY` não cause "texto desce" — revisar fromTo (y: 20 → y: 0 está correto para "subir"; se usuário vê "descer", pode ser easing ou duração).

### Fase 4 — UX e polish
7. **Case panel em s-hook:** Ocultar ou minimizar quando slide mostra dados expandidos (beat 0).
8. **QA script:** Aumentar delay antes do primeiro screenshot (1,5s) para countUp + stagger completarem.
9. **Indicador de beats:** Opcional — "1 · 2" ou dots para affordance.

---

---

## 7. Re-análise PNG (pós-fix contraste)

**PNGs:** `aulas/cirrose/qa-screenshots/stage-c/02-s-hook-beat-00.png`, `02-s-hook-beat-01.png`

### Melhorias confirmadas
- **Contraste beat 1:** Texto branco legível sobre navy (fix ERRO-009 aplicado)
- **Beat 0:** FIB-4 3,2 completo, 5 labs visíveis (delay 1,5s funcionou)
- **Lab refs:** Legibilidade melhorada

### Problemas persistentes
- **Texto descentralizado:** Conteúdo concentrado no centro vertical com margens grandes topo/baixo. Beat 1: pergunta "ligeiramente elevada" do centro absoluto — sensação de desbalanceamento.
- **Sem retorno:** ArrowLeft/Up ainda vai para slide anterior (ERRO-010)
- **Seta baixo move texto:** ArrowDown causa movimento vertical indesejado (ERRO-011)

### Novos achados
- **Fill ratio beat 1:** Ainda ~8–10% do canvas (ERRO-007)
- **Case panel:** Redundância persiste (ERRO-008)

---

*Gerado: 2026-02-28 · Re-análise: 2026-02-28*

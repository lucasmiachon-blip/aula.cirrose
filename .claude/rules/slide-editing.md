# Slide Editing Rules

> Relacionados: [css-errors](css-errors.md) · [design-system](design-system.md) · [deck-patterns](deck-patterns.md) · [medical-data](medical-data.md)

## Checklist Pré-Edição (OBRIGATÓRIO)

Antes de editar QUALQUER slide:

- [ ] `<h2>` é asserção clínica (NÃO rótulo genérico)
- [ ] Sem `<ul>` ou `<ol>` no slide (só em notes/apêndice)
- [ ] `<aside class="notes">` presente com timing e fontes
- [ ] `<section>` NÃO tem `style` com `display` (E07)
- [ ] Tags balanceadas
- [ ] Dados numéricos verificados (ver `medical-data.md`)
- [ ] Layout em `.slide-inner`, não no `<section>`
- [ ] Background: `data-background-color` HEX (Reveal legacy) ou CSS class (deck.js)
- [ ] Se bg escuro: `.slide-inner` tem `.slide-navy`
- [ ] Sem CDN links
- [ ] Animações via `data-animate`, NUNCA gsap inline

---

## Batch Workflow

1. Declarar quais slides e o que muda
2. Esperar aprovação
3. Executar (máx 5 slides por batch — E06)
4. Preview no browser
5. Commit: `[AULA] batch N — descrição`
6. Próximo batch

**"Só ajusta X" = escopo é APENAS X (E20)**

---

## AI Markers (PROIBIDO)

- Linhas decorativas sob títulos
- Emojis em slides médicos
- Gradientes decorativos sem função informacional
- Sombras excessivas em elementos simples

---

## Narrative QA Checklist

Antes de declarar slide "done", verificar:

- [ ] `narrativeRole` em _manifest.js corresponde à função do slide no arco
- [ ] `tensionLevel` em _manifest.js bate com narrative.md (● dots)
- [ ] Se `narrativeCritical: true` → h2 NÃO pode mudar sem `[LUCAS DECIDE]`
- [ ] Checkpoint NÃO revela resposta de ato posterior (forbidEarlyReveal)

Validação automática: `npm run lint:narrative-sync`

Para mudanças em slides narrativeCritical, usar protocolo Decision Record:
ver `references/decision-protocol.md`

---

## Regras deck.js (ERRO-LOG codificadas)

| Regra | Fonte |
|-------|-------|
| Click handlers DENTRO de slides: `stopPropagation()` obrigatorio para nao propagar ao nav layer | ERRO-033 |
| Custom animations: registrar (`wireAll`) ANTES do dispatcher conectar | ERRO-016 |
| Background escuro em deck.js: CSS `background-color` com seletor `#slide-id .slide-inner`, NAO `data-background-color` | ERRO-034 |
| `[TBD]` permitido APENAS em `<aside class="notes">`. NUNCA em headline, source-tag ou corpo projetado | ERRO-029 |
| Archetype scope: reutilizar elementos de um archetype em outro requer re-declarar display/flex no novo contexto | ERRO-018/032 |

---

## Referencias cruzadas

- Flexbox anti-patterns → `css-errors.md` Cluster A (E06-E34)
- Cores e semantica → `design-system.md`
- Speaker notes formato → `deck-patterns.md`
- Click-reveal e deck.js → `deck-patterns.md`
- Appendice: `data-visibility="hidden"` → `deck-patterns.md`
- Fragments (Reveal.js legacy only) → `reveal-legacy.md`
- Dados medicos → `medical-data.md`

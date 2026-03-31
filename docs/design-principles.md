# Princípios de Design (27)

> Referência on-demand. NÃO carrega automaticamente no context.
> Consultar quando: criando slide novo, revisando layout, decisão de hierarquia visual.

---

## Assertion-Evidence (Alley)
`<h2>` = asserção completa. Corpo = APENAS evidência visual. Bullets PROIBIDOS.

## Cognição

| Princípio | FAZER | Anti-padrão |
|-----------|-------|-------------|
| Chunking (Cowan 4±1) | Max 4 items por grupo, 3 ideal | 6+ bullets sem grupo |
| Von Restorff | 1 hero 2-3x maior que corpo | Tudo mesmo tamanho |
| Gestalt Proximidade | Gap interno < ½ gap entre grupos | Espaço uniforme |
| Gestalt Similaridade | Mesmo tipo info = mesma cor/forma | Cards com estilos diferentes |
| Dual Coding (Paivio) | Dado numérico = representação visual | Tabela seca |
| Cognitive Load (Sweller) | Zero decoração/redundância | Gradientes sem função |
| Signaling (Mayer) | Destaque = dado mais importante. Cor = semântica clínica | Cor vibrante sem significado |
| Spatial Contiguity | Label junto ao dado | Número no topo, explicação no rodapé |
| Redundancy | Slide=visual, fala=explicação. Não duplicar | Parágrafo que palestrante lê |
| Contiguidade Temporal | Evidência aparece no instante da fala | Slide completo visível de cara |
| Primacy-Recency | Importante no início e final | Info crítica no minuto 25 |
| Anchoring | Número de contraste ANTES do alvo | Resultado sem referência |

## Andragogia
- **Expertise-Reversal:** Congress = zero revisão básica. Ir direto a NNT/GRADE/conduta.
- **Testing Effect:** Checkpoint ANTES de revelar resposta.

## Duarte
- **Sparkline Narrativa:** Alternar problema/solução, min 4 beats.
- **Contraste como Ritmo:** Alternar bg escuro/claro = marcador narrativo.
- **Ponto Focal Único:** UM elemento dominante por slide.
- **Regra de 3:** Max 3 grupos por layout.

## Tufte
- **Data-Ink Ratio:** Cada pixel carrega informação. Zero gridlines decorativas.
- **Tabelas Tufte:** Sem bordas verticais. Horizontal só thead/totais. Números à direita.
- **Small Multiples:** Mesmo layout repetido com dados diferentes.
- **Lie Factor = 1:** Visual proporcional ao dado.
- **Layering:** Separar com cor/posição/opacidade, sem bordas.

## Layout Patterns
- **F-Pattern:** Texto + dados laterais.
- **Z-Pattern:** Impacto (abertura, hero, CTA).
- **Hierarquia:** Tamanho > Cor/Contraste > Posição > Peso tipográfico.

| Tipo slide | Fill Ratio |
|-----------|-----------|
| Data-heavy | 75-90% |
| Conceitual | 65-80% |
| Checkpoint | 50-65% |
| Hero/quote | 30-55% |

## Anti-padrões
- **Taglines editoriais:** Frases que resumem sem asserir adicionam zero valor clínico. H2 = assertiva médica. NUNCA hooks editoriais.
- **AI Markers:** Linhas decorativas sob títulos, emojis em slides médicos, gradientes sem função, sombras excessivas.

## Contraste WCAG

| Combinação | Meta |
|-----------|------|
| --text-primary em --bg-surface | ≥7:1 |
| --text-on-dark em --bg-navy | ≥7:1 |
| --text-muted em --bg-surface | ≥4.5:1 |

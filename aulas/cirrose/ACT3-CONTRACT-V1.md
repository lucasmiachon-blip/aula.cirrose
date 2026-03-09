# ACT 3 — Contract v1 (recompensação)

## Truth status desta sessão
- Eu reli os MDs-orquestradores do projeto e o handoff do chat.
- Eu **não consegui abrir o repo** `lucamiachon-blip/aulas` neste ambiente, então este documento **não certifica** o estado real de `CLAUDE.md`, `CASE.md`, `evidence-db.md`, `narrative.md`, `_manifest.js` ou `HANDOFF.md`.
- Portanto, isto é um **contrato operacional para o Ato 3**, não uma auditoria do repo.

## Decisão-mãe
- **Ato 3 permanece hipotético, não linear.**
- Tese: **se o insulto cessa e os fatores de risco são controlados, parte dos pacientes pode recompensar — mas recompensar não é “voltar ao normal”.**

## Recomendação de framing
- **Definição canônica:** Baveno VII estrito.
- **Lente secundária:** critério expandido, claramente rotulado como expansão de pesquisa e não como consenso oficial.
- **Proibição:** chamar melhora por TIPS isoladamente de “recompensação”.
- **Proibição:** dar alta de vigilância de HCC apenas porque houve melhora clínica.

## P0
1. Não fingir auditoria do repo.
2. Fechar a tese factual do Act 3.
3. Escolher o bridge slide do Ato 2 para o Ato 3.
4. Definir se o core usará Baveno VII estrito + expansão como nuance.
5. Marcar lacunas restantes como `[TBD SOURCE]` sem inventar.

## Bridge slide recomendado
### Headline
**“Após ascite como primeira descompensação, cura etiológica reduziu nova descompensação (HR 0,46) e mortalidade (HR 0,35).”**

### Source tag
- Hepatology 2023
- PMID 37190823
- 622 pacientes
- ascite = primeira descompensação única

## Arquitetura proposta do Act 3

### A3-01 — A pergunta certa
**E se o insulto cessar depois da primeira grande descompensação?**
- usar o dado da ascite como primeira descompensação para abrir o “what if”
- não é continuação linear do caso
- é um cenário contrafactual pedagógico

### A3-02 — Recompensação existe, mas o critério estrito é duro
**“Recompensação estrita não é só melhorar: em coorte 2025, só 7% preencheram Baveno VII.”**
- etiologia removida / suprimida / curada
- desaparecimento de ascite, HE e HDA
- melhora sustentada da função hepática

### A3-03 — Estrito vs expandido
**“Critério expandido ampliou o grupo (37,6% vs 7,0%) sem pior prognóstico aparente na coorte derivação/validação.”**
- expanded = pacientes em baixa dose de diurético e/ou lactulose/rifaximina ≥12 meses
- usar apenas como nuance, não como definição oficial do deck

### A3-04 — A magnitude da melhora depende da etiologia
**“A chance de recompensar muda com a etiologia: ~1/3 em álcool com abstinência, 36,6% após cura do HCV, 56,2% no HBV tratado.”**
- álcool: um terço em 5 anos com abstinência sustentada
- HCV: 36,6% recompensaram
- HBV: 56,2% preencheram definição de recompensação no estudo de validação

### A3-05 — O que melhora não é igual ao que some
**“Descompensação pode desaparecer antes da hipertensão portal desaparecer: CSPH persistiu em 53–65% após SVR.”**
- usar slide para separar:
  - melhora clínica
  - melhora laboratorial
  - persistência de portal hypertension / varizes / risco residual
- bom lugar para encaixar LSM <12 kPa + plaquetas >150 mil como regra de baixo risco pós-cura do HCV

### A3-06 — Recompensou ≠ alta da vigilância
**“Cirrhose continua em rastreio: AASLD recomenda US + AFP semestral em indivíduos de risco, incluindo cirrose de qualquer etiologia.”**
- combinar guideline com dado de risco residual
- deixar claro que HCC pode persistir como ameaça mesmo com melhora clínica

### A3-07 — Fechamento do ato
**“Recompensação é estado de menor risco, não certificado de cura estrutural.”**
- payoff do ato
- preparar abertura para apêndice / HCC / critérios / biomarcadores / não cirróticos se necessário

## O que vai para apêndice
- HCC em não cirróticos
- nuances AFP baixo / AFP negativo
- mortalidade por estágio sem tratamento
- delisting de transplante por melhora, se não couber no arco principal

## Fontes-âncora sugeridas
1. PMID 37190823 — ascite como primeira descompensação; HR 0,46 e HR 0,35
2. PMID 36646527 — conceito Baveno VII de recompensação
3. PMID 40228583 — estrito 7% vs expandido 37,6%
4. PMID 41580090 — álcool; um terço em 5 anos
5. PMID 40378989 — HCV; morte/PVT caem, HCC não cai claramente
6. PMID 36038017 — HBV; 56,2% no estudo de validação
7. PMID 32535060 — CSPH pode persistir após SVR
8. PMID 37199193 — AASLD HCC guidance
9. PMID 39220088 — melhora por TIPS não deve ser chamada de recompensação

## O que NÃO aprovar
- “o fígado se recupera” como headline
- misturar estrito e expandido sem rótulo
- vender recompensação como reversão completa
- chamar TIPS de recompensação
- suspender vigilância de HCC com base em melhora clínica isolada
- abrir discussão de HTML/JS antes de travar a source of truth do ato

## Prompt sugerido para Opus
```md
Objetivo: produzir `RAW_ACT3_V1` para o deck de cirrose.

Contexto mandatório:
- Ato 3 é **hipotético** e **não** continuação linear do Ato 2.
- Tese central: após cessação do insulto e controle de fatores de risco, parte dos pacientes pode **recompensar**, mas recompensação não equivale a risco zero.
- Use o **Baveno VII estrito como definição canônica**.
- Pode discutir **critério expandido** apenas como nuance/expansão de pesquisa, claramente rotulado.
- Não chame melhora por TIPS isoladamente de recompensação.
- Não autorize alta de vigilância de HCC com base em melhora clínica.

Fontes âncora prioritárias:
- PMID 37190823
- PMID 36646527
- PMID 40228583
- PMID 41580090
- PMID 40378989
- PMID 36038017
- PMID 32535060
- PMID 37199193
- PMID 39220088

Entregue:
1. tese narrativa do Act 3 em 1 parágrafo
2. lista de slides do Act 3 em ordem
3. para cada slide:
   - objective
   - headline factual
   - anchor number
   - source/study/guideline
   - practical implication
   - o que o slide não pode sugerir
4. diferencie explicitamente:
   - recompensação estrita
   - recompensação expandida
   - melhora clínica sem recompensação verdadeira
5. inclua uma seção curta “what improves / what may persist / what still mandates surveillance”
6. trate HCC em não cirróticos preferencialmente no apêndice
7. marque `[TBD SOURCE]` onde faltar fonte forte; não invente

Regras:
- sem headline genérica
- sem número sem estudo
- sem estudo sem implicação prática
- sem HTML/JS por enquanto
```

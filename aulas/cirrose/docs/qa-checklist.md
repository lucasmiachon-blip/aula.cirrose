# Agent: QA Checklist

> Assertions de qualidade por slide. Executar APÓS cada refactor.
> Cada assertion é binária: PASS ou FAIL. Target: 100% PASS.

## Global Assertions (aplicar em TODOS os slides)

| # | Assertion | Método |
|---|-----------|--------|
| G1 | `<h2>` é assertion clínica (verbo + dado), não rótulo genérico | Visual |
| G2 | Zero bullet points (`<ul><li>` permitido apenas em speaker notes) | DOM grep |
| G3 | Fill ratio ≥ 60% (conteúdo ocupa ≥60% da viewport) | Screenshot |
| G4 | Nenhum texto truncado ou clipado por case panel | Screenshot |
| G5 | `<aside class="notes">` presente e não-vazio | DOM grep |
| G6 | Zero erros no console do browser | DevTools |
| G7 | `data-animate` ou `registerCustom` — conteúdo não fica `opacity: 0` | Nav + hash jump |
| G8 | Contraste texto ≥ 4.5:1 (WCAG AA) | Lighthouse |
| G9 | Source-tag presente se slide contém dado citável (HR, NNT, p, %) | Visual + evidence-db.md |
| G10 | Nenhum `!important` novo adicionado | CSS diff |

## Per-Slide Assertions

### s-title
- [ ] Hero typography (headline ≥ `--text-hero`)
- [ ] Subtítulo menor que headline (ratio ≥ 1.5×)
- [ ] Identidade visual (não parece template genérico)

### s-a1-01 (hero-stat — continuum)
- [ ] Hero "83%" proeminente
- [ ] Pathway 3-step visível
- [ ] Click-reveal: source-tag funcional (ArrowRight)

### s-a1-classify (hero-stat — PREDESCI)
- [ ] Hero HR 0,51 dominante
- [ ] 3 assertion cards (compensado/1ª/2ª descomp)
- [ ] Click-reveal funcional

### s-hook (custom — 2 beats)
- [ ] Beat 0: Antônio + bio + 6 labs grid 3x2 (auto stagger)
- [ ] Beat 1 (click): "Sem queixas." + "Qual sua conduta?"
- [ ] Navegação bidirecional: click/→ avança, ←/↑ retorna
- [ ] Contraste OK (cores literais em #s-hook, não tokens dark)
- [ ] CasePanel state = hidden
- [ ] Failsafe .no-js/.stage-bad funciona (beat 0 não fica vazio)

### s-a1-vote (poll)
- [ ] h2 "Esse paciente tem cirrose?"
- [ ] 3 opções clicáveis (A/B/C)
- [ ] Click em qualquer → reveal FIB-4 5,91 countUp
- [ ] Retreat reseta DOM

### s-a1-damico (flow — 3 eras)
- [ ] 3 eras (CTP, MELD-Na, D'Amico pathway) via clickReveal
- [ ] Fill <=100% (sem overflow)
- [ ] c-stat 0,87 countUp na era MELD

### s-a1-baveno (hero-stat — espectro)
- [ ] "Cirrose" dissolve → espectro cACLD/dACLD
- [ ] Pathway 3-step (FIB-4 → Elastografia → Rule of 5)
- [ ] 2 clickReveals funcionais

### s-a1-fib4 (hero-stat — calculadora)
- [ ] Fórmula FIB-4 visível
- [ ] 3 cutoff zones (safe/warning/danger)
- [ ] Click 1 → Antonio inputs + hero 5,91 countUp
- [ ] Click 2 → source-tag

### s-a1-rule5 (flow — 5 zones)
- [ ] 5 zones LSM empilhadas com ícones daltonismo
- [ ] Antonio pin plotado a 21 kPa (click)
- [ ] Gray zone 10-25 kPa visível

### s-a1-meld (hero-stat — semáforo)
- [ ] 4 bandas MELD (green/yellow/orange/red) com CSS dots
- [ ] Threshold line animação width
- [ ] Mortalidade 90d por faixa

### s-cp1 (checkpoint)
- [ ] CasePanel state = caution
- [ ] Click-reveal: 3 decision options funcionais
- [ ] Nenhuma option truncada pelo panel
- [ ] Background caution (amarelo sutil)

### s-a2-01 (flow — gatilhos)
- [ ] Gatilhos de descompensação visíveis
- [ ] Headline assertion: gatilho identificável na maioria dos casos

### s-a2-02 (flow — ascite dx)
- [ ] Paracentese <=12h, GASA >1,1
- [ ] Headline assertion com dados

### s-a2-03 (flow — ascite manejo)
- [ ] Escalonamento espiro/furo visível
- [ ] Sem overflow

### s-a2-04 (bars — infecção)
- [ ] Bar chart infecção precipita 1/3 descompensações
- [ ] Archetype diferente (bars, não flow)

### s-a2-05 (flow — PBE)
- [ ] PMN >=250 = tratar
- [ ] Sort NNT 5 referenciado

### s-a2-06 (flow — HDA)
- [ ] Vasoativo + EDA <12h + ATB
- [ ] Early TIPS em 72h se Child B/C

### s-a2-07 (metrics — carvedilol)
- [ ] 4 states progressivos (headline → HR → NNT → dose)
- [ ] 3 clickReveals funcionais

### s-a2-08 (pillars — EH)
- [ ] 3 pilares visíveis (lactulose, rifaximina, nutrição)
- [ ] "NÃO restringir proteína" no headline

### s-cp2 (checkpoint)
- [ ] CasePanel state = danger
- [ ] Background danger (vermelho sutil)
- [ ] Na e MELD-Na com valores visíveis no case card

### s-a3-01 (hero-stat — bridge)
- [ ] HR 0,35 mortalidade + HR 0,46 descompensação
- [ ] Transição do nadir para esperança

### s-a3-02 (criteria — recompensação)
- [ ] Critérios Baveno VII recompensação
- [ ] Headline assertion

### s-a3-03 (compare — expandido)
- [ ] Estrito 7,0% vs Expandido 37,6%

### s-a3-04 (compare — etiologia)
- [ ] HBV >50%, HCV ~37%, álcool menor
- [ ] 3 etiologias comparadas

### s-a3-05 (compare — SVR)
- [ ] CSPH persiste em 53% pós-SVR
- [ ] 3 colunas melhora/persiste/vigília

### s-a3-06 (surveillance — vigilância)
- [ ] "6 meses" com destaque
- [ ] "Nunca dar alta" no headline

### s-cp3 (checkpoint)
- [ ] CasePanel state = hope
- [ ] Background hope (verde sutil)
- [ ] "32 → 18" com destaque visual

### s-close (recap)
- [ ] 3 take-homes visíveis
- [ ] CasePanel state = resolved (timeline)
- [ ] Headline hero-sized

### Appendix (s-app-01, s-app-02, s-app-03, s-app-04, s-app-alb, s-app-07, s-app-08, s-app-etio)
- [ ] Case panel oculto OU conteúdo respeita largura disponível
- [ ] Dados clínicos conferem com evidence-db.md
- [ ] Tabelas/comparações legíveis por completo

## Scoring pós-QA

Usar rubrica do AUDIT-VISUAL.md (14 dimensões × 1-10):

**Visuais (originais):**
- **H** = Hierarquia Visual · **T** = Tipografia · **E** = Espaço & Layout · **C** = Cor & Contraste
- **V** = Visuais & Figuras · **K** = Consistência · **S** = Sofisticação · **M** = Comunicação

**Técnico-pedagógicas (novas):**
- **I** = Interações · **D** = Dados clínicos · **A** = Acessibilidade
- **L** = Carga cognitiva (Sweller) · **P** = Aprendiz adulto (Knowles) · **N** = Arco narrativo (Duarte)

Verificação de dados: `grep "s-{id}" references/evidence-db.md` — conferir HR, NNT, PMID.

- **PASS:** todas 14 dimensões ≥ 9 por slide
- **WARN:** qualquer entre 7-8
- **FAIL:** qualquer < 7
- **Target global:** PASS em 44 slides
- Se FAIL: fix cirúrgico → re-audit até PASS

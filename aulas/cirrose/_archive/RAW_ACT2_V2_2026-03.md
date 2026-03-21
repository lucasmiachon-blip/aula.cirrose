RAW_ACT2_V2 — Ato 2: INTERVIR
Coautor critico: Claude Opus 4.6
Data: 2026-03-08
Atualizado: 2026-03-08 (pos-audit agentes rifaximina + magic numbers)
Hierarquia: CASE.md > evidence-db.md > narrative.md > _manifest.js > este arquivo

===================================================================
VERDICT
===================================================================

A arquitetura de 16 slides + CP2 e clinicamente solida e narrativamente escalante. O paciente progride de compensado com gatilho armado ate ACLF/MELD 28, passando por todas as descompensacoes relevantes. O arco funciona.

PROBLEMAS:

1. VOLUME. 17 slides a 2,6 min media = 45 min. Factivel para 90 min totais, mas sem margem. Slides A2-03 (manejo ascite), A2-09 (nutricao) e A2-07 (NSBB) sao os mais compressiveis se rehearsal exigir.

2. FADIGA DE ASCITE. Ascite aparece em 3 slides (dx, manejo, refrataria). Headlines DEVEM ser radicalmente distintos. Se a plateia sentir repeticao, o arco quebra.

3. MAGIC NUMBERS SEM FONTE. A arquitetura anterior continha "5% de sobrevida por mes de atraso" (MELD>15) e "reduz mortalidade em 20%" (HDA package) — nenhum dos dois tem fonte no evidence-db. Foram removidos.

4. MELD INTERMEDIARIOS. CASE.md define ~10 (baseline) e 28 (CP2). Os valores intermediarios (12, 14, 17, 18) sao CONSTRUCOES NARRATIVAS plausíveis, nao dados clinicos. Devem ser rotulados como tal.

5. 3a INTERACAO. A arquitetura anterior dizia "nao necessaria." Discordo. 16 slides de HTML/JS com apenas 2 interacoes nao justificam o meio. 3 interacoes, bem distribuidas, sao o minimo.

===================================================================
WHERE I DISAGREE WITH USER
===================================================================

1. "Nutricao deve ser slide proprio, mas rapido."
CONTRAPONTO: Sarcopenia tem mortalidade independente de MELD. Prevalencia 40-70% em cirroticos [TBD SOURCE — meta-analises divergem]. "Rapido" pode subestimar o impacto pedagogico. Recomendo: slide proprio, 2-3 min, com 1 numero-hero (prevalencia ou HR de mortalidade) + a reversao do mito da restricao proteica. Nao e "rapido" — e denso e curto.

2. O usuario nao discorda de nada factualmente errado. As opinoes de coautor estao corretas nos pontos #1-#7 do briefing.

===================================================================
WHERE I DISAGREE WITH CHATGPT COAUTHOR
===================================================================

O ChatGPT 5.4 Pro contribuiu o draft dramatico da narrativa. Criticas:

1. HEADLINES JORNALISTICAS. "5 gatilhos transformam cirrose compensada em emergencia" e linguagem de manchete, nao de congresso. Hepatologistas seniores rejeitam drama. Headlines devem ser factuais e secos: "Descompensacao tem gatilho identificavel em >70% dos casos" > "5 gatilhos transformam."

2. ATO 2 COMO LISTA DE TOPICOS. O draft original tratava Act 2 como "albumina, PBE, HRS, HE" — topicos independentes. A cascata do paciente (que eu e Lucas definimos) e superior porque mostra causalidade clinica, nao enciclopedia.

3. TENSAO INFLADA. narrative.md marca s-a2-03 (albumina) como tensao 4/5 e s-a2-05 (HRS) como tensao 4/5. Na cascata refeita, a tensao so chega a 4 no ACLF e a 5 no CP2. Albumina como "twist" funciona narrativamente mas nao merece tensao 4 se distribuida entre PBE e ACLF em vez de slide proprio.

4. CHEKHOV'S GUN "ATTIRE." O framing de ATTIRE como "armadilha" simplifica demais. ATTIRE foi um trial bem desenhado que mostrou que albumina targeted (5 dias) em ACLF hospitalizado NAO reduz mortalidade vs SOC. Nao e armadilha — e medicina baseada em evidencia funcionando. O ponto pedagogico correto e: "albumina funciona em contextos especificos (PBE, LVP, ACLF-challenge), nao como rotina em todo cirrotico internado."

5. MELD PROGRESSION IMPLAUSIVEL. O draft nao definiu valores intermediarios de MELD. A arquitetura posterior (minha) criou 10->12->14->17->18->28->24, que e plausivel mas nao validado. Os saltos precisam de justificativa clinica (Cr, bilirrubina, INR) em cada ponto.

===================================================================
WHERE USER IS RIGHT AGAINST BOTH OF US
===================================================================

1. "Headlines tecnicas, nao jornalisticas." Correto. Tanto o ChatGPT (draft dramatico) quanto eu (arquitetura) erramos para o lado da narrativa. O publico e de hepatologistas seniores. H2 = afirmacao factual com numero.

2. "Trial antigo vs recente." Correto. Cada slide do Act 2 deve mostrar a evolucao da evidencia quando relevante (ex: albumina Sort 1999 -> ANSWER 2018 -> ATTIRE 2021 -> AGA 2025). Nem o draft nem a arquitetura estruturaram isso.

3. "3+ interacoes." Correto. A arquitetura dizia 2. O usuario pediu minimo 3. Para justificar HTML/JS vs PPTX, 3 interacoes em 16 slides e o minimo.

4. "Rifaximina Brasil-real." Nem o draft nem a arquitetura tinham dados de acesso brasileiro. O usuario identificou uma lacuna pratica critica para o publico-alvo.

5. "Fundir ascite dx + manejo e erro." Correto. Sao momentos clinicos distintos (emergencia vs cronico). A arquitetura manteve separados, mas a versao compacta propunha fusao. O usuario tem razao em vetar.

===================================================================
SOURCE OF TRUTH AUDIT
===================================================================

evidence-db.md vs o que a arquitetura afirma:

| Claim na arquitetura | No evidence-db? | Status |
| PREDESCI HR 0,51 NNT 9 | SIM (PMID 30910320) | OK |
| Early TIPS 86% vs 61% | SIM (PMID 20573925) | OK |
| Sort NNT 5 morte / 4 renal | SIM (PMID 10432325) | OK |
| ANSWER NNT 9 morte 18m | SIM (PMID 29861076) | OK |
| ATTIRE NNT infinito | SIM (PMID 33657293) | OK |
| Bass rifaximina NNT 4 | SIM (PMID 20335583) | OK |
| CONFIRM terlipressina NNT 7 | SIM (PMID 33657294) | OK |
| CONFIRM NNH 12 respiratorio | SIM (corrigido de 11) | OK |
| CANONIC ACLF G3 73% 28d | SIM (PMID 23474284, corrigido) | OK |
| Infeccao 33% descomp | CANDIDATE (PMID 32275982) | VERIFICAR |
| PBE PMN >=250 | SIM (EASL CPG 2024) | OK |
| "5% sobrevida/mes atraso" | NAO | REMOVIDO — sem fonte |
| "reduz mortalidade 20%" HDA | NAO | REMOVIDO — sem fonte |
| "10% PBE silenciosa" | NAO | [TBD SOURCE] |
| "30% covert HE" | NAO | [TBD SOURCE] |
| "40-70% sarcopenia" | NAO | [TBD SOURCE] |
| "15 centros TIPS no Brasil" | NAO | [TBD SOURCE] |
| "QTc >500ms" threshold CCM | NAO (evidence-db cita CCC 2019) | VERIFICAR |
| CCM prevalencia 48% | SIM (Ann Saudi Med 2025) | PMID TBD |
| Ascite refrataria ICA 1996 | SIM (PMID 8550036) | OK |
| SHP PaO2 <=80 A-a >=15 | SIM (PMID 15084697) | OK |
| TIPS further decomp 48vs63% | SIM (Larrue PMID 37141993) | OK |

MISSING IN EVIDENCE_DB:
- Sarcopenia prevalencia/mortalidade em cirrose (meta-analise)
- Covert HE prevalencia
- Regra de 6 meses de abstinencia (historia e atualizacao)
- Mathurin 2011 early transplant ALD (ESTA no evidence-db: PMID 22070476)
- ESPEN 2019 guidelines nutricao em cirrose
- PEG-3350/HELP trial (ESTA: PMID 25243839)
- Norfloxacino profilaxia PBE (guideline ref)

===================================================================
NARRATIVE AUDIT
===================================================================

ARCO FUNCIONA: compensado -> gatilho -> ascite -> infeccao -> PBE -> HDA -> profilaxia -> EH -> nutricao -> transplante -> ACLF -> refrataria -> cardio -> pulmonar -> TIPS -> CP2.

TENSAO CRESCENTE:
A2-01 a A2-03: setup, tensao 1-2 (ascite e manejo)
A2-04 a A2-07: escalada, tensao 2-3 (infeccao, PBE, HDA, NSBB)
A2-08 a A2-09: pausa reflexiva, tensao 2 (EH, nutricao)
A2-10: pivo, tensao 3-4 (MELD>15 interacao)
A2-11: nadir, tensao 4-5 (ACLF)
A2-12: escalada final, tensao 4 (refrataria interacao)
A2-13 a A2-14: complicacoes sistemicas, tensao 3
A2-15: resolucao parcial, tensao 3 (TIPS)
A2-16 (CP2): nadir consolidado, tensao 5

RISCO NARRATIVO: pausa em A2-13/A2-14 (cardio/pulmonar) pode quebrar tensao apos ACLF. Mitigacao: headlines conectam a decisao de TIPS/transplante, nao sao enciclopedicos.

CHEKHOV'S GUNS ATIVOS NO ATO 2:
- Caminhoneiro -> EH (A2-08): nao pode dirigir. Payoff forte.
- ATTIRE -> albumina distribuida em PBE (A2-05) e ACLF (A2-11): nao e slide proprio, e contraste contextualizado.
- LSM 32 (CP2) -> 18 (CP3): setup no nadir, payoff no Ato 3.
- Carvedilol abandonado -> HDA (A2-06): ironia narrativa — se nunca tivesse parado, nao estaria sangrando.

CALLBACKS AO HOOK:
- "5 numeros" precisa ser rastreavel: FIB-4, LSM, MELD, PLQ, albumina
- "3 decisoes" precisa ser identificavel: (1) classificar/NSBB, (2) tratar descompensacao, (3) listar para TX
- O Ato 2 cobre decisoes 2 e 3. Decisao 1 foi no Ato 1.

===================================================================
MAGIC NUMBERS AUDIT
===================================================================

CONFIRMADOS (evidence-db com PMID):
- HR 0,51 (IC 0,26-0,97) PREDESCI — NSBBs, nao carvedilol isolado
- NNT 9 PREDESCI 3 anos
- Early TIPS sobrevida 86% vs 61% (Garcia-Pagan 2010)
- Sort: albumina em PBE NNT 5 morte / NNT 4 IRA
- ANSWER: albumina longo prazo NNT 9 morte 18m
- ATTIRE: albumina ACLF NNT infinito (negativo)
- Bass: rifaximina NNT 4 HE recorrente 6m
- CONFIRM: terlipressina NNT 7 reversao HRS / NNH 12 respiratorio
- CANONIC: ACLF G1 ~22%, G2 ~32%, G3 ~73% mortalidade 28d
- TIPS IPD: further decomp 48% vs 63% (Larrue 2023)
- Ascite refrataria: espironolactona 400mg + furosemida 160mg >=1 sem (ICA 1996)

REMOVIDOS (sem fonte):
- "5% sobrevida por mes de atraso na listagem" — NAO EXISTE no evidence-db. Origem provavel: extrapolacao ou numero de memoria. REMOVIDO.
- "reduz mortalidade em 20%" para pacote HDA — NAO EXISTE. O beneficio do pacote (vasoativo + EDA + ATB) e real mas o "20%" precisa de fonte especifica. REMOVIDO.

PENDENTES DE FONTE [TBD SOURCE]:
- PBE silenciosa prevalencia ("10%"?) — precisa meta-analise ou coorte
- Covert HE prevalencia ("30%"?) — precisa fonte especifica. Varia 20-80% na literatura dependendo do teste usado
- Sarcopenia prevalencia em cirrose ("40-70%"?) — precisa meta-analise
- Numero de centros TIPS no Brasil ("15"?) — precisa pesquisa ou consulta com sociedade
- Proteina 1,2-1,5 g/kg — verificar se ESPEN 2019 ou EASL CPG

CORRECOES:
- PREDESCI: o trial testou NSBBs (propranolol em respondedores + carvedilol em nao-respondedores ao propranolol). NAO e "carvedilol previne descompensacao" — e "NSBBs previnem." O headline do slide atual (s-a2-01) diz "carvedilol previne" — TECNICAMENTE INCORRETO. Correto: "NSBBs previnem a primeira descompensacao em cACLD com CSPH."
- CONFIRM NNH: evidence-db ja corrigiu de 11 para 12. OK.

===================================================================
ACT 2 FINAL ORDER
===================================================================

A2-01: GATILHOS DE DESCOMPENSACAO
- headline provisoria: "Descompensacao tem gatilho identificavel na maioria dos casos — infeccao, alcool e nao-adesao lideram"
- funcao narrativa: transicao Act 1 -> Act 2. Compensada nao e estavel.
- evento do paciente: Antonio manteve etilismo, abandonou carvedilol. FIB-4 piorou, LSM subiu.
- decisao pratica: identificar e tratar/prevenir gatilhos ANTES da descompensacao
- trial antigo vs recente: D'Amico 2006 (descompensacao como evento) vs PREDICT 2020 (gatilhos identificaveis em ~33% por infeccao) vs D'Amico 2024 (further decomp em ~60%)
- source: PREDICT PMID [CANDIDATE 32275982], D'Amico 2024 PMID 37916970

A2-02: ASCITE — DIAGNOSTICO
- headline provisoria: "Ascite nova = paracentese diagnostica. GASA >1,1 confirma portal. PMN <250 exclui PBE neste momento"
- funcao narrativa: primeiro golpe. Antonio cruza a linha compensado -> descompensado.
- evento do paciente: distensao abdominal progressiva. Paracentese: GASA >1,1. PMN 180 (por enquanto).
- decisao pratica: puncionar em <12h. Nunca postergar por medo da agulha. Calcular GASA. Contar PMN.
- trial antigo vs recente: Runyon 1992 (GASA original) vs EASL CPG 2024 (protocolo atual)
- source: EASL CPG 2024 [MISSING IN EVIDENCE_DB — DOI TBD]

A2-03: ASCITE — MANEJO
- headline provisoria: "Espironolactona 100->400 mg + furosemida 40->160 mg: escalonamento, limites e quando pedir LVP + albumina"
- funcao narrativa: conduta pratica pos-diagnostico. Ascite tem manejo, mas e o inicio da espiral.
- evento do paciente: Antonio responde parcialmente a diureticos. LVP mensal. Albumina 8g/L drenado em LVP >5L.
- decisao pratica: meta de perda ponderal (0,5 kg/dia sem edema, 1 kg/dia com). Sodio <=2g/dia. LVP com reposicao de albumina.
- trial antigo vs recente: Gines 1988 (espironolactona como base) vs EASL CPG 2024 (escalonamento padrao)
- source: EASL CPG 2024

A2-04: INFECCOES EM CIRROTICOS
- headline provisoria: "Infeccao precipita 33% das descompensacoes e e a complicacao mais prevenivel"
- funcao narrativa: setup para PBE. Cirrotico e imunodeprimido. Translocacao bacteriana e o mecanismo.
- evento do paciente: Antonio interna por ascite tensa. Na rotina, PMN 380 no liquido — PBE assintomatica.
- decisao pratica: puncionar ascite em TODA internacao. Nao esperar febre ou dor.
- trial antigo vs recente: Fernandez 2002 (infeccao como gatilho) vs PREDICT 2020 (quantificacao: ~33%) vs CLEARED 2024 (infeccao hospitalar como principal complicacao globalmente)
- source: PREDICT [CANDIDATE PMID 32275982], CLEARED PMID 39243795

A2-05: PBE — DIAGNOSTICO, TRATAMENTO E PROFILAXIA
- headline provisoria: "PMN >=250 = ceftriaxone agora + albumina D1/D3. Profilaxia secundaria: norfloxacino enquanto houver ascite"
- funcao narrativa: conduta tempo-sensivel. Cada hora conta. Albumina Sort 1999 reduz mortalidade.
- evento do paciente: Antonio: PMN 380 = PBE confirmada. Ceftriaxone IV. Albumina 1,5 g/kg D1 + 1 g/kg D3. Cr sobe para 1,4.
- decisao pratica: tratar empirico antes da cultura. Albumina obrigatoria (Sort NNT 5). Profilaxia secundaria com norfloxacino 400 mg/dia.
- trial antigo vs recente: Sort 1999 (albumina em PBE: NNT 5 morte, NNT 4 IRA) vs EASL CPG 2024 (protocolo atual) vs AGA 2025 Orman (albumin guidance, NOT INDEXED)
- MAGIC_NUMBERS:
  - value: NNT 5 (morte)
  - meaning: 1 morte evitada a cada 5 pacientes tratados com albumina + ATB vs ATB sozinho
  - source: Sort et al, NEJM 1999
  - PMID: 10432325
  - tier: 1
  - note: n=126, albumina 1,5g/kg D1 + 1g/kg D3. Trial antigo, nao replicado, mas incorporado em todas as guidelines.
  ---
  - value: NNT 4 (insuficiencia renal)
  - meaning: 1 IRA evitada a cada 4 pacientes
  - source: Sort 1999
  - PMID: 10432325
  - tier: 1
- BOX_UPDATE: MELD ~14->17 (Cr subiu). Tag +PBE. Severidade: warning.

A2-06: HDA VARICOSA
- headline provisoria: "HDA varicosa: vasoativo + EDA <12h + ATB profilatico. Early TIPS em 72h se Child B ativo ou C 10-13"
- funcao narrativa: segundo golpe dramatico. Sangramento e visceral. Timing e tudo.
- evento do paciente: Antonio, 6 semanas pos-PBE, apresenta hematemese. Varizes F3 com red signs. EDA de urgencia com ligadura.
- decisao pratica: octreotide/terlipressina IV + EDA <12h + ceftriaxone profilatico. Avaliar early TIPS se criterios (Child B com sangramento ativo ou Child C 10-13).
- trial antigo vs recente: Garcia-Pagan 2010 (early TIPS NNT ~4, PMID 20573925) vs Baveno VII 2022 (criterios atualizados) vs Larrue 2023 IPD (TIPS vs SOC: further decomp 48% vs 63%, n=2338)
- MAGIC_NUMBERS:
  - value: sobrevida 86% vs 61%
  - meaning: early TIPS <72h vs SOC em sangramento com criterio
  - source: Garcia-Pagan, NEJM 2010
  - PMID: 20573925
  - tier: 1
  - note: n=63. Child B com sangramento ativo + Child C 10-13. Follow-up 1 ano.
  ---
  - value: further decomp 48% vs 63% a 2 anos
  - meaning: TIPS vs SOC (meta-analise IPD)
  - source: Larrue 2023
  - PMID: 37141993
  - tier: 1
- INTERACTION:
  - goal: decidir se Antonio preenche criterios para early TIPS
  - trigger: hematemese + Child B9 + varizes F3 + sangramento ativo
  - beat_0: cenario apresentado — sangramento varicoso, 18h desde admissao
  - beat_1: pergunta "Voce indica TIPS preemptivo? (A) Sim, em 72h (B) Nao, ligadura e suficiente (C) Sim, mas preciso transferir"
  - beat_2: reveal — "Child B com sangramento ativo = criterio. Mas Antonio esta em cidade sem TIPS. Transferir ou ligar/ATB e reavaliar?"
  - backward: retreat desfaz a interacao, mostra slide estatico
  - why_not_pptx: decisao depende de multiplas variaveis (Child, tempo, acesso) que podem ser apresentadas como fluxograma interativo. PPTX nao permite reveal condicional.
- BOX_UPDATE: MELD ~17->18. Tag +HDA. Severidade: warning.

A2-07: NSBB + EVL — PROFILAXIA SECUNDARIA
- headline provisoria: "NSBBs previnem descompensacao: NNT 9 em 3 anos. EVL e adjuvante, nao substituto"
- funcao narrativa: ironia narrativa. Se Antonio nunca tivesse parado o carvedilol, nao teria sangrado.
- evento do paciente: reinicia carvedilol 6,25->12,5 mg BID + programa de ligadura elastica.
- decisao pratica: NSBB como base. EVL complementar. Dose-alvo de carvedilol: FC nao <55, PAS nao <90.
- trial antigo vs recente: PREDESCI 2019 (HR 0,51 NSBBs 3a) vs Turco 2024 IPD (NSBB >= EVL, CANDIDATE PMID 38504576) vs Baveno VII (NSBB em CSPH)
- MAGIC_NUMBERS:
  - value: HR 0,51 (IC 0,26-0,97)
  - meaning: reducao de descompensacao ou morte com NSBBs vs placebo
  - source: PREDESCI (Villanueva), Lancet 2019
  - PMID: 30910320
  - tier: 1
  - note: n=201. NSBBs = propranolol em respondedores + carvedilol em nao-respondedores. 3 anos. NAO e carvedilol isolado.
- BOX_UPDATE: nenhuma mudanca no MELD.

A2-08: ENCEFALOPATIA HEPATICA
- headline provisoria: "EH: lactulose titulada + rifaximina NNT 4. Proteina 1,2-1,5 g/kg — restricao piora prognostico"
- funcao narrativa: terceiro golpe + reversao de mito. Chekhov's gun: caminhoneiro nao pode dirigir.
- evento do paciente: Antonio confuso, inverteu sono-vigilia. Covert HE em teste psicometrico. Nao pode mais dirigir — impacto pessoal.
- decisao pratica: lactulose titulada (2-3 evacuacoes/dia) + rifaximina 550 mg BID (se recorrente). NAO restringir proteina. Rastrear covert HE com PHES ou EncephalApp.
- trial antigo vs recente: Bass 2010 (rifaximina NNT 4 HE recorrente, PMID 20335583) vs PEG-3350 HELP 2014 (91% vs 52% melhora 24h, PMID 25243839) vs ESPEN 2019 (proteina 1,2-1,5 g/kg) vs EASL CPG
- MAGIC_NUMBERS:
  - value: NNT 4
  - meaning: 1 episodio de HE recorrente prevenido a cada 4 tratados com rifaximina
  - source: Bass, NEJM 2010
  - PMID: 20335583
  - tier: 1
  - note: n=299. Rifaximina 550mg BID vs placebo. 6 meses. Pacientes com >=2 episodios previos de HE. A maioria usava lactulose concomitante (>90% em ambos os bracos).
- BRAZIL_ACCESS_SNAPSHOT:
  - nome_comercial: Flonorm (EMS), Xifaxan (Salix/Bausch — importado, raro)
  - laboratorio: EMS (principal no Brasil)
  - apresentacao: comprimidos 550 mg, caixas com 28 (Flonorm)
  - posologia_EH: 550 mg BID (1100 mg/dia) — mesma dose do trial Bass 2010
  - preco_faixa: R$ 400-700 por caixa de 28 cp (14 dias). Custo mensal ~R$ 800-1400 [VERIFICAR — pesquisa em andamento]
  - lactulose: R$ 15-40 por frasco 120 mL. Base do tratamento. Sempre associada — rifaximina e add-on, nao substituto.
  - alternativas_brasil: (1) lactulose isolada (SOC); (2) metronidazol (historico, abandonado por neurotoxicidade cronica); (3) neomicina (historico, nefro/ototoxicidade). Na pratica brasileira: lactulose como base, rifaximina como add-on se HE recorrente e paciente tem condicao financeira ou plano de saude.
  - SUS: rifaximina NAO disponivel no SUS na maioria dos estados. Lactulose sim. Implicacao: paciente SUS com HE recorrente = lactulose otimizada + suporte nutricional.
  - tier_clinico: Bass 2010 = tier 1. Preco/acesso = snapshot, NAO tier 1.
- BOX_UPDATE: tag +EH. Severidade: warning.

A2-09: NUTRICAO E SARCOPENIA
- headline provisoria: "Sarcopenia em cirrose: prevalencia alta, mortalidade independente de MELD. Late-evening snack + proteina 1,2-1,5 g/kg"
- funcao narrativa: par com EH. Destroi o mito da restricao proteica na pratica. Intervencao concreta e barata.
- evento do paciente: Antonio com hand-grip diminuido. IMC 31 mascarava sarcopenia (obesidade sarcopenica). Inicia suplementacao proteica + refeicao noturna tardia.
- decisao pratica: avaliar sarcopenia (hand-grip, CT L3 se disponivel). Proteina 1,2-1,5 g/kg/dia. Late-evening snack (50g CHO). NUNCA restringir proteina mesmo com EH.
- trial antigo vs recente: Plauth 2006 ESPEN (primeira guideline nutricao em hepatopatia) vs ESPEN 2019 (1,2-1,5 g/kg) vs EASL CPG 2024 (integrado)
- MAGIC_NUMBERS:
  - value: 1,2-1,5 g/kg/dia proteina
  - meaning: ingesta proteica recomendada para cirroticos
  - source: ESPEN 2019 / EASL CPG 2024
  - PMID: [TBD SOURCE — ESPEN 2019 guideline]
  - tier: 1 (guideline)
  - note: meta-analises mostram que restricao proteica nao reduz HE e piora prognostico.
  ---
  - value: prevalencia sarcopenia [TBD — 40-70% na literatura]
  - meaning: proporcao de cirroticos com sarcopenia clinicamente significativa
  - source: [TBD SOURCE — meta-analise necessaria]
  - tier: [TBD]
  - note: varia amplamente por definicao e metodo de avaliacao
- BOX_UPDATE: nenhuma mudanca no MELD.

A2-10: MELD > 15 — HORA DE AVALIAR TRANSPLANTE
- headline provisoria: "MELD persistente >15 apos descompensacao = iniciar avaliacao para transplante. Regra dos 6 meses nao se aplica a descompensacao aguda"
- funcao narrativa: pivo narrativo. Muda de "manejar complicacoes" para "planejar saida."
- evento do paciente: Antonio com MELD persistente 18 apos PBE + HDA + HE. Encaminhado para centro transplantador.
- decisao pratica: MELD 15 = limiar para listar (politica UNOS/SNT). Regra de 6 meses de abstinencia: questionada para MetALD com descompensacao. Mathurin 2011 (PMID 22070476): early transplant em hepatite alcoolica selecionada com 77% vs 23% sobrevida 6m.
- trial antigo vs recente: Mathurin 2011 (early transplant ALD, PMID 22070476) vs AASLD/EASL 2024 (atualizacao criterios) vs evidencia crescente contra regra rigida de 6 meses
- MAGIC_NUMBERS:
  - value: MELD 15
  - meaning: limiar para listagem (beneficio de sobrevida com transplante vs sem)
  - source: UNOS policy / Wiesner 2003
  - PMID: [TBD SOURCE]
  - tier: 1 (politica publica)
  ---
  - value: 77% vs 23% sobrevida 6m
  - meaning: early transplant vs SOC em hepatite alcoolica grave selecionada
  - source: Mathurin, NEJM 2011
  - PMID: 22070476
  - tier: 1
  - note: n=26. Estudo seminal, controverso na epoca, agora replicado.
- INTERACTION:
  - goal: decidir sobre listagem para transplante
  - trigger: MELD 18 persistente, 3 descompensacoes em 6 meses
  - beat_0: box lateral pulsa. MELD em vermelho. "MELD 18, 3 descompensacoes em 6 meses."
  - beat_1: pergunta "Voce lista para transplante agora? (A) Sim, iniciar avaliacao (B) Esperar 6 meses de abstinencia (C) Encaminhar sem listar"
  - beat_2: reveal — "Esperar 6 meses de abstinencia como pre-requisito absoluto e conduta ultrapassada para MetALD com descompensacao. Evidencia: Mathurin 2011. Iniciar avaliacao AGORA."
  - backward: desfaz interacao
  - why_not_pptx: box lateral que pulsa + mudanca de cor em tempo real + reveal condicional = impossivel em PPTX
- BOX_UPDATE: MELD 18 (persistente, nao subiu). Child A->B (consolidado, B9). Tag +Transplante: avaliar. Severidade: danger (borda).

A2-11: ACLF / AKI
- headline provisoria: "ACLF grau 2: mortalidade 28d ~32%. Albumina challenge primeiro — terlipressina se refratario (NNT 7, NNH 12)"
- funcao narrativa: nadir. Pior momento do paciente. Multi-organ failure.
- evento do paciente: Antonio interna com ACLF grau 2 (CANONIC: 2 organ failures). Cr 2,8, bilirrubina elevada, INR 2,1. AKI estagio 2. Albumina challenge 1g/kg x 2 dias sem resposta. Terlipressina iniciada.
- decisao pratica: classificar ACLF (CANONIC/CLIF-C). Suspender diureticos. Albumina challenge ANTES de terlipressina. Se sem resposta em 48h: terlipressina + albumina. Monitorar SatO2 (NNH 12 respiratorio).
- trial antigo vs recente: CANONIC 2013 (definicao ACLF, PMID 23474284) vs CONFIRM 2021 (terlipressina NNT 7, PMID 33657294) vs ATTIRE 2021 (albumina rotineira NAO funciona, PMID 33657293)
- MAGIC_NUMBERS:
  - value: ACLF G1 ~22%, G2 ~32%, G3 ~73% mortalidade 28d
  - meaning: mortalidade por grau ACLF
  - source: CANONIC (Moreau et al), Gastroenterology 2013
  - PMID: 23474284
  - tier: 1
  ---
  - value: NNT 7 (reversao HRS)
  - meaning: 1 reversao de HRS-AKI para cada 7 tratados com terlipressina
  - source: CONFIRM (Wong et al), NEJM 2021
  - PMID: 33657294
  - tier: 1
  - note: n=300. Terlipressina + albumina vs placebo + albumina. Endpoint: reversao de HRS (Cr <=1,5 x2 em >=48h).
  ---
  - value: NNH 12 (evento respiratorio grave)
  - meaning: 1 evento respiratorio serio a cada 12 tratados com terlipressina
  - source: CONFIRM 2021
  - PMID: 33657294
  - tier: 1
  - note: monitorar SatO2. Maior risco com ACLF grau 3 — considerar futilidade.
  ---
  - value: ATTIRE NNT infinito
  - meaning: albumina targeted (5 dias) em ACLF hospitalizado NAO reduziu mortalidade
  - source: ATTIRE (China et al), NEJM 2021
  - PMID: 33657293
  - tier: 1
  - note: n=777. Alvo albumina >=30 g/L. Mortalidade 28d similar. NAO significa que albumina nao funciona — significa que uso ROTINEIRO nao funciona. Contextos especificos (PBE, LVP, challenge HRS) continuam indicados.
- BOX_UPDATE: MELD 18->28 (salto dramatico). Child B->C. Tags +ACLF +AKI. Severidade: danger.

A2-12: ASCITE REFRATARIA
- headline provisoria: "Ascite refrataria: espironolactona 400 mg + furosemida 160 mg >=1 semana sem resposta. Criterios ICA mudam estrategia"
- funcao narrativa: Antonio melhorou parcialmente do ACLF, mas ascite nao responde. Criterios formais disparam avaliacao de TIPS.
- evento do paciente: Cr voltou a 1,6 (melhora parcial). Mas LVP semanal. Diureticos em dose maxima sem resposta. Preenche criterios ICA (Arroyo 1996).
- decisao pratica: confirmar criterios ICA. Duas categorias: diuretico-resistente (sem resposta a dose max) vs diuretico-intoleravel (efeitos colaterais impedem dose adequada). Se confirmado: avaliar TIPS (mas antes: checar coracao e pulmao).
- trial antigo vs recente: Arroyo/ICA 1996 (definicao canonica, PMID 8550036) vs EASL CPG 2024 (criterios atualizados) vs Larrue 2023 IPD (TIPS vs SOC)
- MAGIC_NUMBERS:
  - value: espironolactona 400 mg + furosemida 160 mg >=1 semana
  - meaning: dose maxima para definir "nao resposta"
  - source: Arroyo/ICA 1996
  - PMID: 8550036
  - tier: 1
  - note: definicao canonica. Diuretico-resistente vs diuretico-intoleravel.
- INTERACTION:
  - goal: identificar criterios de ascite refrataria
  - trigger: LVP semanal + diureticos ineficazes
  - beat_0: cenario — "Antonio precisa de paracentese semanal. Espironolactona 400 mg, furosemida 160 mg. Sem resposta."
  - beat_1: checklist interativo — "Marque os criterios presentes: (1) dose maxima >=1 semana (2) sem perda ponderal (3) recorrencia precoce (4) complicacoes limitam diuretico"
  - beat_2: reveal — "Criterios preenchidos: ascite diuretico-resistente. Proximo passo: avaliar TIPS — mas ANTES, checar coracao e pulmao."
  - backward: desfaz checklist, mostra slide estatico
  - why_not_pptx: checklist interativo com estado persistente (marcado/desmarcado) e reveal condicional = impossivel em PPTX
- BOX_UPDATE: MELD 28->24 (melhora parcial). Tag "Ascite" -> "Ascite refrataria". Severidade: danger.

A2-13: CARDIOMIOPATIA CIRROTICA
- headline provisoria: "Cardiomiopatia cirrotica: prevalencia ~48%. Avaliar ANTES de TIPS — disfuncao diastolica e QTc prolongado contraindicam"
- funcao narrativa: barreira entre "precisa de TIPS" e "TIPS e possivel." Adiciona camada de complexidade.
- evento do paciente: eco revela disfuncao diastolica grau 2. QTc 480 ms. TIPS vira decisao de risco.
- decisao pratica: solicitar eco com funcao diastolica + ECG (QTc) antes de TIPS. Se disfuncao severa ou QTc >500 ms: TIPS contraindicado ou de alto risco. Criterios CCC 2019 (Izzy).
- trial antigo vs recente: Moller 2002 (criterios originais CCM, PMID 11964606) vs Izzy/CCC 2019 (criterios revisados, CANDIDATE PMID 31342533) vs meta-analise CCM 2025 (prevalencia 48%)
- MAGIC_NUMBERS:
  - value: prevalencia ~48% (IC 44-52%)
  - meaning: proporcao de cirroticos com CCM por criterios variados
  - source: meta-analise CCM, Ann Saudi Med 2025
  - PMID: [TBD — buscar]
  - tier: 2 (meta-analise nao-Cochrane)
  - note: criterios variados entre estudos. CCC 2019 detecta mais que criterios antigos.
- BOX_UPDATE: tag +Cardiomiopatia. Severidade: danger.

A2-14: COMPLICACOES PULMONARES
- headline provisoria: "SHP: PaO2 <=80 + A-a >=15 = indicacao de transplante (MELD excecao). PPH com mPAP >45 = contraindicacao"
- funcao narrativa: slide comparativo. Duas condicoes com destinos opostos. Relevante para avaliacao pre-TX.
- evento do paciente: eco com bolhas revela shunt intrapulmonar. PaO2 72 mmHg. SHP confirmada — indicacao EXTRA para transplante (MELD excecao).
- decisao pratica: solicitar eco com bolhas em TODO candidato a TX. Gasometria se positivo. SHP = MELD excecao (acelera na fila). PPH: cateterismo direito. mPAP >35 = risco; >45 = contraindicacao absoluta.
- trial antigo vs recente: Rodriguez-Roisin 2004 (criterios SHP, PMID 15084697) vs ERS task force 2004 (PPH) vs ILTS 2025 (atualizacao) [NOT INDEXED]
- MAGIC_NUMBERS:
  - value: PaO2 <=80 mmHg + A-a gradiente >=15 mmHg
  - meaning: criterios diagnosticos de SHP
  - source: Rodriguez-Roisin, Eur Respir J 2004
  - PMID: 15084697
  - tier: 1
  ---
  - value: mPAP >25 mmHg (definicao) / >45 mmHg (contraindicacao TX)
  - meaning: limiares para portopulmonary hypertension
  - source: consenso / ILTS
  - PMID: [TBD SOURCE]
  - tier: 1 (consenso)
- BOX_UPDATE: tag +Hepatopulmonar. Severidade: danger.

A2-15: TIPS E ALTERNATIVAS NO BRASIL
- headline provisoria: "TIPS reduz further decomp de 63% para 48% (IPD n=2338). No Brasil: acesso limitado — LVP + albumina como ponte"
- funcao narrativa: confronto com realidade brasileira. TIPS e padrao-ouro, mas acesso e desigual.
- evento do paciente: Antonio em cidade sem TIPS. Encaminhado para centro de referencia, fila de meses. Enquanto isso: LVP + albumina quinzenal.
- decisao pratica: se TIPS disponivel e indicado (refrataria ou HDA recorrente): fazer. Se nao disponivel: LVP seriada + albumina 8g/L. Considerar transferencia para centro com TIPS. Transplante como tratamento definitivo.
- trial antigo vs recente: Bureau 2017/2021 (TIPS preemptivo para ascite, PMID [TBD]) vs Larrue 2023 IPD (TIPS vs SOC, PMID 37141993) vs realidade SUS 2025
- MAGIC_NUMBERS:
  - value: further decomp 48% vs 63% a 2 anos
  - meaning: TIPS vs standard of care (meta-analise IPD)
  - source: Larrue 2023
  - PMID: 37141993
  - tier: 1
  - note: n=2338 de 13 RCTs. Sobrevida tambem melhor com TIPS (71% vs 63%, p=0,0001).
- BRAZIL_ACCESS_SNAPSHOT:
  - centros_TIPS: [TBD SOURCE — consultar ABTO ou SBH para numero atualizado]
  - realidade: maioria dos centros em SP, RJ, RS, MG. Interior do Brasil sem acesso direto.
  - alternativa: LVP + albumina seriada. BRTO seletivo (poucos centros). Alfapump (nao disponivel no Brasil).
  - tier_clinico: dados de TIPS = tier 1. Acesso brasileiro = snapshot, NAO tier 1.
- BOX_UPDATE: nenhuma mudanca no MELD (ja esta em 24).

A2-16: CHECKPOINT 2
- headline provisoria: "MELD 28, Child C, ACLF resolvido, ascite refrataria, SHP. Esta listado. Chega ao transplante?"
- funcao narrativa: nadir consolidado. Transicao para Ato 3. Box lateral mostra tudo vermelho.
- evento do paciente: resumo de todos os hits. MELD 28 no nadir (agora 24 com melhora parcial). Child C. Listado. A pergunta: "ele chega?"
- decisao pratica: o paciente precisa sobreviver ate o transplante. Manejar cada complicacao. Vigilancia estreita.
- BOX_UPDATE: MELD 28 no pior momento (mostrar no box como "pico"). Todos tags visiveis. Severidade: danger (full).
- SPEAKER_INTENT: "A plateia deve sentir angustia real. Tudo que ensinamos no Ato 2 foi aplicado. E ainda assim, o paciente quase morreu. Ato 3 traz a esperanca: recompensacao."

NOTA SOBRE MELD INTERMEDIARIOS:
Os valores 12, 14, 17, 18 entre baseline (~10) e nadir (28) sao CONSTRUCOES NARRATIVAS para o caso. Sao clinicamente plausiveis mas nao derivados de dados. Os valores canonicos sao:
- ~10 (CP1, CASE.md)
- 28 (CP2, CASE.md)
- 12 (CP3, CASE.md — apos recompensacao)
Para cada valor intermediario, a justificativa clinica e:
- 12: etilismo mantido + nao-adesao (piora basal, bilirrubina sobe discretamente)
- 14: ascite (retencao hidrica, Cr estavel, bilirrubina sobe)
- 17: PBE (Cr sobe para 1,4 com infeccao)
- 18: HDA (Cr estavel 1,4-1,6, bilirrubina sobe mais)
- 28: ACLF (Cr 2,8, Na 126, bilirrubina e INR pioram)
- 24: melhora parcial pos-ACLF (Cr cai para 1,6)

===================================================================
LATERAL BOX RULES
===================================================================

MELD atualiza em:
- A2-01 (Gatilhos): 10->12 — piora basal
- A2-02 (Ascite dx): 12->14 — primeira descompensacao
- A2-05 (PBE): 14->17 — Cr subiu com infeccao
- A2-06 (HDA): 17->18 — bleeding
- A2-10 (MELD>15): 18 persistente — INTERACAO 1
- A2-11 (ACLF): 18->28 — salto dramatico
- A2-12 (Ascite refrataria): 28->24 — melhora parcial

Child atualiza em:
- A2-10: A->B (consolidado, B9) — apos 3 descompensacoes
- A2-11: B->C (C12) — multi-organ failure

Tags no box:
- A2-01: cACLD -> dACLD (severidade: caution)
- A2-02: +Ascite (caution)
- A2-04: setup (sem tag nova)
- A2-05: +PBE (warning)
- A2-06: +HDA (warning)
- A2-08: +EH (warning)
- A2-10: +TX: avaliar (danger borda)
- A2-11: +ACLF +AKI (danger)
- A2-12: Ascite -> Ascite refrataria (danger)
- A2-13: +CCM (danger)
- A2-14: +SHP (danger)
- A2-16: tudo visivel (danger full)

Onde "avaliar TX" aparece: A2-10 (primeira vez). Persiste ate CP2.
Onde "ascite refrataria" substitui "ascite": A2-12.

===================================================================
MUST-HAVE INTERACTIONS (3)
===================================================================

INTERACAO 1: EARLY TIPS NA HDA (A2-06)
- objetivo pedagogico: decidir se o paciente preenche criterios para TIPS preemptivo em sangramento varicoso
- gatilho narrativo: hematemese, varizes F3, Child B9 com sangramento ativo
- beat_0: cenario — sangramento varicoso ativo, paciente estabilizado com octreotide, 18h desde admissao
- beat_1: pergunta — "Voce indica TIPS preemptivo em 72h? (A) Sim (B) Nao, ligadura basta (C) Sim, mas preciso transferir para outro centro"
- beat_2: reveal — "Child B com sangramento ativo = criterio Garcia-Pagan. NNT ~4. Mas: Antonio esta em cidade sem TIPS. Decisao: transferir vs manejar localmente + referenciar eletivamente."
- backward: retreat mostra slide estatico sem interacao
- why_not_pptx: decisao com 3 opcoes + reveal condicional + dado contextual (acesso TIPS) = requer logica JS. PPTX e estatico.

INTERACAO 2: MELD > 15 / TRANSPLANTE (A2-10)
- objetivo pedagogico: reconhecer que MELD persistente >15 = momento de listar, e que regra de 6 meses e conduta ultrapassada para descompensacao aguda em MetALD
- gatilho narrativo: MELD 18 persistente, 3 descompensacoes em 6 meses, box lateral pulsando
- beat_0: box lateral muda — MELD em vermelho, pulse animation
- beat_1: pergunta — "MELD 18, 3 descompensacoes em 6 meses. Voce lista agora? (A) Sim (B) Esperar 6 meses abstinencia (C) Encaminhar sem listar"
- beat_2: reveal — "Regra de 6 meses e historica, nao baseada em evidencia para MetALD com descompensacao. Mathurin 2011: early TX com 77% vs 23% sobrevida. Iniciar avaliacao AGORA."
- backward: desfaz animacao do box, mostra estado anterior
- why_not_pptx: box lateral que pulsa + mudanca de cor em tempo real + reveal contextualizado = impossivel em PPTX

INTERACAO 3: CHECKLIST ASCITE REFRATARIA (A2-12)
- objetivo pedagogico: plateia identifica criterios ICA de refratariedade + distingue diuretico-resistente vs diuretico-intoleravel
- gatilho narrativo: LVP semanal + dose maxima de diureticos sem resposta
- beat_0: cenario — "Antonio em LVP semanal. Espironolactona 400 mg, furosemida 160 mg. Sem resposta."
- beat_1: checklist interativo — marcar criterios presentes: (a) dose maxima >=1 semana sem resposta (b) recorrencia precoce apos LVP (c) complicacoes impedem dose adequada (d) restricao sodica mantida
- beat_2: reveal — "Ascite diuretico-resistente confirmada. Proximo: avaliar TIPS — mas antes: coracao (CCM) e pulmao (SHP/PPH)."
- backward: desfaz marcacoes, mostra checklist limpo
- why_not_pptx: checklist com estado persistente (marcado/desmarcado), logica condicional no reveal, animacao de transicao = requer JS

===================================================================
RIFAXIMIN BRAZIL REALITY
===================================================================

NOTA: dados de preco e acesso sao SNAPSHOT, NAO tier 1 clinico. Rotular separadamente.

nome_comercial: Flonorm (EMS — principal marca no Brasil)
laboratorio: EMS S/A
apresentacao: comprimidos revestidos 550 mg, caixas com 28
posologia_EH: 550 mg BID (1100 mg/dia) — identica ao trial Bass 2010
preco_faixa: R$ 400-700 por caixa de 28 cp (14 dias) [VERIFICAR — agente pesquisando]
custo_mensal: ~R$ 800-1400
SUS: NAO disponivel na maioria dos estados. Nao consta na RENAME 2024. Paciente SUS = lactulose.
plano_saude: cobertura variavel. Alguns planos cobrem com laudo medico.

O que o trial pivotal (Bass 2010) testou:
- Populacao: pacientes com >=2 episodios previos de EH overt
- Intervencao: rifaximina 550 mg BID
- Comparador: placebo
- Endpoint: tempo ate episodio de EH (breakthrough)
- Resultado: HR 0,42 (IC 0,28-0,64). NNT 4 em 6 meses.
- Detalhe critico: >90% dos pacientes em AMBOS os bracos usavam lactulose concomitante. Ou seja, rifaximina e ADD-ON a lactulose, nao substituto.

Lactulose:
- Base do tratamento de EH no Brasil e no mundo
- Dose: 15-30 mL 2-3x/dia, titulado para 2-3 evacuacoes pastosas/dia
- Preco: R$ 15-40 por frasco 120 mL
- Disponivel no SUS: SIM
- Evidencia: historica (decadas), sem RCT grande moderno vs placebo (questoes eticas)

Alternativas reais na pratica brasileira:
1. Lactulose isolada — SOC, especialmente no SUS
2. Lactulose + rifaximina — padrao privado para EH recorrente
3. PEG 3350 (Muvinlax) — evidencia emergente para EH aguda (HELP trial, PMID 25243839: 91% vs 52% melhora 24h). NAO aprovado para EH pelo bula, mas usado off-label.
4. Metronidazol — ABANDONADO para uso cronico (neurotoxicidade). So como resgate agudo em hospitais sem rifaximina.
5. Neomicina — ABANDONADA (nefro/ototoxicidade cronica).
6. L-ornitina L-aspartato (LOLA) — evidencia fraca para EH, mais para hiperamonemia. NAO primeira linha.
7. Probioticos — evidencia insuficiente. NAO recomendado em guidelines.

O que e evidencia tier 1: Bass 2010 (rifaximina NNT 4).
O que e snapshot de acesso: preco, disponibilidade SUS, marca comercial.

===================================================================
WHAT TO CUT / WHAT TO MERGE
===================================================================

MANTER SEPARADO (inegociavel — decisoes ja tomadas):
- Ascite dx + Ascite manejo: momentos clinicos distintos (emergencia vs cronico)
- Infeccoes + PBE: contexto vs conduta
- Cardio + Pulmonar: mecanismos opostos, decisoes opostas (CCM bloqueia TIPS vs SHP indica TX)
- HRS-AKI / ACLF: nao diluir

POSSIVEIS FUSOES (so se rehearsal exigir compressao):
- Ascite dx + manejo -> 1 slide (economia: 3 min). RISCO: perde a distincao urgencia vs cronico.
- Cardio + Pulmonar -> 1 slide comparativo (economia: 3 min). RISCO: slide fica denso.
- Se fundir ambos: 14 slides + CP2 = 15. Ganho de ~6 min.

ALBUMINA:
- Slide proprio de albumina (atual s-a2-03) = ABSORVIDO na cascata.
- Albumina aparece em 3 contextos: (1) LVP em A2-03, (2) PBE em A2-05, (3) ACLF challenge em A2-11.
- ATTIRE como "armadilha" = contextualizado em A2-11 (ACLF), nao slide proprio.
- Se a plateia precisar de uma visao consolidada: slide de apendice "Albumina: 3 indicacoes certas, 1 trap."

===================================================================
P0 / P1 / P2
===================================================================

P0 (ESTE DOCUMENTO):
- [x] Ler CASE, evidence-db, narrative, manifest, HANDOFF
- [x] Produzir RAW_ACT2_V2 completo
- [x] Auditar magic numbers
- [x] Pesquisar rifaximina Brasil
- [x] Propor 3 interacoes
- [x] Entregar texto copiavel

P1 (APOS APROVACAO DO RAW):
- [ ] Atualizar narrative.md com nova arquitetura Act 2
- [ ] Atualizar CASE.md com panel states intermediarios (MELD 12, 14, 17, 18)
- [ ] Atualizar _manifest.js com novos slides
- [ ] Criar HTMLs para slides novos (Gatilhos, Ascite dx, Ascite manejo, Nutricao, MELD>15, Ascite refrataria)
- [ ] Mover s-app-05 (cardio) e s-app-06 (pulmonar) para Act 2
- [ ] Reestruturar s-a2-02 (TIPS) e s-a2-03 (albumina)
- [ ] Verificar 5 PMIDs CANDIDATE via PubMed MCP
- [ ] Resolver [TBD SOURCE] para sarcopenia, covert HE, centros TIPS

P2 (QA):
- [ ] Re-rodar qa-engineer 13 criterios
- [ ] h2 assertivos decididos (Lucas no browser)
- [ ] OKLCH, rename, failsafe fixes
- [ ] Rehearsal cronometrado (meta: Act 2 em 45 min)

===================================================================
APPENDIX_SLIDES
===================================================================

Slides que SAEM do apendice para o main deck:
- s-app-05 (CCM) -> A2-13
- s-app-06 (SHP/PPH) -> A2-14

Slides que PERMANECEM no apendice:
- s-app-01 (ACLF deep dive): G3 como limiar de futilidade
- s-app-02 (Early TIPS detalhado): dados complementares
- s-app-03 (Etiologias raras ABCW)
- s-app-04 (Turco 2024 NSBB vs EVL IPD)
- s-app-07 (Estatina adjuvante)
- s-app-08 (CIRROXABAN)

Novo slide de apendice proposto:
- "Albumina: 3 indicacoes certas, 1 armadilha" — versao consolidada do atual s-a2-03, para consulta pos-aula
- "Sintomas negligenciados: prurido, caibras, fadiga" — do briefing original

===================================================================
MAIN_RISKS
===================================================================

1. VOLUME: 17 slides em 45 min = 2,6 min/slide media. Sem margem para derrapar. Slides compressiveis: A2-03, A2-07, A2-09.

2. FADIGA DE ASCITE: 3 slides com "ascite." Precisa de headlines e visuais radicalmente distintos.

3. CARDIO/PULMONAR COMO INTERRUPCAO: se nao conectados a decisao de TIPS/TX, parecem filler. Headline e o antidoto.

4. MELD INTERMEDIARIOS: construcoes narrativas. Se a plateia questionar a plausibilidade do salto 18->28, precisa de justificativa clinica nos notes.

5. TRANSICAO ACLF -> REFRATARIA: "melhora parcial" precisa ser crivel em 1 frase. MELD caindo de 28->24 mostra melhora no box.

===================================================================
OPTIONAL_COMPRESSION_PLAN
===================================================================

Se rehearsal mostrar que 45 min nao cabe:

Nivel 1 (-3 min): Fundir A2-02 + A2-03 (ascite dx + manejo) = 1 slide. Total: 15 + CP2 = 16.

Nivel 2 (-6 min): Nivel 1 + fundir A2-13 + A2-14 (cardio + pulmonar) = 1 slide comparativo. Total: 14 + CP2 = 15.

Nivel 3 (-9 min): Nivel 2 + mover A2-09 (nutricao) para apendice, integrar "nao restringir proteina" no slide de EH. Total: 13 + CP2 = 14.

NAO COMPRIMIR: HDA, ACLF, PBE, TIPS, interacoes. Sao o core.

===================================================================
WHAT_NEEDS_RESEARCH_TOMORROW
===================================================================

1. Verificar 5 PMIDs CANDIDATE via PubMed MCP: PREDICT 32275982, AASLD ACLF 38530940, Turco 38504576, Izzy CCC 31342533, D'Amico 2022 34174336.

2. Rifaximina preco atualizado: confirmar faixa R$ 400-700 via busca de preco farmacias brasileiras.

3. Sarcopenia meta-analise: buscar PMID para prevalencia em cirrose. Provavel Montano-Loza ou Kim 2017.

4. Covert HE prevalencia: buscar PMID. Ampla variacao na literatura (20-80%). Definir qual teste e cutoff estamos usando.

5. Centros TIPS no Brasil: consultar ABTO/SBH ou publicacao recente.

6. ESPEN 2019 guideline nutricao hepatopatia: buscar PMID para proteina 1,2-1,5 g/kg.

7. QTc threshold para CCM: verificar CCC 2019 (Izzy) — pode ser >500 ms ou outro valor.

8. PBE silenciosa prevalencia: buscar coorte ou meta-analise.

9. MELD 15 como limiar de listagem: buscar Wiesner 2003 PMID ou referencia UNOS.

10. AGA 2025 Orman albumin guidance: monitorar indexacao PubMed.

===================================================================
ADDENDUM — POS-AUDIT AGENTES (08/mar 19h)
===================================================================

RIFAXIMIN BRASIL — CORRECAO CRITICA:

O RAW acima continha erro: Flonorm NAO e 550 mg.
- Flonorm (Farmoquimica) = 200 mg, indicacao: diarreia do viajante
- Xifaxan 550 mg (Bausch/Salix) = formulacao para EH, disponibilidade INCERTA no Brasil
- Risco: clinicos usam 200 mg x 3/dia (1200 mg) off-label — NAO e dose do Bass 2010
- Preco estimado 550 mg: R$ 800-1500/mes (maior que estimativa original)
- ANVISA: verificar se 550 mg tem registro especifico (bulario ANVISA)
- CONITEC: verificar se houve avaliacao para incorporacao no SUS

CORRECAO NO RAW (A2-08 BRAZIL_ACCESS_SNAPSHOT):
- nome_comercial: CORRIGIDO — Flonorm e 200 mg (viajante). Xifaxan 550 mg pode nao estar disponivel comercialmente no Brasil. Verificar ANVISA.
- apresentacao: CORRIGIDO — 550 mg pode exigir importacao ou uso off-label de 200 mg
- preco_faixa: CORRIGIDO — R$ 800-1500/mes para 550 mg (se disponivel)

MAGIC NUMBERS — CORRECOES POS-AUDIT:

1. PREDESCI NNT 9: IC 95% = 5 a INFINITO (cruza nulo). Caveat OBRIGATORIO nos speaker notes. O efeito e real (HR significativo) mas o NNT tem IC amplo por amostra pequena (n=201).

2. EARLY TIPS: cirrose-references.json tem erro — diz "26%" para controle, correto e 39%. Slides e evidence-db estao corretos (86% vs 61% ou 14% vs 39%).

3. ANSWER PMID: medical-data.md (.claude/rules) tem PMID errado (29793859). Correto: 29861076. Conflito documentado em NOTES.md mas rules nao foi corrigido.

4. ATTIRE: evidence-db rotula como "ACLF" mas trial foi decompensated cirrhosis broadly (hospitalizado). Nao era especificamente ACLF. Corrigir rotulo.

5. CONFIRM NNH: calculo simples = 11 (11,1% vs 2,0%). Evidence-db corrigiu para 12 sem documentar justificativa. Recomendar: usar NNH 11 ou documentar porque 12.

6. CANONIC journal: slide 20-app-aclf diz "NEJM 2013" — ERRADO. Correto: Gastroenterology 2013. Corrigir no HTML.

7. PREDICT PMID: 2 PMIDs em conflito no repo — slide usa 33227350, evidence-db usa 32275982. Podem ser publicacoes diferentes do mesmo estudo (online first vs final). Verificar via PubMed MCP.

8. Sort 1999: must-read-trials.md inverte direcao dos numeros. Correto: mortalidade 29% (controle) vs 10% (tratamento com albumina). IRA: 33% vs 10%.

ITEMS ADICIONADOS A WHAT_NEEDS_RESEARCH_TOMORROW:

11. Verificar registro ANVISA para rifaximina 550 mg (bulario ANVISA)
12. Verificar CONITEC para avaliacao de incorporacao rifaximina no SUS
13. Corrigir cirrose-references.json: Early TIPS 26%->39%, PREDESCI headline carvedilol->NSBBs
14. Corrigir medical-data.md: ANSWER PMID 29793859->29861076
15. Corrigir slide 20-app-aclf: "NEJM 2013" -> "Gastroenterology 2013"
16. Resolver PREDICT PMID: 33227350 vs 32275982

===================================================================
FIM DO RAW_ACT2_V2 (com addendum)
===================================================================

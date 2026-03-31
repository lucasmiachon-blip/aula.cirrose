/**
 * _manifest.js — Source of truth para ordem, archetypes, panel states, animacoes
 *
 * DERIVADO DE: references/CASE.md (dados do paciente — Reference Hierarchy #1)
 * panelStates valores DEVEM ser identicos a CASE.md §Evolucao do Caso.
 * Validacao: npm run lint:case-sync · npm run lint:narrative-sync
 *
 * NARRATIVE FIELDS (validated by lint:narrative-sync vs narrative.md):
 *   narrativeRole: 'hook'|'setup'|'payoff'|'checkpoint'|'resolve'|null
 *   tensionLevel:  0-5 (matches narrative.md tension dots)
 *   narrativeCritical: true = slide whose h2/structure MUST NOT change without Lucas approval
 *
 * Coautoria: Lucas (decisao clinica) · Opus 4.6 (codigo + governance)
 * Ver: references/coautoria.md
 *
 * Gerado na FASE 0 da refatoracao arquitetural.
 * Atualizado: 2026-03-17 — Headline sync: 44/44 aligned with HTML h2 (Act 3 accents + s-a1-fib4 semantic fix)
 */

export const slides = [
  // ── Pre-Act ──
  { id: 's-title', file: '00-title.html', act: null, archetype: null, sectionTag: null, headline: 'Cirrose Hepática', panelState: 'hidden', clickReveals: 0, customAnim: null, timing: null, subItems: ['brasao', 'titulo', 'pilares'], narrativeRole: null, tensionLevel: 0, narrativeCritical: false },
  { id: 's-hook', file: '01-hook.html', act: null, archetype: null, sectionTag: null, headline: 'Caso Antônio · Qual sua conduta?', panelState: 'neutral', clickReveals: 1, customAnim: 's-hook', timing: 90, subItems: [{ label: 'bio+labs (auto)', beat: 0 }, { label: 'punchline+pergunta', beat: 1 }], narrativeRole: 'hook', tensionLevel: 3, narrativeCritical: true },

  // ── Act 1: CLASSIFICAR ──
  { id: 's-a1-01', file: '02-a1-continuum.html', act: 'A1', archetype: null, sectionTag: 'ATO 1 — CLASSIFICAR', headline: 'Por que rastrear?', panelState: 'neutral', clickReveals: 0, customAnim: 's-a1-01', timing: 90, narrativeRole: 'setup', tensionLevel: 2, narrativeCritical: false },
  { id: 's-a1-classify', file: '02c-a1-classify.html', act: 'A1', archetype: null, sectionTag: 'ATO 1 — CLASSIFICAR', headline: 'Estadiamento × Prognóstico', panelState: 'neutral', clickReveals: 2, customAnim: 's-a1-classify', timing: 90, narrativeRole: 'setup', tensionLevel: 2, narrativeCritical: false },
  { id: 's-a1-baveno', file: '03-a1-baveno.html', act: 'A1', archetype: null, sectionTag: 'ATO 1 — CLASSIFICAR', headline: 'O novo paradigma: doença hepática como espectro', panelState: 'neutral', clickReveals: 1, customAnim: 's-a1-baveno', timing: 120, narrativeRole: 'setup', tensionLevel: 1, narrativeCritical: false },
  { id: 's-a1-fib4', file: '03b-a1-fib4calc.html', act: 'A1', archetype: null, sectionTag: 'ATO 1 — CLASSIFICAR', headline: 'Modelos Preditivos: FIB-4', panelState: 'neutral', clickReveals: 2, customAnim: 's-a1-fib4', timing: 120, narrativeRole: 'setup', tensionLevel: 2, narrativeCritical: false },
  { id: 's-a1-elasto', file: '03c-a1-elasto.html', act: 'A1', archetype: null, sectionTag: 'ATO 1 — CLASSIFICAR', headline: 'Fibroscan, MRE e outros métodos não invasivos', panelState: 'neutral', clickReveals: 2, customAnim: 's-a1-elasto', timing: 120, narrativeRole: 'setup', tensionLevel: 2, narrativeCritical: false },
  { id: 's-a1-rule5', file: '03d-a1-rule5.html', act: 'A1', archetype: null, sectionTag: 'ATO 1 — CLASSIFICAR', headline: 'Rule of Five', panelState: 'neutral', clickReveals: 1, customAnim: 's-a1-rule5', timing: 120, narrativeRole: 'setup', tensionLevel: 2, narrativeCritical: false },
  { id: 's-a1-cpt', file: '02b-a1-cpt.html', act: 'A1', archetype: null, sectionTag: 'ATO 1 — CLASSIFICAR', headline: 'Child-Pugh-Turcotte', panelState: 'neutral', clickReveals: 2, customAnim: 's-a1-cpt', timing: 120, narrativeRole: 'setup', tensionLevel: 2, narrativeCritical: false },
  { id: 's-a1-meld', file: '04-a1-meld.html', act: 'A1', archetype: null, sectionTag: 'ATO 1 — CLASSIFICAR', headline: 'MELD: história, importância e evoluções', panelState: 'neutral', clickReveals: 2, customAnim: 's-a1-meld', timing: 150, narrativeRole: 'setup', tensionLevel: 2, narrativeCritical: false },
  { id: 's-cp1', file: '07-cp1.html', act: 'CP', archetype: null, sectionTag: null, headline: 'Antônio tem CSPH confirmada — carvedilol indicado, endoscopia dispensável', panelState: 'hidden', clickReveals: 0, customAnim: null, timing: 60, narrativeRole: 'checkpoint', tensionLevel: 3, narrativeCritical: true },
];

export const panelStates = {
  // ── Pre-Act + Act 1 ──
  // s-hook: panel hidden (Gemini: "spoiler/ruído no hook")
  's-a1-01': {
    severity: 'neutral',
    values: { AST: '67', ALT: '31', GGT: '210', FA: '89', plq: '112k', albumin: '3,6', Bili: '1,3', INR: '1,2', fib4: '—', lsm: '—', meld: '—' },
    visibleFields: ['AST', 'ALT', 'GGT', 'FA', 'plq', 'albumin', 'Bili', 'INR'],
    events: [],
  },
  's-a1-baveno': {
    severity: 'neutral',
    values: { AST: '67', ALT: '31', GGT: '210', FA: '89', plq: '112k', albumin: '3,6', Bili: '1,3', INR: '1,2', fib4: '—', lsm: '—', meld: '—' },
    visibleFields: ['AST', 'ALT', 'GGT', 'FA', 'plq', 'albumin', 'Bili', 'INR'],
    events: [],
  },
  's-a1-fib4': {
    severity: 'neutral',
    values: { AST: '67', ALT: '31', GGT: '210', FA: '89', plq: '112k', albumin: '3,6', Bili: '1,3', INR: '1,2', fib4: '5,91', lsm: '—', meld: '—' },
    visibleFields: ['fib4', 'AST', 'ALT', 'GGT', 'FA', 'plq', 'albumin', 'Bili', 'INR'],
    events: [],
    calc: 'fib4',
  },
  's-a1-elasto': {
    severity: 'neutral',
    values: { AST: '67', ALT: '31', GGT: '210', FA: '89', plq: '112k', albumin: '3,6', Bili: '1,3', INR: '1,2', fib4: '5,91', lsm: '—', meld: '—' },
    visibleFields: ['fib4', 'AST', 'ALT', 'GGT', 'FA', 'plq', 'albumin', 'Bili', 'INR'],
    events: [],
  },
  's-a1-rule5': {
    severity: 'neutral',
    values: { AST: '67', ALT: '31', GGT: '210', FA: '89', plq: '112k', albumin: '3,6', Bili: '1,3', INR: '1,2', fib4: '5,91', lsm: '26 kPa', meld: '—' },
    visibleFields: ['fib4', 'AST', 'ALT', 'GGT', 'FA', 'plq', 'albumin', 'Bili', 'INR', 'lsm'],
    events: [],
  },
  's-a1-cpt': {
    severity: 'neutral',
    values: { AST: '67', ALT: '31', GGT: '210', FA: '89', plq: '112k', albumin: '3,6', Bili: '1,3', INR: '1,2', fib4: '5,91', lsm: '26 kPa', CTP: 'A (5)', meld: '—', VE: '—', HDA: '—', Ascite: '—', HE: '—', HCC: '—' },
    visibleFields: ['CTP', 'fib4', 'lsm', 'AST', 'ALT', 'GGT', 'FA', 'plq', 'albumin', 'Bili', 'INR', 'VE', 'HDA', 'Ascite', 'HE', 'HCC'],
    events: [],
  },
  's-a1-meld': {
    severity: 'neutral',
    values: { fib4: '5,91', lsm: '26 kPa', GGT: '210', FA: '89', plq: '112k', CTP: 'A (5)', meld: '—', albumin: '3,6', VE: '—', HDA: '—', Ascite: '—', HE: '—', HCC: '—' },
    visibleFields: ['fib4', 'lsm', 'GGT', 'FA', 'plq', 'CTP', 'meld', 'albumin', 'VE', 'HDA', 'Ascite', 'HE', 'HCC'],
    events: [],
    calc: 'meld',
  },
  's-a1-classify': {
    severity: 'neutral',
    values: { AST: '67', ALT: '31', GGT: '210', FA: '89', plq: '112k', albumin: '3,6', Bili: '1,3', INR: '1,2', fib4: '—', lsm: '—', meld: '—' },
    visibleFields: ['AST', 'ALT', 'GGT', 'FA', 'plq', 'albumin', 'Bili', 'INR'],
    events: [],
  },
  's-cp1': {
    severity: 'hidden',
  },
};

/**
 * slide-registry.js — Cirrose
 * Centralizes all slide wiring: custom animations, panel states,
 * click-reveal, and interactions.
 *
 * Created: FASE 3 (2026-02-27)
 */

import { panelStates } from './slides/_manifest.js';

export const customAnimations = {
  's-hook': (slide, gsap) => {
    const beats = slide.querySelectorAll('.hook-beat');
    if (beats.length < 2) return;

    let currentBeat = 0;
    const fib4El = slide.querySelector('[data-target="3.2"]');

    function setBeat(idx) {
      beats.forEach((b, i) => {
        const active = i === idx;
        b.classList.toggle('hook-beat--active', active);
        b.classList.toggle('hook-beat--hidden', !active);
      });
    }

    const initialBeat = parseInt(slide.dataset.initialBeat ?? '0', 10);
    currentBeat = initialBeat;
    setBeat(initialBeat);
    if (initialBeat === 1) {
      const labs = slide.querySelectorAll('.hook-lab');
      const question = slide.querySelector('.hook-question');
      const lead = slide.querySelector('.hook-question-lead');
      [...labs, lead, question].filter(Boolean).forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        if (el.style.transform) el.style.transform = 'translateY(0)';
      });
      if (fib4El) fib4El.textContent = '3,2';
    }

    function resetBeat1Content() {
      const labs = slide.querySelectorAll('.hook-lab');
      const question = slide.querySelector('.hook-question');
      const lead = slide.querySelector('.hook-question-lead');
      if (gsap) {
        gsap.set([...labs, lead, question].filter(Boolean), { opacity: 0, visibility: 'hidden' });
      }
    }

    function runLabsStagger() {
      const labs = slide.querySelectorAll('.hook-lab');
      const question = slide.querySelector('.hook-question');
      const lead = slide.querySelector('.hook-question-lead');
      if (gsap) {
        gsap.fromTo(labs,
          { opacity: 0, visibility: 'visible', y: 12 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.12, delay: 0.05, ease: 'power2.out' }
        );
        if (lead) gsap.fromTo(lead, { opacity: 0, visibility: 'visible' }, { opacity: 1, duration: 0.3, delay: 0.5 });
        if (question) gsap.fromTo(question, { opacity: 0, visibility: 'visible', y: 8 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.65, ease: 'power2.out' });
      }
      if (fib4El && gsap) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 3.2,
          duration: 1.2,
          delay: 0.2,
          ease: 'power1.out',
          onUpdate() { fib4El.textContent = obj.val.toFixed(1).replace('.', ','); }
        });
      } else if (fib4El) fib4El.textContent = '3,2';
    }

    function advanceBeat() {
      if (currentBeat >= beats.length - 1) return false;
      const prev = beats[currentBeat];
      const next = beats[currentBeat + 1];
      currentBeat++;

      if (gsap) {
        gsap.to(prev, {
          opacity: 0, y: -12, duration: 0.3, ease: 'power2.in',
          onComplete() {
            prev.classList.remove('hook-beat--active');
            prev.classList.add('hook-beat--hidden');
          }
        });
        next.classList.remove('hook-beat--hidden');
        next.classList.add('hook-beat--active');
        gsap.set(next, { opacity: 0 });
        if (currentBeat === 1) {
          resetBeat1Content();
          runLabsStagger();
        }
        gsap.fromTo(next,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.05, ease: 'power2.out' }
        );
      } else {
        prev.classList.remove('hook-beat--active');
        prev.classList.add('hook-beat--hidden');
        next.classList.remove('hook-beat--hidden');
        next.classList.add('hook-beat--active');
        if (currentBeat === 1) runLabsStagger();
      }
      return true;
    }

    function retreatBeat() {
      if (currentBeat <= 0) return false;
      const prev = beats[currentBeat - 1];
      const curr = beats[currentBeat];
      const wasBeat1 = currentBeat === 1;

      if (gsap) {
        gsap.to(curr, {
          opacity: 0, y: 16, duration: 0.3, ease: 'power2.in',
          onComplete() {
            curr.classList.remove('hook-beat--active');
            curr.classList.add('hook-beat--hidden');
            if (wasBeat1) resetBeat1Content();
          }
        });
        prev.classList.remove('hook-beat--hidden');
        prev.classList.add('hook-beat--active');
        gsap.fromTo(prev, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      } else {
        curr.classList.remove('hook-beat--active');
        curr.classList.add('hook-beat--hidden');
        prev.classList.remove('hook-beat--hidden');
        prev.classList.add('hook-beat--active');
      }
      currentBeat--;
      return true;
    }

    slide.__hookAdvance = advanceBeat;
    slide.__hookRetreat = retreatBeat;
    slide.__hookCurrentBeat = () => currentBeat;
  },
};

export { panelStates };

/**
 * Wire all systems: custom anims → case panel → click-reveal → interactions.
 * Deps injected to avoid circular imports and keep registry testable.
 */
export function wireAll(Reveal, gsap, { anim, CasePanel, ClickReveal, MeldCalc }) {
  for (const [id, fn] of Object.entries(customAnimations)) {
    anim.registerCustom(id, fn);
  }

  const panelEl = document.getElementById('case-panel');
  if (panelEl) {
    const panel = new CasePanel(panelEl);
    for (const [id, state] of Object.entries(panelStates)) {
      panel.registerState(id, state);
    }
    panel.connect(document.querySelector('.slides'));
    Reveal.on('slidechanged', (e) => panel.onSlideChanged(e.currentSlide));
    const currentSlide = Reveal.getCurrentSlide();
    if (currentSlide) panel.onSlideChanged(currentSlide);
  }

  const revealers = new Map();
  document.querySelectorAll('.slides > section').forEach((section) => {
    if (section.querySelectorAll('[data-reveal]').length > 0) {
      revealers.set(section.id, new ClickReveal(section, gsap));
    }
  });
  function tryRevealNext() {
    const revealer = revealers.get(Reveal.getCurrentSlide()?.id);
    if (revealer && revealer.hasMore) { revealer.next(); return true; }
    return false;
  }
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowDown' && e.key !== ' ') return;
    if (tryRevealNext()) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  document.querySelector('.reveal .slides')?.addEventListener('click', (e) => {
    if (tryRevealNext()) { e.preventDefault(); e.stopPropagation(); }
  });
  Reveal.on('slidechanged', (e) => { const r = revealers.get(e.currentSlide?.id); if (r) r.reset(); });

  const meldContainer = document.querySelector('[data-interaction="meld-calc"]');
  if (meldContainer) new MeldCalc(meldContainer);
}

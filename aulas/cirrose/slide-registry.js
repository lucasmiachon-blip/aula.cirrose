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
    const frameworkItems = slide.querySelectorAll('.framework-item');
    const dataItems = slide.querySelectorAll('.case-data .data-item');
    gsap.set([...frameworkItems, ...dataItems], { visibility: 'visible' });
    if (frameworkItems.length) {
      gsap.fromTo(frameworkItems,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.3, ease: 'power2.out' }
      );
    }
    if (dataItems.length) {
      gsap.fromTo(dataItems,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, delay: 0.8, ease: 'power2.out' }
      );
    }
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
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== ' ') return;
    const revealer = revealers.get(Reveal.getCurrentSlide()?.id);
    if (revealer && revealer.hasMore) { e.preventDefault(); e.stopPropagation(); revealer.next(); }
  }, true);
  Reveal.on('slidechanged', (e) => { const r = revealers.get(e.currentSlide?.id); if (r) r.reset(); });

  const meldContainer = document.querySelector('[data-interaction="meld-calc"]');
  if (meldContainer) new MeldCalc(meldContainer);
}

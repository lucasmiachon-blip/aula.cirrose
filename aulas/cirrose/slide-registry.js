/**
 * slide-registry.js — Cirrose
 * Centralizes all slide wiring: custom animations, panel states,
 * click-reveal, and interactions.
 *
 * Created: FASE 3 (2026-02-27)
 * Updated: 2026-03-04 — Act 1 state machines (burden, damico, paradigm)
 */

import { panelStates } from './slides/_manifest.js';
import { SplitText } from 'gsap/SplitText';

/* ────────────────────────────────────────────
   Shared helper: countUp for inline elements
   ──────────────────────────────────────────── */
function inlineCountUp(gsap, el, target, duration = 1.2, delay = 0) {
  const isDecimal = String(target).includes('.');
  const decimals = isDecimal ? 1 : 0;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration,
    delay,
    ease: 'power2.out',
    onUpdate() {
      el.textContent = decimals > 0
        ? obj.val.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : Math.round(obj.val).toLocaleString('pt-BR');
    },
  });
}

export const customAnimations = {
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-01 — BURDEN (hero → iceberg)
     States: 0=hero, 1=iceberg bars, 2=source
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-01': (slide, gsap) => {
    let state = 0;
    const maxState = 2;

    const hero = slide.querySelector('.burden-hero');
    const pulse = slide.querySelector('.burden-pulse');
    const iceberg = slide.querySelector('.burden-iceberg');
    const compFill = slide.querySelector('.burden-bar-fill--comp');
    const decompFill = slide.querySelector('.burden-bar-fill--decomp');
    const compNum = slide.querySelector('[data-countup-target="112"]');
    const decompNum = slide.querySelector('[data-countup-target="10.6"]');
    const trend = slide.querySelector('.burden-trend');
    const sourceTag = slide.querySelector('.source-tag');

    function advance() {
      if (state >= maxState) return false;
      state++;

      if (state === 1) {
        // Hero compresses to top, iceberg appears
        gsap.to(hero, {
          scale: 0.6,
          y: -80,
          duration: 0.6,
          ease: 'power2.out',
          onComplete() { hero.classList.add('burden-hero--compact'); }
        });
        if (pulse) gsap.to(pulse, { opacity: 0, duration: 0.3 });

        gsap.to(iceberg, { opacity: 1, duration: 0.4, delay: 0.3 });

        // Bars grow
        gsap.to(compFill, { width: '91%', duration: 1, delay: 0.5, ease: 'power2.out' });
        gsap.to(decompFill, { width: '9%', duration: 1, delay: 0.6, ease: 'power2.out' });

        // CountUp on bar values
        if (compNum) inlineCountUp(gsap, compNum, 112, 1.2, 0.5);
        if (decompNum) inlineCountUp(gsap, decompNum, 10.6, 1.2, 0.6);

        // Trend fadeUp
        gsap.to(trend, { opacity: 1, y: 0, duration: 0.5, delay: 1.2, ease: 'power2.out' });
      }

      if (state === 2) {
        gsap.to(sourceTag, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      }

      return true;
    }

    function retreat() {
      if (state <= 0) return false;

      if (state === 2) {
        gsap.to(sourceTag, { opacity: 0, duration: 0.3 });
      }

      if (state === 1) {
        hero.classList.remove('burden-hero--compact');
        gsap.to(hero, { scale: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        if (pulse) gsap.to(pulse, { opacity: 1, duration: 0.3, delay: 0.3 });
        gsap.to(iceberg, { opacity: 0, duration: 0.3 });
        gsap.to(compFill, { width: '0%', duration: 0.3 });
        gsap.to(decompFill, { width: '0%', duration: 0.3 });
        gsap.to(trend, { opacity: 0, duration: 0.3 });
        if (compNum) compNum.textContent = '0';
        if (decompNum) decompNum.textContent = '0';
      }

      state--;
      return true;
    }

    // Initial state
    gsap.set(trend, { y: 12 });

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-damico — D'Amico staging (2006→2014→2024)
     States: 0=auto 4 stages, 1=+stage 5, 2=overlay, 3=source
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-damico': (slide, gsap) => {
    let state = 0;
    const maxState = 3;
    let busy = false;

    const contextBadge = slide.querySelector('.damico-badge--context');
    const stages = slide.querySelectorAll('.pathway-stage:not(.pathway-stage--collapsed)');
    const stage5 = slide.querySelector('.pathway-stage--collapsed');
    const further = slide.querySelector('.damico-further');
    const sourceTag = slide.querySelector('.source-tag');

    // Auto-play: badge fades in, then stagger 4 stages + countUp
    if (contextBadge) {
      gsap.to(contextBadge, { opacity: 1, duration: 0.4, delay: 0.1, ease: 'power2.out' });
    }

    const stageEls = Array.from(stages);
    gsap.set(stageEls, { opacity: 0, y: 24 });
    gsap.to(stageEls, {
      opacity: 1, y: 0,
      duration: 0.5,
      stagger: 0.15,
      delay: 0.2,
      ease: 'power3.out',
    });

    // CountUp on mortality percentages in stages 1-4
    stageEls.forEach((s, i) => {
      const valEl = s.querySelector('[data-countup]');
      if (!valEl) return;
      const raw = (valEl.dataset.target || '').replace(',', '.');
      const target = parseFloat(raw);
      if (isNaN(target)) return;
      inlineCountUp(gsap, valEl, target, 1, 0.4 + i * 0.15);
    });

    // Dividers animate in
    const dividers = slide.querySelectorAll('.pathway-divider');
    gsap.set(dividers, { scaleY: 0 });
    gsap.to(dividers, { scaleY: 1, duration: 0.6, delay: 0.8, stagger: 0.2, ease: 'power2.out' });

    function advance() {
      if (busy || state >= maxState) return false;
      state++;

      if (state === 1) {
        busy = true;
        // Stage 5 grows from collapsed
        gsap.to(stage5, {
          flex: 1,
          opacity: 1,
          padding: 'var(--space-sm) var(--space-xs)',
          duration: 0.7,
          ease: 'power2.out',
          onStart() {
            stage5.style.overflow = 'visible';
            stage5.style.width = 'auto';
          },
          onComplete() { busy = false; },
        });
        // CountUp on stage 5
        const val5 = stage5.querySelector('[data-countup]');
        if (val5) {
          const raw = (val5.dataset.target || '').replace(',', '.');
          inlineCountUp(gsap, val5, parseFloat(raw), 1, 0.4);
        }
      }

      if (state === 2) {
        busy = true;
        // Dim stages 1-2, glow stages 3-5
        stageEls.slice(0, 2).forEach(s => {
          gsap.to(s, { opacity: 0.4, duration: 0.5 });
        });
        stageEls.slice(2).forEach(s => {
          s.style.animation = 'damico-danger-glow 2s ease infinite';
        });
        if (stage5) stage5.style.animation = 'damico-danger-glow 2s ease infinite';

        // Further decompensation overlay
        gsap.to(further, {
          opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out',
          onComplete() { busy = false; },
        });
      }

      if (state === 3) {
        gsap.to(sourceTag, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      }

      return true;
    }

    function retreat() {
      if (busy || state <= 0) return false;

      if (state === 3) {
        gsap.to(sourceTag, { opacity: 0, duration: 0.3 });
      }

      if (state === 2) {
        busy = true;
        // Restore all stages
        stageEls.forEach(s => {
          gsap.to(s, { opacity: 1, duration: 0.4 });
          s.style.animation = '';
        });
        if (stage5) stage5.style.animation = '';
        gsap.to(further, {
          opacity: 0, duration: 0.3,
          onComplete() { busy = false; },
        });
      }

      if (state === 1) {
        busy = true;
        // Collapse stage 5
        gsap.to(stage5, {
          flex: 0, opacity: 0, padding: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete() {
            stage5.style.overflow = 'hidden';
            stage5.style.width = '0';
            busy = false;
          },
        });
      }

      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-02 — PARADIGMA cACLD/dACLD
     States: 0=auto dissolve, 1=Rule-of-5, 2=Antônio, 3=source
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-02': (slide, gsap) => {
    let state = 0;
    const maxState = 3;

    const oldTerm = slide.querySelector('.paradigm-old');
    const spectrum = slide.querySelector('.paradigm-spectrum');
    const bavRef = slide.querySelector('.paradigm-ref');
    const rule5 = slide.querySelector('.rule-of-5');
    const zones = slide.querySelectorAll('.rule-zone');
    const antonioPlot = slide.querySelector('.antonio-plot');
    const sourceTag = slide.querySelector('.source-tag');

    // Auto-play: SplitText dissolve → spectrum emerges
    let splitInstance = null;

    if (oldTerm && oldTerm.textContent.trim()) {
      splitInstance = new SplitText(oldTerm, { type: 'chars' });

      // Initial state: old term visible
      gsap.set(oldTerm, { opacity: 1 });
      gsap.set(spectrum, { opacity: 0 });
      gsap.set(bavRef, { opacity: 0 });

      // Timeline: dissolve chars → show spectrum
      const tl = gsap.timeline({ delay: 1.5 });
      tl.to(splitInstance.chars, {
        opacity: 0,
        y: -20,
        rotationX: 90,
        stagger: { each: 0.06, from: 'random' },
        duration: 0.5,
        ease: 'power2.in',
      });
      tl.set(oldTerm, { display: 'none' });
      tl.to(spectrum, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      });
      tl.to(bavRef, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.2');
    } else {
      // Failsafe: no SplitText, just show spectrum
      gsap.set(spectrum, { opacity: 1 });
      gsap.set(bavRef, { opacity: 1 });
    }

    function advance() {
      if (state >= maxState) return false;
      state++;

      if (state === 1) {
        // Compress spectrum up, show Rule-of-5
        gsap.to(spectrum, { y: -20, scale: 0.85, duration: 0.5, ease: 'power2.out' });
        gsap.to(bavRef, { opacity: 0, duration: 0.3 });
        gsap.to(rule5, { opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' });

        // Stagger zones L→R
        gsap.set(zones, { opacity: 0, y: 16 });
        gsap.to(zones, {
          opacity: 1, y: 0,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power3.out',
        });
      }

      if (state === 2) {
        // Highlight zone 4 (20-25) and show Antônio
        const targetZone = slide.querySelector('[data-zone-idx="3"]');
        if (targetZone) targetZone.classList.add('rule-zone--highlighted');

        gsap.to(antonioPlot, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      }

      if (state === 3) {
        gsap.to(sourceTag, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      }

      return true;
    }

    function retreat() {
      if (state <= 0) return false;

      if (state === 3) {
        gsap.to(sourceTag, { opacity: 0, duration: 0.3 });
      }

      if (state === 2) {
        const targetZone = slide.querySelector('[data-zone-idx="3"]');
        if (targetZone) targetZone.classList.remove('rule-zone--highlighted');
        gsap.to(antonioPlot, { opacity: 0, duration: 0.3 });
      }

      if (state === 1) {
        gsap.to(spectrum, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
        gsap.to(bavRef, { opacity: 1, duration: 0.3, delay: 0.2 });
        gsap.to(rule5, { opacity: 0, duration: 0.3 });
      }

      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

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
      const punchline = slide.querySelector('.hook-punchline');
      [...labs, lead, question, punchline].filter(Boolean).forEach(el => {
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
      const punchline = slide.querySelector('.hook-punchline');
      if (gsap) {
        gsap.set([...labs, lead, question, punchline].filter(Boolean), { opacity: 0, visibility: 'hidden' });
      }
    }

    function runLabsStagger() {
      const labs = slide.querySelectorAll('.hook-lab');
      const question = slide.querySelector('.hook-question');
      const lead = slide.querySelector('.hook-question-lead');
      const punchline = slide.querySelector('.hook-punchline');
      if (gsap) {
        gsap.fromTo(labs,
          { opacity: 0, visibility: 'visible', y: 12 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.12, delay: 0.05, ease: 'power2.out' }
        );
        if (lead) gsap.fromTo(lead, { opacity: 0, visibility: 'visible' }, { opacity: 1, duration: 0.3, delay: 0.5 });
        if (question) gsap.fromTo(question, { opacity: 0, visibility: 'visible', y: 8 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.65, ease: 'power2.out' });
        if (punchline) gsap.fromTo(punchline, { opacity: 0, visibility: 'visible', y: 8 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.7, ease: 'power2.out' });
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

/**
 * slide-registry.js — Cirrose
 * Centralizes all slide wiring: custom animations, panel states,
 * click-reveal, and interactions.
 *
 * Created: FASE 3 (2026-02-27)
 * Updated: 2026-03-11 — Act 1 restructure (rastreio, classify hero)
 */

import { panelStates } from './slides/_manifest.js';
import { getCurrentSlide } from './shared/js/deck.js';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

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
     s-a1-01 — Rastreio na atenção primária
     R11: Bloomberg hero → reactive metrics → Ghost Rows → diagnostic scan → match punch
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-01': (slide, gsap) => {
    // Custom eases (Apple-style cinematic curves)
    CustomEase.create('appleHero', 'M0,0 C0.05,0.85 0.1,1 1,1');
    CustomEase.create('snapOut', 'M0,0 C0.2,1 0.3,1 1,1');

    const headline = slide.querySelector('.slide-headline');
    const heroNum = slide.querySelector('.screening-hero-number');
    const metrics = slide.querySelector('.screening-metrics');
    const rec = slide.querySelector('.guideline-rec');
    const sourceTag = slide.querySelector('.source-tag');
    const stackRows = slide.querySelectorAll('.stack-row');
    const guidelineStack = slide.querySelector('.guideline-stack');

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // SplitText headline reveal
    if (headline) {
      const split = new SplitText(headline, { type: 'chars' });
      gsap.set(split.chars, { opacity: 0, y: 8 });
      tl.to(split.chars, { opacity: 1, y: 0, duration: 0.4, stagger: 0.02 }, 0);
    }

    // Bloomberg CountUp — blur during count, cinematic ease
    // Metrics reveal reactively when countUp passes 70 (85% of 83)
    let metricsRevealed = false;

    if (heroNum) {
      gsap.set(heroNum, { scale: 0.8, opacity: 0, filter: 'blur(6px)' });
      tl.to(heroNum, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'snapOut' }, 0.2);
      const obj = { val: 0 };
      tl.to(obj, {
        val: 83,
        duration: 1.8,
        ease: 'appleHero',
        onUpdate() {
          heroNum.textContent = Math.round(obj.val);
          if (obj.val >= 70 && !metricsRevealed) {
            metricsRevealed = true;
            revealMetrics();
          }
        },
      }, 0.2);
    }

    // Metrics — SplitText chars + blur reveal (triggered by countUp)
    function revealMetrics() {
      if (!metrics) return;
      const items = metrics.querySelectorAll('.screening-metric');

      gsap.to(metrics, { opacity: 1, duration: 0.01 });

      items.forEach((item, i) => {
        const val = item.querySelector('.screening-metric-value');
        const label = item.querySelector('.screening-metric-label');

        if (val) {
          const splitV = new SplitText(val, { type: 'chars' });
          gsap.set(splitV.chars, { opacity: 0, y: 10, filter: 'blur(4px)' });
          gsap.to(splitV.chars, {
            opacity: 1, y: 0, filter: 'blur(0px)',
            duration: 0.6, stagger: 0.03, ease: 'back.out(1.5)',
            delay: i * 0.2,
          });
        }
        if (label) {
          gsap.set(label, { clipPath: 'inset(0 100% 0 0)' });
          gsap.to(label, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.5, ease: 'power3.inOut',
            delay: i * 0.2 + 0.15,
          });
        }
      });
    }

    if (metrics) {
      gsap.set(metrics, { opacity: 0 });
    }

    // Guideline panel — fade up
    tl.addLabel('guideline', 2.8);
    if (rec) {
      gsap.set(rec, { opacity: 0, y: 20 });
      tl.to(rec, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 'guideline');
    }

    // Stagger Ghost Rows after panel appears
    if (stackRows.length) {
      gsap.set(stackRows, { opacity: 0, y: 8 });
      tl.to(stackRows, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out',
      }, 'guideline+=0.3');
    }

    // P4: Sequential Eval — dots flash in sequence before match punch (R12)
    tl.addLabel('eval', 4.0);

    if (stackRows.length) {
      const dots = Array.from(stackRows).map(row => row.querySelector('.status-dot'));
      const texts = Array.from(stackRows).map(row => row.querySelector('.row-text'));
      // Flash de processamento — simula checklist diagnostica
      tl.to(dots, {
        scale: 1.3,
        backgroundColor: 'var(--ui-accent)',
        duration: 0.15,
        stagger: 0.1,
        yoyo: true,
        repeat: 1,
      }, 'eval');
      // Micro-nudge texto — Kurzgesagt-style tension before match punch
      tl.to(texts, {
        x: 3,
        color: 'var(--ui-accent)',
        duration: 0.15,
        stagger: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
      }, 'eval');
    }

    // Match punch — "Antônio tem dois dos três" (after eval completes)
    tl.addLabel('punch', 4.6);

    if (stackRows.length) {
      stackRows.forEach((row, i) => {
        const isMatch = row.dataset.match !== undefined;
        tl.to(row, {
          x: isMatch ? 4 : 0,
          scale: isMatch ? 1 : 0.98,
          opacity: isMatch ? 1 : 0.65,
          duration: 0.4,
          ease: isMatch ? 'back.out(1.5)' : 'power2.out',
          onStart() { row.classList.add(isMatch ? 'matched' : 'dimmed'); },
        }, `punch+=${i * 0.2}`);
      });
    }

    // Source-tag
    if (sourceTag) {
      tl.to(sourceTag, { opacity: 1, duration: 0.5 }, 'guideline+=0.4');
    }

    // No click-reveals — auto only
  },


  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-classify — Estadiamento associado ao prognóstico
     State 0: D'Amico cards stagger (auto — problem)
     State 1: further decomp (click — consequence)
     State 2: source (click)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-classify': (slide, gsap) => {
    if (document.body.classList.contains('stage-bad')) return;

    gsap.registerPlugin(DrawSVGPlugin);

    let state = 0;
    const maxState = 2;

    const cards = slide.querySelectorAll('.classify-card');
    const furtherDecomp = slide.querySelector('.classify-further-decomp');
    const furtherPath = slide.querySelector('.classify-further-path');
    const badgeFatal = slide.querySelector('.badge-fatal');
    const dangerIconSvg = slide.querySelector('.classify-card--danger .classify-card-icon--svg');
    const dangerText = slide.querySelector('.classify-card--danger .classify-card-assertion');
    const sourceTag = slide.querySelector('.source-tag');

    // Initial hidden states (P4: 3D perspective — cards "land" instead of float)
    gsap.set(cards, { opacity: 0, y: 30, rotationX: -12, transformPerspective: 800 });
    if (furtherDecomp) gsap.set(furtherDecomp, { opacity: 0, y: 8 });
    if (furtherPath) gsap.set(furtherPath, { drawSVG: '0%' });
    if (badgeFatal) gsap.set(badgeFatal, { opacity: 0, scale: 0.8 });
    if (sourceTag) gsap.set(sourceTag, { opacity: 0 });

    // Auto: D'Amico cards — gravity landing with 3D perspective
    const tl = gsap.timeline({ delay: 0.3 });
    if (cards[0]) tl.to(cards[0], { y: 0, opacity: 1, rotationX: 0, duration: 0.6, ease: 'back.out(1.2)' });
    if (cards[1]) tl.to(cards[1], { y: 0, opacity: 1, rotationX: 0, duration: 0.7, ease: 'back.out(1.2)' }, '+=0.15');
    if (cards[2]) tl.to(cards[2], { y: 0, opacity: 1, rotationX: 0, duration: 0.9, ease: 'back.out(1.4)' }, '+=0.4');

    function advance() {
      if (state >= maxState) return false;
      state++;
      if (state === 1) {
        // Chained timeline: icon collapse → further decomp enters → badge
        const tl1 = gsap.timeline();

        // Phase 1: Danger ✕ collapses — sucked inward
        if (dangerIconSvg) {
          tl1.to(dangerIconSvg, { scale: 0, rotation: -90, opacity: 0, duration: 0.4, ease: 'expo.in' });
          // dangerText stays in place — void is intentional dramatic silence
        }

        // Phase 2: Further decomp enters with overlap + arrow draws alongside
        tl1.to(furtherDecomp, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.1');
        if (furtherPath) {
          tl1.to(furtherPath, { drawSVG: '100%', duration: 0.5, ease: 'power3.out' }, '<0.1');
        }

        // Phase 3: Badge stamps in — no bounce, gravity
        if (badgeFatal) {
          tl1.fromTo(badgeFatal,
            { opacity: 0, scale: 0.95, x: -10 },
            { opacity: 1, scale: 1, x: 0, duration: 0.6, ease: 'expo.out' },
            '-=0.2'
          );
        }
      } else if (state === 2) {
        gsap.to(sourceTag, { opacity: 1, duration: 0.4 });
      }
      return true;
    }

    function retreat() {
      if (state <= 0) return false;
      if (state === 1) {
        gsap.to(furtherDecomp, { opacity: 0, y: 8, duration: 0.3 });
        if (furtherPath) gsap.to(furtherPath, { drawSVG: '0%', duration: 0.3 });
        if (badgeFatal) gsap.to(badgeFatal, { opacity: 0, scale: 0.5, x: -8, duration: 0.2 });
        if (dangerIconSvg) gsap.to(dangerIconSvg, { scale: 1, rotation: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
        // dangerText no longer animated — no retreat needed
      } else if (state === 2) {
        gsap.to(sourceTag, { opacity: 0, duration: 0.3 });
      }
      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-cpt — Child-Turcotte-Pugh: história, limitações, uso atual
     Era 0: História 1964→1973 (auto) — variables + classes stagger
     Era 1: Limitações (click) — 4 limit-cards stagger
     Era 2: Uso atual (click) — 3 role-cards stagger
     Plan B: todos eras visíveis via CSS failsafe — retorna cedo
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-elasto — Elastografia: apreciação crítica
     States: 0=confounders stagger (auto), 1=MASLD gap (click),
             2=MRE escape (click)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-elasto': (slide, gsap) => {
    if (document.body.classList.contains('stage-bad')) return;

    let state = 0;
    const maxState = 2;

    const confCards = slide.querySelectorAll('.elasto-conf');
    const masldBlock = slide.querySelector('.elasto-masld');
    const mreBlock = slide.querySelector('.elasto-mre');
    const sourceTag = slide.querySelector('.source-tag');
    const masldValues = masldBlock.querySelectorAll('.elasto-masld-value, .elasto-masld-arrow');

    /* Initial state: hide everything */
    const confGrid = slide.querySelector('.elasto-confounders');
    if (confGrid) gsap.set(confGrid, { opacity: 1 });
    gsap.set(confCards, { autoAlpha: 0, y: 8, scale: 0.97 });
    gsap.set([masldBlock, mreBlock], { autoAlpha: 0, y: 12, scale: 0.97 });
    gsap.set(masldValues, { autoAlpha: 0, y: 6 });
    if (sourceTag) gsap.set(sourceTag, { autoAlpha: 0 });

    /* State 0 (auto): confounders timeline with overlap */
    const tl0 = gsap.timeline({ delay: 0.3 });
    confCards.forEach((card, i) => {
      tl0.to(card, {
        autoAlpha: 1, y: 0, scale: 1,
        duration: 0.4, ease: 'power2.out',
      }, i * 0.12);
    });

    function advance() {
      if (state >= maxState) return false;
      state++;

      if (state === 1) {
        /* MASLD hero: scale emphasis + power3.out (baveno pattern) */
        gsap.fromTo(masldBlock,
          { autoAlpha: 0, y: 12, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
        );
        /* Stagger interno: 90% → arrow → 63% (bom → mau) */
        gsap.fromTo(masldValues,
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.15, delay: 0.35, ease: 'power2.out' }
        );
      } else if (state === 2) {
        /* MRE: snappy, supporting */
        gsap.fromTo(mreBlock,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' }
        );
        if (sourceTag) {
          gsap.to(sourceTag, { autoAlpha: 1, duration: 0.3, delay: 0.2 });
        }
      }
      return true;
    }

    function retreat() {
      if (state <= 0) return false;

      if (state === 2) {
        gsap.to([mreBlock, sourceTag].filter(Boolean), {
          autoAlpha: 0, y: 8, duration: 0.2, ease: 'power2.in',
        });
      } else if (state === 1) {
        /* Valores primeiro, depois card com scale reverso */
        gsap.to(masldValues, { autoAlpha: 0, y: 6, duration: 0.15, ease: 'power2.in' });
        gsap.to(masldBlock, {
          autoAlpha: 0, y: 8, scale: 0.97,
          duration: 0.25, delay: 0.1, ease: 'power2.in',
        });
      }

      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  's-a1-cpt': (slide, gsap) => {
    if (document.body.classList.contains('stage-bad')) return;

    let state = 0;
    const maxState = 2;
    let busy = false;

    const eras = slide.querySelectorAll('.scores-era');
    const sourceTag = slide.querySelector('.source-tag');

    eras.forEach((era, i) => gsap.set(era, { autoAlpha: i === 0 ? 1 : 0 }));

    function showEra(idx, onComplete) {
      eras.forEach(e => {
        if (parseFloat(getComputedStyle(e).opacity) > 0.01) {
          gsap.to(e, { autoAlpha: 0, duration: 0.3 });
        }
      });
      const target = slide.querySelector(`.scores-era[data-era="${idx}"]`);
      if (!target) { busy = false; return; }
      gsap.to(target, {
        autoAlpha: 1, duration: 0.45, delay: 0.35, ease: 'power2.out',
        onComplete: onComplete || (() => { busy = false; }),
      });
    }

    // S0 auto: nodes stagger → kappa fade → ceiling countUp
    const nodes = slide.querySelectorAll('.cpt-node');
    const flawCallout = slide.querySelector('.cpt-flaw-callout');
    const ceiling = slide.querySelector('.cpt-ceiling');
    const ceilingHigh = slide.querySelector('.cpt-ceiling-high');
    const ceilingResult = slide.querySelector('.cpt-ceiling-result');

    gsap.set(nodes, { opacity: 0, y: 8 });
    if (flawCallout) gsap.set(flawCallout, { opacity: 0, y: 6 });
    if (ceiling) gsap.set(ceiling, { opacity: 0, y: 6 });
    if (ceilingResult) gsap.set(ceilingResult, { opacity: 0 });

    // Pre-hide S1/S2 children — prevents flash when era fades in before postAnim fires
    gsap.set(slide.querySelectorAll('.cpt-surgery-stat'), { opacity: 0, y: 12 });
    gsap.set(slide.querySelectorAll('.cpt-guideline-card'), { opacity: 0, y: 12 });

    // Nodes stagger
    gsap.to(nodes, { opacity: 1, y: 0, duration: 0.35, stagger: 0.1, delay: 0.3, ease: 'power2.out' });
    // Kappa callout after nodes
    if (flawCallout) gsap.to(flawCallout, { opacity: 1, y: 0, duration: 0.4, delay: 0.9, ease: 'power2.out' });
    // Ceiling card
    if (ceiling) gsap.to(ceiling, { opacity: 1, y: 0, duration: 0.4, delay: 1.4, ease: 'power2.out' });
    // CountUp on ceiling high value (3.1 → 30)
    if (ceilingHigh) {
      inlineCountUp(gsap, ceilingHigh, 30, 1.2, 1.8);
    }
    // Ceiling result punch ("= mesmos 3 pontos")
    if (ceilingResult) gsap.to(ceilingResult, { opacity: 1, duration: 0.3, delay: 3.2, ease: 'power2.out' });

    // CTP panel field: scale pulse after nodes stagger in
    const ctpLabel = [...document.querySelectorAll('.panel-field-label')]
      .find(el => el.textContent.trim() === 'CTP');
    if (ctpLabel) {
      const ctpVal = ctpLabel.closest('.panel-field')?.querySelector('.panel-field-value');
      if (ctpVal) {
        gsap.fromTo(ctpVal,
          { scale: 1 },
          { scale: 1.15, duration: 0.3, delay: 1.0, ease: 'power2.inOut',
            yoyo: true, repeat: 1 }
        );
      }
    }

    function runS1Anims() {
      const stats = slide.querySelectorAll('.cpt-surgery-stat');
      const pcts = slide.querySelectorAll('.cpt-surgery-pct[data-target]');
      gsap.set(stats, { opacity: 0, y: 12 });
      gsap.to(stats, { opacity: 1, y: 0, duration: 0.4, stagger: 0.2, delay: 0.1, ease: 'power2.out' });
      // CountUp on each percentage
      pcts.forEach((el, i) => {
        inlineCountUp(gsap, el, parseFloat(el.dataset.target), 1, 0.3 + i * 0.2);
      });
      // Von Restorff: scale C stat after countUp
      const cStat = slide.querySelector('.cpt-surgery-stat--danger');
      if (cStat) {
        gsap.to(cStat, { scale: 1.16, boxShadow: '0 8px 24px oklch(0.65 0.19 8 / 0.4)', duration: 0.5, delay: 1.2, ease: 'power2.out' });
        gsap.to(cStat, { scale: 1, boxShadow: 'none', duration: 0.4, delay: 2.5, ease: 'power2.inOut' });
      }
    }

    function runS2Anims() {
      const cards = slide.querySelectorAll('.cpt-guideline-card');
      gsap.set(cards, { opacity: 0, y: 12 });
      gsap.to(cards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2, delay: 0.1, ease: 'power3.out' });
    }

    function advance() {
      if (busy || state >= maxState) return false;
      state++;
      busy = true;
      // Pre-hide incoming era children before fade-in (prevents content flash)
      if (state === 1) {
        gsap.set(slide.querySelectorAll('.cpt-surgery-stat'), { opacity: 0, y: 12 });
        slide.querySelectorAll('.cpt-surgery-pct[data-target]').forEach(el => { el.textContent = '0'; });
      } else if (state === 2) {
        gsap.set(slide.querySelectorAll('.cpt-guideline-card'), { opacity: 0, y: 12 });
      }
      const postAnim = state === 1 ? runS1Anims : state === 2 ? runS2Anims : null;
      showEra(state, () => {
        busy = false;
        if (postAnim) postAnim();
      });
      return true;
    }

    function retreat() {
      if (busy || state <= 0) return false;
      if (state === 1) {
        // Reset countUp values and Von Restorff scale
        slide.querySelectorAll('.cpt-surgery-pct[data-target]').forEach(el => {
          gsap.killTweensOf(el); el.textContent = '0';
        });
        const cStat = slide.querySelector('.cpt-surgery-stat--danger');
        if (cStat) gsap.set(cStat, { scale: 1 });
      }
      state--;
      busy = true;
      showEra(state, () => { busy = false; });
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-baveno — Paradigma Baveno VII (SplitText dissolve + PREDESCI)
     States: 0=auto dissolve (paradigma only), 1=PREDESCI click
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-baveno': (slide, gsap) => {
    let state = 0;
    const maxState = 1;

    const oldTerm = slide.querySelector('.paradigm-old');
    const spectrum = slide.querySelector('.paradigm-spectrum');
    const predesci = slide.querySelector('.classify-predesci-lockup');
    const sourceTag = slide.querySelector('.source-tag');

    let splitInstance = null;
    let autoComplete = false;

    // --- Defensive reset for return visits ---
    gsap.killTweensOf([oldTerm, spectrum, predesci, sourceTag].filter(Boolean));
    if (oldTerm) {
      oldTerm.style.display = '';
      oldTerm.style.opacity = '';
      oldTerm.style.visibility = '';
      if (oldTerm.querySelector('.char')) {
        oldTerm.textContent = oldTerm.textContent;
      }
    }
    if (predesci) gsap.set(predesci, { opacity: 0, y: 20, scale: 0.98 });
    if (sourceTag) gsap.set(sourceTag, { opacity: 0 });

    if (oldTerm && oldTerm.textContent.trim()) {
      splitInstance = new SplitText(oldTerm, { type: 'chars' });

      gsap.set(oldTerm, { opacity: 1 });
      gsap.set(spectrum, { opacity: 0 });

      const tl = gsap.timeline({ delay: 1.3, onComplete: () => { autoComplete = true; } });
      tl.to(splitInstance.chars, {
        opacity: 0, y: -20, rotationX: 90,
        stagger: { each: 0.06, from: 'random' },
        duration: 0.5, ease: 'power2.in',
      });
      // P1: autoAlpha instead of height:0 — no reflow
      tl.to(oldTerm, { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' });
      tl.to(spectrum, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '<');
      if (sourceTag) tl.to(sourceTag, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.1');
    } else {
      gsap.set(spectrum, { opacity: 1 });
      if (sourceTag) gsap.set(sourceTag, { opacity: 1 });
      if (predesci) gsap.set(predesci, { opacity: 1, scale: 1 });
      autoComplete = true;
    }

    function advance() {
      if (!autoComplete) return true;
      if (state >= maxState) return false;
      state++;
      if (state === 1) {
        // P4: reveal with subtle scale
        gsap.fromTo(predesci,
          { opacity: 0, y: 20, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }
        );
      }
      return true;
    }

    function retreat() {
      if (state <= 0) return false;
      if (state === 1) {
        gsap.to(predesci, { opacity: 0, y: 10, scale: 0.98, duration: 0.3 });
      }
      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-fib4 — FIB-4: Progressive Spectrum
     Design: persistent bar + additive annotations
     States: 0=safe+danger grow (auto), 1=gray fills (click),
             2=pitfall flags (click)
     Rewritten 2026-03-29
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-fib4': (slide, gsap) => {
    let state = 0;
    const maxState = 2;

    /* Bar segments */
    const safeSeg = slide.querySelector('.fib4-seg--safe');
    const graySeg = slide.querySelector('.fib4-seg--gray');
    const dangerSeg = slide.querySelector('.fib4-seg--danger');

    /* Annotations */
    const safeAnnot = slide.querySelector('.fib4-annot--safe');
    const grayAnnot = slide.querySelector('.fib4-annot--gray');
    const dangerAnnot = slide.querySelector('.fib4-annot--danger');

    /* Pitfalls + source */
    const flags = slide.querySelector('.fib4-flags');
    const flagItems = slide.querySelectorAll('.fib4-flag');
    const sourceTag = slide.querySelector('.source-tag');

    /* ── Initial states ── */
    const spectrum = slide.querySelector('.fib4-spectrum');
    if (spectrum) gsap.set(spectrum, { opacity: 1 });
    /* Bar segments: safe+danger start collapsed, gray hidden */
    gsap.set(safeSeg, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(dangerSeg, { scaleX: 0, transformOrigin: 'right center' });
    gsap.set(graySeg, { scaleX: 0, transformOrigin: 'center center' });

    /* Annotations + flags hidden */
    gsap.set([safeAnnot, dangerAnnot], { autoAlpha: 0, y: 8 });
    gsap.set(grayAnnot, { autoAlpha: 0, y: 8 });
    gsap.set(flags, { autoAlpha: 0 });
    gsap.set(flagItems, { autoAlpha: 0, y: 10 });
    gsap.set(sourceTag, { autoAlpha: 0 });

    /* ── Beat 0 (auto): safe grows left→right, danger right→left ── */
    const tl0 = gsap.timeline({ delay: 0.3 });
    tl0.to(safeSeg, { scaleX: 1, duration: 0.5, ease: 'power2.out' })
       .to(safeAnnot, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.15')
       .to(dangerSeg, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, '-=0.25')
       .to(dangerAnnot, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.15');

    function advance() {
      if (state >= maxState) return false;
      state++;

      if (state === 1) {
        /* Gray zone fills from center — the gap becomes a zone */
        gsap.to(graySeg, {
          scaleX: 1, duration: 0.5, ease: 'power3.out'
        });
        gsap.to(grayAnnot, {
          autoAlpha: 1, y: 0, duration: 0.4, delay: 0.3, ease: 'power2.out'
        });
      }

      if (state === 2) {
        /* Pitfall flags stagger in below the spectrum */
        gsap.to(flags, { autoAlpha: 1, duration: 0.1 });
        gsap.to(flagItems, {
          autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.1,
          ease: 'power2.out'
        });
        gsap.to(sourceTag, { autoAlpha: 1, duration: 0.3, delay: 0.4 });
      }

      return true;
    }

    function retreat() {
      if (state <= 0) return false;

      if (state === 2) {
        gsap.to(sourceTag, { autoAlpha: 0, duration: 0.2 });
        gsap.to(flagItems, {
          autoAlpha: 0, y: 10, duration: 0.2, stagger: -0.05
        });
        gsap.to(flags, { autoAlpha: 0, duration: 0.1, delay: 0.25 });
      }

      if (state === 1) {
        gsap.to(grayAnnot, { autoAlpha: 0, y: 8, duration: 0.2 });
        gsap.to(graySeg, {
          scaleX: 0, duration: 0.4, delay: 0.15, ease: 'power2.in'
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
     s-a1-rule5 — Rule-of-5 (reference scale + holofote ≥25)
     States: 0=zones stagger+gray (auto), 1=holofote ≥25+sidebar LSM (click)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-rule5': (slide, gsap) => {
    let state = 0;
    const maxState = 1;

    const ruleOf5 = slide.querySelector('.rule-of-5');
    const zones = slide.querySelectorAll('.rule-zone');
    const grayZone = slide.querySelector('.rule-gray-zone');
    const criticalZone = slide.querySelector('.rule-zone[data-zone-idx="4"]');
    const dimZones = slide.querySelectorAll('.rule-zone:not([data-zone-idx="4"])');
    const sourceTag = slide.querySelector('.source-tag');
    const caveats = slide.querySelector('.rule-caveats');

    // Beat 0 (auto): zones scaleY stagger from bottom
    if (ruleOf5) gsap.set(ruleOf5, { opacity: 1 });
    gsap.set(zones, { scaleY: 0, opacity: 1, transformOrigin: 'bottom center' });
    if (grayZone) gsap.set(grayZone, { opacity: 0 });
    if (sourceTag) gsap.set(sourceTag, { opacity: 0 });
    if (caveats) gsap.set(caveats, { opacity: 0, y: 8 });

    gsap.to(zones, {
      scaleY: 1,
      duration: 0.5, stagger: 0.15, delay: 0.4,
      ease: 'power2.out',
    });

    if (grayZone) {
      gsap.to(grayZone, {
        opacity: 1, duration: 0.5,
        delay: 0.4 + zones.length * 0.15 + 0.3,
      });
    }

    function advance() {
      if (state >= maxState) return false;
      state++;

      // Holofote: dim non-critical zones, glow critical (≥25)
      gsap.to(dimZones, {
        opacity: 0.35, filter: 'grayscale(80%)',
        duration: 0.6, ease: 'power2.out',
      });
      if (criticalZone) {
        gsap.to(criticalZone, {
          scale: 1.05,
          boxShadow: '0 0 24px rgba(204, 74, 58, 0.5)',
          duration: 0.6, ease: 'power2.out',
        });
      }
      // Source tag + caveats
      if (sourceTag) gsap.to(sourceTag, { opacity: 1, duration: 0.4 });
      if (caveats) gsap.to(caveats, { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' });

      // Sidebar: LSM '—' → '26 kPa'
      // 3 layers: row highlight (persistent) + value punch + label cue
      document.querySelectorAll('#case-panel .panel-field').forEach(f => {
        if (f.querySelector('.panel-field-label')?.textContent === 'LSM') {
          const val = f.querySelector('.panel-field-value');
          const label = f.querySelector('.panel-field-label');
          if (val) {
            // Set final text + persistent styling
            val.textContent = '26 kPa';
            val.classList.add('changed');
            f.classList.add('panel-field--danger');

            // Value: scale punch delayed 0.3s (after zone dim settles)
            val.style.display = 'inline-block';
            gsap.fromTo(val,
              { scale: 1.6, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.6, delay: 0.3, ease: 'power3.out' }
            );

            // Label: brief flash so audience notices the row
            if (label) {
              gsap.fromTo(label,
                { color: 'var(--danger)' },
                { color: 'var(--text-muted)', duration: 1.5, delay: 0.3, ease: 'power2.out' }
              );
            }
          }
        }
      });

      return true;
    }

    function retreat() {
      if (state <= 0) return false;

      // Undo holofote
      gsap.to(dimZones, {
        opacity: 1, filter: 'grayscale(0%)',
        duration: 0.4, ease: 'power2.out',
      });
      if (criticalZone) {
        gsap.to(criticalZone, {
          scale: 1, boxShadow: 'none',
          duration: 0.4, ease: 'power2.out',
        });
      }
      // Hide source tag + caveats
      if (sourceTag) gsap.to(sourceTag, { opacity: 0, duration: 0.3 });
      if (caveats) gsap.to(caveats, { opacity: 0, y: 8, duration: 0.3 });

      // Reset sidebar LSM
      document.querySelectorAll('#case-panel .panel-field').forEach(f => {
        if (f.querySelector('.panel-field-label')?.textContent === 'LSM') {
          const val = f.querySelector('.panel-field-value');
          const label = f.querySelector('.panel-field-label');
          if (val) {
            gsap.killTweensOf(val);
            val.textContent = '—';
            val.classList.remove('changed');
            val.style.display = '';
            gsap.set(val, { scale: 1, opacity: 1, clearProps: 'all' });
          }
          if (label) {
            gsap.killTweensOf(label);
            gsap.set(label, { clearProps: 'color' });
          }
          f.classList.remove('panel-field--danger');
        }
      });

      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-meld — MELD: história, importância e evoluções
     States: 0=evolution cards stagger (auto), 1=mortality bar, 2=limitations+source
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-meld': (slide, gsap) => {
    let state = 0;
    const maxState = 2;

    const cards = slide.querySelectorAll('.meld-evo-card');
    const mortSection = slide.querySelector('.meld-mort-section');
    const mortBands = slide.querySelectorAll('.meld-mort-band');
    const limits = slide.querySelector('.meld-limits');
    const sourceTag = slide.querySelector('.source-tag');

    /* S0 init — hide all animated elements */
    gsap.set(cards, { opacity: 0, y: 16 });
    gsap.set(mortSection, { opacity: 0 });
    gsap.set(limits, { opacity: 0, y: 8 });
    gsap.set(sourceTag, { opacity: 0 });

    /* S0 auto — cards stagger as atoms (no internal build) */
    cards.forEach((card, i) => {
      const cardDelay = 0.3 + i * 0.2;
      gsap.to(card, { opacity: 1, y: 0, duration: 0.4, delay: cardDelay, ease: 'power2.out' });
    });

    function advance() {
      if (state >= maxState) return false;
      state++;
      if (state === 1) {
        /* Mortality bar: section fades, bands stagger */
        gsap.to(mortSection, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        gsap.set(mortBands, { opacity: 0, y: 8 });
        gsap.to(mortBands, { opacity: 1, y: 0, duration: 0.35, stagger: 0.12, delay: 0.15, ease: 'power2.out' });
      }
      if (state === 2) {
        gsap.to(limits, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        gsap.to(sourceTag, { opacity: 1, duration: 0.4, delay: 0.15 });
      }
      return true;
    }

    function retreat() {
      if (state <= 0) return false;
      if (state === 2) {
        gsap.to(sourceTag, { opacity: 0, duration: 0.3 });
        gsap.to(limits, { opacity: 0, y: 8, duration: 0.3 });
      }
      if (state === 1) {
        gsap.to(mortSection, { opacity: 0, duration: 0.3 });
      }
      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-cp1 — Breathing slide: body bg navy to eliminate letterbox bars
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-cp1': (slide) => {
    const navy = 'oklch(22% 0.042 258)';
    const deck = document.getElementById('deck');
    document.body.style.background = navy;
    if (deck) deck.style.background = navy;

    const cleanup = (e) => {
      if (e.detail.currentSlide !== slide) {
        document.body.style.background = '';
        if (deck) deck.style.background = '';
        document.removeEventListener('slide:changed', cleanup);
      }
    };
    document.addEventListener('slide:changed', cleanup);
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-hook v16 — Caso Antônio (Gemini R2 proposals 2-5)
     Auto: bio+punchline visible + clinical-stutter stagger + differential motion
     Alert labs: color bleeds from black → red. back.out easing.
     Question: SplitText char-by-char reveal (Instrument Serif italic).
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-hook': (slide, gsap) => {
    const labs = [...slide.querySelectorAll('.hook-lab')];
    const question = slide.querySelector('.hook-question');

    // Kill any leftover tweens from previous visit
    gsap.killTweensOf([...labs, question]);

    // Reset labs — alerts start slightly scaled down
    labs.forEach(lab => {
      const isAlert = lab.classList.contains('hook-lab--alert');
      gsap.set(lab, {
        opacity: 0,
        y: isAlert ? 15 : 12,
        scale: isAlert ? 0.95 : 1,
      });
      // Alert values start with neutral color, will bleed to red
      if (isAlert) {
        const val = lab.querySelector('.hook-lab-value');
        if (val) gsap.set(val, { color: 'var(--text-primary)' });
      }
    });

    if (question) gsap.set(question, { opacity: 0 });

    // Auto: clinical-stutter stagger with differential motion
    const tl = gsap.timeline({ delay: 0.3 });
    labs.forEach((lab, i) => {
      const isAlert = lab.classList.contains('hook-lab--alert');
      const valueNode = lab.querySelector('.hook-lab-value');

      tl.to(lab, {
        opacity: 1, y: 0, scale: 1,
        duration: isAlert ? 0.8 : 0.4,
        ease: isAlert ? 'back.out(1.2)' : 'power2.out',
      }, i * 0.15);

      // Alert value color bleeds from black → red after landing
      if (isAlert && valueNode) {
        tl.to(valueNode, {
          color: 'var(--hook-alert-value)',
          duration: 0.5,
          ease: 'power2.out',
        }, '-=0.4');
      }
    });

    // Question: SplitText char-by-char or fallback fade
    if (question) {
      if (SplitText) {
        const split = new SplitText(question, { type: 'words,chars' });
        gsap.set(split.chars, { opacity: 0, y: 10, filter: 'blur(4px)' });
        tl.to(question, { opacity: 1, duration: 0.1 }, '>+0.5');
        tl.to(split.chars, {
          opacity: 1, y: 0, filter: 'blur(0px)',
          stagger: 0.03,
          duration: 0.6,
          ease: 'power3.out',
        });
      } else {
        tl.to(question, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '>+0.5');
      }
    }
  },
};

export { panelStates };

/**
 * Wire all systems: custom anims → case panel → click-reveal → interactions.
 * Deps injected to avoid circular imports and keep registry testable.
 * Reveal removed — uses deck.js events (slide:changed, slide:entered).
 */
export function wireAll(gsap, { anim, CasePanel, ClickReveal }) {
  for (const [id, fn] of Object.entries(customAnimations)) {
    anim.registerCustom(id, fn);
  }

  const panelEl = document.getElementById('case-panel');
  if (panelEl) {
    const panel = new CasePanel(panelEl);
    for (const [id, state] of Object.entries(panelStates)) {
      panel.registerState(id, state);
    }
    panel.connect(document.getElementById('slide-viewport'));
    document.addEventListener('slide:changed', (e) => panel.onSlideChanged(e.detail.currentSlide));
    const currentSlide = getCurrentSlide();
    if (currentSlide) panel.onSlideChanged(currentSlide);
  }

  const revealers = new Map();
  document.querySelectorAll('#slide-viewport > section').forEach((section) => {
    if (section.querySelectorAll('[data-reveal]').length > 0) {
      const revealer = new ClickReveal(section, gsap);
      revealers.set(section.id, revealer);
      // Attach __clickRevealNext to section for deck.js navigate() to call
      section.__clickRevealNext = () => {
        if (revealer.hasMore) { revealer.next(); return true; }
        return false;
      };
    }
  });

  // Reset revealer on slide change (equivalent to Reveal slidechanged)
  document.addEventListener('slide:changed', (e) => {
    const id = e.detail.currentSlide?.id;
    const r = revealers.get(id);
    if (r) r.reset();
  });
}

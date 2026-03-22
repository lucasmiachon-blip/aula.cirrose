/**
 * slide-registry.js — Cirrose
 * Centralizes all slide wiring: custom animations, panel states,
 * click-reveal, and interactions.
 *
 * Created: FASE 3 (2026-02-27)
 * Updated: 2026-03-11 — Act 1 restructure (rastreio, classify hero)
 */

import { panelStates } from './slides/_manifest.js';
import { getCurrentSlide } from '../../shared/js/deck.js';
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
      // Flash de processamento — simula checklist diagnostica
      tl.to(dots, {
        scale: 1.4,
        backgroundColor: 'var(--ui-accent)',
        duration: 0.15,
        stagger: 0.1,
        yoyo: true,
        repeat: 1,
      }, 'eval');
    }

    // Match punch — "Antônio tem dois dos três" (after eval completes)
    tl.addLabel('punch', 4.6);

    if (stackRows.length) {
      stackRows.forEach((row, i) => {
        const isMatch = row.dataset.match !== undefined;
        tl.to(row, {
          duration: 0.4,
          ease: isMatch ? 'back.out(1.5)' : 'power2.out',
          onStart() { row.classList.add(isMatch ? 'matched' : 'dimmed'); },
        }, `punch+=${i * 0.2}`);
      });
    }

    // Source-tag
    if (sourceTag) {
      tl.to(sourceTag, { opacity: 0.6, duration: 0.5 }, 'guideline+=0.4');
    }

    // No click-reveals — auto only
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-vote — Audience poll with FIB-4 reveal
     State 0: question visible. State 1: reveal FIB-4 + verdict
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-vote': (slide, gsap) => {
    const options = slide.querySelectorAll('.vote-option');
    const reveal = slide.querySelector('.vote-reveal');
    const instruction = slide.querySelector('.vote-instruction');
    const heroNum = slide.querySelector('.vote-hero-number');
    const verdict = slide.querySelector('.vote-verdict');
    const explanation = slide.querySelector('.vote-explanation');
    const animTargets = [reveal, instruction, verdict, explanation].filter(Boolean);

    // Reset leftover DOM state from previous visit (ctx.revert only undoes GSAP)
    options.forEach(btn => {
      btn.classList.remove('vote-option--correct', 'vote-option--dimmed');
    });
    gsap.set(reveal, { opacity: 0, visibility: 'hidden' });
    gsap.set([verdict, explanation].filter(Boolean), { opacity: 0, y: 8 });
    if (instruction) gsap.set(instruction, { opacity: 1 });
    if (heroNum) heroNum.textContent = '5,91';

    let revealed = false;

    function doReveal() {
      if (revealed) return false;
      revealed = true;

      options.forEach(btn => {
        const vote = btn.dataset.vote;
        if (vote === 'B') {
          btn.classList.add('vote-option--correct');
        } else {
          btn.classList.add('vote-option--dimmed');
        }
      });

      if (instruction) gsap.to(instruction, { opacity: 0, duration: 0.3 });

      gsap.to(reveal, { opacity: 1, visibility: 'visible', duration: 0.4, delay: 0.3 });

      if (heroNum) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 5.91,
          duration: 1.4,
          delay: 0.5,
          ease: 'power1.out',
          onUpdate() { heroNum.textContent = obj.val.toFixed(2).replace('.', ','); }
        });
      }

      if (verdict) gsap.fromTo(verdict, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, delay: 1.2 });
      if (explanation) gsap.fromTo(explanation, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, delay: 1.5 });

      return true;
    }

    function undoReveal() {
      if (!revealed) return false;
      revealed = false;

      // Kill in-flight tweens before reversing
      gsap.killTweensOf(animTargets);

      options.forEach(btn => {
        btn.classList.remove('vote-option--correct', 'vote-option--dimmed');
      });

      if (instruction) gsap.to(instruction, { opacity: 1, duration: 0.3 });
      gsap.to(reveal, { opacity: 0, duration: 0.3, onComplete() {
        reveal.style.visibility = 'hidden';
        gsap.set([verdict, explanation].filter(Boolean), { opacity: 0, y: 8 });
      }});
      if (heroNum) heroNum.textContent = '5,91';

      return true;
    }

    // stopPropagation prevents deck.js viewport click from advancing slide
    options.forEach(btn => btn.addEventListener('click', (e) => {
      e.stopPropagation();
      doReveal();
    }));

    slide.__hookAdvance = doReveal;
    slide.__hookRetreat = undoReveal;
    slide.__hookCurrentBeat = () => revealed ? 1 : 0;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-classify — Estadiamento associado ao prognóstico
     State 0: D'Amico cards stagger (auto — problem)
     State 1: further decomp (click — consequence)
     State 2: PREDESCI box + hero (click — solution)
     State 3: source (click)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-classify': (slide, gsap) => {
    if (document.body.classList.contains('stage-bad')) return;

    gsap.registerPlugin(ScrambleTextPlugin, DrawSVGPlugin, MorphSVGPlugin);

    let state = 0;
    const maxState = 3;

    const cards = slide.querySelectorAll('.classify-card');
    const furtherDecomp = slide.querySelector('.classify-further-decomp');
    const furtherStrong = slide.querySelector('.classify-further-text strong');
    const furtherPath = slide.querySelector('.classify-further-path');
    const badgeFatal = slide.querySelector('.badge-fatal');
    const lockup = slide.querySelector('.classify-predesci-lockup');
    const sourceTag = slide.querySelector('.source-tag');
    const hrValue = slide.querySelector('.classify-predesci-value');
    // MorphSVG elements (Radical: ✕ transforms into arrow)
    const dangerXMorph = slide.querySelector('.danger-x-morph');
    const dangerXFade = slide.querySelector('.danger-x-fade');
    const dangerIconSvg = dangerXMorph?.closest('svg');

    // SplitText on HR value — chars reveal one by one (mic drop)
    let hrSplit = null;
    if (hrValue) {
      hrSplit = new SplitText(hrValue, { type: 'words,chars' });
      gsap.set(hrSplit.chars, { opacity: 0, y: 20 });
    }

    // Initial hidden states (P4: 3D perspective — cards "land" instead of float)
    gsap.set(cards, { opacity: 0, y: 30, rotationX: -12, transformPerspective: 800 });
    if (furtherDecomp) gsap.set(furtherDecomp, { opacity: 0, y: 8 });
    if (furtherPath) gsap.set(furtherPath, { drawSVG: '0%' });
    if (badgeFatal) gsap.set(badgeFatal, { opacity: 0, scale: 0.8 });
    if (lockup) gsap.set(lockup, { opacity: 0, y: 60, scale: 0.97 });

    // Auto: D'Amico cards — gravity landing with 3D perspective
    const tl = gsap.timeline({ delay: 0.3 });
    if (cards[0]) tl.to(cards[0], { y: 0, opacity: 1, rotationX: 0, duration: 0.6, ease: 'back.out(1.2)' });
    if (cards[1]) tl.to(cards[1], { y: 0, opacity: 1, rotationX: 0, duration: 0.7, ease: 'back.out(1.2)' }, '+=0.15');
    if (cards[2]) tl.to(cards[2], { y: 0, opacity: 1, rotationX: 0, duration: 0.9, ease: 'back.out(1.4)' }, '+=0.4');

    function advance() {
      if (state >= maxState) return false;
      state++;
      if (state === 1) {
        // Chained timeline: icon morph → arrow draw → scramble → badge
        const tl1 = gsap.timeline();

        // Phase 1: Danger ✕ pulses — triggers the fall
        if (dangerIconSvg) {
          tl1.to(dangerIconSvg, { scale: 1.4, duration: 0.25, ease: 'power2.out' });
          // Second X line fades, first morphs into arrow shape
          if (dangerXFade) tl1.to(dangerXFade, { opacity: 0, duration: 0.3 }, '<0.1');
          if (dangerXMorph) {
            tl1.to(dangerXMorph, {
              morphSVG: 'M4,2 L4,18 Q4,22 8,22 L18,22',
              duration: 0.7, ease: 'power2.inOut'
            }, '<0.1');
          }
          // Icon dissolves downward
          tl1.to(dangerIconSvg, {
            y: 20, opacity: 0, scale: 0.7,
            duration: 0.4, ease: 'power2.in'
          }, '-=0.2');
        }

        // Phase 2: Further decomp block enters + arrow draws
        tl1.to(furtherDecomp, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, dangerIconSvg ? '-=0.3' : 0);
        if (furtherPath) {
          tl1.to(furtherPath, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut' }, '<0.1');
        }

        // Phase 3: ScrambleText — clinical discomfort
        if (furtherStrong) {
          tl1.to(furtherStrong, {
            scrambleText: { text: 'further decompensation', chars: '░▒▓█▄▀', speed: 0.8 },
            duration: 0.8, ease: 'none'
          }, '-=0.3');
        }

        // Phase 4: Badge punches in AFTER scramble resolves
        if (badgeFatal) {
          tl1.fromTo(badgeFatal,
            { opacity: 0, scale: 0.5, x: -8 },
            { opacity: 1, scale: 1, x: 0, duration: 0.45, ease: 'back.out(2.5)' },
            '>'
          );
        }
      } else if (state === 2) {
        // Depth-of-field: cards + further decomp blur into background
        if (furtherStrong) gsap.to(furtherStrong, { color: 'var(--text-muted)', duration: 0.5 });
        gsap.to([...cards, furtherDecomp], {
          opacity: 0.5, scale: 0.97, filter: 'blur(2px)',
          duration: 0.8, ease: 'power2.inOut'
        });
        // PREDESCI enters with gravitational mass — expo.out = heavy deceleration
        gsap.fromTo(lockup,
          { opacity: 0, y: 60, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, delay: 0.3, ease: 'expo.out' }
        );
        // SplitText: HR chars snap into place after lockup settles
        if (hrSplit) {
          gsap.to(hrSplit.chars, {
            opacity: 1, y: 0, stagger: 0.08,
            duration: 0.6, ease: 'back.out(2)', delay: 0.9
          });
        }
      } else if (state === 3) {
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
        // Reverse MorphSVG: restore ✕ icon
        if (dangerXMorph) gsap.to(dangerXMorph, { morphSVG: 'M6,6 L18,18', duration: 0.3 });
        if (dangerXFade) gsap.to(dangerXFade, { opacity: 1, duration: 0.3 });
        if (dangerIconSvg) gsap.to(dangerIconSvg, { y: 0, opacity: 1, scale: 1, duration: 0.3 });
      } else if (state === 2) {
        // Reverse: restore clarity
        gsap.to([...cards, furtherDecomp], {
          opacity: 1, scale: 1, filter: 'none',
          duration: 0.4, ease: 'power2.out'
        });
        if (furtherStrong) gsap.to(furtherStrong, { color: 'var(--text-primary)', duration: 0.3 });
        if (hrSplit) gsap.to(hrSplit.chars, { opacity: 0, y: 20, duration: 0.2 });
        gsap.to(lockup, { opacity: 0, y: 60, scale: 0.97, duration: 0.4 });
      } else if (state === 3) {
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
     s-a1-damico — Escores Prognósticos (6 eras)
     Era 0: Child 1964 (auto) — boxes stagger
     Era 1: CTP 1973 (click) — boxes + limitations stagger sequencial
     Era 2: MELD 2001 (click) — formula stagger + c-stat CountUp
     Era 3: MELD-Na 2006 (click) — highlight no termo sódio
     Era 4: MELD 3.0 2021 (click) — dual CountUp c-stat
     Era 5: D'Amico (click) — dois datasets, CountUp estágios
     Plan B: todos eras visíveis via CSS failsafe — retorna cedo
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-damico': (slide, gsap) => {
    if (document.body.classList.contains('stage-bad')) return;

    let state = 0;
    const maxState = 2;
    let busy = false;

    const eras = slide.querySelectorAll('.scores-era');
    const sourceTag = slide.querySelector('.source-tag');

    eras.forEach((era, i) => gsap.set(era, { opacity: i === 0 ? 1 : 0 }));
    if (sourceTag) gsap.set(sourceTag, { opacity: 0 });

    function showEra(idx, onComplete) {
      eras.forEach(e => {
        if (parseFloat(getComputedStyle(e).opacity) > 0.01) {
          gsap.to(e, { opacity: 0, duration: 0.3 });
        }
      });
      const target = slide.querySelector(`.scores-era[data-era="${idx}"]`);
      if (!target) { busy = false; return; }
      gsap.to(target, {
        opacity: 1, duration: 0.45, delay: 0.35, ease: 'power2.out',
        onComplete: onComplete || (() => { busy = false; }),
      });
    }

    // Era 0 auto: CTP classes stagger
    const ctpClasses = slide.querySelectorAll('.scores-era[data-era="0"] .ctp-class');
    gsap.set(ctpClasses, { opacity: 0, y: 12 });
    gsap.to(ctpClasses, { opacity: 1, y: 0, duration: 0.35, stagger: 0.15, delay: 0.4, ease: 'power2.out' });

    function runEra1Anims() {
      const terms = slide.querySelectorAll('.scores-era[data-era="1"] .formula-term');
      gsap.set(terms, { opacity: 0, y: 10 });
      gsap.to(terms, { opacity: 1, y: 0, duration: 0.35, stagger: 0.15, delay: 0.1, ease: 'power2.out' });

      const sodiumTerm = slide.querySelector('[data-meldna-sodium]');
      if (sodiumTerm) {
        gsap.fromTo(sodiumTerm,
          { backgroundColor: 'transparent' },
          { backgroundColor: 'var(--ui-accent-light)', color: 'var(--ui-accent)', duration: 0.6, delay: 0.8, ease: 'power2.out' }
        );
      }

      const cstatEl = slide.querySelector('.scores-era[data-era="1"] .scores-cstat-value');
      if (cstatEl) {
        inlineCountUp(gsap, cstatEl, parseFloat(cstatEl.dataset.target), 1.2, 0.8);
      }
    }

    function runEra2Anims() {
      const stages = slide.querySelectorAll('.scores-era[data-era="2"] .pathway-stage');
      gsap.set(stages, { scaleX: 0, transformOrigin: 'left' });
      gsap.to(stages, { scaleX: 1, duration: 0.6, stagger: 0.15, delay: 0.2, ease: 'power2.out' });

      const vals = slide.querySelectorAll('.scores-era[data-era="2"] .pathway-value[data-target]');
      vals.forEach((el, i) => {
        inlineCountUp(gsap, el, parseFloat(el.dataset.target), 1, 0.4 + i * 0.15);
      });

      const further = slide.querySelector('.damico-further-decomp');
      if (further) gsap.fromTo(further, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 1.2, ease: 'power2.out' });

      if (sourceTag) gsap.to(sourceTag, { opacity: 1, duration: 0.4, delay: 1.5 });
    }

    function advance() {
      if (busy || state >= maxState) return false;
      state++;
      busy = true;
      const postAnim = state === 1 ? runEra1Anims : state === 2 ? runEra2Anims : null;
      showEra(state, () => {
        busy = false;
        if (postAnim) postAnim();
      });
      return true;
    }

    function retreat() {
      if (busy || state <= 0) return false;
      if (state === 2) {
        if (sourceTag) gsap.to(sourceTag, { opacity: 0, duration: 0.2 });
        slide.querySelectorAll('.scores-era[data-era="2"] .pathway-value[data-target]')
          .forEach(el => { gsap.killTweensOf(el); el.textContent = '0'; });
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
     s-a1-baveno — Paradigma Baveno VII (SplitText dissolve)
     States: 0=auto dissolve, 1=source
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-baveno': (slide, gsap) => {
    let state = 0;
    const maxState = 2;

    const oldTerm = slide.querySelector('.paradigm-old');
    const spectrum = slide.querySelector('.paradigm-spectrum');
    const bavRef = slide.querySelector('.paradigm-ref');
    const question = slide.querySelector('.paradigm-question');
    const pathway = slide.querySelector('.elasto-pathway');
    const pathSteps = slide.querySelectorAll('.elasto-step');
    const sourceTag = slide.querySelector('.source-tag');

    if (question) gsap.set(question, { opacity: 0, y: 8 });
    if (pathway) gsap.set(pathway, { opacity: 0 });
    gsap.set(pathSteps, { opacity: 0, y: 12 });

    let splitInstance = null;

    if (oldTerm && oldTerm.textContent.trim()) {
      splitInstance = new SplitText(oldTerm, { type: 'chars' });

      gsap.set(oldTerm, { opacity: 1 });
      gsap.set(spectrum, { opacity: 0 });
      gsap.set(bavRef, { opacity: 0 });

      const tl = gsap.timeline({ delay: 1.3 });
      tl.to(splitInstance.chars, {
        opacity: 0, y: -20, rotationX: 90,
        stagger: { each: 0.06, from: 'random' },
        duration: 0.5, ease: 'power2.in',
      });
      tl.set(oldTerm, { display: 'none' });
      tl.to(spectrum, { opacity: 1, duration: 0.6, ease: 'power2.out' });
      tl.to(bavRef, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2');
    } else {
      gsap.set(spectrum, { opacity: 1 });
      gsap.set(bavRef, { opacity: 1 });
    }

    function advance() {
      if (state >= maxState) return false;
      state++;
      if (state === 1) {
        if (question) gsap.to(question, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        if (pathway) gsap.to(pathway, { opacity: 1, duration: 0.3, delay: 0.2 });
        gsap.to(pathSteps, { opacity: 1, y: 0, duration: 0.4, stagger: 0.2, delay: 0.3, ease: 'power2.out' });
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
        if (question) gsap.to(question, { opacity: 0, y: 8, duration: 0.3 });
        if (pathway) gsap.to(pathway, { opacity: 0, duration: 0.3 });
        gsap.to(pathSteps, { opacity: 0, y: 12, duration: 0.3 });
      }
      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-fib4 — Hero FIB-4 + cutoff cards (clean hero-stat)
     States: 0=hero countUp + cards stagger (auto), 1=source (click)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-fib4': (slide, gsap) => {
    let state = 0;
    const maxState = 1;

    const heroNum = slide.querySelector('[data-countup-target="5.91"]');
    const cards = slide.querySelectorAll('.classify-card');
    const sourceTag = slide.querySelector('.source-tag');

    /* Auto: hero countUp + cards stagger */
    if (heroNum) {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 5.91,
        duration: 1.4,
        delay: 0.3,
        ease: 'power1.out',
        onUpdate() { heroNum.textContent = obj.val.toFixed(2).replace('.', ','); }
      });
    }

    gsap.set(cards, { opacity: 0, y: 8 });
    gsap.to(cards, { opacity: 1, y: 0, duration: 0.35, stagger: 0.15, delay: 0.8, ease: 'power2.out' });

    function advance() {
      if (state >= maxState) return false;
      state++;
      if (state === 1) gsap.to(sourceTag, { opacity: 1, duration: 0.4 });
      return true;
    }

    function retreat() {
      if (state <= 0) return false;
      if (state === 1) gsap.to(sourceTag, { opacity: 0, duration: 0.3 });
      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-rule5 — Rule-of-5 + Antonio plotado
     States: 0=zones stagger (auto), 1=Antonio highlight, 2=source
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-rule5': (slide, gsap) => {
    let state = 0;
    const maxState = 2;

    const ruleOf5 = slide.querySelector('.rule-of-5');
    const zones = slide.querySelectorAll('.rule-zone');
    const grayZone = slide.querySelector('.rule-gray-zone');
    const antonioPlot = slide.querySelector('.antonio-plot');
    const antonioPin = slide.querySelector('.antonio-pin');
    const caveats = slide.querySelector('.rule-caveats');
    const banner = slide.querySelector('.rule-conclusion-banner');
    const sourceTag = slide.querySelector('.source-tag');

    gsap.set(zones, { scaleY: 0, opacity: 1 });
    if (ruleOf5) gsap.set(ruleOf5, { opacity: 1 });

    gsap.to(zones, {
      scaleY: 1,
      duration: 0.5, stagger: 0.15, delay: 0.4,
      ease: 'power2.out',
    });

    if (grayZone) {
      gsap.to(grayZone, { opacity: 1, duration: 0.5, delay: 0.4 + zones.length * 0.15 + 0.3 });
    }

    function advance() {
      if (state >= maxState) return false;
      state++;

      if (state === 1) {
        const targetZone = slide.querySelector('[data-zone-idx="3"]');
        if (targetZone) targetZone.classList.add('rule-zone--highlighted');

        gsap.to(antonioPlot, { opacity: 1, duration: 0.4 });

        if (antonioPin) {
          gsap.fromTo(antonioPin,
            { y: -40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: 'back.out(1.4)' }
          );
        }

        if (caveats) gsap.to(caveats, { opacity: 1, duration: 0.4, delay: 0.8 });
        if (banner) gsap.to(banner, { opacity: 1, duration: 0.4, delay: 1.2 });
      }

      if (state === 2) {
        gsap.to(sourceTag, { opacity: 1, duration: 0.4 });
      }

      return true;
    }

    function retreat() {
      if (state <= 0) return false;

      if (state === 2) {
        gsap.to(sourceTag, { opacity: 0, duration: 0.3 });
      }

      if (state === 1) {
        const targetZone = slide.querySelector('[data-zone-idx="3"]');
        if (targetZone) targetZone.classList.remove('rule-zone--highlighted');
        gsap.to(antonioPlot, { opacity: 0, duration: 0.3 });
        if (caveats) gsap.to(caveats, { opacity: 0, duration: 0.3 });
        if (banner) gsap.to(banner, { opacity: 0, duration: 0.3 });
      }

      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
  },

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     s-a1-meld — MELD-Na semáforo + threshold
     States: 0=bands stagger (auto), 1=threshold line, 2=source
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  's-a1-meld': (slide, gsap) => {
    let state = 0;
    const maxState = 2;

    const bands = slide.querySelectorAll('.meld-band');
    const threshold = slide.querySelector('.meld-threshold');
    const sourceTag = slide.querySelector('.source-tag');

    gsap.set(bands, { opacity: 0, y: 12 });
    gsap.to(bands, { opacity: 1, y: 0, duration: 0.4, stagger: 0.15, delay: 0.3, ease: 'power2.out' });

    function advance() {
      if (state >= maxState) return false;
      state++;
      if (state === 1 && threshold) {
        gsap.to(threshold, { width: '100%', duration: 0.8, ease: 'power2.out' });
      }
      if (state === 2) {
        gsap.to(sourceTag, { opacity: 1, duration: 0.4 });
      }
      return true;
    }

    function retreat() {
      if (state <= 0) return false;
      if (state === 2) gsap.to(sourceTag, { opacity: 0, duration: 0.3 });
      if (state === 1 && threshold) gsap.to(threshold, { width: 0, duration: 0.3 });
      state--;
      return true;
    }

    slide.__hookAdvance = advance;
    slide.__hookRetreat = retreat;
    slide.__hookCurrentBeat = () => state;
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

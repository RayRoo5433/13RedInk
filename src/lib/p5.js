// Persona 5 style motion: hard skewed slams instead of soft fades.
import { gsap } from "$lib/gsap";

/** alternating resting tilt for a run of cards, like flash pinned to a wall */
export const tilt = (/** @type {number} */ i) => (i % 2 ? 1.2 : -1.4);

/**
 * Slams targets in from the side, skewed and over-rotated, snapping square on
 * landing. Animate a wrapper rather than a Card itself so it doesn't fight the
 * card's own tilt. Extra gsap vars (scrollTrigger, delay...) pass through.
 * @param {gsap.TweenTarget} targets
 * @param {{ from?: "left" | "right" } & gsap.TweenVars} [options]
 */
export function slamIn(targets, { from = "left", ...vars } = {}) {
  const dir = from === "left" ? -1 : 1;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return gsap.from(targets, { opacity: 0, duration: 0.3, ...vars });
  }
  return gsap.from(targets, {
    xPercent: 140 * dir,
    skewX: 30 * dir,
    rotation: 8 * dir,
    duration: 0.7,
    ease: "expo.out",
    stagger: 0.07,
    clearProps: "transform",
    ...vars,
  });
}

// where dropIn starts each card: above its slot, turned a little
const dropStart = {
  yPercent: -180,
  rotation: (/** @type {number} */ i) => (i % 2 ? 12 : -12),
  skewX: 0,
};

/**
 * Parks targets where dropIn starts them, out of sight above, so they can
 * wait there until it's time to drop.
 * @param {gsap.TweenTarget} targets
 */
export const primeDrop = (targets) => gsap.set(targets, dropStart);

/**
 * Drops targets in from above, spinning slightly and landing with a little
 * overshoot, then each one kicks into a hard skew and snaps back as it lands.
 * fromTo with overwrite, so calling it again mid-drop restarts cleanly rather
 * than starting from wherever the last drop had got to. Like slamIn, animate
 * a wrapper rather than the Card itself.
 * @param {gsap.TweenTarget} targets
 * @param {gsap.TimelineVars} [vars] passed to the timeline (scrollTrigger, delay...)
 */
export function dropIn(targets, vars = {}) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return gsap
      .timeline(vars)
      .fromTo(targets, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  }
  const stagger = 0.09;
  const fall = 0.75;
  return (
    gsap
      .timeline(vars)
      .fromTo(targets, dropStart, {
        yPercent: 0,
        rotation: 0,
        duration: fall,
        ease: "back.out(1.6)",
        stagger,
        overwrite: true,
      })
      // the skew kick follows each card's landing, so it shares the stagger
      .to(
        targets,
        { skewX: -14, duration: 0.12, ease: "power2.out", stagger },
        fall - 0.2,
      )
      .to(
        targets,
        { skewX: 0, duration: 0.6, ease: "elastic.out(1, 0.4)", stagger },
        fall - 0.08,
      )
  );
}

import { gsap, reducedMotion } from "$lib/gsap";

export const tilt = (/** @type {number} */ i) => (i % 2 ? 1.2 : -1.4);

/**
 * Slams in from the side, skewed, and snaps square.
 * @param {gsap.TweenTarget} targets
 * @param {{ from?: "left" | "right" } & gsap.TweenVars} [options]
 */
export function slamIn(targets, { from = "left", ...vars } = {}) {
  if (reducedMotion()) {
    return gsap.from(targets, { opacity: 0, duration: 0.3, ...vars });
  }
  const dir = from === "left" ? -1 : 1;
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

const dropStart = {
  yPercent: -180,
  rotation: (/** @type {number} */ i) => (i % 2 ? 12 : -12),
  skewX: 0,
};

/** Parks targets above, where dropIn starts them. @param {gsap.TweenTarget} targets */
export const primeDrop = (targets) => gsap.set(targets, dropStart);

/**
 * Kicks each target into a hard skew and springs it back, starting at `at`.
 * @param {gsap.core.Timeline} tl
 * @param {gsap.TweenTarget} targets
 * @param {number} at
 * @param {number} stagger
 */
function kick(tl, targets, at, stagger) {
  return tl
    .to(targets, { skewX: -14, duration: 0.12, ease: "power2.out", stagger }, at)
    .to(targets, { skewX: 0, duration: 0.6, ease: "elastic.out(1, 0.4)", stagger }, at + 0.12);
}

/**
 * Falls in from above, then kicks into a skew and springs back.
 * @param {gsap.TweenTarget} targets
 * @param {gsap.TimelineVars} [vars]
 */
export function dropIn(targets, vars = {}) {
  if (reducedMotion()) {
    return gsap.timeline(vars).fromTo(targets, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  }
  const stagger = 0.09;
  const fall = 0.75;
  const tl = gsap.timeline(vars).fromTo(targets, dropStart, {
    yPercent: 0,
    rotation: 0,
    duration: fall,
    ease: "back.out(1.6)",
    stagger,
    overwrite: true,
  });
  return kick(tl, targets, fall - 0.2, stagger);
}

/**
 * Slides in from off the left edge, then kicks into a skew and springs back.
 * @param {gsap.TweenTarget} targets
 * @param {gsap.TimelineVars} [vars]
 */
export function slideIn(targets, vars = {}) {
  if (reducedMotion()) {
    return gsap.timeline(vars).from(targets, { opacity: 0, duration: 0.3 });
  }
  const stagger = 0.09;
  const travel = 0.9;
  const tl = gsap
    .timeline(vars)
    .from(targets, { x: "-100vw", duration: travel, ease: "expo.out", stagger });
  return kick(tl, targets, travel - 0.35, stagger);
}

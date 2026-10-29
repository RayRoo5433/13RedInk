import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { browser } from "$app/environment";

if (browser) {
  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
  // pages scroll inside the layout's <content>, not the window
  ScrollTrigger.defaults({ scroller: "content" });
  CustomEase.create("hop", "M0,0 C0.8,0 0.02,1 1,1");
}

export const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** @type {Set<gsap.core.Animation>} */
const intros = new Set();

/**
 * Registers a page's intro animations so they can be played backwards on leave.
 * @param {gsap.core.Animation[]} animations
 */
export function trackIntro(...animations) {
  for (const animation of animations) intros.add(animation);
  return () => {
    for (const animation of animations) intros.delete(animation);
  };
}

/** Plays every tracked intro backwards, each taking at most `max` seconds. */
export function reverseIntros(max = 0.6) {
  return Promise.all(
    [...intros].map(
      (animation) =>
        new Promise((resolve) => {
          const time = animation.time();
          if (!time) return resolve(undefined);
          animation.eventCallback("onReverseComplete", resolve);
          animation.timeScale(Math.max(1, time / max)).reverse();
        }),
    ),
  );
}

export { gsap, ScrollTrigger, CustomEase, SplitText };
export default gsap;

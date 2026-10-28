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

export { gsap, ScrollTrigger, CustomEase, SplitText };
export default gsap;

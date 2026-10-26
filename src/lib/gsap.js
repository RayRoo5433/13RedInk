// Shared GSAP setup: import gsap and its plugins from "$lib/gsap" so they're
// always registered, e.g. import { gsap, ScrollTrigger } from "$lib/gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { browser } from "$app/environment";

if (browser) {
  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);

  // the page scrolls inside the layout's <content>, not the window
  // (body is overflow: hidden), so point every trigger at it by default
  ScrollTrigger.defaults({ scroller: "content" });

  // use anywhere as ease: "hop" — cubic-bezier(0.8, 0, 0.02, 1)
  CustomEase.create("hop", "M0,0 C0.8,0 0.02,1 1,1");
}

export { gsap, ScrollTrigger, CustomEase, SplitText };
export default gsap;

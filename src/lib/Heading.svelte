<script>
  import { gsap } from "$lib/gsap";
  let { children, style = "" } = $props();
  let text;

  $effect(() => {
    // rises out of the overflow-hidden wrapper when it scrolls into view;
    // leads the Paragraph under it, which starts a beat later
    const tween = gsap.from(text, {
      yPercent: 110,
      duration: 1.1,
      ease: "hop",
      scrollTrigger: { trigger: text.parentElement, start: "top 85%" },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });
</script>

<div>
  <h1 {style} bind:this={text}>
    {@render children()}
  </h1>
</div>

<style>
  div {
    overflow: hidden;
    height: fit-content;
    /* room inside the mask for the drop shadow */
    padding: 0 6px 6px 0;
  }

  /* red with an ink outline and a hard ink drop, like the cards */
  h1 {
    margin: 0;
    color: var(--red);
    -webkit-text-stroke: 1.5px var(--ink);
    text-shadow: 5px 5px 0 var(--ink);
  }
</style>

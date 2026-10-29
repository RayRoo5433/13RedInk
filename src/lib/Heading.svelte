<script>
  import { gsap, trackIntro } from "$lib/gsap";

  let { children, style = "" } = $props();

  /** @type {HTMLElement} */
  let text;

  $effect(() => {
    const tween = gsap.from(text, {
      yPercent: 110,
      duration: 1.1,
      ease: "hop",
      scrollTrigger: { trigger: text.parentElement, start: "top 85%" },
    });

    const untrack = trackIntro(tween);

    return () => {
      untrack();
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });
</script>

<div class="mask">
  <h1 {style} bind:this={text}>{@render children()}</h1>
</div>

<style>
  .mask {
    overflow: hidden;
    padding: 0 6px 6px 0;
  }

  h1 {
    margin: 0;
    color: var(--red);
    font-family: "Graduate";
    font-weight: 600;
    -webkit-text-stroke: 0.5rem var(--ink);
    paint-order: stroke fill;
  }
</style>

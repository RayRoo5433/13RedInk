<script>
  import { gsap } from "$lib/gsap";
  let { children } = $props();
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
  <h1 bind:this={text}>
    {@render children()}
  </h1>
</div>

<style>
  div {
    overflow: hidden;
    height: fit-content;
  }

  h1 {
    margin: 0;
  }
</style>

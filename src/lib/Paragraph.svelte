<script>
  import { gsap, SplitText, trackIntro } from "$lib/gsap";

  let { children, style = "", start = "top 85%" } = $props();

  /** @type {HTMLElement} */
  let text;

  $effect(() => {
    const split = SplitText.create(text, { type: "words", mask: "words" });
    gsap.set(text, { visibility: "visible" });

    const tween = gsap.from(split.words, {
      yPercent: 110,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.05,
      delay: 0.25,
      scrollTrigger: { trigger: text, start },
    });

    const stopIntro = trackIntro(tween);

    return () => {
      stopIntro();
      split.revert();
    };
  });
</script>

<p {style} bind:this={text}>{@render children()}</p>

<style>
  p {
    visibility: hidden;
  }
</style>

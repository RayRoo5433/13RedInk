<script>
  import { gsap, SplitText } from "$lib/gsap";
  let { children, style = "" } = $props();
  let text;

  $effect(() => {
    // each word sits in its own mask and rises up out of it, one after another,
    // once the paragraph scrolls into view
    const split = SplitText.create(text, { type: "words", mask: "words" });
    gsap.set(text, { visibility: "visible" });

    // a quick out-ease suits lots of small words better than hop, whose
    // slow start makes each word look like it's waiting its turn
    const tween = gsap.from(split.words, {
      yPercent: 110,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.05,
      // lets a Heading above land its first move before the words start
      delay: 0.25,
      scrollTrigger: { trigger: text, start: "top 85%" },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  });
</script>

<p {style} bind:this={text}>{@render children()}</p>

<style>
  p {
    /* hidden until split, so the words don't flash in place before animating */
    visibility: hidden;
  }
</style>

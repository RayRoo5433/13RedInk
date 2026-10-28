<script>
  import { gsap } from "$lib/gsap";

  let { src, alt = "", delay = 0 } = $props();

  /** @type {HTMLElement} */
  let root;
  /** @type {HTMLElement} */
  let frame;
  /** @type {HTMLElement} */
  let img;
  /** @type {HTMLElement} */
  let shadow;

  $effect(() => {
    const tl = gsap
      .timeline({
        scrollTrigger: { trigger: frame, start: "top 85%" },
        defaults: { ease: "hop" },
        delay,
      })
      .to(frame, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.4,
      })
      .fromTo(img, { scale: 1.4 }, { scale: 1, duration: 2.2 }, 0)
      .fromTo(
        root,
        { skewX: -12, rotation: -3 },
        { skewX: 0, rotation: 0, duration: 1.4, ease: "expo.out" },
        0,
      )
      .fromTo(shadow, { x: 0, y: 0 }, { x: 9, y: 9, duration: 0.4, ease: "power3.out" }, 1.2);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });
</script>

<div bind:this={root} class="image">
  <div bind:this={shadow} class="shadow"></div>
  <div bind:this={frame} class="frame">
    <img bind:this={img} {src} {alt} />
  </div>
</div>

<style>
  .image {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .shadow {
    position: absolute;
    inset: 0;
    background-color: var(--ink);
  }

  .frame {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 3px solid var(--ink);
    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>

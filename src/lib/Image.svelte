<script>
  import { gsap, trackIntro } from "$lib/gsap";

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
    // the shadow opens from its centre (width, then height), then the image wipes up over it
    const tl = gsap
      .timeline({
        scrollTrigger: { trigger: frame, start: "top 85%" },
        defaults: { ease: "hop" },
        delay,
      })
      .fromTo(
        shadow,
        { clipPath: "inset(49.25% 50% 49.25% 50%)" },
        { clipPath: "inset(49.25% 0% 49.25% 0%)", duration: 0.6, ease: "power2.inOut" },
      )
      .fromTo(
        shadow,
        { clipPath: "inset(49.25% 0% 49.25% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.6,
          ease: "power2.inOut",
          immediateRender: false,
        },
      )
      .addLabel("image")
      .to(frame, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1.4 }, "image")
      .fromTo(img, { scale: 1.4 }, { scale: 1, duration: 2.2 }, "image")
      .fromTo(
        root,
        { skewX: -12, rotation: -3 },
        { skewX: 0, rotation: 0, duration: 1.4, ease: "expo.out" },
        "image",
      );

    const untrack = trackIntro(tl);

    return () => {
      untrack();
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
    transform: translate(9px, 9px);
    clip-path: inset(49.25% 50% 49.25% 50%);
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

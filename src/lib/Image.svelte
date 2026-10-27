<script>
  import { gsap } from "$lib/gsap";
  let { src, alt = "", classname = "", delay = 0 } = $props();
  let root;
  let frame;
  let img;
  let shadow;

  $effect(() => {
    // as the frame scrolls into view it wipes open from the bottom while the
    // image zooms out; the zoom runs longer so it keeps settling after the
    // wipe lands. It starts skewed and falls square as it opens, then the
    // drop shadow slides out from under it. One timeline so it all shares a
    // single trigger
    const tl = gsap
      .timeline({
        scrollTrigger: { trigger: frame, start: "top 85%" },
        defaults: { ease: "hop" },
        // stagger images that sit together, e.g. the about page's pair
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
      .fromTo(
        shadow,
        { x: 0, y: 0 },
        { x: 9, y: 9, duration: 0.4, ease: "power3.out" },
        1.2,
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });
</script>

<div bind:this={root} class="image {classname}">
  <div bind:this={shadow} class="shadow" aria-hidden="true"></div>
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

  /* hard drop shadow, tucked under the frame until the wipe lands */
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
    /* the outline is inside the frame so it wipes open with the image */
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

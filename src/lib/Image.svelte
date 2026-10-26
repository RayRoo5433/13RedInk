<script>
  import { gsap } from "$lib/gsap";
  let { src, alt = "", classname = "", delay = 0 } = $props();
  let frame;
  let img;

  $effect(() => {
    // as the frame scrolls into view it wipes open from the bottom while the
    // image zooms out; the zoom runs longer so it keeps settling after the
    // wipe lands; one timeline so both share a single trigger
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
      .fromTo(img, { scale: 1.4 }, { scale: 1, duration: 2.2 }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });
</script>

<div bind:this={frame} class="frame {classname}">
  <img bind:this={img} {src} {alt} />
</div>

<style>
  .frame {
    width: 100%;
    height: 100%;
    overflow: hidden;
    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>

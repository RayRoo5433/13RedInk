<script>
  import { goto } from "$app/navigation";
  import gsap from "gsap";

  let { children, href } = $props();

  let shadow;
  let tween;

  $effect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // paused so it only plays on hover/focus, tucking the shadow behind the button;
    // reverse() brings it back out to the CSS state
    tween = gsap.to(shadow, {
      x: 0,
      y: 0,
      opacity: 0,
      duration: reduceMotion ? 0 : 0.35,
      ease: "power3.out",
      paused: true,
    });
    return () => tween.kill();
  });

  const show = () => tween?.play();
  const hide = () => tween?.reverse();
</script>

<button
  onclick={() => goto(href)}
  onmouseenter={show}
  onmouseleave={hide}
  onfocus={show}
  onblur={hide}
>
  {@render children()}
  <span bind:this={shadow} aria-hidden="true"></span>
</button>

<style>
  button {
    /* anchors the shadow; no transform or z-index here or the shadow ends up on top */
    position: relative;
    border: 0.1rem solid var(--primary);
    background-color: var(--secondary);
    border-radius: 2rem;
    cursor: pointer;

    span {
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: 2rem;
      background-color: var(--primary);
      /* visible by default, hover slides it back under the button */
      transform: translate(-0.3rem, 0.3rem);
      pointer-events: none;
    }
  }
</style>

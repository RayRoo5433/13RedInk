<script>
  import { goto } from "$app/navigation";
  import gsap from "gsap";

  let tween;
  let shadow;

  $effect(() => {
    tween = gsap.from(shadow, {
      x: "-0.25rem",
      y: "0.2rem",
      scale: 1.1,
      opacity: 1,
      duration: 0.5,
      ease: "power3.in",
    });
  });
  let { children, href } = $props();
</script>

<button
  onclick={() => goto(href)}
  onmouseenter={() => tween.play()}
  onmouseleave={() => {
    tween.reverse();
  }}
>
  {@render children()}
  <span bind:this={shadow}></span>
</button>

<style>
  button {
    position: relative;
    border: 0.2rem solid black;
    background-color: #ff7463;
    border-radius: 2rem;
    /* transition: all 0.3s ease-in-out; */
    span {
      position: absolute;

      border-radius: 2rem;
      inset: 0;
      z-index: -1;
      background-color: black;
      width: 100%;
      height: 100%;
      opacity: 0%;
    }
  }
</style>

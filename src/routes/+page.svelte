<script>
  // film grain can maybe be added to the image. I'm picturing a really nice Gothic Font used with Red exclusively in Red...
  import Button from "$lib/Button.svelte";
  import Logo from "$lib/Logo.svelte";
  import Paragraph from "$lib/Paragraph.svelte";
  import Reviews from "$lib/Reviews.svelte";
  import { address } from "$lib/studio";
  import { CustomEase, gsap, reducedMotion, trackIntro } from "$lib/gsap";

  /** @type {HTMLElement} */
  let burst;
  /** @type {HTMLElement} */
  let intro;
  /** @type {(() => void) | undefined} */
  let stopIntro;
  let shown = $state(false);

  function showIntro() {
    if (stopIntro) return;
    shown = true;
    const halo = gsap.fromTo(
      burst,
      { autoAlpha: 0, scale: 0.7, rotation: -20 },
      {
        autoAlpha: 1,
        scale: 1,
        rotation: 0,
        duration: reducedMotion() ? 0 : 6,
        ease: CustomEase.create("burst", "M0,0 C0.2,0.8 0.2,1 1,1"),
      },
    );
    const details = gsap.fromTo(
      intro.querySelectorAll(".actions > span"),
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.1 },
    );
    stopIntro = trackIntro(halo, details);
  }

  $effect(() => {
    gsap.set(burst, { xPercent: -50, yPercent: -50 });
    return () => stopIntro?.();
  });
</script>

<div class="hero">
  <div class="halo" aria-hidden="true">
    <div class="burst" bind:this={burst}>
      <div class="rays wide"></div>
      <!-- <div class="rays fine"></div> -->
    </div>
  </div>

  <div class="top">
    <div class="logo">
      <Logo onshow={showIntro} />
    </div>
    <div class="intro" bind:this={intro}>
      <div class="address">
        {#if shown}
          <Paragraph start="top bottom">{address}</Paragraph>
        {/if}
      </div>
      <div class="actions">
        <span><Button href="/contact">Book a consult</Button></span>
        <span><Button href="/artists" tone="cream">Meet the artists</Button></span>
      </div>
    </div>
  </div>

  <div class="reviews">
    <Reviews />
  </div>
</div>

<style>
  .hero {
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    grid-template-columns: minmax(0, 1fr);
    height: 100%;
    overflow: hidden;
  }

  .halo,
  .top {
    grid-area: 1 / 1;
    position: relative;
  }

  .top {
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 0;
    padding: 2rem 2rem 2.5rem;
  }

  .logo {
    flex: 1;
    min-height: 0;
  }

  .intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .actions > span {
    visibility: hidden;
  }

  .address {
    min-height: 1.5em;
    font-size: clamp(1rem, 1.6vw, 1.3rem);

    :global(p) {
      margin: 0;
      color: var(--ink);
      font-family: "Archivo", sans-serif;
      font-weight: 900;
      letter-spacing: 0.04em;
      line-height: 1.5;
      text-align: center;
      text-transform: uppercase;
    }
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
  }

  .reviews {
    grid-area: 2 / 1;
    position: relative;
    z-index: 1;
  }

  .halo {
    pointer-events: none;
  }

  .burst {
    position: absolute;
    left: 50%;
    top: 50%;
    width: max(130vmin, 56rem);
    aspect-ratio: 1;
    mask-image: radial-gradient(
      circle,
      transparent 0 15%,
      #000 15.5% 30%,
      transparent 55%
    );
    visibility: hidden;
  }

  .rays {
    position: absolute;
    inset: 0;
    border-radius: 50%;
  }

  /* hard-edged ink lines; two layers with mismatched spacing so the gaps look irregular */
  .wide {
    background: repeating-conic-gradient(
      var(--ink) 0deg 1.2deg,
      transparent 1.2deg 9deg
    );
    animation: spin 160s linear infinite;
  }

  .fine {
    background: repeating-conic-gradient(
      from 4deg,
      var(--ink) 0deg 0.5deg,
      transparent 0.5deg 13deg
    );
    animation: spin 240s linear infinite reverse;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .rays {
      animation: none;
    }
  }
</style>

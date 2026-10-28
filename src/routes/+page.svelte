<script>
  // film grain can maybe be added to the image. I'm picturing a really nice Gothic Font used with Red exclusively in Red...
  import Logo from "$lib/Logo.svelte";
  import Reviews from "$lib/Reviews.svelte";

  let logoShown = $state(false);
</script>

<div class="hero">
  <div class="halo" class:on={logoShown} aria-hidden="true">
    <div class="burst">
      <div class="rays wide"></div>
      <!-- <div class="rays fine"></div> -->
    </div>
  </div>

  <div class="logo">
    <Logo onshow={() => (logoShown = true)} />
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
  .logo {
    grid-area: 1 / 1;
    position: relative;
  }

  .logo {
    z-index: 2;
    min-height: 0;
    padding: 2rem;
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
    transform: translate(-50%, -50%);
    mask-image: radial-gradient(
      circle,
      transparent 0 15%,
      #000 15.5% 30%,
      transparent 55%
    );
    opacity: 0;
  }

  .on .burst {
    opacity: 1;
    animation: burst-in 6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
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

  @keyframes burst-in {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.7) rotate(-20deg);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .on .burst,
    .rays {
      animation: none;
    }
  }
</style>

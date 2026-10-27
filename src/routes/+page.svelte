<script>
  // film grain can maybe be added to the image. I'm picturing a really nice Gothic Font used with Red exclusively in Red...
  import "../app.css";
  import Reviews from "../lib/Reviews.svelte";
  import TextPressure from "../lib/TextPressure.svelte";
  import Logo from "../lib/Logo.svelte";
</script>

<div id="hero">
  <!-- light streaks fanning out from behind the logo, like the sunburst on
       old flash sheets -->
  <div class="halo" aria-hidden="true">
    <div class="burst">
      <div class="rays wide"></div>
      <div class="rays fine"></div>
    </div>
  </div>
  <div class="title">
    <!-- <TextPressure text="RED 13 INK" /> -->
    <div class="logo">
      <Logo />
    </div>
  </div>
  <div class="reviews">
    <Reviews />
  </div>
</div>

<style>
  #hero {
    position: relative;
    display: grid;
    /* row 1 takes whatever space the reviews leave over, so the h1 centers in it */
    grid-template-rows: minmax(0, 1fr) auto;
    /* stop the wide reviews strip from stretching the column (and pushing the h1 off-screen) */
    grid-template-columns: minmax(0, 1fr);
    /* fill the scroll area so the red reviews band sits on the bottom edge */
    height: 100%;
    overflow: hidden;

    .title {
      grid-area: 1 / 1;
      position: relative;
      /* lets the 1fr row shrink below the logo's natural size */
      min-height: 0;
      padding: 2rem;
      z-index: 80;
    }

    .logo {
      width: 100%;
      height: 100%;
    }

    .reviews {
      grid-area: 2 / 1;
      position: relative;
      z-index: 1;
    }
  }

  .halo {
    grid-area: 1 / 1;
    position: relative;
    z-index: 0;
    pointer-events: none;
  }

  /* a big square centred on the logo; the mask leaves a clear hole where the
     logo sits, peaks just outside it and fades the streaks out to nothing */
  .burst {
    position: absolute;
    left: 50%;
    top: 50%;
    width: max(130vmin, 56rem);
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    mask-image: radial-gradient(
      circle,
      transparent 0 14%,
      #000 22%,
      rgb(0 0 0 / 0.55) 34%,
      transparent 58%
    );
    animation: burst-in 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }

  .rays {
    position: absolute;
    inset: 0;
    border-radius: 50%;
  }

  /* each streak is soft-edged (fades up and back down across its width) and
     the two layers have periods that don't line up, so the spacing reads as
     irregular rather than a pattern. Colour is the site cream, --cream */
  .wide {
    background: repeating-conic-gradient(
      from 0deg,
      rgb(241 231 208 / 0) 0deg,
      rgb(241 231 208 / 0.6) 1.1deg,
      rgb(241 231 208 / 0) 2.4deg,
      transparent 2.4deg 9deg
    );
    animation: spin 160s linear infinite;
  }

  .fine {
    background: repeating-conic-gradient(
      from 3deg,
      transparent 0deg 4deg,
      rgb(241 231 208 / 0.35) 4.5deg,
      transparent 5.2deg 13deg
    );
    filter: blur(0.5px);
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
    .burst,
    .rays {
      animation: none;
    }
  }
</style>

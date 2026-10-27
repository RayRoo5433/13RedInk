<script>
  // film grain can maybe be added to the image. I'm picturing a really nice Gothic Font used with Red exclusively in Red...
  import "../app.css";
  import Reviews from "../lib/Reviews.svelte";
  import TextPressure from "../lib/TextPressure.svelte";
  import Logo from "../lib/Logo.svelte";
  import { gsap } from "$lib/gsap";
  import { addressLines, hours } from "$lib/studio";

  const [street, city, postcode] = addressLines;
  const openDays = hours.filter((h) => h.open);
  const openRange = `${openDays[0].day}–${openDays.at(-1).day}`;

  /** @type {HTMLElement} */
  let location;

  $effect(() => {
    // rises out of its masks just after the reviews line starts drawing in
    const tween = gsap.from(location.querySelectorAll(".rise"), {
      yPercent: 110,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.05,
      delay: 0.4,
    });

    return () => tween.kill();
  });
</script>

<div id="hero">
  <div class="title">
    <!-- <TextPressure text="RED 13 INK" /> -->
    <div class="logo">
      <Logo />
    </div>
  </div>
  <div class="reviews">
    <div class="location" bind:this={location}>
      <!-- <p class="city mask"><span class="rise">{city}</span></p> -->
      <dl>
        <div>
          <dt class="mask"><span class="rise">Address</span></dt>
          <dd class="mask"><span class="rise">{street}</span></dd>
          <dd class="mask"><span class="rise">{postcode}</span></dd>
        </div>
        <div>
          <dt class="mask"><span class="rise">Open</span></dt>
          <dd class="mask"><span class="rise">{openRange}</span></dd>
        </div>
      </dl>
      <p class="visit mask">
        <span class="rise"><a href="/contact">Visit us →</a></span>
      </p>
    </div>
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
    height: 85vh;
    /* mobile browsers: ignore the space the address bar takes */
    height: 85dvh;
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

  /* Swiss-style strip: big city name on the left, small facts hung off a
     12-column grid on the right, everything sitting on one baseline */
  .location {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: 1rem;
    align-items: end;
    padding-bottom: 0.5rem;

    .city {
      grid-column: 1 / 7;
      margin: 0;
      font-size: clamp(2.5rem, 7vw, 6rem);
      font-weight: 800;
      line-height: 0.85;
      letter-spacing: -0.04em;
    }

    dl {
      grid-column: 1 / 11;
      display: grid;
      grid-template-columns: 2fr 1fr;
      column-gap: 1rem;
      margin: 0;
      font-size: 1rem;
      line-height: 1.2;
    }

    dt {
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    dd {
      margin: 0;
      font-weight: 200;
    }

    .visit {
      grid-column: 11 / 13;
      margin: 0;
      font-size: 1rem;
      line-height: 1.2;
      text-align: right;
    }

    a {
      text-decoration: none;
      font-weight: 400;
      border-bottom: 1px solid currentColor;
    }
    a:hover {
      border-bottom-color: transparent;
    }
  }

  .mask {
    display: block;
    overflow: hidden;
  }
  .rise {
    display: block;
  }

  /* tablet and down: city on its own line, facts in a row under it */
  @media (max-width: 900px) {
    .location {
      row-gap: 0.75rem;

      .city {
        grid-column: 1 / 13;
      }
      dl {
        grid-column: 1 / 10;
      }
      .visit {
        grid-column: 10 / 13;
      }
    }
  }

  @media (max-width: 600px) {
    .location dl,
    .location .visit {
      font-size: 0.85rem;
    }
  }
</style>

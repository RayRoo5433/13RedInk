<script>
  import { onMount } from "svelte";
  import moment from "moment";
  import Card from "./Card.svelte";
  import Rating from "./Rating.svelte";
  import { gsap, reducedMotion } from "$lib/gsap";
  import { dropIn, primeDrop, tilt } from "$lib/p5";

  const SPEED = 50;

  /** @type {any[]} */
  let reviews = $state([]);

  /** @type {HTMLHRElement} */
  let line;
  /** @type {HTMLElement} */
  let band;
  /** @type {HTMLElement} */
  let row;

  onMount(async () => {
    gsap.from(line, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.2,
      ease: "power3.inOut",
    });

    const response = await fetch("/api/reviews");
    /** @type {any[]} */
    const sorted = (await response.json()).sort((/** @type {any} */ a, /** @type {any} */ b) => b.date - a.date);

    // repeat until the row is wider than the screen so wrapped cards come back off-screen
    const cardWidth = Math.min(320, window.innerWidth * 0.8) + 32;
    const repeats = Math.max(
      2,
      Math.ceil((window.innerWidth + cardWidth * 2) / (sorted.length * cardWidth)),
    );
    reviews = Array.from({ length: repeats }, () => sorted).flat();
  });

  $effect(() => {
    if (!reviews.length) return;

    const slots = /** @type {HTMLElement[]} */ ([...row.querySelectorAll(".slot")]);
    const setX = slots.map((slot) => gsap.quickSetter(slot, "x", "px"));

    /** @type {number[]} */
    let lefts = [];
    /** @type {number[]} */
    let widths = [];
    let total = 0;
    const measure = () => {
      lefts = slots.map((slot) => slot.offsetLeft);
      widths = slots.map((slot) => slot.offsetWidth);
      const gap = lefts[1] - lefts[0] - widths[0];
      total = lefts[lefts.length - 1] + widths[widths.length - 1] + gap - lefts[0];
    };
    measure();

    const at = [...lefts];
    const waiting = slots.map(() => false);
    const inView = (/** @type {number} */ i) => at[i] + widths[i] <= band.clientWidth;

    // each card wraps on its own; a wrapped card waits above and drops once fully in view
    const scroll = { by: 0 };
    const place = () => {
      slots.forEach((slot, i) => {
        const x = gsap.utils.wrap(-widths[i], total - widths[i], lefts[i] - scroll.by);
        if (x > at[i] + 1) {
          waiting[i] = true;
          primeDrop(slot);
        }
        at[i] = x;
        setX[i](x - lefts[i]);
        if (waiting[i] && inView(i)) {
          waiting[i] = false;
          dropIn(slot);
        }
      });
    };

    const marquee = gsap.to(scroll, {
      by: () => total,
      duration: total / SPEED,
      ease: "none",
      repeat: -1,
      paused: true,
      onUpdate: place,
    });

    const slowDown = () => gsap.to(marquee, { timeScale: 0, duration: 0.4, overwrite: true });
    const speedUp = () => gsap.to(marquee, { timeScale: 1, duration: 0.4, overwrite: true });
    row.addEventListener("mouseenter", slowDown);
    row.addEventListener("mouseleave", speedUp);

    const observer = new ResizeObserver(() => {
      const progress = marquee.progress();
      measure();
      marquee.invalidate().duration(total / SPEED).progress(progress);
      place();
    });
    observer.observe(row);

    const visible = slots.filter((_, i) => inView(i));
    if (!reducedMotion()) {
      slots.forEach((slot, i) => {
        if (inView(i)) return;
        waiting[i] = true;
        primeDrop(slot);
      });
    }

    const intro = gsap
      .timeline({ onComplete: () => !reducedMotion() && marquee.play() })
      .from(band, { height: 0, duration: 0.8, ease: "power3.inOut", clearProps: "height" })
      .add(dropIn(visible), "-=0.15");

    return () => {
      intro.kill();
      marquee.kill();
      observer.disconnect();
      row.removeEventListener("mouseenter", slowDown);
      row.removeEventListener("mouseleave", speedUp);
    };
  });
</script>

<section>
  <hr bind:this={line} />
  <div class="band" bind:this={band}>
    <div class="row" bind:this={row}>
      {#each reviews as review, i}
        <div class="slot">
          <Card tilt={tilt(i)} interactive>
            <article class="review">
              <Rating score={5} />
              <p>{review.text}</p>
              <footer>
                <img src={review.photo} alt="" />
                <div>
                  <h3>{review.name}</h3>
                  <span>{moment(review.date).fromNow()}</span>
                </div>
              </footer>
            </article>
          </Card>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .band {
    overflow: hidden;
    background-color: var(--red);
  }

  .row {
    position: relative;
    display: flex;
    width: max-content;
    gap: 2rem;
    padding: 2rem 1rem 1.5rem;
  }

  .slot {
    flex-shrink: 0;
    width: min(20rem, 80vw);
  }

  .review {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    padding: 1rem 1.25rem;
    font-size: 1rem;

    p {
      display: -webkit-box;
      margin: 0.5rem 0 0.75rem;
      overflow: hidden;
      line-height: 1.5;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }

    footer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: auto;
    }

    img {
      width: 40px;
      height: 40px;
      border: 2px solid var(--ink);
      border-radius: 50%;
      object-fit: cover;
    }

    div {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    h3 {
      margin: 0;
      font-family: "Graduate", serif;
      font-size: 1rem;
      font-weight: 400;
      color: var(--red);
    }

    span {
      font-size: 0.75rem;
    }
  }
</style>

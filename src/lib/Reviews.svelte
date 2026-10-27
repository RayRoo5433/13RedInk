<script>
  import { onMount } from "svelte";
  import moment from "moment";
  import Rating from "./Rating.svelte";
  import Card from "./Card.svelte";
  import { gsap } from "$lib/gsap";
  import { dropIn, primeDrop, tilt } from "./p5.js";

  // @ts-ignore
  let items = $state([]);

  onMount(async () => {
    const response = await fetch("/api/reviews");
    console.log(response);

    items = await response.json();
    items = items.sort((a, b) => b.date - a.date);
    console.log(items);

    // repeat the list until it's comfortably wider than the screen, so a card
    // wrapping round from the left edge always reappears off the right
    const slotWidth = Math.min(320, window.innerWidth * 0.8) + 32;
    const repeats = Math.max(
      2,
      Math.ceil((window.innerWidth + slotWidth * 2) / (items.length * slotWidth)),
    );
    items = Array.from({ length: repeats }, () => items).flat();
  });

  /** @type {HTMLElement} */
  let container;
  /** @type {HTMLElement} */
  let drawer;
  /** @type {HTMLHRElement} */
  let line;

  onMount(() => {
    gsap.from(line, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.2,
      ease: "power3.inOut",
    });
  });

  // reading items.length makes this re-run once the fetch fills the list
  $effect(() => {
    if (!items.length) return;

    const slots = /** @type {HTMLElement[]} */ ([
      ...container.querySelectorAll(".slot"),
    ]);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // each card's resting spot in the row and width, and the length of the
    // whole row including the gap after the last card; measured once and
    // again on resize rather than every frame
    /** @type {number[]} */
    let lefts = [];
    /** @type {number[]} */
    let widths = [];
    let total = 0;
    const measure = () => {
      lefts = slots.map((slot) => slot.offsetLeft);
      widths = slots.map((slot) => slot.offsetWidth);
      const last = slots.length - 1;
      const gap = lefts[1] - (lefts[0] + widths[0]);
      total = lefts[last] + widths[last] + gap - lefts[0];
    };
    measure();

    // every card scrolls left on its own and, once fully off the left edge,
    // wraps round to the end of the row off the right. A wrapped card waits
    // above the drawer and only drops once it's fully in view
    const scroll = { by: 0 };
    const setX = slots.map((slot) => gsap.quickSetter(slot, "x", "px"));
    const at = slots.map((_, i) => lefts[i]);
    const waiting = slots.map(() => false);
    /** @param {number} i */
    const fullyVisible = (i) => at[i] + widths[i] <= drawer.clientWidth;

    const place = () => {
      slots.forEach((slot, i) => {
        const min = -widths[i];
        const now = gsap.utils.wrap(min, min + total, lefts[i] - scroll.by);
        if (now > at[i] + 1) {
          waiting[i] = true;
          primeDrop(slot);
        }
        at[i] = now;
        setX[i](now - lefts[i]);
        if (waiting[i] && fullyVisible(i)) {
          waiting[i] = false;
          dropIn(slot);
        }
      });
    };

    // a steady 50px a second however long the row is
    const marquee = gsap.to(scroll, {
      by: () => total,
      duration: total / 50,
      ease: "none",
      repeat: -1,
      paused: true,
      onUpdate: place,
    });

    // hovering eases the row to a stop rather than freezing it
    const slowDown = () =>
      gsap.to(marquee, { timeScale: 0, duration: 0.4, overwrite: true });
    const speedUp = () =>
      gsap.to(marquee, { timeScale: 1, duration: 0.4, overwrite: true });
    container.addEventListener("mouseenter", slowDown);
    container.addEventListener("mouseleave", speedUp);

    const observer = new ResizeObserver(() => {
      const progress = marquee.progress();
      measure();
      marquee
        .invalidate()
        .duration(total / 50)
        .progress(progress);
      place();
    });
    observer.observe(container);

    // the cards fully on screen drop with the intro; the rest, including one
    // cut off at the right edge, wait above until they're fully in view
    const shown = slots.filter((_, i) => fullyVisible(i));
    if (!reduceMotion) {
      slots.forEach((slot, i) => {
        if (!fullyVisible(i)) {
          waiting[i] = true;
          primeDrop(slot);
        }
      });
    }

    // the red drawer pushes up from the bottom of the hero first, then the
    // cards fall into it through its top edge; the row starts once they land
    const tl = gsap
      .timeline({
        onComplete: () => {
          if (!reduceMotion) marquee.play();
        },
      })
      .from(drawer, {
        height: 0,
        duration: 0.8,
        ease: "power3.inOut",
        clearProps: "height",
      })
      .add(dropIn(shown), "-=0.15");

    return () => {
      tl.kill();
      marquee.kill();
      observer.disconnect();
      container.removeEventListener("mouseenter", slowDown);
      container.removeEventListener("mouseleave", speedUp);
    };
  });
</script>

<wrapper>
  <hr bind:this={line} />
  <div class="drawer" bind:this={drawer}>
  <container bind:this={container}>
    {#each items as item, i}
      <!-- the slot takes the drop-in so it doesn't fight the card's own tilt -->
      <div class="slot">
        <Card tilt={tilt(i)} interactive>
          <div class="review">
            <Rating score={5} />
            <p>{item.text}</p>
            <section>
              <img src={item.photo} alt="" />
              <div>
                <h1>{item.name}</h1>
                <span>{moment(item.date).fromNow()}</span>
              </div>
            </section>
          </div>
        </Card>
      </div>
    {/each}
  </container>
  </div>
</wrapper>

<style>
  /* custom tags are inline by default, so width/overflow don't apply without this */
  wrapper,
  container {
    display: block;
    box-sizing: border-box;
  }

  wrapper {
    width: 100%;
    height: 100%;
  }

  hr {
    margin: 0;
  }

  /* the red band the marquee runs along; clips the cards as they drop in
     through its top edge */
  .drawer {
    background-color: var(--red);
    overflow: hidden;
  }

  container {
    /* card offsets are measured from here */
    position: relative;
    display: flex;
    width: max-content;
    gap: 2rem;
    /* room for the tilt, the drop shadow and the hover lift */
    padding: 2rem 1rem 1.5rem;
  }

  .slot {
    width: min(20rem, 80vw);
    flex-shrink: 0;
  }

  .review {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem 1.25rem;
    box-sizing: border-box;
    font-size: 1rem;

    /* the Rating's stars */
    > :global(span) {
      color: var(--red);
      font-size: 1.25rem;
      letter-spacing: 3px;
    }

    /* cap long reviews so one essay doesn't set the height of every card */
    p {
      font-weight: 400;
      line-height: 1.5;
      margin: 0.5rem 0 0.75rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
    }

    /* pushed to the bottom of the card so authors line up across cards */
    section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: auto;

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

      h1 {
        margin: 0;
        font-family: "Graduate", serif;
        font-size: 1rem;
        font-weight: 400;
        color: var(--red);
      }

      span {
        font-size: 0.75rem;
        font-weight: 400;
      }
    }
  }

</style>

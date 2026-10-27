<script>
  // Placeholder figures, confirm with the studio
  import Heading from "../../lib/Heading.svelte";
  import Button from "../../lib/Button.svelte";
  import Paragraph from "../../lib/Paragraph.svelte";
  import { gsap } from "$lib/gsap";

  const cards = [
    {
      name: "Shop minimum",
      price: "£50",
      unit: "per tattoo",
      blurb: "Small, simple pieces.",
    },
    {
      name: "Hourly",
      price: "£80",
      unit: "per hour",
      blurb: "Custom work, quoted at consult.",
    },
    {
      name: "Day session",
      price: "£450",
      unit: "up to 6 hours",
      blurb: "Sleeves and big projects.",
    },
    {
      name: "Flash",
      price: "£60",
      unit: "fixed price",
      blurb: "Ready-drawn designs.",
    },
  ];

  /** @type {HTMLElement} */
  let grid;

  $effect(() => {
    // the cards rise in one after another like the review cards, then each
    // price rises out of its mask; the Heading, Paragraph and reveal Button
    // inside each card animate themselves on the same scroll point
    const cardEls = grid.querySelectorAll(".card");
    const tl = gsap
      .timeline({ scrollTrigger: { trigger: grid, start: "top 85%" } })
      // the card's CSS `transition` would smooth every GSAP frame and lag it
      .set(cardEls, { transition: "none" })
      .from(cardEls, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      })
      .from(
        grid.querySelectorAll(".rise"),
        {
          yPercent: 110,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.05,
        },
        0.4,
      )
      // drop inline styles so the CSS hover transform/transition take over
      .set(cardEls, { clearProps: "all" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });
</script>

<section id="pricing">
  <!-- <h1>Pricing</h1> -->

  <div class="cards" bind:this={grid}>
    {#each cards as card}
      <div class="card">
        <content>
          <Heading>{card.name}</Heading>
          <Paragraph>{card.blurb}</Paragraph>
        </content>
        <footer>
          <p class="price">
            <span class="mask"><span class="rise">{card.price}</span></span>
            <small class="mask"><span class="rise">{card.unit}</span></small>
          </p>
          <Button href={"/contact"} variant="reveal">Book Now!</Button>
        </footer>
      </div>
    {/each}
  </div>

  <!-- <p class="deposit">£30 deposit on all bookings, comes off the final price.</p> -->
</section>

<style>
  #pricing {
    --gutter: clamp(1rem, 8vw, 10rem);
    gap: var(--gutter);
    /* padding: var(--gutter); */
    box-sizing: border-box;

    .cards {
      position: relative;
      padding: clamp(2rem, 10vw, 10rem) 0;
      /* align-items: center; */
      display: grid;
      /* min() stops a card overflowing screens narrower than 16rem */
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
      gap: clamp(1rem, 2vw, 2rem);
      height: 100%;
    }

    .card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px;
      border: 2px solid var(--primary);
      height: 100%;
      /* hover lifts the card off a hard offset shadow, like the Button's */
      transition:
        transform 0.35s cubic-bezier(0.215, 0.61, 0.355, 1),
        box-shadow 0.35s cubic-bezier(0.215, 0.61, 0.355, 1);

      content {
        :global(h1) {
          font-size: clamp(2.2rem, 4vw, 5rem);
        }
        :global(p) {
          font-family: "Archivo";
          font-size: clamp(1.1rem, 2vw, 3rem);
          font-weight: 200;
        }
      }

      footer {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: space-between;
        height: 30%;
        align-items: center;
        .price {
          font-family: "Graduate";
          font-weight: 600;
          font-size: clamp(2.5rem, 4vw, 5rem);

          small {
            display: block;
            font-family: "Archivo";
            font-weight: 200;
            font-size: clamp(1rem, 1.5vw, 2rem);
          }
        }
      }

      &:hover {
        transform: translate(0.3rem, -0.3rem);
        box-shadow: -0.6rem 0.6rem 0 var(--primary);
      }
    }

    .mask {
      display: block;
      overflow: hidden;
    }
    .rise {
      display: block;
    }

    .deposit {
      background: #eee;
      padding: 16px;
      margin-top: 16px;
    }
  }
</style>

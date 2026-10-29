<script>
  import Button from "$lib/Button.svelte";
  import Card from "$lib/Card.svelte";
  import Heading from "$lib/Heading.svelte";
  import Paragraph from "$lib/Paragraph.svelte";
  import { gsap, trackIntro } from "$lib/gsap";
  import { slamIn, tilt } from "$lib/p5";

  const plans = [
    { name: "Shop minimum", price: "£50", unit: "per tattoo", blurb: "Small, simple pieces." },
    { name: "Hourly", price: "£80", unit: "per hour", blurb: "Custom work, quoted at consult." },
    { name: "Day session", price: "£450", unit: "up to 6 hours", blurb: "Sleeves and big projects." },
    { name: "Flash", price: "£60", unit: "fixed price", blurb: "Ready-drawn designs." },
  ];

  /** @type {HTMLElement} */
  let grid;

  $effect(() => {
    const tl = gsap
      .timeline({ scrollTrigger: { trigger: grid, start: "top 85%" } })
      .add(slamIn(grid.querySelectorAll(".slot")))
      .from(
        grid.querySelectorAll(".rise"),
        { yPercent: 110, duration: 0.8, ease: "power3.out", stagger: 0.05 },
        0.4,
      );

    const untrack = trackIntro(tl);

    return () => {
      untrack();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });
</script>

<section class="pricing">
  <div class="grid" bind:this={grid}>
    {#each plans as plan, i}
      <div class="slot">
        <Card tilt={tilt(i)} interactive style="height: 100%">
          <div class="plan">
            <div>
              <Heading>{plan.name}</Heading>
              <Paragraph>{plan.blurb}</Paragraph>
            </div>
            <footer>
              <p class="price">
                <span class="mask"><span class="rise">{plan.price}</span></span>
                <small class="mask"><span class="rise">{plan.unit}</span></small>
              </p>
              <Button href="/contact" variant="reveal">Book Now!</Button>
            </footer>
          </div>
        </Card>
      </div>
    {/each}
  </div>
</section>

<style>
  .pricing {
    padding-inline: var(--page-pad);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
    gap: clamp(1rem, 2vw, 2rem);
    padding: clamp(2rem, 10vw, 10rem) 0;
  }

  .plan {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;
    padding: 16px;

    :global(h1) {
      font-size: clamp(2.2rem, 4vw, 5rem);
    }

    :global(p) {
      font-size: clamp(1.1rem, 2vw, 3rem);
      font-weight: 200;
    }
  }

  footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: 30%;
  }

  .price {
    font-family: "Graduate";
    font-size: clamp(2.5rem, 4vw, 5rem);
    font-weight: 600;

    small {
      font-family: "Archivo";
      font-size: clamp(1rem, 1.5vw, 2rem);
      font-weight: 200;
    }
  }

  .mask {
    display: block;
    overflow: hidden;
  }

  .rise {
    display: block;
  }
</style>

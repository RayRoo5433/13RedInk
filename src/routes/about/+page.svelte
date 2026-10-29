<script>
  import Card from "$lib/Card.svelte";
  import Heading from "$lib/Heading.svelte";
  import Image from "$lib/Image.svelte";
  import Paragraph from "$lib/Paragraph.svelte";
  import { trackIntro } from "$lib/gsap";
  import { slamIn, tilt } from "$lib/p5";

  /** @type {HTMLElement} */
  let description;

  $effect(() => {
    const tween = slamIn(description, {
      scrollTrigger: { trigger: description, start: "top 85%" },
    });
    const untrack = trackIntro(tween);

    return () => {
      untrack();
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  });
</script>

<section class="about">
  <div class="text">
    <Heading>Who are we?</Heading>
    <div class="description" bind:this={description}>
      <Card tilt={tilt(0)}>
        <div class="body">
          <Paragraph>
            lorem ipsum dolor sit amet consectetur adipiscing elit soluta id et
            pariatur repellendus et nostrud ea et est ex dolor nulla ut dolor qui
            excepturi ut molestias consequat quas eos id pariatur dolorum qui sunt
            accusamus eum cum vel cillum qui ipsum et voluptas sunt eum rerum
            accusamus qui cillum
          </Paragraph>
        </div>
      </Card>
    </div>
  </div>

  <div class="images">
    <div class="base"><Image src="/base.jpg" /></div>
    <div class="top"><Image src="/top.jpg" delay={0.3} /></div>
  </div>
</section>

<style>
  .about {
    --gutter: clamp(1rem, 8vw, 10rem);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gutter);
    padding: var(--gutter);
  }

  .text,
  .images {
    position: relative;
    flex: 1 1 20rem;
    min-width: 0;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    :global(h1) {
      font-size: clamp(2.2rem, 8vw, 8rem);
    }

    :global(p) {
      margin: 0;
      font-size: clamp(1.1rem, 3vw, 3rem);
      font-weight: 200;
    }
  }

  .body {
    padding: clamp(1rem, 2.5vw, 2rem);
  }

  .images {
    aspect-ratio: 5 / 4;
  }

  .base,
  .top {
    position: absolute;
  }

  .base {
    left: 0;
    bottom: 0;
    width: 68%;
    aspect-ratio: 4 / 3;
  }

  .top {
    right: 0;
    top: 0;
    z-index: 1;
    width: 50%;
    aspect-ratio: 4 / 5;
  }

  @media (max-width: 900px) {
    .about {
      --gutter: clamp(1rem, 6vw, 3rem);
      flex-direction: column;
      align-items: stretch;
    }

    .text,
    .images {
      flex: none;
      width: 100%;
    }

    .images {
      max-width: 40rem;
      margin: 0 auto;
    }
  }

  @media (max-width: 600px) {
    .about {
      padding-inline: var(--page-pad);
    }

    .text :global(p) {
      line-height: 1.5;
    }

    .images {
      aspect-ratio: 1;
    }

    .base {
      width: 75%;
    }

    .top {
      width: 55%;
    }
  }
</style>

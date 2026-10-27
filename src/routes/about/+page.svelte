<script>
  import Heading from "$lib/Heading.svelte";
  import Image from "$lib/Image.svelte";
  import Paragraph from "$lib/Paragraph.svelte";
</script>

<div id="about">
  <div class="text">
    <Heading>Who are we?</Heading>
    <Paragraph>
      lorem ipsum dolor sit amet consectetur adipiscing elit soluta id et
      pariatur repellendus et nostrud ea et est ex dolor nulla ut dolor qui
      excepturi ut molestias consequat quas eos id pariatur dolorum qui sunt
      accusamus eum cum vel cillum qui ipsum et voluptas sunt eum rerum
      accusamus qui cillum
    </Paragraph>
    <div class="socials"></div>
  </div>
  <div class="images">
    <!-- the wrappers place the pair; Image fills whichever box it's in -->
    <div class="base"><Image src="/base.jpg" /></div>
    <div class="top"><Image src="/top.jpg" delay={0.3} /></div>
  </div>
</div>

<style>
  div#about {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    --gutter: clamp(1rem, 8vw, 10rem);
    gap: var(--gutter);
    padding: var(--gutter);
    box-sizing: border-box;
    align-items: center;

    .text {
      position: relative;
      flex: 1 1 20rem;
      min-width: 0;

      :global(h1) {
        font-size: clamp(2.2rem, 8vw, 8rem);
        font-weight: 600;
      }

      :global(p) {
        font-size: clamp(1.1rem, 3vw, 3rem);
        font-weight: 200;
      }
    }

    .images {
      position: relative;
      flex: 1 1 20rem;
      min-width: 0;
      aspect-ratio: 5 / 4;

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
        width: 50%;
        aspect-ratio: 4 / 5;
        z-index: 1;
      }
    }
  }

  /* tablet: stack text over the images and let both use the full width */
  @media (max-width: 900px) {
    div#about {
      flex-direction: column;
      align-items: stretch;
      --gutter: clamp(1rem, 6vw, 3rem);

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
  }

  /* phone: the body's 32px copy is too big for a narrow column */
  @media (max-width: 600px) {
    div#about {
      padding-inline: 0;

      .text :global(h1) {
        font-size: 2.2rem;
      }

      .text :global(p) {
        font-size: 1.1rem;
        line-height: 1.5;
      }

      /* taller box so the overlapping pair doesn't get squashed */
      .images {
        aspect-ratio: 1 / 1;

        .base {
          width: 75%;
        }
        .top {
          width: 55%;
        }
      }
    }
  }
</style>

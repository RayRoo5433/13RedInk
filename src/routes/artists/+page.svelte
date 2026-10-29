<script>
  import Button from "$lib/Button.svelte";
  import Card from "$lib/Card.svelte";
  import Heading from "$lib/Heading.svelte";
  import Image from "$lib/Image.svelte";
  import Paragraph from "$lib/Paragraph.svelte";
  import { trackIntro } from "$lib/gsap";
  import { slamIn, tilt } from "$lib/p5";

  const artists = [
    {
      name: "Toby",
      description: `lorem ipsum dolor sit amet consectetur adipiscing elit ducimus ex assumenda dolorem id qui est quibusdam sunt nisi dolore quo eum eu est sed illum et temporibus eos qui vel molestias anim sint voluptate in optio quibusdam labore magna assumenda commodo aliquip sunt cupiditate sunt harum et harum est est`,
      image: "/toby.jpg",
      alias: "@toby.page.56",
      facebook: "https://www.facebook.com/profile.php?id=100085848969301",
      instagram: "https://www.instagram.com/toby.page.56",
    },
    {
      name: "Danny",
      description: `lorem ipsum dolor sit amet consectetur adipiscing elit ducimus ex assumenda dolorem id qui est quibusdam sunt nisi dolore quo eum eu est sed illum et temporibus eos qui vel molestias anim sint voluptate in optio quibusdam labore magna assumenda commodo aliquip sunt cupiditate sunt harum et harum est est`,
      image: "/danny.jpg",
      alias: "@monkworm_ink",
      facebook: "https://www.facebook.com/MonkwormInk",
      instagram: "",
    },
  ];

  // implement instagram scraping to procure artist portfolios

  /** @type {HTMLElement} */
  let section;

  $effect(() => {
    const tweens = [...section.querySelectorAll(".description")].map((el, i) =>
      slamIn(el, {
        from: i % 2 === 0 ? "right" : "left",
        scrollTrigger: { trigger: el, start: "top 85%" },
      }),
    );
    const untrack = trackIntro(...tweens);

    return () => {
      untrack();
      for (const tween of tweens) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
    };
  });
</script>

<section class="artists" bind:this={section}>
  {#each artists as artist, i}
    <article class="artist" class:flipped={i % 2 === 0}>
      <div class="text">
        <Heading>{artist.name}</Heading>
        <div class="description">
          <Card tilt={tilt(i)}>
            <div class="body">
              <Paragraph>{artist.description}</Paragraph>
              <Button variant="reveal" href={artist.instagram || artist.facebook}>portfolio</Button>
            </div>
          </Card>
        </div>
      </div>
      <div class="photo">
        <Image src={artist.image} alt={artist.name} />
      </div>
    </article>
  {/each}
</section>

<style>
  .artists {
    --gutter: clamp(1rem, 8vw, 10rem);
    display: flex;
    flex-direction: column;
    gap: var(--gutter);
    padding: var(--gutter);
  }

  .artist {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gutter);
  }

  .text,
  .photo {
    flex: 1 1 20rem;
    min-width: 0;
  }

  .flipped .text {
    order: 1;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    padding: clamp(1rem, 2.5vw, 2rem);

    :global(p) {
      margin: 0;
      font-weight: 200;
    }
  }

  .photo {
    aspect-ratio: 5 / 4;
  }

  @media (max-width: 900px) {
    .artists {
      --gutter: clamp(1rem, 6vw, 3rem);
    }

    .artist {
      flex-direction: column;
      align-items: stretch;
    }

    .text,
    .photo {
      flex: none;
      width: 100%;
    }

    .text {
      order: 1;
    }

    .photo {
      max-width: 40rem;
      margin: 0 auto;
    }
  }

  @media (max-width: 600px) {
    .artists {
      padding-inline: var(--page-pad);
    }

    .text :global(h1) {
      font-size: 2.2rem;
    }

    .text :global(p) {
      font-size: 1.1rem;
      line-height: 1.5;
    }

    .photo {
      aspect-ratio: 4 / 5;
    }
  }
</style>

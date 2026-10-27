<script>
  import Heading from "../../lib/Heading.svelte";
  import Image from "../../lib/Image.svelte";
  import Paragraph from "../../lib/Paragraph.svelte";
  import Button from "../../lib/Button.svelte";
  let artists = $state([
    {
      name: "Toby",
      description: `lorem ipsum dolor sit amet consectetur adipiscing elit ducimus ex assumenda dolorem id qui est quibusdam sunt nisi dolore quo eum eu est sed illum et temporibus eos qui vel molestias anim sint voluptate in optio quibusdam labore magna assumenda commodo aliquip sunt cupiditate sunt harum et harum est est`,
      image: "/toby.jpg",
      facebook: "https://www.facebook.com/profile.php?id=100085848969301",
      alias: "@toby.page.56",
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
  ]);

  // implement instagram scraping to procure artist portfolios
</script>

<div id="artists">
  {#each artists as artist, index}
    <div class="artist">
      <div class={`text ${index % 2 == 0 ? " first" : ""}`}>
        <Heading>
          {artist.name}
        </Heading>
        <Paragraph>{artist.description}</Paragraph>
        <div class="portfolio">
          <Button variant="reveal" href={artist.instagram || artist.facebook}
            >portfolio</Button
          >
        </div>
      </div>
      <div class="images">
        <Image src={artist.image} alt={artist.name} classname={"base"} />
      </div>
    </div>
  {/each}
</div>

<style>
  #artists {
    position: relative;
    display: flex;
    flex-flow: column;
    --gutter: clamp(1rem, 8vw, 10rem);
    gap: var(--gutter);
    padding: var(--gutter);
    box-sizing: border-box;

    .artist {
      display: flex;
      /* text and image stack once there's no room for both side by side */
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gutter);
      .text {
        position: relative;
        flex: 1 1 20rem;
        min-width: 0;

        p {
          font-weight: 200;
        }

        .portfolio {
          margin-top: 1rem;
        }
      }

      .first {
        order: 1;
      }

      .images {
        position: relative;
        flex: 1 1 20rem;
        min-width: 0;
        aspect-ratio: 5 / 4;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  /* tablet: one column, photo always above the bio instead of alternating */
  @media (max-width: 900px) {
    #artists {
      --gutter: clamp(1rem, 6vw, 3rem);

      .artist {
        flex-direction: column;
        align-items: stretch;

        .text,
        .images {
          flex: none;
          width: 100%;
        }

        .text,
        .first {
          order: 1;
        }

        .images {
          order: 0;
          max-width: 40rem;
          margin: 0 auto;
        }
      }
    }
  }

  /* phone: shrink the 32px body copy and use the full width */
  @media (max-width: 600px) {
    #artists {
      padding-inline: var(--page-pad);

      .artist {
        .text :global(h1) {
          font-size: 2.2rem;
        }

        .text :global(p) {
          font-size: 1.1rem;
          line-height: 1.5;
        }

        .images {
          aspect-ratio: 4 / 5;
        }
      }
    }
  }
</style>

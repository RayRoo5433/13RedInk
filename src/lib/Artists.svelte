<script>
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
        <h1>{artist.name}</h1>
        <p>{artist.description}</p>
        <div class="socials">
          <a href={artist.facebook}>{artist.alias}</a>
        </div>
      </div>
      <div class="images">
        <img class="base" src={artist.image} alt="" />
      </div>
    </div>
  {/each}
</div>

<style>
  #artists {
    position: relative;
    background-color: white;
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
        h1 {
        }

        p {
        }

        .socials {
          overflow-wrap: anywhere;
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
</style>

<div id="about">
  <div class="text">
    <h1>Who are we?</h1>
    <p>
      lorem ipsum dolor sit amet consectetur adipiscing elit soluta id et
      pariatur repellendus et nostrud ea et est ex dolor nulla ut dolor qui
      excepturi ut molestias consequat quas eos id pariatur dolorum qui sunt
      accusamus eum cum vel cillum qui ipsum et voluptas sunt eum rerum
      accusamus qui cillum
    </p>
    <div class="socials"></div>
  </div>
  <div class="images">
    <img class="base" src="/base.jpg" alt="" />
    <img class="top" src="/top.jpg" alt="" />
  </div>
</div>

<style>
  div#about {
    position: relative;
    min-height: 100vh;
    background-color: purple;
    display: flex;
    /* columns stack once there's no room for both side by side */
    flex-wrap: wrap;
    /* one gutter for the outer edges and between the columns */
    --gutter: clamp(1rem, 8vw, 10rem);
    gap: var(--gutter);
    padding: var(--gutter);
    box-sizing: border-box;
    align-items: center;

    .text {
      position: relative;
      flex: 1 1 20rem;
      min-width: 0;
      h1 {
      }

      p {
      }

      .socials {
      }
    }

    .images {
      position: relative;
      flex: 1 1 20rem;
      min-width: 0;
      aspect-ratio: 5 / 4;

      img {
        position: absolute;
        object-fit: cover;
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
</style>

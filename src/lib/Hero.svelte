<script>
  // film grain can maybe be added to the image. I'm picturing a really nice Gothic Font used with Red exclusively in Red...
  import Reviews from "../lib/Reviews.svelte";
</script>

<div id="hero">
  <img src="/banner.jpg" alt="" />
  <h1>RED 13 INK</h1>
  <div class="reviews">
    <Reviews />
  </div>
</div>

<style>
  #hero {
    position: relative;
    display: grid;
    /* row 1 takes whatever space the reviews leave over, so the h1 centers in it */
    grid-template-rows: minmax(0, 1fr) auto;
    /* stop the wide reviews strip from stretching the column (and pushing the h1 off-screen) */
    grid-template-columns: minmax(0, 1fr);
    height: 95vh;

    img {
      /* out of the grid flow so it can't stretch the rows; natural aspect ratio */
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: auto;
      z-index: 0;
    }

    h1 {
      grid-area: 1 / 1;
      place-self: center;
      margin: 0;
      z-index: 100;
    }

    .reviews {
      grid-area: 2 / 1;
      position: relative;
      padding: 1em;
      /* temporary just grey boxing */
      background-color: white;
      z-index: 1;
    }
  }
</style>

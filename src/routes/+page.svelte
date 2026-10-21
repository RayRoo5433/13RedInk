<script>
  // film grain can maybe be added to the image. I'm picturing a really nice Gothic Font used with Red exclusively in Red...
  import "../app.css";
  import Reviews from "../lib/Reviews.svelte";
  import TextPressure from "../lib/TextPressure.svelte";
</script>

<div id="hero">
  <div class="title">
    <TextPressure text="RED 13 INK" />
  </div>
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
    height: 85vh;
    overflow: hidden;

    img {
      /* out of the grid flow so it can't stretch the rows */
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      /* full width on wide screens; on tall/mobile screens scale up to fill the height instead, cropping the sides evenly */
      object-fit: cover;
      object-position: center;
      z-index: 0;
    }

    .title {
      grid-area: 1 / 1;
      align-self: center;
      position: relative;
      /* TextPressure sizes its font to width / 5 for 10 chars, so this box fits one line */
      aspect-ratio: 5 / 1;
      z-index: 80;
    }

    .reviews {
      grid-area: 2 / 1;
      position: relative;
      /* temporary just grey boxing */
      z-index: 1;
    }
  }
</style>

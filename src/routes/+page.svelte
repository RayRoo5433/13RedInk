<script>
  // film grain can maybe be added to the image. I'm picturing a really nice Gothic Font used with Red exclusively in Red...
  import "../app.css";
  import Reviews from "../lib/Reviews.svelte";
  import TextPressure from "../lib/TextPressure.svelte";
  import Logo from "../lib/Logo.svelte";
</script>

<div id="hero">
  <div class="title">
    <!-- <TextPressure text="RED 13 INK" /> -->
    <div class="logo">
      <Logo />
    </div>
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

    .title {
      grid-area: 1 / 1;
      position: relative;
      /* lets the 1fr row shrink below the logo's natural size */
      min-height: 0;
      padding: 2rem;
      z-index: 80;
    }

    .logo {
      width: 100%;
      height: 100%;
    }

    .reviews {
      grid-area: 2 / 1;
      position: relative;
      z-index: 1;
    }
  }
</style>

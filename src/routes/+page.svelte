<script>
  import Hero from "../lib/Hero.svelte";
  import Menu from "../lib/Menu.svelte";
  import About from "../lib/About.svelte";
  import Artists from "../lib/Artists.svelte";
  import Prices from "../lib/Prices.svelte";
</script>

<Menu />
<Hero />
<About />
<Artists />
<Prices />

<style>
  :global(body) {
    scroll-behavior: auto;
    overflow-x: hidden;
    margin: 0px;
    font-size: 32px;
  }
</style>

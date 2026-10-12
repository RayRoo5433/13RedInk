<script>
  import Menu from "$lib/Menu.svelte";

  let { children } = $props();
</script>

<Menu />
{@render children()}

<style>
  :global(body) {
    scroll-behavior: auto;
    overflow-x: hidden;
    margin: 0px;
    font-size: 32px;
  }
</style>

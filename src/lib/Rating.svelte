<script>
  let { score } = $props();
</script>

{#if typeof score === "boolean"}
  <span>✓ Recommended</span>
{:else}
  <span>{"★".repeat(score)}</span>
{/if}

<style>
  span {
    position: relative;
    z-index: 2;
  }
</style>

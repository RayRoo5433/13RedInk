<script>
  let { score } = $props();
</script>

<span>{typeof score === "boolean" ? "✓ Recommended" : "★".repeat(score)}</span>

<style>
  span {
    color: var(--red);
    font-size: 1.25rem;
    letter-spacing: 3px;
  }
</style>

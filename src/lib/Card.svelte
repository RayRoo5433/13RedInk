<script>
  let { children, tilt = 0, interactive = false, ...rest } = $props();
</script>

<div class="card" class:interactive style:--tilt="{tilt}deg" {...rest}>
  <div class="shadow"></div>
  <div class="face">
    {@render children()}
  </div>
</div>

<style>
  .card {
    position: relative;
    color: var(--ink);
    transform: rotate(var(--tilt));
  }

  .shadow {
    position: absolute;
    inset: 0;
    background-color: var(--ink);
    transform: translate(7px, 7px);
  }

  .face {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    background-color: var(--cream);
    border: 3px solid var(--ink);
    isolation: isolate;
  }

  .interactive {
    --spring: 0.25s cubic-bezier(0.3, 1.6, 0.5, 1);

    &,
    .face,
    .shadow {
      transition: transform var(--spring);
    }

    &:hover,
    &:focus-within {
      transform: rotate(0deg);

      .face {
        transform: skewX(-5deg) translate(-4px, -4px);
      }

      .shadow {
        transform: translate(11px, 11px) skewX(-2deg);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .interactive,
    .interactive * {
      transition: none;
    }
  }
</style>

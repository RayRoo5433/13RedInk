<script>
  // cream panel with a thick ink outline and a hard drop shadow, the base for
  // anything boxed on the site. tilt rests it a little off square (degrees);
  // interactive gives it the skewed hover jolt
  let {
    children,
    tilt = 0,
    interactive = false,
    element = $bindable(),
    ...rest
  } = $props();
</script>

<!-- the shadow is its own layer under the face so on hover it can lean by a
     different amount to the face -->
<div
  bind:this={element}
  class="card"
  class:interactive
  style:--tilt="{tilt}deg"
  {...rest}
>
  <div class="shadow" aria-hidden="true"></div>
  <div class="face">
    {@render children()}
  </div>
</div>

<style>
  .card {
    position: relative;
    box-sizing: border-box;
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
    /* own stacking layer, so things inside with negative z-index (like the
       Button's shadow) paint on the face rather than under it */
    isolation: isolate;
  }

  /* the face leans forward and lifts off its shadow, which leans less so
     the two separate, overshooting a touch on the way */
  .interactive {
    --spring: 0.25s cubic-bezier(0.3, 1.6, 0.5, 1);
    transition: transform var(--spring);

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
    .interactive .face,
    .interactive .shadow {
      transition: none;
    }
  }
</style>

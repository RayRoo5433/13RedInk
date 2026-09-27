<!--
  Red13Mark.svelte
  "RED" with "13" hidden inside it: the 1 sits on the upright of the R,
  the 3 sits over the E. Every few seconds RED dims and the 13 flickers
  up, then it settles back to RED.

  Usage:
    <Red13Mark />
    <Red13Mark size="10rem" interval={6} mode="fade" />
    <Red13Mark fill="solid" overlayColor="var(--bone)" />

  Built for a varsity block face (the free Google font "Graduate" is the
  closest match to the logo); it takes whatever --font-varsity is set to.
  Load the font on the page, and nudge `nudge` if a face lines up differently.
-->
<script>
  /**
   * @typedef {'hatch' | 'solid' | 'outline'} Fill
   * @typedef {Object} Props
   * @property {string} [word]          Base word.
   * @property {string} [overlay]       Characters laid over the word, one per letter from the left.
   * @property {Array<'start'|'center'|'end'>} [align]  How each overlay character lines up with its letter.
   * @property {number[]} [nudge]       Extra horizontal offset per overlay character, in em.
   * @property {string} [size]          Font size (any CSS length).
   * @property {Fill} [fill]            Fill of the base word.
   * @property {Fill} [overlayFill]     Fill of the overlay characters.
   * @property {string} [color]         Base word colour.
   * @property {string} [overlayColor]  Overlay colour.
   * @property {'flicker' | 'fade'} [mode]  Quick double-blink, or a slow cross-fade.
   * @property {number} [interval]      Seconds between reveals.
   * @property {number} [delay]         Seconds before the first reveal.
   * @property {number} [rest]          Overlay opacity between reveals (0 hides it).
   * @property {number} [dim]           Base word opacity while the overlay shows.
   * @property {boolean} [paused]       Stop the loop (e.g. offscreen).
   * @property {string} [label]         Accessible name.
   * @property {string} [class]         Extra class for the wrapper.
   */

  /** @type {Props} */
  let {
    word = "RED",
    overlay = "13",
    align = ["start", "center"],
    nudge = [-0.1, 0],
    size = "clamp(4rem, 16vw, 12rem)",
    fill = "hatch",
    overlayFill = "solid",
    color = "var(--red-13, #E8141B)",
    overlayColor = "var(--red-13, #E8141B)",
    mode = "flicker",
    interval = 5,
    delay = 1.5,
    rest = 0,
    dim = 0.18,
    paused = false,
    label,
    class: className = "",
  } = $props();

  const letters = $derived([...word]);
  const over = $derived([...overlay]);
  const name = $derived(label ?? `${word} ${overlay}`);
</script>

<span
  class="mark mode-{mode} {className}"
  class:paused
  role="img"
  aria-label={name}
  style:--size={size}
  style:--color={color}
  style:--overlay-color={overlayColor}
  style:--interval="{Math.max(interval, 1.5)}s"
  style:--delay="{delay}s"
  style:--rest={rest}
  style:--dim={dim}
>
  {#each letters as letter, i}
    <span class="cell" aria-hidden="true">
      <span class="glyph base fill-{fill}">{letter}</span>
      {#if over[i] && over[i] !== " "}
        <span
          class="glyph over fill-{overlayFill} align-{align[i] ?? 'center'}"
          style:--nudge="{nudge[i] ?? 0}em">{over[i]}</span
        >
      {/if}
    </span>
  {/each}
</span>

<style>
  .mark {
    display: inline-flex;
    font-family: var(
      --font-varsity,
      Graduate,
      "Varsity",
      Rockwell,
      "Courier New",
      serif
    );
    font-size: var(--size);
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0;
    user-select: none;
  }

  .cell {
    position: relative;
    display: inline-block;
  }

  .glyph {
    display: block;
    white-space: pre;
  }

  .base {
    --ink: var(--color);
  }

  /* The overlay sits in the same box as its letter. */
  .over {
    --ink: var(--overlay-color);
    position: absolute;
    top: 0;
    opacity: var(--rest);
  }
  .align-start {
    left: 0;
    transform: translateX(var(--nudge));
  }
  .align-center {
    left: 50%;
    transform: translateX(calc(-50% + var(--nudge)));
  }
  .align-end {
    right: 0;
    transform: translateX(var(--nudge));
  }

  /* Fills */
  .fill-solid {
    color: var(--ink);
  }
  .fill-outline {
    color: transparent;
    -webkit-text-stroke: 0.02em var(--ink);
  }
  /* Diagonal hatching inside an outline, like the shop's logo. */
  .fill-hatch {
    color: transparent;
    background-image: repeating-linear-gradient(
      -45deg,
      var(--ink) 0 0.025em,
      transparent 0.025em 0.045em
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-stroke: 0.018em var(--ink);
  }

  /* The loop. Each cycle rests on RED, reveals 13 near the end, then
     returns. Both layers share duration and delay so they stay in step. */
  @media (prefers-reduced-motion: no-preference) {
    .base,
    .over {
      animation-duration: var(--interval);
      animation-delay: var(--delay);
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-fill-mode: both;
    }
    .mode-flicker .base {
      animation-name: base-flicker;
    }
    .mode-flicker .over {
      animation-name: over-flicker;
    }
    .mode-fade .base {
      animation-name: base-fade;
      animation-timing-function: ease-in-out;
    }
    .mode-fade .over {
      animation-name: over-fade;
      animation-timing-function: ease-in-out;
    }

    .paused .base,
    .paused .over {
      animation-play-state: paused;
    }
  }

  /* Reduced motion: no loop, the 13 stays faintly visible instead. */
  @media (prefers-reduced-motion: reduce) {
    .over {
      opacity: max(var(--rest), 0.35);
    }
  }

  /* Flicker: off, on, off, on, hold, back. Last ~30% of the cycle. */
  @keyframes over-flicker {
    0%,
    70% {
      opacity: var(--rest);
    }
    71% {
      opacity: 1;
    }
    73% {
      opacity: var(--rest);
    }
    75% {
      opacity: 1;
    }
    76% {
      opacity: 0.6;
    }
    77%,
    94% {
      opacity: 1;
    }
    97%,
    100% {
      opacity: var(--rest);
    }
  }
  @keyframes base-flicker {
    0%,
    70% {
      opacity: 1;
    }
    71% {
      opacity: var(--dim);
    }
    73% {
      opacity: 1;
    }
    75%,
    94% {
      opacity: var(--dim);
    }
    97%,
    100% {
      opacity: 1;
    }
  }

  /* Fade: a slow cross-fade in and out. */
  @keyframes over-fade {
    0%,
    55% {
      opacity: var(--rest);
    }
    70%,
    88% {
      opacity: 1;
    }
    100% {
      opacity: var(--rest);
    }
  }
  @keyframes base-fade {
    0%,
    55% {
      opacity: 1;
    }
    70%,
    88% {
      opacity: var(--dim);
    }
    100% {
      opacity: 1;
    }
  }
</style>

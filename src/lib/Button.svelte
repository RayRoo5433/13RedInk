<script>
  import { goto } from "$app/navigation";
  import { gsap } from "$lib/gsap";

  // with an href it navigates (external links open in a new tab), otherwise it
  // just runs onclick; variant="reveal" (outline draw, text, shadow) and
  // variant="fade" (drops in from above) play when scrolled into view
  let { children, href, onclick, variant = "default", ...rest } = $props();

  let button;
  /** wrapper the fade variant moves, see markup */
  let wrapper;
  let outline;
  let label;
  /** the label's mask, which takes the hover lean */
  let mask;
  let shadow;
  /** the red background, its own layer so the reveal can wipe it in */
  let fill;
  let tween;
  /** where the shadow sits at rest and while hovered, set once measured */
  let offsets = { rest: { x: 0, y: 0 }, hover: { x: 0, y: 0 } };
  // hover is held off until the reveal has dropped the shadow into place
  let revealed = variant !== "reveal";
  // once the drawn outline lands, the real border takes over
  let drawn = $state(variant !== "reveal");

  $effect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // the shadow's resting offset comes from the CSS, read it before anything moves it
    const rest = {
      x: gsap.getProperty(shadow, "x"),
      y: gsap.getProperty(shadow, "y"),
      opacity: 1,
    };

    // paused so it only plays on hover/focus: the shadow kicks further out
    // and skews one way while the label leans the other, springing past and
    // settling; reverse() brings both back to the CSS state
    const spring = { duration: reduceMotion ? 0 : 0.3, ease: "back.out(3)" };
    offsets = {
      rest: { x: rest.x, y: rest.y },
      hover: { x: rest.x + 4, y: rest.y + 4 },
    };
    tween = gsap
      .timeline({ paused: true })
      .fromTo(
        shadow,
        { ...rest, skewX: 0 },
        { ...offsets.hover, skewX: 12, ...spring },
      )
      .to(mask, { skewX: -10, ...spring }, 0);

    let intro;
    let observer;
    if (variant === "fade" && !reduceMotion) {
      intro = gsap.from(wrapper, {
        y: -24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapper, start: "top 85%" },
        // leaves no transform behind, which would trap the shadow
        clearProps: "transform,opacity",
      });
    } else if (variant === "reveal") {
      if (reduceMotion) {
        drawn = true;
        revealed = true;
      } else {
        // the svg strokes trace the border; sized from the button since the
        // pill's corner radius can't be expressed in svg percentages
        const strokes = [...outline.querySelectorAll("rect")];
        const fit = () => {
          const width = parseFloat(getComputedStyle(button).borderTopWidth);
          const w = button.offsetWidth - width;
          const h = button.offsetHeight - width;
          const radius =
            parseFloat(getComputedStyle(button).borderTopLeftRadius) - width / 2;
          for (const rect of strokes) {
            rect.setAttribute("x", String(width / 2));
            rect.setAttribute("y", String(width / 2));
            rect.setAttribute("width", String(w));
            rect.setAttribute("height", String(h));
            rect.setAttribute("rx", String(Math.min(radius, h / 2)));
            rect.style.strokeWidth = `${width}px`;
          }
        };
        fit();
        observer = new ResizeObserver(fit);
        observer.observe(button);

        // a rect's path starts at the top-left and runs clockwise, so a half
        // length dash from 0 and another from halfway set off from the top-left
        // and bottom-right corners and close the outline where they meet
        intro = gsap
          .timeline({
            scrollTrigger: { trigger: button, start: "top 85%" },
            onComplete: () => {
              revealed = true;
              observer.disconnect();
            },
          })
          .fromTo(
            strokes,
            { strokeDasharray: "0 100" },
            { strokeDasharray: "50 50", duration: 1.4, ease: "power2.inOut" },
          )
          // hand over to the real border, which sits under the shadow properly
          .call(() => (drawn = true))
          .set(outline, { autoAlpha: 0 })
          // the red slashes in from the left at a lean and squares up
          .fromTo(
            fill,
            { scaleX: 0, skewX: -25 },
            { scaleX: 1, skewX: 0, duration: 0.45, ease: "expo.out" },
          )
          .from(label, { yPercent: 110, duration: 0.8, ease: "hop" }, "-=0.3")
          .from(shadow, {
            x: 0,
            y: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power3.out",
          });
      }
    }

    return () => {
      observer?.disconnect();
      tween.kill();
      intro?.scrollTrigger?.kill();
      intro?.kill();
    };
  });

  const show = () => revealed && tween?.play();
  const hide = () => revealed && tween?.reverse();

  // pressing tucks the shadow right under, like the button being pushed in;
  // letting go springs it back out to wherever hover left it
  const press = () =>
    revealed && gsap.to(shadow, { x: 0, y: 0, duration: 0.08, ease: "power2.out" });
  const release = () => {
    if (!revealed) return;
    const hovered = tween.progress() > 0 && !tween.reversed();
    gsap.to(shadow, {
      ...(hovered ? offsets.hover : offsets.rest),
      duration: 0.3,
      ease: "back.out(3)",
    });
  };

  /** @param {MouseEvent} event */
  function handleClick(event) {
    if (!href) return onclick?.(event);
    if (/^https?:\/\//.test(href)) window.open(href, "_blank", "noopener");
    else goto(href);
  }
</script>

{#snippet control()}
  <button
    bind:this={button}
    class:reveal={variant === "reveal"}
    class:drawn
    onclick={handleClick}
    onmouseenter={show}
    onmouseleave={hide}
    onfocus={show}
    onblur={hide}
    onpointerdown={press}
    onpointerup={release}
    {...rest}
  >
    {#if variant === "reveal"}
      <svg bind:this={outline} class="outline" aria-hidden="true">
        <rect pathLength="100" />
        <rect pathLength="100" stroke-dashoffset="-50" />
      </svg>
    {/if}
    <span bind:this={mask} class="mask"><span bind:this={label} class="label">{@render children()}</span></span>
    <span bind:this={shadow} class="shadow" aria-hidden="true"></span>
    <!-- after the shadow so it paints over it, both under the label -->
    <span bind:this={fill} class="fill" aria-hidden="true"></span>
  </button>
{/snippet}

<!-- transforming or fading the button itself would put its shadow on top, so
     the fade variant moves a wrapper instead -->
{#if variant === "fade"}
  <span bind:this={wrapper} class="fade">{@render control()}</span>
{:else}
  {@render control()}
{/if}

<style>
  .fade {
    display: inline-block;
  }

  button {
    /* anchors the shadow; no transform or z-index here or the shadow ends up on top */
    position: relative;
    border: 3px solid var(--ink);
    /* the red is the .fill layer, see below */
    background-color: transparent;
    color: var(--cream);
    font-family: "Archivo";
    font-weight: 800;
    font-size: 1.25rem;
    border-radius: 0;
    cursor: pointer;
    height: 4rem;
    padding: 0 1.5rem;

    /* the svg draws the outline in, then hands back to this border */
    &.reveal:not(.drawn) {
      border-color: transparent;
    }

    .outline {
      position: absolute;
      /* the button's border box, not its padding box */
      inset: -3px;
      width: calc(100% + 6px);
      height: calc(100% + 6px);
      overflow: visible;
      pointer-events: none;

      rect {
        fill: none;
        stroke: var(--ink);
      }
    }

    /* the text rises out of this, like the Heading */
    .mask {
      display: inline-block;
      overflow: hidden;
      vertical-align: bottom;
    }

    .label {
      display: inline-block;
    }

    .fill {
      position: absolute;
      inset: 0;
      z-index: -1;
      background-color: var(--red);
      transform-origin: left center;
      pointer-events: none;
    }

    /* empty until the reveal wipes it in */
    &.reveal:not(.drawn) .fill {
      transform: scaleX(0);
    }

    .shadow {
      position: absolute;
      /* cover the border too so the drop shadow matches the outline */
      inset: -3px;
      z-index: -1;
      background-color: var(--ink);
      /* hard drop shadow; hover kicks it out and skews it, pressing tucks
         it under so the button looks pushed in */
      transform: translate(5px, 5px);
      transform-origin: bottom left;
      pointer-events: none;
    }
  }
</style>

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
  let shadow;
  let tween;
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

    // paused so it only plays on hover/focus, tucking the shadow behind the button;
    // reverse() brings it back out to the CSS state
    tween = gsap.fromTo(shadow, rest, {
      x: 0,
      y: 0,
      opacity: 0,
      duration: reduceMotion ? 0 : 0.35,
      ease: "power3.out",
      paused: true,
      immediateRender: false,
    });

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
    {...rest}
  >
    {#if variant === "reveal"}
      <svg bind:this={outline} class="outline" aria-hidden="true">
        <rect pathLength="100" />
        <rect pathLength="100" stroke-dashoffset="-50" />
      </svg>
    {/if}
    <span class="mask"><span bind:this={label} class="label">{@render children()}</span></span>
    <span bind:this={shadow} class="shadow" aria-hidden="true"></span>
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
    border: 0.1rem solid var(--primary);
    background-color: var(--secondary);
    font-family: "Archivo";
    font-weight: 400;
    font-size: 1.5rem;
    border-radius: 2rem;
    cursor: pointer;
    height: 4rem;
    padding: 1rem;

    /* the svg draws the outline in, then hands back to this border */
    &.reveal:not(.drawn) {
      border-color: transparent;
    }

    .outline {
      position: absolute;
      /* the button's border box, not its padding box */
      inset: -0.1rem;
      width: calc(100% + 0.2rem);
      height: calc(100% + 0.2rem);
      overflow: visible;
      pointer-events: none;

      rect {
        fill: none;
        stroke: var(--primary);
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

    .shadow {
      position: absolute;
      inset: 0;
      z-index: -1;
      border-radius: 2rem;
      background-color: var(--primary);
      /* visible by default, hover slides it back under the button */
      transform: translate(-0.3rem, 0.3rem);
      pointer-events: none;
    }
  }
</style>

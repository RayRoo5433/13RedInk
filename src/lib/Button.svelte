<script>
  import { goto } from "$app/navigation";
  import { gsap, reducedMotion, trackIntro } from "$lib/gsap";

  /** @type {{ children: any, href?: string, onclick?: (e: MouseEvent) => void, variant?: "default" | "reveal", tone?: "red" | "cream", [key: string]: any }} */
  let { children, href, onclick, variant = "default", tone = "red", ...rest } = $props();

  const reveal = variant === "reveal";
  const SHADOW = 5;
  const LIFT = 4;

  /** @type {HTMLButtonElement} */
  let button;
  /** @type {SVGSVGElement} */
  let outline;
  /** @type {HTMLElement} */
  let mask;
  /** @type {HTMLElement} */
  let label;
  /** @type {HTMLElement} */
  let fill;
  /** @type {HTMLElement} */
  let shadow;
  /** @type {gsap.core.Timeline} */
  let hover;

  let ready = !reveal;
  let drawn = $state(!reveal);

  $effect(() => {
    const spring = { duration: reducedMotion() ? 0 : 0.3, ease: "back.out(3)" };
    hover = gsap
      .timeline({ paused: true })
      .to([fill, mask], { x: -LIFT, y: -LIFT, skewX: -5, ...spring })
      .to(shadow, { x: SHADOW + LIFT, y: SHADOW + LIFT, skewX: -2, ...spring }, 0);

    if (!reveal) return () => hover.kill();

    if (reducedMotion()) {
      drawn = true;
      ready = true;
      return () => hover.kill();
    }

    const strokes = [...outline.querySelectorAll("rect")];
    const fit = () => {
      const border = parseFloat(getComputedStyle(button).borderTopWidth);
      for (const rect of strokes) {
        rect.setAttribute("x", String(border / 2));
        rect.setAttribute("y", String(border / 2));
        rect.setAttribute("width", String(button.offsetWidth - border));
        rect.setAttribute("height", String(button.offsetHeight - border));
        rect.style.strokeWidth = `${border}px`;
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(button);

    // two half-length dashes start at opposite corners and meet
    const intro = gsap
      .timeline({
        scrollTrigger: { trigger: button, start: "top 85%" },
        onComplete: () => {
          ready = true;
          observer.disconnect();
        },
      })
      .fromTo(
        strokes,
        { strokeDasharray: "0 100" },
        { strokeDasharray: "50 50", duration: 1.4, ease: "power2.inOut" },
      )
      .call(() => (drawn = true))
      .fromTo(
        fill,
        { scaleX: 0, skewX: -25 },
        { scaleX: 1, skewX: 0, duration: 0.45, ease: "expo.out" },
      )
      .set(outline, { autoAlpha: 0 })
      .from(label, { yPercent: 110, duration: 0.8, ease: "hop" }, "-=0.3")
      .from(shadow, { x: 0, y: 0, opacity: 0, duration: 0.4, ease: "power3.out" });

    const stopIntro = trackIntro(intro);

    return () => {
      stopIntro();
      observer.disconnect();
      hover.kill();
    };
  });

  const show = () => ready && hover.play();
  const hide = () => ready && hover.reverse();

  const press = () =>
    ready && gsap.to([fill, mask], { x: 2, y: 2, skewX: 0, duration: 0.08, ease: "power2.out" });

  const release = () => {
    if (!ready) return;
    const hovered = hover.progress() > 0 && !hover.reversed();
    gsap.to([fill, mask], {
      x: hovered ? -LIFT : 0,
      y: hovered ? -LIFT : 0,
      skewX: hovered ? -5 : 0,
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

<button
  bind:this={button}
  class:reveal
  class:cream={tone === "cream"}
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
  {#if reveal}
    <svg bind:this={outline} class="outline" aria-hidden="true">
      <rect pathLength="100" />
      <rect pathLength="100" stroke-dashoffset="-50" />
    </svg>
  {/if}
  <span bind:this={mask} class="mask">
    <span bind:this={label} class="label">{@render children()}</span>
  </span>
  <span bind:this={shadow} class="shadow"></span>
  <span bind:this={fill} class="fill"></span>
</button>

<style>
  /* no transform or z-index on the button itself, or the shadow lands on top;
     the outline lives on .fill so the face can lean off the shadow */
  button {
    position: relative;
    height: 4rem;
    padding: 0 1.5rem;
    border: 3px solid transparent;
    border-radius: 0;
    background: none;
    color: var(--cream);
    font-family: "Archivo";
    font-size: 1.25rem;
    font-weight: 800;
    cursor: pointer;

    &.cream {
      color: var(--ink);

      .fill {
        background-color: var(--cream);
      }
    }

    &.reveal:not(.drawn) .fill {
      transform: scaleX(0);
    }
  }

  .outline {
    position: absolute;
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

  .mask {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
  }

  .label {
    display: inline-block;
  }

  .shadow,
  .fill {
    position: absolute;
    z-index: -1;
    pointer-events: none;
  }

  .shadow {
    inset: -3px;
    background-color: var(--ink);
    transform: translate(5px, 5px);
    transform-origin: bottom left;
  }

  .fill {
    inset: -3px;
    box-sizing: border-box;
    border: 3px solid var(--ink);
    background-color: var(--red);
    transform-origin: left center;
  }
</style>

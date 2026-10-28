<script>
  import { goto } from "$app/navigation";
  import { gsap, reducedMotion } from "$lib/gsap";

  /** @type {{ children: any, href?: string, onclick?: (e: MouseEvent) => void, variant?: "default" | "reveal", [key: string]: any }} */
  let { children, href, onclick, variant = "default", ...rest } = $props();

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
      .to(shadow, { x: SHADOW + LIFT, y: SHADOW + LIFT, skewX: 12, ...spring })
      .to(mask, { skewX: -10, ...spring }, 0);

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
      .set(outline, { autoAlpha: 0 })
      .fromTo(
        fill,
        { scaleX: 0, skewX: -25 },
        { scaleX: 1, skewX: 0, duration: 0.45, ease: "expo.out" },
      )
      .from(label, { yPercent: 110, duration: 0.8, ease: "hop" }, "-=0.3")
      .from(shadow, { x: 0, y: 0, opacity: 0, duration: 0.4, ease: "power3.out" });

    return () => {
      observer.disconnect();
      hover.kill();
      intro.scrollTrigger?.kill();
      intro.kill();
    };
  });

  const show = () => ready && hover.play();
  const hide = () => ready && hover.reverse();

  const press = () =>
    ready && gsap.to(shadow, { x: 0, y: 0, duration: 0.08, ease: "power2.out" });

  const release = () => {
    if (!ready) return;
    const offset = hover.progress() > 0 && !hover.reversed() ? SHADOW + LIFT : SHADOW;
    gsap.to(shadow, { x: offset, y: offset, duration: 0.3, ease: "back.out(3)" });
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
  /* no transform or z-index on the button itself, or the shadow lands on top */
  button {
    position: relative;
    height: 4rem;
    padding: 0 1.5rem;
    border: 3px solid var(--ink);
    border-radius: 0;
    background: none;
    color: var(--cream);
    font-family: "Archivo";
    font-size: 1.25rem;
    font-weight: 800;
    cursor: pointer;

    &.reveal:not(.drawn) {
      border-color: transparent;

      .fill {
        transform: scaleX(0);
      }
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
    inset: 0;
    background-color: var(--red);
    transform-origin: left center;
  }
</style>

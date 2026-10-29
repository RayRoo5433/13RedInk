<script>
  import "../app.css";
  import Button from "$lib/Button.svelte";
  import { page } from "$app/state";
  import { afterNavigate, onNavigate } from "$app/navigation";
  import { gsap, ScrollTrigger, reducedMotion, reverseIntros } from "$lib/gsap";
  import { onMount } from "svelte";

  let { children } = $props();

  const tabs = [
    { name: "home", href: "/" },
    { name: "about", href: "/about" },
    { name: "artists", href: "/artists" },
    { name: "pricing", href: "/pricing" },
  ];

  /** @param {string} href */
  const isActive = (href) =>
    href === "/" ? page.url.pathname === "/" : page.url.pathname.startsWith(href);

  const activeIndex = $derived(tabs.findIndex((tab) => isActive(tab.href)));

  /** @type {HTMLElement} */
  let nav;
  /** @type {HTMLElement} */
  let pill;
  /** @type {HTMLHRElement} */
  let rule;
  /** @type {HTMLElement} */
  let cta;
  /** @type {HTMLElement} */
  let backdrop;
  /** @type {HTMLAnchorElement[]} */
  let links = $state([]);
  /** @type {HTMLHRElement[]} */
  let separators = $state([]);

  let fontReady = $state(false);
  let navReady = $state(false);
  let pillOn = $state(false);
  let menuOpen = $state(false);

  /** @type {HTMLElement} */
  let content;

  onMount(() => {
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.2,
      ease: "power3.inOut",
    });

    const intro = gsap
      .timeline({ paused: true })
      .fromTo(backdrop, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.out" })
      .from(
        [...links, cta].reverse(),
        { x: "-100vw", duration: 2, stagger: 0.08, ease: "expo.out", clearProps: "transform" },
        0,
      )
      .call(() => (navReady = true), [], "-=0.4");

    document.fonts.load('1em "Graduate"').then(() => {
      fontReady = true;
      intro.play();
    });

    const observer = new ResizeObserver(() => placePill(0));
    observer.observe(nav);
    return () => observer.disconnect();
  });

  onNavigate(({ from, to }) => {
    if (reducedMotion() || from?.url.pathname === to?.url.pathname) return;
    return reverseIntros();
  });

  afterNavigate(({ type }) => {
    menuOpen = false;
    if (type !== "popstate") content.scrollTop = 0;
    ScrollTrigger.refresh();
  });

  let collapsed = true;

  /** @param {number} duration */
  function placePill(duration) {
    if (!fontReady) return;
    const link = links[activeIndex];

    if (!link) {
      pillOn = false;
      collapsed = true;
      gsap.to(pill, {
        x: Number(gsap.getProperty(pill, "x")) + pill.offsetWidth / 2,
        width: 0,
        duration,
        overwrite: "auto",
      });
      return;
    }

    if (collapsed) {
      gsap.set(pill, {
        x: link.offsetLeft + link.offsetWidth / 2,
        y: link.offsetTop,
        height: link.offsetHeight,
        width: 0,
        skewX: -12,
      });
      collapsed = false;
    }

    pillOn = navReady;
    gsap.to(pill, {
      x: link.offsetLeft,
      y: link.offsetTop,
      height: link.offsetHeight,
      width: link.offsetWidth,
      duration,
      overwrite: "auto",
    });
  }

  $effect(() => placePill(0.3));

  $effect(() => {
    if (!menuOpen) return;
    const tween = gsap.fromTo(
      separators,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: reducedMotion() ? 0 : 0.7,
        stagger: 0.08,
        delay: 0.2,
        ease: "power3.inOut",
      },
    );
    return () => tween.kill();
  });
</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && (menuOpen = false)} />

<header>
  <div bind:this={backdrop} class="backdrop"></div>
  <nav bind:this={nav}>
    {#each tabs as tab, i}
      <a
        href={tab.href}
        bind:this={links[i]}
        class:lit={i === activeIndex && pillOn}
        aria-current={i === activeIndex ? "page" : undefined}>{tab.name}</a
      >
    {/each}
    <div bind:this={pill} class="pill" class:on={pillOn}></div>
    <div bind:this={cta} class="cta">
      <Button href="/contact">Get a Consultation</Button>
    </div>
    <button
      class="menu-toggle"
      class:open={menuOpen}
      onclick={() => (menuOpen = !menuOpen)}
      aria-expanded={menuOpen}
      aria-controls="mobile-menu"
      aria-label={menuOpen ? "Close menu" : "Open menu"}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>
  <hr bind:this={rule} />

  <div id="mobile-menu" class="mobile-menu" class:open={menuOpen} inert={!menuOpen}>
    {#each tabs as tab, i}
      <a
        href={tab.href}
        class:active={i === activeIndex}
        aria-current={i === activeIndex ? "page" : undefined}>{tab.name}</a
      >
      <hr bind:this={separators[i]} />
    {/each}
    <Button href="/contact">Get a Consultation</Button>
  </div>
</header>

<content bind:this={content}>
  {@render children()}
</content>

<style>
  header {
    position: relative;
    z-index: 100;
    padding-top: 1rem;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    z-index: -1;
    background-color: var(--cream);
    transform: scaleX(0);
    transform-origin: left center;
  }

  nav {
    position: relative;
    z-index: 100;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    column-gap: 1em;
    padding: 0 var(--page-pad) 0.5em;

    a {
      position: relative;
      z-index: 1;
      padding: 0 0.35em;
      font-family: "Graduate", serif;
      text-decoration: none;
      color: var(--ink);
      transition: color 0.2s ease;

      &:hover {
        color: var(--red);
      }

      &.lit {
        color: var(--cream);
      }
    }
  }

  .pill {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    background-color: var(--red);
    border: 3px solid var(--ink);
    box-shadow: 4px 4px 0 var(--ink);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.on {
      opacity: 1;
    }
  }

  .menu-toggle {
    display: none;
    position: relative;
    width: 3rem;
    height: 3rem;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;

    span {
      position: absolute;
      left: 20%;
      width: 60%;
      height: 3px;
      background-color: var(--ink);
      transition:
        transform 0.3s ease,
        opacity 0.2s ease;

      &:nth-child(1) {
        top: calc(50% - 1.5px - 0.6rem);
      }
      &:nth-child(2) {
        top: calc(50% - 1.5px);
      }
      &:nth-child(3) {
        top: calc(50% - 1.5px + 0.6rem);
      }
    }

    &.open span {
      background-color: var(--cream);

      &:nth-child(1) {
        transform: translateY(0.6rem) rotate(45deg);
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        transform: translateY(-0.6rem) rotate(-45deg);
      }
    }
  }

  .mobile-menu {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    background-color: var(--red);
    clip-path: inset(0 0 100% 0);
    visibility: hidden;
    transition:
      clip-path 0.4s ease,
      visibility 0s linear 0.4s;

    &.open {
      clip-path: inset(0);
      visibility: visible;
      transition: clip-path 0.4s ease;
    }

    a {
      font-family: "Graduate", serif;
      text-decoration: none;
      color: var(--cream);

      &.active {
        text-decoration: underline;
        text-underline-offset: 0.2em;
      }
    }

    hr {
      width: min(20rem, 70vw);
      transform: scaleX(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .menu-toggle span,
    .mobile-menu {
      transition: none !important;
    }
  }

  @media (max-width: 900px) {
    nav > a,
    .pill,
    .cta {
      display: none;
    }

    .menu-toggle {
      display: block;
    }

    .mobile-menu {
      display: flex;
    }
  }

  content {
    display: block;
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--red);
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: var(--ink);
    }
  }
</style>

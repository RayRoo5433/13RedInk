<script>
  import "../app.css";
  import Button from "$lib/Button.svelte";
  import { page } from "$app/state";
  import { gsap, ScrollTrigger } from "$lib/gsap";
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import Logo from "../lib/Logo.svelte";
  import { elasticIn } from "svelte/easing";

  let { children } = $props();
  let pill;
  /** @type {HTMLElement} */
  let nav;
  /** @type {HTMLHRElement} */
  let rule;
  /** @type {HTMLElement} */
  let cta;
  /** @type {HTMLAnchorElement[]} */
  let links = $state([]);
  // the pill measures the links, which are wrong until Graduate has loaded
  let fontReady = $state(false);
  // small-screen menu; the inline links are hidden below the breakpoint
  let menuOpen = $state(false);
  /** @type {HTMLHRElement[]} */
  let separators = $state([]);

  const tabs = [
    { name: "home", href: "/" },
    { name: "about", href: "/about" },
    { name: "artists", href: "/artists" },
    { name: "pricing", href: "/pricing" },
  ];

  /** @param {string} href */
  const isActive = (href) =>
    href === "/"
      ? page.url.pathname === "/"
      : page.url.pathname.startsWith(href);

  onMount(() => {
    // draw the header rule in on first load, same as the reviews line
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.2,
      ease: "power3.inOut",
    });

    // nav items slide in from off the left edge, leftmost first; paused
    // so they wait off screen until the font is in
    const intro = gsap
      .timeline({ paused: true })
      .from([...links, cta].reverse(), {
        x: "-100vw",
        duration: 2,
        stagger: 0.08,
        ease: "expo.out",
        clearProps: "transform",
      })
      // the pill's x belongs to the effect below, so just fade it in once the
      // links land, and only if this page has a link for it to sit under
      .call(
        () => {
          introDone = true;
          if (pillShown) {
            pillLit = true;
            gsap.to(pill, { autoAlpha: 1, duration: 0.4 });
          }
        },
        [],
        "-=0.4",
      );

    document.fonts.load('1em "Graduate"').then(() => {
      fontReady = true;
      intro.play();
    });

    // window resizes, the nav wrapping, etc. move the links without a page
    // change, so snap the pill back under its link whenever the nav resizes
    const observer = new ResizeObserver(() => placePill(0));
    observer.observe(nav);
    return () => observer.disconnect();
  });

  // <content> stays mounted across pages, so its scroll height changes without
  // a resize; re-measure triggers once the new page is in
  afterNavigate(() => {
    menuOpen = false;
    ScrollTrigger.refresh();
  });

  // each time the menu opens, the separators draw out from their centres one
  // after another while the overlay wipes down
  $effect(() => {
    if (!menuOpen) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const tween = gsap.fromTo(
      separators,
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: "center",
        duration: reduceMotion ? 0 : 0.7,
        stagger: 0.08,
        delay: reduceMotion ? 0 : 0.2,
        ease: "power3.inOut",
      },
    );
    return () => tween.kill();
  });

  /** @param {KeyboardEvent} event */
  function closeOnEscape(event) {
    if (event.key === "Escape") menuOpen = false;
  }

  const activeIndex = $derived(tabs.findIndex((tab) => isActive(tab.href)));

  // whether the pill is currently under a link (false while collapsed)
  let pillShown = false;
  // whether the pill can actually be seen; the active link only turns cream
  // then, otherwise it's cream on blue while the nav slides in
  let pillLit = $state(false);
  // the pill stays hidden until the nav has slid in
  let introDone = false;

  /** @param {number} duration */
  function placePill(duration) {
    if (!fontReady || !pill) return;
    const activeElement = links[activeIndex];

    if (!activeElement) {
      // on a page with no nav link (e.g. /contact) shrink into its own centre
      // its outline and shadow would still show at zero width, so fade it too
      gsap.to(pill, {
        x: Number(gsap.getProperty(pill, "x")) + pill.offsetWidth / 2,
        width: 0,
        autoAlpha: 0,
        duration,
        overwrite: "auto",
      });
      pillShown = false;
      pillLit = false;
      return;
    }

    // offsetLeft/offsetTop are relative to nav (position: relative)
    const y = activeElement.offsetTop;
    const height = activeElement.offsetHeight;

    // coming back from collapsed: grow out from the link's centre rather than
    // sliding over from wherever it shrank
    if (!pillShown) {
      gsap.set(pill, {
        x: activeElement.offsetLeft + activeElement.offsetWidth / 2,
        y,
        height,
        width: 0,
        // leans like a Persona menu highlight
        skewX: -12,
      });
      pillShown = true;
    }

    gsap.to(pill, {
      x: activeElement.offsetLeft,
      y,
      height,
      width: activeElement.offsetWidth,
      ...(introDone && { autoAlpha: 1 }),
      onStart: () => {
        if (introDone) pillLit = true;
      },
      duration,
      // a resize mid-slide snaps straight to the new spot
      overwrite: "auto",
      // ease: "elastic.in(0.6,0.3)",
    });
  }

  // reruns on navigation (activeIndex) and once the font is in
  $effect(() => placePill(0.3));
</script>

<svelte:window onkeydown={closeOnEscape} />

<header>
  <nav bind:this={nav}>
    <!-- <Logo /> -->
    {#each tabs as tab, i}
      <a
        href={tab.href}
        bind:this={links[i]}
        class:active={isActive(tab.href)}
        class:lit={isActive(tab.href) && pillLit}
        aria-current={isActive(tab.href) ? "page" : undefined}>{tab.name}</a
      >
    {/each}
    <div bind:this={pill} class="pill"></div>
    <!-- transforming the button itself would put its shadow on top, so slide this instead -->
    <div bind:this={cta} class="cta">
      <Button href="/contact">Get a Consulation</Button>
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
  <!-- inert keeps the hidden links out of the tab order while it's closed -->
  <div id="mobile-menu" class="mobile-menu" class:open={menuOpen} inert={!menuOpen}>
    {#each tabs as tab, i}
      {#if i > 0}<hr bind:this={separators[i - 1]} />{/if}
      <a
        href={tab.href}
        class:active={isActive(tab.href)}
        aria-current={isActive(tab.href) ? "page" : undefined}>{tab.name}</a
      >
    {/each}
    <hr bind:this={separators[tabs.length - 1]} />
    <Button href="/contact">Get a Consulation</Button>
  </div>
</header>

<content>
  {@render children()}
</content>

<style>
  header {
    position: sticky;
    top: 0px;
    padding-top: 1rem;
    z-index: 100;
    background-color: var(--secondary);
  }

  nav {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding-inline: var(--page-pad);
    top: 0px;
    z-index: 100;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    min-height: 5vh;
    justify-content: flex-end;
    column-gap: 1em;
    margin: 0 auto;

    a {
      /* above the pill, which sits behind the active link */
      position: relative;
      z-index: 1;
      padding: 0 0.35em;
      font-family: "Graduate", serif;
      text-decoration: none;
      color: var(--ink);
      transition: color 0.2s ease;
    }

    a:hover {
      color: var(--red);
    }

    a.lit {
      color: var(--cream);
    }
  }
  :global(hr) {
    height: 0;
    margin: 0.5em auto;
    padding: 0;
    border: none;
    border-top: 4px solid var(--ink);
  }

  /* skewed red block behind the active link, outlined and dropped like a Card */
  .pill {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 0px;
    height: 0px;
    box-sizing: border-box;
    background-color: var(--red);
    border: 3px solid var(--ink);
    box-shadow: 4px 4px 0 var(--ink);
    /* faded in once the nav lands, see the intro */
    opacity: 0;
    visibility: hidden;
  }

  .menu-toggle {
    display: none;
    position: relative;
    width: 3rem;
    height: 3rem;
    padding: 0;
    border: none;
    background-color: transparent;
    cursor: pointer;

    span {
      position: absolute;
      left: 20%;
      width: 60%;
      height: 3px;
      background-color: var(--primary);
      transition:
        transform 0.3s ease,
        opacity 0.2s ease;
    }
    span:nth-child(1) {
      top: calc(50% - 1.5px - 0.6rem);
    }
    span:nth-child(2) {
      top: calc(50% - 1.5px);
    }
    span:nth-child(3) {
      top: calc(50% - 1.5px + 0.6rem);
    }

    /* outer bars meet in the middle and cross, the middle one drops out */
    /* sits on the red overlay while open */
    &.open {
      --primary: var(--blue);
    }

    &.open span:nth-child(1) {
      transform: translateY(0.6rem) rotate(45deg);
    }
    &.open span:nth-child(2) {
      opacity: 0;
    }
    &.open span:nth-child(3) {
      transform: translateY(-0.6rem) rotate(-45deg);
    }
  }

  .mobile-menu {
    /* swap the palette so the links, and the Button inside, come out inverted */
    --primary: var(--blue);
    --secondary: var(--red);
    display: none;
    position: fixed;
    inset: 0;
    /* under nav (z-index 100) so the toggle stays on top to close it */
    z-index: 50;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    background-color: var(--secondary);
    color: var(--primary);
    /* wipes down from the top of the screen */
    clip-path: inset(0 0 100% 0);
    visibility: hidden;
    transition:
      clip-path 0.4s ease,
      visibility 0s linear 0.4s;

    &.open {
      clip-path: inset(0 0 0 0);
      visibility: visible;
      transition:
        clip-path 0.4s ease,
        visibility 0s;
    }

    a {
      font-family: "Graduate", serif;
      text-decoration: none;
      color: var(--primary);
    }

    a.active {
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }

    hr {
      width: min(20rem, 70vw);
      margin: 0;
      /* drawn in by the open animation */
      transform: scaleX(0);
    }
  }

  @media (max-width: 900px) {
    nav > a,
    nav .pill,
    nav .cta {
      display: none;
    }

    .menu-toggle {
      display: block;
    }

    .mobile-menu {
      display: flex;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .menu-toggle span,
    .mobile-menu,
    .mobile-menu.open {
      transition: none;
    }
  }

  content {
    display: block;
    /* whatever height the header leaves, see body in app.css */
    flex: 1;
    min-height: 0;
    overflow-y: scroll;
    /* slam-ins start off the side; don't let them widen the page */
    overflow-x: hidden;

    /* `&` attaches these to content's own scrollbar; a bare/:global selector
       here would target scrollbars of elements *inside* content instead */
    &::-webkit-scrollbar {
      width: 10px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-track {
      display: hidden;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary);
      height: 20%;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
</style>

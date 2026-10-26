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
      // the pill's x belongs to the effect below, so just fade it in once the links land
      .from(pill, { opacity: 0, duration: 0.4 }, "-=0.4");

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
  afterNavigate(() => ScrollTrigger.refresh());

  const activeIndex = $derived(tabs.findIndex((tab) => isActive(tab.href)));

  // whether the pill is currently under a link (false while collapsed)
  let pillShown = false;

  /** @param {number} duration */
  function placePill(duration) {
    if (!fontReady || !pill) return;
    const activeElement = links[activeIndex];

    if (!activeElement) {
      // on a page with no nav link (e.g. /contact) shrink into its own centre
      gsap.to(pill, {
        x: Number(gsap.getProperty(pill, "x")) + pill.offsetWidth / 2,
        width: 0,
        duration,
        overwrite: "auto",
      });
      pillShown = false;
      return;
    }

    // offsetLeft/offsetTop are relative to nav (position: relative)
    const y =
      activeElement.offsetTop +
      activeElement.offsetHeight / 2 -
      pill.offsetHeight / 2;

    // coming back from collapsed: grow out from the link's centre rather than
    // sliding over from wherever it shrank
    if (!pillShown) {
      gsap.set(pill, {
        x: activeElement.offsetLeft + activeElement.offsetWidth / 2,
        y,
        width: 0,
      });
      pillShown = true;
    }

    gsap.to(pill, {
      x: activeElement.offsetLeft,
      y,
      width: activeElement.offsetWidth,
      duration,
      // a resize mid-slide snaps straight to the new spot
      overwrite: "auto",
      // ease: "elastic.in(0.6,0.3)",
    });
  }

  // reruns on navigation (activeIndex) and once the font is in
  $effect(() => placePill(0.3));
</script>

<header>
  <nav bind:this={nav}>
    <!-- <Logo /> -->
    {#each tabs as tab, i}
      <a
        href={tab.href}
        bind:this={links[i]}
        class:active={isActive(tab.href)}
        aria-current={isActive(tab.href) ? "page" : undefined}>{tab.name}</a
      >
    {/each}
    <div bind:this={pill} class="pill"></div>
    <!-- transforming the button itself would put its shadow on top, so slide this instead -->
    <div bind:this={cta}>
      <Button href="/contact">Get a Consulation</Button>
    </div>
  </nav>
  <hr bind:this={rule} />
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
      font-family: "Graduate", serif;
      text-decoration: none;
      color: var(--primary);
    }

    a.active {
      /* text-decoration: underline; */
      text-underline-offset: 0.2em;
    }
  }
  :global(hr) {
    height: 0;
    margin: 0.5em auto;
    padding: 0;
    border: none;
    border-top: 1px solid var(--primary);
  }

  .pill {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 0px;
    height: 2.5rem;
    border-bottom: 3px solid var(--primary);
    background-color: transparent;
  }

  content {
    display: block;
    height: 90vh;
    overflow-y: scroll;

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

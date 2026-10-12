<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { afterNavigate, replaceState } from "$app/navigation";
  import type { gsap as GSAP } from "gsap"; // type only, erased at build time

  // "home" scrolls to the top of the page, the rest to their section ids
  const tabs = [
    { name: "home", id: "hero" },
    { name: "about", id: "about" },
    { name: "artists", id: "artists" },
    { name: "pricing", id: "pricing" },
    { name: "contact", id: "contact" },
  ];

  const href = (id: string) => (id === "hero" ? "/" : `/#${id}`);

  const activeFromUrl = (url: URL) => {
    if (url.pathname === "/") return url.hash.slice(1) || "hero";
    return url.pathname.startsWith("/artist") ? "artists" : "";
  };

  let active = $state(activeFromUrl(page.url));
  let animating = false; // stops the observer flicking through every section mid-scroll
  let observer: IntersectionObserver | undefined;
  let gsap: typeof GSAP | undefined; // loaded in the browser only, never during SSR

  onMount(() => {
    Promise.all([import("gsap"), import("gsap/ScrollToPlugin")]).then(
      ([{ gsap: g }, { ScrollToPlugin }]) => {
        g.registerPlugin(ScrollToPlugin);
        gsap = g;
      },
    );
    return () => observer?.disconnect();
  });

  // The layout persists across pages, so rewire the observer after each navigation
  afterNavigate(() => {
    observer?.disconnect();
    active = activeFromUrl(page.url);
    if (page.url.pathname !== "/") return;
    observer = new IntersectionObserver(
      (entries) => {
        if (animating) return;
        for (const entry of entries) {
          if (entry.isIntersecting) active = entry.target.id;
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }, // a section is active while it crosses mid-screen
    );
    for (const { id } of tabs) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
  });

  const handleNavigation = (e: MouseEvent, id: string) => {
    // On other pages, or before GSAP has loaded, let SvelteKit navigate to /#id normally
    if (page.url.pathname !== "/" || !gsap) return;
    e.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    active = id;
    animating = true;
    gsap.to(window, {
      scrollTo: id === "hero" ? 0 : `#${id}`,
      duration: reduceMotion ? 0 : 0.9,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        animating = false;
        replaceState(href(id), {});
      },
      onInterrupt: () => {
        animating = false;
      },
    });
  };
</script>

<nav>
  {#each tabs as tab}
    <a
      href={href(tab.id)}
      class:active={active === tab.id}
      aria-current={active === tab.id ? "location" : undefined}
      onclick={(e) => handleNavigation(e, tab.id)}>{tab.name}</a
    >
  {/each}
</nav>

<style>
  nav {
    position: sticky;
    top: 0px;
    z-index: 100;
    background: white;
    display: flex;
    flex-wrap: wrap;
    min-height: 5vh;
    justify-content: space-evenly;
    column-gap: 1em;
    width: 100%;
    margin: 0 auto;
    margin-top: 1rem;

    a {
      text-decoration: none;
      color: black;
    }

    a.active {
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
  }
</style>

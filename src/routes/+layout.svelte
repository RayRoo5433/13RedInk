<script>
  import "../app.css";
  import Button from "$lib/Button.svelte";
  import { page } from "$app/state";
  import Logo from "../lib/Logo.svelte";

  let { children } = $props();

  const tabs = [
    { name: "about", href: "/about" },
    { name: "artists", href: "/artists" },
    { name: "pricing", href: "/pricing" },
  ];

  /** @param {string} href */
  const isActive = (href) =>
    href === "/"
      ? page.url.pathname === "/"
      : page.url.pathname.startsWith(href);
</script>

<header>
  <nav>
    <Logo />
    {#each tabs as tab}
      <a
        href={tab.href}
        class:active={isActive(tab.href)}
        aria-current={isActive(tab.href) ? "page" : undefined}>{tab.name}</a
      >
    {/each}

    <Button href="/contact">Get a Consulation</Button>
  </nav>
  <hr />
</header>

{@render children()}

<style>
  header {
    position: sticky;
    top: 0px;
    padding-top: 1rem;
    z-index: 100;
    background-color: var(--secondary);
  }

  nav {
    top: 0px;
    z-index: 100;
    display: flex;
    flex-wrap: wrap;
    min-height: 5vh;
    justify-content: space-evenly;
    column-gap: 1em;
    width: 100%;
    margin: 0 auto;

    a {
      text-decoration: none;
      color: var(--primary);
    }

    a.active {
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
  }
  /* one solid line; the browser default is a two-tone inset border */
  :global(hr) {
    height: 0;
    margin: 0.5em auto;
    padding: 0;
    border: none;
    border-top: 1px solid var(--primary);
  }
</style>

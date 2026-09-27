<script lang="ts">
  let tabs = $state([
    { name: "home", id: "#home", active: false },
    { name: "about", id: "#about", active: false },
    { name: "artists", id: "#artists", active: false },
    { name: "pricing", id: "#pricing", active: false },
    { name: "contact", id: "#contact", active: false },
  ]);

  const handleNavigation = (e: Event) => {
    e.preventDefault();
    const link = e.currentTarget as HTMLAnchorElement;
    const anchorId = new URL(link.href).hash.replace("#", "");
    const anchor = document.getElementById(anchorId);
    if (!anchor) return;
    window.scrollTo({
      top: anchor.offsetTop,
      behavior: "smooth",
    });
  };
</script>

<nav>
  {#each tabs as tab}
    <a href={tab.id} onclick={handleNavigation}>{tab.name}</a>
  {/each}
</nav>

<style>
  nav {
    display: flex;
    flex-wrap: wrap;
    min-height: 5vh;
    justify-content: space-evenly;
    column-gap: 1em;
    max-width: 50rem;
    margin: 0 auto;

    a {
      text-decoration: none;
      color: black;
    }
  }
</style>

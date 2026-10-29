<script>
  import Card from "$lib/Card.svelte";
  import Heading from "$lib/Heading.svelte";
  import { trackIntro } from "$lib/gsap";
  import { slamIn, tilt } from "$lib/p5";
  import { address, addressLines, hours } from "$lib/studio";

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`;

  const links = [
    {
      label: "Email",
      value: "hello@red13ink.co.uk",
      href: "mailto:hello@red13ink.co.uk",
    },
    {
      label: "Instagram",
      value: "@red13ink",
      href: "https://instagram.com/red13ink",
    },
    { label: "Facebook", value: "Red 13 Ink", href: "https://facebook.com/" },
  ];

  /** @type {HTMLElement} */
  let top;
  /** @type {HTMLElement} */
  let map;

  $effect(() => {
    const tweens = [
      slamIn(top.querySelectorAll(".info, .hours-slot"), {
        scrollTrigger: { trigger: top, start: "top 85%" },
      }),
      slamIn(map, {
        from: "right",
        scrollTrigger: { trigger: map, start: "top 85%" },
      }),
    ];

    const untrack = trackIntro(...tweens);

    return () => {
      untrack();
      for (const tween of tweens) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
    };
  });
</script>

<section class="contact">
  <div class="top" bind:this={top}>
    <div class="details">
      <div class="title"><Heading>Come say hello</Heading></div>
      <div class="slot info">
        <address>
          {#each addressLines as line, i}
            <span class:postcode={i === addressLines.length - 1}>{line}</span>
          {/each}
        </address>
        <ul>
          {#each links as link}
            <li>{link.label}: <a href={link.href}>{link.value}</a></li>
          {/each}
        </ul>
      </div>
      <div class="slot map-slot" bind:this={map}>
        <Card style="height: 100%">
          <iframe
            class="map"
            title="Map showing Red 13 Ink at {address}"
            src={mapSrc}
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </Card>
      </div>
    </div>

    <div class="slot hours-slot">
      <Card tilt={tilt(1)} style="height: 100%">
        <div class="hours">
          <h2>Opening hours</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Opens</th>
                <th scope="col">Closes</th>
              </tr>
            </thead>
            <tbody>
              {#each hours as h}
                <tr class:closed={!h.open}>
                  <th scope="row">{h.day}</th>
                  {#if h.open}
                    <td>{h.open}</td>
                    <td>{h.close}</td>
                  {:else}
                    <td colspan="2">Closed</td>
                  {/if}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
</section>

<style>
  .contact {
    box-sizing: border-box;
    height: 100%;
    padding: clamp(1.5rem, 4vw, 3rem) var(--page-pad);
    color: var(--ink);
  }

  .title :global(h1) {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
  }

  .top {
    display: grid;
    height: 100%;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 4vw, 4rem);
    align-items: stretch;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: clamp(1.25rem, 2.5vw, 2rem);
    min-height: 0;
  }

  .map-slot {
    flex: 1;
    min-height: 12rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  address {
    font-style: normal;
    font-family: "Graduate", serif;
    font-size: clamp(1.75rem, 3.4vw, 2.5rem);
    line-height: 1.15;

    span {
      display: block;
    }

    .postcode {
      color: var(--red);
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 1.15rem;
    font-weight: 600;
  }

  a {
    color: var(--ink);
    text-underline-offset: 3px;
  }
  a:hover {
    color: var(--red);
  }
  a:focus-visible {
    outline: 3px solid var(--ink);
    outline-offset: 3px;
  }

  .hours {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    padding: clamp(1.25rem, 2.5vw, 2rem);

    h2 {
      margin: 0 0 1rem;
      font-family: "Graduate", serif;
      font-size: clamp(1.75rem, 3vw, 2.5rem);
      font-weight: 400;
      text-align: center;
    }

    table {
      flex: 1;
      width: 100%;
      border-collapse: collapse;
      font-size: clamp(1rem, 1.4vw, 1.25rem);
    }

    thead th {
      padding-bottom: 0.5rem;
      border-bottom: 3px solid var(--ink);
      font-family: "Archivo", sans-serif;
      font-size: 0.8em;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
    }

    tbody tr {
      border-bottom: 2px dashed var(--ink);

      &:last-child {
        border-bottom: none;
      }
    }

    th,
    td {
      padding: 0.6rem 0.5rem 0.6rem 0;
    }

    tbody th {
      font-family: "Graduate", serif;
      font-weight: 400;
      text-align: left;
    }

    td {
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }

    .closed td {
      font-weight: 400;
      opacity: 0.6;
    }
  }

  .map {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    filter: grayscale(1) contrast(1.05);
    mix-blend-mode: multiply;
  }

  @media (max-width: 900px) {
    .contact,
    .top {
      height: auto;
    }

    .top {
      grid-template-columns: 1fr;
    }

    .map-slot {
      flex: none;
      aspect-ratio: 4 / 3;
    }
  }
</style>

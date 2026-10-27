<script>
  import { gsap } from "$lib/gsap";
  import Heading from "$lib/Heading.svelte";
  import { addressLines, address, hours } from "$lib/studio";
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
  let visit;

  $effect(() => {
    // each row draws its rule in, then its content rises out of masks the
    // same way Paragraph's words do; the label is a Heading, which animates
    // itself on the same scroll point
    const tweens = [...visit.querySelectorAll(".row")].map((row) =>
      gsap
        .timeline({ scrollTrigger: { trigger: row, start: "top 85%" } })
        .from(row.querySelectorAll("hr"), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.2,
          ease: "power3.inOut",
          stagger: 0.05,
        })
        .from(
          row.querySelectorAll(".rise"),
          {
            yPercent: 110,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05,
          },
          0.25,
        )
        // the map wipes open from the bottom like Image
        .to(
          row.querySelectorAll(".map-frame"),
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.4,
            ease: "hop",
          },
          0.25,
        ),
    );

    return () => {
      for (const tl of tweens) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  });
</script>

<section class="visit" aria-labelledby="visit-title" bind:this={visit}>
  <h2 id="visit-title" class="sr-only">Visit Red 13 Ink</h2>

  <div class="row">
    <div class="label"><Heading>Find us</Heading></div>
    <address class="content address">
      {#each addressLines as line}
        <span class="mask"><span class="rise">{line}</span></span>
      {/each}
    </address>
  </div>

  <div class="row">
    <hr />
    <div class="label"><Heading>Opening times</Heading></div>
    <dl class="content week">
      {#each hours as h}
        <div class="day" class:closed={!h.open}>
          <hr />
          <dt class="mask"><span class="rise">{h.day}</span></dt>
          <dd class="mask">
            <span class="rise">
              {#if h.open}<span class="time">{h.open}</span>
                <span class="time">{h.close}</span>{:else}Closed{/if}
            </span>
          </dd>
        </div>
      {/each}
    </dl>
  </div>

  <div class="row">
    <hr />
    <div class="label"><Heading>Get in touch</Heading></div>
    <dl class="content contact">
      {#each links as link}
        <div>
          <dt class="mask"><span class="rise">{link.label}</span></dt>
          <dd class="mask">
            <span class="rise"><a href={link.href}>{link.value}</a></span>
          </dd>
        </div>
      {/each}
    </dl>
  </div>

  <div class="row map-row">
    <hr />
    <div class="map-frame">
      <iframe
        class="map"
        title="Map showing Red 13 Ink at {address}"
        src={mapSrc}
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</section>

<style>
  .visit {
    /* same page gutter as about and pricing */
    --gutter: clamp(1rem, 8vw, 10rem);
    padding: var(--gutter) 0;
    color: var(--primary);
  }

  .sr-only {
    position: absolute;
    left: -9999px;
  }

  /* 12-column grid, labels on 1-4, content on 5-12 */
  .row {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    column-gap: 2rem;
    padding-bottom: clamp(3rem, 6vw, 6rem);
  }
  .map-row {
    padding-bottom: 0;
  }

  /* rules are drawn in by the scroll animation */
  hr {
    grid-column: 1 / 13;
    width: 100%;
    margin: 0 0 1.25rem;
  }

  .label {
    grid-column: 1 / 5;

    :global(h1) {
      font-size: 3rem;
      font-weight: 600;
      line-height: 1;
    }
  }
  .content {
    grid-column: 5 / 13;
    margin: 0;
  }
  dl,
  dd {
    margin: 0;
  }

  /* masks hide the text until it rises into view */
  .mask {
    display: block;
    overflow: hidden;
  }
  .rise {
    display: block;
  }

  /* Address: the one big statement, in the same light Archivo as Paragraph */
  .address {
    font-size: clamp(2.5rem, 6vw, 6rem);
    font-weight: 200;
    line-height: 1.05;
    font-style: normal;
  }

  /* Week strip */
  .week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    column-gap: 1rem;
  }
  .day hr {
    margin-bottom: 0.75rem;
  }
  .day dt {
    font-size: 1.25rem;
    font-weight: 200;
    margin-bottom: 1.5rem;
  }
  /* times set in Graduate like the pricing figures */
  .day dd {
    font-family: "Graduate";
    font-size: clamp(1.25rem, 2vw, 2rem);
    line-height: 1.1;
  }
  .time {
    display: block;
  }
  .day.closed dd {
    font-family: "Archivo";
    font-weight: 200;
  }
  .day.closed {
    opacity: 0.4;
  }

  /* Contact */
  .contact {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 2rem;
  }
  .contact dt {
    font-size: 1.25rem;
    font-weight: 200;
    margin-bottom: 0.5rem;
  }
  .contact dd {
    font-size: clamp(1.25rem, 2vw, 2rem);
    font-weight: 400;
    /* room for the underline inside the mask */
    padding-bottom: 4px;
  }
  a {
    text-decoration: none;
    border-bottom: 2px solid currentColor;
  }
  a:hover {
    border-bottom-color: transparent;
  }
  a:focus-visible {
    outline: 3px solid var(--primary);
    outline-offset: 4px;
  }

  /* Map, wiped open from the bottom by the scroll animation */
  .map-frame {
    grid-column: 1 / 13;
    clip-path: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%);
  }
  .map {
    display: block;
    aspect-ratio: 21 / 8;
    border: 0;
    width: 100%;
    filter: grayscale(1) contrast(1.05);
    mix-blend-mode: multiply;
  }

  @media (max-width: 900px) {
    .label,
    .content {
      grid-column: 1 / 13;
    }
    .label {
      margin-bottom: 1rem;
    }
    .contact {
      grid-template-columns: 1fr;
      row-gap: 1.25rem;
    }
    .week {
      grid-template-columns: 1fr;
    }
    .day {
      display: grid;
      grid-template-columns: 1fr auto;
      padding-bottom: 0.5rem;
    }
    .day hr {
      grid-column: 1 / 3;
    }
    .day dt {
      margin: 0;
    }
    /* times sit side by side instead of stacked */
    .day dd .time {
      display: inline;
    }
    .map {
      aspect-ratio: 4 / 3;
    }
  }

  /* phone: matches the about page's small-screen sizes */
  @media (max-width: 600px) {
    .label :global(h1) {
      font-size: 2.2rem;
    }
    .address {
      font-size: 2.2rem;
    }
    .day dt,
    .contact dt {
      font-size: 1.1rem;
    }
  }
</style>

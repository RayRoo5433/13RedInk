<script>
  // Placeholder details, confirm with the studio
  const address = "7D Commercial Road, Grantham, NG31 6DB";
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`;

  const links = [
    {
      label: "Email",
      value: "hello@red13ink.co.uk",
      href: "mailto:hello@red13ink.co.uk",
    },
    { label: "Instagram", value: "@red13ink", href: "https://instagram.com/" },
    { label: "Facebook", value: "Red 13 Ink", href: "https://facebook.com/" },
  ];

  const hours = [
    { days: "Mon", time: "Closed" },
    { days: "Tue to Fri", time: "10:00 to 18:00" },
    { days: "Sat", time: "10:00 to 16:00" },
    { days: "Sun", time: "Closed" },
  ];
</script>

<section id="contact">
  <h1>Contact</h1>

  <div class="grid">
    <div class="box">
      <h2>Get in touch</h2>
      <p>{address}</p>
      {#each links as link}
        <p>{link.label}: <a href={link.href}>{link.value}</a></p>
      {/each}
    </div>

    <div class="box">
      <h2>Opening times</h2>
      {#each hours as h}
        <p>{h.days}: {h.time}</p>
      {/each}
    </div>
  </div>

  <iframe
    title="Map showing Red 13 Ink at {address}"
    src={mapSrc}
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
  ></iframe>
</section>

<style>
  #contact {
    --gutter: clamp(1rem, 8vw, 10rem);
    gap: var(--gutter);
    padding: var(--gutter);
    height: 100vh;
    box-sizing: border-box;
    align-items: center;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .box {
    background: #ddd;
    padding: 16px;
  }

  iframe {
    display: block;
    width: 100%;
    height: 350px;
    border: 0;
    margin-top: 16px;
    background: #ccc;
  }
</style>

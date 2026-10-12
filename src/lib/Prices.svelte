<script>
  // Placeholder figures, confirm with the studio
  const cards = [
    {
      name: "Shop minimum",
      price: "£50",
      unit: "per tattoo",
      blurb: "Small, simple pieces.",
    },
    {
      name: "Hourly",
      price: "£80",
      unit: "per hour",
      blurb: "Custom work, quoted at consult.",
    },
    {
      name: "Day session",
      price: "£450",
      unit: "up to 6 hours",
      blurb: "Sleeves and big projects.",
    },
    {
      name: "Flash",
      price: "From £60",
      unit: "fixed price",
      blurb: "Ready-drawn designs.",
    },
  ];
</script>

<section id="pricing">
  <h1>Pricing</h1>

  <div class="cards">
    {#each cards as card}
      <div class="card">
        <h2>{card.name}</h2>
        <p class="price">{card.price} <small>{card.unit}</small></p>
        <p>{card.blurb}</p>
        <a href="#contact">Book</a>
      </div>
    {/each}
  </div>

  <p class="deposit">£30 deposit on all bookings, comes off the final price.</p>
</section>

<style>
  #pricing {
    --gutter: clamp(1rem, 8vw, 10rem);
    gap: var(--gutter);
    padding: var(--gutter);
    box-sizing: border-box;
    height: 95vh;

    h1 {
      margin: 0 auto;
      text-align: center;
    }

    .cards {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      height: 100%;
    }

    .card {
      background: #ddd;
      padding: 16px;
    }

    .price {
      font-size: 2rem;
    }

    .deposit {
      background: #eee;
      padding: 16px;
      margin-top: 16px;
    }
  }
</style>

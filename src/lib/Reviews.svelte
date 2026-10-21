<script>
  import { onMount } from "svelte";
  import moment from "moment";
  import Rating from "./Rating.svelte";

  // @ts-ignore
  let items = $state([]);

  onMount(async () => {
    const response = await fetch("/api/reviews");
    console.log(response);

    items = await response.json();
    items = items.sort((a, b) => b.date - a.date);
    console.log(items);

    // Triple items for seamless infinite loop
    items = [...items, ...items, ...items];
  });
</script>

<wrapper>
  <container>
    {#each items as item}
      <card>
        <Rating score={5} />
        <p>{item.text}</p>
        <section>
          <img src={item.photo} alt="smthn" />
          <div>
            <h1>{item.name}</h1>
            <span>{moment(item.date).fromNow()}</span>
          </div>
        </section>
      </card>
    {/each}
  </container>
</wrapper>

<style>
  /* custom tags are inline by default, so width/overflow don't apply without this */
  wrapper,
  container,
  card {
    display: block;
    box-sizing: border-box;
  }

  wrapper {
    /* overflow: hidden; */
    width: 100%;
  }

  wrapper:hover container {
    animation-play-state: paused;
  }

  container {
    display: flex;
    width: max-content;
    gap: 1rem;
    animation: scroll 60s linear infinite;
    border-top: 1px solid var(--primary);
    padding-top: 2rem;
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-33.33%);
    }
  }

  card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(20rem, 80vw);
    background-color: var(--secondary);
    border: 1px solid var(--primary);
    border-radius: 8px;
    padding: 1rem;
    flex-shrink: 0;
    transition: 0.2s ease-in-out;
    z-index: 1;

    /* cap long reviews so one essay doesn't set the height of every card */
    p {
      font-weight: 200;
      font-size: 0.5em;
      margin: 0.25rem 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
    }

    /* pushed to the bottom of the card so authors line up across cards */
    section {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
      margin-top: auto;
      padding-top: 0.5rem;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }

      div {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      h1 {
        padding: 0;
        margin: 0;
        font-size: 0.95rem;
      }

      span {
        font-size: 0.75rem;
        color: var(--primary);
      }
    }
  }

  card:hover {
    transform: scale(1.03) translate(0rem, -1rem);
  }

  card::before {
    content: "";
    position: absolute;
    background-color: var(--secondary);
    border-radius: 8px;
    z-index: 1;
    inset: 0;
  }

  card::after {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: var(--primary);
    border-radius: 8px;
    transition: 0.3s ease-in-out;
    z-index: -1;
    opacity: 0;
  }

  card:hover::after {
    transform: translate(0rem, 1rem) scale(0.970874);
    opacity: 0.8;
  }

  card * {
    position: relative;
    z-index: 2 !important;
  }
</style>

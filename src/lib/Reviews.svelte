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
        <Rating score={item.rating} />
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
    overflow: hidden;
    width: 100%;
  }

  wrapper:hover container {
    animation-play-state: paused;
  }

  container {
    display: flex;
    width: max-content;
    gap: 1rem;
    animation: scroll 30s linear infinite;
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
    display: flex;
    flex-direction: column;
    width: min(20rem, 80vw);
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    background: #fafafa;
    flex-shrink: 0;

    /* cap long reviews so one essay doesn't set the height of every card */
    p {
      font-weight: 200;
      font-size: 0.5em;
      margin: 0.25rem 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      line-clamp: 4;
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
        color: #6b7280;
      }
    }
  }
</style>

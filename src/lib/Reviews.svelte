<script>
    import { onMount } from "svelte";

    // @ts-ignore
    let items = $state([]);

    onMount(async () => {
        const response = await fetch("/api/reviews");
        console.log(response);

        items = await response.json();
        console.log(items);
    });
</script>

<container>
    {#each items as item}
        <card>
            <section>
                <h1>{item.name}</h1>
                <p>{item.rating}</p>
            </section>
            <p>{item.text}</p>
            <span>{item.date}</span>
        </card>
    {/each}
</container>

<style>
    container {
        display: flex;
        flex-direction: row;
        width: 200vw;

        card {
            width: 100%;
            section {
                display: flex;
                flex-direction: row;
                font-size: 0.5rem;

                h1 {
                    padding: 0%;
                    margin: 0%;
                }

                p {
                    padding: 0%;
                    margin: 0%;
                }
            }
        }
    }
</style>

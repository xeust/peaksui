<script>
    import Nav from "./Nav.svelte";
    import {get} from "./api.js";
    import BetaFull from "./BetaFull.svelte"
    import GaussianFull from "./GaussianFull.svelte";
    export let key;
    let promise = get(key);
</script>

<main>
    {#await promise}
    <Nav />
    <code class="loading">Loading</code>
    {:then exp}
 
        {#if exp.experiment_type === "beta_binomial"}
        <Nav />
            <BetaFull interventions={exp.interventions}/>
        {:else}
        <Nav />
        <GaussianFull interventions={exp.interventions}/>
        {/if}
    {:catch error}
    <Nav />
    <p style="color: red">{error.message}</p>
    {/await}
</main>
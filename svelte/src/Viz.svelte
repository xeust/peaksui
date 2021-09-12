<script>
    import Nav from "./Nav.svelte";
    import {get} from "./api.js";
    import BetaFig from "./BetaFig.svelte"
    import GaussianFig from "./GaussianFig.svelte";
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
            <BetaFig width={992} height={700} margin={40} size="l" interventions={exp.interventions}/>
        {:else}
        <Nav />
        <GaussianFig width={992} height={700} margin={40} size="l" interventions={exp.interventions} />
        {/if}
    {:catch error}
    <Nav />
    <p style="color: red">{error.message}</p>
    {/await}
</main>
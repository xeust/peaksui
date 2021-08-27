<script>
    export let interventions;
    export let colors;
</script>

<div>
    {#each interventions as {intervention_name} }
      <div style="color: {colors(intervention_name)}">
          intervention_name
      </div>
    {/each}
</div>
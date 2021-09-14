<script>
  import BetaFig from "./BetaFig.svelte";
  import GaussianFig from "./GaussianFig.svelte";
  export let exp;

  function goToExp() {
    window.location.href = `./experiment/${exp.key}`;
  }
</script>

<div class="card-border" on:click={goToExp}>
  <div class="content">
    <div class="fig">
      <!-- <img
        src={`${window.location.origin}/private/experiments/${exp.key}/viz`}
        alt={exp.key}
      /> -->
      {#if exp.experiment_type === "beta_binomial"}
        <BetaFig width={150} height={170} margin={20} size="s" interventions={exp.interventions} />
      {:else}
        <GaussianFig width={150} height={170} margin={20} size="s" interventions={exp.interventions} />
      {/if}
    </div>
    <div class="info">
      <div class="name">
        {exp.name}
      </div>
      <div class="stats">
        <div>
          {exp.trials} trials, {exp.arms} arms
        </div>
        <button class="arrow" on:click={goToExp} tabindex="0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 8H15"
              stroke="#63678B"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 1L15 8L8 15"
              stroke="#63678B"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .card-border {
    cursor: pointer;
    height: 250px;
    width: 200px;
    border: 1px solid var(--p0);
    border-radius: 2%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    color: var(--z2);
    background-color: #ffffff;
  }
  .card-border:hover {
    cursor: pointer;
    border: 1px solid var(--p1);
  }
  .card-border:hover .name {
    color: var(--z0);
  }
  .arrow {
    width: auto;
    height: auto;
    background-color: #ffffff;
    border: none;
    padding: 0rem;
  }
  .arrow:focus {
    border: 1px solid var(--p1);
  }
  .card-border:hover .info {
    border-top: 1px solid var(--p1);
  }
  .card-border:hover .arrow {
    color: var(--p0);
  }
  .content {
    max-width: 95%;
    margin: 10px auto;
    padding: 0 10px;
  }
  .stats {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
  }
  .info {
    max-width: 150px;
    padding-top: 0.5rem;
    border-top: 1px solid var(--p0);
  }
  .name {
    font-size: 18px;
    padding-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

<script>
  import Nav from "./Nav.svelte";
  import Card from "./Card.svelte";
  import { DialogOverlay, DialogContent } from "svelte-accessible-dialog";

  import { list, betaBinomial, gaussian, createBetaBinomial, createGaussian, convertExperiment} from "./api.js";
  import { validateCreate } from "./validators";

  let create = {"beta_binomial": createBetaBinomial, "gaussian": createGaussian}
  let newExperiment = {
    name: "",
    experiment_type: "beta_binomial",
    id_consistency: false,
    interventions: [
      {
        intervention_name: "",
        num_played: 0,
        num_successes: 0
      }
    ],
  }
  
  let errMsg = "";

  let isOpen;

  const open = () => {
    isOpen = true;
    // required to remove blur on button
    document.activeElement.blur();
  };
  const close = () => {
    isOpen = false;
  };

  let expsPromise = list();

  const createHandler = async () => {
    if (!validateCreate(newExperiment)) {
      errMsg = "Empty fields. Please try again.";
      return;
    }
    let exp = convertExperiment(newExperiment);

    const res = await create[exp.experiment_type](exp);
    if (res.status === 200) {
          errMsg = "";
          const bod = await res.json();
          window.location.href = `/experiment/${bod.key}`;
          return;
    }
    errMsg = "Failed to create a new experiment.";
    return;
  }

  const addOption = () => {
    let newOptions = newExperiment.interventions;
    newOptions.push({ intervention_name: "", num_played: 0, num_successes: 0 });
    newExperiment.interventions = newOptions;
  }
  
  const removeOption = () => {
    newExperiment.interventions = newExperiment.interventions.filter(
      (element, index) =>
        index < newExperiment.interventions.length - 1
    );
  }
</script>

<main>
  {#await expsPromise}
    <Nav />
    <code class="loading">Loading...</code>
  {:then exps}
    <Nav />
    <div class="header">
      <div class="header-text">experiments</div>

      <button class="new-button" on:click={open} tabindex="0"> + new </button>
    </div>
    <div class="card-wrapper">
      {#each exps as exp}
        <Card {exp} />
      {/each}
    </div>
  {:catch error}
    <Nav />
    <code class="loading"> Failed to fetch experiments. Please try reloading the page. </code>
  {/await}

  <DialogOverlay
    {isOpen}
    onDismiss={close}
    style="      position: fixed;
  padding:0;
  margin:0;

  z-index: 1000;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background:rgba(255,255,255,0.75);
  overflow: auto;
  align-items: center;"
  >
    <DialogContent
      style="  
      padding:0;
      margin:0;
      background:transparent;
      width:auto;
   "
      aria-label="Announcement"
    >
      <div class="modal-wrapper">
        <div class="modal-tag">create an experiment</div>

        <div class="modal-title-row">
          <div class="label">name</div>
          <input
            class="name-input"
            bind:value={newExperiment.name}
            placeholder="experiment name"
          />
        </div>
        <div class="modal-title-row">
          <div class="label">type</div>
          <select bind:value={newExperiment.experiment_type} >
            <option value="beta_binomial"> beta binomial</option>
            <option value="gaussian"> gaussian</option>
          </select>
        </div>
        {#if newExperiment.experiment_type === "beta_binomial"}
        These are experiments in which the outcome can have one of two (yes / no) values.
        {:else}
        These are experiments in which the outcome can have any (real) value.
        {/if}

        <div class="modal-title-row">
          <div class="label">id consistency</div>
          <input class="consistency-input" bind:checked={newExperiment.id_consistency} type=checkbox >
        </div>

        {#if newExperiment.id_consistency}
        <span>
          Once a user of a given <code style="color:var(--r0)">user_id</code> has been assigned an intervention, they will continue to see this intervention.
        </span>
        {:else}
        <div>
          With no id consistency, every call to <code style="color:var(--r0)">get_intervention</code> will return a randomly drawn sample according to the likelihood of that intervention being optimal.
        </div>
        {/if}
        <div class="options">options</div>
        Add as many possible interventions as you want.
        <div id="options-grid" class="options-grid">
          {#each newExperiment.interventions as option, i}
            <div class="modal-form-row">
              <div class="sec-label center">option {i}</div>
              <input
                class="options-input"
                bind:value={newExperiment.interventions[i].intervention_name}
                placeholder="option name"
              />
            </div>
          {/each}
        </div>

        <div class="options-tools">
          <button class="add-option" on:click={addOption}>+ option</button>
          <button
            class="remove-option"
            on:click={removeOption}
          >
            - option
          </button>
        </div>
        <div class="error-msg">
          {errMsg}
        </div>

        <div class="modal-buttons">
          <button class="cta-button" on:click={createHandler}> create </button>
          <button class="cancel-button" on:click={close}> cancel </button>
        </div>
      </div>
    </DialogContent>
  </DialogOverlay>
</main>

<style>
  :global(body) {
    font-family: "Helvetica Neue", "Roboto Mono", Arial;
    background-color: var(--color-bg);
    max-width: 992px;
    margin: 20px auto;
    padding: 0 10px;
    color: var(--z1);
  }
  .card-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    justify-content: space-between;
    column-gap: 1rem;
    row-gap: 3rem;
    padding-bottom: 3rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
    margin-bottom: 3rem;
  }
  .options-grid {
    margin-top: 1rem;
  }
  .header-text {
    font-size: 36px;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .consistency-input {
    width: 18px;
    height: 18px;
  }
  .error-msg {
    font-size: 18px;
    font-weight: 700;
    color: var(--r1);
    padding-top: 1rem;
  }
  .modal-tag {
    font-size: 36px;
    font-weight: 400;
    color: var(--z0);
    margin-bottom: 2rem;
  }
  .modal-title-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .modal-form-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .label {
    font-weight: 400;
    font-size: 24px;
    color: var(--z0);
  }
  .sec-label {
    color: var(--z2);
    font-weight: 400;
    font-size: 18px;
  }
  .modal-buttons {
    display: flex;
    margin-top: 1rem;
    justify-content: flex-end;
    gap: 1rem;
  }
  .options-tools {
    display: flex;
    gap: 1rem;
  }
  .remove-option {
    border: 1px solid var(--r0);
    color: var(--z2);
    font-size: 18px;
    width: 90px;
    height: 30px;
    background: #ffffff;
  }
  .remove-option:hover {
    cursor: pointer;
    border: 1px solid var(--r1);
    color: var(--r1);
  }
  .remove-option:focus {
    cursor: pointer;
    border: 1px solid var(--r1);
    color: var(--r1);
  }
  .add-option {
    font-size: 18px;
    width: 90px;
    height: 30px;
  }
  .options {
    font-weight: 400;
    font-size: 24px;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--z0);
  }
  .cta-button {
    color: #ffffff;
    border: none;
    font-size: 24px;
    background: var(--p0);
  }
  .cta-button:hover {
    color: #ffffff;
    background: var(--p1);
  }
  .cta-button:focus {
    color: #ffffff;
    background: var(--p1);
  }
  .cancel-button {
    border: 1px solid var(--r0);
    color: var(--z2);
    font-size: 24px;
    background: #ffffff;
  }
  .cancel-button:hover {
    cursor: pointer;
    border: 1px solid var(--r1);
    color: var(--r1);
  }
  .cancel-button:focus {
    cursor: pointer;
    border: 1px solid var(--r1);
    color: var(--r1);
  }

  input {
    background: #ffffff;
    border: 1px solid var(--p0);
    color: var(--z2);
    font-size: 24px;
    box-sizing: border-box;
    border-radius: 5px;
    align-self: center;
    outline: none;
    padding-left: 8px;
    padding-right: 8px;
  }
  input:focus {
    border: 1px solid var(--p1);
    color: var(--z0);
  }
  .name-input {
    height: 40px;
    width: 300px;
  }
  .options-input {
    height: 30px;
    font-size: 18px;
    width: 300px;
  }
  .modal-wrapper {
    display: flex;
    flex-direction: column;
    padding-right: 48px;
    padding-top: 48px;
    padding-bottom: 48px;
    padding-left: 48px;
    border: 1px solid var(--p0);
    background-color: var(--color-bg);
    border-radius: 5px;
    overflow-y: scroll;
  }
  @media only screen and (min-width: 768px) {
    .modal-wrapper {
      width: 650px;
      min-height: 400px;
      max-height: 550px;
    }
  }
  @media (min-width: 460px) and (max-width: 768px) {
    .modal-wrapper {
      width: 400px;
      height: 340px;
    }

  }
  @media (max-width: 460px) {
    .modal-wrapper {
      width: calc(80vw);
      height: calc(70vh);
      font-size: 10px;
      padding-right: 24px;
      padding-top: 24px;
      padding-bottom: 24px;
      padding-left: 24px;
    }
  }

  @media (max-width: 500px) {
    :global(body) {
      width: 95vw;
    }
    .modal-wrapper {
      width: calc(80vw);
      height: calc(70vh);
      font-size: 10px;
      padding-right: 24px;
      padding-top: 24px;
      padding-bottom: 24px;
      padding-left: 24px;
    }
    .modal-buttons {
      justify-content: center;
    }
    .label {
      margin-bottom: 0.25rem;
    }
    .sec-label {
      margin-bottom: 0.5rem;
    }
    .options-tools {
      margin-top: 0.5rem;
    }
    .modal-form-row {
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
  }
</style>

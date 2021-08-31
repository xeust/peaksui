<script>
  import { DialogOverlay, DialogContent } from "svelte-accessible-dialog";

  import {
    get,
    codeSnippet,
    armProbability,
    sample,
    del,
    getInterventionMean,
    getInterventionStd,
    updateConsistency,
  } from "./api.js";
  import Nav from "./Nav.svelte";
  import BetaFig from "./BetaFig.svelte";
  import GaussianFig from "./GaussianFig.svelte";
  export let key;

  let copySnippetStatus = "copy snippet";
  let sampleBtn = "try it out!";
  let sampleValue = "";
  let selected;
  let userId = "";
  let userConsistencyId = "";
  let deleteExperiment = false;
  let removeConsistency = false;
  let deleteErrMsg = "";
  let removeErrMsg = "";
  let promise = get(key);
  let language = "PY";
  let isOpen;


  const open = () => {
    isOpen = true;
    // required console.log to remove blur on button
    console.log(document.activeElement.blur());
  };
  const close = () => {
    isOpen = false;
  };

  async function copySnippet() {
    const snippet = document.getElementById("snippet").innerHTML;
    try {
      const isCopied = await navigator.clipboard.writeText(snippet);
      copySnippetStatus = "copied!";
      setTimeout(function () {
        copySnippetStatus = "copy snippet";
      }, 3000);
    } catch (error) {
      copySnippetStatus = "failed to copy. try again";
      setTimeout(function () {
        copySnippetStatus = "copy snippet";
      }, 3000);
    }
  }

  async function sampleHandler(key, id_consistency) {
    try {
      if (id_consistency && userId == "") {
        sampleBtn = "empty user id. please try again!";
        setTimeout(function () {
          sampleBtn = "try it out!";

        }, 3000);
      } else {
        sampleValue = id_consistency
          ? await sample(key, userId)
          : await sample(key);
        sampleBtn = "try it out: "
        setTimeout(function () {
          sampleBtn = "try it out!";
          sampleValue = "";
        }, 3000);
      }
    } catch (error) {
      sampleBtn = "failed to sample option. try again";
      setTimeout(function () {
        sampleBtn = "try it out!";
      }, 3000);
    }
  }
  async function confirmDelete() {
    try {
      const res = await del(key);
      deleteErrMsg = "";
      window.location.href = "/";
    } catch (error) {
      deleteErrMsg = "Failed to delete experiment. Please try again.";
    }
  }
  async function confirmRemove() {
    try {
      if (userConsistencyId === "") {
        throw new Error(
          "Please provide a valid user id to remove the consistency."
        );
      }
      const res = await updateConsistency(key, userConsistencyId);
      removeErrMsg = "";
      close();
    } catch (error) {
      removeErrMsg = error.message;
    }
  }
</script>

<main>
  {#await promise}
    <Nav />
    <code class="loading">Loading</code>
  {:then exp}
    <Nav />
    <div class="exp">
      <div class="header">
        <div class="exp-title">
          {exp.name}
        </div>
        <button on:click={open} tabindex="0"> settings </button>
      </div>

      <div class="exp-sum-tag tag">summary</div>
      <div class="exp-sum">
        <div class="exp-fig">
          <!-- Image content -->
          <!-- <div class="fig">
            <img
              src={`${window.location.origin}/private/experiments/${exp.key}/viz`}
              alt={key}
            />
          </div> -->
          {#if exp.experiment_type == "beta_binomial"}
            <BetaFig interventions={exp.interventions} />
          {:else}
            <GaussianFig interventions={exp.interventions} />
          {/if}

          <div id="vis" />
          <a
            class="link large-screen"
            href={`${window.location.origin}/viz/${exp.key}`}
          >
            open image in new tab →
          </a>
        </div>
        <div class="exp-stats">
          <div class="exp-stat">type: {exp.type}</div>
          <div class="exp-stat">id consistency: {exp.id_consistency}</div>
          <div class="exp-stat">options: {exp.arms}</div>
          <div class="exp-stat">trials: {exp.trials}</div>
          {#if exp.experiment_type == "beta_binomial"}
            <div class="exp-stat">successes: {exp.successes}</div>
          {/if}
        </div>
      </div>
      <a
        class="link small-screen"
        href={`${window.location.origin}/viz/${exp.key}`}
      >
        open image in new tab →
      </a>
      <div class="api">
        <div class="sampling">
          <div class="tag">sampling</div>
          <div class="random">
            {#if exp.id_consistency}
              <div class="req-info">
                send a GET request to the following URL to sample an option
                (please provide a user id to the end of the url):
              </div>
            {:else}
              <div class="req-info">
                send a GET request to the following URL to sample an option:
              </div>
            {/if}

            <div class="code inline-code" tabindex="0">
              {#if exp.id_consistency}
                {window.location
                  .origin}/public/experiments/{exp.key}/get_intervention?user_id=
                <input
                  type="text"
                  class="user_id"
                  name="user_id"
                  bind:value={userId}
                />
              {:else}
                {window.location
                  .origin}/public/experiments/{exp.key}/get_intervention
              {/if}
            </div>
            <div class="row">
              <div
              class="sample_btn link"
              on:click={() => sampleHandler(exp.key, exp.id_consistency)}
            >
              {sampleBtn}
            </div>
            <div>
              {sampleValue}
            </div>
            </div>

          </div>
        </div>
        <div class="options">
          <div class="tag">options & updating your experiment</div>
          <div class="options-content">
            <div class="options-info">
              <div class="select-option">
                <div class="label">select an option:</div>
                <select bind:value={selected}>
                  {#each exp.interventions as intervention}
                    <option value={intervention.intervention_name}
                      >{intervention.intervention_name}</option
                    >
                  {/each}
                </select>
              </div>
              <div class="info">
                {#if exp.experiment_type == "beta_binomial" && armProbability(exp.interventions, selected)}
                  {selected} has a {armProbability(
                    exp.interventions,
                    selected
                  )}% probability of success.
                {/if}
                {#if exp.experiment_type == "gaussian"}
                  mean: {Number.parseFloat(
                    getInterventionMean(exp.interventions, selected)
                  ).toFixed(3)}
                  <br />
                  standard deviation: {Number.parseFloat(
                    getInterventionStd(exp.interventions, selected)
                  ).toFixed(3)}
                {/if}
              </div>
              <div class="info">
                To update your experiment with a successful trial of option ‘{selected}’,
                copy the code snippet and use it to make an api call whenever
                option ‘{selected}’ successfully is activated in the wild.
              </div>
            </div>
            <div />
            <div>
              <div class="code-snippet" tabindex="0">
                <pre><code class="code snippet" id ="snippet">
                  {codeSnippet(exp.key, selected, language)}
                </code></pre>
              </div>
              <div class="code-actions">
                <select bind:value={language}>
                  <option value="PY"> python </option>
                  <option value="JS"> javascript </option>
                </select>
                <button
                  class="link copy-button"
                  on:click={copySnippet}
                  tabindex="0"
                >
                  {copySnippetStatus}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
          <div class="modal-tag">settings</div>
          {#if exp.id_consistency}
            <div class="setting-tag">remove id consistency for a user</div>
            <input
              class="remove-user-input"
              type="text"
              placeholder="user id"
              bind:value={userConsistencyId}
            />
            <div class="setting-row">
              <input
                class="confirm-checkbox"
                type="checkbox"
                bind:checked={removeConsistency}
              />
              <div class="setting-msg">
                I confirm I want to remove id consistency for this user
              </div>
              {#if removeConsistency}
                <button class="delete-button" on:click={confirmRemove}>
                  delete
                </button>
              {:else}
                <button class="delete-button" on:click={confirmRemove} disabled>
                  delete
                </button>
              {/if}
            </div>
            <div class="error-msg">
              {removeErrMsg}
            </div>
          {/if}

          <div class="setting-tag">delete experiment</div>
          <div class="setting-row">
            <input
              class="confirm-checkbox"
              type="checkbox"
              bind:checked={deleteExperiment}
            />
            <div class="setting-msg">
              I confirm I want to delete experiment '{exp.name}'
            </div>

            {#if deleteExperiment}
              <button class="delete-button" on:click={confirmDelete}>
                delete
              </button>
            {:else}
              <button class="delete-button" on:click={confirmDelete} disabled>
                delete
              </button>
            {/if}
          </div>
          <div class="error-msg">
            {deleteErrMsg}
          </div>
        </div>
      </DialogContent>
    </DialogOverlay>
  {:catch error}
    <Nav />
    <p style="color: red">{error.message}</p>

    <code> Failed to fetch experiment data. Please try again. </code>
  {/await}
</main>

<style>
  .exp {
    margin-top: 3rem;
  }
  .exp-title {
    font-size: 36px;
    font-weight: 400;
    color: var(--z0);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .header {
    display: flex;
    justify-content: space-between;
  }
  .tag {
    font-size: 24px;
    font-weight: 400;
    color: var(--z0);
  }
  .exp-sum-tag {
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;
  }
.row{
  margin-top: 1rem;
  display:flex;
  font-size: 14px;
  font-weight: 400;
  flex-direction: row;
}
  .copy-button {
    width: auto;
    height: auto;
    border: none;
    background-color: var(--color-bg);
    padding: 0rem;
  }
  .copy-button:focus {
    border: 1px solid var(--p1);
  }

  .delete-button:disabled {
    color: var(--z2);
    border-color: var(--z2);
  }
  .delete-button:hover:disabled {
    color: var(--z2);
    border-color: var(--z2);
  }
  .exp-sum {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .remove-user-input {
    outline: none;
    font-family: monospace;
    background-color: #ffffff;
    border: 1px solid var(--p0);
    color: var(--z2);
    box-sizing: border-box;
    border-radius: 5px;
    margin-bottom: 1rem;
    font-size: 18px;
    width: fit-content;
  }
  .remove-user-input:focus {
    border: 1px solid var(--p1);
    color: var(--z0);
  }
  /* 
  .fig {
    width: 450px;
    height: 356px;
    border: 1px solid var(--z0);
  }

  img {
    width: 450px;
    height: 356px;
    object-fit: contain;
  } */
  .exp-stats {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .exp-stat {
    font-size: 24px;
    font-weight: 300px;
    color: var(--z2);
  }
  .error-msg {
    font-size: 18px;
    font-weight: 700;
    color: var(--r1);
    margin-top: 1rem;
  }
  .api {
    margin-top: 3rem;
  }
  .req-info {
    margin-top: 2rem;
    margin-bottom: 2rem;
    color: var(--z1);
  }
  .inline-code {
    padding: 0.5rem;
    overflow-wrap: break-word;
  }
  .user_id {
    border: none;
    outline: none;
    font-family: monospace;
    background-color: #ffffff;
    color: var(--z2);
    margin-left: -7px;
  }
  .options {
    margin-top: 3rem;
    padding-bottom: 3rem;
  }
  .options-content {
    margin-top: 2rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .options-info {
    width: 400px;
    color: var(--z1);
  }

  a {
    color: var(--p1);
  }
  .select-option {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
  }
  .label {
    align-self: center;
  }

  .info {
    margin-top: 3rem;
  }
  .code-snippet {
    align-self: center;
    width: 422px;
    height: auto;
    border: 1px solid var(--p0);
    background-color: #ffffff;
    box-sizing: border-box;
    border-radius: 5px;
    padding: 1rem 1rem 1rem;
    overflow-wrap: break-word;
  }
  .code-snippet:focus {
    border: 1px solid var(--p1);
  }
  .code-snippet:focus .snippet {
    color: var(--z0);
  }
  select {
    margin: 0rem;
  }
  .snippet {
    white-space: pre-wrap;
    border: none;
  }
  .code-actions {
    display: flex;
    justify-content: space-between;
  }
  @media (min-width: 708px) {
    .small-screen {
      display: inherit;
    }
    .large-screen {
      display: none;
    }
  }
  @media (max-width: 708px) {
    .small-screen {
      display: none;
    }
    .large-screen {
      display: inherit;
    }
  }
  @media only screen and (max-width: 708px) {
    /* .fig {
      width: 390px;
      height: 356px;
      border: 1px solid var(--z0);
    }
    img {
      width: 390px;
      height: 356px;
      object-fit: contain;
    } */
    .exp-stats {
      margin-top: 2rem;
      height: 356px;
    }
    .info {
      margin-top: 1rem;
    }
  }
  @media only screen and (max-width: 500px) {
    .code-snippet {
      width: 390px;
    }
  }
  @media only screen and (max-width: 400px) {
    .code-snippet {
      padding: 0rem 0rem 0rem;
      width: 90vw;
    }
    /* .fig {
      width: 85vw;
      height: 273px;
      border: 1px solid var(--z0);
    }
    img {
      width: 85vw;
      height: 273px;
      object-fit: contain;
    } */
    .options-info {
      max-width: 95vw;
    }
    .code-snippet {
      padding: 1rem 1rem 1rem;
    }
  }
  @media only screen and (max-width: 844px) {
    .code-snippet {
      margin-top: 1rem;
    }
  }
  .modal-tag {
    font-size: 36px;
    font-weight: 400;
    color: var(--z0);
    margin-bottom: 2rem;
  }
  .confirm-checkbox {
    width: 18px;
    height: 18px;
  }
  .setting-tag {
    margin-top: 2rem;
    font-size: 24px;
    color: var(--z1);
    margin-bottom: 2rem;
  }
  .setting-row {
    display: flex;
    gap: 0.5rem;
    flex-direction: row;
  }
  .setting-msg {
    align-self: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 18px;
  }
  .delete-button {
    height: 25px;
    width: 75px;

    border: 1px solid var(--r0);
    color: var(--z2);
    font-size: 18px;
    background: #ffffff;
  }
  .delete-button:hover {
    cursor: pointer;
    border: 1px solid var(--r1);
    color: var(--r1);
  }
  .delete-button:focus {
    cursor: pointer;
    border: 1px solid var(--r1);
    color: var(--r1);
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
  @media only screen and (max-width: 365px) {
    .options-info {
      max-width: 95vw;
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
    .setting-msg {
      font-size: 12px;
    }
    .confirm-checkbox {
      min-width: 12px;
      min-height: 12px;
    }
    .delete-button {
      font-size: 12px;
    }
  }

  @media (max-width: 500px) {
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
</style>

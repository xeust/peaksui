<script>
  import { getExperiment, codeSnippet, armProbability } from "./api.js";

  import Nav from "./Nav.svelte";

  export let key;
  let copySnippetStatus = "copy snippet";
  let promise = getExperiment(key);
  let selected;

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
</script>

<main>
  {#await promise}
    <Nav />
    <code>Loading</code>
  {:then exp}
    <Nav />
    <div class="exp">
      <div class="exp-title">
        {key}
      </div>
      <div class="exp-sum-tag tag">summary</div>
      <div class="exp-sum">
        <div class="exp-fig">
          <!-- Image content -->
          <div class="fig">
            <img
              src={`${window.location.origin}/public/experiments/${exp.key}/viz`}
              alt={key}
            />
          </div>
          <a class="link large-screen" href={`${window.location.origin}/public/experiments/${exp.key}/viz`}> open image in new tab → </a>
        </div>
        <div class="exp-stats">
          <div class="exp-stat">type: {exp.type}</div>
          <div class="exp-stat">options: {exp.arms}</div>
          <div class="exp-stat">trials: {exp.trials}</div>
          <div class="exp-stat">successes: {exp.successes}</div>
          <div class="exp-stat">suggested arm: {exp.suggested_arm}</div>
        </div>
      </div>
      <a class="link small-screen" href={`${window.location.origin}/public/experiments/${exp.key}/viz`}> open image in new tab → </a>
      <div class="exp-desc">
        experiment description is place holder Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Ut semper, ante vitae aliquam lacinia.
      </div>
      <div class="api">
        <div class="sampling">
          <div class="tag">sampling</div>
          <div class="random">
            <div class="req-info">
              send a GET request to the following URL to sample an option:
            </div>
            <div class="inline-code" tabindex="0">
              {window.location
                .origin}/public/experiments/{exp.key}/get_intervention
            </div>
            <div class="req-info">
              send a GET request to the following URL to get the current optimal
              arm:
            </div>
            <div class="inline-code" tabindex="0">
              {window.location.origin}/public/experiments/{exp.key}/best_arm
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
                {selected} has a {armProbability(exp.interventions, selected)}%
                probability of maximizing click through rate.
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
                <pre><code class="code" id ="snippet">
                  {codeSnippet(exp.key, selected)}
                </code></pre>
              </div>
              <button
                class="link copy-button float"
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
  {:catch error}
    <Nav />
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
  .copy-button {
    width: auto;
    height: auto;
    border: none;
    background-color: var(--color-bg);
    padding:0rem;
  }
  .copy-button:focus {
    border: 1px solid var(--p1);
  }
  .exp-sum {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .float {
    float: right;
  }
  .fig {
    width: 450px;
    height: 356px;
    border: 1px solid var(--z0);
  }

  img {
    width: 450px;
    height: 356px;
    object-fit: contain;
  }
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
  .exp-desc {
    margin-top: 2rem;
    color: var(--z1);
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
    font-family: monospace;
    background-color: #ffffff;
    padding: 0.5rem;
    border: 1px solid var(--p0);
    color: var(--z2);
    box-sizing: border-box;
    border-radius: 5px;
    overflow-wrap: break-word;
  }
  .inline-code:focus {
    border: 1px solid var(--p1);
    color: var(--z0);
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
    width: 422px;
    color: var(--z1);
  }
  code {
    color: var(--z1);
  }
  a {
    color: var(--p1);
  }
  .select-option {
    display: flex;
    flex-direction: row;
    gap:.75rem;
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
    box-sizing: border-box;
    border-radius: 5px;
    padding: 1rem 1rem 1rem;
    overflow-wrap: break-word;
  }
  select {
    margin: 0rem;
  }
  .code {
    white-space: pre-wrap;
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
    .fig {
      width: 390px;
      height: 356px;
      border: 1px solid var(--z0);
    }
    img {
      width: 390px;
      height: 356px;
      object-fit: contain;
    }
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
    .fig {
      width: 85vw;
      height: 273px;
      border: 1px solid var(--z0);
    }
    img {
      width: 85vw;
      height: 273px;
      object-fit: contain;
    }
  }
  @media only screen and (max-width: 844px) {
    .code-snippet {
      margin-top: 1rem;
    }
  }
</style>

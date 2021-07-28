<script>
  import { Router, Route } from "svelte-navigator";
  import Home from "./Home.svelte";
  import Experiment from "./Experiment.svelte";
  import Error from "./Error.svelte";
</script>

<Router primary={false}>
  <Route path="experiment/:key" let:params>
    <Experiment key={params.key} />
  </Route>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/*">
    <Error />
  </Route>
</Router>

<style>
    :root {
    --color-bg: #fafafa;
    --p0: #63678B;
    --p1: #7287ff;
    --z0:#2B2E4A;
    --z1: #515368;
    --z2: #7C7D83;
    --r0: #996262;
    --r1: #B84444;
  }

  :global(.header-text) {
    color: var(--z0);
  }
  :global(.body-text) {
    color: var(--z1);
  }
  :global(.sec-text) {
    color: var(--z2);
  }
  :global(button) {
    padding: 0rem 0.5rem 0rem;
    width: 120px;
    height: 40px;
    border-radius: 4px;
    font-size: 24px;
    align-self: center;
    border: 1px solid var(--p0);
    background-color: #ffffff;
    color: var(--z2);
  }
  :global(button:hover) {
    cursor: pointer;
    border: 1px solid var(--p1);
    color: var(--p1);
  }
  :global(button:focus) {
    cursor: pointer;
    border: 1px solid var(--p1);
    color: var(--p1);
  }
  :global(select) {
    border-radius: 5px;
    background: #ffffff;
    color: var(--z0);
    border: 1px solid var(--p0);
  }
  :global(.link) {
    font-size: 14px;
    font-weight: 400;
    color: var(--p1);
  }
  :global(.link:hover) {
    cursor: pointer;
    text-decoration: underline;
  }
  :global(.loading) {
    font-size: 24px;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }

</style>
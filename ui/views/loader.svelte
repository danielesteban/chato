<script lang="ts">
  import { onMount } from 'svelte';
  import { Models, Model } from 'state/chat';

  let model = '';
  let gpu = true;
  let maxLayers = 100;

  const submit = () => {
    if (!model) {
      return;
    }
    Model.load(model, gpu ? maxLayers : 0);
  };

  onMount(() => Models.list());
  $: if ($Models.length && model == '') model = $Models[0];
</script>

{#if $Model.id && !$Model.loading}
  <slot />
{:else}
  <div class="loader">
    <div class="wrapper">
      <div class="fields">
        <div class="model">
          <label for="model">Model</label>
          <select id="model" bind:value={model}>
            {#each $Models as model}
              <option value={model}>{model}</option>
            {/each}
          </select>
        </div>
        <div class="gpu">
          <label for="GPU">
            GPU
            <input id="GPU" type="checkbox" bind:checked={gpu} />
          </label>
          <div class="layers" class:disabled={!gpu}>
            <label for="maxLayers">Max layers:</label>
            <input id="maxLayers" type="number" min="0" step="1" disabled={!gpu} bind:value={maxLayers} />
          </div>
        </div>
        <div class="submit">
          <button on:click={submit}>
            Load
          </button>
        </div>
      </div>
      <div class="info">
        <a href="https://dani.gatunes.com" rel="noopener noreferrer" target="_blank">dani@gatunes</a> © 2023
      </div>
    </div>
  </div>
  <a class="source" href="https://github.com/danielesteban/chato" target="_blank">
    <svg width="80" height="80" viewBox="0 0 250 250">
      <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
      <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
      <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
    </svg>
  </a>
  {#if $Model.loading}
    <div class="loading">
      {#if $Model.progress < 100}
        <div>Downloading model... <span class="percent">{Math.round($Model.progress)}%</span></div>
      {:else}
        <div>Loading model...</div>
      {/if}
    </div>
  {/if}
{/if}

<style>
  .loader {
    width: 100vw;
    height: 100%;
    display: grid;
    align-items: center;
    justify-content: center;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .fields {
    width: 220px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background: #222;
    border: 1px solid #000;
  }
  .model {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .model > label, .gpu > label, .layers > label {
    line-height: 1rem;
    color: #ddd;
    white-space: nowrap;
  }
  .gpu {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .gpu > label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .layers {
    display: flex;
    gap: 1rem;
  }
  .layers > label {
    display: flex;
    align-items: center;
  }
  .layers.disabled > label {
    color: #a1a1a1;
  }
  .layers > input {
    width: 100%;
  }
  .layers > input:disabled {
    background: #1a1a1a;
    color: #a1a1a1;
  }
  .submit {
    display: flex;
  }
  .submit > button {
    flex-grow: 1;
  }
  .info {
    text-align: center;
    margin: 1rem 0;
    color: #aaa;
    font-size: 0.6875rem;
  }
  .info > a {
    text-decoration: underline;
  }
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(0.5rem);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .percent {
    color: #aaa;
  }
  .source {
    position: fixed;
    top: 0;
    right: 0;
  }
  .source > svg {
    fill: #000;
    color: #fff;
    pointer-events: none;
  }
  .source:hover > svg .octo-arm {
    animation: octocat-wave .56s ease-in-out;
  }
  @keyframes octocat-wave {
    0%,to {
      transform: rotate(0)
    }
    20%,60% {
      transform: rotate(-25deg)
    }
    40%,80% {
      transform: rotate(10deg)
    }
  }
</style>

<script lang="ts">
  import { beforeUpdate, tick } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import code from 'components/code.svelte';
  import link from 'components/link.svelte';
  import { Messages } from 'state/chat';

  const renderers = { code, link };
  
  let scroll: HTMLElement;
  beforeUpdate(async () => {
    if (scroll && scroll.scrollHeight - scroll.clientHeight <= scroll.scrollTop + 1) {
      await tick();
      scroll.scroll({
        top: scroll.scrollHeight,
        behavior: 'instant',
      });
    }
  });
</script>

<div bind:this={scroll} class="scroll">
  <div class="messages">
    {#each $Messages as message}
      <div class="message" class:response={message.isResponse}>
        <SvelteMarkdown {renderers} source={message.text} />
      </div>
    {/each}
  </div>
</div>

<style>
  .scroll {
    display: grid;
    grid-template-columns: minmax(auto, 900px);
    justify-content: center;
    overflow-y: scroll;
  }
  .messages {
    display: grid;
    grid-auto-rows: max-content;
    padding: 1rem;
    gap: 0.5rem;
  }
  .message {
    min-width: 0;
    font-size: 0.8125rem;
    line-height: 1.125rem;
    background: #000;
    padding: 0 1rem;
    border-radius: 0.25rem;
    justify-self: start;
    user-select: text;
    cursor: text;
  }
  .response {
    background: #111;
    justify-self: stretch;
  }
</style>

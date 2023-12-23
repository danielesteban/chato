<script lang="ts">
  import Messages from 'components/messages.svelte';
  import Split, { SplitMode } from 'components/split.svelte';
  import { Prompt, Processing } from 'state/chat';

  const keydown = (e: KeyboardEvent) => {
    if (!e.repeat && !e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      if (!$Processing) {
        Prompt.submit();
      }
    }
  };
</script>

<Split mode={SplitMode.vertical} min={96}>
  <Messages slot="A" />
  <div class="prompt" slot="B">
    <textarea bind:value={$Prompt} on:keydown={keydown} spellcheck="false" />
  </div>
</Split>

<style>
  .prompt {
    padding: 0.5rem;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 1;
  }
  .prompt > textarea {
    resize: none;
    width: 100%;
    height: 100%;
  }
</style>

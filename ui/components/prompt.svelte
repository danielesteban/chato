<script lang="ts">
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

<div class="prompt">
  <textarea bind:value={$Prompt} on:keydown={keydown} spellcheck="false" />
</div>

<style>
  .prompt {
    padding: 0.5rem;
    position: relative;
    z-index: 1;
  }
  .prompt > textarea {
    resize: none;
    width: 100%;
    height: 100%;
  }
</style>

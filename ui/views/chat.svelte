<script lang="ts">
  import Split, { SplitMode } from 'components/split.svelte';
  import Messages from 'components/chat/messages.svelte';
  import Prompt from 'components/chat/prompt.svelte';
  import Status from 'components/chat/status.svelte';
</script>

<div class="chat">
  <Split mode={SplitMode.vertical} min={96}>
    <Messages slot="A" />
    <Prompt slot="B" />
  </Split>
  <Status />
</div>

<style>
  .chat {
    display: grid;
    grid-template-rows: 1fr auto;
    height: 100%;
  }
</style>

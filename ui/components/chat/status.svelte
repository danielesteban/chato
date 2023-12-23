<script lang="ts">
  import { Model, Processing } from 'state/chat';
</script>

<div class="status">
  <div>
    {$Processing ? 'Processing...' : 'Ready'}
  </div>
  <div class="model">
    <div>
      {$Model.id}
    </div>
    <div>
      <button class="reset" on:click={Model.reset}>
        reset
      </button>
    </div>
  </div>
</div>

<style>
  .status {
    background: #000;
    color: #aaa;
    border-top: 1px solid #111;
    padding: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .model {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .reset {
    padding: 0.125rem 0.5rem;
    font-size: 0.6875rem;
    line-height: 0.875rem;
  }
</style>

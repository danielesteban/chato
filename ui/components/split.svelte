<script context="module" lang="ts">
  export enum SplitMode {
    horizontal,
    vertical,
  }
</script>

<script lang="ts">
  import { tick } from 'svelte';

  export let min = 160;
  export let mode: SplitMode;

  let size = min;
  const setSize = (target: number) => {
    size = Math.min(Math.max(Math.floor(target), drag.min), (mode === SplitMode.horizontal ? window.innerWidth : window.innerHeight) - drag.min);
    tick().then(() => window.dispatchEvent(new Event('resize')));
  }
  const drag = {
    enabled: false,
    initial: 0,
    offset: 0,
    min,
  };
  const pointerdown = ({ clientX, clientY, pointerId, target }: PointerEvent) => {
    (target as HTMLDivElement).setPointerCapture(pointerId);
    drag.enabled = true;
    drag.initial = size;
    drag.offset = mode === SplitMode.horizontal ? clientX : clientY;
  };
  const pointermove = ({ clientX, clientY }: PointerEvent) => {
    if (drag.enabled) {
      setSize(drag.initial - (mode === SplitMode.horizontal ? clientX : clientY) + drag.offset);
    }
  };
  const pointerup = ({ pointerId, target }: PointerEvent) => {
    (target as HTMLDivElement).releasePointerCapture(pointerId);
    drag.enabled = false;
  };
  const resize = () => {
    const max = (mode === SplitMode.horizontal ? window.innerWidth : window.innerHeight);
    if (size > max - drag.min) {
      setSize(max);
    }
  };
</script>

<svelte:window on:resize={resize} />

<div class="split" class:horizontal={mode === SplitMode.horizontal} class:vertical={mode === SplitMode.vertical} style="--size: {size}px">
  <slot name="A" />
  <div
    class="divider"
    on:pointerdown={pointerdown}
    on:pointermove={pointermove}
    on:pointerup={pointerup}
  />
  <slot name="B" />
</div>

<style>
  .split {
    min-width: 0;
    min-height: 0;
    display: grid;
    width: 100%;
    height: 100%;
  }
  .horizontal {
    grid-template-columns: 1fr auto var(--size);
  }
  .vertical {
    grid-template-rows: 1fr auto var(--size);
  }
  .divider {
    background: #333;
    border: 1px solid #111;
  }
  .horizontal > .divider {
    border-top: none;
    border-bottom: none;
    width: 0.5rem;
    cursor: ew-resize;
  }
  .vertical > .divider {
    border-left: none;
    border-right: none;
    height: 0.5rem;
    cursor: ns-resize;
  }
</style>

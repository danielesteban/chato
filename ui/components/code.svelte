<script lang="ts">
  import Highlight from 'svelte-highlight';
  import c from 'svelte-highlight/languages/c';
  import cpp from 'svelte-highlight/languages/cpp';
  import csharp from 'svelte-highlight/languages/csharp';
  import glsl from 'svelte-highlight/languages/glsl';
  import java from 'svelte-highlight/languages/java';
  import javascript from 'svelte-highlight/languages/javascript';
  import json from 'svelte-highlight/languages/json';
  import python from 'svelte-highlight/languages/python';
  import typescript from 'svelte-highlight/languages/typescript';

  const languages = {
    c,
    cpp,
    csharp,
    glsl,
    java,
    javascript,
    json,
    python,
    typescript,
  };

  export let lang: keyof typeof languages;
  export let text: string;
</script>

<div class="code">
  {#if languages[lang] !== undefined}
    <Highlight language={languages[lang]} code={text} />
  {:else}
    <pre data-language={lang}><code class="hljs">{text}</code></pre>
  {/if}
</div>

<style>
  .code {
    overflow: auto;
  }
</style>

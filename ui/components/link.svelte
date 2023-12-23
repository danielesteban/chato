<script>
  export let href = '';
  export let title = undefined;
</script>

<a {href} {title} target="_blank" rel="noopener noreferrer"><slot></slot></a>

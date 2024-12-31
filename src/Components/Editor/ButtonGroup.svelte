<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class='button-group'>
  {@render children?.()}
</div>

<style>
  .button-group {
    display: flex;
  }
  .button-group > :global(*) {
    flex: 1 0 0;
  }
</style>
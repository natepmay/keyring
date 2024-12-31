<script lang="ts">
import ActionArea from "./ActionArea.svelte";
import PreviewArea from "./PreviewArea.svelte";
</script>

<div class='editor'>
  <ActionArea />
  <PreviewArea />
</div>

<style>
  .editor {
    height: 100%;
    display: grid;
    grid-template: auto / auto auto;
    align-content: center;
    justify-content: center;
    grid-gap: 1em;
  }
</style>

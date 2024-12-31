<script lang="ts">
  import Preview from "./Preview.svelte";
  import LayerActionButton from "./LayerActionButton.svelte";
  import Checkbox from "./Checkbox.svelte";
  import { EditingMode, getAppState } from "../../State/AppState";
  import type { Layer } from "../../State/Layer";
  import Link from "../Icon/Link.svelte";

  export let layer: Layer;
  
  const { editingMode } = getAppState();
  
  $: hasCheckbox = $editingMode === EditingMode.Multi;
  $: ({ isVisible, isActive, isChecked, isAnchored } = layer.layerData);
  $: ({ setAnchor, releaseAnchor } = layer.layerController);
</script>

<div
  class='row'
  class:isVisible={$isVisible}
>
  <div class='anchor'>
    {#if $isAnchored}
      <LayerActionButton
        title='Release anchor'
        layerAction={releaseAnchor}
        icon={Link}
        isRound={true}
        isAccented={true}
      />
    {:else if $setAnchor }
      <LayerActionButton
        title='Force upper structure to be a subset of the lower structure'
        layerAction={setAnchor}
        icon={Link}
        isRound={true}
        hasBackground={false}
      />
    {/if}
  </div>

  <Preview
    on:click={() => { $isActive = true; }}
    isActive={$isActive}
  >
    <slot />
  </Preview>

  {#if hasCheckbox}
    <Checkbox
      isChecked={$isChecked}
      on:click={() => { $isChecked = !$isChecked }}
    />
  {/if}
</div>


<style>
  .row {
    --row-background: var(--panel-bg-color);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    min-width: 7em;
  }
  .row > :global(*) {
    margin: 0.1em;
    position: relative;
    z-index: 1;
  }
  .anchor {
    position: absolute;
    bottom: -1em;
    right: -0.2em;
  }
</style>

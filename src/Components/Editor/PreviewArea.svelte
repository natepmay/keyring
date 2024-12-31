<script lang="ts">
  import { getAppState } from "../../State/AppState";
  import Row from "./Row.svelte";
  import Structure from "../Ring/Structures/Structure.svelte";
  import Keyboard from "../Ring/Keyboard/Keyboard.svelte";

  const { collection, keyboard } = getAppState();
  const structures = collection.structures;
  $: reversedStructures = [...$structures].reverse()
  $: structureCount = $structures.length
</script>

<div class='preview-area'>
  <div class='rows'>
    {#each reversedStructures as structure (structure.id)}
      <Row layer={structure} >
        <Structure
          controller={structure}
          positionFromTop={structureCount - structure.id}
          isPreview
        />
      </Row>
    {/each}
    <Row layer={keyboard} >
      <g style="transform: scale(1.15);">
        <Keyboard controller={keyboard} isPreview />
      </g>
    </Row>
  </div>
</div>

<style>
  .preview-area {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: calc(2 * var(--small-border-radius));
    background: var(--panel-bg-color);
    padding: 0.3em 0.6em 0.3em 0.3em;
  }
  .rows {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

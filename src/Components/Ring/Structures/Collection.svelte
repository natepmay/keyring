<script lang="ts">
  import { getAppState } from "../../../State/AppState";
  import Structure from "./Structure.svelte";

  const {collection} = getAppState();
  const structures = collection.structures;
  
</script>

<g class='collection'>
  {#each $structures as structure, index (structure.id)}
    <Structure
      controller={structure}
      positionFromTop={$structures.length - 1 - index}
    />
  {/each}
</g>

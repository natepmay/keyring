<script>
  import { getAppState } from "../../State/AppState";

  const {collection} = getAppState();

  $: structures = collection.structures;
  $: structure2 = $structures.slice(1, 2)[0];
  $: rotation = structure2.rotator.rotation;
  $: vertices = structure2.vertices;
  $: i = structure2.intervalSetOfAnchorTarget
  $: binaryBelow = $i?.binary;
  $: anchorTarget = structure2.anchorTarget;

</script>


<input type='range' min={-6} max={6} bind:value={$rotation} step={0.05} />
<div>{$rotation}</div>
<div>Binary below: {binaryBelow}</div>

{#if $anchorTarget}
  <div>has anchor target</div>
{/if}
<!-- <div>{$vertices.map(v => `(${Math.round(v.x)}, ${Math.round(v.y)})`).join(', ')}</div> -->
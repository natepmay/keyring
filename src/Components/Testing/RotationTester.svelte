<script>
  import { getAppState } from "../../State/AppState";

  const {collection} = getAppState();

  let structures = $derived(collection.structures);
  let structure2 = $derived($structures.slice(1, 2)[0]);
  let rotation = $derived(structure2.rotator.rotation);
  let vertices = $derived(structure2.vertices);
  let i = $derived(structure2.intervalSetOfAnchorTarget)
  let binaryBelow = $derived($i?.binary);
  let anchorTarget = $derived(structure2.anchorTarget);

</script>


<input type='range' min={-6} max={6} bind:value={$rotation} step={0.05} />
<div>{$rotation}</div>
<div>Binary below: {binaryBelow}</div>

{#if $anchorTarget}
  <div>has anchor target</div>
{/if}
<!-- <div>{$vertices.map(v => `(${Math.round(v.x)}, ${Math.round(v.y)})`).join(', ')}</div> -->
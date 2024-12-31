<script lang="ts">
  import type {Structure as StructureController} from '../../../State/Structure';
  import Marker from './Marker.svelte';
  import Segment from './Segment.svelte';

  export let controller: StructureController;
  /**
   * 0 = the top most layer
   * 1 = one layer below the top
   * ...
   */
  export let positionFromTop: number = 0;
  export let isPreview: boolean = false;

  $: ({
    layerData,
    segmentLines,
    vertices,
    isEmpty,
    hasAnchorTarget
  } = controller);
  $: isVisible = layerData.isVisible;
  $: thickness = 35 + positionFromTop * 20;
  $: lightness = 55 - positionFromTop * 10;
  $: markerRadius = 20 + positionFromTop * 12;
  $: opacity = 1 - positionFromTop * 0.2;
  $: markerColor = `hsl(0, 0%, ${56 - positionFromTop * 16}%)`;

</script>

<g
  class='structure'
  class:isPreview
  class:isVisible={$isVisible}
  filter={(isPreview || $isEmpty) ? undefined : `url('#shadow')`}
>
  <!--
    🠉 QUIRKS ISSUE WITH `filter` 🠉
    I originally had the shadow filter applied via css and without the isEmpty
    condition, but this logic caused a Chrome-specific bug. When you clear a
    structure and then add back to it, Chrome wouldn't display anything. I think
    what happened is that Chrome calculated the filter region to be zero and
    then failed to update it after that. Firefox is fine here. Adding the
    condition that removes the filter when the structure is empty solved this
    issue.
  -->

  {#each $segmentLines as line}
    <Segment {line} {thickness} {lightness} {opacity}/>
  {/each}

  {#each $vertices as point}
    <Marker {point} radius={markerRadius} fill={markerColor} />
  {/each}

</g>

<style>
  .structure:not(.isPreview):not(.isVisible) {
    visibility: hidden;
  }
</style>

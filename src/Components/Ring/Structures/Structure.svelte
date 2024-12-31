<script lang="ts">
  import type {Structure as StructureController} from '../../../State/Structure';
  import Marker from './Marker.svelte';
  import Segment from './Segment.svelte';

  
  interface Props {
    controller: StructureController;
    /**
   * 0 = the top most layer
   * 1 = one layer below the top
   * ...
   */
    positionFromTop?: number;
    isPreview?: boolean;
  }

  let { controller, positionFromTop = 0, isPreview = false }: Props = $props();

  let {
    layerData,
    segmentLines,
    vertices,
    isEmpty,
    hasAnchorTarget
  } = $derived(controller);
  let isVisible = $derived(layerData.isVisible);
  let thickness = $derived(35 + positionFromTop * 20);
  let lightness = $derived(55 - positionFromTop * 10);
  let markerRadius = $derived(20 + positionFromTop * 12);
  let opacity = $derived(1 - positionFromTop * 0.2);
  let markerColor = $derived(`hsl(0, 0%, ${56 - positionFromTop * 16}%)`);

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

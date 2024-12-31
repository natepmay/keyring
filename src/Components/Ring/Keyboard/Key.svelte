<script lang="ts">
  import { readable } from "svelte/store";
  import { getLightIdForNote } from "../../../State/lighting.utils";
  import { getAppState } from "../../../State/AppState";
  import { Angle } from "../../../Utils/Geometry/Angle";
  import type { Note } from "../../../Utils/Music/Note";
  import { geometry } from "../geometry";
  import Arc from "./Arc.svelte";

  export let note: Note;
  export let isPreview: boolean = false;

  const { lightingSystem } = getAppState();

  $: transform = `rotate(${Angle.iToD(note.id)})`;
  $: isWhite = note.color === "white";
  $: isBlack = note.color === "black";
  $: light = lightingSystem.lights.get(getLightIdForNote(note));
  $: hasHighlightStore = light ? light.isOn : readable(false, () => {});
  $: hasHighlight = $hasHighlightStore;
</script>

<g class="key" class:isWhite class:isBlack class:hasHighlight {transform}>
  <Arc
    class="key"
    radius={geometry.middleRadius}
    startInterval={-(0.5 - geometry.dividerAngle)}
    endInterval={0.5 - geometry.dividerAngle}
    strokeWidth={geometry.keyHeight}
  />
  {#if !isPreview}
    <Arc
      class="highlight"
      radius={geometry.middleRadius}
      startInterval={-(0.5 - geometry.dividerAngle)}
      endInterval={0.5 - geometry.dividerAngle}
      strokeWidth={geometry.keyHeight}
    />
  {/if}
  <Arc
    class="divider lower-divider"
    radius={geometry.middleRadius}
    startInterval={-(0.5 + geometry.dividerAngle)}
    endInterval={-(0.5 - geometry.dividerAngle)}
    strokeWidth={geometry.keyHeight}
  />
  <Arc
    class="radius radius-outer"
    radius={geometry.outerKeyRadius}
    startInterval={-0.5}
    endInterval={0.5}
    strokeWidth={geometry.lineThickness}
  />
  <Arc
    class="radius radius-inner"
    radius={geometry.innerKeyRadius}
    startInterval={-0.5}
    endInterval={0.5}
    strokeWidth={geometry.lineThickness}
  />
  <Arc
    class="divider upper-divider"
    radius={geometry.middleRadius}
    startInterval={0.5 + geometry.dividerAngle}
    endInterval={0.5 - geometry.dividerAngle}
    strokeWidth={geometry.keyHeight}
  />

  {#if !isPreview}
    <text x={0} y={-geometry.textRadius} text-anchor="middle">
      {note.nameToUseForLabels}
    </text>
  {/if}
</g>

<style>
  text {
    font-size: 35px;
    fill: white;
    font-family: "Academico";
  }
  .key.isBlack text {
    fill: white;
  }
  .key.isWhite > :global(.key) {
    stroke: var(--white-key-color);
  }
  .key.isBlack > :global(.key) {
    stroke: var(--black-key-color);
  }
  .key > :global(.radius) {
    stroke: var(--key-divider-color);
  }
  .key > :global(.divider) {
    stroke: var(--key-divider-color);
  }
  .key > :global(.highlight) {
    stroke: var(--key-highlight-color);
  }
  .key:not(.hasHighlight) > :global(.highlight) {
    display: none;
  }
</style>

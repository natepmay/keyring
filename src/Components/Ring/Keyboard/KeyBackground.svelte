<script lang="ts">
  import { Angle } from "../../../Utils/Geometry/Angle";
  import type { Note } from "../../../Utils/Music/Note";
  import { geometry } from "../geometry";
  import Arc from "./Arc.svelte";

  interface Props {
    note: Note;
  }

  let { note }: Props = $props();

  let transform = $derived(`rotate(${Angle.iToD(note.id)})`);
</script>

<g class="key-background" {transform}>
  <Arc
    class="background"
    radius={geometry.middleRadius}
    startInterval={-(0.5 + geometry.dividerAngle * 6)}
    endInterval={0.5 + geometry.dividerAngle * 6}
    strokeWidth={geometry.backgroundHeight}
  />
</g>

<style>
  .key-background > :global(.background) {
    stroke: white;
  }
</style>

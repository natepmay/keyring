<script>
  import { NoteSet } from "../../../Utils/Music/NoteSet";
  import Key from "./Key.svelte";
  import { Angle } from "../../../Utils/Geometry/Angle";
  import type { Keyboard as KeyboardController } from "../../../State/Keyboard";
  import KeyBackground from "./KeyBackground.svelte";
  import { IntervalSet } from "../../../Utils/Music/IntervalSet";
  import { getAppState } from "../../../State/AppState";

  export let controller: KeyboardController;
  export let isPreview: boolean = false;

  const { collection } = getAppState();
  const { editableIntervalSet } = collection;
  const tonalCenter = controller.tonalCenter;
  
  $: isRotating = controller.tonalCenterRotator.isRotating;
  $: intervalSet = $editableIntervalSet && !isPreview
    ? $editableIntervalSet
    : IntervalSet.chromatic
  $: isVisible = controller.layerData.isVisible;
  $: noteSet = $isRotating
    ? NoteSet.chromatic
    : NoteSet.fromIntervalSetAndTonalCenter(intervalSet, $tonalCenter);
  $: notes = noteSet.notes;
  $: transform = `rotate(${Angle.iToD(-$tonalCenter)})`;
</script>

<g class="keyboard" {transform} class:isVisible={$isVisible} class:isPreview>
  {#each notes as note (note.id)}
    <KeyBackground {note} />
  {/each}
  {#each notes as note (note.id)}
    <Key {note} {isPreview} />
  {/each}
</g>

<style>
  .keyboard:not(.isPreview):not(.isVisible) {
    visibility: hidden;
  }
</style>

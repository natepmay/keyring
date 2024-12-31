<script>
  import { IntervalSet } from '../../Utils/Music/IntervalSet';
  import { getAppState } from '../../State/AppState';
  import { geometry } from './geometry';
  import Arc from './Keyboard/Arc.svelte';

  const { collection } = getAppState();
  const { editableIntervalSet } = collection;

  let intervalSet = $derived($editableIntervalSet ?? IntervalSet.fromBinary(0));
  let ordinals = $derived(intervalSet.ordinals);
</script>

<g class='pointer-receptors'>
  {#each ordinals as ordinal (ordinal)}
    <Arc
      on:click={() => collection.toggleInterval(ordinal)}
      startInterval={ordinal - 0.5}
      endInterval={ordinal + 0.5}
      radius={geometry.middleRadius}
      strokeWidth={geometry.keyHeight}
    />
  {/each}
</g>

<style>
  .pointer-receptors > :global(path) {
    stroke: black;
    visibility: hidden;
    pointer-events: all;
    cursor: pointer;
    outline: none;
    touch-action: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
  }
</style>
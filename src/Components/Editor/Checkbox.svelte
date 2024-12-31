<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Check from "../Icon/Check.svelte";

  export let isChecked: boolean;

  const dispatch = createEventDispatcher();
  const click = () => dispatch('click');
</script>

<div
  class="checkbox"
  class:isChecked
  on:touchstart|preventDefault|stopPropagation={click}
  on:mousedown|preventDefault|stopPropagation={click}
>
  <Check />
</div>

<style>
  .checkbox {
    --size: 1.4em;
    height: var(--size);
    width: var(--size);
    border: solid white 0.18em;
    border-radius: 0.1em;
    cursor: pointer;
  }
  .checkbox.isChecked {
    border-color: var(--gold);
    background: var(--gold);
  }
</style>
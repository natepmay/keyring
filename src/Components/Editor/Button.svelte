<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let icon               : any;
  export let isDisabled         : boolean            = false;
  export let title              : string | undefined = undefined;
  export let label              : string | undefined = undefined;
  export let transform          : string | undefined = undefined;
  export let isRound            : boolean = false;
  export let isAccented         : boolean = false;
  export let hasBackground      : boolean = true;

  const dispatch = createEventDispatcher();
  const click = () => {
    if (isDisabled) {
      return;
    }
    dispatch('click');
  };
</script>

<div
  class='button'
  class:isDisabled
  class:isRound
  class:isAccented
  class:hasBackground
  on:touchstart|preventDefault|stopPropagation={click}
  on:mousedown|preventDefault|stopPropagation={click}
  role='button'
  {title}
>
  <div class='icon' style={transform ? `transform: ${transform}` : undefined}>
    <svelte:component this={icon} />
  </div>
  {#if label}
    <div class="label">{label}</div>
  {/if}
</div>

<style>
  .button {
    margin: var(--button-spacing);
    padding: 0.1em 0.4em;
    cursor: pointer;
    border-radius: var(--small-border-radius);
    outline: none;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .button.isRound {
    border-radius: 50%;
    padding: 0;
    --size: 1.9em;
    width: var(--size);
    height: var(--size);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .button.hasBackground {
    background: var(--button-bg-color);
  }
  .button.hasBackground.isAccented {
    background: var(--gold);
  }
  .icon {
    padding-top: 0.2em;
    color: white;
    fill: white;
  }
  .button.isAccented .icon {
    fill: black;
  }
  .button :global(svg) {
    width: 1.4em;
    height: 1.4em;
  }
  .label {
    margin: 0 0.3em;
  }

  .button:not(.isDisabled):hover {
    text-decoration: underline;
  }

  /* Disabled */
  .isDisabled {
    cursor: default;
    background: none;
    box-shadow: none;
    border: none;
    color: #666;
  }
  .isDisabled :global(path) {
    fill: #666;
  }
</style>

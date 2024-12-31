<script lang="ts">
  import { preventDefault, stopPropagation } from 'svelte/legacy';

  import { createEventDispatcher } from "svelte";

  interface Props {
    icon: any;
    isDisabled?: boolean;
    title?: string | undefined;
    label?: string | undefined;
    transform?: string | undefined;
    isRound?: boolean;
    isAccented?: boolean;
    hasBackground?: boolean;
  }

  let {
    icon,
    isDisabled = false,
    title = undefined,
    label = undefined,
    transform = undefined,
    isRound = false,
    isAccented = false,
    hasBackground = true
  }: Props = $props();

  const dispatch = createEventDispatcher();
  const click = () => {
    if (isDisabled) {
      return;
    }
    dispatch('click');
  };

  const SvelteComponent = $derived(icon);
</script>

<div
  class='button'
  class:isDisabled
  class:isRound
  class:isAccented
  class:hasBackground
  ontouchstart={stopPropagation(preventDefault(click))}
  onmousedown={stopPropagation(preventDefault(click))}
  role='button'
  {title}
>
  <div class='icon' style={transform ? `transform: ${transform}` : undefined}>
    <SvelteComponent />
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

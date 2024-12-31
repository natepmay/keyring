<script lang='ts'>
  import { preventDefault, stopPropagation } from 'svelte/legacy';

  import { createEventDispatcher } from "svelte";
  import ShadowFilter from "../Ring/ShadowFilter.svelte";

  interface Props {
    isActive: boolean;
    children?: import('svelte').Snippet;
  }

  let { isActive, children }: Props = $props();

  const viewBox = (() => {
    const boxSize = 1000;
    const x = 0 - boxSize / 2;
    return `${x} ${x} ${boxSize} ${boxSize}`;
  })();
  const dispatch = createEventDispatcher();
  const click = () => dispatch('click');
</script>

<div
  class='preview'
  class:isActive
  ontouchstart={stopPropagation(preventDefault(click))}
  onmousedown={stopPropagation(preventDefault(click))}
>
  <svg {viewBox} >
    <ShadowFilter
      id='shadow'
      blurRadius={72}
      offsetX={-2}
      offsetY={2}
      opacity={1}
    />
    {@render children?.()}
    <circle r={470} class="outline"/>
  </svg>
</div>

<style>
  .preview {
    margin-right: 0.3em;
  }
  .preview:not(.isActive) {
    cursor: pointer;
  }
  svg {
    --size: 5.5em;
    display: inline-block;
    height: var(--size);
    min-width: var(--size);
  }
  .preview .outline {
    stroke-width: 28;
    stroke: white;
    fill: none;
  }
  .preview.isActive .outline {
    stroke-width: 50;
    stroke: var(--gold);
  }
</style>
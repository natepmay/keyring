<script lang="ts">
  import { XyPoint } from '../../../Utils/Geometry/XyPoint';
  import { IrPoint } from '../../../Utils/Geometry/IrPoint';
  import { createEventDispatcher } from 'svelte';

  let className = undefined as string | undefined;
  export {className as class};
  export let startInterval: number;
  export let endInterval: number;
  export let radius: number;
  export let id: string | undefined = undefined;
  export let color: string | undefined = undefined;
  export let strokeWidth: number | undefined = undefined;
  export let translate: XyPoint = new XyPoint(0, 0);
  
  $: d = (() => {
    const startPoint = (new IrPoint(startInterval, radius)).toXy().plus(translate);
    const endPoint = (new IrPoint(endInterval, radius)).toXy().plus(translate);
    const sweepFlag = startInterval < endInterval ? 1 : 0;
    return [
      "M", startPoint.x, startPoint.y,
      "A", radius, radius, 0, 0, sweepFlag, endPoint.x, endPoint.y
    ].join(" ");
  })();

  const dispatch = createEventDispatcher();
  const click = () => dispatch('click');
</script>

<path {d} class={className} {id} stroke={color} stroke-width={strokeWidth}
  on:mousedown|preventDefault|nonpassive={click}
  on:touchstart|preventDefault|nonpassive={click}
/>

<style>
  path {
    fill: none;
  }
</style>

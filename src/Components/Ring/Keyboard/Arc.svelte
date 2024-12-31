<script lang="ts">
  import { preventDefault, nonpassive } from 'svelte/legacy';

  import { XyPoint } from '../../../Utils/Geometry/XyPoint';
  import { IrPoint } from '../../../Utils/Geometry/IrPoint';
  import { createEventDispatcher } from 'svelte';

  
  interface Props {
    class?: any;
    startInterval: number;
    endInterval: number;
    radius: number;
    id?: string | undefined;
    color?: string | undefined;
    strokeWidth?: number | undefined;
    translate?: XyPoint;
  }

  let {
    class: className = undefined as string | undefined,
    startInterval,
    endInterval,
    radius,
    id = undefined,
    color = undefined,
    strokeWidth = undefined,
    translate = new XyPoint(0, 0)
  }: Props = $props();
  
  let d = $derived((() => {
    const startPoint = (new IrPoint(startInterval, radius)).toXy().plus(translate);
    const endPoint = (new IrPoint(endInterval, radius)).toXy().plus(translate);
    const sweepFlag = startInterval < endInterval ? 1 : 0;
    return [
      "M", startPoint.x, startPoint.y,
      "A", radius, radius, 0, 0, sweepFlag, endPoint.x, endPoint.y
    ].join(" ");
  })());

  const dispatch = createEventDispatcher();
  const click = () => dispatch('click');
</script>

<path {d} class={className} {id} stroke={color} stroke-width={strokeWidth}
  use:nonpassive={['mousedown', () => preventDefault(click)]}
  use:nonpassive={['touchstart', () => preventDefault(click)]}
/>

<style>
  path {
    fill: none;
  }
</style>

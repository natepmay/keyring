<script lang="ts">
  import { IrPoint } from '../../../Utils/Geometry/IrPoint';

  
  interface Props {
    class?: any;
    interval: number;
    startRadius: number;
    endRadius: number;
    strokeWidth?: number | undefined;
  }

  let {
    class: className = undefined as string | undefined,
    interval,
    startRadius,
    endRadius,
    strokeWidth = undefined
  }: Props = $props();

  let start = $derived((new IrPoint(interval, startRadius)).toXy());
  let end = $derived((new IrPoint(interval, endRadius)).toXy());
  let d =$derived(`M ${start.x} ${start.y} L ${end.x} ${end.y}`);

</script>

<path class={className} {d} stroke-width={strokeWidth} />

<style>
  path {
    stroke: black;
    fill: none;
  }
</style>

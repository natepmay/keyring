<script lang="ts">
  import { IrPoint } from '../../../Utils/Geometry/IrPoint';

  let className = undefined as string | undefined;
  export {className as class};
  export let interval: number;
  export let startRadius: number;
  export let endRadius: number;
  export let strokeWidth: number | undefined = undefined;

  $: start = (new IrPoint(interval, startRadius)).toXy();
  $: end = (new IrPoint(interval, endRadius)).toXy();
  $: d =`M ${start.x} ${start.y} L ${end.x} ${end.y}`;

</script>

<path class={className} {d} stroke-width={strokeWidth} />

<style>
  path {
    stroke: black;
    fill: none;
  }
</style>

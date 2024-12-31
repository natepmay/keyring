<script lang="ts">
  import type { XyLine } from "../../../Utils/Geometry/Line";

  export let line: XyLine;
  export let thickness: number;
  export let lightness: number;
  export let opacity: number;
  export let isDashed: boolean = false;
  
  $: d =`M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`;
  $: stroke = `hsl(${line.hue}, 100%, ${lightness}%)`;
  $: dashArray = isDashed ? `${thickness * 2} ${thickness}` : undefined

</script>

<g class='segment'>
  <path {d} stroke-width={thickness} {stroke}
    stroke-dasharray={dashArray}
    style={`opacity: ${opacity}`}
  />
</g>

<style>
  path {
    fill: none;
  }
</style>

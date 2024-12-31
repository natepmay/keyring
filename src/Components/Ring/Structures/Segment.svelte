<script lang="ts">
  import type { XyLine } from "../../../Utils/Geometry/Line";

  interface Props {
    line: XyLine;
    thickness: number;
    lightness: number;
    opacity: number;
    isDashed?: boolean;
  }

  let {
    line,
    thickness,
    lightness,
    opacity,
    isDashed = false
  }: Props = $props();
  
  let d =$derived(`M ${line.start.x} ${line.start.y} L ${line.end.x} ${line.end.y}`);
  let stroke = $derived(`hsl(${line.hue}, 100%, ${lightness}%)`);
  let dashArray = $derived(isDashed ? `${thickness * 2} ${thickness}` : undefined)

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

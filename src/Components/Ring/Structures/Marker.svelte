<script lang="ts">
  import type { XyPoint } from "../../../Utils/Geometry/XyPoint";

  interface Props {
    point: XyPoint;
    radius: number;
    fill: string;
  }

  let { point, radius, fill }: Props = $props();
  
</script>

<circle cx={point.x} cy={point.y} r={radius} {fill} />

<style>
  circle {
    stroke: none;
  }
</style>
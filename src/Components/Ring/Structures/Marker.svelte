<script lang="ts">
  import type { XyPoint } from "../../../Utils/Geometry/XyPoint";

  export let point: XyPoint;
  export let radius: number;
  export let fill: string;
  
</script>

<circle cx={point.x} cy={point.y} r={radius} {fill} />

<style>
  circle {
    stroke: none;
  }
</style>
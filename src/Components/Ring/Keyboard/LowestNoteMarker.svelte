<script lang="ts">
  import { getAppState } from "../../../State/AppState";
  import { writable } from "svelte/store";
  import { geometry } from "../geometry";
  import { Angle } from "../../../Utils/Geometry/Angle";
  
  const {keyboard} = getAppState();

  const ordinal = !!keyboard ? keyboard.lowestNoteOrdinal : writable(0);
  
  let transform = $derived(`rotate(${Angle.iToD($ordinal)})`);
</script>

<g class='lowest-note-marker' {transform} >
  <circle r={100} cx={0} cy={-(geometry.outerRadius - 50)} />
</g>

<style>
  g {
    filter: url('#shadow');
  }
  circle {
    fill: white;
  }
</style>
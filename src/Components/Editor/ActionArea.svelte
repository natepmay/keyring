<script lang="ts">
import EditingModeToggle from "./EditingModeToggle.svelte";
import LayerActionButton from "./LayerActionButton.svelte";
import ButtonGroup from "./ButtonGroup.svelte";
import { getAppState } from "../../State/AppState";

import PlayCircle from "../Icon/PlayCircle.svelte";
import EyeShown from "../Icon/EyeShown.svelte";
import EyeHidden from "../Icon/EyeHidden.svelte";
import Rotate from "../Icon/Rotate.svelte";
import Trash from "../Icon/Trash.svelte";
import CopyUp from "../Icon/CopyUp.svelte";
import Star from "../Icon/Star.svelte";


const { unifiedLayerController, unifiedLayerData } = getAppState();

$: ({
  show,
  hide,
  clear,
  mergeUp,
  highlight,
  play,
  stop,
  rotateCw,
  rotateCcw,
  } = $unifiedLayerController);

const { isVisible, isPlaying } = unifiedLayerData;

</script>

<div class="action-area">
  <EditingModeToggle />
  {#if $isVisible}
    <LayerActionButton
      layerAction={hide}
      label="Hide"
      icon={EyeShown}
    />
  {:else}
    <LayerActionButton
      layerAction={show}
      label="Show"
      icon={EyeHidden}
    />
  {/if}
  <LayerActionButton
    layerAction={rotateCw}
    label="Rotate Clockwise"
    icon={Rotate}
  />
  <LayerActionButton
    layerAction={rotateCcw}
    label="Rotate Counterclockwise"
    icon={Rotate}
    transform="scaleX(-1)"
  />
  <LayerActionButton
    layerAction={clear}
    label="Delete"
    icon={Trash}
  />
  <LayerActionButton
    layerAction={mergeUp}
    label="Copy Up"
    icon={CopyUp}
  />
</div>

<style>
.action-area {
  display: flex;
  flex-direction: column;
  --button-spacing: 0.45em 0.4em;
  padding: var(--button-spacing);
  height: 100%;
  background: var(--panel-bg-color);
  color: white;
  border-radius: 0.5em;
}
</style>

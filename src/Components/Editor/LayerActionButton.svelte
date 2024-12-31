<script lang="ts">
import type { AsyncLayerAction, LayerAction } from "src/State/Layer";
import Button from "./Button.svelte";

export let layerAction: LayerAction | AsyncLayerAction;
export let label: string | undefined = undefined;
export let icon: any = undefined;
export let transform: string | undefined = undefined;
export let title: string | undefined = undefined;
export let isRound: boolean = false;
export let isAccented: boolean = false;
export let hasBackground      : boolean = true;

$: handleClick = () => {
  if (!$layerAction) {
    return;
  }
  $layerAction();
}

</script>

<Button
  {label}
  {title}
  {icon}
  on:click={handleClick}
  isDisabled={$layerAction === undefined}
  {transform}
  {isRound}
  {isAccented}
  {hasBackground}
/>

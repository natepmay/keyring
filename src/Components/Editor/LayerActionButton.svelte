<script lang="ts">
import type { AsyncLayerAction, LayerAction } from "src/State/Layer";
import Button from "./Button.svelte";

  interface Props {
    layerAction: LayerAction | AsyncLayerAction;
    label?: string | undefined;
    icon?: any;
    transform?: string | undefined;
    title?: string | undefined;
    isRound?: boolean;
    isAccented?: boolean;
    hasBackground?: boolean;
  }

  let {
    layerAction,
    label = undefined,
    icon = undefined,
    transform = undefined,
    title = undefined,
    isRound = false,
    isAccented = false,
    hasBackground = true
  }: Props = $props();

let handleClick = $derived(() => {
  if (!$layerAction) {
    return;
  }
  $layerAction();
})

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

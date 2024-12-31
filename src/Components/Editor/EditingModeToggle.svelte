<script lang="ts">
  import { getAppState, EditingMode } from "../../State/AppState";
  
  const { editingMode } = getAppState();
</script>

<div class="editing-mode-toggle">
  <div
    class="option"
    class:isActive={$editingMode === EditingMode.Single}
    onclick={() => $editingMode = EditingMode.Single}
  >
    Single
  </div>
  <div
    class="option"
    class:isActive={$editingMode === EditingMode.Multi}
    onclick={() => $editingMode = EditingMode.Multi}
  >
    Multi
  </div>
</div>

<style>
  .editing-mode-toggle {
    display: flex;
    color: #898989;
  }
  .option {
    margin: var(--button-spacing);
    padding: 0.2em;
    border-bottom: solid transparent 0.17em;
    cursor: pointer;
  }
  .isActive {
    color: var(--gold);
    border-color: var(--gold);
  }
</style>

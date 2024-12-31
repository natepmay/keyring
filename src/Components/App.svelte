<script lang="ts">
  import Layout from "./Layout.svelte";
  import { setAppStateInContext } from '../State/AppState';
  import MidiHandler from "./MidiHandler.svelte";
  
  setAppStateInContext({
    initialTonalCenter: 0,
    lowestNoteOrdinal: 0,
  });

  // Disable default drag-related behaviors
  document.body.ondrag = () => false;
  document.body.ondragstart = () => false;
  document.body.ondrop = () => false;
  document.body.ondblclick = () => false;
  
</script>

<Layout/>
<MidiHandler />

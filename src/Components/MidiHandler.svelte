<script lang="ts">
  import { getAppState } from "../State/AppState";
  import WebMidi from "webmidi";

  const {soundPlayer} = getAppState();
  
  WebMidi.enable(err => {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    }
    WebMidi.inputs.forEach(i => {
      i.addListener('noteon', "all", e => soundPlayer.handleMidiNoteOn(e));
      i.addListener('noteoff', "all", e => soundPlayer.handleMidiNoteOff(e));
    });
  });

</script>

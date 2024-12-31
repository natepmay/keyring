import { Pitch } from "../Utils/Music/Pitch";
import type {InputEventNoteon, InputEventNoteoff} from "webmidi";
import type { LightingSystem } from "./LightingSystem";
import { getLightIdForNote } from "./lighting.utils";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createAudioContext() {
  const opts: AudioContextOptions = {
    latencyHint: "interactive",
    sampleRate: 12000,
  };
  if ('webkitAudioContext' in window) {
    // @ts-ignore because ts doesn't know about Safari's vendor prefix.
    return new webkitAudioContext(opts) as AudioContext;
  }
  return new AudioContext(opts);
}

interface SoundPlayerProps {
  lightingSystem: LightingSystem;
}

export class SoundPlayer {

  audioContext: AudioContext;

  lightingSystem: LightingSystem;

  constructor(props: SoundPlayerProps) {
    this.audioContext = createAudioContext();
    this.lightingSystem = props.lightingSystem;
  }

  async playPitches(pitches: Pitch[]) {
    console.log(pitches.map(p => p.slashNotation));
    // TODO
  }

  attack(pitch: Pitch): void {
    this.lightingSystem.press(getLightIdForNote(pitch.note));
    // TODO start synth
  }

  release(pitch: Pitch): void {
    this.lightingSystem.release(getLightIdForNote(pitch.note));
    // TODO stop synth
  }
  
  handleMidiNoteOn(event: InputEventNoteon): void {
    this.attack(Pitch.fromMidiNumber(event.note.number));
  }

  handleMidiNoteOff(event: InputEventNoteoff): void {
    this.release(Pitch.fromMidiNumber(event.note.number));
  }
  
}
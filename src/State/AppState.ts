import { setContext, getContext } from 'svelte';
import { Keyboard } from './Keyboard';
import { Collection } from './Collection';
import { SoundPlayer } from './SoundPlayer';
import type { Structure } from './Structure';
import { derived, get, Readable, Writable, writable } from 'svelte/store';
import { NoteSet } from '../Utils/Music/NoteSet';
import { Layer, LayerController, unifyLayerControllers, unifyLayerData } from './Layer';
import { filterStores } from './storeUtils';
import { LightingSystem } from './LightingSystem';
import { getLightIdsForAllNotes } from './lighting.utils';

interface AppStateProps {
  initialTonalCenter: number,
  lowestNoteOrdinal: number,
}

export enum EditingMode {
  Single,
  Multi,
}

export class AppState {
  editingMode = writable<EditingMode>(EditingMode.Single);

  /**
   * The one layer that's selected for "Active (single)" editing mode
   */
  activeLayer: Writable<Layer | undefined>;
  
  keyboard: Keyboard;

  collection: Collection;

  lightingSystem: LightingSystem;
  
  soundPlayer: SoundPlayer;

  constructor(props: AppStateProps) {
    this.activeLayer = writable(undefined);
    this.keyboard = new Keyboard({
      tonalCenter: props.initialTonalCenter,
      lowestNoteOrdinal: props.lowestNoteOrdinal,
      activeLayerStore: this.activeLayer,
    });
    this.collection = new Collection();
    const addStructure = (intervalSetBinary: number) => this.collection.add({
      intervalSetBinary,
      activeLayerStore: this.activeLayer
    });
    const bottom = addStructure(2741);
    const top = addStructure(145);
    top.layerData.isActive.set(true);

    this.lightingSystem = new LightingSystem(getLightIdsForAllNotes());
    this.soundPlayer = new SoundPlayer({ lightingSystem: this.lightingSystem });
  }

  get allLayers(): Readable<Layer[]>  {
    return derived(this.collection.structures, s => [this.keyboard, ...s]);
  }

  get checkedLayers(): Readable<Layer[]> {
    return filterStores(this.allLayers, layer => layer.layerData.isChecked);
  }

  get targetLayers(): Readable<Layer[]> {
    return derived([
      this.editingMode,
      this.activeLayer,
      this.checkedLayers,
    ], ([editingMode, activeLayer, checkedLayers]) => {
      if (editingMode === EditingMode.Single) {
        return activeLayer ? [activeLayer] : [];
      }
      return checkedLayers;
    });
  }

  get unifiedLayerController(): Readable<LayerController> {
    const targetLayerControllers = derived(this.targetLayers, targetLayers =>
      targetLayers.map(l => l.layerController)
    );
    return unifyLayerControllers(targetLayerControllers);
  }

  get unifiedLayerData() {
    const targetLayerData = derived(this.targetLayers, targetLayers =>
      targetLayers.map(l => l.layerData)
    );
    return unifyLayerData(targetLayerData);
  }

  get playStructure() {
    const keyboard = this.keyboard;
    const soundPlayer = this.soundPlayer;
    return (structure: Structure) => {
      if (!keyboard) { return; }
      const tonalCenter = get(keyboard.tonalCenter);
      const lowestNoteOrdinal = get(keyboard.lowestNoteOrdinal);
      const effectiveIntervalSet = get(structure.intervalSet)
        .shift(-lowestNoteOrdinal);
      const effectiveTonalCenter = tonalCenter + lowestNoteOrdinal;
      const noteSet = NoteSet.fromIntervalSetAndTonalCenter(
        effectiveIntervalSet,
        effectiveTonalCenter,
      );
      const pitches = noteSet.notes.map(note =>
        note.pitchAboveLowestNoteInOctave(effectiveTonalCenter, 4)
      );
      soundPlayer.playPitches(pitches);
    }
  }
}

export const contextKey = {};

export const setAppStateInContext = (props: AppStateProps) =>
  setContext(contextKey, new AppState(props));

export const getAppState = () => getContext<AppState>(contextKey);

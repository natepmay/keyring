import { get, readable, writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { Scalar } from "../Utils/Math/Scalar";
import { RotationController } from "../Components/Ring/Rotator/RotationController";
import { Layer, LayerController, LayerData } from "./Layer";
import { constStore } from "./storeUtils";

interface KeyboardProps {
  tonalCenter?: number,
  lowestNoteOrdinal?: number,
  activeLayerStore: Writable<Layer | undefined>,
}

function createKeyboardLayerController(keyboard: Keyboard): LayerController {
  return {
    play          : constStore(undefined), // TODO implement
    stop          : constStore(undefined), // TODO implement
    show          : constStore(() => keyboard.layerData.isVisible.set(true)),
    hide          : constStore(() => keyboard.layerData.isVisible.set(false)),
    rotateCw      : constStore(() => keyboard.shiftWithAnimation(1)),
    rotateCcw     : constStore(() => keyboard.shiftWithAnimation(-1)),
    clear         : constStore(undefined),
    mergeUp       : constStore(undefined),
    highlight     : constStore(undefined),
    setAnchor     : constStore(undefined),
    releaseAnchor : constStore(undefined),
  }
}

export class Keyboard implements Layer {
  layerData: LayerData;
  
  layerController: LayerController;
  
  tonalCenter: Writable<number>;

  lowestNoteOrdinal: Writable<number>;

  tonalCenterRotator = new RotationController();

  lowestNoteRotator = new RotationController();

  constructor(props: KeyboardProps) {
    this.tonalCenter = writable(props.tonalCenter ?? 0);
    this.lowestNoteOrdinal = writable(props.lowestNoteOrdinal ?? 0);
    this.layerData = new LayerData({
      layer: this,
      activeLayerStore: props.activeLayerStore,
      isAnchoredStore: readable(false, () => {}),
    });
    // TODO: is it actually okay to pass `this` into this fn when it's not yet a
    // fully constructed Keyboard?
    this.layerController = createKeyboardLayerController(this);
  }

  shift(intervalDiff: number) {
    this.tonalCenter.update(tonalCenter =>
      Scalar.wrapToOctave(tonalCenter - intervalDiff)
    );
  }

  shiftLowestNote(intervalDiff: number) {
    this.lowestNoteOrdinal.update(ordinal => 
      Scalar.wrapToOctave(ordinal - intervalDiff)
    );
  }

  /**
   * Perform a non-interactive rotation animation by the number of stops
   * specified. 
   * 
   * @param stops
   *   1 = one half step clockwise
   *  -1 = one half step counterclockwise
   */
  async shiftWithAnimation(stops: number) {
    try {
      await this.tonalCenterRotator.animateTo(stops);
    }
    catch {
      return;
    }
    this.shift(stops);
  }
}

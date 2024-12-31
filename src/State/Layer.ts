import {
  derived,
  readable,
  type Readable,
  type Writable,
  writable,
} from "svelte/store";
import { mapStores } from "./storeUtils";

export interface LayerProps {
  layer: Layer;
  activeLayerStore: Writable<Layer | undefined>;
  isVisible?: boolean;
  isChecked?: boolean;
  isPlaying?: boolean;
  isAnchoredStore: Readable<boolean>;
}

const defaults = {
  isVisible: true,
  isChecked: false,
  isPlaying: false,
};

function createStoreForIsActive(props: {
  layer: Layer;
  activeLayerStore: Writable<Layer | undefined>;
}): Writable<boolean> {
  function subscribe(subscription: (isActive: boolean) => void): () => void {
    return props.activeLayerStore.subscribe((activeLayer) => {
      subscription(activeLayer === props.layer);
    });
  }

  function update(updater: (isActive: boolean) => boolean) {
    props.activeLayerStore.update((activeLayer) => {
      const newValueForIsActive = updater(activeLayer === props.layer);
      if (newValueForIsActive) {
        return props.layer;
      }
      return undefined;
    });
  }

  function set(isActive: boolean) {
    if (isActive) {
      props.activeLayerStore.set(props.layer);
    } else {
      props.activeLayerStore.set(undefined);
    }
  }

  return { subscribe, update, set };
}

export class LayerData {
  layer: Layer;
  isVisible: Writable<boolean>;
  isChecked: Writable<boolean>;
  isActive: Writable<boolean>;
  isPlaying: Writable<boolean>;
  isAnchored: Readable<boolean>;

  constructor(props: LayerProps) {
    const p = { ...defaults, ...props };
    this.layer = p.layer;
    this.isActive = createStoreForIsActive(props);
    this.isVisible = writable(p.isVisible);
    this.isChecked = writable(p.isChecked);
    this.isPlaying = writable(p.isPlaying);
    this.isAnchored = p.isAnchoredStore;
  }
}

type Action = () => void;
type AsyncAction = () => Promise<void>;

/**
 * - `() => void` means the action is okay to invoke
 * - `undefined` means the action is disabled
 */
export type LayerAction = Readable<Action | undefined>;
export type AsyncLayerAction = Readable<AsyncAction | undefined>;

export interface LayerController {
  show: LayerAction;
  hide: LayerAction;
  clear: LayerAction;
  mergeUp: LayerAction;
  highlight: LayerAction;
  play: AsyncLayerAction;
  stop: LayerAction;
  rotateCw: AsyncLayerAction;
  rotateCcw: AsyncLayerAction;
  setAnchor: LayerAction;
  releaseAnchor: LayerAction;
}

export function makeLayerAction<ActionType extends Action | AsyncAction>(
  canDo: Readable<boolean>,
  doIt: ActionType
) {
  return derived(canDo, ($canDo) => ($canDo ? doIt : undefined));
}

export interface Layer {
  layerData: LayerData;
  layerController: LayerController;
}

function unifyLayerDatum(
  layerDataArray: Readable<LayerData[]>,
  selector: (ld: LayerData) => Readable<boolean>
) {
  return derived(mapStores(layerDataArray, selector), (values) =>
    values.reduce((a, b) => a && b, true)
  );
}

export function unifyLayerData(layerDataArray: Readable<LayerData[]>) {
  return {
    isVisible: unifyLayerDatum(layerDataArray, (ld) => ld.isVisible),
    isPlaying: unifyLayerDatum(layerDataArray, (ld) => ld.isPlaying),
  };
}

function unifyLayerActions(a: LayerAction, b: LayerAction): LayerAction {
  return derived([a, b], ([$a, $b]) => {
    if ($a === undefined || $b === undefined) {
      return undefined;
    }
    return () => {
      $a();
      $b();
    };
  });
}

function unifyAsyncLayerActions(
  a: AsyncLayerAction,
  b: AsyncLayerAction
): AsyncLayerAction {
  return derived([a, b], ([$a, $b]) => {
    if ($a === undefined || $b === undefined) {
      return undefined;
    }
    return async () => {
      $a();
      $b();
    };
  });
}

function unifyLayerControllerPair(
  a: LayerController,
  b: LayerController
): LayerController {
  return {
    show: unifyLayerActions(a.show, b.show),
    hide: unifyLayerActions(a.hide, b.hide),
    clear: unifyLayerActions(a.clear, b.clear),
    mergeUp: unifyLayerActions(a.mergeUp, b.mergeUp),
    highlight: unifyLayerActions(a.highlight, b.highlight),
    releaseAnchor: unifyLayerActions(a.releaseAnchor, b.releaseAnchor),
    setAnchor: unifyLayerActions(a.setAnchor, b.setAnchor),
    play: unifyAsyncLayerActions(a.play, b.play),
    stop: unifyAsyncLayerActions(a.play, b.play),
    rotateCw: unifyAsyncLayerActions(a.rotateCw, b.rotateCw),
    rotateCcw: unifyAsyncLayerActions(a.rotateCcw, b.rotateCcw),
  };
}

const emptyLayerAction = readable(undefined, () => {});
const emptyLayerController: LayerController = {
  show: emptyLayerAction,
  hide: emptyLayerAction,
  clear: emptyLayerAction,
  mergeUp: emptyLayerAction,
  highlight: emptyLayerAction,
  play: emptyLayerAction,
  stop: emptyLayerAction,
  rotateCw: emptyLayerAction,
  rotateCcw: emptyLayerAction,
  setAnchor: emptyLayerAction,
  releaseAnchor: emptyLayerAction,
};

export function unifyLayerControllers(
  layerControllers: Readable<LayerController[]>
): Readable<LayerController> {
  return derived(layerControllers, (lc) => {
    if (lc.length === 0) {
      return emptyLayerController;
    }
    return lc.reduce(unifyLayerControllerPair);
  });
}

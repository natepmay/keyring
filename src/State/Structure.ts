import { derived, get, type Readable, readable, writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { IntervalSet } from "../Utils/Music/IntervalSet";
import { XyPoint } from "../Utils/Geometry/XyPoint";
import { XyLine } from "../Utils/Geometry/Line";
import { geometry } from "../Components/Ring/geometry";
import { IrPoint } from "../Utils/Geometry/IrPoint";
import { RotationController } from "../Components/Ring/Rotator/RotationController";
import { Scalar } from "../Utils/Math/Scalar";
import type { Collection } from "./Collection";
import {
  type AsyncLayerAction,
  type Layer,
  type LayerAction,
  type LayerController,
  makeLayerAction,
} from "./Layer";
import { LayerData } from "./Layer";
import { constStore } from "./storeUtils";

export function storeWithinStructure<T>(
  structureStore: Readable<Structure | undefined>,
  innerStoreSelector: (structure: Structure) => Readable<T>
) {
  let unsubscribe = () => {};
  return readable<T | undefined>(undefined, (set) => {
    structureStore.subscribe((structure) => {
      if (!structure) {
        set(undefined);
        unsubscribe();
      } else {
        const innerStore = innerStoreSelector(structure);
        unsubscribe = innerStore.subscribe(set);
      }
    });
  });
}

function vertexAtOrdinal(ordinal: number) {
  return new IrPoint(ordinal, geometry.structureRadius).toXy();
}

function createStructureLayerController(structure: Structure): LayerController {
  return {
    play: structure.play,
    stop: structure.stop,
    show: structure.show,
    hide: structure.hide,
    rotateCw: structure.rotateCw,
    rotateCcw: structure.rotateCcw,
    clear: structure.clear,
    mergeUp: structure.mergeUp,
    highlight: structure.highlight,
    setAnchor: structure.setAnchor,
    releaseAnchor: structure.releaseAnchor,
  };
}

export class Structure implements Layer {
  id: number;

  intervalSet: Writable<IntervalSet>;

  layerData: LayerData;

  containingCollection: Collection;

  /**
   * 0 = not rotated
   * 1 = rotated a half step clockwise
   * 12 = rotated on full revolution
   */
  rotator = new RotationController();

  structureAbove = writable<Structure | undefined>(undefined);

  structureBelow = writable<Structure | undefined>(undefined);

  /**
   * A structure to which this structure is anchored.
   */
  anchorTarget = writable<Structure | undefined>(undefined);

  /**
   * A structure which is anchored to this structure.
   */
  anchorSource = writable<Structure | undefined>(undefined);

  constructor(props: {
    id: number;
    containingCollection: Collection;
    intervalSetBinary?: number;
    activeLayerStore: Writable<Layer | undefined>;
  }) {
    this.id = props.id;
    this.containingCollection = props.containingCollection;
    const intervalSet = IntervalSet.fromBinary(props.intervalSetBinary || 0);
    this.intervalSet = writable(intervalSet);
    this.layerData = new LayerData({
      layer: this,
      activeLayerStore: props.activeLayerStore,
      isAnchoredStore: this.hasAnchorTarget,
    });
  }

  private get intervalSetAbove() {
    return storeWithinStructure(this.structureAbove, (s) => s.intervalSet);
  }

  private get intervalSetBelow() {
    return storeWithinStructure(this.structureBelow, (s) => s.intervalSet);
  }

  private get intervalSetOfAnchorTarget() {
    return storeWithinStructure(this.anchorTarget, (s) => s.intervalSet);
  }

  private get anchorSourceAbove() {
    return storeWithinStructure(this.structureAbove, (s) => s.anchorSource);
  }

  private get anchorTargetBelow() {
    return storeWithinStructure(this.structureBelow, (s) => s.anchorTarget);
  }

  private get aboveIsVisible() {
    return storeWithinStructure(
      this.structureAbove,
      (s) => s.layerData.isVisible
    );
  }

  private get belowIsVisible() {
    return storeWithinStructure(
      this.structureBelow,
      (s) => s.layerData.isVisible
    );
  }

  private get aboveIsSuperset() {
    return derived(
      [this.intervalSet, this.intervalSetAbove],
      ([intervalSet, intervalSetAbove]) => {
        if (!intervalSetAbove) {
          return undefined;
        }
        return intervalSetAbove.contains(intervalSet);
      }
    );
  }

  private get belowIsSuperset() {
    return derived(
      [this.intervalSet, this.intervalSetBelow],
      ([intervalSet, intervalSetBelow]) => {
        if (!intervalSetBelow) {
          return undefined;
        }
        return intervalSetBelow.contains(intervalSet);
      }
    );
  }

  get editableIntervalSet() {
    return derived(
      this.intervalSetOfAnchorTarget,
      (i) => i ?? IntervalSet.chromatic
    );
  }

  /**
   * The final isEditing value, based on canEdit and isEditing.
   */
  get computedIsEditing() {
    // TODO re-think

    /**
     * True when the user has selected this structure for editing.
     */
    const isEditing = derived(this.layerData.isActive, (a) => a);

    /**
     * True when conditions permit this structure to be edited.
     */
    const canEdit = derived(
      [this.layerData.isVisible, this.anchorSource],
      ([isVisible, anchorSource]) => {
        if (!isVisible) {
          // Can't edit a hidden structure.
          return false;
        }
        if (anchorSource) {
          // Can't edit a structure which is the target of an anchor.
          return false;
        }
        return true;
      }
    );

    return derived(
      [isEditing, canEdit],
      ([$isEditing, $canEdit]) => $isEditing && $canEdit
    );
  }

  /**
   * True when no intervals are selected.
   */
  get isEmpty() {
    return derived(this.intervalSet, (is) => is.binary === 0);
  }

  get play(): AsyncLayerAction {
    const canPlay = derived(
      [this.layerData.isVisible, this.isEmpty],
      ([isVisible, isEmpty]) => {
        if (!isVisible) {
          // Can't play a hidden structure.
          return false;
        }
        if (isEmpty) {
          // Can't play if we don't have any notes.
          return false;
        }
        return true;
      }
    );
    //@ts-ignore
    return makeLayerAction(canPlay, async () => {}); // TODO
  }

  get stop(): LayerAction {
    //@ts-ignore
    return makeLayerAction(
      readable(true, () => {}),
      () => {}
    ); // TODO
  }

  get clear(): LayerAction {
    const canClear = derived(
      [this.anchorSource, this.layerData.isVisible],
      ([anchorSource, isVisible]) => {
        if (!!anchorSource) {
          // Can't clear a structure that is on the bottom of an anchor pair.
          return false;
        }
        if (!isVisible) {
          // Can't clear a structure that is hidden.
          return false;
        }
        // Why allow clearing an empty structure? Because when multiple
        // structures are selected, we want to be able to clear all, even if
        // one is empty.
        return true;
      }
    );
    //@ts-ignore
    return makeLayerAction(canClear, () =>
      this.intervalSet.set(IntervalSet.fromBinary(0))
    );
  }

  private get canRotate() {
    return derived(this.anchorSource, (anchorSource) => {
      if (!!anchorSource) {
        // Can't rotate a structure that is on the bottom of an anchor pair.
        return false;
      }
      return true;
    });
  }

  get rotateCw(): AsyncLayerAction {
    //@ts-ignore
    return makeLayerAction(this.canRotate, () => this.shiftWithAnimation(1));
  }

  get rotateCcw(): AsyncLayerAction {
    //@ts-ignore
    return makeLayerAction(this.canRotate, () => this.shiftWithAnimation(-1));
  }

  get show(): LayerAction {
    const canShow = derived(this.isEmpty, (e) => !e);
    //@ts-ignore
    return makeLayerAction(canShow, () => this.layerData.isVisible.set(true));
  }

  get hide(): LayerAction {
    const canHide = derived(this.isEmpty, (e) => !e);
    //@ts-ignore
    return makeLayerAction(canHide, () => this.layerData.isVisible.set(false));
  }

  get highlight(): LayerAction {
    // const can = derived(this.isEmpty, e => !e);
    const can = constStore(false);
    //@ts-ignore
    return makeLayerAction(can, () => {}); // TODO
  }

  /**
   * Find the XyPoint for one vertex of this structure.
   *
   * @param ordinal The ordinal within this structure representing the vertex
   * @param rotation The user rotation applied to this structure
   * @param targetIntervalSet An interval set to which this one is anchored
   */
  static pointOnAnchorTarget(
    ordinal: number,
    rotation: number,
    targetIntervalSet: IntervalSet
  ): XyPoint {
    const targetOrdinals = targetIntervalSet.ordinals;
    const sliceCount = targetOrdinals.length;
    const wrapIndex = (i: number) => Scalar.wrap(i, sliceCount);
    const ordinalFromIndex = (i: number) => targetOrdinals[wrapIndex(i)];
    const pointFromIndex = (i: number) => vertexAtOrdinal(ordinalFromIndex(i));
    const indexWithoutRotation = targetOrdinals.indexOf(ordinal);
    if (indexWithoutRotation === -1) {
      throw new Error("Unable to place point on anchor target");
    }
    const revolutions = Scalar.wrap(rotation / 12, 1);
    const indexWithRotation = indexWithoutRotation + revolutions * sliceCount;
    if (Number.isInteger(indexWithRotation)) {
      return pointFromIndex(indexWithRotation);
    }
    const pointBefore = pointFromIndex(Math.floor(indexWithRotation));
    const pointAfter = pointFromIndex(Math.ceil(indexWithRotation));
    const segment = new XyLine(pointBefore, pointAfter);
    const interpolationFactor = indexWithRotation % 1;
    return XyPoint.alongLine(segment, interpolationFactor);
  }

  get vertices(): Readable<XyPoint[]> {
    return derived(
      [this.intervalSet, this.rotator.rotation, this.intervalSetOfAnchorTarget],
      ([thisIntervalSet, rotation, targetIntervalSet]) => {
        if (targetIntervalSet) {
          // When anchored
          return thisIntervalSet.ordinals.map((ordinal) =>
            Structure.pointOnAnchorTarget(ordinal, rotation, targetIntervalSet)
          );
        }
        return thisIntervalSet.ordinals.map((ordinal) =>
          new IrPoint(ordinal + rotation, geometry.structureRadius).toXy()
        );
      }
    );
  }

  get segmentLines(): Readable<XyLine[]> {
    return derived(this.vertices, (vertices) => {
      let result: XyLine[] = [];
      let previousVertex;
      for (const vertex of vertices) {
        if (previousVertex !== undefined) {
          result = [...result, new XyLine(previousVertex, vertex)];
        }
        previousVertex = vertex;
      }
      if (vertices.length > 2) {
        const final = new XyLine(vertices[vertices.length - 1], vertices[0]);
        result = [...result, final];
      }
      return result;
    });
  }

  get setAnchor(): LayerAction {
    const canSetAnchor = derived(
      [
        this.intervalSet,
        this.intervalSetBelow,
        this.anchorSource,
        this.anchorTargetBelow,
      ],
      ([intervalSet, intervalSetBelow, anchorSource, anchorTargetBelow]) => {
        if (!!anchorSource) {
          // Can't anchor this structure if another is already anchored here.
          return false;
        }
        if (!!anchorTargetBelow) {
          // Can't anchor to a structure which is already anchored to another.
          return false;
        }
        if (intervalSetBelow === undefined) {
          // Can't anchor if this structure is on bottom.
          return false;
        }
        if (intervalSetBelow.count < 3) {
          // Can't anchor to a structure with fewer than three intervals.
          return false;
        }
        // Can't anchor if this structure isn't a subset of the structure below.
        return intervalSetBelow.contains(intervalSet);
      }
    );

    return derived(canSetAnchor, ($canSetAnchor) => {
      if (!$canSetAnchor) {
        return undefined;
      }
      return () => {
        const target = get(this.structureBelow);
        if (!target) {
          return;
        }
        // Set anchor
        this.anchorTarget.set(target);
        target.anchorSource.set(this);

        // Make both structures visible
        this.layerData.isVisible.set(true);
        target.layerData.isVisible.set(true);

        // Ensure the upper structure is selected for editing
        this.layerData.isActive.set(true);
      };
    });
  }

  get releaseAnchor(): LayerAction {
    return constStore(() => {
      const target = get(this.anchorTarget);
      this.anchorTarget.set(undefined);
      target?.anchorSource.set(undefined);
    });
  }

  get hasAnchorTarget() {
    return derived(this.anchorTarget, (a) => !!a);
  }

  get hasAnchorSource() {
    return derived(this.anchorSource, (a) => !!a);
  }

  /**
   * Copy the intervals within this structure to the target structure.
   */
  mergeToStructure(structure: Structure | undefined) {
    if (!structure) {
      return;
    }
    structure.intervalSet.update((intervalSet) =>
      intervalSet.union(get(this.intervalSet))
    );
  }

  private get canMergeUp() {
    return derived(
      [
        this.layerData.isVisible,
        this.isEmpty,
        this.aboveIsSuperset,
        this.aboveIsVisible,
        this.anchorSourceAbove,
      ],
      ([
        isVisible,
        isEmpty,
        aboveIsSuperset,
        aboveIsVisible,
        anchorSourceAbove,
      ]) => {
        if (!isVisible) {
          // Can't merge if we can't see what we're merging.
          return false;
        }
        if (isEmpty) {
          // Can't merge if there's nothing here to copy.
          return false;
        }
        if (aboveIsSuperset) {
          // Can't merge if the destination already contains everything here.
          return false;
        }
        if (!aboveIsVisible) {
          // Can't merge into hidden structure.
          return false;
        }
        if (anchorSourceAbove) {
          // Can't merge into a structure to which another is anchored.
          return false;
        }
        return true;
      }
    );
  }

  private get canMergeDown() {
    return derived(
      [
        this.layerData.isVisible,
        this.isEmpty,
        this.belowIsSuperset,
        this.belowIsVisible,
        this.anchorTargetBelow,
      ],
      ([
        isVisible,
        isEmpty,
        belowIsSuperset,
        belowIsVisible,
        anchorTargetBelow,
      ]) => {
        if (!isVisible) {
          // Can't merge if we can't see what we're merging
          return false;
        }
        if (isEmpty) {
          // Can't merge if there's nothing here to copy.
          return false;
        }
        if (belowIsSuperset) {
          // Can't merge if the destination already contains everything here.
          return false;
        }
        if (!belowIsVisible) {
          // Can't merge into hidden structure.
          return false;
        }
        if (anchorTargetBelow) {
          // Can't merge into a structure which is anchored to another.
          return false;
        }
        return true;
      }
    );
  }

  /**
   * Copy the intervals within this structure to the structure above. If there
   * is no structure above, don't do anything.
   */
  get mergeUp(): LayerAction {
    return derived(this.canMergeUp, (canMergeUp) => {
      if (!canMergeUp) {
        return undefined;
      }
      return () => this.mergeToStructure(get(this.structureAbove));
    });
  }

  /**
   * Copy the intervals within this structure to the structure below. If there
   * is no structure below, don't do anything.
   */
  get mergeDown(): LayerAction {
    return derived(this.canMergeDown, (canMergeDown) => {
      if (!canMergeDown) {
        return undefined;
      }
      return () => this.mergeToStructure(get(this.structureBelow));
    });
  }

  /**
   * How far do we need to rotate this structure (in intervals) to get to the
   * number of stops specified?
   */
  private targetRotation(stops: number) {
    const is = get(this.intervalSetOfAnchorTarget);
    if (!is) {
      return stops;
    }
    return (stops * 12) / is?.count;
  }

  /**
   * Perform a non-interactive rotation animation by the number of stops
   * specified. If this structure is not anchored, then one stop is equivalent
   * to one half step. If this structure is anchored, then one stop means
   * rotating this structure the smallest amount necessary to align with the
   * next vertices.
   *
   * @param stops
   *   1 = one stop clockwise
   *  -1 = one stop counterclockwise
   */
  async shiftWithAnimation(stops: number) {
    try {
      await this.rotator.animateTo(this.targetRotation(stops));
    } catch {
      return;
    }
    this.shift(stops);
  }

  /**
   * Immediately shift this structure by the number of stops specified. If this
   * structure is not anchored, then one stop is equivalent to one half step. If
   * this structure is anchored, then one stop means rotating this structure the
   * smallest amount necessary to align with the next vertices.
   *
   * @param stops 1 = one stop clockwise -1 = one stop counterclockwise
   */
  shift(stops: number) {
    const superset = get(this.intervalSetOfAnchorTarget);
    if (superset) {
      this.intervalSet.update((is) => is.shiftWithinSuperset(superset, stops));
    } else {
      this.intervalSet.update((is) => is.shift(stops));
    }
  }

  /**
   * Toggle the visibility of this structure while keeping any other linked
   * structure in sync.
   */
  toggleVisibility() {
    const linkedStructure = get(this.anchorSource) || get(this.anchorTarget);
    if (!linkedStructure) {
      this.layerData.isVisible.update((v) => !v);
    } else {
      const bothAreVisible =
        get(this.layerData.isVisible) &&
        get(linkedStructure.layerData.isVisible);
      if (bothAreVisible) {
        this.layerData.isVisible.set(false);
        linkedStructure.layerData.isVisible.set(false);
      } else {
        this.layerData.isVisible.set(true);
        linkedStructure.layerData.isVisible.set(true);
      }
    }
  }

  get layerController() {
    return createStructureLayerController(this);
  }
}

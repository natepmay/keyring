import { derived, get, Readable, writable, Writable } from "svelte/store";
import { storeWithinStructure, Structure } from "./Structure";
import { arrayHasConsistentValues } from "../Utils/Misc";
import { IntervalSet } from "../Utils/Music/IntervalSet";
import type { Layer } from "./Layer";
import { filterStores } from "./storeUtils";

export class Collection {

  structures: Writable<Structure[]> = writable([]);

  /**
   * For layer ID auto-incrementing. We store this instead of calculating it
   * because we want to be able to re-insert deleted layers as they were during
   * undo operations.
   */
  private maxId: number = 0;

  constructor() {
    this.structures.subscribe(Collection.refreshStructureAssociations);
  }

  add(props: {
    id?: number,
    intervalSetBinary?: number,
    activeLayerStore: Writable<Layer | undefined>,
  }) {
    const id = props.id || this.maxId + 1;
    const structure = new Structure({
      id,
      containingCollection: this,
      intervalSetBinary: props.intervalSetBinary,
      activeLayerStore: props.activeLayerStore,
    });
    this.maxId = id;
    this.structures.update(structures => [...structures, structure]);
    return structure;
  }

  remove(id: number) {
    this.structures.update($s => $s.filter(s => s.id !== id));
  }

  get topStructure() {
    return derived(this.structures, s => s[s.length - 1])
  }

  get bottomStructure() {
    return derived(this.structures, s => s[0])
  }

  get activeStructure(): Readable<Structure | undefined> {
    return derived(
      filterStores(this.structures, structure => structure.layerData.isActive),
      f => f[0] ?? undefined,
    );
  }
  
  /**
   * This interval set represents all the intervals which the user can toggle
   * on or off.
   * 
   * - Empty when no structure is selected for editing.
   * - Chromatic when one normal structure is selected.
   * - When the selected structure is anchored to another, return the interval
   *   set of the anchor target.
   */
  get editableIntervalSet() {
    return storeWithinStructure(this.topStructure, s =>
      s?.editableIntervalSet ?? IntervalSet.fromBinary(0)
    );
  }

  /**
   * Handle the user clicking on an interval ordinal within the ring.
   */
  toggleInterval(ordinal: number) {
    const structures = get(this.structures)
      .filter(s => get(s.computedIsEditing));
    const structuresAreConsistent = arrayHasConsistentValues(
      structures.map(s => get(s.intervalSet).hasOrdinal(ordinal))
    );
    if (structuresAreConsistent) {
      // Toggle all
      structures.forEach(structure => {
        structure.intervalSet.update(is => is.toggleIntervalOrdinal(ordinal))
      });
    }
    else {
      // Enable all
      structures.forEach(structure => {
        structure.intervalSet.update(is => is.withOrdinal(ordinal))
      });
    }
  }

  /**
   * Update the links between sequential structures.
   */
  static refreshStructureAssociations(structures: Structure[]) {
    let lowerStructure: Structure | undefined;
    structures.forEach(structure => {
      if (lowerStructure) {
        // When we have a sequential pair, connect them as such.
        structure.structureBelow.set(lowerStructure);
        lowerStructure.structureAbove.set(structure);
      }
      else {
        // Tell the bottom-most structure that there's nothing below it.
        structure.structureBelow.set(undefined);
      }
      // On all structures, clear any anchors already set.
      // LIMITATION: If we have 4 structures with the bottom 2 anchored and then
      // we re-order the top two, this logic will inadvertently un-anchor the
      // bottom ones.
      structure.anchorSource.set(undefined);
      structure.anchorTarget.set(undefined);

      lowerStructure = structure;
    });
    if (lowerStructure) {
      // Tell the top-most structure that there's nothing above it.
      lowerStructure.structureAbove.set(undefined);
    }
  }

}

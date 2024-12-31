import { Scalar } from "./../Math/Scalar";
import { IntervalSetBinary } from "./IntervalSetBinary";

const divisions = 12;

/**
 * This class stores a set of intervals using a binary representation of that
 * set. Functions also exist here to deal with an "ordinals" representation of
 * the same set.
 *
 * ORDINALS
 *
 * e.g. Major scale: [0, 2, 4, 5, 7, 9, 11]
 *
 * One "ordinal" is an integer representing the number of semitones in the
 * interval. An array of ordinals can represent an interval set.
 *
 * BINARY
 *
 * e.g. Major scale: 0b101010110101
 *
 * We use binary numbers here to store sets of intervals. These binary numbers
 * are "big-endian".
 *
 * Examples:
 *
 * - An interval set of 0b000000000001 (aka 0b1) represents a set with only the
 *   tonal center (interval 0) being active.
 * - An interval set of 0b100000000000 represents a set with only the major
 *   seventh (interval 11) being active.
 * - An interval set of 0b000010010001 represents a set with: the tonal center
 *   (interval 0), a major third (interval 5), and a perfect fifth (interval 7).
 *
 */
export class IntervalSet {

  /**
   * The binary representation of this IntervalSet (as explained in IntervalSet
   * docs).
   */
  binary: number;

  /**
   * @param binary The binary representation of the IntervalSet
   * @param shouldAnalyze When true, attempt to identify named scales and chords
   * for this IntervalSet. We don't do this by default because it's expensive.
   */
  constructor(binary: number) {
    this.binary = IntervalSetBinary.onlyChromatic(binary);
  }

  static fromBinary(binary: number) {
    return new IntervalSet(binary);
  }

  /**
   * Return a new IntervalSet, given the ordinals for its intervals.
   *
   * @param ordinals - e.g. [0, 4, 7] for a major chord
   */
  static fromOrdinals(ordinals: number[]): IntervalSet {
    return new IntervalSet(IntervalSetBinary.fromOrdinals(ordinals));
  }

  /**
   * Return an interval set containing all the intervals.
   */
  static get chromatic(): IntervalSet {
    return new IntervalSet(IntervalSetBinary.chromatic);
  }

  static get chromaticOrdinals(): number[] {
    return [...Array(divisions).keys()];
  }

  /**
   * Return an array of interval ordinals present in this set.
   *
   * @return e.g [0, 4, 7] for a major chord
   */
  get ordinals(): number[] {
    return IntervalSetBinary.toOrdinals(this.binary);
  }

  /**
   * Test whether this IntervalSet contains the given ordinal.
   * 
   * @param ordinal e.g. 7 for a perfect fifth
   */
  hasOrdinal(ordinal: number) {
    return IntervalSetBinary.containsOrdinal(this.binary, ordinal);
  }

  /**
   * Ensure that the given ordinal is included within this interval set.
   */
  withOrdinal(ordinal: number) {
    const binary = IntervalSetBinary.withOrdinal((this.binary), ordinal);
    return new IntervalSet(binary);
  }

  /**
   * Test whether the given interval is active within this interval set.
   */
  isActive(interval: number): boolean {
    return IntervalSetBinary.containsOrdinal(this.binary, interval);
  }

  /**
   * Return true if the given set is a subset of this set.
   */
  contains(intervalSet: IntervalSet): boolean {
    return (this.binary & intervalSet.binary) === intervalSet.binary;
  }

  /**
   * Return true if the given set can be a subset of this set if the two sets
   * are properly shifted with respect to one another.
   */
  canContain(intervalSet: IntervalSet): boolean {
    if (intervalSet.count > this.count) {
      return false;
    }
    const sub = intervalSet.shiftedToHaveTonalCenter;
    return this.modes.some(is => is.contains(sub));
  }

  /**
   * If this set doesn't have a tonal center, return a new set that does by
   * shifting this one.
   */
  get shiftedToHaveTonalCenter() {
    return this.shift(this.ordinals[0]);
  }

  /**
   * Return true if this set has a tonal center. False if not.
   */
  get hasTonalCenter() {
    return this.contains(new IntervalSet(1));
  }

  /**
   * Return true if all of the intervals in this set match all of the intervals
   * in the given set.
   */
  isIdenticalTo(intervalSet: IntervalSet): boolean {
    return this.binary === intervalSet.binary;
  }

  /**
   * Left-shift the bits of the binary intervals by the number of bits given,
   * and wrap the bit around the right side. This corresponds to rotating the
   * scale clockwise by the number of intervals given.
   */
  shift(shiftAmount: number): IntervalSet {
    const shift = Scalar.wrap(Math.round(shiftAmount), divisions);
    const shiftToWrap = divisions - shift;
    const allBits = (this.binary << shift) | (this.binary >> shiftToWrap);
    return new IntervalSet(allBits);
  }

  /**
   * Shift this interval set to a different mode of itself.
   */
  modeShift(amount: number): IntervalSet {
    const ordinal = Scalar.wrap(amount, this.count);
    return this.shift(-this.ordinals[ordinal]);
  }

  /**
   * Shift this interval set within a superset to form a new interval set that
   * still fits within the superset. For example, shift a C major chord within a
   * C major scale one stop to form a D minor chord. Or shift it -1 stop to form
   * a B diminished chord.
   */
  shiftWithinSuperset(superset: IntervalSet, shiftStops: number) {
    return IntervalSet.fromOrdinals(this.ordinals.map(ordinal => {
      const superOrdinals = superset.ordinals;
      const index = superOrdinals.indexOf(ordinal);
      if (index === -1) {
        throw new Error(
          'Unable to shift because intervalSet is not contained within super'
        );
      }
      const newIndex = Scalar.wrap(index + shiftStops, superOrdinals.length);
      return superOrdinals[newIndex];
    }));
  }

  /**
   * Return a new interval set with intervals toggled where the given binary
   * bits are true.
   */
  toggleBinaryIntervals(binary: number): IntervalSet {
    return new IntervalSet(this.binary ^ binary);
  }

  /**
   * Return a new IntervalSet with one interval toggled, as specified by its
   * ordinal.
   */
  toggleIntervalOrdinal(ordinal: number): IntervalSet {
    return this.toggleBinaryIntervals(IntervalSetBinary.fromOrdinal(ordinal));
  }

  /**
   * Return a new interval set that contains all the intervals this set
   * doesn't contain.
   */
  get compliment(): IntervalSet {
    return this.toggleBinaryIntervals(IntervalSetBinary.chromatic);
  }

  /**
   * Return a new IntervalSet that is a union of this IntervalSet and the given
   * IntervalSet.
   */
  union(intervalSet: IntervalSet) {
    const binary = IntervalSetBinary.union(this.binary, intervalSet.binary);
    return new IntervalSet(binary);
  }
  
  /**
   * How many intervals in in this set?
   */
  get count(): number {
    return this.ordinals.length;
  }

  /**
   * Return an array of IntervalSets which are modes of this IntervalSet.
   */
  get modes(): IntervalSet[] {
    return this.ordinals.map(ordinal => this.shift(-ordinal));
  }

  /**
   * Compare this IntervalSet to the given IntervalSet. If this IntervalSet can
   * be shifted to become the given intervalSet, then return the minimum number
   * of (positive) shifts necessary. If there is no way that this IntervalSet
   * can be shifted to become the given intervalSet, then return null.
   *
   * @return e.g.
   *   - 0 if this IntervalSet and the given IntervalSet are identical.
   *   - 1 if this IntervalSet can become the given IntervalSet with one mode
   *     shift.
   *   - 2, 3, 4... and so on.
   *   - null if the two IntervalSets are not modes of each other.
   */
  modeShiftsToBeIdenticalTo(intervalSet: IntervalSet): number | null {
    // For performance, abandon early if we have a count mismatch.
    if (this.count !== intervalSet.count) {
      return null;
    }
    const i = this.modes.findIndex(inv => inv.isIdenticalTo(intervalSet));
    return i >= 0 ? i : null;
  }

}

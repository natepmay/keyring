import { arrayHasConsistentValues } from "./Misc";

test('arrayHasConsistentValues', () => {
  expect(arrayHasConsistentValues([true, true])).toBe(true);
  expect(arrayHasConsistentValues([false, false, true])).toBe(false);
  expect(arrayHasConsistentValues([])).toBe(true);
  expect(arrayHasConsistentValues([0])).toBe(true);
  expect(arrayHasConsistentValues([0, '0'])).toBe(false);
});

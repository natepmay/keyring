export function arrayHasConsistentValues(a: any[]): boolean {
  let previousValue;
  for (const value of a) {
    if (previousValue !== undefined && previousValue !== value) {
      return false;
    }
    previousValue = value;
  }
  return true;
}

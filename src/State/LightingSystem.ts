import { Light } from "./Light";

export class LightingSystem {
  /**
   * Assumed to be constant a runtime. Current code will not be reactive when
   * adding/removing lights at runtime.
   */
  lights: Map<string, Light>;

  constructor(lightIds: string[] = []) {
    this.lights = new Map(lightIds.map(id => [id, new Light()]));
  }

  /**
   * @returns true if the light was found
   */
  press(id: string): boolean {
    const light = this.lights.get(id);
    if (!light) {
      return false;
    }
    light.incrementPresses();
    return true;
  }

  /**
   * @returns true if the light was found
   */
  release(id: string): boolean {
    const light = this.lights.get(id);
    if (!light) {
      return false;
    }
    light.decrementPresses();
    return true;
  }
}

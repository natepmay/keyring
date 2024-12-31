import { derived, type Readable, writable } from "svelte/store";

export class Light {
  presses = writable(0);

  isOn: Readable<boolean>;

  constructor() {
    this.isOn = derived(this.presses, (p) => p > 0);
  }

  incrementPresses() {
    this.presses.update((p) => p + 1);
  }

  decrementPresses() {
    this.presses.update((p) => Math.max(p - 1, 0));
  }
}

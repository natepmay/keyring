import {get, writable} from 'svelte/store';

export class RotationController {
  
  /**
   * The current value of rotation, which changes constantly as the user
   * interacts with the object.
   */
  rotation = writable(0);

  /**
   * The rotation value that will be set if the user releases the object at
   * its current position.
   */
  currentDetent = writable(0);

  /**
   * True when the user is rotating the object and also when the object is
   * transitioning to rest after the user has released it.
   */
  isRotating = writable(false as boolean);

  reset() {
    this.isRotating.set(false);
    this.rotation.set(0);
    this.currentDetent.set(0);
  }

  /**
   * Rotate automatically from 0 to the target rotation value. Then rotate to 0
   * instantaneously thereafter.
   * 
   * @param target The final rotation value
   * @param duration The time (in ms) to spend rotating
   * 
   */
  animateTo(target: number, duration: number = 150) {
    return new Promise<void>((resolve, reject) => {
      if (get(this.isRotating)) {
        console.log('reject');
        reject();
        return;
      }
      this.isRotating.set(true);
      const transitionDuration = duration;
      const transitionVelocity = target / transitionDuration;
      let transitionStartTime: DOMHighResTimeStamp | undefined;
  
      const stepTransition = (currentTime: DOMHighResTimeStamp) => {
        if (transitionStartTime === undefined) {
          transitionStartTime = currentTime;
        }
        const timeElapsed = currentTime - transitionStartTime;
        const transitionIsComplete = timeElapsed >= (transitionDuration || 0);
        if (transitionIsComplete) {
          transitionStartTime = undefined;
          this.isRotating.set(false);
          this.rotation.set(0);
          resolve();
        }
        else {
          const deltaR = transitionVelocity * timeElapsed;
          this.rotation.set(deltaR);
          window.requestAnimationFrame(stepTransition);
        }
      };
  
      window.requestAnimationFrame(stepTransition);
    });
  }

}

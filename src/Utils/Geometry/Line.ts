import { CustomMath } from "../Math/CustomMath";
import type { XyPoint } from "./XyPoint";

export class XyLine {

  start: XyPoint;

  end: XyPoint;

  constructor(start: XyPoint, end: XyPoint) {
    this.start = start;
    this.end = end;
  }

  get hue() {
    return CustomMath.segmentHue(this.start.toI(), this.end.toI());
  }

}

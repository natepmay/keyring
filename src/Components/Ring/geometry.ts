const outerRadius = 425;
const innerRadius = 110;
const keyMargin = 20;
const outerKeyRadius = outerRadius - keyMargin;
const innerKeyRadius = innerRadius + keyMargin;
const backgroundHeight = outerRadius - innerRadius;
const keyHeight = outerKeyRadius - innerKeyRadius;
const middleRadius = (outerRadius + innerRadius) / 2;
const structureRadius = 360;
const lineThickness = 3;
const dividerAngle = 0.01;
const textRadius = 458;

export const geometry = {
  outerRadius,
  outerKeyRadius,
  innerKeyRadius,
  backgroundHeight,
  keyHeight,
  textRadius,
  middleRadius,
  structureRadius,
  lineThickness,
  dividerAngle,
};

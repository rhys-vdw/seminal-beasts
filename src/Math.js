const CIRCLE_RAD = 2 * Math.PI

export const DEGREES_TO_RADIANS = 180 / Math.PI

export function toDegrees(radians = 0) {
  return radians * DEGREES_TO_RADIANS;
}

export function wrapRadians(radians) {
  return radians < 0
    ? CIRCLE_RAD + radians % CIRCLE_RAD
    : radians % CIRCLE_RAD
}

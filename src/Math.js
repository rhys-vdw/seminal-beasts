const CIRCLE_RAD = 2 * Math.PI

export function wrapRadians(radians) {
  return radians < 0
    ? CIRCLE_RAD + radians % CIRCLE_RAD
    : radians % CIRCLE_RAD
}

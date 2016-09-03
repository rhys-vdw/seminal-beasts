import { isNumber } from 'lodash'

const CIRCLE_RAD = 2 * Math.PI

export const DEGREES_TO_RADIANS = 180 / Math.PI

export function lerp(from, to, amount) {
  if (!isNumber(amount)) throw new TypeError(
    `Expected amount to be a number, got: ${amount}`
  )
  return from + amount * (to - from)
}

export function toDegrees(radians = 0) {
  return radians * DEGREES_TO_RADIANS
}

export function wrapRadians(radians) {
  return radians < 0
    ? CIRCLE_RAD + radians % CIRCLE_RAD
    : radians % CIRCLE_RAD
}

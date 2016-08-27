import { Color } from 'svgjs'

export function intRange (from, to) {
  return Math.floor(from + Math.random() * (to - from))
}

export function range (from, to) {
  return from + Math.random() * (to - from)
}

export function color () {
  return new Color({
    r: intRange(0, 255),
    g: intRange(0, 255),
    b: intRange(0, 255),
  })
}

export function angle() {
  return range(0, 2 * Math.PI);
}

export function downAngle() {
  return range(0, Math.PI);
}


export function upAngle() {
  return range(Math.PI, 2 * Math.PI);
}

import Color from 'tinycolor2'

export function intRange (from, to) {
  return Math.floor(range(from, to))
}

export function range (from, to) {
  return from + Math.random() * (to - from)
}

export function color () {
  return Color.fromRatio({
    h: Math.random(),
    s: Math.random(),
    l: range(0.2, 0.8),
    a: 0.95
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

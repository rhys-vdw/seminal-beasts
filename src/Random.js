export function range (from, to) {
  return from + Math.random() * (to - from)
}

export function color () {
  return `#${Math.floor(Math.random() * 255 * 255 * 255).toString(16)}`
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

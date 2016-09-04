import Random from 'random-js'
import { mergeWith, isNumber, zipWith } from 'lodash'
import { lerp } from '../Math'

const randomBool = Random.bool()
const random01 = Random.real(0, 1, true)

function interleaveNodes(mt, left, right) {
  return zipWith(left, right, (l, r) => randomBool(mt) ? l : r)
}

function splice(mt, left, right) {
  const index = Random.integer(0, left.length)(mt)
  return randomBool(mt)
    ? left.slice(0, index).concat(right.slice(index))
    : right.slice(0, index).concat(left.slice(index))
}

function interleaveGenes(mt, left, right) {
  return mergeWith([], left, right, (lValue, rValue) => {
    if (isNumber(rValue)) {
      return randomBool(mt) ? lValue : rValue
    }
  })
}

function randomLerp(mt, left, right) {
  return mergeWith([], left, right, (lValue, rValue) => {
    if (isNumber(rValue)) {
      return lerp(lValue, rValue, random01(mt))
    }
  })
}

function average(mt, left, right) {
  return mergeWith([], left, right, (lValue, rValue) => {
    if (isNumber(rValue)) {
      return (rValue + lValue) / 2
    }
  })
}

export default {
  interleaveGenes, interleaveNodes, splice, randomLerp, average
}

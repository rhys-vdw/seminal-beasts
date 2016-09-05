import Random from 'random-js'
import { times } from 'lodash'

import {
  TYPE, WIDTH, LENGTH, COLOR_HUE, COLOR_SATURATION, COLOR_VALUE, MIRROR
} from '../constants/GenePropertyType'
import { NECK_VALUE } from '../constants/GeneType'
import Color from 'tinycolor2'


/*
function createNode(
  genome,
  { type, width, length, hue, saturation, lightness, mirror },
  position = genome.length
) {
  genome[position + TYPE]             = type || 0
  genome[position + WIDTH]            = width || 0
  genome[position + LENGTH]           = length || 0
  genome[position + COLOR_HUE]        = hue || 0
  genome[position + COLOR_SATURATION] = saturation || 0
  genome[position + COLOR_VALUE]      = lightness || 0
  genome[position + MIRROR]           = mirror || 0
}
*/

function createRandomNode(random, color, type) {
  const hsl = color.toHsl()

  return {
    type: type == null ? random.real(0, 1, true) : type,
    width: random.real(0, 1, true),
    length: random.real(0, 1, true),
    hue: hsl.h,
    saturation: hsl.s,
    lightness: hsl.l,
    angle: random.real(0, 1, true),
    offset: random.real(0, 1, true),
    thickness: random.real(0, 1, true),
    curve: random.real(0, 1, true),
    mirror: random.real(0, 1, true),
    movement: random.real(0, 1, true),
  }
}

function createNeckNode(random) {
  const node = createRandomNode(random);
  node.type = NECK_VALUE
  return node
}

function randomColor(random) {
  return Color.fromRatio({
    h: random.real(0, 1, true),
    s: random.real(0, 1, true),
    l: random.real(0.2, 0.8, true),
    a: 0.95
  })
}

function colorMutator(random) {
  const color = randomColor(random)
  return function nextColor() {
    return color
      .spin(random.real(-30, 30, true))
      .saturate(random.real(-10, 10, true))
      .brighten(random.real(-5, 5, true))
      .clone()
  }
}

export function createGenome(seed) {
  const random = new Random(Random.engines.mt19937().seed(seed))

  const nextColor = colorMutator(random)
  return [
    createRandomNode(random, randomColor(random)), // IRIS
    ...times(35, () => createRandomNode(random, nextColor())),
    createRandomNode(random, nextColor(), NECK_VALUE), // NECK JOINT
    createRandomNode(random, nextColor()), // NECK SEGMENT
    createRandomNode(random, nextColor()), // HEAD
    createRandomNode(random, randomColor(random)), // MOUTH
    ...times(2, () => createRandomNode(random, nextColor())),
  ]
}

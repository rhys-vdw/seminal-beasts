import * as NodeType from './constants/NodeType'
import { flatMap, times, last } from 'lodash'
import Random from 'random-js'
import Color from 'tinycolor2'

function nestNodes(nodes) {
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].children.push(nodes[i + 1])
  }
}

function createBallJoint({ position, rotation, mirror }, random, nextColor) {
  return {
    type: NodeType.BALL_JOINT,
    position,
    rotation,
    maxAngle: random.real(5, 90),
    size: random.real(10, 40),
    color: nextColor(),
    mirror,
    layer: 1,
    children: []
  }
}

function generateLimb({ rotation, position }, random, nextColor) {
  const nodes = flatMap(times(random.integer(1, 4), index => {
    return [
      createBallJoint(index === 0
        ? { position, rotation, mirror: true }
        : {
            position: [0, 2],
            rotation: random.real(-20, 70),
            mirror: random.bool(0.2)
          }
      , random, nextColor),
      {
        type: NodeType.SEGMENT,
        size: [
          random.real(10, 20),
          random.real(10, 50)
        ],
        color: nextColor(),
        children: []
      }
    ]
  }))

  nestNodes(nodes);

  return nodes[0]
}

function generateHead(random, nextColor) {
  const iris = {
    type: NodeType.IRIS,
    size: random.real(0.1, 0.7),
    color: randomColor(random),
    pupilSize: random.real(0.1, 0.5),
    children: []
  }

  return {
    type: NodeType.CORE,
    position: [0, 2],
    size: [random.real(20, 60), random.real(20, 60)],
    color: nextColor(),
    children: [{
      type: NodeType.MOUTH,
      color: randomColor(random),
      size: [random.real(10, 40), random.real(1, 30)],
      lipThickness: random.real(1, 10),
      curve: random.real(10, -20),
      position: [0, -random.real(0.1, 0.9)],
      children: []
    }, ...times(random.real(1, 3), () => {
      const isSingle = random.bool(0.5);
      return {
        type: NodeType.EYE,
        scale: random.real(3, 20),
        mirror: !isSingle,
        position: [
          isSingle
            ? 0
            : random.real(0.2, 0.5)
        , random.real(0.3, 1)],
        children: [iris]
      }
    })]
  }
}

function generateNeck(random, nextColor) {
  return {
    type: NodeType.NECK,
    maxAngle: 10,
    position: [0, random.real(-0.8, -1)],
    rotation: 0,
    size: random.real(10, 30),
    color: nextColor(),
    children: [{
      type: NodeType.SEGMENT,
      position: [0, 0],
      rotation: 180,
      size: [random.real(10, 20), random.real(20, 30)],
      color: nextColor(),
      children: [generateHead(random, nextColor)]
    }]
  }
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
      .brighten(random.real(-10, 10, true))
      .clone()
  }
}

function generateSpine(random, nextColor) {

  const cores = times(random.integer(1, 5), index => ({
    type: NodeType.CORE,
    size: [random.real(15, 50), random.real(15, 40)],
    position: [0, index === 0 ? 0 : -1],
    color: nextColor(),
    mirror: false,
    children: times(random.real(0, 2), () =>
      generateLimb({
        rotation: random.real(0, 180),
        position: [random.real(0.1, 0.4), random.real(0.6, 1)]
      }, random, nextColor)
    )
  }))

  nestNodes(cores);

  last(cores).children.push(generateNeck(random, nextColor))

  return cores[0]
}

export default function generate(seed) {
  var random = new Random(Random.engines.mt19937().seed(seed));
  const nextColor = colorMutator(random)
  return generateSpine(random, nextColor)
}

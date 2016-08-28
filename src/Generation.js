import * as NodeType from './constants/NodeType'
import * as Random from './Random'
import { times, last } from 'lodash'

function generateLimb({ rotation, position }, nextColor) {
  return {
    type: NodeType.BALL_JOINT,
    position,
    rotation,
    maxAngle: 20,
    size: Random.range(10, 40),
    color: nextColor(),
    mirror: true,
    layer: 1,
    children: [{
      type: NodeType.SEGMENT,
      size: [
        Random.range(10, 20),
        Random.range(10, 50)
      ],
      color: nextColor(),
      children: [{
        type: NodeType.BALL_JOINT,
        maxAngle: 20,
        position: [0, 2],
        rotation: Random.range(-20, 70),
        size: Random.range(10, 30),
        color: nextColor(),
        children: [{
          type: NodeType.SEGMENT,
          size: [
            Random.range(10, 20),
            Random.range(30, 50)
          ],
          color: nextColor(),
          children: []
        }]
      }]
    }]
  }
}

function generateHead(nextColor) {
  return {
    type: NodeType.CORE,
    position: [0, 2],
    size: [Random.range(20, 60), Random.range(20, 60)],
    color: nextColor(),
    children: [{
      type: NodeType.MOUTH,
      color: Random.color(),
      size: [Random.range(10, 40), Random.range(1, 20)],
      lipThickness: Random.range(4, 12),
      borderRadiusX: Random.range(0, 20),
      borderRadiusY: Random.range(0, 20),
      position: [0, -Random.range(0.1, 0.9)],
      children: []
    }, {
      type: NodeType.EYE,
      scale: Random.range(3, 20),
      mirror: true,
      position: [Random.range(0.2, 0.5), Random.range(0.3, 1)],
      children: [{
        type: NodeType.IRIS,
        size: Random.range(0.1, 0.7),
        color: Random.color(),
        pupilSize: Random.range(0.1, 0.5),
        children: []
      }]
    }]
  }
}

function generateNeck(nextColor) {
  return {
    type: NodeType.NECK,
    maxAngle: 10,
    position: [0, Random.range(-0.8, -1)],
    rotation: 0,
    size: Random.range(10, 30),
    color: nextColor(),
    children: [{
      type: NodeType.SEGMENT,
      position: [0, 0],
      rotation: 180,
      size: [Random.range(10, 20), Random.range(20, 30)],
      color: nextColor(),
      children: [generateHead(nextColor)]
    }]
  }
}

function colorMutator(initialColor) {
  const color = initialColor.clone()
  return function nextColor() {
    return color
      .spin(Random.range(-30, 30))
      .saturate(Random.range(-10, 10))
      .brighten(Random.range(-10, 10))
      .clone()
  }
}

function generateSpine(nextColor) {

  const cores = times(Random.range(1, 5), index => ({
    type: NodeType.CORE,
    size: [Random.range(15, 50), Random.range(15, 40)],
    position: [0, index === 0 ? 0 : -1],
    color: nextColor(),
    mirror: false,
    children: times(Random.range(0, 2), () =>
      generateLimb({
        rotation: Random.range(0, 180),
        position: [Random.range(0.1, 0.4), Random.range(0.6, 1)]
      }, nextColor)
    )
  }))

  for (let i = 0; i < cores.length - 1; i++) {
    cores[i].children.push(cores[i + 1])
  }

  last(cores).children.push(generateNeck(nextColor))

  return cores[0]
}

export default function generate() {
  const nextColor = colorMutator(Random.color())
  return generateSpine(nextColor)
}

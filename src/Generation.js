import * as NodeType from './constants/NodeType'
import * as Random from './Random'

function generateLimb({ rotation, position }) {
  return {
    type: NodeType.BALL_JOINT,
    position,
    rotation,
    radius: Random.range(10, 30),
    colors: [Random.color(), Random.color()],
    mirror: true,
    layer: 1,
    children: [{
      type: NodeType.SEGMENT,
      radius: [
        Random.range(10, 20),
        Random.range(30, 50)
      ],
      colors: [Random.color(), Random.color()],
      children: [{
        type: NodeType.BALL_JOINT,
        position: [0, 2],
        rotation: Random.range(-20, 40),
        radius: Random.range(10, 30),
        colors: [Random.color(), Random.color()],
        children: [{
          type: NodeType.SEGMENT,
          radius: [
            Random.range(10, 20),
            Random.range(30, 50)
          ],
          colors: [Random.color(), Random.color()],
          children: []
        }]
      }]
    }]
  }
}

function generateEye() {
}

function generateHead() {
  return {
    type: NodeType.CORE,
    position: [0, 2],
    radius: [Random.range(30, 50), Random.range(30, 50)],
    colors: [Random.color(), Random.color()],
    children: [{
      type: NodeType.MOUTH,
      colors: [Random.color(), Random.color()],
      radius: [Random.range(10, 40), Random.range(10, 20)],
      position: [0, -Random.range(0, 0.9)],
      children: []
    }, {
      type: NodeType.EYE,
      scale: Random.range(3, 20),
      mirror: true,
      position: [Random.range(0.1, 0.5), Random.range(0.3, 1)],
      children: [{
        type: NodeType.IRIS,
        radius: Random.range(0.1, 0.7),
        colors: [Random.color(), Random.color()],
        pupilSize: Random.range(0.1, 0.5),
        children: []
      }]
    }]
  }
}

function generateNeck() {
  return {
    type: NodeType.BALL_JOINT,
    position: [0, Random.range(-0.8, -1)],
    rotation: 0,
    radius: Random.range(10, 30),
    colors: [Random.color(), Random.color()],
    children: [{
      type: NodeType.SEGMENT,
      position: [0, 0],
      rotation: 180,
      radius: [Random.range(10, 20), Random.range(20, 30)],
      colors: [Random.color(), Random.color()],
      children: [generateHead()]
    }]
  }
}

export default function generate() {
  return {
    type: NodeType.CORE,
    radius: [Random.range(30, 50), Random.range(20, 40)],
    colors: [Random.color(), Random.color()],
    mirror: false,
    children: [
      generateLimb({
        rotation: Random.range(0, 30),
        position: [Random.range(0.1, 0.4), Random.range(0.6, 1)]
      }), {
      type: NodeType.CORE,
      position: [0, -1],
      radius: [Random.range(20, 40), Random.range(30, 50)],
      colors: [Random.color(), Random.color()],
      children: [{
        type: NodeType.CORE,
        position: [0, -1],
        radius: [Random.range(40, 60), Random.range(40, 60)],
        colors: [Random.color(), Random.color()],
        children: [
          generateLimb({
            rotation: Random.range(50, 80),
            position: [Random.range(0.4, 0.8), Random.range(0.6, 1)]
          }),
          generateNeck()
        ]
      }]
    }]
  }
}

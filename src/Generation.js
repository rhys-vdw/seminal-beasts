import * as NodeType from './constants/NodeType'
import * as Random from './Random'
import { times } from 'lodash'

/*
const MinHeadNodeLength = 20
const MaxHeadNodeLength = 40
const MinBodyNodeLength = 60
const MaxBodyNodeLength = 90
const SpineAngle = 0.2 * Math.PI

function generateShapeNode (
  minLength = MinBodyNodeLength,
  maxLength = MaxBodyNodeLength
) {
  return {
    type: NodeType.SHAPE,
    angle: Random.angle(),
    length: Random.range(minLength, maxLength),
    children: []
  }
}

// -- Segments --

function generateSegmentNode (count, leafNode) {
  if (count < 1) return leafNode;
  return {
    type: NodeType.SEGMENT,
    length: Random.range(30, 40),
    width: Random.range(10, 30),
    maximumAngle: Random.range(0, Math.PI / 3),
    children: leafNode == null
      ? [] : [generateSegmentNode(count - 1, leafNode)]
  }
}

function generateSegments(min, max, leafNode) {
  const count = Math.floor(Random.range(min, max))
  return generateSegmentNode(count, leafNode)
}

// -- Limbs --

function generateFoot () {
  return {
    type: NodeType.FOOT,
    length: Random.range(0.2, 0.3),
    thickness: Random.range(0.1, 0.2),
    children: []
  }
}

function generateLimb () {
  const foot = generateFoot()
  return generateSegments(2, 2, foot)
}

function generateLimbNodes (count) {
  const limb = generateLimb();
  const limbNode = {
    type: NodeType.LIMB,
    length: Random.range(MinBodyNodeLength, MaxBodyNodeLength),
    children: [generateLimb()]
  }
  return times(2, () => ({ ...limbNode, angle: Random.downAngle() }))
}


// -- Tail --


function generateTail() {
  return generateSegments(0, 3)
}

function generateTailNode () {
  const tail = generateTail()
  return {
    type: NodeType.TAIL,
    angle: Math.PI * 3 / 2 + Random.range(-SpineAngle, SpineAngle), // Right
    length: Random.range(MinBodyNodeLength, MaxBodyNodeLength),
    children: tail == null ? [] : [tail]
  }
}

// -- Head --

function generateIris(eyeRadius) {
  const radius = Random.range(0.02, eyeRadius);
  return {
    type: NodeType.IRIS,
    radius,
    color: Random.color(),
    irisRadius: Random.range(0, radius),
    children: []
  }
}

function generateEyeWithoutAngle() {
  const radius = Random.range(0.02, 0.08);
  return {
    type: NodeType.EYE,
    normalizedPosition: Random.range(0.2, 0.8),
    radius,
    children: [generateIris(radius)],
  }
}

function generateEyes() {
  const eye = generateEyeWithoutAngle();
  return [
    { ...eye, length: 6, angle: Random.upAngle() },
    { ...eye, length: 6, angle: Random.upAngle() }
  ]
}

function generateHead () {
  return {
    type: NodeType.HEAD,
    length: Random.range(0.1, 0.3),
    children: [
      ...generateEyes(),
      ...times(3, () => generateShapeNode(MinHeadNodeLength, MaxHeadNodeLength))
    ]
  }
}


// -- Neck --

function generateNeck() {
  const head = generateHead()
  console.log(head)
  return generateSegments(1, 5, head)
}

function generateNeckNode () {
  return {
    type: NodeType.NECK,
    angle: Math.PI / 2 + Random.range(0, SpineAngle), // Left
    length: Random.range(MinBodyNodeLength, MaxBodyNodeLength),
    children: [generateNeck()]
  }
}

// -- Body --

export default function generateBody () {
  return {
    type: NodeType.BODY,
    colors: [Random.color(), Random.color()],
    children: [
      //...generateLimbNodes(),
      generateNeckNode(),
      generateTailNode(),
      ...times(6, generateShapeNode)
    ]
  }
}
*/

export default function generate() {
  return {
    type: NodeType.CORE,
    radius: [Random.range(30, 50), Random.range(40, 60)],
    colors: [Random.color(), Random.color()],
    mirror: false,
    children: [{
      type: NodeType.BALL_JOINT,
      position: [Random.range(0, 0.25), Random.range(0.6, 1)],
      rotation: Random.range(0, 30),
      radius: Random.range(10, 30),
      colors: [Random.color(), Random.color()],
      children: [{
        type: NodeType.SEGMENT,
        width: Random.range(10, 20),
        length: Random.range(30, 50),
        colors: [Random.color(), Random.color()],
        children: [{
          type: NodeType.BALL_JOINT,
          position: [0, 1],
          rotation: Random.range(0, 30),
          radius: Random.range(10, 30),
          colors: [Random.color(), Random.color()],
          children: []
        }]
      }],
      mirror: true,
    }]
  }
}

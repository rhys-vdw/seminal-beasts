import * as NodeType from './constants/NodeType'
import * as Random from './Random'
import { times } from 'lodash'

const MinBodyNodeLength = 0.6
const MaxBodyNodeLength = 0.9
const SpineAngle = 0.2 * Math.PI

function generateShapeNode () {
  return {
    type: NodeType.SHAPE,
    angle: Random.angle(),
    length: Random.range(MinBodyNodeLength, MaxBodyNodeLength),
    children: []
  }
}

// -- Segments --

function generateSegmentNode (count, leafNode) {
  if (count < 1) return leafNode;
  return {
    type: NodeType.SEGMENT,
    length: Random.range(0.2, 3),
    width: Random.range(0.5, 1),
    maximumAngle: Random.range(0, Math.PI / 3),
    children: generateSegmentNode(count - 1, leafNode)
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
  return {
    type: NodeType.TAIL,
    angle: Random.range(-SpineAngle, SpineAngle), // Right
    length: Random.range(MinBodyNodeLength, MaxBodyNodeLength),
    children: [generateTail()]
  }
}

// -- Head --

function generateIris(eyeRadius) {
  const radius = Random.range(0.02, eyeRadius);
  return {
    type: NodeType.IRIS,
    radius,
    color: Random.color(),
    irisRadius: Random.range(0, radius)
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
    { ...eye, angle: Random.upAngle() },
    { ...eye, angle: Random.upAngle() }
  ]
}

function generateHead () {
  return {
    type: NodeType.HEAD,
    length: Random.range(0.1, 0.3),
    children: generateEyes(),
  }
}


// -- Neck --

function generateNeck() {
  const head = generateHead()
  return generateSegments(1, 2, head)
}

function generateNeckNode () {
  return {
    type: NodeType.NECK,
    angle: Math.PI + Random.range(-SpineAngle, SpineAngle), // Left
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
      ...generateLimbNodes(),
      generateNeckNode(),
      generateTailNode(),
      ...times(6, generateShapeNode)
    ]
  }
}

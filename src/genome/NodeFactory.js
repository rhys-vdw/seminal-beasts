import { findIndex, last } from 'lodash'
import { NECK_VALUE, SPLIT, UNSPLIT, BODY, EYE, MOUTH } from '../constants/GeneType'
import * as NodeType from '../constants/NodeType'
import { lerp } from '../Math'
import Color from 'tinycolor2'
import Vector from 'victor'

function getColor(gene) {
  return Color.fromRatio({
    h: gene.hue,
    s: gene.saturation,
    l: gene.lightness,
    a: 0.95
  })
}

function createCoreNode(gene) {
  return {
    type: NodeType.CORE,
    size: [lerp(15, 50, gene.width), lerp(15, 40, gene.length)],
    position: [0, -1],
    color: getColor(gene),
    mirror: false,
    children: []
  }
}

function createSegmentNode(gene) {
  return {
    type: NodeType.SEGMENT,
    size: [lerp(10, 20, gene.width), lerp(10, 50, gene.length)],
    color: getColor(gene),
    children: []
  }
}

function createNeckJointNode(gene) {
  return {
    type: NodeType.NECK,
    maxAngle: 10,
    position: [0, lerp(-0.8, -1, gene.offset)],
    size: lerp(10, 30, gene.length),
    color: getColor(gene),
    children: [],
  }
}

function createNeckSegmentNode(gene) {
  return {
    type: NodeType.SEGMENT,
    position: [0, 0],
    rotation: 180,
    size: [lerp(10, 20, gene.width), lerp(20, 30, gene.length)],
    color: getColor(gene),
    children: []
  }
}

const createHeadNode = gene  => ({
  type: NodeType.CORE,
  size: [lerp(20, 60, gene.width), lerp(20, 60, gene.length)],
  position: [0, 2],
  color: getColor(gene),
  children: [],
})

const createIrisNode = gene => ({
  type: NodeType.IRIS,
  size: lerp(0.1, 0.7, gene.length),
  color: getColor(gene),
  pupilSize: lerp(0.1, 0.5, gene.width),
  children: []
})

const createMouthNode = gene => {
  return {
    type: NodeType.MOUTH,
    color: getColor(gene),
    size: [lerp(10, 40, gene.width), lerp(1, 30, gene.length)],
    lipThickness: lerp(1, 10, gene.thickness),
    curve: lerp(10, -20, gene.curve),
    position: [0, -lerp(0.1, 0.9, gene.offset)],
    children: []
  }
}

function createJoint(gene, { position, rotation, scale, mirror }) {
  return {
    type: NodeType.BALL_JOINT,
    position,
    rotation,
    maxAngle: lerp(5, 90, gene.movement),
    size: lerp(10, 40, gene.width),
    color: getColor(gene),
    mirror,
    children: [],
    scale,
  }
}

const createShoulderNode = gene => createJoint(gene, {
  position: [
    lerp(0.1, 0.4, gene.offset),
    lerp(0.6, 1, gene.length)
  ],
  rotation: lerp(0, 180, gene.angle),
  mirror: true,
})

const createElbowNode = (gene, mirror, depth) => {
  const scale = depth > 1 ? 0.85 : 1
  return createJoint(gene, {
    position: [0, 2],
    rotation: lerp(-20, 70, gene.angle),
    mirror: gene.mirror > 0.2,
    scale,
  })
}


const createEyeNode = gene => {
  const isCyclops = gene.angle < 0.2

  return {
    type: NodeType.EYE,
    scale: lerp(3, 20, gene.width),
    mirror: !isCyclops,
    position: [
      isCyclops ? 0 : lerp(0.2, 0.5, gene.angle),
      lerp(0.3, 1, gene.offset)
    ],
    children: []
  }
}

function headNodeType(type) {
  return [EYE, SPLIT, UNSPLIT][Math.floor(type * 3)]
}

function bodyNodeType(type) {
  //return [SPLIT, UNSPLIT, BODY][Math.floor(type * 3)]
  if (type < 0.4) return SPLIT
  if (type < 0.8) return UNSPLIT
  return BODY
}

function childAndReplaceLast(array, node) {
  if (array.length === 0) {
    array.push(node)
  } else {
    array[array.length - 1].children.push(node)
    array[array.length - 1] = node
  }
}

function popParent(array) {
  if (array.length > 1) {
    array.pop()
  }
}

export function fromGenome(genome) {
  const neckIndex = findIndex(genome, { type: NECK_VALUE })
  if (neckIndex === -1) throw new TypeError('no neck!')
  const parentStack = []

  const iris = createIrisNode(genome[0])

  let isSplit = true
  let limbLength = 0

  let root = null;

  for (let i = 1; i < neckIndex; i++) {
    const gene = genome[i]
    const type = bodyNodeType(gene.type)

    if (type === BODY) {

      if (parentStack.length === 0) {

        // First core. Just initialize the parent stack.
        root = createCoreNode(gene)
        parentStack.push(root)

      } else if (parentStack.length === 1) {

        // We are still building the core.

        if (isSplit) {

          // A split has been recorded. This next node must be a shoulder.
          isSplit = false
          limbLength = 1
          const joint = createShoulderNode(gene)
          last(parentStack).children.push(joint)
          parentStack.push(joint)

        } else { // Not a split

          // Or build a core
          childAndReplaceLast(parentStack, createCoreNode(gene))
        }

      } else {

        // Extending an arm
        limbLength++
        if (limbLength % 2 === 0) {
          childAndReplaceLast(parentStack, createSegmentNode(gene))
        } else {
          childAndReplaceLast(parentStack, createElbowNode(gene, isSplit, parentStack.length))
          isSplit = false
        }
      }
    } else if (type === SPLIT) {
      // Only split if there is at least one core.
      isSplit = parentStack.length >= 1
    } else if (type === UNSPLIT) {

      // (split, unsplit) -> ignore
      isSplit = false

      // (joint, unsplit) -> ignore
      // (segment, unsplit) -> collapse split
      const parent = last(parentStack)
      if (parent && parent.type !== NodeType.BALL_JOINT) {
        popParent(parentStack)
      }
    }
  }

  if (parentStack.length > 0) {
    // Remove all nesting
    parentStack.length = 1
    childAndReplaceLast(parentStack, createNeckJointNode(genome[neckIndex]))
  } else {
    root = createNeckJointNode(genome[neckIndex])
    parentStack.push(root)
  }

  childAndReplaceLast(parentStack, createNeckSegmentNode(genome[neckIndex + 1]))
  childAndReplaceLast(parentStack, createHeadNode(genome[neckIndex + 2]))

  last(parentStack).children.push(createMouthNode(genome[neckIndex + 3]))
  last(parentStack).children.push(createEyeNode(genome[neckIndex + 4]))
  if (genome[neckIndex + 5].type > 0.8) {
    last(parentStack).children.push(createEyeNode(genome[neckIndex + 5]))
  }

  return { iris, root }
}

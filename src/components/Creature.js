import React from 'react'
import * as NodeType from '../constants/NodeType'
import Vector from 'victor'

function BallJoint({ node }) {
  const { radius, colors } = node
  return (
    <ellipse
      cx={0} cy={0}
      rx={radius} ry={radius}
      fill={colors[0]}
    />
  )
}

function Segment({ node }) {
  const { width, length, colors } = node
  return (
    <ellipse
      cx={0} cy={length}
      rx={width} ry={length}
      fill={colors[0]}
    />
  )
}


function Core({ node }) {
  const { radius, colors } = node
  return (
    <ellipse
      cx={0} cy={0}
      rx={radius[0]} ry={radius[1]}
      fill={colors[0]}
    />
  )
}

const componentByType = {
  [NodeType.CORE]: Core,
  [NodeType.BALL_JOINT]: BallJoint,
  [NodeType.SEGMENT]: Segment,
}

function groupTransform(parent, node, isMirrored) {

  const mirrorSign = isMirrored ? -1 : 1

  const scale = Vector.fromArray(Array.isArray(parent.radius)
    ? parent.radius
    : [parent.radius, parent.radius])

  const rotation = 180 * isMirrored
    ? -(node.rotation || 0)
    : node.rotation || 0

  const position = node.position || [0, 0]

  const translation = new Vector(0, position[1])
    .rotateDeg(position[0] * 180)
    .multiply(new Vector(mirrorSign, 1))
    .multiply(scale)

  console.log(translation.toString())

  return `translate(${translation.x}, ${translation.y})rotate(${rotation})`
}

function Node({ node, parent, isMirrored }) {
  const NodeComponent = componentByType[node.type]

  if (NodeComponent == null) {
    console.error(`Unexpected node type: ${node.type}`)
    return false
  }

  const children = node.children.reduce((result, childNode, i) => {
    result.push(
      <Node key={i} parent={node} node={childNode} />
    )
    if (childNode.mirror) result.push(
      <Node key={`${i}-mirrored`}
        parent={node}
        node={childNode}
        isMirrored={true}
      />
    )
    return result
  }, [])

  return (
    <g
      className={node.type + ' ' + isMirrored}
      transform={groupTransform(parent, node, isMirrored)}
    >
      <NodeComponent node={node} />
      { children }
    </g>
  )
}

const DEFAULT_PARENT = {
  radius: [1, 1],
  rotation: 0,
}

export default function CreatureContainer({ creature, width, height }) {
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        <Node node={creature} parent={DEFAULT_PARENT} />
      </g>
    </svg>
  )
}

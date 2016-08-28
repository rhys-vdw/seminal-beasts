import React from 'react'
import * as NodeType from '../constants/NodeType'
import Vector from 'victor'

function Eye({ node }) {
  return (
    <ellipse
      cx={0} cy={0}
      rx={1} ry={1}
      stroke='brown'
      strokeWidth={0.3}
      fill='white'
    />
  )
}

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
  const { width, radius, colors } = node
  return (
    <ellipse
      cx={0} cy={radius[1]}
      rx={radius[0]} ry={radius[1]}
      fill={colors[0]}
    />
  )
}

function Mouth({ node }) {
  const { radius, colors } = node
  return (
    <rect
      x={-radius[0] / 2} y={-radius[1] / 2}
      width={radius[0]} height={radius[1]}
      fill={'black'}
      stroke={colors[0]}
      strokeWidth={8}
      rx={4}
      ry={4}
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
  [NodeType.MOUTH]: Mouth,
  [NodeType.EYE]: Eye,
}

function groupTransform(parent, node, isMirrored) {

  const mirrorSign = isMirrored ? -1 : 1

  const rotation = node.rotation || 0

  const position = node.position || [0, 0]

  const scale = node.scale || 1

  const translationScale = Vector.fromArray(Array.isArray(parent.radius)
    ? parent.radius
    : [parent.radius, parent.radius])

  const translation = new Vector(0, position[1])
    .rotateDeg(position[0] * 180)
    .multiply(translationScale)


  console.log(translation.toString())

  return `scale(${mirrorSign}, 1)translate(${translation.x}, ${translation.y})rotate(${rotation})scale(${scale})`
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

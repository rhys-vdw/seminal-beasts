import React, { PureComponent, PropTypes } from 'react'
import * as NodeType from '../constants/NodeType'
import Vector from 'victor'
import * as Random from '../Random'

function Iris({ node }) {
  const { size, color, pupilSize } = node
  return (
    <g>
      <ellipse
        cx={0} cy={0}
        rx={size} ry={size}
        fill={color}
      />
      <ellipse
        cx={0} cy={0}
        rx={pupilSize} ry={pupilSize}
        fill='black'
      />
      <ellipse
        cx={-0.1} cy={0.1}
        rx={pupilSize * 0.2} ry={pupilSize * 0.2}
        fill='white'
      />
    </g>
  )
}

function Eye({ node, children }, { isBlinking }) {
  const scaleY = isBlinking ? 0 : 1;
  return (
    <g
      className='Eye'
      style={{
        transform: `scale(1, ${scaleY})`,
        transition: `transform 50 ease-out`
      }}
    >
      <ellipse
        className="eye"
        cx={0} cy={0}
        rx={1} ry={1}
        stroke='rgb(100, 100, 100)'
        strokeWidth={0.3}
        fill='white'
      />
      { children }
    </g>
  )
}

Eye.contextTypes = {
  isBlinking: PropTypes.bool.isRequired,
}

class BallJoint extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { angle: 0 }
    this.updateAngle = this.updateAngle.bind(this)
  }

  updateAngle() {
    const { maxAngle } = this.props.node;
    const angle = Random.range(0, maxAngle) - maxAngle / 2
    this.setState({ angle })
  }

  componentDidMount() {
    this.intervalId = setInterval(
      this.updateAngle,
      Random.range(300, 500)
    )
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const { node, children } = this.props
    const { size, color } = node
    const { angle } = this.state
    return (
      <g
        className='BallJoint'
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <ellipse
          cx={0} cy={0}
          rx={size} ry={size}
          fill={color}
        />
        { children }
      </g>
    )
  }
}

function Segment({ node, children }) {
  const { width, size, color } = node
  return (
    <g className='Segment'>
      <ellipse
        cx={0} cy={size[1]}
        rx={size[0]} ry={size[1]}
        fill={color}
      />
      { children }
    </g>
  )
}

function Mouth({ node }) {
  const { size, color } = node
  return (
    <g className='Mouth'>
      <rect
        x={-size[0] / 2} y={-size[1] / 2}
        width={size[0]} height={size[1]}
        fill={'black'}
        stroke={color}
        strokeWidth={node.lipThickness}
        rx={node.borderRadiusX}
        ry={node.borderRadiusY}
      />
    </g>
  )
}

function Core({ node, children }) {
  const { size, color } = node
  return (
    <g className='Core'>
      <ellipse
        cx={0} cy={0}
        rx={size[0]} ry={size[1]}
        fill={color}
      />
      { children }
    </g>
  )
}

const componentByType = {
  [NodeType.CORE]: Core,
  [NodeType.BALL_JOINT]: BallJoint,
  [NodeType.SEGMENT]: Segment,
  [NodeType.MOUTH]: Mouth,
  [NodeType.EYE]: Eye,
  [NodeType.IRIS]: Iris,
}

function groupTransform(parent, node, isMirrored) {

  const mirrorSign = isMirrored ? -1 : 1

  const rotation = node.rotation || 0

  const position = node.position || [0, 0]

  const scale = node.scale || 1

  const translationScale = Vector.fromArray(Array.isArray(parent.size)
    ? parent.size
    : [parent.size, parent.size])

  const translation = new Vector(0, position[1])
    .rotateDeg(position[0] * 180)
    .multiply(translationScale)

  return [
    `scale(${mirrorSign}, 1)`,
    `translate(${translation.x}px, ${translation.y}px)`,
    `rotate(${rotation}deg)`,
    `scale(${scale})`
  ].join(' ')
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
      className={node.type}
      style={{ transform: groupTransform(parent, node, isMirrored) }}
    >
      <NodeComponent node={node}>
        { children }
      </NodeComponent>
    </g>
  )
}

const DEFAULT_PARENT = {
  size: [1, 1],
  rotation: 0,
}

export default class Creature extends PureComponent {

  constructor(props) {
    super(props)
    this.state = { isBlinking: false }
    this.updateBlink = this.updateBlink.bind(this)
  }

  updateBlink() {
    const { isBlinking } = this.state;
    this.setState({ isBlinking: !isBlinking })

    const duration = isBlinking
      ? Random.range(500, 5000)
      : Random.range(200, 300)

    this.timeoutId = setTimeout(this.updateBlink, duration)
  }

  componentDidMount() {
    this.updateBlink()
  }

  getChildContext() {
    const { isBlinking } = this.state
    return { isBlinking }
  }

  render() {
    const { creature, width, height } = this.props;
    return (
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <Node node={creature} parent={DEFAULT_PARENT} />
        </g>
      </svg>
    )
  }
}

Creature.childContextTypes = {
  isBlinking: PropTypes.bool.isRequired,
}

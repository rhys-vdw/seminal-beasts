import React, { PureComponent, PropTypes } from 'react'
import * as NodeType from '../constants/NodeType'
import Vector from 'victor'
import random from '../random'

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

function Eye({ node, children }, { isBlinking, iris }) {
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
      <Iris node={iris} />
    </g>
  )
}

Eye.contextTypes = {
  isBlinking: PropTypes.bool.isRequired,
  iris: PropTypes.object.isRequired,
}

class BallJoint extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { angle: 0 }
    this.updateAngle = this.updateAngle.bind(this)
  }

  updateAngle() {
    const { maxAngle } = this.props.node;
    const angle = random.integer(0, maxAngle) - maxAngle / 2
    this.setState({ angle })
  }

  componentDidMount() {
    this.intervalId = setInterval(
      this.updateAngle,
      random.integer(300, 500)
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

class Mouth extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { isSucking: true }
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleMouseOver() {
    this.setState({ isSucking: true })
  }

  handleMouseLeave() {
    this.setState({ isSucking: false })
  }

  componentDidMount() {
    this.setState({ isSucking: false })
  }

  render() {
    const { node } = this.props;
    const { size, color, curve } = node;
    const { isSucking } = this.state;

    const halfWidth = size[0] / 2

    return (
      <g className='Mouth'
      >
        { !isSucking && (
          <path
            d={[
              `M ${-halfWidth} 0`,
              `Q 0 ${curve}, ${halfWidth} 0`
            ].join(' ')}
            fill={'transparent'}
            stroke={color}
            strokeWidth={node.lipThickness * 2}
            strokeLinecap="round"
          />
        ) }
        { isSucking && (
          <ellipse
            cx={0} cy={0}
            rx={Math.max(15, halfWidth)}
            ry={Math.max(15, halfWidth)}
            fill='black'
            stroke={color}
            strokeWidth={node.lipThickness}
          />
        ) }
        <ellipse
          cx={0} cy={0}
          rx={30}
          ry={30}
          fill='transparent'
          strokeWidth={0}
          onMouseOver={this.handleMouseOver}
          onMouseLeave={this.handleMouseLeave}
        />
      </g>
    )
  }

  /*
      <rect
        x={-size[0] / 2} y={-size[1] / 2}
        width={size[0]} height={size[1]}
        fill={'black'}
        stroke={color}
        strokeWidth={node.lipThickness}
        rx={node.borderRadiusX}
        ry={node.borderRadiusY}
      />
      */
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
  [NodeType.NECK]: BallJoint,
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

  const counts = {};

  const children = node.children.reduce((result, childNode, i) => {

    // Increment count
    counts[childNode.type] = (counts[childNode.type] || 0) + 1;

    const key = childNode.type + counts[childNode.type]

    result.push(
      <Node key={key} parent={node} node={childNode} />
    )
    if (childNode.mirror) result.push(
      <Node key={`${key}-mirrored`}
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
      ? random.integer(500, 5000)
      : random.integer(200, 300)

    this.timeoutId = setTimeout(this.updateBlink, duration)
  }

  componentDidMount() {
    this.updateBlink()
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }

  getChildContext() {
    const { isBlinking } = this.state
    return {
      isBlinking,
      iris: this.props.creature.iris
    }
  }

  render() {
    const { creature, width, height } = this.props;
    return (
      <svg
        width={width}
        height={height}
        viewBox={`-300 -300 600 500`}
      >
        <Node node={creature.root} parent={DEFAULT_PARENT} />
      </svg>
    )
  }
}

Creature.childContextTypes = {
  isBlinking: PropTypes.bool.isRequired,
  iris: PropTypes.object.isRequired,
}

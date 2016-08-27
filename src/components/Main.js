import React, { PureComponent } from 'react';
import Svg from 'svgjs';
import Vector from 'victor';
import { orderBy } from 'lodash';
import { toDegrees, wrapRadians } from '../Math';
import * as NodeType from '../constants/NodeType';

function drawPolygon(parent, nodes, marker = 'white') {
  const sorted = orderBy(nodes, c => wrapRadians(c.angle))

  const points = sorted.map(({ length, angle }) =>
    new Vector(0, length).rotate(angle).toArray()
  )

  const poly = parent.polygon(points)
  parent.circle(10,10).center(0,0).fill(marker).stroke({ color: 'black' }).front()
  return poly;
}

function drawSegment(parent, node) {
  const color = colors.pop() || 'black';
  parent.circle(node.width)
    .center(0,0)
    .fill(color)

  parent
    .rect(node.width, node.length)
    .fill(color)
    .move(-node.width / 2, 0)
}

function drawHead(parent, node) {
  drawPolygon(parent, node.children, 'pink')
}

const colors = ['green', 'red', 'blue', 'yellow']

function drawNode(parent, node) {
  switch (node.type) {
    case NodeType.BODY:
      const gradient = parent.gradient('radial', stop => {
        stop.at(0, node.colors[0])
        stop.at(1, node.colors[1])
      })
      drawPolygon(parent, node.children)
        .fill(gradient)
        .stroke({ width: 2, color: 'black' });
      break;
    case NodeType.SEGMENT:
      drawSegment(parent, node)
      break;
    case NodeType.SHAPE:
      break;
    case NodeType.HEAD:
      drawHead(parent, node)
    default:
      console.error('Unexpected node type: ' + node.type);
  }


  node.children.forEach(child => {
    const rotation = toDegrees(child.angle || 0)
    const childGroup = parent.group().addClass(child.type + ' ' + rotation)
    childGroup
      .rotate(node.angle || 0)
      .translate(0, node.length)
      .rotate(rotation)
    drawNode(childGroup, child);
  });

  return parent;
}

function drawCreature(draw, creature) {
  console.log(creature);
  const root = draw.group().transform({ x: 300, y: 300 });
  drawNode(root, creature);
}

export default class Main extends PureComponent {
  componentDidMount() {
    this.draw = Svg(this.svgElement).size(1280, 760)
    drawCreature(this.draw, this.props.creature)
  }

  render() {
    return (
      <div className='Main'>
        <svg ref={element => this.svgElement = element}></svg>
      </div>
    );
  }
}

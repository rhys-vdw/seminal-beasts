import React, { PureComponent } from 'react';
import Svg from 'svgjs';
import Vector from 'victor';
import { each, orderBy } from 'lodash';
import { wrapRadians } from '../Math';

function drawCreature(draw, creature) {

  const gradient = draw.gradient('radial', stop => {
    stop.at(0, creature.colors[0])
    stop.at(1, creature.colors[1])
  })

  const nodes = orderBy(creature.children, c => wrapRadians(c.angle))
  const points = nodes.map(({ length, angle }) =>
    new Vector(0, length * 100).rotate(angle).toArray()
  )
  return draw.polygon(points)
    .fill(gradient)
    .stroke({ width: 2, color: 'black' })
    .move(100, 100)
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

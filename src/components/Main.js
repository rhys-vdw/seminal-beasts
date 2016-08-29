import React, { PureComponent } from 'react'
import generateCreature from '../Generation'
import Creature from './Creature'
import Random from 'random-js'

const mt = Random.engines.mt19937().autoSeed()

const nextSeed = Random.integer(0, Math.pow(2, 31) - 1)

export default class Main extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { creature: generateCreature() }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const seed = nextSeed(mt)
    this.setState({ creature: generateCreature(seed) })
  }

  render() {
    const { creature } = this.state

    return (
      <div className='Main'
        onClick={this.handleClick}
      >
        <Creature creature={creature} width={1024} height={768}/>
      </div>
    );
  }
}

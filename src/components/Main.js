import React, { PureComponent } from 'react'
import generateCreature from '../Generation'
import Creature from './Creature'
import random from '../random'

const nextSeed = () => random.integer(0, Math.pow(2, 31))
const getHash = () => window.location.hash.substr(1)

export default class Main extends PureComponent {
  constructor(props) {
    super(props)
    const hash = getHash()
    const seed = hash.length === 0 ? nextSeed() : parseInt(hash)
    this.state = { creature: generateCreature(seed), seed }
    this.handleClick = this.handleClick.bind(this)
    this.handleHashChange = this.handleHashChange.bind(this)
  }

  componentDidMount() {
    window.onhashchange = this.handleHashChange
  }

  componentWillUnmount() {
    window.onhashchange = null
  }

  handleHashChange() {
    this.setSeed(getHash())
  }

  setSeed(seed) {
    window.location.hash = seed
    this.setState({
      creature: generateCreature(seed), seed
    })
  }

  handleClick() {
    this.setSeed(nextSeed())
  }

  render() {
    const { creature, seed } = this.state

    return (
      <div className='Main'>
        <a
          className='Main-saveLink'
          href={`#${seed}`}
          style={{ color: creature.color }}
        >
          link to this creature
        </a>
        <div onClick={this.handleClick} >
          <Creature creature={creature} width={640} height={640}/>
        </div>
      </div>
    );
  }
}

import React, { PureComponent } from 'react'
import Creature from './Creature'
import ChildCreature from './ChildCreature'
import random from '../random'
import Color from 'tinycolor2'
import { map, parseInt, startCase } from 'lodash'

import { createGenome } from '../genome/GeneFactory'
import { fromGenome } from '../genome/NodeFactory'
import Crossover from '../genome/Crossover'
import querystring from 'querystring'

const nextSeed = () => random.integer(0, Math.pow(2, 31))

const getOptions = () => {
  const hash = window.location.hash.substr(1)
  const [route, query] = hash.split('?')
  const parsed = querystring.parse(query)
  return {
    leftSeed: parseInt(parsed.leftSeed),
    rightSeed: parseInt(parsed.rightSeed),
    crossoverSeed: parseInt(parsed.crossoverSeed),
    crossoverFunction: parsed.crossoverFunction
  }
}

export default class Main extends PureComponent {
  constructor(props) {
    super(props)
    const options = getOptions()
    this.state = {
      leftSeed: options.leftSeed || nextSeed(),
      rightSeed: options.rightSeed || nextSeed(),
      crossoverSeed: options.crossoverSeed || nextSeed(),
      hasBeenShared: false,
      crossoverFunction: options.crossoverFunction || 'interleaveGenes',
    }
    this.handleCrossoverChange = this.handleCrossoverChange.bind(this)
    this.handleChildClick = this.handleChildClick.bind(this)
    this.handleRightParentClick = this.handleRightParentClick.bind(this)
    this.handleLeftParentClick = this.handleLeftParentClick.bind(this)
    this.handleHashChange = this.handleHashChange.bind(this)
    this.updateLocation()
  }

  componentDidMount() {
    window.onhashchange = this.handleHashChange
  }

  componentWillUnmount() {
    window.onhashchange = null
  }

  updateLocation() {
    window.onhashchange = null
    const {
      leftSeed, rightSeed, crossoverSeed, crossoverFunction
    } = this.state
    document.location.hash = '?' + querystring.stringify({
      leftSeed, rightSeed, crossoverSeed, crossoverFunction
    })
    window.onhashchange = this.handleHashChange
  }

  componentDidUpdate() {
    this.updateLocation()
  }

  handleCrossoverChange(event) {
    this.setState({ crossoverFunction: event.target.value })
  }

  handleHashChange() {
    this.setState(getOptions())
  }

  handleLeftParentClick() {
    this.setState({ leftSeed: nextSeed() })
  }

  handleRightParentClick() {
    this.setState({ rightSeed: nextSeed() })
  }

  handleChildClick() {
    this.setState({ crossoverSeed: nextSeed() })
  }

  render() {
    const {
      crossoverSeed, leftSeed, rightSeed, crossoverFunction
    } = this.state
    const leftGenome = createGenome(leftSeed)
    const rightGenome = createGenome(rightSeed)
    return (
      <div className='Main'>
        <div className='Main-options'>
          { map(Crossover, (fn, name) =>
            <span key={name} className='Main-crossoverOption'>
              <input
                id={name}
                name='crossover'
                type='radio'
                value={name}
                onChange={this.handleCrossoverChange}
                checked={name === this.state.crossoverFunction}
              />
              <label htmlFor={name}>{startCase(name)}</label>
            </span>
          ) }
        </div>
        <div className='Main-creatures'>
          <div className='Main-parents'>
            <div
              className='Main-parentContainer'
              onClick={this.handleLeftParentClick}
            >
              <label className='Main-creatureName'>Parent A</label>
              <Creature creature={fromGenome(leftGenome)} width='100%' height='100%'/>
            </div>
            <div
              className='Main-parentContainer'
              onClick={this.handleRightParentClick}
            >
              <label className='Main-creatureName'>Parent B</label>
              <Creature creature={fromGenome(rightGenome)} width='100%' height='100%'/>
            </div>
          </div>
          <div className='Main-child'>
            <div
              className='Main-childContainer'
              onClick={this.handleChildClick}
            >
              <label className='Main-creatureName'>Child of A and B</label>
              <ChildCreature
                crossoverFunction={Crossover[crossoverFunction]}
                seed={crossoverSeed}
                leftGenome={leftGenome}
                rightGenome={rightGenome}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

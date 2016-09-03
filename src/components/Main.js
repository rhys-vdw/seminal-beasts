import React, { PureComponent } from 'react'
//import generateCreature from '../Generation'
import Creature from './Creature'
import random from '../random'
import CopyToClipboard from 'react-copy-to-clipboard'
import Color from 'tinycolor2'


import { createGenome } from '../genome/GeneFactory'
import { fromGenome } from '../genome/NodeFactory'

function generateCreature(seed) {
  const genome = createGenome(seed)
  return fromGenome(genome)
}

const nextSeed = () => random.integer(0, Math.pow(2, 31))
const getHash = () => parseInt(window.location.hash.substr(1))

function maxLightness(color, max) {
  const hsv = color.toHsv()
  hsv.v = Math.min(hsv.v, max)
  return Color(hsv)
}

function setTitle(creature) {
  const isBright = creature.root.color.getBrightness() > 128
  document.title = isBright ? '☺' : '☻'
}

function updateWindow(seed, creature) {
  window.location.hash = seed
  setTitle(creature)
}

export default class Main extends PureComponent {
  constructor(props) {
    super(props)
    const hash = getHash()
    const seed = hash.length === 0 ? nextSeed() : parseInt(hash)
    const creature = generateCreature(seed)
    updateWindow(seed, creature)
    this.state = { creature, seed, hasBeenShared: false }
    this.handleClick = this.handleClick.bind(this)
    this.handleHashChange = this.handleHashChange.bind(this)
    this.handleCopy = this.handleCopy.bind(this)
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
    this.setState(prevState => {
      if (seed !== prevState.seed) {
        const creature = generateCreature(seed)
        updateWindow(seed, creature)
        return {
          creature, seed, hasBeenShared: false
        }
      }
    })
  }

  handleClick() {
    this.setSeed(nextSeed())
  }

  handleCopy() {
    this.setState({ hasBeenShared: true })
  }

  render() {
    const { hasBeenShared, creature, seed } = this.state
    const linkColor = maxLightness(creature.root.color, 0.9)
    return (
      <div className='Main'>
        <CopyToClipboard
          text={window.location.toString()}
          onCopy={this.handleCopy}
        >
          <a
            className='Main-saveLink'
            href={`#${seed}`}
            style={{ color: linkColor.toRgbString() }}
          >
            { hasBeenShared
                ? <span className='Main-copied'>♡ copied to clipboard ♡</span>
                : <span className='Main-share'>share</span> }
          </a>
        </CopyToClipboard>
        <div
          className='Main-creatureContainer'
          onClick={this.handleClick}
        >
          <Creature creature={creature} width='100%' height='100%'/>
        </div>
      </div>
    );
  }
}

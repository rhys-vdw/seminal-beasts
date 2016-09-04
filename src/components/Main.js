import React, { PureComponent } from 'react'
//import generateCreature from '../Generation'
import Creature from './Creature'
import random from '../random'
import CopyToClipboard from 'react-copy-to-clipboard'
import Color from 'tinycolor2'

import { createGenome } from '../genome/GeneFactory'
import { fromGenome } from '../genome/NodeFactory'
import { mergeWith, isNumber, zipWith } from 'lodash'
import { lerp } from '../Math'

const INTERLEAVE_NODES = 'INTERLEAVE_NODES'
const INTERLEAVE_GENES = 'INTERLEAVE_GENES'
const SPLICE = 'SPLICE'
const AVERAGE = 'AVERAGE'
const RANDOM_LERP = 'RANDOM_LERP'

function interleaveGenomesNodes(left, right) {
  return zipWith(left, right, (l, r) => random.bool() ? l : r)
}

function spliceGenomes(left, right) {
  const index = random.integer(0, left.length)
  return random.bool()
    ? left.slice(0, index).concat(right.slice(index))
    : right.slice(0, index).concat(left.slice(index))
}

function interleaveGenomesGenes(left, right) {
  return mergeWith([], left, right, (lValue, rValue) => {
    if (isNumber(rValue)) {
      return random.bool() ? lValue : rValue
    }
  })
}

function randomLerpGenomes(left, right) {
  return mergeWith([], left, right, (lValue, rValue) => {
    if (isNumber(rValue)) {
      return lerp(lValue, rValue, random.real(0, 1, true))
    }
  })
}

function averageGenomes(left, right) {
  return mergeWith([], left, right, (lValue, rValue) => {
    if (isNumber(rValue)) {
      return (rValue + lValue) / 2
    }
  })
}

function getCrossover(method) {
  switch (method) {
    case INTERLEAVE_NODES: return interleaveGenomesNodes
    case INTERLEAVE_GENES: return interleaveGenomesGenes
    case SPLICE: return spliceGenomes
    case AVERAGE: return averageGenomes
    case RANDOM_LERP: return randomLerpGenomes
  }

  throw new TypeError('Bad method: ' + method)
}

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

function initialGenomes() {
  const leftSeed = nextSeed()
  const rightSeed = nextSeed()
  const leftGenome = createGenome(leftSeed)
  const rightGenome = createGenome(rightSeed)
  const childGenome = interleaveGenomesNodes(leftGenome, rightGenome)
  return { leftGenome, rightGenome, childGenome }
  //console.log({ leftGenome, rightGenome, childGenome })
  /*
  return {
    leftCreature: fromGenome(leftGenome),
    rightCreature: fromGenome(rightGenome),
    childCreature: fromGenome(childGenome),
  }
  */
}

export default class Main extends PureComponent {
  constructor(props) {
    super(props)
    //const hash = getHash()
    //const seed = isNaN(hash) ? nextSeed() : parseInt(hash)
    //updateWindow(seed, creature)
    this.state = {
      ...initialGenomes(),
      hasBeenShared: false,
      crossover: interleaveGenomesNodes
    }
    this.handleCrossoverChange = this.handleCrossoverChange.bind(this)
    this.handleChildClick = this.handleChildClick.bind(this)
    this.handleRightParentClick = this.handleRightParentClick.bind(this)
    this.handleLeftParentClick = this.handleLeftParentClick.bind(this)
    this.handleHashChange = this.handleHashChange.bind(this)
    this.handleCopy = this.handleCopy.bind(this)
  }

  componentDidMount() {
    window.onhashchange = this.handleHashChange
  }

  componentWillUnmount() {
    window.onhashchange = null
  }

  handleCrossoverChange(event) {
    this.setState({ crossover: getCrossover(event.target.value) })
    this.generateChildGenome()
  }

  handleHashChange() {
    this.setSeed(getHash())
  }

  generateChildGenome() {
    this.setState(prevState => {
      const childGenome = prevState.crossover(prevState.leftGenome, prevState.rightGenome)
      return { childGenome }
    })
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

  handleLeftParentClick() {
    this.setState({ leftGenome: createGenome(nextSeed()) })
    this.generateChildGenome()
  }

  handleRightParentClick() {
    this.setState({ rightGenome: createGenome(nextSeed()) })
    this.generateChildGenome()
  }

  handleChildClick() {
    this.generateChildGenome()
  }

  handleCopy() {
    this.setState({ hasBeenShared: true })
  }

  render() {
    const {
      hasBeenShared, childCreature, leftGenome, rightGenome, childGenome
    } = this.state
    //const linkColor = maxLightness(creature.root.color, 0.9)
    return (
      <div className='Main'>
        {/*
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
        */}
        <div className='Main-options'>
          <input id='interleaveNodes' name='crossover' type='radio' value={INTERLEAVE_NODES} defaultChecked onChange={this.handleCrossoverChange} />
          <label htmlFor='interleaveNodes'>Interleave nodes</label>
          <input id='interleaveGenes' name='crossover' type='radio' value={INTERLEAVE_GENES} onChange={this.handleCrossoverChange} />
          <label htmlFor='interleaveGenes'>Interleave genes</label>
          <input id='splice' name='crossover' type='radio' value={SPLICE} onChange={this.handleCrossoverChange} />
          <label htmlFor='splice'>Splice</label>
          <input id='average' name='crossover' type='radio' value={AVERAGE} onChange={this.handleCrossoverChange} />
          <label htmlFor='average'>Average</label>
          <input id='randomLerp' name='crossover' type='radio' value={RANDOM_LERP} onChange={this.handleCrossoverChange} />
          <label htmlFor='randomLerp'>Random lerp</label>
        </div>
        <div className='Main-creatures'>
          <div className='Main-parents'>
            <div
              className='Main-parentContainer'
              onClick={this.handleLeftParentClick}
            >
              <label>Parent A</label>
              <Creature creature={fromGenome(leftGenome)} width='100%' height='100%'/>
            </div>
            <div
              className='Main-parentContainer'
              onClick={this.handleRightParentClick}
            >
              <label>Parent B</label>
              <Creature creature={fromGenome(rightGenome)} width='100%' height='100%'/>
            </div>
          </div>
          <div className='Main-child'>
            <div
              className='Main-childContainer'
              onClick={this.handleChildClick}
            >
              <label>Child of A and B</label>
              <Creature creature={fromGenome(childGenome)} width='100%' height='100%'/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

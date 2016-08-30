import React, { PureComponent } from 'react'
import generateCreature from '../Generation'
import Creature from './Creature'
import random from '../random'
import CopyToClipboard from 'react-copy-to-clipboard'
import Color from 'tinycolor2'

const nextSeed = () => random.integer(0, Math.pow(2, 31))
const getHash = () => window.location.hash.substr(1)

function maxLuminence(color, max) {
  const hsv = color.toHsv()
  hsv.v = Math.min(hsv.v, max)
  return Color(hsv)
}

export default class Main extends PureComponent {
  constructor(props) {
    super(props)
    const hash = getHash()
    const seed = hash.length === 0 ? nextSeed() : parseInt(hash)
    this.state = {
      creature: generateCreature(seed),
      seed,
      isCopied: false
    }
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
    window.location.hash = seed
    this.setState({
      creature: generateCreature(seed), seed, isCopied: false
    })
  }

  handleClick() {
    this.setSeed(nextSeed())
  }

  handleCopy() {
    this.setState({ isCopied: true })
  }

  render() {
    const { isCopied, creature, seed } = this.state
    const linkColor = maxLuminence(creature.color, 0.9)
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
            { isCopied
                ? <span>&#x2661; copied to clipboard &#x2661;</span>
                : 'share' }
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

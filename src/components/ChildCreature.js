import React, { PropTypes } from 'react'
import Creature from './Creature'
import Random from 'random-js'
import { fromGenome } from '../genome/NodeFactory'

export default function ChildCreature({
  seed,
  leftGenome,
  rightGenome,
  crossoverFunction,
  ...rest
}) {
  const mt = Random.engines.mt19937().seed(seed)
  const childGenome = crossoverFunction(mt, leftGenome, rightGenome)

  return <Creature creature={fromGenome(childGenome)} {...rest} />
}

ChildCreature.propTypes = {
  seed: PropTypes.number.isRequired,
  leftGenome: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  rightGenome: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  crossoverFunction: PropTypes.func.isRequired,
}

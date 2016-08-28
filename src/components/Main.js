import React, { PureComponent } from 'react';
import generateCreature from '../Generation';
import Creature from './Creature';

export default class Main extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { creature: generateCreature() }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({ creature: generateCreature() })
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

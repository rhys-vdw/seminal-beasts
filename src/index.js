import React from 'react';
import ReactDOM from 'react-dom';
import generateCreature from './Generation';
import Main from './components/Main';

const creature = generateCreature();
ReactDOM.render(
  <Main creature={creature} />,
  document.getElementById('main'),
);

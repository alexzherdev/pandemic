import React from 'react';

import Map from '../containers/Map';
import Hand from '../containers/Hand';
import Events from '../containers/Events';
import Actions from '../containers/Actions';


const Game = () =>
  <div className="game">
    <Actions />
    <Hand />
    <Events />
    <Map />
  </div>;

export default Game;

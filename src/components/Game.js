import React from 'react';

import Map from '../containers/Map';
import Hand from '../containers/Hand';
import Actions from '../containers/Actions';


const Game = () =>
  <div className="game">
    <Actions />
    <Hand />
    <Map />
  </div>;

export default Game;

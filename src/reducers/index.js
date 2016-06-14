import { combineReducers } from 'redux';

import map from './mapReducer';
import players from './playersReducer';
import currentMove from './currentMoveReducer';
import stationsLeft from './stationsLeftReducer';
import cubesLeft from './cubesLeftReducer';
import infectionRate from './infectionRateReducer';
import outbreaks from './outbreaksReducer';
import diseases from './diseasesReducer';
import status from './statusReducer';
import playerCards from './playerCardsReducer';
import infectionCards from './infectionCardsReducer';


export default combineReducers({
  status,
  playerCards,
  infectionCards,
  map,
  players,
  diseases,
  outbreaks,
  currentMove,
  stationsLeft,
  cubesLeft,
  infectionRate
});

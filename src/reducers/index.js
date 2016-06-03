import { combineReducers } from 'redux';

import map from './mapReducer';
import players from './playersReducer';
import currentMove from './currentMoveReducer';
import stationsLeft from './stationsLeftReducer';
import initialState from './initialState';

export default combineReducers({
  map,
  players,
  currentMove,
  cities: () => initialState.cities,
  stationsLeft
});

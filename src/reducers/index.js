import { combineReducers } from 'redux';

import map from './mapReducer';
import players from './playersReducer';
import currentMove from './currentMoveReducer';
import stationsLeft from './stationsLeftReducer';
import diseases from './diseasesReducer';
import status from './statusReducer';
import initialState from './initialState';

export default combineReducers({
  status,
  map,
  players,
  diseases,
  currentMove,
  cities: () => initialState.cities,
  stationsLeft
});

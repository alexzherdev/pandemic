import { combineReducers } from 'redux';

import map from './mapReducer';
import players from './playersReducer';
import initialState from './initialState';

export default combineReducers({
  map,
  players,
  cities: state => initialState.cities
});

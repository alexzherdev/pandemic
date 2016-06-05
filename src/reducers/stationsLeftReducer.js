import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function stationsLeftReducer(state = initialState.stationsLeft, action) {
  switch (action.type) {
    case types.PLAYER_BUILD_STATION:
      return state - 1;
    default:
      return state;
  }
}

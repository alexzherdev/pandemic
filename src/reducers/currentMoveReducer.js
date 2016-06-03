import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function currentMoveReducer(state = initialState.currentMove, action) {
  switch (action.type) {
    case types.PLAYER_MOVE_SHOW_CITIES:
      return {
        ...state,
        availableCities: action.cities
      };
    case types.PLAYER_MOVE_TO_CITY:
    case types.PLAYER_MOVE_CANCEL:
      return {
        ...state,
        availableCities: []
      };
    default:
      return state;
  }
}

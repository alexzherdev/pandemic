import initialState from './initialState';
import * as actionTypes from '../constants/actionTypes';


export default function currentMoveReducer(state = initialState.currentMove, action) {
  switch (action.type) {
    case actionTypes.PLAYER_MOVE_SHOW_CITIES:
      return {
        ...state,
        availableCities: action.cities
      };
    case actionTypes.PLAYER_MOVE_TO_CITY:
      return {
        ...state,
        availableCities: []
      };
    default:
      return state;
  }
}

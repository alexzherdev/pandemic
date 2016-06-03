import initialState from './initialState';
import * as types from '../constants/actionTypes';


function actionsLeft(state = 0, action) {
  if (types.ACTIONS.includes(action.type)) {
    return state - 1;
  } else {
    return state;
  }
}

function availableCities(state = [], action) {
  switch (action.type) {
    case types.PLAYER_MOVE_SHOW_CITIES:
      return action.cities;
    case types.PLAYER_MOVE_TO_CITY:
    case types.PLAYER_MOVE_CANCEL:
      return [];
    default:
      return state;
  }
}

export default function currentMoveReducer(state = initialState.currentMove, action) {
  return {
    ...state,
    availableCities: availableCities(state.availableCities, action),
    actionsLeft: actionsLeft(state.actionsLeft, action)
  };
}

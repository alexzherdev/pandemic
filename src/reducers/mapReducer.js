import initialState from './initialState';
import * as types from '../constants/actionTypes';

function locationsReducer(state = [], action) {
  switch (action.type) {
    case types.PLAYER_BUILD_STATION:
      return {
        ...state,
        [action.cityId]: {
          ...state[action.cityId],
          station: true
        }
      };
    case types.PLAYER_TREAT_DISEASE:
      return {
        ...state,
        [action.cityId]: {
          ...state[action.cityId],
          [action.color]: state[action.cityId][action.color] - 1
        }
      };
    default:
      return state;
  }
}

export default function mapReducer(state = initialState.map, action) {
  switch (action.type) {
    case types.PLAYER_MOVE_TO_CITY:
      return {
        ...state,
        playersLocations: {
          ...state.players,
          [action.playerId]: action.destinationId
        }
      };
    case types.PLAYER_BUILD_STATION:
    case types.PLAYER_TREAT_DISEASE:
      return {
        ...state,
        locations: locationsReducer(state.locations, action)
      };
    default:
      return state;
  }
}

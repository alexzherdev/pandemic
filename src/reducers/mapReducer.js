import initialState from './initialState';
import * as types from '../constants/actionTypes';


function cityReducer(state = {}, action) {
  switch (action.type) {
    case types.PLAYER_BUILD_STATION:
      return {
        ...state,
        station: true
      };
    case types.PLAYER_TREAT_DISEASE:
      return {
        ...state,
        [action.color]: state[action.color] - 1
      };
    case types.INFECT_CITY:
      return {
        ...state,
        [action.color]: Math.min(3, state[action.color] + action.count)
      };
    case types.INFECT_NEIGHBOR:
      return {
        ...state,
        [action.color]: Math.min(3, state[action.color] + 1)
      };
    default:
      return state;
  }
}

function locationsReducer(state = [], action) {
  switch (action.type) {
    case types.PLAYER_BUILD_STATION:
    case types.PLAYER_TREAT_DISEASE:
    case types.INFECT_CITY:
    case types.INFECT_NEIGHBOR:
      return {
        ...state,
        [action.cityId]: cityReducer(state[action.cityId], action)
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
    case types.INFECT_CITY:
    case types.INFECT_NEIGHBOR:
      return {
        ...state,
        locations: locationsReducer(state.locations, action)
      };
    default:
      return state;
  }
}

import initialState from './initialState';
import * as types from '../constants/actionTypes';

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
      return {
        ...state,
        locations: {
          ...state.locations,
          [action.cityId]: {
            ...state.locations[action.cityId],
            station: true
          }
        }
      };
    default:
      return state;
  }
}

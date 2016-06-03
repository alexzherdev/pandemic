import initialState from './initialState';
import * as actionTypes from '../constants/actionTypes';

export default function mapReducer(state = initialState.map, action) {
  switch (action.type) {
    case actionTypes.PLAYER_DRIVE_REQUEST:
      return {
        ...state,
        players: {
          ...state.players,
          [action.playerId]: action.location
        }
      };
    default:
      return state;
  }
}

import initialState from './initialState';
import * as types from '../constants/actionTypes';

export default function playersReducer(state = initialState.players, action) {
  switch (action.type) {
    case types.CARD_DISCARD_FROM_HAND: {
      const playerId = action.playerId;
      const hand = state[playerId].hand.filter((c) => !(c.cardType === action.cardType && c.id === action.id));
      return {
        ...state,
        [playerId]: {
          ...state[playerId],
          hand
        }
      };
    }
    default:
      return state;
  }
}

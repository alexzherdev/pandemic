import initialState from './initialState';
import * as types from '../constants/actionTypes';

function handReducer(state = [], action) {
  switch (action.type) {
    case types.CARD_DISCARD_FROM_HAND:
      return state.filter((c) => !(c.cardType === action.cardType && c.id === action.id));
    case types.CARD_DRAW_CARDS_HANDLE:
      return action.card.cardType !== 'epidemic' ? [...state, action.card] : state;
    default:
      return state;
  }
}

export default function playersReducer(state = initialState.players, action) {
  switch (action.type) {
    case types.CARD_DISCARD_FROM_HAND:
    case types.CARD_DRAW_CARDS_HANDLE: {
      const playerId = action.playerId;
      const hand = handReducer(state[playerId].hand, action);
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

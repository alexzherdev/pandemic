import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function playerCardsReducer(state = initialState.playerCards, action) {
  switch (action.type) {
    case types.CARD_DRAW_CARDS_INIT:
      return {
        ...state,
        deck: state.deck.slice(2)
      };
    case types.CARD_ADD_TO_PLAYER_DISCARD:
      return {
        ...state,
        discard: [{ cardType: action.cardType, id: action.id }, ...state.discard]
      };
    default:
      return state;
  }
}

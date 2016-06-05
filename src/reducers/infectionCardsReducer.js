import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function infectionCardsReducer(state = initialState.infectionCards, action) {
  switch (action.type) {
    case types.CARD_DISCARD_FROM_INFECTION_DECK_BOTTOM: {
      const card = state.deck[0];
      return {
        ...state,
        deck: state.deck.slice(1),
        discard: [card, ...state.discard]
      };
    }
    default:
      return state;
  }
}

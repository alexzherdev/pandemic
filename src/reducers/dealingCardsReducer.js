import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function dealingCardsReducer(state = initialState.dealingCards, action) {
  switch (action.type) {
    case types.DEAL_CARDS_INIT:
      return {
        dealing: 'player'
      };
    case types.DEAL_CARDS:
      return {
        ...state,
        playerIndex: action.playerIndex,
        cards: action.cards
      };
    case types.INSERT_EPIDEMIC_CARDS_INIT:
      return {
        dealing: 'epidemic'
      };
    case types.ANIMATION_INSERT_EPIDEMIC_CARDS_COMPLETE:
      return {};
    default:
      return state;
  }
}

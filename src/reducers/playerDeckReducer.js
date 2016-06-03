import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function playerDeckReducer(state = initialState.playerDeck, action) {
  switch (action.type) {
    case types.CARD_DRAW_CARDS_INIT:
      return state.slice(2);
    default:
      return state;
  }
}

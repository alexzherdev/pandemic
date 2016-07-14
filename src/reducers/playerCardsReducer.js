import { find } from 'lodash';

import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function playerCardsReducer(state = initialState.playerCards, action) {
  switch (action.type) {
    case types.DEAL_CARDS:
      return {
        ...state,
        deck: state.deck.filter((c) => {
          return !find(action.cards, { cardType: c.cardType, id: c.id });
        })
      };
    case types.INSERT_PLAYER_CARD:
      return {
        ...state,
        deck: [
          ...state.deck.slice(0, action.index),
          action.card,
          ...state.deck.slice(action.index)
        ]
      };
    case types.CARD_DRAW_CARDS_INIT:
      return {
        ...state,
        deck: state.deck.slice(2)
      };
    case types.CARD_DISCARD_FROM_HAND:
      return {
        ...state,
        discard: [{ cardType: action.cardType, id: action.id }, ...state.discard]
      };
    case types.PLAYER_PLAY_EVENT_COMPLETE:
      if (action.needToDiscard) {
        return {
          ...state,
          discard: [{ cardType: 'event', id: action.id }, ...state.discard]
        };
      } else {
        return state;
      }
    case types.CONT_PLANNER_CHOOSE_EVENT:
      return {
        ...state,
        discard: state.discard.filter((c) => !(c.cardType == 'event' && c.id === action.eventId))
      };
    default:
      return state;
  }
}

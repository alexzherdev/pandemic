import { find } from 'lodash';

import initialState from './initialState';
import * as types from '../constants/actionTypes';

function hand(state = [], action) {
  switch (action.type) {
    case types.DEAL_CARDS:
      return action.cards;
    case types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE:
      return state.filter((c) => !(c.cardType === action.cardType && c.id === action.id));
    case types.PLAYER_PLAY_EVENT_COMPLETE:
      return state.filter((c) => !(c.cardType === 'event' && c.id === action.id));
    case types.CARD_DRAW_CARDS_HANDLE:
      return action.card.cardType !== 'epidemic' ? [...state, action.card] : state;
    case types.PLAYER_SHARE_CARD:
      return find(state, { cardType: 'city', id: action.cityId })
        ? state.filter((c) => !(c.cardType === 'city' && c.id === action.cityId))
        : [...state, { cardType: 'city', id: action.cityId }];
    default:
      return state;
  }
}

export default function playersReducer(state = initialState.players, action) {
  switch (action.type) {
    case types.DEAL_CARDS:
    case types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE:
    case types.CARD_DRAW_CARDS_HANDLE:
    case types.PLAYER_PLAY_EVENT_COMPLETE: {
      const { playerId } = action;
      const newHand = hand(state[playerId].hand, action);
      return {
        ...state,
        [playerId]: {
          ...state[playerId],
          hand: newHand
        }
      };
    }
    case types.PLAYER_SHARE_CARD: {
      const { giverId, receiverId } = action;
      return {
        ...state,
        [giverId]: {
          ...state[giverId],
          hand: hand(state[giverId].hand, action)
        },
        [receiverId]: {
          ...state[receiverId],
          hand: hand(state[receiverId].hand, action)
        }
      };
    }
    case types.CONT_PLANNER_CHOOSE_EVENT: {
      const { playerId, eventId } = action;
      return {
        ...state,
        [playerId]: {
          ...state[playerId],
          specialEvent: eventId
        }
      };
    }
    case types.CONT_PLANNER_EVENT_COMPLETE: {
      const { playerId } = action;
      return {
        ...state,
        [playerId]: {
          ...state[playerId],
          specialEvent: null
        }
      };
    }
    default:
      return state;
  }
}

import * as types from '../constants/actionTypes';

export function discardFromHand(type, id, playerId) {
  return { type: types.CARD_DISCARD_FROM_HAND, cardType: type, id, playerId };
}

export function drawCards() {
  return { type: types.CARD_DRAW_CARDS };
}

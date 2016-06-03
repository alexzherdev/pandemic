import * as types from '../constants/actionTypes';

export function discardFromHand(type, id, playerId) {
  return { type: types.CARD_DISCARD_FROM_HAND, cardType: type, id, playerId };
}

export function drawCardsInit(cards) {
  return { type: types.CARD_DRAW_CARDS_INIT, cards };
}

export function drawCardsHandle(card, playerId) {
  return { type: types.CARD_DRAW_CARDS_HANDLE, card, playerId };
}

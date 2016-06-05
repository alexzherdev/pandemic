import * as types from '../constants/actionTypes';

export function discardFromHand(cardType, playerId, id) {
  return { type: types.CARD_DISCARD_FROM_HAND, cardType, id, playerId };
}

export function addToPlayerDiscard(cardType, id) {
  return { type: types.CARD_ADD_TO_PLAYER_DISCARD, cardType, id };
}

export function drawCardsInit(cards) {
  return { type: types.CARD_DRAW_CARDS_INIT, cards };
}

export function drawCardsHandle(card, playerId) {
  return { type: types.CARD_DRAW_CARDS_HANDLE, card, playerId };
}

export function discardBottomInfectionCard() {
  return { type: types.CARD_DISCARD_FROM_INFECTION_DECK_BOTTOM };
}

export function epidemicIncrease() {
  return { type: types.EPIDEMIC_INCREASE };
}

export function epidemicInfect(cityId) {
  return { type: types.EPIDEMIC_INFECT, cityId };
}

export function epidemicIntensify() {
  return { type: types.EPIDEMIC_INTENSIFY };
}

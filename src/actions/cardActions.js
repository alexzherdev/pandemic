import * as types from '../constants/actionTypes';

export function discardFromHand(cardType, playerId, id) {
  return { type: types.CARD_DISCARD_FROM_HAND, cardType, id, playerId };
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

export function discardTopInfectionCard() {
  return { type: types.CARD_DISCARD_FROM_INFECTION_DECK_TOP };
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

export function chooseCardsToDiscard(playerId) {
  return { type: types.CARD_OVER_LIMIT_DISCARD_INIT, playerId };
}

export function cardOverLimitComplete() {
  return { type: types.CARD_OVER_LIMIT_DISCARD_COMPLETE };
}

export function shareCardsInit() {
  return { type: types.PLAYER_SHARE_INIT };
}

export function shareCardsShowCandidates(players) {
  return { type: types.PLAYER_SHARE_SHOW_CANDIDATES, players };
}

export function shareCard(giverId, receiverId, cityId) {
  return { type: types.PLAYER_SHARE_CARD, giverId, receiverId, cityId };
}

export function shareCardsCancel() {
  return { type: types.PLAYER_SHARE_CANCEL };
}

export function playEventInit(playerId, id) {
  return { type: types.PLAYER_PLAY_EVENT_INIT, playerId, id };
}

export function playEventComplete(playerId, id) {
  return { type: types.PLAYER_PLAY_EVENT_COMPLETE, playerId, id };
}

export function resPopRemoveCard(cityId) {
  return { type: types.EVENT_RES_POP_REMOVE_CARD, cityId };
}

export function resPopSuggest(playerId) {
  return { type: types.EVENT_RES_POP_SUGGEST, playerId };
}

export function forecastShowCards(cards) {
  return { type: types.EVENT_FORECAST_SHOW_CARDS, cards };
}

export function forecastShuffle(cards) {
  return { type: types.EVENT_FORECAST_SHUFFLE, cards };
}

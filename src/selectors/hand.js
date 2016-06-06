import _ from 'lodash';

import { getCurrentPlayer } from './gameplay';
import { getCurrentCityId } from './cities';

export function getCitiesInHand(state, hand) {
  return _.chain(hand)
    .filter({ cardType: 'city' })
    .map((c) => state.cities[c.id])
    .value();
}

export function getCurrentPlayerHand(state) {
  return getPlayerHand(state, getCurrentPlayer(state).id);
}

export function getPlayerHand(state, playerId) {
  return state.players[playerId].hand.map((card) =>
    card.cardType === 'city' ? {...card, name: state.cities[card.id].name } : card);
}

export function isOverHandLimit(state, playerId) {
  return state.players[playerId].hand.length > 7;
}

export function hasCurrentCityInHand(state, playerId = null) {
  const hand = playerId ? getPlayerHand(state, playerId) : getCurrentPlayerHand(state);
  return !!_.find(hand, { cardType: 'city', id: getCurrentCityId(state) });
}

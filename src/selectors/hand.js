import _ from 'lodash';

import { getCurrentPlayer } from './gameplay';


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
  return getPlayerHand(state, playerId).length > 7;
}

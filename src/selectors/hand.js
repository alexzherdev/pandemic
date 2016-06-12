import _ from 'lodash';

import { getCurrentPlayer } from './gameplay';
import { getCurrentCityId, getCityColor } from './cities';


export function getCitiesInPlayersHand(state, playerId) {
  const hand = getPlayerHand(state, playerId);
  return getCitiesInHand(state, hand);
}

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
    ({...card, name: card.cardType === 'city' ? state.cities[card.id].name : state.events[card.id].name }));
}

export function isOverHandLimit(state, playerId) {
  return state.players[playerId].hand.length > 7;
}

export function hasCurrentCityInHand(state, playerId = null) {
  const hand = playerId ? getPlayerHand(state, playerId) : getCurrentPlayerHand(state);
  return !!_.find(hand, { cardType: 'city', id: getCurrentCityId(state) });
}

export function getCardsOfColorInCurrentHand(state, color) {
  const hand = getCurrentPlayerHand(state);
  return hand.filter((c) => c.cardType === 'city' && getCityColor(state, c.id) === color);
}

export function getEventsInHands(state) {
  const events = [];
  _.forOwn(state.players, (player, id) => {

    events.push(..._.filter(player.hand, { cardType: 'event' })
      .map((c) => ({ ...c, name: state.events[c.id].name, playerId: id})));
  });
  return events;
}

export function getResPopOwner(state) {
  let playerId = null;
  _.forOwn(state.players, (player, id) => {
    const hand = getPlayerHand(state, id);
    if (_.find(hand, { cardType: 'event', id: 'res_pop' })) {
      playerId = id;
      return false;
    }
  });
  return playerId;
}

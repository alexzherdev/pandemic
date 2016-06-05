import _ from 'lodash';


export function getCitiesInHand(state, hand) {
  return _.chain(hand)
    .filter({ cardType: 'city' })
    .map((c) => state.cities[c.id])
    .value();
}

export function getPlayerHand(state, playerId) {
  return state.players[playerId].hand.map((card) =>
    card.cardType === 'city' ? {...card, name: state.cities[card.id].name } : card);
}

export function isOverHandLimit(state, playerId) {
  return getPlayerHand(state, playerId).length > 7;
}

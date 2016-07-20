import { partialRight } from 'lodash';

import cities from '../constants/cities';
import events from '../constants/events';
import { getCityColor } from './cities';


export function enhanceCard(card, state) {
  const res = { ...card };
  switch (card.cardType) {
    case 'city':
      res.color = getCityColor(state, card.id);
      res.name = cities[card.id].name;
      break;
    case 'event':
      res.name = events[card.id].name;
      break;
  }

  return res;
}

export function getPlayerCardsToDraw(state) {
  return state.playerCards.deck.slice(0, 2).map(partialRight(enhanceCard, state));
}

export function getInfectionDeckBottom(state) {
  const deck = getInfectionDeck(state);
  return deck[deck.length - 1];
}

export function peekAtInfectionDeck(state) {
  return getInfectionDeck(state)[0];
}

export function getPlayerDeck(state) {
  return state.playerCards.deck;
}

export function getPlayerDiscard(state) {
  return state.playerCards.discard.map(partialRight(enhanceCard, state));
}

export function getPlayerDiscardTop(state) {
  return getPlayerDiscard(state)[0];
}

function getInfectionDeck(state) {
  return state.infectionCards.deck;
}

export function getInfectionDiscard(state) {
  return state.infectionCards.discard.map((id) =>
    ({ id, name: cities[id].name, cardType: 'city', color: getCityColor(state, id) }));
}

export function getCardsForForecast(state) {
  return getInfectionDeck(state).slice(0, 6);
}

export function getCardsForContPlanner(state) {
  return state.playerCards.discard.filter((c) => c.cardType === 'event')
    .map((c) => ({ ...c, name: events[c.id].name }));
}

export function getPlayerDeckCount(state) {
  return state.playerCards.deck.length;
}

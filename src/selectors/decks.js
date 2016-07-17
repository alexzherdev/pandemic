import cities from '../constants/cities';
import events from '../constants/events';
import { getCityColor } from './cities';


export function getPlayerCardsToDraw(state) {
  return state.playerCards.deck.slice(0, 2);
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
  return state.playerCards.discard.map((c) => {
    switch (c.cardType) {
    case 'city':
      return { ...c, color: getCityColor(state, c.id) };
    case 'event':
      return { ...c, name: events[c.id].name };
    default:
      return c;
    }
  });
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

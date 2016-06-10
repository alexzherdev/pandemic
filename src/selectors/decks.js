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

function getInfectionDeck(state) {
  return state.infectionCards.deck;
}

export function getInfectionDiscard(state) {
  return state.infectionCards.discard.map((id) => ({ id, name: state.cities[id].name }));
}

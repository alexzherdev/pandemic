export function getPlayerCardsToDraw(state) {
  return state.playerCards.deck.slice(0, 2);
}

export function getInfectionDeckBottom(state) {
  const deck = state.infectionCards.deck;
  return deck[deck.length - 1];
}

import * as types from '../constants/actionTypes';


export function createQuickGameInit(numberOfPlayers) {
  return { type: types.CREATE_QUICK_GAME_INIT, numberOfPlayers };
}

export function createGame(players, playerDeck, infectionDeck) {
  return { type: types.CREATE_GAME, players, playerDeck, infectionDeck };
}

export function dealCardsInit() {
  return { type: types.DEAL_CARDS_INIT };
}

export function dealCards(playerId, cards) {
  return { type: types.DEAL_CARDS, playerId, cards };
}

export function insertPlayerCard(index, card) {
  return { type: types.INSERT_PLAYER_CARD, index, card };
}

export function startGame() {
  return { type: types.START_GAME };
}

export function victory() {
  return { type: types.VICTORY };
}

export function defeat() {
  return { type: types.DEFEAT };
}

export function continueTurn() {
  return { type: types.CONTINUE };
}

export function passTurn(playerId) {
  return { type: types.PASS_TURN, playerId };
}

export function animationMoveComplete() {
  return { type: types.ANIMATION_MOVE_COMPLETE };
}

export function animationDrawInfectionCardComplete() {
  return { type: types.ANIMATION_DRAW_INFECTION_CARD_COMPLETE };
}

export function animationInfectNeighborComplete(cityId, originId, color) {
  return { type: types.ANIMATION_INFECT_NEIGHBOR_COMPLETE, cityId, originId, color };
}

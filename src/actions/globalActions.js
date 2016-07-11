import * as types from '../constants/actionTypes';

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

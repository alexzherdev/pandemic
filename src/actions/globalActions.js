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

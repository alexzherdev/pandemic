import * as types from '../constants/actionTypes';

export function victory() {
  return { type: types.VICTORY };
}

export function defeat() {
  return { type: types.DEFEAT };
}

export function passTurn() {
  return { type: types.PASS_TURN };
}

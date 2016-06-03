import * as types from '../constants/actionTypes';

export function treatDisease(cityId, color) {
  return { type: types.PLAYER_TREAT_DISEASE, cityId, color };
}

export function cureDisease(color) {
  return { type: types.PLAYER_CURE_DISEASE, color };
}

export function eradicateDisease(color) {
  return { type: types.ERADICATE_DISEASE, color };
}

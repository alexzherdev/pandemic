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

export function initOutbreak(cityId) {
  return { type: types.OUTBREAK_INIT, cityId };
}

export function infectCity(cityId, color, count) {
  return { type: types.INFECT_CITY, cityId, color, count };
}

export function infectNeighbor(cityId, originId, color) {
  return { type: types.INFECT_NEIGHBOR, cityId, originId, color };
}

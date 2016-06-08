import * as types from '../constants/actionTypes';

export function treatDisease(cityId, color) {
  return { type: types.PLAYER_TREAT_DISEASE, cityId, color };
}

export function treatAllDisease(cityId, color) {
  return { type: types.PLAYER_TREAT_ALL_DISEASE, cityId, color };
}

export function cureDiseaseInit(color) {
  return { type: types.PLAYER_CURE_DISEASE_INIT, color };
}

export function cureDiseaseShowCards(cards, color) {
  return { type: types.PLAYER_CURE_DISEASE_SHOW_CARDS, cards, color };
}

export function cureDiseaseComplete(cityIds, color) {
  return { type: types.PLAYER_CURE_DISEASE_COMPLETE, cityIds, color };
}

export function cureDiseaseCancel() {
  return { type: types.PLAYER_CURE_DISEASE_CANCEL };
}

export function eradicateDisease(color) {
  return { type: types.ERADICATE_DISEASE, color };
}

export function initOutbreak(cityId, color) {
  return { type: types.OUTBREAK_INIT, cityId, color };
}

export function infectCity(cityId, color, count) {
  return { type: types.INFECT_CITY, cityId, color, count };
}

export function infectNeighbor(cityId, originId, color) {
  return { type: types.INFECT_NEIGHBOR, cityId, originId, color };
}

export function completeOutbreak(cityId) {
  return { type: types.OUTBREAK_COMPLETE, cityId };
}

export function queueOutbreak(cityId, color) {
  return { type: types.OUTBREAK_QUEUE, cityId, color };
}

export function infectCities() {
  return { type: types.INFECT_CITIES };
}

export function useDiseaseCubes(color, count) {
  return { type: types.USE_DISEASE_CUBES, count, color };
}

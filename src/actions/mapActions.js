import * as types from '../constants/actionTypes';


export function moveInit(playerId) {
  return { type: types.PLAYER_MOVE_INIT, playerId };
}

export function moveShowCities(cities) {
  return { type: types.PLAYER_MOVE_SHOW_CITIES, cities };
}

export function moveToCity(playerId, originId, destinationId, source) {
  return { type: types.PLAYER_MOVE_TO_CITY, playerId, originId, destinationId, source };
}

export function moveCancel() {
  return { type: types.PLAYER_MOVE_CANCEL };
}

export function buildStation(cityId) {
  return { type: types.PLAYER_BUILD_STATION, cityId };
}

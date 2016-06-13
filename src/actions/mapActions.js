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

export function govGrantShowCities(cities) {
  return { type: types.EVENT_GOV_GRANT_SHOW_CITIES, cities };
}

export function govGrantBuildStation(cityId) {
  return { type: types.EVENT_GOV_GRANT_BUILD_STATION, cityId };
}

export function airliftChoosePlayer(playerId) {
  return { type: types.EVENT_AIRLIFT_CHOOSE_PLAYER, playerId };
}

export function airliftShowCities(cities) {
  return { type: types.EVENT_AIRLIFT_SHOW_CITIES, cities };
}

export function airliftMoveToCity(playerId, destinationId) {
  return { type: types.EVENT_AIRLIFT_MOVE_TO_CITY, playerId, destinationId };
}

export function dispatcherChoosePlayer(playerId) {
  return { type: types.DISPATCHER_CHOOSE_PLAYER, playerId };
}

export function dispatcherShowCities(cities) {
  return { type: types.DISPATCHER_SHOW_CITIES, cities };
}

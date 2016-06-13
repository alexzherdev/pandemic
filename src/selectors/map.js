import { getCurrentCityId } from './cities';


export function isAtStation(state) {
  return !!getCurrentMapLocation(state).station;
}

export function isStation(state, cityId) {
  return !!state.map.locations[cityId].station;
}

export function getCurrentMapLocation(state) {
  const cityId = getCurrentCityId(state);
  return state.map.locations[cityId];
}

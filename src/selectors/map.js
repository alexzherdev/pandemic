import { getCurrentCityId } from './cities';


export function isAtStation(state) {
  return !!getCurrentMapLocation(state).station;
}

export function getCurrentMapLocation(state) {
  const cityId = getCurrentCityId(state);
  return state.map.locations[cityId];
}

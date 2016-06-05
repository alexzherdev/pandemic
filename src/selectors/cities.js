import _ from 'lodash';

import { getCitiesInHand } from './hand';
import { isAtStation } from './map';
import { getCurrentPlayer } from './gameplay';


export function getCurrentCityId(state) {
  return state.map.playersLocations[0];
}

export function getAvailableCities(state) {
  const player = getCurrentPlayer(state);
  const cityId = getCurrentCityId(state);

  const direct = reduceWithAttrs(getCitiesInHand(state, player.hand), { source: 'direct' });
  const neighbors = reduceWithAttrs(getNeighborCities(state, cityId), { source: 'drive' });
  const charters = hasCurrentCityInHand(state) ? reduceWithAttrs(state.cities, { source: 'charter' }) : {};
  const stations = isAtStation(state) ? reduceWithAttrs(getStationCities(state), { source: 'shuttle' }) : {};
  const cities = _.assign({}, charters, direct, neighbors, stations);
  delete cities[cityId];
  return cities;
}

export function getCubesInCity(state, cityId, color) {
  return state.map.locations[cityId][color];
}

export function getCityColor(state, cityId) {
  return state.cities[cityId].color;
}

export function getNeighborCities(state, cityId) {
  const cities = [];
  state.map.matrix[cityId].forEach((item, i) => {
    if (item === 1) {
      cities.push(state.cities[i]);
    }
  });
  return cities;
}

export function hasCurrentCityInHand(state) {
  const hand = getCurrentPlayer(state).hand;
  return !!_.find(hand, { cardType: 'city', id: getCurrentCityId(state) });
}

function getStationCities(state) {
  const cityIds = _.chain(state.map.locations).map((loc, id) => {
    if (loc.station) {
      return id;
    }
  }).compact().value();
  return cityIds.map((c) => state.cities[c]);
}

function reduceWithAttrs(array, attrs = {}) {
  return _.reduce(array, (acc, c) => { acc[c.id] = {...c, ...attrs }; return acc; }, {});
}

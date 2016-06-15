import _ from 'lodash';

import { getCitiesInPlayersHand, hasCityInHand } from './hand';
import { isAtStation, isStation, getPlayerCityId } from './map';
import { getCurrentPlayer, getPlayerRole, getCurrentRole, hasOpsUsedMoveAbility } from './gameplay';
import cities from '../constants/cities';


export function getCurrentCityId(state) {
  return getPlayerCityId(state, getCurrentPlayer(state).id);
}

export function getAvailableCities(state, cityId = undefined) {
  const player = getCurrentPlayer(state);
  if (!cityId) {
    cityId = getCurrentCityId(state);
  }

  const direct = reduceWithAttrs(getCitiesInPlayersHand(state, player.id), { source: 'direct' });
  const neighbors = reduceWithAttrs(getNeighborCities(state, cityId), { source: 'drive' });
  const charters = hasCityInHand(state, cityId) ? reduceWithAttrs(cities, { source: 'charter' }) : {};
  const stations = isStation(state, cityId) ? reduceWithAttrs(getStationCities(state), { source: 'shuttle' }) : {};
  const opsCities = isAtStation(state) && getCurrentRole(state) === 'ops_expert' && !hasOpsUsedMoveAbility(state)
    ? reduceWithAttrs(_.values(cities), { source: 'ops' }) : {};
  const result = _.assign({}, opsCities, charters, direct, neighbors, stations);
  delete result[cityId];
  return result;
}

export function isDriveAvailable(state, destinationId) {
  const cityId = getCurrentCityId(state);
  return !!_.find(getNeighborCities(state, cityId), { id: destinationId });
}

export function getMedicInCity(state, cityId) {
  return getRoleInCity(state, cityId, 'medic');
}

export function getMedicInTeam(state) {
  return _.find(state.players, (p) => getPlayerRole(state, p.id) === 'medic');
}

export function getCitiesForGovGrant(state) {
  return _.values(cities).filter((c) => !state.map.locations[c.id].station);
}

export function getCitiesForAirlift(state, playerId) {
  return _.values(cities).filter((c) => c.id !== getPlayerCityId(state, playerId));
}

export function getCitiesForDispatcher(state, playerId) {
  const locs = state.map.playersLocations;
  const otherLocs = _.omit(locs, playerId);
  const otherPlayersCities = reduceWithAttrs(_.values(otherLocs).map((id) => cities[id]), { source: 'dispatcher' });
  return { ...getAvailableCities(state, locs[playerId]), ...otherPlayersCities };
}

export function getCubesInCity(state, cityId, color) {
  return state.map.locations[cityId][color];
}

export function getCityColor(state, cityId) {
  return cities[cityId].color;
}

export function getNeighborCities(state, cityId) {
  const result = [];
  state.map.matrix[cityId].forEach((item, i) => {
    if (item === 1) {
      result.push(cities[i]);
    }
  });
  return result;
}

export function getQuarSpecInProximity(state, cityId) {
  const result = [cities[cityId], ...getNeighborCities(state, cityId)];
  return _.find(result, (c) => getQuarSpecInCity(state, c.id));
}

function getQuarSpecInCity(state, cityId) {
  return getRoleInCity(state, cityId, 'quar_spec');
}

function getRoleInCity(state, cityId, role) {
  return _.findKey(state.map.playersLocations,
    (loc, playerId) => loc === cityId && getPlayerRole(state, playerId) === role);
}

function getStationCities(state) {
  const cityIds = _.chain(state.map.locations).map((loc, id) => {
    if (loc.station) {
      return id;
    }
  }).compact().value();
  return cityIds.map((c) => cities[c]);
}

function reduceWithAttrs(array, attrs = {}) {
  return _.reduce(array, (acc, c) => { acc[c.id] = {...c, ...attrs }; return acc; }, {});
}

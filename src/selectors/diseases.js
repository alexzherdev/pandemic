import _ from 'lodash';

import { isAtStation, getCurrentMapLocation } from './map';
import { getCitiesInPlayersHand } from './hand';
import { getCurrentPlayer, getCurrentRole } from './gameplay';


export function canTreatColor(state, color) {
  if (getCurrentRole(state) === 'medic') {
    return false;
  }
  const loc = getCurrentMapLocation(state);
  return loc[color] > 0;
}

export function canTreatAllOfColor(state, color) {
  return getCurrentRole(state) === 'medic'
    || canTreatColor(state, color) && getDiseaseStatus(state, color) === 'cured';
}

export function getDiseaseStatus(state, color) {
  return state.diseases[color];
}

export function areAllDiseasesCured(state) {
  return _.every(['blue', 'red', 'yellow', 'black'], (c) => getDiseaseStatus(state, c) !== 'active');
}

export function cardsNeededToCure(state) {
  return getCurrentRole(state) === 'scientist' ? 4 : 1;
}

export function canCureDisease(state, color) {
  return cardsNeededToCure(state) <= _.filter(getCitiesInPlayersHand(state, getCurrentPlayer(state).id), { color }).length
    && getDiseaseStatus(state, color) === 'active'
    && isAtStation(state);
}

export function treatedAllOfColor(state, color) {
  return _.chain(state.map.locations).values().every({ [color]: 0 }).value();
}

export function getCuredDiseases(state) {
  return ['blue', 'red', 'yellow', 'black'].filter((c) => getDiseaseStatus(state, c) === 'cured');
}

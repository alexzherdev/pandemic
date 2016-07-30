import _ from 'lodash';

import { isAtStation, getCurrentMapLocation } from './map';
import { getCitiesInPlayersHand } from './hand';
import { getCurrentPlayer, getCurrentRole } from './gameplay';
import DISEASES from '../constants/diseases';


export function canTreatAll(state) {
  return getCurrentRole(state) === 'medic';
}

export function canTreatAllOfColor(state, color) {
  return getDiseaseStatus(state, color) === 'cured';
}

export function getDiseaseStatus(state, color) {
  return state.diseases[color];
}

export function areAllDiseasesCured(state) {
  return _.every(DISEASES, (c) => getDiseaseStatus(state, c) !== 'active');
}

export function cardsNeededToCure(state) {
  return getCurrentRole(state) === 'scientist' ? 4 : 5;
}

export function getCurableDisease(state) {
  return _.find(DISEASES, (c) => canCureDisease(state, c));
}

export function getTreatableDiseases(state) {
  const loc = getCurrentMapLocation(state);
  return DISEASES.reduce((acc, c) => {
    if (loc[c] > 0) {
      acc[c] = loc[c];
    }
    return acc;
  }, {});
}

export function canCureDisease(state, color) {
  return cardsNeededToCure(state) <= _.filter(getCitiesInPlayersHand(state, getCurrentPlayer(state).id), { color }).length
    && getDiseaseStatus(state, color) === 'active'
    && isAtStation(state);
}

export function treatedAllOfColor(state, color) {
  return _.chain(state.map.locations).values().every({ [color]: 0 }).value();
}

export function getCuredDiseaseCubes(state) {
  const loc = getCurrentMapLocation(state);
  return DISEASES.reduce((acc, c) => {
    if (getDiseaseStatus(state, c) === 'cured') {
      acc[c] = loc[c];
    }
    return acc;
  }, {});
}

export function getCureInProgress(state) {
  return state.currentMove.curingDisease.cureInProgress;
}

import _ from 'lodash';

import { isAtStation, getCurrentMapLocation } from './map';
import { getCitiesInHand } from './hand';
import { getCurrentPlayer } from './gameplay';


export function canTreatColor(state, color) {
  const loc = getCurrentMapLocation(state);
  return loc[color] > 0;
}

export function canTreatAllOfColor(state, color) {
  return canTreatColor(state, color) && getDiseaseStatus(state, color) === 'cured';
}

export function getDiseaseStatus(state, color) {
  return state.diseases[color];
}

export function areAllDiseasesCured(state) {
  return _.every(['blue', 'red', 'yellow', 'black'], (c) => getDiseaseStatus(state, c) !== 'active');
}

export function cardsNeededToCure() {
  return 2;
}

export function canCureDisease(state, color) {
  const hand = getCurrentPlayer(state).hand;
  return cardsNeededToCure(state) <= _.filter(getCitiesInHand(state, hand), { color }).length
    && getDiseaseStatus(state, color) === 'active'
    && isAtStation(state);
}

export function treatedAllOfColor(state, color) {
  return _.chain(state.map.locations).values().every({ [color]: 0 }).value();
}

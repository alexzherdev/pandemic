import { isAtStation } from './map';


export function getCurrentPlayer(state) {
  return state.players[0];
}

export function canBuildStation(state) {
  return !isAtStation(state) && state.stationsLeft > 0;
}

export function getActionsLeft(state) {
  return state.currentMove.actionsLeft;
}

export function isInfectionRateOutOfBounds(state) {
  return state.infectionRate.index >= state.infectionRate.values.length;
}

export function getNextOutbreakCityId(state) {
  return state.currentMove.outbreak.pending[0];
}

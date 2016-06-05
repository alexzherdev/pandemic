import { isAtStation } from './map';
import { hasCurrentCityInHand } from './cities';


export function getCurrentPlayer(state) {
  return state.players[state.currentMove.player];
}

export function getNextPlayer(state) {
  return state.currentMove.player === Object.keys(state.players).length - 1 ? 0 : state.currentMove.player + 1;
}

export function canBuildStation(state) {
  return !isAtStation(state) && hasCurrentCityInHand(state);
}

export function getActionsLeft(state) {
  return state.currentMove.actionsLeft;
}

export function isInfectionRateOutOfBounds(state) {
  return state.infectionRate.index >= state.infectionRate.values.length;
}

export function getInfectionRate(state) {
  return state.infectionRate.values[state.infectionRate.index];
}

export function isOutbreaksCountOutOfBounds(state) {
  return state.outbreaks >= 8;
}

export function getNextOutbreakCityId(state) {
  return state.currentMove.outbreak.pending[0];
}

export function isOutOfCubes(state, countNeeded, color) {
  return state.cubesLeft[color] < countNeeded;
}

export function getPlayerOverHandLimit(state) {
  return state.currentMove.playerOverHandLimit;
}

export function isPlaying(state) {
  return state.status === 'playing';
}

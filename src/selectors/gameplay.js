import { chain, values } from 'lodash';

import { isAtStation } from './map';
import { getCurrentCityId } from './cities';
import { hasCurrentCityInHand } from './hand';


export function getCurrentPlayer(state) {
  return state.players[state.currentMove.player];
}

export function getCurrentRole(state) {
  return getCurrentPlayer(state).role;
}

export function getPlayerRole(state, playerId) {
  return state.players[playerId].role;
}

export function getPlayers(state) {
  return values(state.players);
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

export function canShareCards(state) {
  return getShareCandidates(state).length > 0;
}

export function getShareCandidates(state) {
  const currentPlayer = getCurrentPlayer(state);
  const locs = state.map.playersLocations;
  const sameCityPlayers = chain(locs)
    .keys()
    .filter((id) => id !== currentPlayer.id && locs[id] === getCurrentCityId(state))
    .value();
  const receivers = hasCurrentCityInHand(state)
    ? sameCityPlayers.map((id) => ({ ...state.players[id], share: 'receiver' }))
    : [];
  const givers = sameCityPlayers.filter((id) => hasCurrentCityInHand(state, id))
    .map((id) => ({ ...state.players[id], share: 'giver' }));
  return [...receivers, ...givers];
}

export function shouldSkipInfectionsStep(state) {
  return state.currentMove.skipInfectionsStep;
}

import { chain, values, compact } from 'lodash';

import { isAtStation, getPlayerCityId } from './map';
import { getCurrentCityId } from './cities';
import { hasCurrentCityInHand } from './hand';
import events from '../constants/events';


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
  return values(state.players).map((p) => ({ ...p, cityId: getPlayerCityId(state, p.id) }));
}

export function getNextPlayer(state) {
  return state.currentMove.player === (Object.keys(state.players).length - 1) + '' ? '0' : (+state.currentMove.player + 1) + '';
}

export function canBuildStation(state) {
  return !isAtStation(state) && (hasCurrentCityInHand(state)
    || getCurrentRole(state) === 'ops_expert' && !hasOpsUsedMoveAbility(state));
}

export function getActionsLeft(state) {
  return state.currentMove.actionsLeft;
}

export function getInfectionRate(state) {
  return state.infectionRate.values[state.infectionRate.index];
}

export function getInfectionRateValues(state) {
  return state.infectionRate;
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

export function getPlayerToDiscard(state) {
  return state.currentMove.playerToDiscard;
}

export function isPlaying(state) {
  return state.status === 'playing';
}

export function getDifficulty(state) {
  return state.difficulty;
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
  const giver = chain(sameCityPlayers)
    .find((id) => hasCurrentCityInHand(state, id))
    .thru((id) => (id && { ...state.players[id], share: 'giver' }))
    .value();
  return compact([...receivers, giver]);
}

export function shouldSkipInfectionsStep(state) {
  return state.currentMove.skipInfectionsStep;
}

export function hasOpsUsedMoveAbility(state) {
  return state.currentMove.opsMoveAbility.used;
}

export function isContingencyPlanner(state) {
  return getCurrentRole(state) === 'cont_planner';
}

export function isDispatcher(state) {
  return getCurrentRole(state) === 'dispatcher';
}

export function isContingencyPlannerAbilityAvailable(state) {
  return isContingencyPlanner(state) && !getContPlannerEvent(state);
}

export function getContPlannerEvent(state) {
  const id = getCurrentPlayer(state).specialEvent;
  return events[id];
}

export function getCardsDrawn(state) {
  return state.currentMove.cardsDrawn;
}

export function getInfectionCardDrawn(state) {
  return state.currentMove.infectionCardDrawn;
}

export function getEpidemicStep(state) {
  return state.currentMove.epidemicStep;
}

export function isEpidemicInProgress(state) {
  return !!getEpidemicStep(state);
}

export function isDealingPlayerCards(state) {
  return state.dealingCards.dealing === 'player';
}

export function isDealingEpidemicCards(state) {
  return state.dealingCards.dealing === 'epidemic';
}

export function getPlayerDealtToIndex(state) {
  return typeof state.dealingCards.playerIndex === 'undefined'
    ? null
    : state.dealingCards.playerIndex;
}

export function getCardsDealtCount(state) {
  return state.dealingCards.cards && state.dealingCards.cards.length;
}

export function getInitialInfectedCity(state) {
  return state.initialInfectedCity;
}

export function getDiscardingCard(state) {
  return state.currentMove.discardingCard;
}

export function getDefeatMessage(state) {
  return state.defeatMessage;
}

export function getEpidemicInfectionCard(state) {
  return state.currentMove.epidemicInfectionCard;
}

export function getContinueMessage(state) {
  return state.currentMove.continueMessage;
}

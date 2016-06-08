import { takeEvery, delay, END } from 'redux-saga';
import { select, put, take } from 'redux-saga/effects';

import * as types from './constants/actionTypes';
import { moveShowCities } from './actions/mapActions';
import { discardFromHand, drawCardsInit, drawCardsHandle, epidemicIncrease,
  epidemicInfect, epidemicIntensify, discardBottomInfectionCard, discardTopInfectionCard,
  chooseCardsToDiscard, cardOverLimitComplete, shareCardsShowCandidates } from './actions/cardActions';
import { eradicateDisease, infectCity, infectNeighbor, initOutbreak, completeOutbreak,
  queueOutbreak, infectCities, useDiseaseCubes } from './actions/diseaseActions';
import { victory, defeat, passTurn } from './actions/globalActions';
import * as sel from './selectors';


function* showAvailableCities() {
  const cities = yield select(sel.getAvailableCities);
  yield put(moveShowCities(cities));
  const action = yield take([types.PLAYER_MOVE_TO_CITY, types.PLAYER_MOVE_CANCEL]);
  if (action.type === types.PLAYER_MOVE_TO_CITY) {
    const currentPlayer = yield select(sel.getCurrentPlayer);
    switch (action.source) {
      case 'direct':
        yield put(discardFromHand('city', currentPlayer.id, action.destinationId));
        break;
      case 'charter':
        yield put(discardFromHand('city', currentPlayer.id, action.originId));
        break;
    }
  }
}

function* showShareCandidates() {
  const players = yield select(sel.getShareCandidates);
  yield put(shareCardsShowCandidates(players));

  const action = yield take([types.PLAYER_SHARE_CARD, types.PLAYER_SHARE_CANCEL]);
  if (action.type === types.PLAYER_SHARE_CARD) {
    yield waitToDiscardIfOverLimit(action.receiverId);
  }
}

function* checkForEradication({ color }) {
  const treatedAll = yield select(sel.treatedAllOfColor, color);
  const status = yield select(sel.getDiseaseStatus, color);
  if (treatedAll && status === 'cured') {
    yield put(eradicateDisease(color));
  }
}

function* checkForVictory() {
  const allCured = yield select(sel.areAllDiseasesCured);

  if (allCured) {
    yield yieldVictory();
  }
}

function* useCubes(cityId, color, count) {
  const cubesInCity = yield select(sel.getCubesInCity, cityId, color);
  const actualCubesToUse = Math.min(3 - cubesInCity, count);
  if (yield select(sel.isOutOfCubes, actualCubesToUse, color)) {
    yield yieldDefeat();
  } else {
    yield put(useDiseaseCubes(color, actualCubesToUse));
  }
}

function* yieldDefeat() {
  yield put(defeat());
  yield put(END);
}

function* yieldVictory() {
  yield put(victory());
  yield put(END);
}

function* yieldOutbreak(cityId, color) {
  yield put(initOutbreak(cityId, color));
  const neighbors = yield select(sel.getNeighborCities, cityId);

  for (let i = 0; i < neighbors.length; i++) {
    const id = neighbors[i].id;
    const cubesInNeighbor = yield select(sel.getCubesInCity, id, color);
    yield useCubes(id, color, 1);
    yield put(infectNeighbor(id, cityId, color));
    if (cubesInNeighbor === 3) {
      yield put(queueOutbreak(id, color));
    }
  }
  yield put(completeOutbreak(cityId));
  const nextOutbreakCityId = yield select(sel.getNextOutbreakCityId);
  if (nextOutbreakCityId) {
    yield yieldOutbreak(nextOutbreakCityId, color);
  }
}

function* infectOrOutbreak(cityId, color, count) {
  const cubesInCity = yield select(sel.getCubesInCity, cityId, color);
  yield useCubes(cityId, color, count);
  yield put(infectCity(cityId, color, count));
  if (cubesInCity + count > 3) {
    yield yieldOutbreak(cityId, color);
  }
}

function* yieldEpidemic() {
  yield put(epidemicIncrease());
  const infectionCityId = yield select(sel.getInfectionDeckBottom);
  const color = yield select(sel.getCityColor, infectionCityId);
  const status = yield select(sel.getDiseaseStatus, color);
  if (status !== 'eradicated') {
    yield put(epidemicInfect(infectionCityId));
    yield infectOrOutbreak(infectionCityId, color, 3);
    yield put(discardBottomInfectionCard());
  }
  yield put(epidemicIntensify());
}

function* drawPlayerCards() {
  const cards = yield select(sel.getPlayerCardsToDraw);
  if (cards.length < 2) {
    yield yieldDefeat();
  } else {
    const currentPlayer = yield select(sel.getCurrentPlayer);
    yield put(drawCardsInit(cards));
    yield delay(1000);
    yield put(drawCardsHandle(cards[0], currentPlayer.id));
    if (cards[0].cardType === 'epidemic') {
      yield yieldEpidemic();
    }
    yield delay(1000);
    yield put(drawCardsHandle(cards[1], currentPlayer.id));
    if (cards[1].cardType === 'epidemic') {
      yield yieldEpidemic();
    }
  }
}

function* infections() {
  yield put(infectCities());
  const infectionRate = yield select(sel.getInfectionRate);
  for (let i = 0; i < infectionRate; i++) {
    const city = yield select(sel.peekAtInfectionDeck);
    const color = yield select(sel.getCityColor, city);
    const status = yield select(sel.getDiseaseStatus, color);
    if (status !== 'eradicated') {
      yield infectOrOutbreak(city, color, 1);
    }
    yield put(discardTopInfectionCard());
  }
}

function* drawIfNoActionsLeft() {
  function* continueTurn() {
    yield infections();
    const nextPlayer = yield select(sel.getNextPlayer);
    yield put(passTurn(nextPlayer));
  }

  if (!(yield select(sel.isPlaying))) {
    // won
    return;
  }

  const actionsLeft = yield select(sel.getActionsLeft);
  if (actionsLeft === 0) {
    const currentPlayer = yield select(sel.getCurrentPlayer);
    yield drawPlayerCards();
    if (!(yield select(sel.isPlaying))) {
      // lost due to not enough player cards or won
      return;
    }
    yield waitToDiscardIfOverLimit(currentPlayer.id);
    yield continueTurn();
  }
}

function* waitToDiscardIfOverLimit(playerId) {
  if (yield select(sel.isOverHandLimit, playerId)) {
    yield put(chooseCardsToDiscard(playerId));
    yield take(types.CARD_OVER_LIMIT_DISCARD_COMPLETE);
  }
}

function* checkForInfectionRateDefeat() {
  if (yield select(sel.isInfectionRateOutOfBounds)) {
    yield yieldDefeat();
  }
}

function* checkForOutbreaksDefeat() {
  if (yield select(sel.isOutbreaksCountOutOfBounds)) {
    yield yieldDefeat();
  }
}

function* checkIfHandWentUnderLimit() {
  const player = yield select(sel.getPlayerOverHandLimit);
  if (player && !(yield select(sel.isOverHandLimit, player))) {
    yield put(cardOverLimitComplete());
  }
}


function* watchMoveInit() {
  yield* takeEvery(types.PLAYER_MOVE_INIT, showAvailableCities);
}

function* watchShareInit() {
  yield* takeEvery(types.PLAYER_SHARE_INIT, showShareCandidates);
}

function* watchForTreatEradication() {
  yield* takeEvery([types.PLAYER_TREAT_DISEASE, types.PLAYER_TREAT_ALL_DISEASE], checkForEradication);
}

function* watchForCureEradication() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE, checkForEradication);
}

function* watchForVictory() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE, checkForVictory);
}

function* watchActionsLeft() {
  yield* takeEvery(types.ACTIONS, drawIfNoActionsLeft);
}

function* watchForInfectionRateDefeat() {
  yield* takeEvery(types.EPIDEMIC_INCREASE, checkForInfectionRateDefeat);
}

function* watchForOutbreaksDefeat() {
  yield* takeEvery(types.OUTBREAK_INIT, checkForOutbreaksDefeat);
}

function* watchOverLimitDiscardComplete() {
  yield* takeEvery(types.CARD_DISCARD_FROM_HAND, checkIfHandWentUnderLimit);
}

export default function* rootSaga() {
  yield [
    watchMoveInit(),
    watchShareInit(),
    watchForTreatEradication(),
    watchForCureEradication(),
    watchForVictory(),
    watchActionsLeft(),
    watchForInfectionRateDefeat(),
    watchForOutbreaksDefeat(),
    watchOverLimitDiscardComplete()
  ];
}

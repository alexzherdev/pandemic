import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';

import * as types from './constants/actionTypes';
import { moveShowCities } from './actions/mapActions';
import { discardFromHand } from './actions/cardActions';
import { eradicateDisease } from './actions/diseaseActions';
import { getAvailableCities, getCurrentPlayer, treatedAllOfColor, getDiseaseStatus } from './selectors';


function* showAvailableCities() {
  const cities = yield select(getAvailableCities);
  yield put(moveShowCities(cities));
}

function* processMoveToCity(action) {
  const currentPlayer = yield select(getCurrentPlayer);
  switch (action.source) {
    case 'direct':
      yield put(discardFromHand('city', action.destinationId, currentPlayer.id));
      break;
    case 'charter':
      yield put(discardFromHand('city', action.originId, currentPlayer.id));
      break;
  }
}

function* checkForEradication({ color }) {
  const treatedAll = yield select(treatedAllOfColor, color);
  const status = yield select(getDiseaseStatus, color);
  if (treatedAll && status === 'cured') {
    yield put(eradicateDisease(color));
  }
}

function* watchMoveInit() {
  yield* takeEvery(types.PLAYER_MOVE_INIT, showAvailableCities);
}

function* watchMoveToCity() {
  yield* takeEvery(types.PLAYER_MOVE_TO_CITY, processMoveToCity);
}

function* watchTreatDisease() {
  yield* takeEvery(types.PLAYER_TREAT_DISEASE, checkForEradication);
}

function* watchCureDisease() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE, checkForEradication);
}

export default function* rootSaga() {
  yield [
    watchMoveInit(),
    watchMoveToCity(),
    watchTreatDisease(),
    watchCureDisease()
  ];
}

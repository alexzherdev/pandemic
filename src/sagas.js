import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';

import * as actionTypes from './constants/actionTypes';
import { moveShowCities } from './actions/mapActions';
import { discardFromHand } from './actions/cardActions';
import { getAvailableCities, getCurrentPlayer } from './selectors';


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

function* watchMoveInit() {
  yield* takeEvery(actionTypes.PLAYER_MOVE_INIT, showAvailableCities);
}

function* watchMoveToCity() {
  yield* takeEvery(actionTypes.PLAYER_MOVE_TO_CITY, processMoveToCity);
}

export default function* rootSaga() {
  yield [
    watchMoveInit(),
    watchMoveToCity()
  ];
}

import { takeEvery, END } from 'redux-saga';
import { put, select, call } from 'redux-saga/effects';

import * as types from '../constants/actionTypes';
import { defeat, victory } from '../actions/globalActions';
import * as sel from '../selectors';


export function* checkForVictory() {
  const allCured = yield select(sel.areAllDiseasesCured);

  if (allCured) {
    yield call(yieldVictory);
  }
}

export function* checkForInfectionRateDefeat() {
  if (yield select(sel.isInfectionRateOutOfBounds)) {
    yield call(yieldDefeat);
  }
}

export function* checkForOutbreaksDefeat() {
  if (yield select(sel.isOutbreaksCountOutOfBounds)) {
    yield call(yieldDefeat);
  }
}

export function* yieldDefeat() {
  yield put(defeat());
  yield put(END);
}

export function* yieldVictory() {
  yield put(victory());
  yield put(END);
}

export function* watchVictory() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE_COMPLETE, checkForVictory);
}

export function* watchInfectionRateDefeat() {
  yield* takeEvery(types.EPIDEMIC_INCREASE, checkForInfectionRateDefeat);
}

export function* watchOutbreaksDefeat() {
  yield* takeEvery(types.OUTBREAK_INIT, checkForOutbreaksDefeat);
}

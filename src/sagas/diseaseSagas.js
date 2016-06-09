import { takeEvery } from 'redux-saga';
import { put, select, call } from 'redux-saga/effects';

import { initOutbreak, infectCities, infectCity, infectNeighbor, queueOutbreak,
  completeOutbreak, useDiseaseCubes, eradicateDisease } from '../actions/diseaseActions';
import { discardTopInfectionCard, discardBottomInfectionCard, epidemicIncrease,
  epidemicInfect, epidemicIntensify } from '../actions/cardActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';
import { yieldDefeat } from './globalSagas';


export function* yieldOutbreak(cityId, color) {
  yield put(initOutbreak(cityId, color));
  const neighbors = yield select(sel.getNeighborCities, cityId);

  for (let i = 0; i < neighbors.length; i++) {
    const id = neighbors[i].id;
    const cubesInNeighbor = yield select(sel.getCubesInCity, id, color);
    yield call(useCubes, id, color, 1);
    yield put(infectNeighbor(id, cityId, color));
    if (cubesInNeighbor === 3) {
      yield put(queueOutbreak(id, color));
    }
  }
  yield put(completeOutbreak(cityId));
  const nextOutbreakCityId = yield select(sel.getNextOutbreakCityId);
  if (nextOutbreakCityId) {
    yield call(yieldOutbreak, nextOutbreakCityId, color);
  }
}

export function* infectOrOutbreak(cityId, color, count) {
  const cubesInCity = yield select(sel.getCubesInCity, cityId, color);
  yield call(useCubes, cityId, color, count);
  yield put(infectCity(cityId, color, count));
  if (cubesInCity + count > 3) {
    yield call(yieldOutbreak, cityId, color);
  }
}

export function* useCubes(cityId, color, count) {
  const cubesInCity = yield select(sel.getCubesInCity, cityId, color);
  const actualCubesToUse = Math.min(3 - cubesInCity, count);
  if (yield select(sel.isOutOfCubes, actualCubesToUse, color)) {
    yield call(yieldDefeat);
  } else {
    yield put(useDiseaseCubes(color, actualCubesToUse));
  }
}

export function* checkForEradication({ color }) {
  const treatedAll = yield select(sel.treatedAllOfColor, color);
  const status = yield select(sel.getDiseaseStatus, color);
  if (treatedAll && status === 'cured') {
    yield put(eradicateDisease(color));
  }
}

export function* yieldEpidemic() {
  yield put(epidemicIncrease());
  const infectionCityId = yield select(sel.getInfectionDeckBottom);
  const color = yield select(sel.getCityColor, infectionCityId);
  const status = yield select(sel.getDiseaseStatus, color);
  if (status !== 'eradicated') {
    yield put(epidemicInfect(infectionCityId));
    yield call(infectOrOutbreak, infectionCityId, color, 3);
    yield put(discardBottomInfectionCard());
  }
  yield put(epidemicIntensify());
}

export function* infections() {
  yield put(infectCities());
  const infectionRate = yield select(sel.getInfectionRate);
  for (let i = 0; i < infectionRate; i++) {
    const city = yield select(sel.peekAtInfectionDeck);
    const color = yield select(sel.getCityColor, city);
    const status = yield select(sel.getDiseaseStatus, color);
    if (status !== 'eradicated') {
      yield call(infectOrOutbreak, city, color, 1);
    }
    yield put(discardTopInfectionCard());
  }
}

export function* watchTreatEradication() {
  yield* takeEvery([types.PLAYER_TREAT_DISEASE, types.PLAYER_TREAT_ALL_DISEASE], checkForEradication);
}

export function* watchCureEradication() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE_COMPLETE, checkForEradication);
}

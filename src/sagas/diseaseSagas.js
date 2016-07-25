import { takeEvery } from 'redux-saga';
import { put, select, call, take } from 'redux-saga/effects';

import { initOutbreak, infectCities, infectCity, infectNeighbor, queueOutbreak,
  completeOutbreak, useDiseaseCubes, eradicateDisease, medicPreventInfection, quarSpecPreventInfection } from '../actions/diseaseActions';
import { discardTopInfectionCard, discardBottomInfectionCard, epidemicIncrease, epidemicInfectInit,
  epidemicInfect, epidemicIntensifyInit, resPopSuggest, drawInfectionCard } from '../actions/cardActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';
import defeatMessages from '../constants/defeatMessages';
import { yieldDefeat } from './globalSagas';


export function* yieldOutbreak(cityId, color) {
  yield put(initOutbreak(cityId, color));
  yield take(types.CONTINUE);
  const neighbors = yield select(sel.getNeighborCities, cityId);

  for (let i = 0; i < neighbors.length; i++) {
    const id = neighbors[i].id;
    const medic = yield select(sel.getMedicInCity, id);
    const actualCubesToUse = yield call(getActualCubesToUse, id, color, 1);
    if (medic && (yield select(sel.getDiseaseStatus, color)) === 'cured') {
      yield put(medicPreventInfection(medic, id, color, actualCubesToUse));
    } else {
      const quarSpec = yield select(sel.getQuarSpecInProximity, id);
      if (quarSpec) {
        yield put(quarSpecPreventInfection(quarSpec, id, color, actualCubesToUse));
      } else {
        const cubesInNeighbor = yield select(sel.getCubesInCity, id, color);
        yield call(useCubes, id, color, 1);
        yield put(infectNeighbor(id, cityId, color));
        yield take(types.ANIMATION_INFECT_NEIGHBOR_COMPLETE);
        if (cubesInNeighbor === 3) {
          yield put(queueOutbreak(id, color));
        }
      }
    }
  }
  yield put(completeOutbreak(cityId));
  const nextOutbreakCityId = yield select(sel.getNextOutbreakCityId);
  if (nextOutbreakCityId) {
    yield call(yieldOutbreak, nextOutbreakCityId, color);
  }
}

function* getActualCubesToUse(cityId, color, count) {
  const cubesInCity = yield select(sel.getCubesInCity, cityId, color);
  return Math.min(3 - cubesInCity, count);
}

export function* infectOrOutbreak(cityId, color, count) {
  const cubesInCity = yield select(sel.getCubesInCity, cityId, color);
  const medic = yield select(sel.getMedicInCity, cityId);
  const actualCubesToUse = yield call(getActualCubesToUse, cityId, color, count);
  if (medic && (yield select(sel.getDiseaseStatus, color)) === 'cured') {
    yield put(medicPreventInfection(medic, cityId, color, actualCubesToUse));
    return;
  } else {
    const quarSpec = yield select(sel.getQuarSpecInProximity, cityId);
    if (quarSpec) {
      yield put(quarSpecPreventInfection(quarSpec, cityId, color, actualCubesToUse));
    } else {
      yield call(useCubes, cityId, color, count);
      yield put(infectCity(cityId, color, count));
      if (cubesInCity + count > 3) {
        yield call(yieldOutbreak, cityId, color);
      }
    }
  }
}

export function* useCubes(cityId, color, count) {
  const actualCubesToUse = yield call(getActualCubesToUse, cityId, color, count);
  if (yield select(sel.isOutOfCubes, actualCubesToUse, color)) {
    yield call(yieldDefeat, defeatMessages.OUT_OF_CUBES(color));
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
  yield take(types.CONTINUE);
  const infectionCity = yield select(sel.getInfectionDeckBottom);
  const color = yield select(sel.getCityColor, infectionCity.id);
  const status = yield select(sel.getDiseaseStatus, color);
  if (status !== 'eradicated') {
    yield put(epidemicInfectInit(infectionCity));
    yield take(types.CONTINUE);
    yield put(epidemicInfect(infectionCity));
    yield call(infectOrOutbreak, infectionCity.id, color, 3);
    yield put(discardBottomInfectionCard());
  }
  const resPopOwner = yield select(sel.getResPopOwner);
  if (resPopOwner) {
    yield put(resPopSuggest(resPopOwner));
    yield take([types.PLAYER_PLAY_EVENT_COMPLETE, types.CONTINUE]);
  }
  yield put(epidemicIntensifyInit());
  yield take(types.EPIDEMIC_INTENSIFY);
}

export function* infections() {
  yield put(infectCities());
  const infectionRate = yield select(sel.getInfectionRate);
  for (let i = 0; i < infectionRate; i++) {
    const city = yield select(sel.peekAtInfectionDeck);
    const color = yield select(sel.getCityColor, city);
    const status = yield select(sel.getDiseaseStatus, color);
    yield put(drawInfectionCard(city));
    yield take(types.ANIMATION_DRAW_INFECTION_CARD_COMPLETE);
    yield put(discardTopInfectionCard());

    if (status !== 'eradicated') {
      yield call(infectOrOutbreak, city, color, 1);
    }
  }
}

export function* watchTreatEradication() {
  yield* takeEvery([types.PLAYER_TREAT_DISEASE, types.PLAYER_TREAT_ALL_DISEASE], checkForEradication);
}

export function* watchCureEradication() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE_COMPLETE, checkForEradication);
}

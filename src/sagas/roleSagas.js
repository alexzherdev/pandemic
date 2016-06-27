import { takeEvery } from 'redux-saga';
import { put, select, take, call } from 'redux-saga/effects';

import { medicTreatCuredDiseases } from '../actions/diseaseActions';
import { opsShowCardsToDiscard, contPlannerShowEventsFromDiscard, contPlannerEventComplete } from '../actions/cardActions';
import { showCitiesAndMove } from './actionSagas';
import * as types from '../constants/actionTypes';
import * as sel from '../selectors';


export function* treatCuredDiseasesOnMedicMove(action) {
  if ((yield select(sel.getPlayerRole, action.playerId)) === 'medic') {
    yield take(types.ANIMATION_MOVE_COMPLETE);
    const curedDiseaseCubes = yield select(sel.getCuredDiseaseCubes);
    yield put(medicTreatCuredDiseases(action.destinationId, curedDiseaseCubes));
  }
}

export function* opsChooseCardToDiscard(playerId) {
  const cards = yield select(sel.getCitiesInPlayersHand, playerId);
  yield put(opsShowCardsToDiscard(cards));
}

export function* contPlannerSpecial() {
  const cards = yield select(sel.getCardsForContPlanner);
  yield put(contPlannerShowEventsFromDiscard(cards));
  while (true) { // eslint-disable-line no-constant-condition
    const action = yield take(types.PLAYER_PLAY_EVENT_COMPLETE);
    if (action.id === (yield select(sel.getContPlannerEvent)).id) {
      yield put(contPlannerEventComplete(action.playerId));
      break;
    }
  }
}

export function* clearCubesNearMedic(action) {
  const medic = yield select(sel.getMedicInTeam);
  if (medic) {
    const cityId = yield select(sel.getPlayerCityId, medic.id);
    const cubes = yield select(sel.getCubesInCity, cityId, action.color);
    yield put(medicTreatCuredDiseases(cityId, { [action.color]: cubes }));
  }
}

export function* dispatcherMove(action) {
  const cities = yield select(sel.getCitiesForDispatcher, action.playerId);
  yield call(showCitiesAndMove, cities);
}

export function* watchMedicMove() {
  yield* takeEvery([types.PLAYER_MOVE_TO_CITY, types.EVENT_AIRLIFT_MOVE_TO_CITY], treatCuredDiseasesOnMedicMove);
}

export function* watchContPlannerInit() {
  yield* takeEvery(types.CONT_PLANNER_INIT, contPlannerSpecial);
}

export function* watchDispatcherMove() {
  yield* takeEvery(types.DISPATCHER_CHOOSE_PLAYER, dispatcherMove);
}

export function* watchCureDisease() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE_COMPLETE, clearCubesNearMedic);
}

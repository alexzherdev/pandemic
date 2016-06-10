import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';

import { medicTreatCuredDiseases } from '../actions/diseaseActions';
import * as types from '../constants/actionTypes';
import * as sel from '../selectors';


export function* treatCuredDiseasesOnMedicMove(action) {
  if ((yield select(sel.getPlayerRole, action.playerId)) === 'medic') {
    const curedDiseases = yield select(sel.getCuredDiseases);
    yield put(medicTreatCuredDiseases(action.destinationId, curedDiseases));
  }
}

export function* watchMedicMove() {
  yield* takeEvery([types.PLAYER_MOVE_TO_CITY, types.EVENT_AIRLIFT_MOVE_TO_CITY], treatCuredDiseasesOnMedicMove);
}

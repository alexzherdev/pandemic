import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';

import { govGrantShowCities } from '../actions/mapActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';


export function* processEvent(action) {
  switch (action.id) {
    case 'gov_grant': {
      const cities = yield select(sel.getCitiesForGovGrant);
      yield put(govGrantShowCities(cities));
      break;
    }
  }
}

export function* watchEvents() {
  yield* takeEvery(types.PLAYER_PLAY_EVENT, processEvent);
}

import { takeEvery } from 'redux-saga';
import { select, put, take } from 'redux-saga/effects';

import { govGrantShowCities } from '../actions/mapActions';
import { playEventComplete } from '../actions/cardActions';
import { oneQuietNightSkip } from '../actions/diseaseActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';


export function* processEvent(action) {
  switch (action.id) {
    case 'one_quiet_night':
      yield put(oneQuietNightSkip());
      yield put(playEventComplete(action.playerId, action.id));
      break;
    case 'gov_grant': {
      const cities = yield select(sel.getCitiesForGovGrant);
      yield put(govGrantShowCities(cities));
      yield take(types.EVENT_GOV_GRANT_BUILD_STATION);
      yield put(playEventComplete(action.playerId, action.id));
      break;
    }
  }
}

export function* watchEvents() {
  yield* takeEvery(types.PLAYER_PLAY_EVENT_INIT, processEvent);
}

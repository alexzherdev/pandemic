import { takeEvery } from 'redux-saga';
import { select, put, take } from 'redux-saga/effects';

import { forecastShowCards, discardFromHandInit, contPlannerEventComplete } from '../actions/cardActions';
import { govGrantShowCities, airliftShowCities } from '../actions/mapActions';
import { oneQuietNightSkip } from '../actions/diseaseActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';


export function* processEvent(action) {
  const plannerEvent = yield select(sel.getContPlannerEvent);
  const needToDiscard = !(plannerEvent && action.id === plannerEvent.id);
  switch (action.id) {
    case 'one_quiet_night':
      yield put(oneQuietNightSkip());
      break;
    case 'gov_grant': {
      const cities = yield select(sel.getCitiesForGovGrant);
      yield put(govGrantShowCities(cities));
      yield take(types.EVENT_GOV_GRANT_BUILD_STATION);
      break;
    }
    case 'forecast': {
      const cards = yield select(sel.getCardsForForecast);
      yield put(forecastShowCards(cards));
      yield take(types.EVENT_FORECAST_SHUFFLE);
      break;
    }
    case 'res_pop':
      yield take(types.EVENT_RES_POP_REMOVE_CARD);
      break;
    case 'airlift': {
      const playerAction = yield take(types.EVENT_AIRLIFT_CHOOSE_PLAYER);
      const cities = yield select(sel.getCitiesForAirlift, playerAction.playerId);
      yield put(airliftShowCities(cities));
      yield take(types.EVENT_AIRLIFT_MOVE_TO_CITY);
      break;
    }
  }

  if (needToDiscard) {
    yield put(discardFromHandInit('event', action.playerId, action.id));
    yield take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE);
  } else {
    yield put(contPlannerEventComplete(action.playerId));
  }
}

export function* watchEvents() {
  yield* takeEvery(types.PLAYER_PLAY_EVENT_INIT, processEvent);
}

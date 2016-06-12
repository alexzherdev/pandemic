import { takeEvery, delay } from 'redux-saga';
import { select, put, take, fork, cancel, call } from 'redux-saga/effects';

import { moveShowCities } from '../actions/mapActions';
import { cureDiseaseShowCards } from '../actions/diseaseActions';
import { shareCardsShowCandidates, discardFromHand, chooseCardsToDiscard,
  cardOverLimitComplete, drawCardsInit, drawCardsHandle } from '../actions/cardActions';
import { passTurn } from '../actions/globalActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';
import { infections, yieldEpidemic } from './diseaseSagas';
import { yieldDefeat } from './globalSagas';
import { opsChooseCardToDiscard } from './roleSagas';


export function* showAvailableCities() {
  const cities = yield select(sel.getAvailableCities);
  yield put(moveShowCities(cities));
  const action = yield take([types.PLAYER_MOVE_TO_CITY, types.PLAYER_MOVE_CANCEL]);
  if (action.type === types.PLAYER_MOVE_TO_CITY) {
    const currentPlayer = yield select(sel.getCurrentPlayer);
    switch (action.source) {
      case 'direct':
        yield put(discardFromHand('city', currentPlayer.id, action.destinationId));
        break;
      case 'charter':
        yield put(discardFromHand('city', currentPlayer.id, action.originId));
        break;
      case 'ops':
        yield call(opsChooseCardToDiscard, currentPlayer.id);
        break;
    }
  }
}

export function* showShareCandidates() {
  const players = yield select(sel.getShareCandidates);
  yield put(shareCardsShowCandidates(players));

  const action = yield take([types.PLAYER_SHARE_CARD, types.PLAYER_SHARE_CANCEL]);
  if (action.type === types.PLAYER_SHARE_CARD) {
    yield call(waitToDiscardIfOverLimit, action.receiverId);
  }
}

export function* drawIfNoActionsLeft() {
  function* continueTurn() {
    if (!(yield select(sel.shouldSkipInfectionsStep))) {
      yield call(infections);
    }
    const nextPlayer = yield select(sel.getNextPlayer);
    yield put(passTurn(nextPlayer));
  }

  if (!(yield select(sel.isPlaying))) {
    // won
    return;
  }

  const actionsLeft = yield select(sel.getActionsLeft);
  if (actionsLeft === 0) {
    yield call(drawPlayerCards);
    if (!(yield select(sel.isPlaying))) {
      // lost due to not enough player cards
      return;
    }
    const currentPlayer = yield select(sel.getCurrentPlayer);
    yield call(waitToDiscardIfOverLimit, currentPlayer.id);
    yield call(continueTurn);
  }
}

function* checkIfHandWentUnderLimit() {
  const player = yield select(sel.getPlayerToDiscard);
  if (player && !(yield select(sel.isOverHandLimit, player))) {
    yield put(cardOverLimitComplete());
  }
}

export function* waitToDiscardIfOverLimit(playerId) {
  function* watchOverLimitDiscardComplete() {
    yield* takeEvery([types.CARD_DISCARD_FROM_HAND, types.PLAYER_PLAY_EVENT_COMPLETE], checkIfHandWentUnderLimit);
  }

  if (yield select(sel.isOverHandLimit, playerId)) {
    yield put(chooseCardsToDiscard(playerId));
    const task = yield fork(watchOverLimitDiscardComplete);
    yield take(types.CARD_OVER_LIMIT_DISCARD_COMPLETE);
    yield cancel(task);
  }
}

export function* drawPlayerCards() {
  const cards = yield select(sel.getPlayerCardsToDraw);
  if (cards.length < 2) {
    yield call(yieldDefeat);
  } else {
    const currentPlayer = yield select(sel.getCurrentPlayer);
    if (cards[1].cardType === 'epidemic') {
      cards.reverse();
    }
    yield put(drawCardsInit(cards));
    for (let i = 0; i < 2; i++) {
      yield delay(1000);
      yield put(drawCardsHandle(cards[i], currentPlayer.id));
      if (cards[i].cardType === 'epidemic') {
        yield call(yieldEpidemic);
      }
    }
  }
}

export function* showCardsToCure({ color }) {
  const cards = yield select(sel.getCardsOfColorInCurrentHand, color);
  yield put(cureDiseaseShowCards(cards, color));
  const action = yield take([types.PLAYER_CURE_DISEASE_COMPLETE, types.PLAYER_CURE_DISEASE_CANCEL]);
  if (action.type === types.PLAYER_CURE_DISEASE_COMPLETE) {
    const { cityIds } = action;
    const currentPlayer = yield select(sel.getCurrentPlayer);
    for (let i = 0; i < cityIds.length; i++) {
      yield put(discardFromHand('city', currentPlayer.id, cityIds[i]));
    }
  }
}

export function* maybeDiscardStationCity(action) {
  if ((yield select(sel.getCurrentRole)) !== 'ops_expert') {
    const currentPlayer = yield select(sel.getCurrentPlayer);
    yield put(discardFromHand('city', currentPlayer.id, action.cityId));
  }
}

export function* watchMoveInit() {
  yield* takeEvery(types.PLAYER_MOVE_INIT, showAvailableCities);
}

export function* watchShareInit() {
  yield* takeEvery(types.PLAYER_SHARE_INIT, showShareCandidates);
}

export function* watchActionsLeft() {
  yield* takeEvery(types.ACTIONS, drawIfNoActionsLeft);
}

export function* watchBuildStation() {
  yield* takeEvery(types.PLAYER_BUILD_STATION, maybeDiscardStationCity);
}

export function* watchCureInit() {
  yield* takeEvery(types.PLAYER_CURE_DISEASE_INIT, showCardsToCure);
}

import { expect } from 'chai';
import { select, put, take } from 'redux-saga/effects';

import { processEvent } from './eventSagas';
import { govGrantShowCities, airliftShowCities } from '../actions/mapActions';
import { forecastShowCards, discardFromHandInit, contPlannerEventComplete } from '../actions/cardActions';
import { oneQuietNightSkip } from '../actions/diseaseActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';


describe('EventSagas', () => {
  describe('processEvent', () => {
    context('gov grant', () => {
      it('shows cities available for gov grant', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT_INIT, playerId: '0', id: 'gov_grant' });
        generator.next();
        let next = generator.next();
        expect(next.value).to.eql(select(sel.getCitiesForGovGrant));
        next = generator.next([{ id: '0', name: 'London', color: 'red' }]);
        expect(next.value).to.eql(put(govGrantShowCities([{ id: '0', name: 'London', color: 'red' }])));
        generator.next();
        next = generator.next({ type: types.EVENT_GOV_GRANT_BUILD_STATION });
        expect(next.value).to.eql(put(discardFromHandInit('event', '0', 'gov_grant')));
        next = generator.next();
        expect(next.value).to.eql(take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE));
      });
    });

    context('one quiet night', () => {
      it('skips the next infections step and exits', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT_INIT, playerId: '0', id: 'one_quiet_night' });
        generator.next();
        let next = generator.next();
        expect(next.value).to.eql(put(oneQuietNightSkip()));
        next = generator.next();
        expect(next.value).to.eql(put(discardFromHandInit('event', '0', 'one_quiet_night')));
        next = generator.next();
        expect(next.value).to.eql(take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE));
      });
    });

    context('airlift', () => {
      it('shows cities and moves player', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT_INIT, playerId: '0', id: 'airlift' });
        generator.next();
        let next = generator.next();
        expect(next.value).to.eql(take(types.EVENT_AIRLIFT_CHOOSE_PLAYER));
        next = generator.next({ type: types.EVENT_AIRLIFT_CHOOSE_PLAYER, playerId: '1' });
        expect(next.value).to.eql(select(sel.getCitiesForAirlift, '1'));
        next = generator.next([{ id: '0', name: 'London', color: 'red' }]);
        expect(next.value).to.eql(put(airliftShowCities([{ id: '0', name: 'London', color: 'red' }])));
        next = generator.next();
        expect(next.value).to.eql(take(types.EVENT_AIRLIFT_MOVE_TO_CITY));
        next = generator.next({ type: types.EVENT_AIRLIFT_MOVE_TO_CITY, playerId: '1', destinationId: '0' });
        expect(next.value).to.eql(put(discardFromHandInit('event', '0', 'airlift')));
        next = generator.next();
        expect(next.value).to.eql(take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE));
      });
    });

    context('forecast', () => {
      it('shows cards and waits for the shuffle action', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT_INIT, playerId: '0', id: 'forecast' });
        generator.next();
        let next = generator.next();
        expect(next.value).to.eql(select(sel.getCardsForForecast));
        next = generator.next(['1', '2']);
        expect(next.value).to.eql(put(forecastShowCards(['1', '2'])));
        next = generator.next();
        expect(next.value).to.eql(take(types.EVENT_FORECAST_SHUFFLE));
        next = generator.next();
        expect(next.value).to.eql(put(discardFromHandInit('event', '0', 'forecast')));
        next = generator.next();
        expect(next.value).to.eql(take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE));
      });
    });

    context('res pop', () => {
      it('waits to remove a card', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT_INIT, playerId: '0', id: 'res_pop' });
        generator.next();
        let next = generator.next();
        expect(next.value).to.eql(take(types.EVENT_RES_POP_REMOVE_CARD));
        next = generator.next();
        expect(next.value).to.eql(put(discardFromHandInit('event', '0', 'res_pop')));
        next = generator.next();
        expect(next.value).to.eql(take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE));
      });
    });

    context('when it\'s the contingency planner\'s special event', () => {
      it('does not discard the card', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT_INIT, playerId: '0', id: 'res_pop' });
        let next = generator.next();
        expect(next.value).to.eql(select(sel.getContPlannerEvent));
        next = generator.next({ id: 'res_pop' });
        expect(next.value).to.eql(take(types.EVENT_RES_POP_REMOVE_CARD));
        next = generator.next();
        expect(next.value).to.eql(put(contPlannerEventComplete('0', 'res_pop', false)));
      });
    });
  });
});

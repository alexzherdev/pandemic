import { expect } from 'chai';
import { select, put, take } from 'redux-saga/effects';

import { processEvent } from './eventSagas';
import { govGrantShowCities, airliftShowCities } from '../actions/mapActions';
import { playEventComplete } from '../actions/cardActions';
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
        expect(next.value).to.deep.equal(select(sel.getCitiesForGovGrant));
        next = generator.next([{ id: '0', name: 'London', color: 'red' }]);
        expect(next.value).to.deep.equal(put(govGrantShowCities([{ id: '0', name: 'London', color: 'red' }])));
        generator.next();
        next = generator.next({ type: types.EVENT_GOV_GRANT_BUILD_STATION });
        expect(next.value).to.deep.equal(put(playEventComplete('0', 'gov_grant', true)));
        next = generator.next();
        expect(next.done).to.be.true;
      });
    });

    context('one quiet night', () => {
      it('skips the next infections step and exits', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT_INIT, playerId: '0', id: 'one_quiet_night' });
        generator.next();
        let next = generator.next();
        expect(next.value).to.deep.equal(put(oneQuietNightSkip()));
        next = generator.next();
        expect(next.value).to.deep.equal(put(playEventComplete('0', 'one_quiet_night', true)));
        next = generator.next();
        expect(next.done).to.be.true;
      });
    });

    context('airlift', () => {
      it('shows cities and moves player', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT_INIT, playerId: '0', id: 'airlift' });
        generator.next();
        let next = generator.next();
        expect(next.value).to.deep.equal(take(types.EVENT_AIRLIFT_CHOOSE_PLAYER));
        next = generator.next({ type: types.EVENT_AIRLIFT_CHOOSE_PLAYER, playerId: '1' });
        expect(next.value).to.deep.equal(select(sel.getCitiesForAirlift, '1'));
        next = generator.next([{ id: '0', name: 'London', color: 'red' }]);
        expect(next.value).to.deep.equal(put(airliftShowCities([{ id: '0', name: 'London', color: 'red' }])));
        next = generator.next();
        expect(next.value).to.deep.equal(take(types.EVENT_AIRLIFT_MOVE_TO_CITY));
        next = generator.next({ type: types.EVENT_AIRLIFT_MOVE_TO_CITY, playerId: '1', destinationId: '0' });
        expect(next.value).to.deep.equal(put(playEventComplete('0', 'airlift', true)));
        next = generator.next();
        expect(next.done).to.be.true;
      });
    });
  });
});

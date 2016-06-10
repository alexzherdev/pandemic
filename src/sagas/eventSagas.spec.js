import { expect } from 'chai';
import { select, put } from 'redux-saga/effects';

import { processEvent } from './eventSagas';
import { govGrantShowCities } from '../actions/mapActions';
import { playEventComplete } from '../actions/cardActions';
import { oneQuietNightSkip } from '../actions/diseaseActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';


describe('EventSagas', () => {
  describe('processEvent', () => {
    context('gov grant', () => {
      it('shows cities available for gov grant', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT_INIT, playerId: '0', id: 'gov_grant' });
        let next = generator.next();
        expect(next.value).to.deep.equal(select(sel.getCitiesForGovGrant));
        next = generator.next([{ id: '0', name: 'London', color: 'red' }]);
        expect(next.value).to.deep.equal(put(govGrantShowCities([{ id: '0', name: 'London', color: 'red' }])));
        generator.next();
        next = generator.next({ type: types.EVENT_GOV_GRANT_BUILD_STATION });
        expect(next.value).to.deep.equal(put(playEventComplete('0', 'gov_grant')));
        next = generator.next();
        expect(next.done).to.be.true;
      });
    });

    context('one quiet night', () => {
      it('skips the next infections step and exits', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT_INIT, playerId: '0', id: 'one_quiet_night' });
        let next = generator.next();
        expect(next.value).to.deep.equal(put(oneQuietNightSkip()));
        next = generator.next();
        expect(next.value).to.deep.equal(put(playEventComplete('0', 'one_quiet_night')));
        next = generator.next();
        expect(next.done).to.be.true;
      });
    });
  });
});

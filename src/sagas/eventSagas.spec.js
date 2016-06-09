import { expect } from 'chai';
import { select, put } from 'redux-saga/effects';

import { processEvent } from './eventSagas';
import { govGrantShowCities } from '../actions/mapActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';


describe('EventSagas', () => {
  describe('processEvent', () => {
    context('gov grant', () => {
      it('shows cities available for gov grant', () => {
        const generator = processEvent({ type: types.PLAYER_PLAY_EVENT, id: 'gov_grant' });
        let next = generator.next();
        expect(next.value).to.deep.equal(select(sel.getCitiesForGovGrant));
        next = generator.next([{ id: '0', name: 'London', color: 'red' }]);
        expect(next.value).to.deep.equal(put(govGrantShowCities([{ id: '0', name: 'London', color: 'red' }])));
        next = generator.next();
        expect(next.done).to.be.true;
      });
    });
  });
});

import { expect } from 'chai';
import { select, put, take, call } from 'redux-saga/effects';

import { showCitiesAndMove } from './actionSagas';
import { treatCuredDiseasesOnMedicMove, contPlannerSpecial, dispatcherMove, clearCubesNearMedic } from './roleSagas';
import { medicTreatCuredDiseases } from '../actions/diseaseActions';
import { contPlannerShowEventsFromDiscard, contPlannerEventComplete } from '../actions/cardActions';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';


describe('RoleSagas', function() {
  describe('treatCuredDiseasesOnMedicMove', () => {
    beforeEach(() => {
      this.generator = treatCuredDiseasesOnMedicMove({ type: types.PLAYER_MOVE_TO_CITY,
        playerId: '1', destinationId: '0' });
      this.next = this.generator.next();
      expect(this.next.value).to.eql(select(sel.getPlayerRole, '1'));
    });

    it('does not do anything if the player is not a medic', () => {
      this.next = this.generator.next('scientist');
      expect(this.next.done).to.be.true;
    });

    it('treats cured diseases in the city if the player is a medic', () => {
      this.next = this.generator.next('medic');
      expect(this.next.value).to.eql(take(types.ANIMATION_MOVE_COMPLETE));
      this.next = this.generator.next({ type: types.ANIMATION_MOVE_COMPLETE });
      expect(this.next.value).to.eql(select(sel.getCuredDiseaseCubes));
      this.next = this.generator.next({ red: 2, yellow: 3 });
      expect(this.next.value).to.eql(put(medicTreatCuredDiseases('0', { red: 2, yellow: 3 })));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });
  });

  describe('contPlannerSpecial', () => {
    beforeEach(() => {
      this.generator = contPlannerSpecial();
      this.next = this.generator.next();
      expect(this.next.value).to.eql(select(sel.getCardsForContPlanner));
      this.next = this.generator.next([{ cardType: 'event', id: '0', name: 'Event' }]);
      expect(this.next.value).to.eql(put(contPlannerShowEventsFromDiscard([{ cardType: 'event', id: '0', name: 'Event' }])));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(take(types.PLAYER_PLAY_EVENT_COMPLETE));
    });

    it('does not complete an event different from the one chosen', () => {
      this.next = this.generator.next({ type: types.PLAYER_PLAY_EVENT_COMPLETE, id: '1' });
      expect(this.next.value).to.eql(select(sel.getContPlannerEvent));
      this.next = this.generator.next('0');
      expect(this.next.value).to.eql(take(types.PLAYER_PLAY_EVENT_COMPLETE));
    });

    it('completes the event chosen as the planner\'s special event', () => {
      this.next = this.generator.next({ type: types.PLAYER_PLAY_EVENT_COMPLETE, id: '0', playerId: '0' });
      expect(this.next.value).to.eql(select(sel.getContPlannerEvent));
      this.next = this.generator.next({ id: '0' });
      expect(this.next.value).to.eql(put(contPlannerEventComplete('0')));
    });
  });

  describe('dispatcherMove', () => {
    beforeEach(() => {
      this.generator = dispatcherMove({ playerId: '0' });
    });

    it('shows the cities for dispatcher', () => {
      let next = this.generator.next();
      expect(next.value).to.eql(select(sel.getCitiesForDispatcher, '0'));
      next = this.generator.next({ 0: { id: '0', name: 'London', source: 'dispatcher' }});
      expect(next.value).to.eql(call(showCitiesAndMove, { 0: { id: '0', name: 'London', source: 'dispatcher' }}));
    });
  });

  describe('clearCubesNearMedic', () => {
    beforeEach(() => {
      this.generator = clearCubesNearMedic({ color: 'red' });
      this.next = this.generator.next();
      expect(this.next.value).to.eql(select(sel.getMedicInTeam));
    });

    it('does not do anything if there is no medic on the team', () => {
      this.next = this.generator.next(null);
      expect(this.next.done).to.be.true;
    });

    it('treats the cured disease where the medic is', () => {
      this.next = this.generator.next({ id: '0' });
      expect(this.next.value).to.eql(select(sel.getPlayerCityId, '0'));
      this.next = this.generator.next('1');
      expect(this.next.value).to.eql(select(sel.getCubesInCity, '1', 'red'));
      this.next = this.generator.next(2);
      expect(this.next.value).to.eql(put(medicTreatCuredDiseases('1', { red: 2 })));
    });
  });
});

import { expect } from 'chai';
import { put, select, call, take } from 'redux-saga/effects';

import { epidemicIncrease, epidemicInfect, epidemicIntensify, discardBottomInfectionCard,
  discardTopInfectionCard, resPopSuggest, drawInfectionCard } from '../actions/cardActions';
import { infectCities, initOutbreak, queueOutbreak, completeOutbreak, infectCity,
  useDiseaseCubes, eradicateDisease, medicPreventInfection, quarSpecPreventInfection } from '../actions/diseaseActions';
import { yieldEpidemic, infectOrOutbreak, infections, yieldOutbreak, useCubes,
  checkForEradication } from './diseaseSagas';
import { yieldDefeat } from './globalSagas';
import * as sel from '../selectors';
import * as types from '../constants/actionTypes';


describe('DiseaseSagas', function() {
  describe('yieldEpidemic', () => {
    beforeEach(() => {
      this.generator = yieldEpidemic();
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(epidemicIncrease()));
      this.generator.next();
      this.generator.next('0');
      this.next = this.generator.next('blue');
      expect(this.next.value).to.eql(select(sel.getDiseaseStatus, 'blue'));
    });

    it('skips infections for an eradicated disease', () => {
      this.generator.next('eradicated');
      this.next = this.generator.next(null);
      expect(this.next.value).to.eql(put(epidemicIntensify()));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });

    it('runs infections for other disease statuses', () => {
      this.next = this.generator.next('cured');
      expect(this.next.value).to.eql(put(epidemicInfect('0')));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(call(infectOrOutbreak, '0', 'blue', 3));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(discardBottomInfectionCard()));
      this.generator.next();
      this.next = this.generator.next(null);
      expect(this.next.value).to.eql(put(epidemicIntensify()));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });

    context('there is a res pop available', () => {
      beforeEach(() => {
        this.next = this.generator.next('cured');
        expect(this.next.value).to.eql(put(epidemicInfect('0')));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(call(infectOrOutbreak, '0', 'blue', 3));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(put(discardBottomInfectionCard()));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(select(sel.getResPopOwner));
        this.next = this.generator.next('0');
        expect(this.next.value).to.eql(put(resPopSuggest('0')));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(take([types.PLAYER_PLAY_EVENT_COMPLETE, types.CONTINUE]));
      });

      it('waits to continue turn', () => {
        this.next = this.generator.next({ type: types.CONTINUE });
        expect(this.next.value).to.eql(put(epidemicIntensify()));
      });

      it('waits for event completion', () => {
        this.next = this.generator.next({ type: types.PLAYER_PLAY_EVENT_COMPLETE });
        expect(this.next.value).to.eql(put(epidemicIntensify()));
      });
    });
  });

  describe('infections', () => {
    beforeEach(() => {
      this.generator = infections();
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(infectCities()));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(select(sel.getInfectionRate));
    });

    it('infects the number of cities equal to infection rate', () => {
      this.next = this.generator.next(2);
      for (let i = 0; i < 2; i++) {
        expect(this.next.value).to.eql(select(sel.peekAtInfectionDeck));
        this.generator.next();
        this.generator.next();
        this.next = this.generator.next();
        expect(this.next.value).to.eql(put(drawInfectionCard()));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(take(types.ANIMATION_DRAW_INFECTION_CARD_COMPLETE));
        this.generator.next();
        this.generator.next();
        this.next = this.generator.next();
      }
      expect(this.next.done).to.be.true;
    });

    it('does not infect if the disease has been eradicated', () => {
      this.next = this.generator.next(1);
      expect(this.next.value).to.eql(select(sel.peekAtInfectionDeck));
      this.generator.next('0');
      this.generator.next('blue');
      this.next = this.generator.next('eradicated');
      expect(this.next.value).to.eql(put(drawInfectionCard('0')));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(take(types.ANIMATION_DRAW_INFECTION_CARD_COMPLETE));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(discardTopInfectionCard()));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });
  });

  describe('yieldOutbreak', () => {
    beforeEach(() => {
      this.generator = yieldOutbreak('0', 'blue');
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(initOutbreak('0', 'blue')));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(select(sel.getNeighborCities, '0'));
      this.next = this.generator.next([{ id: '0', name: 'London', color: 'red' }]);
      expect(this.next.value).to.eql(select(sel.getMedicInCity, '0'));
    });

    context('no medic or quar spec', () => {
      it('queues an outbreak in a neighbor with 3 cubes', () => {
        this.generator.next(null);
        this.generator.next(1);
        this.next = this.generator.next(null);
        expect(this.next.value).to.eql(select(sel.getCubesInCity, '0', 'blue'));
        this.generator.next(3);
        this.generator.next();
        this.next = this.generator.next();
        expect(this.next.value).to.eql(take(types.ANIMATION_INFECT_NEIGHBOR_COMPLETE));
        this.next = this.generator.next({ type: types.ANIMATION_INFECT_NEIGHBOR_COMPLETE });
        expect(this.next.value).to.eql(put(queueOutbreak('0', 'blue')));
      });

      it('completes a single outbreak', () => {
        this.generator.next(null);
        this.generator.next(1);
        this.next = this.generator.next(null);
        expect(this.next.value).to.eql(select(sel.getCubesInCity, '0', 'blue'));
        this.generator.next(1);
        this.generator.next();
        this.next = this.generator.next();
        expect(this.next.value).to.eql(take(types.ANIMATION_INFECT_NEIGHBOR_COMPLETE));
        this.next = this.generator.next({ type: types.ANIMATION_INFECT_NEIGHBOR_COMPLETE });
        expect(this.next.value).to.eql(put(completeOutbreak('0', 'blue')));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(select(sel.getNextOutbreakCityId));
        this.next = this.generator.next(undefined);
        expect(this.next.done).to.be.true;
      });

      it('yields next outbreak in the queue', () => {
        this.generator.next(null);
        this.generator.next(1);
        this.next = this.generator.next(null);
        expect(this.next.value).to.eql(select(sel.getCubesInCity, '0', 'blue'));
        this.generator.next(3);
        this.generator.next();
        this.next = this.generator.next();
        expect(this.next.value).to.eql(take(types.ANIMATION_INFECT_NEIGHBOR_COMPLETE));
        this.next = this.generator.next({ type: types.ANIMATION_INFECT_NEIGHBOR_COMPLETE });
        expect(this.next.value).to.eql(put(queueOutbreak('0', 'blue')));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(put(completeOutbreak('0', 'blue')));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(select(sel.getNextOutbreakCityId));
        this.next = this.generator.next('1');
        expect(this.next.value).to.eql(call(yieldOutbreak, '1', 'blue'));
        this.next = this.generator.next();
        expect(this.next.done).to.be.true;
      });
    });

    context('with medic', () => {
      beforeEach(() => {
        this.next = this.generator.next('0');
        this.next = this.generator.next(2);
        expect(this.next.value).to.eql(select(sel.getDiseaseStatus, 'blue'));
      });

      it('looks for a quar spec if the disease is not cured', () => {
        this.next = this.generator.next('active');
        expect(this.next.value).to.eql(select(sel.getQuarSpecInProximity, '0'));
      });

      it('prevents infection if the disease is cured', () => {
        this.next = this.generator.next('cured');
        expect(this.next.value).to.eql(put(medicPreventInfection('0', '0', 'blue', 2)));
      });
    });

    context('with no medic and a quar spec', () => {
      beforeEach(() => {
        this.next = this.generator.next(null);
        this.next = this.generator.next(2);
        expect(this.next.value).to.eql(select(sel.getQuarSpecInProximity, '0'));
        this.next = this.generator.next('1');
      });

      it('prevents infection', () => {
        expect(this.next.value).to.eql(put(quarSpecPreventInfection('1', '0', 'blue', 2)));
      });
    });
  });

  describe('infectOrOutbreak', () => {
    beforeEach(() => {
      this.generator = infectOrOutbreak('0', 'blue', 1);
      this.next = this.generator.next();
      expect(this.next.value).to.eql(select(sel.getCubesInCity, '0', 'blue'));
    });

    context('no medic or quar spec', () => {
      it('yields outbreak if infected city is over 3 cubes', () => {
        this.next = this.generator.next(3);
        expect(this.next.value).to.eql(select(sel.getMedicInCity, '0'));
        this.generator.next(null);
        this.generator.next(0);
        this.next = this.generator.next(null);
        expect(this.next.value).to.eql(call(useCubes, '0', 'blue', 1));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(put(infectCity('0', 'blue', 1)));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(call(yieldOutbreak, '0', 'blue'));
        this.next = this.generator.next();
        expect(this.next.done).to.be.true;
      });

      it('does not yield outbreak if infected city is under 3 cubes', () => {
        this.next = this.generator.next(2);
        expect(this.next.value).to.eql(select(sel.getMedicInCity, '0'));
        this.next = this.generator.next(null);
        this.generator.next(1);
        this.next = this.generator.next(null);
        expect(this.next.value).to.eql(call(useCubes, '0', 'blue', 1));
        this.next = this.generator.next();
        expect(this.next.value).to.eql(put(infectCity('0', 'blue', 1)));
        this.next = this.generator.next();
        expect(this.next.done).to.be.true;
      });
    });

    context('with medic', () => {
      beforeEach(() => {
        this.next = this.generator.next(2);
        expect(this.next.value).to.eql(select(sel.getMedicInCity, '0'));
        this.generator.next('0');
        this.next = this.generator.next(2);
        expect(this.next.value).to.eql(select(sel.getDiseaseStatus, 'blue'));
      });

      it('looks for a quar spec if the disease is not cured', () => {
        this.next = this.generator.next('active');
        expect(this.next.value).to.eql(select(sel.getQuarSpecInProximity, '0'));
      });

      it('prevents infection if the disease is cured', () => {
        this.next = this.generator.next('cured');
        expect(this.next.value).to.eql(put(medicPreventInfection('0', '0', 'blue', 2)));
      });
    });

    context('with no medic and a quar spec', () => {
      beforeEach(() => {
        this.generator.next(2);
        this.generator.next(null);
        this.next = this.generator.next(2);
        expect(this.next.value).to.eql(select(sel.getQuarSpecInProximity, '0'));
        this.next = this.generator.next('1');
      });

      it('prevents infection', () => {
        expect(this.next.value).to.eql(put(quarSpecPreventInfection('1', '0', 'blue', 2)));
      });
    });
  });

  describe('useCubes', () => {
    beforeEach(() => {
      this.generator = useCubes('0', 'blue', 2);
      this.generator.next();
    });

    it('adds the given number of cubes in full if possible', () => {
      this.next = this.generator.next(2);
      expect(this.next.value).to.eql(select(sel.isOutOfCubes, 2, 'blue'));
    });

    it('yields defeat if there are not enough cubes', () => {
      this.generator.next(1);
      this.next = this.generator.next(true);
      expect(this.next.value).to.eql(call(yieldDefeat));
    });

    it('does not yield defeat if there are enough cubes', () => {
      this.generator.next(1);
      this.next = this.generator.next(false);
      expect(this.next.value).to.eql(put(useDiseaseCubes('blue', 1)));
    });
  });

  describe('checkForEradication', () => {
    beforeEach(() => {
      this.generator = checkForEradication({ color: 'blue' });
      this.next = this.generator.next();
      expect(this.next.value).to.eql(select(sel.treatedAllOfColor, 'blue'));
    });

    it('does not eradicate if not all cubes have been treated', () => {
      this.next = this.generator.next(false);
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });

    it('does not eradicate if disease has not been cured', () => {
      this.next = this.generator.next(true);
      expect(this.next.value).to.eql(select(sel.getDiseaseStatus, 'blue'));
      this.next = this.generator.next('active');
      expect(this.next.done).to.be.true;
    });

    it('eradicates if both conditions are satisfied', () => {
      this.next = this.generator.next(true);
      expect(this.next.value).to.eql(select(sel.getDiseaseStatus, 'blue'));
      this.next = this.generator.next('cured');
      expect(this.next.value).to.eql(put(eradicateDisease('blue')));
      this.next = this.generator.next();
      expect(this.next.value).to.be.done;
    });
  });
});

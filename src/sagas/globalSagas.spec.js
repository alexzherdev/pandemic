import { expect } from 'chai';
import { select, call } from 'redux-saga/effects';

import { checkForVictory, yieldVictory, checkForInfectionRateDefeat, yieldDefeat,
  checkForOutbreaksDefeat } from './globalSagas';
import * as sel from '../selectors';


describe('GlobalSagas', () => {
  describe('checkForVictory', () => {
    it('does not yield victory when there are more diseases to cure', () => {
      const generator = checkForVictory();
      let next = generator.next();
      expect(next.value).to.deep.equal(select(sel.areAllDiseasesCured));
      next = generator.next(false);
      expect(next.done).to.be.true;
    });

    it('yields victory when there are no more diseases to cure', () => {
      const generator = checkForVictory();
      let next = generator.next();
      expect(next.value).to.deep.equal(select(sel.areAllDiseasesCured));
      next = generator.next(true);
      expect(next.value).to.deep.equal(call(yieldVictory));
    });
  });

  describe('checkForInfectionRateDefeat', () => {
    it('does not yield defeat when infection rate has not reached limit', () => {
      const generator = checkForInfectionRateDefeat();
      let next = generator.next();
      expect(next.value).to.deep.equal(select(sel.isInfectionRateOutOfBounds));
      next = generator.next(false);
      expect(next.done).to.be.true;
    });

    it('yields defeat when infection rate has reached limit', () => {
      const generator = checkForInfectionRateDefeat();
      let next = generator.next();
      expect(next.value).to.deep.equal(select(sel.isInfectionRateOutOfBounds));
      next = generator.next(true);
      expect(next.value).to.deep.equal(call(yieldDefeat));
    });
  });

  describe('checkForOutbreaksDefeat', () => {
    it('does not yield defeat when outbreak count has not reached limit', () => {
      const generator = checkForOutbreaksDefeat();
      let next = generator.next();
      expect(next.value).to.deep.equal(select(sel.isOutbreaksCountOutOfBounds));
      next = generator.next(false);
      expect(next.done).to.be.true;
    });

    it('yields defeat when outbreak count has reached limit', () => {
      const generator = checkForOutbreaksDefeat();
      let next = generator.next();
      expect(next.value).to.deep.equal(select(sel.isOutbreaksCountOutOfBounds));
      next = generator.next(true);
      expect(next.value).to.deep.equal(call(yieldDefeat));
    });
  });
});

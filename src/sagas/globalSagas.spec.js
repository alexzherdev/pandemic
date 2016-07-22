import { expect } from 'chai';
import { select, call } from 'redux-saga/effects';

import { checkForVictory, yieldVictory, yieldDefeat, checkForOutbreaksDefeat } from './globalSagas';
import * as sel from '../selectors';


describe('GlobalSagas', () => {
  describe('checkForVictory', () => {
    it('does not yield victory when there are more diseases to cure', () => {
      const generator = checkForVictory();
      let next = generator.next();
      expect(next.value).to.eql(select(sel.areAllDiseasesCured));
      next = generator.next(false);
      expect(next.done).to.be.true;
    });

    it('yields victory when there are no more diseases to cure', () => {
      const generator = checkForVictory();
      let next = generator.next();
      expect(next.value).to.eql(select(sel.areAllDiseasesCured));
      next = generator.next(true);
      expect(next.value).to.eql(call(yieldVictory));
    });
  });

  describe('checkForOutbreaksDefeat', () => {
    it('does not yield defeat when outbreak count has not reached limit', () => {
      const generator = checkForOutbreaksDefeat();
      let next = generator.next();
      expect(next.value).to.eql(select(sel.isOutbreaksCountOutOfBounds));
      next = generator.next(false);
      expect(next.done).to.be.true;
    });

    it('yields defeat when outbreak count has reached limit', () => {
      const generator = checkForOutbreaksDefeat();
      let next = generator.next();
      expect(next.value).to.eql(select(sel.isOutbreaksCountOutOfBounds));
      next = generator.next(true);
      expect(next.value).to.eql(call(yieldDefeat, 'Eight outbreaks have occurred.'));
    });
  });
});

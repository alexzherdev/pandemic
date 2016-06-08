import { expect } from 'chai';
import { select, put, call } from 'redux-saga/effects';

import { moveShowCities, moveCancel, moveToCity } from '../actions/mapActions';
import { discardFromHand, shareCardsShowCandidates, shareCardsCancel } from '../actions/cardActions';
import { showAvailableCities, showShareCandidates, drawIfNoActionsLeft,
  drawPlayerCards, waitToDiscardIfOverLimit } from './actionSagas';
import * as sel from '../selectors';


describe('ActionSagas', function() {
  describe('showAvailableCities', () => {
    beforeEach(() => {
      this.generator = showAvailableCities();
      this.cities = [{ id: '0', name: 'London', color: 'red' }];
    });

    it('does not do anything on move cancel', () => {
      let next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.getAvailableCities));
      next = this.generator.next(this.cities);
      expect(next.value).to.deep.equal(put(moveShowCities(this.cities)));
      this.generator.next();
      next = this.generator.next(moveCancel());
      expect(next.done).to.be.true;
    });

    it('discards the destination card for a direct flight', () => {
      let next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.getAvailableCities));
      next = this.generator.next(this.cities);
      expect(next.value).to.deep.equal(put(moveShowCities(this.cities)));
      this.generator.next();
      next = this.generator.next(moveToCity('0', '0', '1', 'direct'));
      expect(next.value).to.deep.equal(select(sel.getCurrentPlayer));
      next = this.generator.next({ id: '0' });
      expect(next.value).to.deep.equal(put(discardFromHand('city', '0', '1')));
    });

    it('discards the origin card for a charter flight', () => {
      let next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.getAvailableCities));
      next = this.generator.next(this.cities);
      expect(next.value).to.deep.equal(put(moveShowCities(this.cities)));
      this.generator.next();
      next = this.generator.next(moveToCity('0', '0', '1', 'charter'));
      expect(next.value).to.deep.equal(select(sel.getCurrentPlayer));
      next = this.generator.next({ id: '0' });
      expect(next.value).to.deep.equal(put(discardFromHand('city', '0', '0')));
    });
  });

  describe('showShareCandidates', () => {
    beforeEach(() => {
      this.generator = showShareCandidates();
      this.players = [{ id: '0', name: 'P1' }];
    })

    it('shows candidates and exits on cancel', () => {
      let next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.getShareCandidates));
      next = this.generator.next(this.players);
      expect(next.value).to.deep.equal(put(shareCardsShowCandidates(this.players)));
      this.generator.next();
      next = this.generator.next(shareCardsCancel());
      expect(next.done).to.be.true;
    });

    it('shows candidates and exits on cancel', () => {
      let next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.getShareCandidates));
      next = this.generator.next(this.players);
      expect(next.value).to.deep.equal(put(shareCardsShowCandidates(this.players)));
      this.generator.next();
      next = this.generator.next(shareCardsCancel());
      expect(next.done).to.be.true;
    });
  });

  describe('drawIfNoActionsLeft', () => {
    beforeEach(() => {
      this.generator = drawIfNoActionsLeft();
    });

    it('does nothing if the game has ended', () => {
      let next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.isPlaying));
      next = this.generator.next(false);
      expect(next.done).to.be.true;
    });

    it('does nothing if there are actions left', () => {
      let next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.isPlaying));
      next = this.generator.next(true);
      expect(next.value).to.deep.equal(select(sel.getActionsLeft));
      next = this.generator.next(4);
      expect(next.done).to.be.true;
    });

    it('stops if the game has ended due to not enough player cards in deck', () => {
      let next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.isPlaying));
      next = this.generator.next(true);
      expect(next.value).to.deep.equal(select(sel.getActionsLeft));
      next = this.generator.next(0);
      expect(next.value).to.deep.equal(call(drawPlayerCards));
      next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.isPlaying));
      next = this.generator.next(false);
      expect(next.done).to.be.true;
    });

    it('continues the game after resolving any hand limit issues', () => {
      let next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.isPlaying));
      next = this.generator.next(true);
      expect(next.value).to.deep.equal(select(sel.getActionsLeft));
      next = this.generator.next(0);
      expect(next.value).to.deep.equal(call(drawPlayerCards));
      next = this.generator.next();
      expect(next.value).to.deep.equal(select(sel.isPlaying));
      next = this.generator.next(true);
      expect(next.value).to.eql(select(sel.getCurrentPlayer));
      next = this.generator.next({ id: '0' });
      expect(next.value).to.eql(call(waitToDiscardIfOverLimit, '0'));
      this.generator.next();
      next = this.generator.next();
      expect(next.done).to.be.true;
    });
  });
});

import { expect } from 'chai';
import { select, put, call } from 'redux-saga/effects';

import { moveShowCities, moveCancel, moveToCity } from '../actions/mapActions';
import { discardFromHand, shareCardsShowCandidates, shareCardsCancel, shareCard, drawCardsInit,
  drawCardsHandle } from '../actions/cardActions';
import { cureDiseaseShowCards } from '../actions/diseaseActions';
import { showAvailableCities, showShareCandidates, drawIfNoActionsLeft,
  drawPlayerCards, waitToDiscardIfOverLimit, showCardsToCure } from './actionSagas';
import { yieldEpidemic } from './diseaseSagas';
import { yieldDefeat } from './globalSagas';
import * as types from '../constants/actionTypes';
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
      this.next = this.generator.next();
      expect(this.next.value).to.deep.equal(select(sel.getShareCandidates));
      this.next = this.generator.next(this.players);
      expect(this.next.value).to.deep.equal(put(shareCardsShowCandidates(this.players)));
      this.generator.next();
    });

    it('shows candidates and exits on cancel', () => {
      this.next = this.generator.next(shareCardsCancel());
      expect(this.next.done).to.be.true;
    });

    it('shows candidates, shares card, and waits for discarding if over limit', () => {
      this.next = this.generator.next(shareCard('0', '1', '2'));
      expect(this.next.value).to.deep.equal(call(waitToDiscardIfOverLimit, '1'));
      this.next = this.generator.next()
      expect(this.next.done).to.be.true;
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

  describe('drawPlayerCards', () => {
    beforeEach(() => {
      this.generator = drawPlayerCards();
      this.next = this.generator.next();
      expect(this.next.value).to.deep.equal(select(sel.getPlayerCardsToDraw));
    });

    it('yields defeat if not enough cards in the deck', () => {
      this.next = this.generator.next([{ cardType: 'city', id: '0' }]);
      expect(this.next.value).to.deep.equal(call(yieldDefeat));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });

    it('first draws an epidemic card and then a city card', () => {
      const cards = [
        { cardType: 'city', id: '1' },
        { cardType: 'epidemic', name: 'Epidemic' }
      ];
      this.generator.next([...cards]);
      this.next = this.generator.next({ id: '0' });
      expect(this.next.value).to.deep.equal(put(drawCardsInit([...cards].reverse())));
      this.generator.next();
      this.next = this.generator.next();
      expect(this.next.value).to.deep.equal(put(drawCardsHandle(cards[1], '0')));
      this.next = this.generator.next();
      expect(this.next.value).to.deep.equal(call(yieldEpidemic));
      this.generator.next();
      this.next = this.generator.next();
      expect(this.next.value).to.deep.equal(put(drawCardsHandle(cards[0], '0')));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });
  });

  describe('showCardsToCure', () => {
    beforeEach(() => {
      this.cards = [{ cardType: 'city', id: '0' }, { cardType: 'city', id: '1' }];
      this.generator = showCardsToCure({ color: 'blue' });
      this.next = this.generator.next();
      expect(this.next.value).to.deep.equal(select(sel.getCardsOfColorInCurrentHand, 'blue'));
      this.next = this.generator.next([...this.cards]);
      expect(this.next.value).to.deep.equal(put(cureDiseaseShowCards(this.cards, 'blue')));
      this.generator.next();
    });

    it('does nothing on cancel', () => {
      this.next = this.generator.next({ type: types.PLAYER_CURE_DISEASE_CANCEL, color: 'blue' });
      expect(this.next.done).to.be.true;
    });

    it('discards the cards used to cure', () => {
      this.next = this.generator.next({ type: types.PLAYER_CURE_DISEASE_COMPLETE, cityIds: ['0', '1']});
      expect(this.next.value).to.deep.equal(select(sel.getCurrentPlayer));
      this.next = this.generator.next({ id: '0' });
      expect(this.next.value).to.deep.equal(put(discardFromHand('city', '0', '0')));
      this.next = this.generator.next();
      expect(this.next.value).to.deep.equal(put(discardFromHand('city', '0', '1')));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });
  });
});

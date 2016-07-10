import { expect } from 'chai';
import { select, put, call, take } from 'redux-saga/effects';

import { moveShowCities, moveCancel, moveToCity } from '../actions/mapActions';
import { discardFromHand, shareCardsShowCandidates, shareCardsCancel, shareCard, drawCardsInit,
  drawCardsHandleInit } from '../actions/cardActions';
import { cureDiseaseShowCards } from '../actions/diseaseActions';
import { showAvailableCities, showCitiesAndMove, showShareCandidates, drawIfNoActionsLeft,
  drawPlayerCards, waitToDiscardIfOverLimit, showCardsToCure } from './actionSagas';
import { yieldEpidemic } from './diseaseSagas';
import { opsChooseCardToDiscard } from './roleSagas';
import { yieldDefeat } from './globalSagas';
import * as types from '../constants/actionTypes';
import * as sel from '../selectors';


describe('ActionSagas', function() {
  describe('showCitiesAndMove', () => {
    beforeEach(() => {
      this.cities = [{ id: '0', name: 'London', color: 'red' }];
      this.generator = showCitiesAndMove(this.cities);
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(moveShowCities(this.cities)));
      this.generator.next();
    });

    it('does not do anything on move cancel', () => {
      this.next = this.generator.next(moveCancel());
      expect(this.next.done).to.be.true;
    });

    it('discards the destination card for a direct flight', () => {
      this.next = this.generator.next(moveToCity('0', '0', '1', 'direct'));
      expect(this.next.value).to.eql(select(sel.getCurrentPlayer));
      this.next = this.generator.next({ id: '0' });
      expect(this.next.value).to.eql(put(discardFromHand('city', '0', '1')));
    });

    it('discards the origin card for a charter flight', () => {
      this.next = this.generator.next(moveToCity('0', '0', '1', 'charter'));
      expect(this.next.value).to.eql(select(sel.getCurrentPlayer));
      this.next = this.generator.next({ id: '0' });
      expect(this.next.value).to.eql(put(discardFromHand('city', '0', '0')));
    });

    it('chooses a card to discard for an ops special move', () => {
      this.next = this.generator.next(moveToCity('0', '0', '1', 'ops'));
      expect(this.next.value).to.eql(select(sel.getCurrentPlayer));
      this.next = this.generator.next({ id: '0' });
      expect(this.next.value).to.eql(call(opsChooseCardToDiscard, '0'));
    });
  });

  describe('showAvailableCities', () => {
    beforeEach(() => {
      this.cities = [{ id: '0', name: 'London', color: 'red' }];
      this.generator = showAvailableCities();
    });

    it('shows available cities and calls move', () => {
      this.next = this.generator.next();
      expect(this.next.value).to.eql(select(sel.getAvailableCities));
      this.next = this.generator.next(this.cities);
      expect(this.next.value).to.eql(call(showCitiesAndMove, this.cities));
    });
  });

  describe('showShareCandidates', () => {
    beforeEach(() => {
      this.generator = showShareCandidates();
      this.players = [{ id: '0', name: 'P1' }];
      this.next = this.generator.next();
      expect(this.next.value).to.eql(select(sel.getShareCandidates));
      this.next = this.generator.next(this.players);
      expect(this.next.value).to.eql(put(shareCardsShowCandidates(this.players)));
      this.generator.next();
    });

    it('shows candidates and exits on cancel', () => {
      this.next = this.generator.next(shareCardsCancel());
      expect(this.next.done).to.be.true;
    });

    it('shows candidates, shares card, and waits for discarding if over limit', () => {
      this.next = this.generator.next(shareCard('0', '1', '2'));
      expect(this.next.value).to.eql(call(waitToDiscardIfOverLimit, '1'));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });
  });

  describe('drawIfNoActionsLeft', () => {
    beforeEach(() => {
      this.generator = drawIfNoActionsLeft();
    });

    it('does nothing if the game has ended', () => {
      let next = this.generator.next();
      expect(next.value).to.eql(select(sel.isPlaying));
      next = this.generator.next(false);
      expect(next.done).to.be.true;
    });

    it('does nothing if there are actions left', () => {
      let next = this.generator.next();
      expect(next.value).to.eql(select(sel.isPlaying));
      next = this.generator.next(true);
      expect(next.value).to.eql(select(sel.getActionsLeft));
      next = this.generator.next(4);
      expect(next.done).to.be.true;
    });

    it('stops if the game has ended due to not enough player cards in deck', () => {
      let next = this.generator.next();
      expect(next.value).to.eql(select(sel.isPlaying));
      next = this.generator.next(true);
      expect(next.value).to.eql(select(sel.getActionsLeft));
      next = this.generator.next(0);
      expect(next.value).to.eql(call(drawPlayerCards));
      next = this.generator.next();
      expect(next.value).to.eql(select(sel.isPlaying));
      next = this.generator.next(false);
      expect(next.done).to.be.true;
    });

    it('continues the game after resolving any hand limit issues', () => {
      let next = this.generator.next();
      expect(next.value).to.eql(select(sel.isPlaying));
      next = this.generator.next(true);
      expect(next.value).to.eql(select(sel.getActionsLeft));
      next = this.generator.next(0);
      expect(next.value).to.eql(call(drawPlayerCards));
      next = this.generator.next();
      expect(next.value).to.eql(select(sel.isPlaying));
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
      expect(this.next.value).to.eql(select(sel.getPlayerCardsToDraw));
    });

    it('yields defeat if not enough cards in the deck', () => {
      this.next = this.generator.next([{ cardType: 'city', id: '0' }]);
      expect(this.next.value).to.eql(call(yieldDefeat));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });

    it('first draws an epidemic card and then a city card', () => {
      const cards = [
        { cardType: 'city', id: '1' },
        { cardType: 'epidemic', id: 'epidemic' }
      ];
      this.generator.next([...cards]);
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(drawCardsInit([...cards].reverse())));
      this.generator.next();
      this.generator.next();
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(drawCardsHandleInit(cards[1], '0')));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(take(types.CARD_DRAW_CARDS_HANDLE));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(call(yieldEpidemic));
      this.generator.next();
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(drawCardsHandleInit(cards[0], '0')));
    });
  });

  describe('showCardsToCure', () => {
    beforeEach(() => {
      this.cards = [{ cardType: 'city', id: '0' }, { cardType: 'city', id: '1' }];
      this.generator = showCardsToCure({ color: 'blue' });
      this.next = this.generator.next();
      expect(this.next.value).to.eql(select(sel.getCardsOfColorInCurrentHand, 'blue'));
      this.next = this.generator.next([...this.cards]);
      expect(this.next.value).to.eql(put(cureDiseaseShowCards(this.cards, 'blue')));
      this.generator.next();
    });

    it('does nothing on cancel', () => {
      this.next = this.generator.next({ type: types.PLAYER_CURE_DISEASE_CANCEL, color: 'blue' });
      expect(this.next.done).to.be.true;
    });

    it('discards the cards used to cure', () => {
      this.next = this.generator.next({ type: types.PLAYER_CURE_DISEASE_COMPLETE, cityIds: ['0', '1']});
      expect(this.next.value).to.eql(select(sel.getCurrentPlayer));
      this.next = this.generator.next({ id: '0' });
      expect(this.next.value).to.eql(put(discardFromHand('city', '0', '0')));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(discardFromHand('city', '0', '1')));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });
  });
});

import { expect } from 'chai';
import { select, put, call, take } from 'redux-saga/effects';

import { moveShowCities, moveToCity } from '../actions/mapActions';
import { discardFromHandInit, shareCardsShowCandidates, shareCardsCancel, shareCard, drawCardsInit,
  drawCardsHandleInit } from '../actions/cardActions';
import { cureDiseaseShowCards } from '../actions/diseaseActions';
import { showAvailableCities, showCitiesAndMove, movedToCity, showShareCandidates, drawIfNoActionsLeft,
  drawPlayerCards, waitToDiscardIfOverLimit, showCardsToCure } from './actionSagas';
import { yieldEpidemic } from './diseaseSagas';
import { opsChooseCardToDiscard } from './roleSagas';
import { yieldDefeat } from './globalSagas';
import * as types from '../constants/actionTypes';
import * as sel from '../selectors';


describe('ActionSagas', function() {
  describe('showCitiesAndMove', () => {
    it('shows cities and waits for move or cancel', () => {
      const cities = [{ id: '0', name: 'London', color: 'red' }];
      const generator = showCitiesAndMove(cities);
      let next = generator.next();
      expect(next.value).to.eql(put(moveShowCities(cities)));
      next = generator.next();
      expect(next.value).to.eql(take([types.PLAYER_MOVE_TO_CITY, types.PLAYER_MOVE_CANCEL]));
      next = generator.next();
      expect(next.done).to.be.true;
    });
  });

  describe('movedToCity', () => {
    it('discards the destination card for a direct flight', () => {
      const generator = movedToCity(moveToCity('0', '0', '1', 'direct'));
      let next = generator.next();
      expect(next.value).to.eql(take(types.ANIMATION_MOVE_COMPLETE));
      next = generator.next();
      expect(next.value).to.eql(select(sel.getCurrentPlayer));
      next = generator.next({ id: '0' });
      expect(next.value).to.eql(put(discardFromHandInit('city', '0', '1')));
    });

    it('discards the origin card for a charter flight', () => {
      const generator = movedToCity(moveToCity('0', '0', '1', 'charter'));
      let next = generator.next();
      expect(next.value).to.eql(take(types.ANIMATION_MOVE_COMPLETE));
      next = generator.next();
      expect(next.value).to.eql(select(sel.getCurrentPlayer));
      next = generator.next({ id: '0' });
      expect(next.value).to.eql(put(discardFromHandInit('city', '0', '0')));
    });

    it('chooses a card to discard for an ops special move', () => {
      const generator = movedToCity(moveToCity('0', '0', '1', 'ops'));
      let next = generator.next();
      expect(next.value).to.eql(take(types.ANIMATION_MOVE_COMPLETE));
      next = generator.next();
      expect(next.value).to.eql(select(sel.getCurrentPlayer));
      next = generator.next({ id: '0' });
      expect(next.value).to.eql(call(opsChooseCardToDiscard, '0'));
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
      expect(this.next.value).to.eql(call(yieldDefeat, 'You have run out of player cards.'));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });

    it('first draws a city card and then an epidemic card', () => {
      const cards = [
        { cardType: 'epidemic', id: 'epidemic', name: 'Epidemic' },
        { cardType: 'city', id: '1' }
      ];
      this.next = this.generator.next([...cards]);
      expect(this.next.value).to.eql(put(drawCardsInit([...cards].reverse())));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(take(types.ANIMATION_DRAW_CARDS_INIT_COMPLETE));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(drawCardsHandleInit(cards[1], '0')));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(take(types.CARD_DRAW_CARDS_HANDLE));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(drawCardsHandleInit(cards[0], '0')));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(take(types.CARD_DRAW_CARDS_HANDLE));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(call(yieldEpidemic));
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
      expect(this.next.value).to.eql(put(discardFromHandInit('city', '0', '0')));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(put(discardFromHandInit('city', '0', '1')));
      this.next = this.generator.next();
      expect(this.next.value).to.eql(take(types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE));
      this.next = this.generator.next();
      expect(this.next.done).to.be.true;
    });
  });
});

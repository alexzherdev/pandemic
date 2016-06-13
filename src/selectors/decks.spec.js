import { expect } from 'chai';

import * as sel from './decks';


describe('Decks selector', () => {
  const getState = () => ({
    cities: {
      1: {
        id: '1',
        name: 'London'
      },
      3: {
        id: '3',
        name: 'Paris'
      }
    },
    infectionCards: {
      deck: ['0', '2'],
      discard: ['1', '3']
    },

    events: {
      0: {
        id: '0',
        name: 'Event 1'
      },
      1: {
        id: '1',
        name: 'Event 2'
      }
    },

    playerCards: {
      deck: [{ cardType: 'city', id: '1' }, { cardType: 'event', id: '0' }, { cardType: 'epidemic' }],
      discard: [{ cardType: 'city', id: '2' }, { cardType: 'event', id: '1' }]
    }
  });

  describe('getPlayerCardsToDraw', () => {
    it('gets top two player cards to draw', () => {
      expect(sel.getPlayerCardsToDraw(getState())).to.eql(
        [{ cardType: 'city', id: '1' }, { cardType: 'event', id: '0' }]
      );
    });
  });

  describe('getInfectionDeckBottom', () => {
    it('gets a card from the infection deck bottom', () => {
      expect(sel.getInfectionDeckBottom(getState())).to.equal('2');
    });
  });

  describe('peekAtInfectionDeck', () => {
    it('gets a card from the infection deck top', () => {
      expect(sel.peekAtInfectionDeck(getState())).to.equal('0');
    });
  });

  describe('getInfectionDiscard', () => {
    it('gets ids from the infection discard together with the names', () => {
      expect(sel.getInfectionDiscard(getState())).to.eql([
        { id: '1', name: 'London' },
        { id: '3', name: 'Paris' }
      ]);
    });
  });

  describe('getCardsForForecast', () => {
    it('returns 6 cards from the infection deck top', () => {
      expect(sel.getCardsForForecast({
        infectionCards: { deck: ['0', '1', '2', '3', '4', '5', '6', '7']}
      })).to.eql(['0', '1', '2', '3', '4', '5']);
    });

    it('returns less cards if there is not enough in the deck', () => {
      expect(sel.getCardsForForecast(getState())).to.eql(['0', '2']);
    });
  });

  describe('getCardsForContPlanner', () => {
    it('returns events from the player discard together with the names', () => {
      expect(sel.getCardsForContPlanner(getState())).to.eql([
        { cardType: 'event', id: '1', name: 'Event 2' }
      ]);
    });
  });
});

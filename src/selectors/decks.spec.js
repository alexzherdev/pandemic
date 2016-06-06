import { expect } from 'chai';

import * as sel from './decks';


describe('Decks selector', () => {
  const getState = () => ({
    infectionCards: {
      deck: ['0', '2'],
      discard: ['1', '3']
    },

    playerCards: {
      deck: [{ cardType: 'city', id: '1' }, { cardType: 'event', id: '0' }, { cardType: 'epidemic' }],
      discard: [{ cardType: 'city', id: '2' }]
    }
  });

  it('gets top two player cards to draw', () => {
    expect(sel.getPlayerCardsToDraw(getState())).to.deep.equal(
      [{ cardType: 'city', id: '1' }, { cardType: 'event', id: '0' }]
    );
  });

  it('gets a card from the infection deck bottom', () => {
    expect(sel.getInfectionDeckBottom(getState())).to.equal('2');
  });

  it('gets a card from the infection deck top', () => {
    expect(sel.peekAtInfectionDeck(getState())).to.equal('0');
  });
});

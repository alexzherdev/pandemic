import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './playerCardsReducer';


describe('PlayerCardsReducer', () => {
  const getInitialState = () => ({
    deck: [{ cardType: 'city', id: 0 }, { cardType: 'event', id: 0 }, { cardType: 'city', id: 1 }],
    discard: [{ cardType: 'city', id: 2 }]
  });

  it('draws two cards on CARD_DRAW_CARDS_INIT', () => {
    const action = { type: types.CARD_DRAW_CARDS_INIT };

    const initial = getInitialState();
    const expected = { ...initial, deck: [{ cardType: 'city', id: 1 }]};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('puts cards on top of the discard pile on CARD_ADD_TO_PLAYER_DISCARD', () => {
    const action = { type: types.CARD_ADD_TO_PLAYER_DISCARD, cardType: 'city', id: 4 };

    const initial = getInitialState();
    const expected = { ...initial, discard: [{ cardType: 'city', id: 4 }, { cardType: 'city', id: 2 }]};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });
});

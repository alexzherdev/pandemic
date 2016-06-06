import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './infectionCardsReducer';


describe('InfectionCardsReducer', () => {
  const getInitialState = () => ({
    deck: ['2', '0', '1'],
    discard: ['3']
  });

  it('discards one card from the top on CARD_DISCARD_FROM_INFECTION_DECK_TOP', () => {
    const action = { type: types.CARD_DISCARD_FROM_INFECTION_DECK_TOP };

    expect(reducer(getInitialState(), action)).to.deep.equal({
      deck: ['0', '1'],
      discard: ['2', '3']
    });
  });

  it('discard one card from the bottom on CARD_DISCARD_FROM_INFECTION_DECK_BOTTOM', () => {
    const action = { type: types.CARD_DISCARD_FROM_INFECTION_DECK_BOTTOM };

    expect(reducer(getInitialState(), action)).to.deep.equal({
      deck: ['2', '0'],
      discard: ['1', '3']
    });
  });
});

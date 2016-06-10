import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './infectionCardsReducer';


describe('InfectionCardsReducer', () => {
  const getInitialState = () => ({
    deck: ['0', '1', '4', '7', '5', '8', '10', '9'],
    discard: ['3', '6', '2']
  });

  it('discards one card from the top on CARD_DISCARD_FROM_INFECTION_DECK_TOP', () => {
    const action = { type: types.CARD_DISCARD_FROM_INFECTION_DECK_TOP };

    expect(reducer(getInitialState(), action)).to.deep.equal({
      deck: ['1', '4', '7', '5', '8', '10', '9'],
      discard: ['0', '3', '6', '2']
    });
  });

  it('discards one card from the bottom on CARD_DISCARD_FROM_INFECTION_DECK_BOTTOM', () => {
    const action = { type: types.CARD_DISCARD_FROM_INFECTION_DECK_BOTTOM };
    const initial = getInitialState();
    const expected = { deck: ['0', '1', '4', '7', '5', '8', '10'],
      discard: ['9', '3', '6', '2'] };
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('shuffles the discards pile and puts it on top of the deck on EPIDEMIC_INTENSIFY', () => {
    const action = { type: types.EPIDEMIC_INTENSIFY };

    const actual = reducer(getInitialState(), action);
    expect(actual.discard).to.be.empty;
    expect(actual.deck).to.have.members(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  });

  it('removes a card from the discard pile on EVENT_RES_POP_REMOVE_CARD', () => {
    const action = { type: types.EVENT_RES_POP_REMOVE_CARD, cityId: '3' };
    const initial = getInitialState();
    const expected = { ...initial, discard: ['6', '2']};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('puts the shuffled cards back on top of the deck on EVENT_FORECAST_SHUFFLE', () => {
    const action = { type: types.EVENT_FORECAST_SHUFFLE, cards: ['1', '4', '0', '7', '8', '5']};
    const initial = getInitialState();
    const expected = { ...initial, deck: ['1', '4', '0', '7', '8', '5', '10', '9']};
    expect(reducer(initial, action)).to.deep.equals(expected);
  });
});

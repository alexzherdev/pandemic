import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './playerCardsReducer';


describe('PlayerCardsReducer', () => {
  const getInitialState = () => ({
    deck: [{ cardType: 'city', id: '0' }, { cardType: 'event', id: '0' }, { cardType: 'city', id: '1' }],
    discard: [{ cardType: 'city', id: '2' }, { cardType: 'event', id: '1' }]
  });

  it('draws two cards on CARD_DRAW_CARDS_INIT', () => {
    const action = { type: types.CARD_DRAW_CARDS_INIT };

    const initial = getInitialState();
    const expected = { ...initial, deck: [{ cardType: 'city', id: '1' }]};
    expect(reducer(initial, action)).to.eql(expected);
  });

  it('puts cards on top of the discard pile on ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE', () => {
    const action = { type: types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE, cardType: 'city', id: '4' };

    const initial = getInitialState();
    const expected = { ...initial, discard: [{ cardType: 'city', id: '4' }, ...initial.discard]};
    expect(reducer(initial, action)).to.eql(expected);
  });

  it('fetches an event card from the discard pile on CONT_PLANNER_CHOOSE_EVENT', () => {
    const action = { type: types.CONT_PLANNER_CHOOSE_EVENT, eventId: '1', playerId: '0' };

    const initial = getInitialState();
    const expected = { ...initial, discard: [{ cardType: 'city', id: '2' }]};
    expect(reducer(initial, action)).to.eql(expected);
  });
});

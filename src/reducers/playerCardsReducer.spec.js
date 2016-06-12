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
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('puts cards on top of the discard pile on CARD_DISCARD_FROM_HAND', () => {
    const action = { type: types.CARD_DISCARD_FROM_HAND, cardType: 'city', id: '4' };

    const initial = getInitialState();
    const expected = { ...initial, discard: [{ cardType: 'city', id: '4' }, ...initial.discard]};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('discards an event card when flag is on on PLAYER_PLAY_EVENT_COMPLETE', () => {
    const action = { type: types.PLAYER_PLAY_EVENT_COMPLETE, playerId: '0', id: '2',
      needToDiscard: true };

    const initial = getInitialState();
    const expected = { ...initial, discard: [{ cardType: 'event', id: '2' }, ...initial.discard]};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('does not discard an event card when flag is off on PLAYER_PLAY_EVENT_COMPLETE', () => {
    const action = { type: types.PLAYER_PLAY_EVENT_COMPLETE, playerId: '0', id: '2',
      needToDiscard: false };

    const initial = getInitialState();
    const expected = initial;
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('fetches an event card from the discard pile on CONT_PLANNER_CHOOSE_EVENT', () => {
    const action = { type: types.CONT_PLANNER_CHOOSE_EVENT, eventId: '1', playerId: '0' };

    const initial = getInitialState();
    const expected = { ...initial, discard: [{ cardType: 'city', id: '2' }]};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });
});

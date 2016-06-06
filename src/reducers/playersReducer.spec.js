import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './playersReducer';


describe('PlayersReducer', () => {
  const getInitialState = () => ({
    0: {
      id: '0',
      name: 'P1',
      hand: [
        { cardType: 'city', id: '0' },
        { cardType: 'city', id: '2' },
        { cardType: 'event', id: '0' }
      ]
    },
    1: {
      id: '1',
      name: 'P2',
      hand: [
        { cardType: 'city', id: '4' }
      ]
    }
  });

  it('discards one card on CARD_DISCARD_FROM_HAND', () => {
    const action = { type: types.CARD_DISCARD_FROM_HAND, cardType: 'city', id: '0', playerId: '0' };

    const initial = getInitialState();
    const expected = { ...initial,
      0: {
        id: '0',
        name: 'P1',
        hand: [
          { cardType: 'city', id: '2' },
          { cardType: 'event', id: '0' },
        ]
      }};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('adds one card to the hand on CARD_DRAW_CARDS_HANDLE', () => {
    const action = { type: types.CARD_DRAW_CARDS_HANDLE, card: { cardType: 'city', id: '3'}, playerId: '0' };

    const initial = getInitialState();
    const expected = { ...initial,
      0: {
        id: '0',
        name: 'P1',
        hand: [
          { cardType: 'city', id: '0' },
          { cardType: 'city', id: '2' },
          { cardType: 'event', id: '0' },
          { cardType: 'city', id: '3' }
        ]
      }};
    expect(reducer(getInitialState(), action)).to.deep.equal(expected);
  });

  it('does not add epidemic cards to the hand on CARD_DRAW_CARDS_HANDLE', () => {
    const action = { type: types.CARD_DRAW_CARDS_HANDLE, card: { cardType: 'epidemic' }, playerId: '0' };

    const initial = getInitialState();
    expect(reducer(initial, action)).to.deep.equal(initial);
  });

  it('shares cards between players on PLAYER_SHARE_CARD', () => {
    const action = { type: types.PLAYER_SHARE_CARD, giverId: '0', receiverId: '1', cityId: '0' };

    expect(reducer(getInitialState(), action)).to.deep.equal({
      0: {
        id: '0',
        name: 'P1',
        hand: [
          { cardType: 'city', id: '2' },
          { cardType: 'event', id: '0' },
        ]
      },
      1: {
        id: '1',
        name: 'P2',
        hand: [
          { cardType: 'city', id: '4' },
          { cardType: 'city', id: '0' }
        ]
      }
    });
  });
});

import { expect } from 'chai';

import * as sel from './hand';


describe('Hand selector', () => {
  const getState = () => ({
    players: {
      0: {
        id: '0',
        name: 'P1',
        hand: [
          { cardType: 'city', id: '0' },
          { cardType: 'event', id: '0' }
        ]
      },
      1: {
        id: '1',
        name: 'P2',
        hand: [
          { cardType: 'city', id: '1' },
          { cardType: 'event', id: '1' }
        ]
      }
    },
    events: {
      0: { id: '0', name: 'Event 1' },
      1: { id: '1', name: 'Event 2' }
    },
    cities: {
      0: {
        id: '0',
        name: 'London',
        color: 'red'
      },
      1: {
        id: '1',
        name: 'Paris',
        color: 'blue'
      }
    },
    map: {
      playersLocations: {
        0: '0'
      }
    },
    currentMove: {
      player: 0
    }
  });

  it('returns cities in hand', () => {
    const hand = [
      { cardType: 'city', id: '0' },
      { cardType: 'event', id: '0' },
      { cardType: 'epidemic' }
    ];
    expect(sel.getCitiesInHand(getState(), hand)).to.deep.equal(
      [{ id: '0', name: 'London', color: 'red' }]
    );
  });

  it('returns the current player\'s hand', () => {
    expect(sel.getCurrentPlayerHand(getState())).to.deep.equal(
      [
        { cardType: 'city', id: '0', name: 'London' },
        { cardType: 'event', id: '0', name: 'Event 1' }
      ]
    );
  });

  it('gets a hand by player id', () => {
    expect(sel.getPlayerHand(getState(), '1')).to.deep.equal(
      [
        { cardType: 'city', id: '1', name: 'Paris' },
        { cardType: 'event', id: '1', name: 'Event 2' }
      ]
    );
  });

  it('shows if a player has cards over limit', () => {
    const state = {
      players: {
        0: {
          hand: []
        }
      }
    };
    for (let i = 0; i < 8; i++) {
      state.players[0].hand.push({ cardType: 'city', id: '' + i });
    }
    expect(sel.isOverHandLimit(state, '0')).to.equal(true);
    expect(sel.isOverHandLimit(getState(), '0')).to.equal(false);
  });

  it('shows if the current player has the current city in hand', () => {
    expect(sel.hasCurrentCityInHand(getState())).to.equal(true);
  });

  it('shows if another player has the current player\'s city in hand', () => {
    expect(sel.hasCurrentCityInHand(getState(), '1')).to.equal(false);
  });

  it('selects cards of a given color from the current player\'s hand', () => {
    expect(sel.getCardsOfColorInCurrentHand(getState(), 'red')).to.deep.equal(
      [{ cardType: 'city', id: '0', name: 'London' }]
    );
  });

  it('selects all events the players have in hand', () => {
    expect(sel.getEventsInHands(getState())).to.deep.equal([
      { cardType: 'event', id: '0', name: 'Event 1', playerId: '0' },
      { cardType: 'event', id: '1', name: 'Event 2', playerId: '1' }
    ]);
  });

  it('selects the cities a player has in hand', () => {
    expect(sel.getCitiesInPlayersHand(getState(), '0')).to.deep.equal([
      { id: '0', name: 'London', color: 'red' }
    ]);
  });
});

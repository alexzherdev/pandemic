import { expect } from 'chai';

import * as sel from './diseases';


describe('Diseases selector', () => {
  const getState = () => ({
    cities: {
      0: { id: '0', name: 'C1', color: 'blue' },
      1: { id: '1', name: 'C2', color: 'blue' },
      2: { id: '2', name: 'C3', color: 'blue' },
      3: { id: '3', name: 'C4', color: 'blue' },
      4: { id: '4', name: 'C5', color: 'blue' }
    },
    players: {
      0: {
        id: '0',
        name: 'P1',
        hand: [{ cardType: 'city', id: '0' }, { cardType: 'city', id: '2' },
          { cardType: 'city', id: '1' }, { cardType: 'city', id: '3' }, { cardType: 'city', id: '4' }]
      },
      1: {
        id: '1',
        name: 'P2',
        hand: []
      }
    },
    currentMove: {
      player: 0
    },
    diseases: {
      red: 'active',
      yellow: 'cured',
      black: 'eradicated',
      blue: 'active'
    },

    map: {
      matrix: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],

      playersLocations: {
        0: '0',
        1: '1'
      },

      locations: {
        0: {
          coords: [200, 100],
          station: true,
          yellow: 2,
          red: 1,
          black: 0,
          blue: 0
        },
        1: {
          coords: [100, 100],
          yellow: 1,
          red: 0,
          black: 0,
          blue: 1
        },
        2: {
          coords: [100, 200],
          yellow: 1,
          red: 0,
          black: 0,
          blue: 1
        },
        3: {
          coords: [300, 300],
          yellow: 1,
          red: 0,
          black: 0,
          blue: 1
        },
        4: {
          coords: [200, 300],
          yellow: 1,
          red: 0,
          black: 0,
          blue: 1
        }
      }
    }
  });

  it('shows if the treat action is available', () => {
    expect(sel.canTreatColor(getState(), 'red')).to.equal(true);
    expect(sel.canTreatColor(getState(), 'blue')).to.equal(false);
  });

  it('shows if the treat all action is available', () => {
    expect(sel.canTreatAllOfColor(getState(), 'yellow')).to.equal(true);
    expect(sel.canTreatAllOfColor(getState(), 'red')).to.equal(false);
  });

  it('shows if all diseases have been cured', () => {
    expect(sel.areAllDiseasesCured(getState())).to.equal(false);
    expect(sel.areAllDiseasesCured({
      diseases: { red: 'cured', yellow: 'cured', black: 'cured', blue: 'eradicated' }
    })).to.equal(true);
  });

  it('shows if a disease can be cured', () => {
    const state = getState();
    // at a station, but not enough player cards in hand
    expect(sel.canCureDisease(state, 'red')).to.equal(false);
    // at a station with 5 player cards in hand
    expect(sel.canCureDisease(state, 'blue')).to.equal(true);
    // not at a station
    expect(sel.canCureDisease({ ...state, map: { ...state.map, playersLocations: { 0: '1', 1: '1' }}},
      'blue')).to.equal(false);
    // a disease that is not active
    expect(sel.canCureDisease({ ...state, diseases: { blue: 'cured' }}, 'blue')).to.equal(false);
  });

  it('shows if a disease has no cubes on the map', () => {
    const state = getState();
    expect(sel.treatedAllOfColor(state, 'black')).to.equal(true);
    expect(sel.treatedAllOfColor(state, 'red')).to.equal(false);
  });
});

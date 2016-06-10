import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './mapReducer';


describe('MapReducer', () => {
  const getInitialState = () => ({
    matrix: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0]
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
        black: 2,
        blue: 3
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
      }
    }
  });

  const verifyLocationChange = (action, cityId, newLocation) => {
    const initial = getInitialState();
    const actual = reducer(initial, action);
    const expected = { ...initial,
      locations: {
        ...initial.locations,
        [cityId]: newLocation
      }
    };
    expect(actual).to.deep.equal(expected);
  };

  it('moves a player to a location on PLAYER_MOVE_TO_CITY', () => {
    const action = { type: types.PLAYER_MOVE_TO_CITY, destinationId: '1', playerId: '0' };

    const initial = getInitialState();
    const actual = reducer(initial, action);
    const expected = { ...initial, playersLocations: {
      0: '1',
      1: '1'
    }};
    expect(actual).to.deep.equal(expected);
  });

  it('moves a player to a location on EVENT_AIRLIFT_MOVE_TO_CITY', () => {
    const action = { type: types.EVENT_AIRLIFT_MOVE_TO_CITY, destinationId: '1', playerId: '0' };

    const initial = getInitialState();
    const actual = reducer(initial, action);
    const expected = { ...initial, playersLocations: {
      0: '1',
      1: '1'
    }};
    expect(actual).to.deep.equal(expected);
  });

  it('builds a station on PLAYER_BUILD_STATION', () => {
    const action = { type: types.PLAYER_BUILD_STATION, cityId: '1' };

    verifyLocationChange(action, '1', {
      station: true,
      coords: [100, 100],
      yellow: 1,
      red: 0,
      black: 0,
      blue: 1
    });
  });

  it('builds a station on EVENT_GOV_GRANT_BUILD_STATION', () => {
    const action = { type: types.EVENT_GOV_GRANT_BUILD_STATION, cityId: '1' };

    verifyLocationChange(action, '1', {
      station: true,
      coords: [100, 100],
      yellow: 1,
      red: 0,
      black: 0,
      blue: 1
    });
  });

  it('removes a disease cube of one color on PLAYER_TREAT_DISEASE', () => {
    const action = { type: types.PLAYER_TREAT_DISEASE, cityId: '0', color: 'yellow' };

    verifyLocationChange(action, '0', {
      coords: [200, 100],
      station: true,
      yellow: 1,
      red: 1,
      black: 2,
      blue: 3
    });
  });

  it('removes all disease cubes of one color on PLAYER_TREAT_ALL_DISEASE', () => {
    const action = { type: types.PLAYER_TREAT_ALL_DISEASE, cityId: '0', color: 'yellow' };

    verifyLocationChange(action, '0', {
      coords: [200, 100],
      station: true,
      yellow: 0,
      red: 1,
      black: 2,
      blue: 3
    });
  });

  it('adds disease cubes on INFECT_CITY', () => {
    const action = { type: types.INFECT_CITY, cityId: '0', color: 'yellow', count: 1 };

    verifyLocationChange(action, '0', {
      coords: [200, 100],
      station: true,
      yellow: 3,
      red: 1,
      black: 2,
      blue: 3
    });
  });

  it('does not overflow the maximum cube count on INFECT_CITY', () => {
    const action = { type: types.INFECT_CITY, cityId: '0', color: 'yellow', count: 3 };

    verifyLocationChange(action, '0', {
      coords: [200, 100],
      station: true,
      yellow: 3,
      red: 1,
      black: 2,
      blue: 3
    });
  });

  it('adds one disease cube on INFECT_NEIGHBOR', () => {
    const action = { type: types.INFECT_NEIGHBOR, cityId: '0', color: 'red' };

    verifyLocationChange(action, '0', {
      coords: [200, 100],
      station: true,
      yellow: 2,
      red: 2,
      black: 2,
      blue: 3
    });
  });

  it('does not overflow the maximum cube count on INFECT_NEIGHBOR', () => {
    const action = { type: types.INFECT_NEIGHBOR, cityId: '0', color: 'blue' };

    verifyLocationChange(action, '0', {
      coords: [200, 100],
      station: true,
      yellow: 2,
      red: 1,
      black: 2,
      blue: 3
    });
  });
});

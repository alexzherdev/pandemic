import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './cubesLeftReducer';


describe('CubesLeftReducer', () => {
  const getInitialState = () => ({
    red: 10,
    yellow: 10,
    blue: 10,
    black: 10
  });

  it('subtracts cubes on USE_DISEASE_CUBES', () => {
    const action = { type: types.USE_DISEASE_CUBES, color: 'red', count: 1 };
    const initial = getInitialState();
    const expected = { ...initial, red: 9 };
    expect(reducer(initial, action)).to.eql(expected);
  });

  it('adds cubes on PLAYER_TREAT_DISEASE', () => {
    const action = { type: types.PLAYER_TREAT_DISEASE, color: 'red', count: 1 };
    const initial = getInitialState();
    const expected = { ...initial, red: 11 };
    expect(reducer(initial, action)).to.eql(expected);
  });

  it('adds cubes on PLAYER_TREAT_ALL_DISEASE', () => {
    const action = { type: types.PLAYER_TREAT_ALL_DISEASE, color: 'red', count: 3 };
    const initial = getInitialState();
    const expected = { ...initial, red: 13 };
    expect(reducer(initial, action)).to.eql(expected);
  });

  it('adds cubes on MEDIC_TREAT_CURED_DISEASES', () => {
    const action = { type: types.MEDIC_TREAT_CURED_DISEASES, cubes: { red: 2, yellow: 3 }};
    const initial = getInitialState();
    const expected = { ...initial, red: 12, yellow: 13 };
    expect(reducer(initial, action)).to.eql(expected);
  });
});

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
});

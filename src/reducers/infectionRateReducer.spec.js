import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './infectionRateReducer';


describe('InfectionRateReducer', () => {
  it('increases index on EPIDEMIC_INCREASE', () => {
    const action = { type: types.EPIDEMIC_INCREASE };
    const initial = {
      index: 0,
      values: [2, 3, 4]
    };
    const expected = { ...initial, index: 1 };
    expect(reducer(initial, action)).to.eql(expected);
  });

  it('does not go over bounds on EPIDEMIC_INCREASE', () => {
    const action = { type: types.EPIDEMIC_INCREASE };
    const initial = {
      index: 2,
      values: [2, 3, 4]
    };
    const expected = { ...initial, index: 2 };
    expect(reducer(initial, action)).to.eql(expected);
  });
});

import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './outbreaksReducer';


describe('OutbreaksReducer', () => {
  const getInitialState = () => 0;

  it('increases the counter on OUTBREAK_INIT', () => {
    const action = { type: types.OUTBREAK_INIT };

    expect(reducer(getInitialState(), action)).to.equal(1);
  });
});

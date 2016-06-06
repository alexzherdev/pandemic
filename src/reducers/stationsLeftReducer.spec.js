import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './stationsLeftReducer';


describe('StationsLeftReducer', () => {
  const getInitialState = () => 5;

  it('decrements the counter on PLAYER_BUILD_STATION', () => {
    const action = { type: types.PLAYER_BUILD_STATION };

    expect(reducer(getInitialState(), action)).to.equal(4);
  });
});

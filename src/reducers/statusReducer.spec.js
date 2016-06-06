import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './statusReducer';


describe('StatusReducer', () => {
  const getInitialState = () => 'playing';

  it('marks victory on VICTORY', () => {
    const action = { type: types.VICTORY };

    expect(reducer(getInitialState(), action)).to.equal('victory');
  });

  it('marks defeat on DEFEAT', () => {
    const action = { type: types.DEFEAT };

    expect(reducer(getInitialState(), action)).to.equal('defeat');
  });
});

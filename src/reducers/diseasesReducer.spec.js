import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './diseasesReducer';


describe('DiseasesReducer', () => {
  const getInitialState = () => ({
    red: 'active',
    yellow: 'active',
    blue: 'cured',
    black: 'eradicated'
  });

  it('cures an active disease on PLAYER_CURE_DISEASE_COMPLETE', () => {
    const action = { type: types.PLAYER_CURE_DISEASE_COMPLETE, color: 'red' };

    const initial = getInitialState();
    const expected = { ...initial, red: 'cured' };
    expect(reducer(initial, action)).to.eql(expected);
  });

  it('eradicates a cured disease on ERADICATE_DISEASE', () => {
    const action = { type: types.ERADICATE_DISEASE, color: 'blue' };

    const initial = getInitialState();
    const expected = { ...initial, blue: 'eradicated' };
    expect(reducer(initial, action)).to.eql(expected);
  });
});

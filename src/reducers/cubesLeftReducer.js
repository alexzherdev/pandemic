import { assignWith } from 'lodash';

import initialState from './initialState';
import * as types from '../constants/actionTypes';
import DISEASES from '../constants/diseases';


export default function cubesLeftReducer(state = initialState.cubesLeft, action) {
  switch (action.type) {
    case types.CREATE_GAME:
      return DISEASES.reduce((acc, c) => {
        acc[c] = 24;
        return acc;
      }, {});
    case types.USE_DISEASE_CUBES:
      return {
        ...state,
        [action.color]: state[action.color] - action.count
      };
    case types.PLAYER_TREAT_DISEASE:
    case types.PLAYER_TREAT_ALL_DISEASE:
      return {
        ...state,
        [action.color]: state[action.color] + action.count
      };
    case types.MEDIC_TREAT_CURED_DISEASES:
      return assignWith({}, state, action.cubes, (obj, src) => (obj || 0) + src);
    default:
      return state;
  }
}

import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function cubesLeftReducer(state = initialState.cubesLeft, action) {
  switch (action.type) {
    case types.USE_DISEASE_CUBES:
      return {
        ...state,
        [action.color]: state[action.color] - action.count
      };
    default:
      return state;
  }
}

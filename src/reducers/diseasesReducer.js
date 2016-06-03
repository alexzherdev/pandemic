import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function diseasesReducer(state = initialState.diseases, action) {
  switch (action.type) {
    case types.PLAYER_CURE_DISEASE:
      return {
        ...state,
        [action.color]: 'cured'
      };
    default:
      return state;
  }
}

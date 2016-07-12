import initialState from './initialState';
import * as types from '../constants/actionTypes';
import DISEASES from '../constants/diseases';


export default function diseasesReducer(state = initialState.diseases, action) {
  switch (action.type) {
    case types.CREATE_GAME:
      return DISEASES.reduce((acc, c) => {
        acc[c] = 'active';
        return acc;
      }, {});
    case types.PLAYER_CURE_DISEASE_COMPLETE:
      return {
        ...state,
        [action.color]: 'cured'
      };
    case types.ERADICATE_DISEASE:
      return {
        ...state,
        [action.color]: 'eradicated'
      };
    default:
      return state;
  }
}

import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function infectionRateReducer(state = initialState.infectionRate, action) {
  switch (action.type) {
    case types.EPIDEMIC_INCREASE:
      return {
        ...state,
        index: Math.min(state.index + 1, state.values.length - 1)
      };
    default:
      return state;
  }
}

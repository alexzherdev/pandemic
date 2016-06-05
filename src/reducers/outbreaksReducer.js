import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function outbreaksReducer(state = initialState.outbreaks, action) {
  switch (action.type) {
    case types.OUTBREAK_INIT:
      return state + 1;
    default:
      return state;
  }
}

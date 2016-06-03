import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function statusReducer(state = initialState.status, action) {
  switch (action.type) {
    case types.VICTORY:
      return 'victory';
    default:
      return state;
  }
}

import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function statusReducer(state = initialState.status, action) {
  switch (action.type) {
    case types.CREATE_GAME:
      return 'prepare';
    case types.START_GAME:
      return 'playing';
    case types.VICTORY:
      return 'victory';
    case types.DEFEAT:
      return 'defeat';
    default:
      return state;
  }
}

import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function defeatMessageReducer(state = initialState.defeatMessage, action) {
  switch (action.type) {
    case types.DEFEAT:
      return action.message;
    case types.CREATE_GAME:
      return null;
    default:
      return state;
  }
}

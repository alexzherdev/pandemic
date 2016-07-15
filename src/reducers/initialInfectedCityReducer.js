import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function initialInfectedCityReducer(state = initialState.initialInfectedCity, action) {
  switch (action.type) {
    case types.INFECT_CITY:
      if (action.initial) {
        return action.cityId;
      } else {
        return state;
      }
    case types.START_GAME:
      return null;
    default:
      return state;
  }
}

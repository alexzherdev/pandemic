import initialState from './initialState';
import * as types from '../constants/actionTypes';


export default function diseasesReducer(state = initialState.diseases, action) {
  switch (action.type) {
    default:
      return state;
  }
}

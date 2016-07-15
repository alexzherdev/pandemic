import { combineReducers } from 'redux';

import map from './mapReducer';
import players from './playersReducer';
import currentMove from './currentMoveReducer';
import stationsLeft from './stationsLeftReducer';
import cubesLeft from './cubesLeftReducer';
import infectionRate from './infectionRateReducer';
import outbreaks from './outbreaksReducer';
import diseases from './diseasesReducer';
import status from './statusReducer';
import playerCards from './playerCardsReducer';
import infectionCards from './infectionCardsReducer';
import dealingCards from './dealingCardsReducer';
import * as types from '../constants/actionTypes';
import initialState from './initialState';


const combinedReducer = combineReducers({
  status,
  difficulty: (state) => state || initialState.difficulty,
  dealingCards,
  playerCards,
  infectionCards,
  map,
  players,
  diseases,
  outbreaks,
  currentMove,
  stationsLeft,
  cubesLeft,
  infectionRate
});

export default (state, action) => {
  if (action.type === types.CREATE_GAME) {
    return {
      ...initialState,
      difficulty: action.difficulty,
      playerCards: {
        deck: action.playerDeck,
        discard: []
      },
      infectionCards: {
        deck: action.infectionDeck,
        discard: []
      },
      players: action.players.reduce((acc, pl, id) => {
        acc[id] = { ...pl, id: id + '', hand: [] };
        return acc;
      }, {}),
      map: {
        ...initialState.map,
        playersLocations: action.players.reduce((acc, pl, id) => {
          acc[id] = '2';
          return acc;
        }, {})
      }
    };
  } else {
    return combinedReducer(state, action);
  }
};

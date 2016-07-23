import initialState from './initialState';
import * as types from '../constants/actionTypes';
import continueMessages from '../constants/continueMessages';


function actionsLeft(state, action) {
  if (types.ACTIONS.includes(action.type)) {
    return state - 1;
  } else if (action.type === types.PASS_TURN || action.type === types.CREATE_GAME) {
    return 4;
  } else {
    return state;
  }
}

function availableCities(state, action) {
  switch (action.type) {
    case types.PLAYER_MOVE_SHOW_CITIES:
      return action.cities;
    case types.CREATE_GAME:
    case types.PLAYER_MOVE_TO_CITY:
    case types.PLAYER_MOVE_CANCEL:
      return {};
    default:
      return state;
  }
}

function shareCandidates(state, action) {
  switch (action.type) {
    case types.PLAYER_SHARE_SHOW_CANDIDATES:
      return action.players;
    case types.CREATE_GAME:
    case types.PLAYER_SHARE_CARD:
    case types.PLAYER_SHARE_CANCEL:
      return [];
    default:
      return state;
  }
}

function cardsDrawn(state, action) {
  switch (action.type) {
    case types.CREATE_GAME:
      return [];
    case types.CARD_DRAW_CARDS_INIT:
      return action.cards;
    case types.CARD_DRAW_CARDS_HANDLE_INIT:
      return state.map((c) => {
        if (c.cardType === action.card.cardType && c.id === action.card.id) {
          return { ...c, handling: true };
        } else {
          return c;
        }
      });
    case types.CARD_DRAW_CARDS_HANDLE:
      return state.filter((c) => c.id !== action.card.id || c.cardType !== action.card.cardType);
    default:
      return state;
  }
}

function infectionCardDrawn(state, action) {
  switch (action.type) {
    case types.CARD_DRAW_INFECTION_CARD:
      return { id: action.cityId };
    case types.ANIMATION_DRAW_INFECTION_CARD_COMPLETE:
      return {};
    default:
      return state;
  }
}

function discardingCard(state, action) {
  switch (action.type) {
    case types.CARD_DISCARD_FROM_HAND_INIT:
      return { cardType: action.cardType, id: action.id, playerId: action.playerId };
    case types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE:
      return {};
    default:
      return state;
  }
}

function outbreak(state, action) {
  switch (action.type) {
    case types.CREATE_GAME:
    case types.OUTBREAK_INIT:
      return {
        ...state,
        color: action.color,
        pending: state.pending.filter((id) => id !== action.cityId)
      };
    case types.OUTBREAK_COMPLETE:
      return {
        ...state,
        color: state.pending.length > 0 ? state.color : null,
        complete: state.pending.length > 0 ? [...state.complete, action.cityId] : []
      };
    case types.OUTBREAK_QUEUE:
      return {
        ...state,
        pending: state.pending.includes(action.cityId) || state.complete.includes(action.cityId)
          ? state.pending
          : [...state.pending, action.cityId]
      };
    case types.INFECT_NEIGHBOR:
      return {
        ...state,
        infectingCube: {
          cityId: action.cityId,
          originId: action.originId,
          color: action.color
        }
      };
    case types.ANIMATION_INFECT_NEIGHBOR_COMPLETE:
      return {
        ...state,
        infectingCube: {}
      };
    default:
      return state;
  }
}

function playerToDiscard(state, action) {
  switch (action.type) {
    case types.CARD_OVER_LIMIT_DISCARD_INIT:
      return action.playerId;
    case types.CARD_OVER_LIMIT_DISCARD_COMPLETE:
      return null;
    default:
      return state;
  }
}

function playerToMove(state, action) {
  switch (action.type) {
    case types.DISPATCHER_CHOOSE_PLAYER:
      return action.playerId;
    case types.PLAYER_MOVE_TO_CITY:
      return null;
    default:
      return state;
  }
}

function player(state, action) {
  switch (action.type) {
    case types.PASS_TURN:
      return action.playerId;
    default:
      return state;
  }
}

function curingDisease(state, action) {
  switch (action.type) {
    case types.PLAYER_CURE_DISEASE_SHOW_CARDS:
      return { cards: action.cards, color: action.color };
    case types.PLAYER_CURE_DISEASE_COMPLETE:
    case types.PLAYER_CURE_DISEASE_CANCEL:
      return {};
    default:
      return state;
  }
}

function skipInfectionsStep(state, action) {
  switch (action.type) {
    case types.EVENT_ONE_QUIET_NIGHT_SKIP:
      return true;
    case types.PASS_TURN:
      return false;
    default:
      return state;
  }
}

function govGrantCities(state, action) {
  switch (action.type) {
    case types.EVENT_GOV_GRANT_SHOW_CITIES:
      return action.cities;
    case types.EVENT_GOV_GRANT_BUILD_STATION:
      return [];
    default:
      return state;
  }
}

function resPop(state, action) {
  switch (action.type) {
    case types.PLAYER_PLAY_EVENT_INIT:
      if (action.id === 'res_pop') {
        return {
          ...state,
          chooseCard: true
        };
      }
      return state;
    case types.EVENT_RES_POP_REMOVE_CARD:
    case types.CONTINUE:
      return {};
    case types.EVENT_RES_POP_SUGGEST:
      return {
        ...state,
        suggestOwner: action.playerId
      };
    default:
      return state;
  }
}

function forecastCards(state, action) {
  switch (action.type) {
    case types.EVENT_FORECAST_SHOW_CARDS:
      return action.cards;
    case types.EVENT_FORECAST_SHUFFLE:
      return [];
    default:
      return state;
  }
}

function airlift(state, action) {
  switch (action.type) {
    case types.PLAYER_PLAY_EVENT_INIT:
      if (action.id === 'airlift') {
        return { playerId: null, cities: []};
      }
      return state;
    case types.EVENT_AIRLIFT_CHOOSE_PLAYER:
      return { ...state, playerId: action.playerId };
    case types.EVENT_AIRLIFT_SHOW_CITIES:
      return { ...state, cities: action.cities };
    case types.EVENT_AIRLIFT_MOVE_TO_CITY:
      return {};
    default:
      return state;
  }
}

function opsMoveAbility(state, action) {
  switch (action.type) {
    case types.OPS_SHOW_CARDS_TO_DISCARD:
      return {
        ...state,
        cards: action.cards
      };
    case types.ANIMATION_CARD_DISCARD_FROM_HAND_COMPLETE:
      if (state.cards.length > 0) {
        return {
          ...state,
          cards: [],
          used: true
        };
      } else {
        return state;
      }
    case types.PASS_TURN:
      return {
        ...state,
        used: false
      };
    default:
      return state;
  }
}

function contPlannerEvents(state, action) {
  switch (action.type) {
    case types.CONT_PLANNER_SHOW_EVENTS_FROM_DISCARD:
      return action.cards;
    case types.CONT_PLANNER_CHOOSE_EVENT:
      return [];
    default:
      return state;
  }
}

function epidemicInProgress(state, action) {
  switch (action.type) {
    case types.EPIDEMIC_INCREASE:
      return true;
    case types.EPIDEMIC_INTENSIFY:
      return false;
    default:
      return state;
  }
}

function epidemicInfectionCard(state, action) {
  switch (action.type) {
    case types.EPIDEMIC_INFECT_INIT:
      return action.card;
    case types.CONTINUE:
      return {};
    default:
      return state;
  }
}

function continueMessage(state, action) {
  switch (action.type) {
    case types.EPIDEMIC_INTENSIFY_INIT:
      return continueMessages.TO_INTENSITY_STEP;
    case types.CONTINUE:
      return null;
    default:
      return state;
  }
}

export default function currentMoveReducer(state = initialState.currentMove, action) {
  return {
    ...state,
    availableCities: availableCities(state.availableCities, action),
    shareCandidates: shareCandidates(state.shareCandidates, action),
    actionsLeft: actionsLeft(state.actionsLeft, action),
    cardsDrawn: cardsDrawn(state.cardsDrawn, action),
    infectionCardDrawn: infectionCardDrawn(state.infectionCardDrawn, action),
    discardingCard: discardingCard(state.discardingCard, action),
    outbreak: outbreak(state.outbreak, action),
    playerToDiscard: playerToDiscard(state.playerToDiscard, action),
    playerToMove: playerToMove(state.playerToMove, action),
    player: player(state.player, action),
    curingDisease: curingDisease(state.curingDisease, action),
    skipInfectionsStep: skipInfectionsStep(state.skipInfectionsStep, action),
    govGrantCities: govGrantCities(state.govGrantCities, action),
    resPop: resPop(state.resPop, action),
    forecastCards: forecastCards(state.forecastCards, action),
    airlift: airlift(state.airlift, action),
    opsMoveAbility: opsMoveAbility(state.opsMoveAbility, action),
    contPlannerEvents: contPlannerEvents(state.contPlannerEvents, action),
    epidemicInProgress: epidemicInProgress(state.epidemicInProgress, action),
    epidemicInfectionCard: epidemicInfectionCard(state.epidemicInfectionCard, action),
    continueMessage: continueMessage(state.continueMessage, action)
  };
}

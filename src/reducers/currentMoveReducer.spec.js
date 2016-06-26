import { expect } from 'chai';

import * as types from '../constants/actionTypes';
import reducer from './currentMoveReducer';


describe('CurrentMoveReducer', () => {
  const getInitialState = () => ({
    player: 0,
    availableCities: {},
    shareCandidates: [],
    actionsLeft: 3,
    cardsDrawn: [],
    outbreak: {
      color: null,
      complete: [],
      pending: []
    },
    playerToDiscard: null,
    playerToMove: null,
    curingDisease: {},
    skipInfectionsStep: false,
    govGrantCities: [],
    resPop: {},
    forecastCards: [],
    airlift: {},
    opsMoveAbility: {
      cards: [],
      used: false
    },
    contPlannerEvents: []
  });

  it('resets move counter and switches players on PASS_TURN', () => {
    const action = { type: types.PASS_TURN, playerId: 1 };

    const initial = getInitialState();
    const expected = { ...initial, player: 1, actionsLeft: 4 };
    expect(reducer(initial, action)).to.eql(expected);
  });

  it('decrements move counter for player actions', () => {
    const action = { type: types.PLAYER_BUILD_STATION };

    const initial = getInitialState();
    const expected = { ...initial, actionsLeft: 2 };
    expect(reducer(initial, action)).to.eql(expected);
  });

  it('does not touch move counter for internal actions', () => {
    const action = { type: types.ERADICATE_DISEASE };

    const initial = getInitialState();
    expect(reducer(initial, action)).to.eql(initial);
  });

  describe('availableCities', () => {
    it('stores available cities on PLAYER_MOVE_SHOW_CITIES', () => {
      const action = { type: types.PLAYER_MOVE_SHOW_CITIES, cities: { 0: { id: '0' }}};

      const initial = getInitialState();
      const expected = { ...initial, availableCities: { 0: { id: '0' }}};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('cleans up available cities on PLAYER_MOVE_CANCEL', () => {
      const action = { type: types.PLAYER_MOVE_CANCEL };

      const initial = { ...getInitialState(), availableCities: { 0: { id: '0' }}};
      const expected = { ...initial, availableCities: {}};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('cleans up available cities and decrements move counter on PLAYER_MOVE_TO_CITY', () => {
      const action = { type: types.PLAYER_MOVE_TO_CITY };

      const initial = { ...getInitialState(), availableCities: { 0: { id: '0' }}};
      const expected = { ...initial, availableCities: {}, actionsLeft: 2 };
      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('shareCandidates', () => {
    it('stores share candidates on PLAYER_SHARE_SHOW_CANDIDATES', () => {
      const action = { type: types.PLAYER_SHARE_SHOW_CANDIDATES, players: [{ id: '0', name: 'P1' }] };

      const initial = getInitialState();
      const expected = { ...initial, shareCandidates: [{ id: '0', name: 'P1' }]};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('cleans up share candidates on PLAYER_SHARE_CANCEL', () => {
      const action = { type: types.PLAYER_SHARE_CANCEL };

      const initial = { ...getInitialState(), shareCandidates: [{ id: '0', name: 'P1' }]};
      const expected = { ...initial, shareCandidates: []};

      expect(reducer(initial, action)).to.eql(expected);
    });

    it('cleans up share candidates and decrements move counter on PLAYER_SHARE_CARD', () => {
      const action = { type: types.PLAYER_SHARE_CARD };
      const initial = { ...getInitialState(), shareCandidates: [{ id: '0', name: 'P1' }]};
      const expected = { ...initial, shareCandidates: [], actionsLeft: 2 };

      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('cardsDrawn', () => {
    it('stores cards drawn on CARD_DRAW_CARDS_INIT', () => {
      const action = { type: types.CARD_DRAW_CARDS_INIT, cards: [{ id: '0', cardType: 'city' }]};
      const initial = getInitialState();
      const expected = { ...initial, cardsDrawn: [{ id: '0', cardType: 'city' }] };

      expect(reducer(initial, action)).to.eql(expected);
    });

    it('removes a card from cards drawn on CARD_DRAW_CARDS_HANDLE', () => {
      const action = { type: types.CARD_DRAW_CARDS_HANDLE, card: { id: '0', cardType: 'city' }};
      const initial = { ...getInitialState(), cardsDrawn: [{ id: '0', cardType: 'city' }]};
      const expected = getInitialState();

      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('playerToDiscard', () => {
    it('stores player over hand limit on CARD_OVER_LIMIT_DISCARD_INIT', () => {
      const action = { type: types.CARD_OVER_LIMIT_DISCARD_INIT, playerId: '0' };
      const initial = getInitialState();
      const expected = { ...initial, playerToDiscard: '0' };

      expect(reducer(initial, action)).to.eql(expected);
    });

    it('cleans up player over hand limit on CARD_OVER_LIMIT_DISCARD_COMPLETE', () => {
      const action = { type: types.CARD_OVER_LIMIT_DISCARD_COMPLETE };
      const initial = { ...getInitialState(), playerToDiscard: '0' };
      const expected = getInitialState();

      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('curingDisease', () => {
    it('stores the cards to choose from when curing disease on PLAYER_CURE_DISEASE_SHOW_CARDS', () => {
      const action = { type: types.PLAYER_CURE_DISEASE_SHOW_CARDS, color: 'red',
        cards: [{ cardType: 'city', id: '0', name: 'London' }, { cardType: 'city', id: '1', name: 'Paris' }]};
      const initial = getInitialState();
      const expected = { ...initial,
        curingDisease: { color: 'red', cards: [{ cardType: 'city', id: '0', name: 'London' }, { cardType: 'city', id: '1', name: 'Paris' }]}};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('cleans up the cards for curing disease on PLAYER_CURE_DISEASE_CANCEL or PLAYER_CURE_DISEASE_COMPLETE', () => {
      const initial = { ...getInitialState(),
        curingDisease: { color: 'red', cards: [{ cardType: 'city', id: '0', name: 'London' }, { cardType: 'city', id: '1', name: 'Paris' }]}};

      const cancelAction = { type: types.PLAYER_CURE_DISEASE_CANCEL };
      expect(reducer(initial, cancelAction)).to.eql(getInitialState());

      const completeAction = { type: types.PLAYER_CURE_DISEASE_COMPLETE };
      const expected = { ...getInitialState(), actionsLeft: 2 };
      expect(reducer(initial, completeAction)).to.eql(expected);
    });
  });

  describe('outbreak', () => {
    it('stores initial outbreak data on OUTBREAK_INIT', () => {
      const action = { type: types.OUTBREAK_INIT, color: 'red', cityId: '0' };
      const initial = getInitialState();
      const expected = { ...initial, outbreak: { color: 'red', complete: [], pending: []}};

      expect(reducer(initial, action)).to.eql(expected);
    });

    it('removes a city from the queue when a queued outbreak starts on OUTBREAK_INIT', () => {
      const action = { type: types.OUTBREAK_INIT, color: 'red', cityId: '0' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: [], pending: ['0']}};
      const expected = { ...initial, outbreak: { color: 'red', complete: [], pending: []}};

      expect(reducer(initial, action)).to.eql(expected);
    });

    it('queues an outbreak on OUTBREAK_QUEUE', () => {
      const action = { type: types.OUTBREAK_QUEUE, cityId: '1' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: [], pending: []}};
      const expected = { ...initial, outbreak: { color: 'red', complete: [], pending: ['1']}};

      expect(reducer(initial, action)).to.eql(expected);
    });

    it('does not queue an outbreak twice on OUTBREAK_QUEUE', () => {
      const action = { type: types.OUTBREAK_QUEUE, cityId: '1' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: [], pending: ['1']}};

      expect(reducer(initial, action)).to.eql(initial);
    });

    it('does not queue an outbreak in a city that already had one on OUTBREAK_QUEUE', () => {
      const action = { type: types.OUTBREAK_QUEUE, cityId: '1' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: ['1'], pending: []}};

      expect(reducer(initial, action)).to.eql(initial);
    });

    it('completes an outbreak altogether if no outbreaks are pending', () => {
      const action = { type: types.OUTBREAK_COMPLETE, cityId: '1' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: [], pending: []}};
      const expected = { ...initial, outbreak: { color: null, complete: [], pending: []}};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('stores an outbreak as complete if some outbreaks are pending', () => {
      const action = { type: types.OUTBREAK_COMPLETE, cityId: '1' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: [], pending: ['2']}};
      const expected = { ...initial, outbreak: { color: 'red', complete: ['1'], pending: ['2']}};
      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('skipInfectionsStep', () => {
    it('stores a flag to skip the next infections step on EVENT_ONE_QUIET_NIGHT_SKIP', () => {
      const action = { type: types.EVENT_ONE_QUIET_NIGHT_SKIP };
      const initial = getInitialState();
      const expected = { ...initial, skipInfectionsStep: true };
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('resets that flag when a new turn starts', () => {
      const action = { type: types.PASS_TURN, playerId: '1' };
      const initial = { ...getInitialState(), skipInfectionsStep: true };
      const expected = { ...getInitialState(), actionsLeft: 4, player: '1' };
      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('govGrantCities', () => {
    it('stores cities on EVENT_GOV_GRANT_SHOW_CITIES', () => {
      const action = { type: types.EVENT_GOV_GRANT_SHOW_CITIES, cities: [{ id: '0', name: 'London', color: 'red' }]};
      const initial = getInitialState();
      const expected = { ...initial, govGrantCities: [{ id: '0', name: 'London', color: 'red' }]};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('cleans up cities on EVENT_GOV_GRANT_BUILD_STATION', () => {
      const action = { type: types.EVENT_GOV_GRANT_BUILD_STATION, cityId: '0' };
      const initial = { ...getInitialState(), govGrantCities: [{ id: '0', name: 'London', color: 'red' }]};
      const expected = getInitialState();
      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('forecastCards', () => {
    it('stores cards on EVENT_FORECAST_SHOW_CARDS', () => {
      const action = { type: types.EVENT_FORECAST_SHOW_CARDS, cards: [{ id: '0', cardType: 'city' }]};
      const initial = getInitialState();
      const expected = { ...initial, forecastCards: [{ id: '0', cardType: 'city' }]};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('cleans up cards on EVENT_FORECAST_SHUFFLE', () => {
      const action = { type: types.EVENT_FORECAST_SHUFFLE };
      const initial = { ...getInitialState(), forecastCards: [{ id: '0', cardType: 'city' }]};
      const expected = getInitialState();
      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('resPop', () => {
    it('stores a flag on PLAYER_PLAY_EVENT_INIT', () => {
      const action = { type: types.PLAYER_PLAY_EVENT_INIT, id: 'res_pop' };
      const initial = getInitialState();
      const expected = { ...getInitialState(), resPop: { chooseCard: true }};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('resets flag on EVENT_RES_POP_REMOVE_CARD', () => {
      const action = { type: types.EVENT_RES_POP_REMOVE_CARD, cityId: '0' };
      const initial = { ...getInitialState(), resPop: { chooseCard: true }};
      const expected = getInitialState();
      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('airlift', () => {
    it('initializes with empty values on PLAYER_PLAY_EVENT_INIT', () => {
      const action = { type: types.PLAYER_PLAY_EVENT_INIT, id: 'airlift' };
      const initial = getInitialState();
      const expected = { ...getInitialState(), airlift: { playerId: null, cities: []}};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('stores playerId on EVENT_AIRLIFT_CHOOSE_PLAYER', () => {
      const action = { type: types.EVENT_AIRLIFT_CHOOSE_PLAYER, playerId: '0' };
      const initial = { ...getInitialState(), airlift: { playerId: null, cities: []}};
      const expected = { ...getInitialState(), airlift: { playerId: '0', cities: []}};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('stores cities on EVENT_AIRLIFT_SHOW_CITIES', () => {
      const action = { type: types.EVENT_AIRLIFT_SHOW_CITIES, cities: [{ id: '0', name: 'London', color: 'red' }]};
      const initial = { ...getInitialState(), airlift: { playerId: '0', cities: []}};
      const expected = { ...getInitialState(), airlift:
        { playerId: '0', cities: [{ id: '0', name: 'London', color: 'red' }]}};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('empties state on EVENT_AIRLIFT_MOVE_TO_CITY', () => {
      const action = { type: types.EVENT_AIRLIFT_MOVE_TO_CITY, playerId: '0', destinationId: '0' };
      const initial = { ...getInitialState(), airlift:
        { playerId: '0', cities: [{ id: '0', name: 'London', color: 'red' }]}};
      const expected = getInitialState();
      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('opsMoveAbility', () => {
    it('stores the cards to choose from on OPS_SHOW_CARDS_TO_DISCARD', () => {
      const action = { type: types.OPS_SHOW_CARDS_TO_DISCARD, cards: [{ id: '0', name: 'London', color: 'red' }]};
      const initial = getInitialState();
      const expected = { ...initial, opsMoveAbility: { used: false, cards: [{ id: '0', name: 'London', color: 'red' }]}};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('marks the ability as used on CARD_DISCARD_FROM_HAND', () => {
      const action = { type: types.CARD_DISCARD_FROM_HAND, cards: [{ id: '0', name: 'London', color: 'red' }]};
      const initial = { ...getInitialState(), opsMoveAbility: { used: false, cards: [{ id: '0', name: 'London', color: 'red' }]}};
      const expected = { ...initial, opsMoveAbility: { used: true, cards: []}};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('does not care about CARD_DISCARD_FROM_HAND actions that happen when the ability is not being used', () => {
      const action = { type: types.CARD_DISCARD_FROM_HAND, cards: [{ id: '0', name: 'London', color: 'red' }]};
      const initial = { ...getInitialState(), opsMoveAbility: { used: false, cards: []}};
      const expected = initial;
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('clears the flag on passing the turn', () => {
      const action = { type: types.PASS_TURN, playerId: '1' };
      const initial = { ...getInitialState(), opsMoveAbility: { used: true, cards: []}};
      const expected = { ...initial, opsMoveAbility: { used: false, cards: []}, player: '1', actionsLeft: 4 };
      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('contPlannerEvents', () => {
    it('stores events to choose from on CONT_PLANNER_SHOW_EVENTS_FROM_DISCARD', () => {
      const action = { type: types.CONT_PLANNER_SHOW_EVENTS_FROM_DISCARD,
        cards: [{ id: 'one_quiet_night', name: 'One Quiet Night' }]};
      const initial = getInitialState();
      const expected = { ...initial, contPlannerEvents: [{ id: 'one_quiet_night', name: 'One Quiet Night' }]};
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('cleans up events and decrements move counter on CONT_PLANNER_CHOOSE_EVENT', () => {
      const action = { type: types.CONT_PLANNER_CHOOSE_EVENT,
        cards: [{ id: 'one_quiet_night', name: 'One Quiet Night' }]};
      const initial = { ...getInitialState(),
        contPlannerEvents: [{ id: 'one_quiet_night', name: 'One Quiet Night' }]};
      const expected = { ...getInitialState(), actionsLeft: 2 };
      expect(reducer(initial, action)).to.eql(expected);
    });
  });

  describe('playerToMove', () => {
    it('stores the player to be moved by dispatcher on DISPATCHER_CHOOSE_PLAYER', () => {
      const action = { type: types.DISPATCHER_CHOOSE_PLAYER, playerId: '1' };
      const initial = getInitialState();
      const expected = { ...initial, playerToMove: '1' };
      expect(reducer(initial, action)).to.eql(expected);
    });

    it('cleans up the player and decrements the move counter on PLAYER_MOVE_TO_CITY', () => {
      const action = { type: types.PLAYER_MOVE_TO_CITY };
      const initial = { ...getInitialState(), playerToMove: '1' };
      const expected = { ...getInitialState(), actionsLeft: 2 };
      expect(reducer(initial, action)).to.eql(expected);
    });
  });
});

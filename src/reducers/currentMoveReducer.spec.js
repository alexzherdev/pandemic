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
    playerOverHandLimit: null,
    curingDisease: {}
  });

  it('resets move counter and switches players on PASS_TURN', () => {
    const action = { type: types.PASS_TURN, playerId: 1 };

    const initial = getInitialState();
    const expected = { ...initial, player: 1, actionsLeft: 4 };
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('decrements move counter for player actions', () => {
    const action = { type: types.PLAYER_BUILD_STATION };

    const initial = getInitialState();
    const expected = { ...initial, actionsLeft: 2 };
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('does not touch move counter for internal actions', () => {
    const action = { type: types.ERADICATE_DISEASE };

    const initial = getInitialState();
    expect(reducer(initial, action)).to.deep.equal(initial);
  });

  it('stores available cities on PLAYER_MOVE_SHOW_CITIES', () => {
    const action = { type: types.PLAYER_MOVE_SHOW_CITIES, cities: { 0: { id: '0' }}};

    const initial = getInitialState();
    const expected = { ...initial, availableCities: { 0: { id: '0' }}};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('cleans up available cities on PLAYER_MOVE_CANCEL', () => {
    const action = { type: types.PLAYER_MOVE_CANCEL };

    const initial = { ...getInitialState(), availableCities: { 0: { id: '0' }}};
    const expected = { ...initial, availableCities: {}};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('cleans up available cities and decrements move counter on PLAYER_MOVE_TO_CITY', () => {
    const action = { type: types.PLAYER_MOVE_TO_CITY };

    const initial = { ...getInitialState(), availableCities: { 0: { id: '0' }}};
    const expected = { ...initial, availableCities: {}, actionsLeft: 2 };
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('stores share candidates on PLAYER_SHARE_SHOW_CANDIDATES', () => {
    const action = { type: types.PLAYER_SHARE_SHOW_CANDIDATES, players: [{ id: '0', name: 'P1' }] };

    const initial = getInitialState();
    const expected = { ...initial, shareCandidates: [{ id: '0', name: 'P1' }]};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('cleans up share candidates on PLAYER_SHARE_CANCEL', () => {
    const action = { type: types.PLAYER_SHARE_CANCEL };

    const initial = { ...getInitialState(), shareCandidates: [{ id: '0', name: 'P1' }]};
    const expected = { ...initial, shareCandidates: []};

    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('cleans up share candidates and decrements move counter on PLAYER_SHARE_CARD', () => {
    const action = { type: types.PLAYER_SHARE_CARD };
    const initial = { ...getInitialState(), shareCandidates: [{ id: '0', name: 'P1' }]};
    const expected = { ...initial, shareCandidates: [], actionsLeft: 2 };

    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('stores cards drawn on CARD_DRAW_CARDS_INIT', () => {
    const action = { type: types.CARD_DRAW_CARDS_INIT, cards: [{ id: '0', cardType: 'city' }]};
    const initial = getInitialState();
    const expected = { ...initial, cardsDrawn: [{ id: '0', cardType: 'city' }] };

    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('removes a card from cards drawn on CARD_DRAW_CARDS_HANDLE', () => {
    const action = { type: types.CARD_DRAW_CARDS_HANDLE, card: { id: '0', cardType: 'city' }};
    const initial = { ...getInitialState(), cardsDrawn: [{ id: '0', cardType: 'city' }]};
    const expected = getInitialState();

    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('stores player over hand limit on CARD_OVER_LIMIT_DISCARD_INIT', () => {
    const action = { type: types.CARD_OVER_LIMIT_DISCARD_INIT, playerId: '0' };
    const initial = getInitialState();
    const expected = { ...initial, playerOverHandLimit: '0' };

    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('cleans up player over hand limit on CARD_OVER_LIMIT_DISCARD_COMPLETE', () => {
    const action = { type: types.CARD_OVER_LIMIT_DISCARD_COMPLETE };
    const initial = { ...getInitialState(), playerOverHandLimit: '0' };
    const expected = getInitialState();

    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('stores the cards to choose from when curing disease on PLAYER_CURE_DISEASE_SHOW_CARDS', () => {
    const action = { type: types.PLAYER_CURE_DISEASE_SHOW_CARDS, color: 'red',
      cards: [{ cardType: 'city', id: '0', name: 'London' }, { cardType: 'city', id: '1', name: 'Paris' }]};
    const initial = getInitialState();
    const expected = { ...initial,
      curingDisease: { color: 'red', cards: [{ cardType: 'city', id: '0', name: 'London' }, { cardType: 'city', id: '1', name: 'Paris' }]}};
    expect(reducer(initial, action)).to.deep.equal(expected);
  });

  it('cleans up the cards for curing disease on PLAYER_CURE_DISEASE_CANCEL or PLAYER_CURE_DISEASE_COMPLETE', () => {
    const initial = { ...getInitialState(),
      curingDisease: { color: 'red', cards: [{ cardType: 'city', id: '0', name: 'London' }, { cardType: 'city', id: '1', name: 'Paris' }]}};

    const cancelAction = { type: types.PLAYER_CURE_DISEASE_CANCEL };
    expect(reducer(initial, cancelAction)).to.deep.equal(getInitialState());

    const completeAction = { type: types.PLAYER_CURE_DISEASE_COMPLETE };
    const expected = { ...getInitialState(), actionsLeft: 2 };
    expect(reducer(initial, completeAction)).to.deep.equal(expected);
  });

  context('outbreaks', () => {
    it('stores initial outbreak data on OUTBREAK_INIT', () => {
      const action = { type: types.OUTBREAK_INIT, color: 'red', cityId: '0' };
      const initial = getInitialState();
      const expected = { ...initial, outbreak: { color: 'red', complete: [], pending: []}};

      expect(reducer(initial, action)).to.deep.equal(expected);
    });

    it('removes a city from the queue when a queued outbreak starts on OUTBREAK_INIT', () => {
      const action = { type: types.OUTBREAK_INIT, color: 'red', cityId: '0' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: [], pending: ['0']}};
      const expected = { ...initial, outbreak: { color: 'red', complete: [], pending: []}};

      expect(reducer(initial, action)).to.deep.equal(expected);
    });

    it('queues an outbreak on OUTBREAK_QUEUE', () => {
      const action = { type: types.OUTBREAK_QUEUE, cityId: '1' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: [], pending: []}};
      const expected = { ...initial, outbreak: { color: 'red', complete: [], pending: ['1']}};

      expect(reducer(initial, action)).to.deep.equal(expected);
    });

    it('does not queue an outbreak twice on OUTBREAK_QUEUE', () => {
      const action = { type: types.OUTBREAK_QUEUE, cityId: '1' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: [], pending: ['1']}};

      expect(reducer(initial, action)).to.deep.equal(initial);
    });

    it('does not queue an outbreak in a city that already had one on OUTBREAK_QUEUE', () => {
      const action = { type: types.OUTBREAK_QUEUE, cityId: '1' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: ['1'], pending: []}};

      expect(reducer(initial, action)).to.deep.equal(initial);
    });

    it('completes an outbreak altogether if no outbreaks are pending', () => {
      const action = { type: types.OUTBREAK_COMPLETE, cityId: '1' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: [], pending: []}};
      const expected = { ...initial, outbreak: { color: null, complete: [], pending: []}};
      expect(reducer(initial, action)).to.deep.equal(expected);
    });

    it('stores an outbreak as complete if some outbreaks are pending', () => {
      const action = { type: types.OUTBREAK_COMPLETE, cityId: '1' };
      const initial = { ...getInitialState(), outbreak: { color: 'red', complete: [], pending: ['2']}};
      const expected = { ...initial, outbreak: { color: 'red', complete: ['1'], pending: ['2']}};
      expect(reducer(initial, action)).to.deep.equal(expected);
    });
  });
});

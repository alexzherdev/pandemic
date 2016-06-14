import { expect } from 'chai';

import * as sel from './gameplay';
import events from '../constants/events';


describe('Gameplay selector', function() {
  const getState = () => ({
    players: {
      0: {
        id: '0',
        name: 'Ops',
        role: 'ops_expert',
        hand: []
      },
      1: {
        id: '1',
        name: 'Medic',
        role: 'medic',
        hand: []
      },
      2: {
        id: '2',
        name: 'Dispatcher',
        role: 'dispatcher',
        hand: []
      }
    },
    currentMove: {
      player: '0',
      actionsLeft: 3,
      opsMoveAbility: {
        used: false
      }
    },
    map: {
      playersLocations: {
        0: '1',
        1: '0',
        2: '1'
      },
      locations: {
        0: {
          coords: [0, 0],
          station: true
        },
        1: {
          coords: [1, 1]
        }
      }
    }
  });

  describe('getCurrentPlayer', () => {
    it('returns the current player object', () => {
      const state = getState();
      expect(sel.getCurrentPlayer(state)).to.eql(state.players[0]);
    });
  });

  describe('getCurrentRole', () => {
    it('returns the current player\'s role', () => {
      expect(sel.getCurrentRole(getState())).to.equal('ops_expert');
    });
  });

  describe('getPlayerRole', () => {
    it('returns the role of the given player', () => {
      expect(sel.getPlayerRole(getState(), '1')).to.equal('medic');
    });
  });

  describe('getPlayers', () => {
    it('returns an array of players with their city ids', () => {
      const state = getState();
      expect(sel.getPlayers(state)).to.eql([
        { ...state.players[0], cityId: '1' },
        { ...state.players[1], cityId: '0' },
        { ...state.players[2], cityId: '1' }
      ]);
    });
  });

  describe('getNextPlayer', () => {
    it('returns the next player', () => {
      expect(sel.getNextPlayer(getState())).to.equal('1');
    });

    it('goes back to the first player after the last', () => {
      const state = {
        ...getState(),
        currentMove: { player: '2' }
      };
      expect(sel.getNextPlayer(state)).to.equal('0');
    });
  });

  describe('canBuildStation', () => {
    context('when an ops', () => {
      it('can build station if the ops ability hasn\'t been used', () => {
        let state = getState();
        expect(sel.canBuildStation(state)).to.be.true;
      });

      it('cannot build station if the ops ability has been used', () => {
        let state = { ...getState(), currentMove: { player: '0', opsMoveAbility: { used: true }}};
        expect(sel.canBuildStation(state)).to.be.false;
      });
    });

    context('when not an ops', () => {
      beforeEach(() => {
        this.state = {
          ...getState(),
          currentMove: { player: '1' }
        };
      });
      it('cannot build station where there is already one', () => {
        expect(sel.canBuildStation(this.state)).to.be.false;
      });

      it('cannot build station if there is no station but no card in hand', () => {
        const state = { ...this.state, map: { ...this.state.map, playersLocations: { 1: '1' }}};
        expect(sel.canBuildStation(state)).to.be.false;
      });

      it('can build station if there is no station and there is this city card in hand', () => {
        let state = getState();
        state = { ...state, players: { ...state.players, 0: { ...state.players[0], hand: [
          { id: '1', cardType: 'city' }
        ]}}};
        expect(sel.canBuildStation(state)).to.be.true;
      });
    });
  });

  describe('getActionsLeft', () => {
    it('returns actions left', () => {
      expect(sel.getActionsLeft(getState())).to.equal(3);
    });
  });

  describe('infection rate', () => {
    beforeEach(() => {
      this.state = {
        infectionRate: {
          values: [2, 3, 4],
          index: 1
        }
      };
    });
    describe('isInfectionRateOutOfBounds', () => {
      it('returns false if infection rate is in bounds', () => {
        expect(sel.isInfectionRateOutOfBounds(this.state)).to.be.false;
      });

      it('returns true if infection rate is out of bounds', () => {
        expect(sel.isInfectionRateOutOfBounds({
          ...this.state,
          infectionRate: { ...this.state.infectionRate, index: 3 }
        })).to.be.true;
      });
    });

    describe('getInfectionRate', () => {
      it('returns the current infection rate', () => {
        expect(sel.getInfectionRate(this.state)).to.equal(3);
      });
    });
  });

  describe('isOutbreaksCountOutOfBounds', () => {
    it('returns false if outbreaks count is in bounds', () => {
      expect(sel.isOutbreaksCountOutOfBounds({ outbreaks: 3 })).to.be.false;
    });

    it('returns true if outbreaks count is out of bounds', () => {
      expect(sel.isOutbreaksCountOutOfBounds({ outbreaks: 9 })).to.be.true;
    });
  });

  describe('getNextOutbreakCityId', () => {
    it('returns undefined if there are no cities in queue', () => {
      expect(sel.getNextOutbreakCityId({ currentMove: { outbreak: { pending: []}}})).to.be.undefined;
    });

    it('returns the id of the first city in queue', () => {
      expect(sel.getNextOutbreakCityId({ currentMove: { outbreak: { pending: ['2', '4']}}})).to.equal('2');
    });
  });

  describe('isOutOfCubes', () => {
    it('returns false if there are enough cubes of the given color', () => {
      expect(sel.isOutOfCubes({ cubesLeft: { red: 2, yellow: 3 }}, 1, 'red')).to.be.false;
    });

    it('returns true if there is exactly the amount of cubes of the given color needed', () => {
      expect(sel.isOutOfCubes({ cubesLeft: { red: 2, yellow: 3 }}, 2, 'red')).to.be.false;
    });

    it('returns true if there are not enough cubes of the given color', () => {
      expect(sel.isOutOfCubes({ cubesLeft: { red: 2, yellow: 3 }}, 3, 'red')).to.be.true;
    });
  });

  describe('getPlayerToDiscard', () => {
    it('returns the player to discard', () => {
      expect(sel.getPlayerToDiscard({ currentMove: { playerToDiscard: '1' }})).to.equal('1');
    });
  });

  describe('isPlaying', () => {
    it('returns true if game is in progress', () => {
      expect(sel.isPlaying({ status: 'playing' })).to.be.true;
    });

    it('returns false if game is not in progress', () => {
      expect(sel.isPlaying({ status: 'foo' })).to.be.false;
    });
  });

  describe('sharing cards', () => {
    describe('getShareCandidates', () => {
      it('returns an empty array if there are no other players in the current city', () => {
        const initial = getState();
        const state = { ...initial, playersLocations: { ...initial.playersLocations, 2: '0' }};
        expect(sel.getShareCandidates(state)).to.eql([]);
      });

      it('returns an empty array if there are players in the current city but nobody has its card', () => {
        expect(sel.getShareCandidates(getState())).to.eql([]);
      });

      it('returns the giver', () => {
        const initial = getState();
        const state = { ...initial, players: { ...initial.players, 2: {
          hand: [{ cardType: 'city', id: '1' }]
        }}};
        expect(sel.getShareCandidates(state)).to.eql([{ ...state.players[2], share: 'giver' }]);
      });

      it('returns the receivers', () => {
        const initial = getState();
        const state = { ...initial, players: { ...initial.players, 0: {
          id: '0',
          hand: [{ cardType: 'city', id: '1' }]
        }}, map: {
          ...initial.map,
          playersLocations: {
            0: '1',
            1: '1',
            2: '1'
          }
        }};

        expect(sel.getShareCandidates(state)).to.eql([
          { ...state.players[1], share: 'receiver' },
          { ...state.players[2], share: 'receiver' }
        ]);
      });
    });

    describe('canShareCards', () => {
      it('returns true if sharing cards is available', () => {
        const initial = getState();
        const state = { ...initial, players: { ...initial.players, 2: {
          hand: [{ cardType: 'city', id: '1' }]
        }}};
        expect(sel.canShareCards(state)).to.be.true;
      });

      it('returns false if sharing cards is not available', () => {
        expect(sel.canShareCards(getState())).to.be.false;
      });
    });
  });

  describe('shouldSkipInfectionsStep', () => {
    it('returns whether or not the next infections step will be skipped', () => {
      expect(sel.shouldSkipInfectionsStep({ currentMove: { skipInfectionsStep: false }})).to.be.false;
      expect(sel.shouldSkipInfectionsStep({ currentMove: { skipInfectionsStep: true }})).to.be.true;
    });
  });

  describe('hasOpsUsedMoveAbility', () => {
    it('returns whether or not the ops special ability has been used in this turn', () => {
      expect(sel.hasOpsUsedMoveAbility({ currentMove: { opsMoveAbility: { used: false }}})).to.be.false;
      expect(sel.hasOpsUsedMoveAbility({ currentMove: { opsMoveAbility: { used: true }}})).to.be.true;
    });
  });

  describe('isContingencyPlanner', () => {
    it('returns whether or not the current player is a contingency planner', () => {
      const state = getState();
      expect(sel.isContingencyPlanner(state)).to.be.false;
      expect(sel.isContingencyPlanner({ ...state, players: { 0: { role: 'cont_planner' }}})).to.be.true;
    });
  });

  describe('isDispatcher', () => {
    it('returns whether or not the current player is a dispatcher', () => {
      const state = getState();
      expect(sel.isDispatcher(state)).to.be.false;
      expect(sel.isDispatcher({ ...state, players: { 0: { role: 'dispatcher' }}})).to.be.true;
    });
  });

  describe('isContingencyPlannerAbilityAvailable', () => {
    it('returns false if the current player is not a contingency planner', () => {
      expect(sel.isContingencyPlannerAbilityAvailable(getState())).to.be.false;
    });

    it('returns false if the current player is a contingency planner but an event has already been chosen', () => {
      let state = getState();
      state = { ...state, players: { 0: { role: 'cont_planner', specialEvent: 'res_pop' }}};
      expect(sel.isContingencyPlannerAbilityAvailable(state)).to.be.false;
    });

    it('returns true if the current player is a contingency planner and an event has not been chosen', () => {
      let state = getState();
      state = { ...state, players: { 0: { role: 'cont_planner', specialEvent: null }}};
      expect(sel.isContingencyPlannerAbilityAvailable(state)).to.be.true;
    });
  });

  describe('getContPlannerEvent', () => {
    it('returns undefined if there is no event', () => {
      expect(sel.getContPlannerEvent(getState())).to.be.undefined;
    });

    it('returns the event data if there is an event', () => {
      let state = getState();
      state = { ...state, players: { 0: { role: 'cont_planner', specialEvent: 'res_pop' }}};
      expect(sel.getContPlannerEvent(state)).to.eql(events.res_pop);
    });
  });
});

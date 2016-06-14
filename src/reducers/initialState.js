export default {
  status: 'playing',

  playerCards: {
    deck: [
      { cardType: 'city', id: '8' },
      { cardType: 'epidemic', name: 'Epidemic' },
      { cardType: 'city', id: '6' }
    ],
    discard: [
      { cardType: 'event', id: 'one_quiet_night' },
      { cardType: 'event', id: 'gov_grant' },
      { cardType: 'event', id: 'res_pop' }
    ]
  },

  infectionCards: {
    deck: ['8', '7', '0', '5', '6', '1', '3'],
    discard: ['4', '2']
  },

  players: {
    0: {
      id: '0',
      name: 'P1',
      role: 'medic',
      specialEvent: null,
      hand: [
        { cardType: 'event', id: 'forecast' },
        { cardType: 'event', id: 'airlift' },
        { cardType: 'city', id: '0' },
        { cardType: 'city', id: '3' },
        { cardType: 'city', id: '2' },
        { cardType: 'city', id: '5' }
      ]
    },
    1: {
      id: '1',
      name: 'P2',
      role: 'medic',
      hand: [
        { cardType: 'city', id: '4' }
      ]
    },
    2: {
      id: '2',
      name: 'P3',
      hand: []
    }
  },

  diseases: {
    red: 'active',
    blue: 'active',
    yellow: 'cured',
    black: 'eradicated'
  },

  currentMove: {
    player: 0,
    availableCities: {},
    shareCandidates: [],
    actionsLeft: 4,
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
    resPopChooseCard: false,
    resPopSuggestOwner: null,
    forecastCards: [],
    airlift: {},
    opsMoveAbility: {
      used: false,
      cards: []
    },
    contPlannerEvents: []
  },

  stationsLeft: 5,

  cubesLeft: {
    red: 24,
    blue: 24,
    yellow: 24,
    black: 24
  },

  infectionRate: {
    values: [2, 2, 2, 3, 3, 4, 4],
    index: 0
  },

  outbreaks: 0,

  map: {
    matrix: [
      [0, 1, 0, 1, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],

    playersLocations: {
      0: '0',
      1: '1',
      2: '8'
    },

    locations: {
      0: {
        coords: [200, 100],
        station: true,
        yellow: 2,
        red: 1,
        black: 0,
        blue: 1
      },
      1: {
        coords: [100, 100],
        yellow: 1,
        red: 0,
        black: 0,
        blue: 1
      },
      2: {
        coords: [100, 200],
        yellow: 1,
        red: 0,
        black: 0,
        blue: 1
      },
      3: {
        coords: [200, 200],
        yellow: 1,
        red: 1,
        black: 0,
        blue: 3
      },
      4: {
        coords: [150, 300],
        yellow: 0,
        red: 0,
        black: 0,
        blue: 0,
        station: true
      },
      5: {
        coords: [300, 200],
        yellow: 1,
        red: 1,
        black: 0,
        blue: 2
      },
      6: {
        coords: [300, 300],
        yellow: 1,
        red: 1,
        black: 0,
        blue: 1
      },
      7: {
        coords: [200, 300],
        yellow: 1,
        red: 1,
        black: 1,
        blue: 1
      },
      8: {
        coords: [400, 200],
        yellow: 1,
        red: 1,
        black: 1,
        blue: 1
      }
    }
  }
};

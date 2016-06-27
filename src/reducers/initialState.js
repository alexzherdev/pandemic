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
      name: 'Stephen',
      role: 'medic',
      specialEvent: null,
      hand: [
        { cardType: 'event', id: 'airlift' },
        { cardType: 'city', id: '0' },
        { cardType: 'city', id: '3' },
        { cardType: 'city', id: '2' },
        { cardType: 'city', id: '5' }
      ]
    },
    1: {
      id: '1',
      name: 'Rima',
      role: 'ops_expert',
      hand: [
        { cardType: 'event', id: 'res_pop' },
        { cardType: 'city', id: '4' },
        { cardType: 'city', id: '1' },
        { cardType: 'city', id: '6' },
        { cardType: 'city', id: '8' },
        { cardType: 'city', id: '7' }
      ]
    },
    2: {
      id: '2',
      name: 'Thomas',
      role: 'quar_spec',
      hand: [
        { cardType: 'city', id: '4' },
        { cardType: 'city', id: '0' },
        { cardType: 'city', id: '3' },
        { cardType: 'city', id: '2' },
        { cardType: 'city', id: '5' }
      ]
    },
    3: {
      id: '3',
      name: 'Paul',
      role: 'cont_planner',
      hand: [
        { cardType: 'city', id: '4' },
        { cardType: 'city', id: '0' },
        { cardType: 'city', id: '3' },
        { cardType: 'city', id: '2' },
        { cardType: 'city', id: '5' }
      ]
    }
  },

  diseases: {
    red: 'active',
    blue: 'active',
    yellow: 'cured',
    black: 'eradicated'
  },

  currentMove: {
    player: '0',
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
    resPop: {},
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
      [0, 1, 0, 1, 0, 0, 1, 0, 0],
      [1, 0, 1, 0, 0, 1, 0, 1, 1],
      [0, 1, 0, 1, 1, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 1, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 1, 1, 0]
    ],

    playersLocations: {
      0: '0',
      1: '0',
      2: '0',
      3: '0'
    },

    locations: {
      0: {
        coords: [335, 240],
        station: true,
        yellow: 2,
        red: 1,
        black: 0,
        blue: 1
      },
      1: {
        coords: [285, 225],
        yellow: 1,
        red: 0,
        black: 0,
        blue: 1
      },
      2: {
        coords: [280, 290],
        yellow: 1,
        red: 0,
        black: 0,
        blue: 1
      },
      3: {
        coords: [325, 315],
        yellow: 1,
        red: 1,
        black: 0,
        blue: 3
      },
      4: {
        coords: [295, 345],
        yellow: 0,
        red: 0,
        black: 0,
        blue: 0,
        station: true
      },
      5: {
        coords: [315, 145],
        yellow: 1,
        red: 1,
        black: 0,
        blue: 2
      },
      6: {
        coords: [370, 300],
        yellow: 1,
        red: 1,
        black: 0,
        blue: 1
      },
      7: {
        coords: [370, 145],
        yellow: 3,
        red: 3,
        black: 3,
        blue: 3
      },
      8: {
        coords: [405, 220],
        yellow: 1,
        red: 1,
        black: 1,
        blue: 1
      }
    }
  }
};

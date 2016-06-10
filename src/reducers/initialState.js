export default {
  status: 'playing',

  playerCards: {
    deck: [
      { cardType: 'city', id: '8' },
      { cardType: 'city', id: '6' },
      { cardType: 'epidemic', name: 'Epidemic' }
    ],
    discard: []
  },

  infectionCards: {
    deck: ['8', '7', '0', '5', '6', '1', '3'],
    discard: ['4', '2']
  },

  events: {
    forecast: {
      id: 'forecast',
      name: 'Forecast'
    },
    one_quiet_night: {
      id: 'one_quiet_night',
      name: 'One Quiet Night'
    },
    gov_grant: {
      id: 'gov_grant',
      name: 'Government Grant'
    },
    res_pop: {
      id: 'res_pop',
      name: 'Resilient Population'
    },
    airlift: {
      id: 'airlift',
      name: 'Airlift'
    }
  },

  players: {
    0: {
      id: '0',
      name: 'P1',
      role: 'scientist',
      hand: [
        { cardType: 'event', id: 'forecast' },
        { cardType: 'event', id: 'airlift' },
        { cardType: 'city', id: '0' },
        { cardType: 'city', id: '3' },
        { cardType: 'city', id: '2' },
        { cardType: 'city', id: '5' },
        { cardType: 'city', id: '1' }
      ]
    },
    1: {
      id: '1',
      name: 'P2',
      hand: [
        { cardType: 'city', id: '4' }
      ]
    }
  },

  cities: {
    0: {
      id: '0',
      name: 'Atlanta',
      color: 'red'
    },
    1: {
      id: '1',
      name: 'Chicago',
      color: 'yellow'
    },
    2: {
      id: '2',
      name: 'Montreal',
      color: 'black'
    },
    3: {
      id: '3',
      name: 'Washington',
      color: 'blue'
    },
    4: {
      id: '4',
      name: 'New York',
      color: 'blue'
    },
    5: {
      id: '5',
      name: 'San Francisco',
      color: 'red'
    },
    6: {
      id: '6',
      name: 'Miami',
      color: 'red'
    },
    7: {
      id: '7',
      name: 'Los Angeles',
      color: 'yellow'
    },
    8: {
      id: '8',
      name: 'Mexico City',
      color: 'yellow'
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
    playerOverHandLimit: null,
    curingDisease: {},
    skipInfectionsStep: false,
    govGrantCities: [],
    resPopChooseCard: false,
    resPopSuggestOwner: null,
    forecastCards: [],
    airlift: {}
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
      1: '1'
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

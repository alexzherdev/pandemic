export default {
  status: 'playing',

  playerCards: {
    deck: [
      { cardType: 'city', id: '1' },
      { cardType: 'city', id: '8' },
      { cardType: 'city', id: '6' }, { cardType: 'city', id: '7' },
      { cardType: 'city', id: '0' }

      // { cardType: 'epidemic', name: 'Epidemic' },
      // { cardType: 'event', id: '0' },
    ],
    discard: []
  },

  infectionCards: {
    deck: ['1', '0', '3', '5', '6', '7', '8'],
    discard: ['4', '2']
  },

  players: {
    0: {
      id: '0',
      name: 'Name',
      hand: [
        { cardType: 'city', id: '3' }, { cardType: 'city', id: '4' },
        { cardType: 'city', id: '2' }, { cardType: 'city', id: '5' },

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
    availableCities: {},
    actionsLeft: 4,
    cardsDrawn: [],
    outbreak: {
      color: null,
      complete: [],
      pending: []
    },
    playerOverHandLimit: null
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
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 0],
      [0, 1, 0, 1, 1],
      [1, 0, 1, 0, 1],
      [0, 0, 1, 1, 0]
    ],

    playersLocations: {
      0: '0'
    },

    locations: {
      0: {
        coords: [200, 100],
        station: true,
        yellow: 1,
        red: 3,
        black: 0,
        blue: 0
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
        blue: 0
      },
      3: {
        coords: [200, 200],
        yellow: 1,
        red: 1,
        black: 1,
        blue: 1
      },
      4: {
        coords: [150, 300],
        yellow: 0,
        red: 0,
        black: 0,
        blue: 3,
        station: true
      },
      5: {
        coords: [300, 200],
        yellow: 1,
        red: 1,
        black: 1,
        blue: 1
      },
      6: {
        coords: [300, 300],
        yellow: 1,
        red: 1,
        black: 1,
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

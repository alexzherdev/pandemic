export default {
  status: 'playing',
  players: {
    0: {
      id: '0',
      name: 'Name',
      hand: [
        { cardType: 'city', id: '3' }, { cardType: 'city', id: '4' },
        { cardType: 'city', id: '2' }
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
    }
  },

  diseases: {
    red: 'active',
    blue: 'active',
    yellow: 'cured',
    black: 'eradicated'
  },

  currentMove: {
    availableCities: []
  },

  stationsLeft: 5,

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
        blue: 0,
        station: true
      }
    }
  }
};

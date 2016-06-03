export default {
  players: {
    0: {
      id: '0',
      name: 'Name',
      hand: [
        { cardType: 'city', id: '2' }, { cardType: 'city', id: '3' }
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

  currentMove: {
    availableCities: []
  },

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
        station: true
      },
      1: {
        coords: [100, 100]
      },
      2: {
        coords: [100, 200]
      },
      3: {
        coords: [200, 200]
      },
      4: {
        coords: [150, 300],
        station: true
      }
    }
  }
};

export default {
  players: {
    0: {
      id: 0,
      name: 'Name',
      hand: [
        { type: 'city', id: 2 }, { type: 'city', id: 3 }
      ]
    }
  },

  cities: {
    0: {
      name: 'Atlanta'
    },
    1: {
      name: 'Chicago'
    },
    2: {
      name: 'Montreal'
    },
    3: {
      name: 'Washington'
    }
  },

  map: {
    matrix: [
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
      [1, 0, 1, 0]
    ],

    players: {
      0: 0
    },

    locations: {
      0: [200, 100],
      1: [100, 100],
      2: [100, 200],
      3: [200, 200]
    }
  }
};

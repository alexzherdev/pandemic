import EVENTS from './events';


export const PLAYER_DECK = Object.freeze([
  ...Array(48).fill().map((_, i) => ({
    cardType: 'city',
    id: i + ''
  })),
  ...Object.keys(EVENTS).map((ev) => ({
    cardType: 'event',
    id: ev
  }))
]);

export const INFECTION_DECK = Object.freeze(
  Array(48).fill().map((_, i) => i + '')
);

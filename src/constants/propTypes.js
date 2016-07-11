import { PropTypes } from 'react';

import DISEASES from './diseases';
import ROLES from './roles';


export const locationType = PropTypes.shape({
  coords: PropTypes.arrayOf(PropTypes.number).isRequired,
  yellow: PropTypes.number.isRequired,
  blue: PropTypes.number.isRequired,
  red: PropTypes.number.isRequired,
  black: PropTypes.number.isRequired
});

export const pathType = PropTypes.arrayOf(
  PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
);

export const diseaseType = PropTypes.oneOf(DISEASES);

export const cardProps = {
  cardType: PropTypes.oneOf(['city', 'event', 'epidemic']).isRequired,
  id: PropTypes.string.isRequired
};

export const cardType = PropTypes.shape(cardProps);

export const eventCardType = PropTypes.shape({
  ...cardProps,
  name: PropTypes.string.isRequired,
  playerId: PropTypes.string.isRequired
});

export const playerProps = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.oneOf(Object.keys(ROLES)).isRequired
};

export const playerType = PropTypes.shape(playerProps);

export const cityProps = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: diseaseType.isRequired
};

export const cityType = PropTypes.shape(cityProps);

export const viewCoordsType = PropTypes.shape({
  left: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired
});

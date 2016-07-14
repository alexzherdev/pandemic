import React from 'react';
import { Glyphicon } from 'react-bootstrap';

import { cardType } from '../../constants/propTypes';


const PlayerCardCity = ({ card }) =>
  <span>
    <Glyphicon glyph="stop" style={{color: card.color}} />&nbsp;
    {card.name}
  </span>;

PlayerCardCity.propTypes = {
  card: cardType.isRequired
};

export default PlayerCardCity;

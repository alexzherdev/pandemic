import React, { PropTypes } from 'react';
import { ListGroup } from 'react-bootstrap';

import PlayerCard from './teamPanel/PlayerCard';
import { cardType } from '../constants/propTypes';


const CardList = ({ cards }) =>
  <ListGroup fill className="card-list">
    {cards.map((c, i) =>
      <PlayerCard
        key={i}
        card={c}
        popoverPlacement="right" />
    )}
  </ListGroup>;

CardList.propTypes = {
  cards: PropTypes.arrayOf(cardType.isRequired).isRequired
};

export default CardList;

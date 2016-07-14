import React from 'react';
import { ListGroupItem } from 'react-bootstrap';

import PlayerCardCity from './PlayerCardCity';
import PlayerCardEvent from './PlayerCardEvent';
import { cardType } from '../../constants/propTypes';


const PlayerCard = ({ card }) => {
  const CardView = card.cardType === 'city' ? PlayerCardCity : PlayerCardEvent;
  return (
    <ListGroupItem key={`${card.cardType}-${card.id}`}>
      <span className={card.cardType}>
        <CardView card={card} />
      </span>
    </ListGroupItem>
  );
};

PlayerCard.propTypes = {
  card: cardType.isRequired
};

export default PlayerCard;

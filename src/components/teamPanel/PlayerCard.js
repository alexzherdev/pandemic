import React, { PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';

import PlayerCardCity from './PlayerCardCity';
import PlayerCardEvent from './PlayerCardEvent';
import PlayerCardEpidemic from './PlayerCardEpidemic';
import { cardType } from '../../constants/propTypes';


const PlayerCard = ({ card, popoverPlacement }) => {
  let CardView;
  switch (card.cardType) {
    case 'city':
      CardView = PlayerCardCity;
      break;
    case 'event':
      CardView = PlayerCardEvent;
      break;
    default:
      CardView = PlayerCardEpidemic;
      break;
  }
  const viewProps = card.cardType === 'event' ? { popoverPlacement } : {};
  return (
    <ListGroupItem key={`${card.cardType}-${card.id}`}>
      <span className={card.cardType}>
        <CardView card={card} {...viewProps} />
      </span>
    </ListGroupItem>
  );
};

PlayerCard.propTypes = {
  card: cardType.isRequired,
  popoverPlacement: PropTypes.string
};

export default PlayerCard;

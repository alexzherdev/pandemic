import React from 'react';
import { Glyphicon, OverlayTrigger, Popover } from 'react-bootstrap';

import EVENTS from '../../constants/events';
import { cardType } from '../../constants/propTypes';


const PlayerCardEvent = ({ card }) =>
  <span>
    <Glyphicon glyph="gift" />&nbsp;
    <OverlayTrigger
      id={`event-${card.id}`}
      trigger={['hover', 'focus']}
      placement="left"
      overlay={
        <Popover id={`event-desc-${card.id}`}>
          {EVENTS[card.id].description || 'bar'}
        </Popover>
      }>
      <span className="event-name">{card.name}</span>
    </OverlayTrigger>
  </span>;

PlayerCardEvent.propTypes = {
  card: cardType.isRequired
};

export default PlayerCardEvent;

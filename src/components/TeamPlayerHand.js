import React, { PropTypes } from 'react';
import { Panel, Glyphicon, ListGroup, ListGroupItem, OverlayTrigger, Popover } from 'react-bootstrap';

import ROLES from '../constants/roles';
import EVENTS from '../constants/events';
import { playerType, cardType } from '../constants/propTypes';


const TeamPlayerHand = ({ player, hand, isCurrent }) => {
  return (
    <Panel
      header={
        <div>
          <h5>{isCurrent && <Glyphicon glyph="triangle-right" />}{player.name}</h5>
          <OverlayTrigger
            id={`role-${player.role}`}
            trigger={['hover', 'focus']}
            placement="left"
            overlay={
              <Popover id={`role-desc-${player.role}`}>
                {ROLES[player.role].description.map((str) => [str, <br key={player.role} />])}
              </Popover>
            }>
            <h6>{ROLES[player.role].name}</h6>
          </OverlayTrigger>
        </div>
      }
      className={`team-player team-player-${player.role}`}>
      <ListGroup fill>
        {hand.map((c) =>
          <ListGroupItem key={`${c.cardType}-${c.id}`}>
            <span className={c.cardType}>
              {c.cardType === 'city' && <Glyphicon glyph="stop" style={{color: c.color}} />}
              {c.cardType === 'event' && <Glyphicon glyph="gift" />}
              &nbsp;
              {c.cardType === 'event' &&
                <OverlayTrigger
                  id={`event-${c.id}`}
                  trigger={['hover', 'focus']}
                  placement="left"
                  overlay={
                    <Popover id={`event-desc-${c.id}`}>
                      {EVENTS[c.id].description || 'bar'}
                    </Popover>
                  }>
                  <span className="event-name">{c.name}</span>
                </OverlayTrigger>
              }
              {c.cardType === 'city' && c.name}
            </span>
          </ListGroupItem>
        )}
      </ListGroup>
    </Panel>
  );
};

TeamPlayerHand.propTypes = {
  player: playerType.isRequired,
  hand: PropTypes.arrayOf(cardType.isRequired).isRequired,
  isCurrent: PropTypes.bool.isRequired
};

export default TeamPlayerHand;

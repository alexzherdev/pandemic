import React from 'react';
import { Panel, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';

import roles from '../constants/roles';


const TeamPlayerHand = ({ player, hand, isCurrent }) => {
  return (
    <Panel
      header={
        <div>
          <h5>{isCurrent && <Glyphicon glyph="triangle-right" />}{player.name}</h5>
          <h6>{roles[player.role].name}</h6>
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
              {c.name}
            </span>
          </ListGroupItem>
        )}
      </ListGroup>
    </Panel>
  );
};

export default TeamPlayerHand;

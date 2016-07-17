import React, { PropTypes } from 'react';
import { Panel, ListGroup } from 'react-bootstrap';

import TeamPlayerHandHeader from './TeamPlayerHandHeader';
import PlayerCard from './PlayerCard';
import { playerType, cardType } from '../../constants/propTypes';


const TeamPlayerHand = ({ player, hand, isCurrent }) => {
  return (
    <Panel
      header={
        <TeamPlayerHandHeader
          player={player}
          isCurrent={isCurrent} />
      }
      className={`team-player team-player-${player.role}`}>
      <ListGroup fill className="card-list">
        {hand.map((c, i) =>
          <PlayerCard
            key={i}
            card={c}
            popoverPlacement="left" />
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

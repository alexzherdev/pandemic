import React, { PropTypes } from 'react';
import { Panel } from 'react-bootstrap';

import TeamPlayerHand from '../components/TeamPlayerHand';
import { playerType } from '../constants/propTypes';


const TeamPanel = ({ players, getPlayerHand, currentPlayerId }) =>
  <Panel className="team-panel">
    {players.map((p) =>
      <TeamPlayerHand
        key={p.id}
        player={p}
        hand={getPlayerHand(p.id)}
        isCurrent={currentPlayerId === p.id} />
    )}
  </Panel>;

TeamPanel.propTypes = {
  players: PropTypes.arrayOf(playerType.isRequired).isRequired,
  getPlayerHand: PropTypes.func.isRequired,
  currentPlayerId: PropTypes.string.isRequired
};

export default TeamPanel;

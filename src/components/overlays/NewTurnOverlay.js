import React from 'react';

import { playerType } from '../../constants/propTypes';


const NewTurnOverlay = ({ player }) =>
  <div className="overlay new-turn-overlay">
    <div className={`banner banner-${player.role}`}>
      <div className="text">
        {player.name}'s turn
      </div>
    </div>
  </div>;

NewTurnOverlay.propTypes = {
  player: playerType.isRequired
};

export default NewTurnOverlay;

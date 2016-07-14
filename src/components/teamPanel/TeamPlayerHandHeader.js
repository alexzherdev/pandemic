import React, { PropTypes } from 'react';
import { Glyphicon, OverlayTrigger, Popover } from 'react-bootstrap';

import ROLES from '../../constants/roles';
import { playerType } from '../../constants/propTypes';


const TeamPlayerHandHeader = ({ player, isCurrent }) =>
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
  </div>;

TeamPlayerHandHeader.propTypes = {
  player: playerType.isRequired,
  isCurrent: PropTypes.bool.isRequired
};

export default TeamPlayerHandHeader;

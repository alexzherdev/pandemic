import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

import ROLES from '../constants/roles';
import { playerType } from '../constants/propTypes';


const IntroDialog = ({ players, onClosed, container }) =>
  <Modal.Dialog
    bsSize={players.length > 4 ? 'large' : undefined}
    container={container}
    className="intro-dialog">
    <Modal.Header>
      Fighting to save the humanity today:
    </Modal.Header>
    <Modal.Body>
      <div className="intro-players">
        {players.map((pl) =>
          <div key={pl.id}>
            <div className="player-name">{pl.name}</div>
            <div>{ROLES[pl.role].name}</div>
          </div>
        )}
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button
        bsStyle="primary"
        onClick={onClosed}>Start</Button>
    </Modal.Footer>
  </Modal.Dialog>;

IntroDialog.propTypes = {
  players: PropTypes.arrayOf(playerType.isRequired).isRequired,
  onClosed: PropTypes.func.isRequired
};

export default IntroDialog;

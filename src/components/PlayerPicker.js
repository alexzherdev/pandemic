import React, { PropTypes } from 'react';
import { Button, Panel } from 'react-bootstrap';
import { partial } from 'lodash';

import { playerProps } from '../constants/propTypes';


const PlayerPicker = ({ title, players, onPlayerPicked, onCancel }) =>
  <Panel
    header={title}
    className="player-picker">
    {players.map((o) =>
      <Button id={o.id} key={o.id} onClick={partial(onPlayerPicked, o.id, o.share)}>{o.name}</Button>
    )}
    <Button onClick={onCancel}>Cancel</Button>
  </Panel>;

PlayerPicker.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      ...playerProps,
      share: PropTypes.string
    }).isRequired
  ).isRequired,
  onPlayerPicked: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default PlayerPicker;

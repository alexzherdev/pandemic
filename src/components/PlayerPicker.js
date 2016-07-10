import React from 'react';
import { Button, Panel } from 'react-bootstrap';
import { partial } from 'lodash';

const PlayerPicker = ({ title, players, onPlayerPicked, onCancel }) =>
  <Panel
    header={title}
    className="player-picker">
    {players.map((o) =>
      <Button id={o.id} key={o.id} onClick={partial(onPlayerPicked, o.id, o.share)}>{o.name}</Button>
    )}
    <Button onClick={onCancel}>Cancel</Button>
  </Panel>;

export default PlayerPicker;

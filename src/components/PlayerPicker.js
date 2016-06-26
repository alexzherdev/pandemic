import React from 'react';
import { Button } from 'react-bootstrap';
import { partial } from 'lodash';

const PlayerPicker = ({ players, onPlayerPicked, onCancel }) =>
  <div>
    {players.map((o) =>
      <Button id={o.id} key={o.id} onClick={partial(onPlayerPicked, o.id, o.share)}>{o.name}</Button>
    )}
    <Button onClick={onCancel}>Cancel</Button>
  </div>;

export default PlayerPicker;

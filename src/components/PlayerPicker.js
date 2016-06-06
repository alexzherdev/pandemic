import React from 'react';
import { partial } from 'lodash';

const PlayerPicker = ({ players, onPlayerPicked, onCancel }) =>
  <div>
    {players.map((o) =>
      <button key={o.id} onClick={partial(onPlayerPicked, o.id, o.share)}>{o.name}</button>
    )}
    <button onClick={onCancel}>Cancel</button>
  </div>;

export default PlayerPicker;

import React from 'react';
import { map, partial } from 'lodash';

const MoveCityPicker = ({ availableCities, playerId, currentCityId, moveToCity, moveCancel }) =>
  <div>
    {map(availableCities, (o, id) =>
      <button key={id} onClick={partial(moveToCity, playerId, currentCityId, id, o.source)}>{o.name}</button>
    )}
    <button onClick={moveCancel}>Cancel</button>
  </div>;

export default MoveCityPicker;

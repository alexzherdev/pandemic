import React from 'react';
import { map, partial } from 'lodash';

const MoveCityPicker = ({ availableCities, currentCityId, moveToCity, moveCancel }) => {
  return (
    <div>
      {map(availableCities, (o, id) =>
        <button key={id} onClick={partial(moveToCity, 0, currentCityId, id, o.source)}>{o.name}</button>
      )}
      <button onClick={moveCancel}>Cancel</button>
    </div>
  );
};

export default MoveCityPicker;
